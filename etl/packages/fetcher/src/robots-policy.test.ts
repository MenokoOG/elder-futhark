import { describe, expect, it } from 'vitest';
import { assertAllowlistedUrl } from './robots-policy.js';

describe('assertAllowlistedUrl', () => {
    it('allows approved domains', () => {
        expect(() => assertAllowlistedUrl('https://norse-mythology.org/runes/the-meanings-of-the-runes/')).not.toThrow();
        expect(() => assertAllowlistedUrl('https://andreashelley.com/blog/futhark-runes-symbols-and-meanings/')).not.toThrow();
    });

    it('rejects non-allowlisted hosts', () => {
        expect(() => assertAllowlistedUrl('https://example.com/runes')).toThrow(/allowlisted/i);
    });

    it('rejects malformed urls', () => {
        expect(() => assertAllowlistedUrl('not-a-url')).toThrow(/invalid url/i);
    });

    it('rejects non-http protocols', () => {
        expect(() => assertAllowlistedUrl('ftp://norse-mythology.org/runes')).toThrow(/unsupported protocol/i);
    });
});
