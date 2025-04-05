/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe('"At a glance" widget integration', () => {
  test('widget presence', async ({ page, admin }) => {
    // Navigate to the WordPress admin dashboard
    await admin.visitAdminPage('index.php');
  
    // Assert that the "At a Glance" widget is visible
    await expect(page.locator('#dashboard_right_now')).toBeVisible();
  });
  
  test('correct event count', async ({ page, admin }) => {
    // Navigate to the WordPress admin dashboard
    await admin.visitAdminPage('index.php');

    // Check the count
    await expect(page.locator('.tribe_events-count')).toHaveText('0 Events');
  });
  
  test('correct 1 event count', async ({ page, admin }) => {
    // Create #1 event
    await admin.createNewPost( {
      title: 'Event #1',
      postType: 'tribe_events',
      status: 'publish',
    } );
    
    // Navigate to the WordPress admin dashboard
    await admin.visitAdminPage('index.php');

    // Check the count
    await expect(page.locator('.tribe_events-count')).toHaveText('1 Event');
  });
});