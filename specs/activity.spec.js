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
    
    test.skip('Published event appears in the Activity dashboard widget', async ({ page, admin }) => {
        // Add a new event (classic editor assumed)
        await admin.visitAdminPage('post-new.php', 'post_type=tribe_events');
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
    

    test.fixme('Published event appears in the Activity dashboard widget (block editor)', async ({ page, admin, editor }) => {
        await admin.visitAdminPage('post-new.php', 'post_type=tribe_events');

        // Fill event title
        //await page.locator('textarea.editor-post-title__input').fill('Test Event Title');
        await page.fill('#title', 'Test Event Title');

        // Type into the editor using Editor.canvas
        await editor.canvas.type('This is the event content.');

        // Publish the post
        await admin.publishPost();

        //await page.click('button:has-text("Publish")');
        //await page.click('button:has-text("Publish")');
        await page.waitForSelector('div:has-text("published")');

        // Go to Dashboard
        await admin.visitAdminPage('index.php');
        const activityWidget = page.locator('#dashboard_activity');

        await expect(activityWidget).toContainText('Test Event Title');
    });
});