'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminSignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign out';
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={isLoading} className="gap-2">
      <LogOut size={18} aria-hidden="true" />
      {isLoading ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}
