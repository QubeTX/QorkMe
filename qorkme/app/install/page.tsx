import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { SiteFooter } from '@/components/SiteFooter';
import LabelPill from '@/components/ui/LabelPill';
import SectionHeading from '@/components/ui/SectionHeading';
import TextLink from '@/components/ui/TextLink';
import InstallBlock from '@/components/terminal/InstallBlock';
import TerminalFrame from '@/components/terminal/TerminalFrame';
import CommandTable from '@/components/terminal/CommandTable';
import DownloadCard from '@/components/terminal/DownloadCard';
import LatestVersion from './LatestVersion';
import styles from './install.module.css';

export const metadata: Metadata = {
  title: 'Install qork — QorkMe CLI',
  description:
    'Install the qork command-line URL shortener for macOS, Linux, and Windows, and use the qork.me API.',
};

const RELEASE_BASE = 'https://github.com/QubeTX/qork/releases/latest/download/';

const DOWNLOADS: { name: string; file: string }[] = [
  { name: 'macOS · Apple Silicon', file: 'qork-aarch64-apple-darwin.tar.xz' },
  { name: 'macOS · Intel', file: 'qork-x86_64-apple-darwin.tar.xz' },
  { name: 'Linux · x86_64', file: 'qork-x86_64-unknown-linux-gnu.tar.xz' },
  { name: 'Linux · ARM64', file: 'qork-aarch64-unknown-linux-gnu.tar.xz' },
  { name: 'Linux · x86_64 (musl)', file: 'qork-x86_64-unknown-linux-musl.tar.xz' },
  { name: 'Windows · x86_64', file: 'qork-x86_64-pc-windows-msvc.msi' },
];

