/**
 * WordPress dependencies.
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe('Dashboard Activity widget', async () => {
	test.beforeEach( async ( { admin, page } ) => {
		await admin.visitAdminPage( 'edit.php', 'page=tec-events-settings&tab=general-editing-tab&post_type=tribe_events' );
		const skipTelemetry = await page.getByRole( 'button', { name: 'Skip' } );
		if ( await skipTelemetry.count() > 0 ) {
			await skipTelemetry.click();
		}
		// const checkbox = await page.getByRole( 'checkbox', { name: 'toggle_blocks_editor' } ).check();
		const checkbox = await page.getByRole( 'checkbox' ).first();
		await checkbox.check();
		await page.getByRole( 'button', { name: 'Save Changes' } ).click();

		await admin.visitAdminPage('edit.php', 'post_type=tribe_events');
		await page.getByLabel('Select All').first().check();
		const bulkAction = page.getByLabel('Select bulk action').first();
		if ( bulkAction.length > 0 ) {
			await bulkAction.selectOption('trash');
			await page.getByRole('button', {name: 'Apply'}).first().click();
		}
	} );

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
