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
    // Go to Add Event
    await admin.visitAdminPage('post-new.php', 'post_type=tribe_events');

    // Fill out the event title and content
    await page.fill('#title', 'My Test Event');
    await page.fill('#content', 'This is a sample event description.');

    // Publish
    await page.click('#publish');
    await page.waitForURL(/edit\.php.*post_type=tribe_events/);
  
    // Confirm it's published
    await expect(page.locator('.notice-success')).toContainText('published');

    // Navigate to the WordPress admin dashboard
    await admin.visitAdminPage('index.php');

    // Check the count
    await expect(page.locator('.tribe_events-count')).toHaveText('1 Event');
  });
});