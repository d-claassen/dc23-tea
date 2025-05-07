import { 
	test, expect,
	createPost, visitAdminPage, insertBlock, publishPost, setPostContent,
} from '@wordpress/e2e-test-utils-playwright';

test.describe('Query Loop block with tribe_events', () => {
	test.beforeEach(async ({ admin, editor, page }) => {
		// Visit TEC settings
		await admin.visitAdminPage(
			'edit.php',
			'page=tec-events-settings&tab=general-editing-tab&post_type=tribe_events'
		);
		
		// Skip telemetry alert if showing.
		const skipTelemetry = await page.getByRole( 'button', {
			name: 'Skip',
		} );
		if ( ( await skipTelemetry.count() ) > 0 ) {
			await skipTelemetry.click();
		}

		// Enable block editor for events.
		// const checkbox = await page.getByRole( 'checkbox', { name: 'toggle_blocks_editor' } ).check();
		const checkbox = await page.getByRole( 'checkbox' ).first();
		await checkbox.check();
		await page.getByRole( 'button', { name: 'Save Changes' } ).click();

		// Bulk delete existing events.
		await admin.visitAdminPage( 'edit.php', 'post_type=tribe_events' );
		await page.getByLabel( 'Select All' ).first().check();
		const bulkAction = await page
			.getByLabel( 'Select bulk action' )
			.first();
		if ( ( await bulkAction.count() ) > 0 ) {
			await bulkAction.selectOption( 'trash' );
			await page.getByRole( 'button', { name: 'Apply' } ).first().click();
		}
		
		// Create a past event via Block editor.
		await admin.createNewPost( {
			title: 'Past Test Event',
			postType: 'tribe_events',
			status: 'publish',
		} );

		await editor.openDocumentSettingsSidebar();
		await expect(
			page.getByRole( 'button', { name: 'The Event Attendee' } )
		).toBeVisible();

		// @TODO. Set event start date.

		// Publish
		await editor.publishPost();

		// Create a future event via Block editor.
		await admin.createNewPost( {
			title: 'Future Test Event',
			postType: 'tribe_events',
			status: 'publish',
		} );

		await editor.openDocumentSettingsSidebar();
		await expect(
			page.getByRole( 'button', { name: 'The Event Attendee' } )
		).toBeVisible();

		// @TODO. Set event start date.

		// Publish
		await editor.publishPost();
	});

	test('Query Loop block shows incorrect order in editor', async ({ admin, editor, page }) => {
		await admin.visitAdminPage('post-new.php');

		// Insert Query Loop block
		await editor.insertBlock( { name: 'core/query' } );
		await editor.canvas.click('Start blank');

		// Select tribe_events post type in the block inspector (assuming CPT is public and in REST)
		await editor.openBlockSettingsSidebar();

		// Change post type to tribe_events in block settings
		await editor.selectOptionInBlockSettingsSidebar('Post type', 'tribe_events');

		// Get visible block content
		const content = await editor.getEditedPostContent();

		// Check editor preview: does it show events in publish date order (not event date)?
		expect(content).toContain('Past Test Event');
		expect(content).toContain('Future Test Event');

		// Optionally: assert ordering
		const pastIndex = content.indexOf('Past Test Event');
		const futureIndex = content.indexOf('Future Test Event');
		expect(pastIndex).toBeLessThan(futureIndex); // i.e., publish date ordering
	});

	test('Query Loop block renders correctly on front end', async ({ admin, page }) => {
		const postId = await admin.createPost({
			title: 'Event Test Post',
			content: '<!-- wp:query {"postType":"tribe_events"} --><!-- /wp:query -->',
			status: 'publish',
		});

		await page.goto(`/index.php?p=${postId}`);
		const body = await page.textContent('body');

		// Expect both events.
		expect(body).toContain('Future Test Event');
		expect(body).toContain('Past Test Event');
	});
});