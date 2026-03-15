import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('merges basic string classes', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles falsy values correctly', () => {
    expect(cn('class1', null, undefined, false, '', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes using object syntax', () => {
    expect(
      cn('class1', {
        class2: true,
        class3: false,
        class4: true,
      })
    ).toBe('class1 class2 class4');
  });

  it('handles array of classes', () => {
    expect(cn(['class1', 'class2'], ['class3', 'class4'])).toBe('class1 class2 class3 class4');
  });

  it('merges and resolves tailwind classes overrides properly', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
  });

  it('handles combinations of different inputs', () => {
    expect(
      cn(
        'base-class',
        ['array-class1', 'array-class2'],
        {
          'conditional-true': true,
          'conditional-false': false,
        },
        null,
        undefined,
        'bg-red-500',
        'bg-blue-500' // Should override bg-red-500
      )
    ).toBe('base-class array-class1 array-class2 conditional-true bg-blue-500');
  });
});
