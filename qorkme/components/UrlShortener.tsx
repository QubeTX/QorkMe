'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SlotRoll, useSlotRoll } from '@/lib/motion/SlotRoll';
import { firePulse } from '@/components/effects/DotGrid';
import styles from './UrlShortener.module.css';

/**
 * The shortener card — QorkMe's primary surface, technical register.
 * Every label change rides the slot roll: the submit button rolls
 * SHORTEN → WORKING… on Enter, the created link rolls in from a masked
 * placeholder (arrival blue settling to ink), COPY flashes COPIED, and the
 * custom-alias availability check rolls CHECKING → AVAILABLE / TAKEN.
 * Errors are honest mono lines, never toasts.
 */

type Stage = 'input' | 'result';
type AliasStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

const ALIAS_STATUS_TEXT: Record<AliasStatus, string> = {
  idle: '·····',
  checking: 'CHECKING',
  available: 'AVAILABLE',
  taken: 'TAKEN',
  invalid: 'INVALID',
};

/** Same-length mask so the arrival roll animates every glyph. */
function maskOf(text: string): string {
  return text.replace(/[^./:]/g, '·');
}

function ArrivalUrl({ text }: { text: string }) {
  const [mask] = useState(() => maskOf(text));
  const [ref, handle] = useSlotRoll(mask, { direction: 'up' });

  useEffect(() => {
    handle.set(text);
  }, [text, handle]);

  return (
    <span ref={ref} className={styles.resultUrl}>
      {mask}
    </span>
  );
}

export function UrlShortener() {
  const [stage, setStage] = useState<Stage>('input');
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [aliasOpen, setAliasOpen] = useState(false);
  const [aliasStatus, setAliasStatus] = useState<AliasStatus>('idle');
  const [shortUrl, setShortUrl] = useState('');
  const [isExisting, setIsExisting] = useState(false);
  const [autoCopied, setAutoCopied] = useState(false);
  const [working, setWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [submitRef, submitLabel] = useSlotRoll('SHORTEN', { direction: 'up' });
  const [copyRef, copyLabel] = useSlotRoll('COPY');
  const aliasTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (aliasTimer.current) clearTimeout(aliasTimer.current);
    };
  }, []);

  const checkAlias = useCallback((value: string) => {
    if (aliasTimer.current) clearTimeout(aliasTimer.current);

    const trimmed = value.trim();
    if (!trimmed) {
      setAliasStatus('idle');
      return;
    }
    if (trimmed.length < 3 || !/^[a-zA-Z0-9-]+$/.test(trimmed)) {
      setAliasStatus('invalid');
      return;
    }

    setAliasStatus('checking');
    aliasTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/shorten?alias=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setAliasStatus(data.available ? 'available' : 'taken');
      } catch {
        setAliasStatus('idle');
      }
    }, 450);
  }, []);

  const copyToClipboard = useCallback(
    async (text: string, flash: boolean) => {
      try {
        await navigator.clipboard.writeText(text);
        if (flash) copyLabel.flash('COPIED');
        return true;
      } catch {
        if (flash) copyLabel.flash('FAILED');
        return false;
      }
    },
    [copyLabel]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (working) return;

    if (!url.trim()) {
      setErrorMessage('Please enter a URL');
      return;
    }

    setErrorMessage(null);
    setWorking(true);
    submitLabel.set('WORKING…');

    try {
      const trimmedAlias = alias.trim();
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          trimmedAlias ? { url, customAlias: trimmedAlias, source: 'web' } : { url, source: 'web' }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      const generatedShortUrl = `https://${process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me'}/${data.shortCode}`;
      setShortUrl(generatedShortUrl);
      setIsExisting(data.isNew === false);
      setStage('result');
      setWorking(false);

      // The "link created" beat — one blue ripple through the dot field
      firePulse({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        strength: 1.6,
      });

      // Auto-copy (best effort — the submit click is the user gesture).
      // The result note only claims COPIED when the write actually landed.
      copyToClipboard(generatedShortUrl, false).then(setAutoCopied);
    } catch (error) {
      console.error('Error shortening URL:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to shorten URL');
      setWorking(false);
      submitLabel.set('SHORTEN');
    }
  };

  const handleReset = () => {
    setStage('input');
    setUrl('');
    setAlias('');
    setAliasOpen(false);
    setAliasStatus('idle');
    setShortUrl('');
    setIsExisting(false);
    setAutoCopied(false);
    setErrorMessage(null);
    submitLabel.set('SHORTEN');
  };

  // Corner status — rolls as you type: IDLE → INPUT → READY → BUSY → DONE
  const cardStatus =
    stage === 'result'
      ? 'DONE'
      : working
        ? 'BUSY'
        : /^https?:\/\/.+\..+/.test(url.trim())
          ? 'READY'
          : url.trim()
            ? 'INPUT'
            : 'IDLE';

  return (
    <div className={styles.card}>
      <div className={styles.cardMeta} aria-hidden="true">
        <span className={styles.monoLabel}>QORK.ME // SHORTENER</span>
        <span className={styles.monoLabel}>
          <SlotRoll text={cardStatus} options={{ direction: 'up' }} />
        </span>
      </div>

      {stage === 'input' && (
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div>
              <label htmlFor="url-input" className={styles.fieldLabel}>
                Enter your URL
              </label>
              <input
                id="url-input"
                type="url"
                className={styles.input}
                placeholder="https://example.com/your/very/long/url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setErrorMessage(null);
                }}
                required
              />
            </div>

            {!aliasOpen && (
              <button
                type="button"
                className={styles.aliasToggle}
                onClick={() => setAliasOpen(true)}
              >
                + custom alias
              </button>
            )}

            {aliasOpen && (
              <div>
                <label htmlFor="alias-input" className={styles.fieldLabel}>
                  Custom alias (optional)
                </label>
                <div className={styles.aliasRow}>
                  <input
                    id="alias-input"
                    type="text"
                    className={styles.input}
                    placeholder="my-link"
                    value={alias}
                    maxLength={50}
                    onChange={(e) => {
                      setAlias(e.target.value);
                      checkAlias(e.target.value);
                    }}
                  />
                  {/* data-status on the wrapper drives the color (arrival blue / error) */}
                  <span className={styles.aliasStatus} data-status={aliasStatus}>
                    <SlotRoll text={ALIAS_STATUS_TEXT[aliasStatus]} options={{ direction: 'up' }} />
                  </span>
                </div>
              </div>
            )}

            {errorMessage && (
              <p role="alert" className={styles.error}>
                ERR // {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className={styles.submit}
              disabled={working}
              aria-label="Shorten URL"
            >
              <span ref={submitRef}>SHORTEN</span>
            </button>
          </div>
        </form>
      )}

      {stage === 'result' && (
        <div className={styles.resultBlock}>
          <span className={styles.resultNote} data-existing={isExisting}>
            {isExisting
              ? 'KNOWN URL // EXISTING LINK RETURNED'
              : autoCopied
                ? 'LINK CREATED // COPIED'
                : 'LINK CREATED'}
          </span>

          <div className={styles.resultUrlRow}>
            <ArrivalUrl text={shortUrl.replace(/^https:\/\//, '')} />
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => copyToClipboard(shortUrl, true)}
              aria-label="Copy short link to clipboard"
            >
              <span ref={copyRef}>COPY</span>
            </button>
          </div>

          <button type="button" className={styles.submit} onClick={handleReset}>
            SHORTEN ANOTHER
          </button>
        </div>
      )}
    </div>
  );
}
