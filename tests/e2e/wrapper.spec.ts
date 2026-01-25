import { expect, test } from './fixtures/wrapper.fixture.js';

/** Wrapper tests. */
test.describe('Wrapper Tests', () => {
  test('test wrapper', async ({ litivo }) => {
    expect(await litivo.waitforTimeout(5_000)).toBeUndefined();
  });
});
