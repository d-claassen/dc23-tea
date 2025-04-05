/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe('"At a glance" widget integration', () => {
  test('Verify widget presence', async ({ page, admin }) => {
    // Navigate to the WordPress admin dashboard
    await admin.visitAdminPage('index.php');
  
    // Assert that the "At a Glance" widget is visible
    await expect(page.locator('#dashboard_right_now')).toBeVisible();
  });
});