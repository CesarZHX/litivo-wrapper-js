// TODO: use test data in this file to complete the example
import Litivo from 'litivo-wrapper';
import type { BrowserContext } from 'playwright';

/**
 * Example usage of the litivo-wrapper library.
 *
 * This example demonstrates:
 * 1. Creating a Litivo wrapper instance
 * 2. Logging into the system
 * 3. Creating an insolvency record
 * 4. Logging out
 */
async function main(browserContext: BrowserContext): Promise<void> {
  // Initialize the Litivo wrapper with the browser context
  const litivo = new Litivo(browserContext);

  // Get credentials from environment variables
  // In a real scenario, these should be securely managed
  process.loadEnvFile();
  const email = process.env.LITIVO_EMAIL || 'test@example.com';
  const password = process.env.LITIVO_PASSWORD || 'password123';

  // Step 1: Login to Litivo
  console.log('🔐 Logging into Litivo...');
  await litivo.login(email, password);
  console.log('✅ Successfully logged in!');

  // Step 2: Wait a moment to see the dashboard
  console.log('📊 Viewing dashboard...');
  await litivo.waitforTimeout(3000);

  // Step 3: Create an insolvency record (example data)
  console.log('📝 Creating insolvency record...');
  const insolvencyData = {
    // TODO: Fill with actual insolvency data schema
    // See src/models/insolvency.ts for the schema structure
  };

  // Uncomment when you have valid insolvency data:
  // await litivo.createInsolvency(insolvencyData);
  // console.log('✅ Insolvency record created!');

  // Step 4: Logout
  console.log('🚪 Logging out...');
  await litivo.logout();
  console.log('✅ Successfully logged out!');

  console.log('🎉 Example completed successfully!');
}

export default main;
