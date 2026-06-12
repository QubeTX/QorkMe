import { Fragment, type ReactNode } from 'react';

export type SplitMode = 'words' | 'chars';

const maskStyle = {
  display: 'inline-block',
  overflow: 'hidden',
  verticalAlign: 'top',
} as const;

const innerStyle = {
  display: 'inline-block',
} as const;

const charWordStyle = {
  display: 'inline-block',
  whiteSpace: 'nowrap',
} as const;

/**
 * Server-renderable text splitter for masked-rise reveals.
 *
 * Output targets: [data-reveal-mask] (overflow-hidden mask) wrapping
 * [data-reveal] (the transform target). The server HTML is fully VISIBLE —
 * hidden states are applied client-side by RevealText, so no-JS users and
 * crawlers always see the text and hydration never shifts layout.
 *
 * In chars mode, each word's characters stay inside a nowrap word wrapper
 * so line wrapping still happens at word boundaries.
 *
 * Not for text inside PretextBlock (Pretext assumes natural inline flow),
 * and not for letter-spaced mono labels.
 */
export function splitText(text: string, mode: SplitMode = 'words'): ReactNode {
  const tokens = text.split(/(\s+)/);

  return tokens.map((token, ti) => {
    if (token === '') return null;
    if (/^\s+$/.test(token)) {
      return <Fragment key={`s-${ti}`}>{token}</Fragment>;
    }

    if (mode === 'words') {
      return (
        <span key={`w-${ti}`} data-reveal-mask style={maskStyle}>
          <span data-reveal style={innerStyle}>
            {token}
          </span>
        </span>
      );
    }

    return (
      <span key={`w-${ti}`} style={charWordStyle}>
        {Array.from(token).map((ch, ci) => (
          <span key={`c-${ci}`} data-reveal-mask style={maskStyle}>
            <span data-reveal style={innerStyle}>
              {ch}
            </span>
          </span>
        ))}
      </span>
    );
  });
}