export default function InstallPage() {
  return (
    <div className={`font-makira ${styles.page}`}>
      <PageHeader right={<span>QORK // CLI</span>} />

      <main className={styles.main}>
        {/* ---- Hero ---- */}
        <section className={styles.shell}>
          <div className={styles.hero}>
            <div className={styles.eyebrowRow}>
              <LabelPill variant="bar">qork // command-line client</LabelPill>
              <LatestVersion className={styles.versionBadge} />
            </div>

            <h1 className={styles.wordmark}>
              <span className={styles.gradientWord}>qork</span>
            </h1>

            <p className={styles.lede}>
              <span className={styles.ledeAccent} aria-hidden="true">
                $
              </span>
              Shorten URLs from your terminal.
            </p>
          </div>
        </section>

        {/* ---- Install ---- */}
        <section className={styles.shell}>
          <div className={styles.section}>
            <SectionHeading
              label="01 // Install"
              title="One line, any platform"
              subtitle="No account required. The installer drops a single static binary on your PATH."
            />
            <InstallBlock
              title="Install"
              targets={[
                {
                  id: 'unix',
                  label: 'macOS / Linux',
                  command: 'curl -LsSf https://qork.me/install.sh | sh',
                  note: 'Installs to ~/.cargo/bin — no admin required.',
                },
                {
                  id: 'windows',
                  label: 'Windows',
                  command: 'irm https://qork.me/install.ps1 | iex',
                  note: 'PowerShell. Installs to %USERPROFILE%\\.cargo\\bin.',
                },
                {
                  id: 'cargo',
                  label: 'Cargo',
                  command: 'cargo install qork',
                  note: 'If you have a Rust toolchain.',
                },
              ]}
            />
          </div>
        </section>

        {/* ---- Usage ---- */}
        <section className={styles.shell}>
          <div className={styles.section}>
            <SectionHeading
              label="02 // Usage"
              title="Pass a URL, get a link"
              subtitle="qork prints the short URL to stdout — pipe it, copy it, script it."
            />
            <div className={styles.stack}>
              <TerminalFrame
                title="QORK // SAMPLE SESSION"
                meta="SHELL: ~"
                lines={[
                  { text: 'qork https://example.com/some/very/long/path', prompt: true },
                  { text: 'https://qork.me/ka9m', accent: true },
                  { text: 'qork "https://example.com/a b?x=1&y=2"', prompt: true },
                  { text: 'https://qork.me/pu3n', accent: true },
                  { text: 'qork https://example.com --alias launch', prompt: true },
                  { text: 'https://qork.me/launch', accent: true },
                  { text: 'qork --json https://example.com', prompt: true },
                  { text: '{ "shortUrl": "qork.me/ka9m", "isNew": true }', accent: true },
                ]}
              />
              <p className={styles.prose}>
                Quote URLs that contain spaces or shell metacharacters (<code>&amp;</code>,{' '}
                <code>?</code>) so your shell hands the whole string to qork intact.
              </p>
              <CommandTable
                headers={['Command', 'Description']}
                rows={[
                  { command: 'qork <url>', description: 'Shorten a URL; prints the short link' },
                  { command: 'qork <url> --alias <name>', description: 'Use a custom short code' },
                  {
                    command: 'qork <url> --json',
                    description: 'Print the raw JSON (scripts/agents)',
                  },
                  { command: 'qork update', description: 'Update to the latest release' },
                  { command: 'qork uninstall', description: 'Remove qork' },
                  { command: 'qork --version', description: 'Print the version' },
                ]}
                footnote="Run qork --help for the full command reference."
              />
            </div>
          </div>
        </section>

        {/* ---- Manual downloads ---- */}
        <section className={styles.shell}>
          <div className={styles.section}>
            <SectionHeading
              label="03 // Downloads"
              title="Manual install"
              subtitle="Prefer to grab the binary yourself? Pick your platform — each archive is a single executable."
            />
            <div className={styles.stack}>
              <div className={styles.downloads}>
                {DOWNLOADS.map(({ name, file }) => (
                  <DownloadCard
                    key={file}
                    name={name}
                    meta={file}
                    href={`${RELEASE_BASE}${file}`}
                    downloadName={file}
                    cta="Download"
                  />
                ))}
              </div>
              <div className={styles.linkRow}>
                <TextLink href="https://github.com/QubeTX/qork/releases/latest" glyph="↗">
                  All release assets
                </TextLink>
                <TextLink href="https://crates.io/crates/qork" glyph="↗">
                  crates.io / qork
                </TextLink>
              </div>
            </div>
          </div>
        </section>

        {/* ---- For agents / API ---- */}
        <section className={styles.shell}>
          <div className={styles.section}>
            <SectionHeading
              label="04 // API"
              title="For agents"
              subtitle="The same shortener behind a plain HTTP endpoint — no key, no SDK."
            />
            <div className={styles.stack}>
              <p className={styles.prose}>
                Both <code>GET</code> and <code>POST</code> hit{' '}
                <code>https://qork.me/api/shorten</code> and return the same JSON. Ideal for
                pipelines and autonomous agents that need a clean link.
              </p>
              <TerminalFrame
                title="QORK // API"
                meta="POST · GET"
                bootPrint={false}
                lines={[
                  { text: '# GET', accent: true },
                  {
                    text: 'curl "https://qork.me/api/shorten?url=https%3A%2F%2Fexample.com"',
                    prompt: true,
                  },
                  { text: '# POST', accent: true },
                  {
                    text: 'curl -X POST https://qork.me/api/shorten \\',
                    prompt: true,
                  },
                  { text: '  -H "Content-Type: application/json" \\' },
                  { text: '  -d \'{"url":"https://example.com","source":"api"}\'' },
                ]}
              />
              <div>
                <p className={styles.responseLabel}>Response</p>
                <pre className={styles.response}>
                  {`{
  "shortCode": "ka9m",
  "shortUrl": "qork.me/ka9m",
  "href": "https://qork.me/ka9m",
  "longUrl": "https://example.com",
  "isNew": true
}`}
                </pre>
              </div>
              <p className={styles.prose}>
                Full agent guide:{' '}
                <TextLink href="https://qork.me/llms.txt" glyph="↗">
                  qork.me/llms.txt
                </TextLink>
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
