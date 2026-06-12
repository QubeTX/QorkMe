'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';

type PurgeStatus =
  | { kind: 'idle' }
  | { kind: 'aborted' }
  | { kind: 'done' }
  | { kind: 'error'; message: string };

export function ClearDatabaseButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<PurgeStatus>({ kind: 'idle' });

  const router = useRouter();

  const handleClear = async () => {
    const confirmFirst = window.confirm(
      'This will permanently remove all saved URLs and analytics records. Continue?'
    );

    if (!confirmFirst) {
      return;
    }

    const confirmSecond = window.prompt(
      'Type DELETE to confirm you want to purge all stored URLs. This action cannot be undone.'
    );

    if (confirmSecond !== 'DELETE') {
      setStatus({ kind: 'aborted' });
      return;
    }

    try {
      setIsLoading(true);
      setStatus({ kind: 'idle' });

      const response = await fetch('/api/admin/purge', {
        method: 'POST',
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to clear database');
      }

      setStatus({ kind: 'done' });
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to clear database';
      setStatus({ kind: 'error', message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <Button
        variant="outline"
        onClick={handleClear}
        disabled={isLoading}
        className="gap-2 border-[color:var(--color-error)] text-[color:var(--color-error)] hover:bg-[color:var(--color-error)] hover:text-[color:var(--color-void)] hover:border-[color:var(--color-error)]"
      >
        <Trash2 size={18} aria-hidden="true" />
        {isLoading ? 'Purging…' : 'Clear all saved URLs'}
      </Button>
      {status.kind === 'aborted' && (
        <p role="status" className="font-mono text-xs text-[color:var(--color-text-dim)]">
          PURGE ABORTED // CONFIRMATION MISMATCH
        </p>
      )}
      {status.kind === 'done' && (
        <p role="status" className="font-mono text-xs text-[color:var(--color-arrival)]">
          PURGE COMPLETE // ALL URL DATA CLEARED
        </p>
      )}
      {status.kind === 'error' && (
        <p role="alert" className="font-mono text-xs text-[color:var(--color-error)]">
          ERR // {status.message}
        </p>
      )}
    </div>
  );
}
