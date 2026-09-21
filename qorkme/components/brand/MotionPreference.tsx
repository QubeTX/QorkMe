'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const MotionContext = createContext({ paused: false, toggle: () => {}, reduced: false });

export function MotionPreference({ children }: { children: ReactNode }) {
  const [stopped, setStopped] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    try {
      setStopped(localStorage.getItem('qork-motion') === 'paused');
    } catch {
      /* Storage is optional. */
    }
    return () => query.removeEventListener('change', update);
  }, []);
  const paused = reduced || stopped;
  const toggle = () => {
    setStopped(!stopped);
    try {
      localStorage.setItem('qork-motion', stopped ? 'on' : 'paused');
    } catch {
      /* Keep the current session usable. */
    }
  };
  return (
    <MotionContext.Provider value={{ paused, toggle, reduced }}>
      <div className="site-shell" data-paused={paused}>
        {children}
      </div>
    </MotionContext.Provider>
  );
}

export const useMotionPreference = () => useContext(MotionContext);

export function MotionToggle() {
  const { paused, toggle, reduced } = useMotionPreference();
  return (
    <button
      type="button"
      className="motion-toggle"
      onClick={toggle}
      disabled={reduced}
      aria-pressed={!paused}
      title={reduced ? 'Reduced motion is enabled in your device settings' : undefined}
    >
      {paused ? 'Motion off' : 'Motion on'}
    </button>
  );
}
