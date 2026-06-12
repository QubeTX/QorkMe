import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CommandTable from './CommandTable';
import CapabilityRows from './CapabilityRows';
import DownloadCard from './DownloadCard';

describe('CommandTable', () => {
  it('renders real table semantics with mono commands', () => {
    render(
      <CommandTable
        rows={[
          { command: 'tr300', description: 'Run report' },
          { command: 'tr300 --json', description: 'JSON output for scripting' },
        ]}
        footnote="Run tr300 --help for full documentation"
      />
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /command/i })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3); // head + 2
    expect(screen.getByText('tr300 --json')).toBeInTheDocument();
    expect(screen.getByText(/full documentation/i)).toBeInTheDocument();
  });
});

describe('CapabilityRows', () => {
  it('numbers rows 01.. and renders titles/bodies', () => {
    render(
      <CapabilityRows
        items={[
          { title: 'System overview', body: 'Everything at a glance.' },
          { title: 'Data export', body: 'Structured output.' },
        ]}
      />
    );
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /data export/i })).toBeInTheDocument();
  });
});

describe('DownloadCard', () => {
  it('renders the artifact identity and a download anchor', () => {
    render(
      <DownloadCard
        name="Design-system kit"
        meta="v3.2.0 · zip"
        href="/qubetx-design-system.zip"
        description="Tokens, fonts, source modules, agent docs."
      />
    );
    const link = screen.getByRole('link', { name: /download/i });
    expect(link).toHaveAttribute('href', '/qubetx-design-system.zip');
    expect(link).toHaveAttribute('download');
    expect(screen.getByRole('heading', { name: /design-system kit/i })).toBeInTheDocument();
  });

  it('stamps the saved filename when downloadName is given (stable permalink href)', () => {
    render(
      <DownloadCard
        name="Design-system kit"
        meta="v3.2.0 · zip"
        href="/qubetx-design-system.zip"
        downloadName="qubetx-design-system-v3.2.0.zip"
      />
    );
    const link = screen.getByRole('link', { name: /download/i });
    expect(link).toHaveAttribute('download', 'qubetx-design-system-v3.2.0.zip');
  });
});
