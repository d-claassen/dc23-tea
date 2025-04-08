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

    test('Published event appears in the Activity dashboard widget', async ({ page, admin, editor }) => {
				// Create a new event
				await admin.createNewPost( {
					title: 'My Test Event',
					postType: 'tribe_events',
					status: 'publish',
				} );

				// Publish
				await editor.publishPost();

        // Go back to the dashboard
        await admin.visitAdminPage('index.php');
        // Find the widget
        const activityWidget = page.locator('#dashboard_activity');

        // Check that the event title shows up
        await expect(activityWidget).toContainText('My Test Event');
    });
});
