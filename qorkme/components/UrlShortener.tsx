'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SlotRoll } from '@/lib/motion/SlotRoll';
import { validateShortCode, validateUrl } from '@/lib/shortcode/validator';
import { useMotionPreference } from './brand/MotionPreference';
import styles from './UrlShortener.module.css';

type Result = { href: string; original: string };
export function UrlShortener({ onSuccess }: { onSuccess?: () => void }) {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [aliasOpen, setAliasOpen] = useState(false);
  const [aliasStatus, setAliasStatus] = useState('');
  const [working, setWorking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [copy, setCopy] = useState('Copy');
  const { paused } = useMotionPreference();
  const pending = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyEpoch = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  const copyButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      pending.current?.abort();
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);
  useEffect(() => {
    const value = alias.trim();
    if (!aliasOpen || !value) {
      setAliasStatus('');
      return;
    }
    const validation = validateShortCode(value);
    if (!validation.valid) {
      setAliasStatus(validation.error!);
      return;
    }
    const controller = new AbortController();
    let active = true;
    setAliasStatus('Checking…');
    const timer = setTimeout(async () => {
      const deadline = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(`/api/shorten?alias=${encodeURIComponent(value)}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (active)
          setAliasStatus(
            response.ok && typeof data.available === 'boolean'
              ? data.available
                ? 'Available'
                : 'Taken — try another alias'
              : 'Availability could not be checked. You can still try shortening.'
          );
      } catch {
        if (active)
          setAliasStatus('Availability could not be checked. You can still try shortening.');
      } finally {
        clearTimeout(deadline);
      }
    }, 400);
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [alias, aliasOpen]);
  useEffect(() => {
    if (result) copyButton.current?.focus({ preventScroll: true });
  }, [result]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending.current) return;
    const value = aliasOpen ? alias.trim() : '';
    const validUrl = validateUrl(url);
    const validAlias = value ? validateShortCode(value) : { valid: true };
    if (!validUrl.valid || !validAlias.valid) {
      setError(
        !url.trim()
          ? 'Please enter a URL.'
          : (validUrl.error ?? validAlias.error ?? 'Check your link.')
      );
      return;
    }
    const controller = new AbortController();
    pending.current = controller;
    const deadline = setTimeout(() => controller.abort(), 15000);
    setWorking(true);
    setError('');
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          ...(value ? { customAlias: value } : {}),
          source: 'web',
        }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not shorten this link. Please try again.');
      if (typeof data.href !== 'string' || !/^https?:\/\//.test(data.href))
        throw new Error('The server returned an incomplete link. Please try again.');
      if (mounted.current && !controller.signal.aborted) {
        setResult({ href: data.href, original: url.trim() });
        setCopy('Copy');
        onSuccess?.();
      }
    } catch (cause) {
      if (mounted.current)
        setError(
          controller.signal.aborted
            ? 'That took too long. Please try again.'
            : cause instanceof Error
              ? cause.message
              : 'Could not connect. Please try again.'
        );
    } finally {
      clearTimeout(deadline);
      if (pending.current === controller) {
        pending.current = null;
        if (mounted.current) setWorking(false);
      }
    }
  };
  const reset = () => {
    copyEpoch.current++;
    if (copyTimer.current) clearTimeout(copyTimer.current);
    setResult(null);
    setError('');
    setCopy('Copy');
    setUrl('');
    setAlias('');
    setAliasOpen(false);
    requestAnimationFrame(() => input.current?.focus());
  };
  const copyResult = async () => {
    if (!result) return;
    const epoch = ++copyEpoch.current;
    try {
      await navigator.clipboard.writeText(result.href);
      if (mounted.current && epoch === copyEpoch.current) setCopy('Copied');
    } catch {
      if (mounted.current && epoch === copyEpoch.current) setCopy('Try again');
    }
    if (mounted.current && epoch === copyEpoch.current) {
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopy('Copy'), 1800);
    }
  };
  const label = (text: string) => (paused ? <span>{text}</span> : <SlotRoll text={text} />);
  return (
    <div className={styles.shortener}>
      {!result ? (
        <form onSubmit={submit} noValidate aria-label="URL shortener" aria-busy={working}>
          <label className={styles['field-label']} htmlFor="long-link">
            Your long link
          </label>
          <div className={styles['form-row']}>
            <div className={styles['url-field']}>
              <input
                ref={input}
                id="long-link"
                type="url"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                placeholder="https://example.com/your/long/link"
                value={url}
                maxLength={2048}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError('');
                }}
                aria-describedby={error ? 'form-error' : undefined}
                aria-invalid={!!error}
                disabled={working}
                required
              />
            </div>
            <button
              className={styles['action-button']}
              type="submit"
              disabled={working}
              aria-label={working ? 'Working…' : 'Shorten URL'}
            >
              <span className={styles['action-label']}>
                {label(working ? 'Working…' : 'Shorten')}
              </span>
              <span className={styles['arrow-window']} aria-hidden="true">
                <ArrowRight size={22} />
                <ArrowRight size={22} className={styles['arrow-incoming']} />
              </span>
            </button>
          </div>
          <button
            className={styles['alias-toggle']}
            type="button"
            aria-expanded={aliasOpen}
            aria-controls="alias-field"
            disabled={working}
            onClick={() => setAliasOpen((v) => !v)}
          >
            {aliasOpen ? '−' : '+'} Custom alias
          </button>
          {aliasOpen && (
            <div id="alias-field" className={styles['alias-field']}>
              <label htmlFor="alias">
                Custom alias <span>(optional)</span>
              </label>
              <div className={styles['alias-input-row']}>
                <span className={styles['alias-prefix']}>qork.me/</span>
                <input
                  id="alias"
                  value={alias}
                  maxLength={50}
                  disabled={working}
                  placeholder="my-link"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  onChange={(e) => setAlias(e.target.value)}
                  aria-describedby="alias-status"
                />
              </div>
              <span
                id="alias-status"
                className={styles['alias-status']}
                data-available={aliasStatus === 'Available'}
                role="status"
              >
                {aliasStatus}
              </span>
            </div>
          )}
          {error && (
            <p id="form-error" className={styles['form-error']} role="alert">
              {error}
            </p>
          )}
        </form>
      ) : (
        <div className={styles['result-content']}>
          <div className={styles['result-heading']}>
            <span>
              <Check size={18} aria-hidden="true" />
              Your short link is ready
            </span>
          </div>
          <div className={styles['form-row']}>
            <div className={styles['result-url']}>
              <span className={styles['result-source-ghost']} aria-hidden="true">
                {result.original}
              </span>
              <a
                className={styles['result-address']}
                href={result.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.href.replace(/^https?:\/\//, '')}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
            <button
              ref={copyButton}
              type="button"
              className={`${styles['action-button']} ${styles['copy-button']}`}
              onClick={copyResult}
              aria-label={copy}
            >
              <span className={styles['action-label']}>{label(copy)}</span>
              <span className={styles['arrow-window']} aria-hidden="true">
                {copy === 'Copied' ? <Check size={22} /> : <ArrowRight size={22} />}
              </span>
            </button>
          </div>
          <div className={styles['result-bottom']}>
            <span className={styles['original-url']} title={result.original}>
              {result.original}
            </span>
            <button type="button" className={styles['reset-button']} onClick={reset}>
              Shorten another <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
          <p className="sr-only" role="status">
            {copy === 'Copied'
              ? 'Link copied to clipboard.'
              : copy === 'Try again'
                ? 'Could not copy. You can select and copy the link above.'
                : 'Your short link is ready.'}
          </p>
        </div>
      )}
    </div>
  );
}
