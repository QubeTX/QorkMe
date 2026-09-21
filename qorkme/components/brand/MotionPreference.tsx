'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const MotionContext = createContext({ paused: false });

export function MotionPreference({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return (
    <MotionContext.Provider value={{ paused: reduced }}>
      <div className="site-shell" data-paused={reduced}>
        {children}
      </div>
    </MotionContext.Provider>
  );
}

export const useMotionPreference = () => useContext(MotionContext);
