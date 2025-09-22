'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function ClearDatabaseButton() {
  const [isLoading, setIsLoading] = useState(false);
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
      toast('Type DELETE exactly to confirm the purge.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/admin/purge', {
        method: 'POST',
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'Failed to clear database');
      }

      toast.success('All URL data has been cleared.');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to clear database';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleClear}
      disabled={isLoading}
      className="gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
    >
      <Trash2 size={18} aria-hidden="true" />
      {isLoading ? 'Purging…' : 'Clear all saved URLs'}
    </Button>
  );
}
