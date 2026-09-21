import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { BrandStage } from '@/components/brand/BrandStage';
import TextLink from '@/components/ui/TextLink';
import InstallBlock from '@/components/terminal/InstallBlock';
import TerminalFrame from '@/components/terminal/TerminalFrame';
import CommandTable from '@/components/terminal/CommandTable';
import DownloadCard from '@/components/terminal/DownloadCard';
import LatestVersion from './LatestVersion';
import WindowsInstallers from './WindowsInstallers';
import styles from './install.module.css';

export const metadata: Metadata = {
  title: 'Install qork — QorkMe CLI',
  description:
    'Install the qork command-line URL shortener for macOS, Linux, and Windows, and use the qork.me API.',
};

const RELEASE_BASE = 'https://github.com/QubeTX/qork/releases/latest/download/';

type Installer = { name: string; file: string; description: string };

// Windows — installers are the recommended path here. Global = per-machine
// (admin); Corporate = per-user (no admin). Each comes as an MSI and an EXE.
const WINDOWS_INSTALLERS: Installer[] = [
  {
    name: 'All users · MSI',
    file: 'qork-x86_64-pc-windows-msvc.msi',
    description: 'Installs for everyone on this PC. Requires administrator access.',
  },
  {
    name: 'All users · EXE',
    file: 'qork-x86_64-pc-windows-msvc-setup.exe',
    description: 'Setup wizard for everyone on this PC. Requires administrator access.',
  },
  {
    name: 'Just me · MSI',
    file: 'qork-x86_64-pc-windows-msvc-corporate.msi',
    description: 'Installs for your account. No administrator access needed.',
  },
  {
    name: 'Just me · EXE',
    file: 'qork-x86_64-pc-windows-msvc-corporate-setup.exe',
    description: 'Setup wizard for your account. No administrator access needed.',
  },
];

const MACOS_INSTALLERS: Installer[] = [
  {
    name: 'Apple Silicon (M1+)',
    file: 'qork-aarch64-apple-darwin.pkg',
    description: 'Unsigned .pkg — first run: right-click → Open.',
  },
  {
    name: 'Intel',
    file: 'qork-x86_64-apple-darwin.pkg',
    description: 'Unsigned .pkg — first run: right-click → Open.',
  },
];

const LINUX_INSTALLERS: Installer[] = [
  {
    name: 'Debian / Ubuntu · x86_64',
    file: 'qork-x86_64-unknown-linux-gnu.deb',
    description: 'Installs to /usr/bin. sudo apt install ./<file>',
  },
  {
    name: 'Fedora / RHEL · x86_64',
    file: 'qork-x86_64-unknown-linux-gnu.rpm',
    description: 'Installs to /usr/bin. sudo dnf install ./<file>',
  },
  {
    name: 'Debian / Ubuntu · ARM64',
    file: 'qork-aarch64-unknown-linux-gnu.deb',
    description: 'Installs to /usr/bin. sudo apt install ./<file>',
  },
  {
    name: 'Fedora / RHEL · ARM64',
    file: 'qork-aarch64-unknown-linux-gnu.rpm',
    description: 'Installs to /usr/bin. sudo dnf install ./<file>',
  },
];

