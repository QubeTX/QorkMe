#!/usr/bin/env node
/**
 * Pre-push documentation gate (Claude Code PreToolUse hook).
 *
 * Purpose: before a push to `main`, make agents double-check the docs. If the
 * commits about to be pushed change code/docs but DON'T touch a changelog, the
 * push is blocked with a reminder to update CHANGELOG.md + HUMAN_CHANGELOG.md and
 * to re-verify public/llms.txt, the README(s), and CLAUDE.md.
 *
 * Wiring: registered in .claude/settings.json against the Bash and PowerShell
 * tools (exec form: `node ${CLAUDE_PROJECT_DIR}/.claude/hooks/gate-push.mjs`).
 * It runs before EVERY Bash/PowerShell command, so it early-exits cheaply for
 * anything that isn't a `git push`.
 *
 * Contract:
 *   - stdin: JSON { tool_name, tool_input: { command }, cwd, ... }
 *   - allow:  exit 0 with no stdout
 *   - block:  exit 0 with { hookSpecificOutput: { hookEventName, permissionDecision:'deny', permissionDecisionReason } }
 *
 * Design rules:
 *   - FAIL OPEN. Any error/uncertainty → allow. This is a helpful guardrail, not
 *     a security boundary; it must never wedge legitimate work.
 *   - Only gate pushes that target `main`, in a repo that actually HAS a changelog.
 *   - Escape hatch: set QORK_SKIP_DOC_GATE=1 to bypass for an intentional push.
 */

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const ALLOW = () => process.exit(0);

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    })
  );
  process.exit(0);
}

/** Run git in `cwd`, returning trimmed stdout or null on any failure. */
function git(cwd, args) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

/** Minimal shell tokenizer that respects single/double quotes. */
function tokenize(cmd) {
  const out = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(cmd)) !== null) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

try {
  const raw = readFileSync(0, 'utf8');
  if (!raw.trim()) ALLOW();
  const input = JSON.parse(raw);
  const command = input?.tool_input?.command;
  if (typeof command !== 'string' || !command) ALLOW();

  // Cheap early-out: only care about `git push`.
  if (!/\bgit\b/.test(command) || !/\bpush\b/.test(command)) ALLOW();

  // Honor the explicit escape hatch.
  const skip = (process.env.QORK_SKIP_DOC_GATE || '').toLowerCase();
  if (skip === '1' || skip === 'true' || skip === 'yes') ALLOW();

  const tokens = tokenize(command);

  // Resolve the repo dir: `git -C <path>` wins, else the tool's cwd, else project root.
  let repoDir = input?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const cIdx = tokens.indexOf('-C');
  if (cIdx !== -1 && tokens[cIdx + 1]) repoDir = tokens[cIdx + 1];

  // This hook only enforces where a changelog exists to update.
  const tracked = git(repoDir, ['ls-files', 'CHANGELOG.md', 'qorkme/CHANGELOG.md']);
  if (!tracked) ALLOW();

  // Does this push target `main`? Look at explicit refspecs first.
  const pushIdx = tokens.findIndex((t) => t === 'push');
  const afterPush = pushIdx === -1 ? [] : tokens.slice(pushIdx + 1).filter((t) => !t.startsWith('-'));
  const refTokens = afterPush.slice(1); // drop the remote (e.g. "origin")
  const mentionsMain = (t) =>
    t === 'main' || /(^|:)(refs\/heads\/)?main$/.test(t);
  let targetsMain = refTokens.some(mentionsMain);
  let explicitNonMain = refTokens.length > 0 && !targetsMain;

  if (!targetsMain && !explicitNonMain) {
    // No explicit refspec — infer from the current branch / its upstream.
    const branch = git(repoDir, ['rev-parse', '--abbrev-ref', 'HEAD']);
    const upstream = git(repoDir, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
    if (branch === 'main') targetsMain = true;
    if (upstream && /\/main$/.test(upstream)) targetsMain = true;
  }
  if (!targetsMain) ALLOW();

  // Figure out which commits would be pushed, and which files they touch.
  let range = null;
  if (git(repoDir, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}'])) {
    range = '@{u}..HEAD';
  } else if (git(repoDir, ['rev-parse', '--verify', '--quiet', 'origin/main'])) {
    range = 'origin/main..HEAD';
  }
  if (!range) ALLOW(); // can't determine what's being pushed → fail open

  const diff = git(repoDir, ['diff', '--name-only', range]);
  if (diff === null) ALLOW();
  const files = diff.split('\n').map((f) => f.trim()).filter(Boolean);
  if (files.length === 0) ALLOW(); // nothing new to push

  const isChangelog = (f) => /(^|\/)(HUMAN_)?CHANGELOG\.md$/i.test(f);
  if (files.some(isChangelog)) ALLOW(); // a changelog was updated — good

  // Substantive push to main with no changelog touch → block with a checklist.
  const preview = files.slice(0, 8).join(', ') + (files.length > 8 ? `, … (+${files.length - 8} more)` : '');
  deny(
    `Pre-push doc gate: this push to main has ${files.length} changed file(s) (${preview}) but no changelog update.\n` +
      `Before pushing to main, update the changelog AND its plain-English companion in the same commit:\n` +
      `  • CHANGELOG.md  +  HUMAN_CHANGELOG.md  (repo root)\n` +
      `  • qorkme/CHANGELOG.md  +  qorkme/HUMAN_CHANGELOG.md  (if app code/docs changed)\n` +
      `Then double-check these are still accurate for what you changed:\n` +
      `  • qorkme/public/llms.txt   • README.md / qorkme/README.md   • CLAUDE.md / qorkme/CLAUDE.md\n` +
      `Commit those updates, then push again. (Intentional exception? Re-run with QORK_SKIP_DOC_GATE=1.)`
  );
} catch {
  // Never let a hook bug block a push.
  ALLOW();
}
