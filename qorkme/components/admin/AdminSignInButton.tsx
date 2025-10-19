'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminSignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
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
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleSignIn} disabled={isLoading} className="gap-2">
      <LogIn size={18} aria-hidden="true" />
      {isLoading ? 'Redirecting…' : 'Sign in with GitHub'}
    </Button>
  );
}
