/**
 * WordPress dependencies.
 */
import { test, expect } from '@wordpress/test-utils-e2e-playwright';

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