export default function InstallPage() {
  return (
    <div className={`${styles.page}`}>
      <PageHeader right={<span>Command line</span>} />

      <main id="main-content" className={styles.main}>
        {/* ---- Hero ---- */}
        <section className={styles.shell}>
          <div className={styles.hero}>
            <BrandStage compact />
            <h1 className={styles.cliTitle}>Short links. One command.</h1>
            <p className={styles.lede}>
              Paste a URL into your terminal. Get a short link back. No account needed.
            </p>
            <LatestVersion className={styles.versionBadge} />
            <nav className={styles.pageNav} aria-label="On this page">
              <a href="#install">Install</a>
              <a href="#use">First link</a>
              <a href="#downloads">Downloads</a>
              <a href="#api">API</a>
            </nav>
          </div>
        </section>

        {/* ---- Install ---- */}
        <section className={styles.shell}>
          <div className={styles.section}>
            <div className={styles.sectionIntro} id="install">
              <h2>1. Get qork.</h2>
              <p>Choose your platform, copy the command, and run it in your terminal.</p>
            </div>
            <InstallBlock
              title="Install"
              detectPlatform
              targets={[
                {
                  id: 'unix',
                  label: 'macOS / Linux',
                  command: 'curl -LsSf https://qork.me/install.sh | sh',
                  note: 'Run in Terminal on macOS or your Linux shell. Downloads a ready-to-run binary for Intel or ARM; no Rust toolchain required.',
                },
                {
                  id: 'windows',
                  label: 'Windows',
                  command:
                    'powershell -ExecutionPolicy ByPass -c "irm https://qork.me/install.ps1 | iex"',
                  note: 'Run in PowerShell. Or choose a Windows installer below. After installing, open a new terminal so it can find qork.',
                  extra: <WindowsInstallers />,
                },
                {
                  id: 'cargo',
                  label: 'Cargo',
                  command: 'cargo install qork',
                  note: 'Already using Rust? Cargo builds qork from source. Otherwise, use the command for your platform.',
                },
              ]}
            />
          </div>
        </section>

        {/* ---- Usage ---- */}
        <section className={styles.shell}>
          <div className={styles.section}>
            <div className={styles.sectionIntro} id="use">
              <h2>2. Make it shorter.</h2>
              <p>
                Replace the example URL with yours. qork prints a full short link, ready to copy or
                pipe into another command.
              </p>
            </div>
            <div className={styles.stack}>
              <TerminalFrame
                title="Your first link"
                meta="Example output"
                lines={[
                  { text: 'qork https://example.com/some/very/long/path', prompt: true },
                  { text: 'https://qork.me/ka9m', accent: true },
                  { text: 'qork https://example.com --alias launch', prompt: true },
                  { text: 'https://qork.me/launch', accent: true },
                ]}
              />
              <p className={styles.prose}>
                Put URLs in quotes when they contain spaces, <code>&amp;</code>, or <code>?</code>.
                Custom aliases are optional and must be available. The links above are examples.
              </p>
              <p className={styles.prose}>
                qork checks whether a destination looks reachable before shortening it. If that
                check gets in your way, use <code>--no-check</code> to skip it.
              </p>
              <details className={styles.disclosure}>
                <summary>More commands &amp; options</summary>
                <CommandTable
                  headers={['Command', 'Description']}
                  rows={[
                    { command: 'qork <url>', description: 'Shorten a URL; prints the short link' },
                    {
                      command: 'qork <url> --alias <name>',
                      description: 'Use a custom short code',
                    },
                    {
                      command: 'qork <url> --json',
                      description: 'Return JSON for scripts; use href for the full link',
                    },
                    {
                      command: 'qork <url> --no-check',
                      description: 'Skip the destination reachability check',
                    },
                    { command: 'qork help', description: 'Show help and documentation' },
                    {
                      command: 'qork update',
                      description: 'Update to the latest release (per install method)',
                    },
                    {
                      command: 'qork uninstall [--yes]',
                      description: 'Fully remove qork from this system',
                    },
                    { command: 'qork --version', description: 'Print the version' },
                  ]}
                  footnote="Run qork --help for the full command reference."
                />
              </details>
            </div>
          </div>
        </section>

        {/* ---- Downloadable native installers ---- */}
        <section className={styles.shell}>
          <div className={styles.section}>
            <div className={styles.sectionIntro} id="downloads">
              <h2>Prefer a download?</h2>
              <p>Pick your operating system. Every installer contains the same qork CLI.</p>
            </div>
            <div className={styles.stack}>
              <details className={styles.disclosure}>
                <summary>Windows installers</summary>
                <div className={styles.downloads}>
                  {WINDOWS_INSTALLERS.map(({ name, file, description }) => (
                    <DownloadCard
                      key={file}
                      name={name}
                      meta={file}
                      href={`${RELEASE_BASE}${file}`}
                      downloadName={file}
                      description={description}
                      cta="Download"
                    />
                  ))}
                </div>
              </details>

              <details className={styles.disclosure}>
                <summary>macOS installers</summary>
                <div className={styles.downloads}>
                  {MACOS_INSTALLERS.map(({ name, file, description }) => (
                    <DownloadCard
                      key={file}
                      name={name}
                      meta={file}
                      href={`${RELEASE_BASE}${file}`}
                      downloadName={file}
                      description={description}
                      cta="Download .pkg"
                    />
                  ))}
                </div>
              </details>

              <details className={styles.disclosure}>
                <summary>Linux installers</summary>
                <div className={styles.downloads}>
                  {LINUX_INSTALLERS.map(({ name, file, description }) => (
                    <DownloadCard
                      key={file}
                      name={name}
                      meta={file}
                      href={`${RELEASE_BASE}${file}`}
                      downloadName={file}
                      description={description}
                      cta="Download"
                    />
                  ))}
                </div>
              </details>

              <div className={styles.linkRow}>
                <TextLink href="https://github.com/QubeTX/qork/releases/latest" glyph="↗">
                  All release assets &amp; raw binaries
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
            <div className={styles.sectionIntro} id="api">
              <h2>Put it in a script.</h2>
              <p>Use the HTTP API directly. No API key or SDK required.</p>
            </div>
            <div className={styles.stack}>
              <p className={styles.prose}>
                Both <code>GET</code> and <code>POST</code> hit{' '}
                <code>https://qork.me/api/shorten</code> and return the same JSON. Use{' '}
                <code>href</code> for the full short link. A custom alias goes in{' '}
                <code>customAlias</code> for POST, or <code>alias</code> for GET.
              </p>
              <TerminalFrame
                title="HTTP requests"
                meta="POST · GET"
                bootPrint={false}
                lines={[
                  { text: '# GET', accent: true },
                  {
                    text: 'curl "https://qork.me/api/shorten?url=https%3A%2F%2Fexample.com"',
                    prompt: true,
                  },
                  { text: '' },
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
                Request fields, limits, and error responses:{' '}
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
