import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import InstallBlock from './InstallBlock';

vi.mock('framer-motion', async () => {
  const mocks = await import('@/test/mocks/framer-motion');
  return mocks;
});

const TARGETS = [
  { id: 'macos', label: 'macOS', command: 'curl -LsSf https://reports.qubetx.com/install.sh | sh' },
  {
    id: 'linux',
    label: 'Linux',
    command: 'curl -LsSf https://reports.qubetx.com/install.sh | sh -s -- --linux',
  },
  {
    id: 'windows',
    label: 'Windows',
    command: 'iwr https://reports.qubetx.com/install.ps1 | iex',
    note: 'PowerShell 7+',
  },
];

describe('InstallBlock', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders tabs with proper tab semantics and the first command', () => {
    render(<InstallBlock targets={TARGETS} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel').textContent).toContain('install.sh | sh');
  });

  it('switches command and note on tab click', () => {
    render(<InstallBlock targets={TARGETS} />);
    fireEvent.click(screen.getByRole('tab', { name: /windows/i }));
    expect(screen.getByRole('tabpanel').textContent).toContain('install.ps1');
    expect(screen.getByText(/powershell 7\+/i)).toBeInTheDocument();
  });

  it('copies the active command and slot-rolls Copy → Copied → Copy', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<InstallBlock targets={TARGETS} />);

    fireEvent.click(screen.getByRole('button', { name: /copy/i }));
    await act(async () => {
      await Promise.resolve(); // clipboard promise
    });
    expect(writeText).toHaveBeenCalledWith(TARGETS[0].command);
    const label = document.querySelector('[data-slot-sr]');
    expect(label?.textContent).toBe('Copied');

    act(() => {
      vi.runAllTimers(); // flash revert
    });
    expect(document.querySelector('[data-slot-sr]')?.textContent).toBe('Copy');
  });

  it('flashes Failed when the clipboard is unavailable', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    render(<InstallBlock targets={TARGETS} />);
    fireEvent.click(screen.getByRole('button', { name: /copy/i }));
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(document.querySelector('[data-slot-sr]')?.textContent).toBe('Failed');
    act(() => vi.runAllTimers());
  });
});
