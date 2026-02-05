import { describe, expect, it } from 'vitest';
import { isEven, sum } from '../../src/math.js';

/**
 * Example Unit tests.
 */
describe('math utilities', () => {
  it('adds two numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('detects even numbers', () => {
    expect(isEven(4)).toBe(true);
    expect(isEven(5)).toBe(false);
  });
});
