import { test as base } from '@playwright/test';
import { Litivo } from '../../../src/litivo/wrapper.js';
import { UserCredentials } from '../config/testEnv.js';

export const test = base.extend<{ litivo: Litivo }>({
  litivo: async ({ context }, use) => {
    const litivo = new Litivo(context);
    await litivo.login(UserCredentials.email, UserCredentials.password);
    await use(litivo);
    await litivo.logout();
  },
});

export { expect } from '@playwright/test';
