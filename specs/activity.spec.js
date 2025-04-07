/**
 * WordPress dependencies.
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe('Dashboard Activity widget', async () => {
    test('no events initially', async ({ page, admin }) => {
        // Go to dashboard.
        await admin.visitAdminPage('index.php');

        // Find the widget
        const activityWidget = page.locator('#dashboard_activity');

        // Should not contain any events (yet)
        await expect(activityWidget).not.toContainText('Test Event Title');
    });
    
    test('Published event appears in the Activity dashboard widget', async ({ page, admin }) => {
        // Add a new event (classic editor assumed)
        await admin.openAdminPage('post-new.php', 'post_type=tribe_events');
        await page.fill('#title', 'Test Event Title');
        await page.fill('#content', 'This is the event content.');
        await page.click('#publish');

        // Go back to the dashboard
        await admin.visitAdminPage('index.php');
        // Find the widget
        const activityWidget = page.locator('#dashboard_activity');

        // Check that the event title shows up
        await expect(activityWidget).toContainText('Test Event Title');
    });
});