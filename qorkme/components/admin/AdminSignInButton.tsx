'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { LogIn } from 'lucide-react';

export function AdminSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'read:user user:email',
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start GitHub sign-in';
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={handleSignIn} disabled={isLoading} className="gap-2 justify-center">
        <LogIn size={18} aria-hidden="true" />
        {isLoading ? 'Redirecting…' : 'Sign in with GitHub'}
      </Button>
      {errorMessage && (
        <p role="alert" className="font-mono text-xs text-[color:var(--color-error)]">
          ERR // {errorMessage}
        </p>
      )}
    </div>
  );
}
