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
import LedeCycle from './LedeCycle';
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
    name: 'Global · MSI',
    file: 'qork-x86_64-pc-windows-msvc.msi',
    description: 'Per-machine install to Program Files. Requires administrator.',
  },
  {
    name: 'Global · EXE',
    file: 'qork-x86_64-pc-windows-msvc-setup.exe',
    description: 'Per-machine Setup wizard. Requires administrator.',
  },
  {
    name: 'Corporate · MSI',
    file: 'qork-x86_64-pc-windows-msvc-corporate.msi',
    description: 'Per-user install to %LocalAppData%. No admin needed.',
  },
  {
    name: 'Corporate · EXE',
    file: 'qork-x86_64-pc-windows-msvc-corporate-setup.exe',
    description: 'Per-user Setup wizard. No admin needed.',
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

            <LedeCycle />
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
                  note: 'Recommended on macOS & Linux. Downloads a prebuilt binary for your CPU (Intel or ARM) to ~/.cargo/bin — no Rust/cargo, no admin.',
                },
                {
                  id: 'windows',
                  label: 'Windows',
                  command:
                    'powershell -ExecutionPolicy ByPass -c "irm https://qork.me/install.ps1 | iex"',
                  note: 'Downloads a prebuilt qork.exe — no Rust/cargo needed. On Windows the MSI/EXE installers below tend to work best:',
                  extra: <WindowsInstallers />,
                },
                {
                  id: 'cargo',
                  label: 'Cargo',
                  command: 'cargo install qork',
                  note: 'For machines that already have a Rust toolchain (builds from source). The one-liners above need no Rust.',
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
              <p className={styles.prose}>
                Before shortening, qork checks the link is real — it won&apos;t shorten pasted text
                or a dead (404) URL. Pass <code>--no-check</code> to skip that.
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
                  {
                    command: 'qork <url> --no-check',
                    description: 'Skip the live-link safety check',
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
            </div>
          </div>
        </section>

        {/* ---- Downloadable native installers ---- */}
        <section className={styles.shell}>
          <div className={styles.section}>
            <SectionHeading
              label="03 // Installers"
              title="Native installers"
              subtitle="Prefer a download? Grab a native installer for your platform. On macOS and Linux the command-line install above is the recommended path; on Windows the MSI/EXE installers work best."
            />
            <div className={styles.stack}>
              <div className={styles.dlGroup}>
                <p className={styles.dlGroupLabel}>Windows</p>
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
              </div>

              <div className={styles.dlGroup}>
                <p className={styles.dlGroupLabel}>
                  macOS{' '}
                  <span className={styles.dlNote}>· the curl install above is recommended</span>
                </p>
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
              </div>

              <div className={styles.dlGroup}>
                <p className={styles.dlGroupLabel}>
                  Linux{' '}
                  <span className={styles.dlNote}>· the curl install above is recommended</span>
                </p>
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
              </div>

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
