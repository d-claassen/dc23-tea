/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( '"At a glance" widget integration', () => {
	test.beforeEach( async ( { admin, page } ) => {
		await admin.visitAdminPage(
			'edit.php',
			'page=tec-events-settings&tab=general-editing-tab&post_type=tribe_events'
		);
		const skipTelemetry = await page.getByRole( 'button', {
			name: 'Skip',
		} );
		if ( ( await skipTelemetry.count() ) > 0 ) {
			await skipTelemetry.click();
		}
		// const checkbox = await page.getByRole( 'checkbox', { name: 'toggle_blocks_editor' } ).check();
		const checkbox = await page.getByRole( 'checkbox' ).first();
		await checkbox.check();
		await page.getByRole( 'button', { name: 'Save Changes' } ).click();

		await admin.visitAdminPage( 'edit.php', 'post_type=tribe_events' );
		await page.getByLabel( 'Select All' ).first().check();
		const bulkAction = await page
			.getByLabel( 'Select bulk action' )
			.first();
		if ( ( await bulkAction.count() ) > 0 ) {
			await bulkAction.selectOption( 'trash' );
			await page.getByRole( 'button', { name: 'Apply' } ).first().click();
		}
	} );

	test( 'widget presence', async ( { page, admin } ) => {
		// Navigate to the WordPress admin dashboard
		await admin.visitAdminPage( 'index.php' );

		// Assert that the "At a Glance" widget is visible
		await expect( page.locator( '#dashboard_right_now' ) ).toBeVisible();
	} );

	test( 'correct event count', async ( { page, admin } ) => {
		// Navigate to the WordPress admin dashboard
		await admin.visitAdminPage( 'index.php' );

		// Check the count
		await expect( page.locator( '.tribe_events-count' ) ).toHaveText(
			'0 Events'
		);
	} );

	test( 'correct 1 event count', async ( { page, admin, editor } ) => {
		// Create a new event
		await admin.createNewPost( {
			title: 'My Test Event',
			postType: 'tribe_events',
			status: 'publish',
		} );

		// Publish
		await editor.publishPost();

		// Navigate to the WordPress admin dashboard
		await admin.visitAdminPage( 'index.php' );

		// Check the count
		await expect( page.locator( '.tribe_events-count' ) ).toHaveText(
			'1 Event'
		);
	} );
} );
