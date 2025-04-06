/**
 * WordPress dependencies.
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe('Dashboard Activity widget', async () => {
    test('no events initially', async ({ page, admin }) => {
        // Go to dashboard.
        await admin.visitPage('sdmin.php');

        // Find the widget
        const activityWidget = page.locator('#dashboard_activity');

        // Should not contain any events (yet)
        await expect(activityWidget).not.toContainText('Test Event Title');
    });
});