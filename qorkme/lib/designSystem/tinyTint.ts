/**
 * tinyTint — a deliberately small, deterministic code tinter for the
 * design-system page's CodeBlocks. Pure function, unit-tested, zero
 * dependencies; NOT a real parser. It only needs to make short recipe
 * snippets readable in the house palette, so it tokenizes line by line
 * with ordered regexes and never throws on weird input.
 */

export type TintKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'number'
  | 'fn'
  | 'prop'
  | 'selector'
  | 'cssvar'
  | 'prompt'
  | 'flag';

export type TintToken = { text: string; kind: TintKind };

export type TintLang = 'ts' | 'tsx' | 'css' | 'bash' | 'text';

const TS_KEYWORDS = new RegExp(
  '\\b(?:import|export|from|const|let|var|function|return|if|else|for|while|new|type|interface|extends|' +
    'implements|class|async|await|default|null|undefined|true|false|typeof|keyof|as|in|of|switch|case|break|continue|throw|try|catch|finally)\\b'
);

type Rule = { kind: TintKind; re: RegExp };

const RULES: Record<Exclude<TintLang, 'text' | 'tsx'>, Rule[]> = {
  ts: [
    { kind: 'comment', re: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
    { kind: 'string', re: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/ },
    { kind: 'keyword', re: TS_KEYWORDS },
    { kind: 'number', re: /\b\d+(?:\.\d+)?\b/ },
    { kind: 'fn', re: /\b[a-zA-Z_$][\w$]*(?=\s*\()/ },
  ],
  css: [
    { kind: 'comment', re: /\/\*[\s\S]*?\*\// },
    { kind: 'string', re: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/ },
    { kind: 'cssvar', re: /--[\w-]+/ },
    { kind: 'selector', re: /^[^\n{}]+(?=\s*\{)/m },
    { kind: 'prop', re: /[\w-]+(?=\s*:)/ },
    { kind: 'number', re: /#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|em|ms|s|vw|vh|ch|%)?\b/ },
  ],
  bash: [
    { kind: 'comment', re: /#[^\n]*/ },
    { kind: 'string', re: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/ },
    { kind: 'prompt', re: /^\$(?=\s)/m },
    { kind: 'flag', re: /(?<=\s)--?[\w-]+/ },
  ],
};

/**
 * Tokenize by repeatedly taking the EARLIEST match among the language's
 * rules (first rule wins ties), emitting plain text between matches.
 */
export function tint(code: string, lang: TintLang = 'text'): TintToken[] {
  const normalized = lang === 'tsx' ? 'ts' : lang;
  if (normalized === 'text') return code ? [{ text: code, kind: 'plain' }] : [];
  const rules = RULES[normalized];

  const tokens: TintToken[] = [];
  let rest = code;
  while (rest.length > 0) {
    let bestIndex = -1;
    let bestLen = 0;
    let bestKind: TintKind = 'plain';
    for (const { kind, re } of rules) {
      const m = re.exec(rest);
      if (!m || m[0].length === 0) continue;
      if (bestIndex === -1 || m.index < bestIndex) {
        bestIndex = m.index;
        bestLen = m[0].length;
        bestKind = kind;
      }
    }
    if (bestIndex === -1) {
      tokens.push({ text: rest, kind: 'plain' });
      break;
    }
    if (bestIndex > 0) tokens.push({ text: rest.slice(0, bestIndex), kind: 'plain' });
    tokens.push({ text: rest.slice(bestIndex, bestIndex + bestLen), kind: bestKind });
    rest = rest.slice(bestIndex + bestLen);
  }
  return tokens;
}
