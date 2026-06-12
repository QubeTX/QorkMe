'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';

export function AdminSignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign out';
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button variant="outline" onClick={handleSignOut} disabled={isLoading} className="gap-2">
        <LogOut size={18} aria-hidden="true" />
        {isLoading ? 'Signing out…' : 'Sign out'}
      </Button>
      {errorMessage && (
        <p role="alert" className="font-mono text-xs text-[color:var(--color-error)]">
          ERR // {errorMessage}
        </p>
      )}
    </div>
  );
}
