/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Sidebar panel', () => {
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
	} );

	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPages();
	} );

	test.describe( 'panel per post type', () => {
		test( 'it shows for `tribe_events`', async ( {
			page,
			admin,
			editor,
			requestUtils,
		} ) => {
			const newPage = await admin.createNewPost( {
				title: 'Posts Page',
				postType: 'tribe_events',
				status: 'publish',
			} );
			await editor.openDocumentSettingsSidebar();
			await expect(
				page.getByRole( 'button', { name: 'The Event Attendee' } )
			).toBeVisible();
		} );

		test( 'invisible for regular posts', async ( {
			page,
			admin,
			editor,
			requestUtils,
		} ) => {
			const newPage = await requestUtils.createPost( {
				title: 'Post',
				status: 'publish',
			} );
			await admin.editPost( newPage.id );
			await editor.openDocumentSettingsSidebar();
			await expect(
				page.getByRole( 'button', { name: 'The Event Attendee' } )
			).toBeHidden()
		} );

		test( 'invisible in site editor', async ( {
			page,
			editor,
			admin,
			requestUtils,
		} ) => {
			const newPage = await requestUtils.createPage( {
				title: 'Posts Page',
				status: 'publish',
			} );
			await admin.visitSiteEditor( {
				postId: newPage.id,
				postType: 'page',
				canvas: 'edit',
			} );
			await editor.openDocumentSettingsSidebar();
			await expect(
				page.getByRole( 'button', { name: 'The Event Attendee' } )
			).toBeHidden();
		} );
	} );
} );
