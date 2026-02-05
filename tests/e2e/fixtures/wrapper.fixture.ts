import { test as base, expect } from '@playwright/test';
import Litivo from '../../../src/wrapper.js';
import { UserCredentials } from '../config/testEnv.js';

const test = base.extend<{ litivo: Litivo }>({
  litivo: async ({ context }, use) => {
    const litivo = new Litivo(context);
    await litivo.login(UserCredentials.email, UserCredentials.password);
    await use(litivo);
    await litivo.logout();
  },
});

export { expect, test };
