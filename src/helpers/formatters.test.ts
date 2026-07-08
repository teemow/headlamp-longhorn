import { describe, expect, it } from 'vitest';
import { formatBytes } from './formatters';
import { PluralName } from './pluralName';

describe('formatBytes', () => {
  it('returns a dash for missing values', () => {
    expect(formatBytes(undefined)).toBe('-');
    expect(formatBytes(null)).toBe('-');
  });

  it('returns 0 Bytes for zero and non-numeric input', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes('not-a-number')).toBe('0 Bytes');
  });

  it('formats binary sizes', () => {
    expect(formatBytes(1024)).toBe('1 KiB');
    expect(formatBytes(1536)).toBe('1.5 KiB');
    expect(formatBytes(1073741824)).toBe('1 GiB');
  });

  it('accepts numeric strings', () => {
    expect(formatBytes('2048')).toBe('2 KiB');
  });

  it('honors the decimals argument', () => {
    expect(formatBytes(1536, 0)).toBe('2 KiB');
  });
});

describe('PluralName', () => {
  it('maps known Longhorn kinds', () => {
    expect(PluralName('Volume')).toBe('volumes');
    expect(PluralName('BackingImageDataSource')).toBe('backingimagedatasources');
  });

  it('pluralizes unknown kinds generically', () => {
    expect(PluralName('Ingress')).toBe('ingresses');
    expect(PluralName('Policy')).toBe('policies');
    expect(PluralName('Deployment')).toBe('deployments');
  });
});
