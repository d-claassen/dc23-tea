import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import { dateI18n } from '@wordpress/date';

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

		const startDate = new Date();
		const labelToday = dateI18n( 'F j, Y', startDate );

		// Create a past event via Block editor.
		await admin.createNewPost( {
			title: 'Past Test Event',
			postType: 'tribe_events',
			status: 'publish',
		} );

		await editor.openDocumentSettingsSidebar();
		const sectionButton = await page.getByRole( 'button', { name: 'The Event Attendee' } );
		await expect( sectionButton ).toBeVisible();
		// Open section if needed
		if ( ( await sectionButton.getAttribute( 'aria-expanded' ) ) === 'false' ) {
			await sectionButton.click();
		}

		// Set past event start date.
		await page
			.getByRole( 'button', { name: labelToday } )
			.first().click();

		// Change the publishing date to a year in the past.
		await page
			.getByRole( 'group', { name: 'Date' } )
			.getByRole( 'spinbutton', { name: 'Year' } )
			.click();
		await page.keyboard.press( 'ArrowDown' );
		await page.keyboard.press( 'Escape' );

		// Set past event end date.
		await page
			.getByRole( 'button', { name: labelToday } )
			.first().click();
			
		// Change the publishing date to a year in the past.
		await page
			.getByRole( 'group', { name: 'Date' } )
			.getByRole( 'spinbutton', { name: 'Year' } )
			.click();
		await page.keyboard.press( 'ArrowDown' );
		await page.keyboard.press( 'Escape' );
		// Publish
		await editor.publishPost();

		// Create a future event via Block editor.
		await admin.createNewPost( {
			title: 'Future Test Event',
			postType: 'tribe_events',
			status: 'publish',
		} );

		await editor.openDocumentSettingsSidebar();

		// Set event start date.
		await page
			.getByRole( 'button', { name: labelToday } )
			.first().click();

		// Change the publishing date to a year in the future.
		await page
			.getByRole( 'group', { name: 'Date' } )
			.getByRole( 'spinbutton', { name: 'Year' } )
			.click();
		await page.keyboard.press( 'ArrowUp' );
		await page.keyboard.press( 'Escape' );

		// Set event end date.
		const endDatePicker = page.getByRole( 'button', {
			name: labelToday,
		} );
		await endDatePicker.first().click();

		// Change the publishing date to a year in the future.
		await page
			.getByRole( 'group', { name: 'Date' } )
			.getByRole( 'spinbutton', { name: 'Year' } )
			.click();
		await page.keyboard.press( 'ArrowUp' );
		await page.keyboard.press( 'Escape' );

		// Publish
		await editor.publishPost();
	});

	test('Query Loop block shows incorrect order in editor', async ({ admin, editor, page }) => {
		// await admin.visitAdminPage('post-new.php');
		await admin.createNewPost( {
			postType: 'page',
			title: 'Query Page',
		} );

		// Insert Query Loop block
		await editor.insertBlock( { name: 'core/query' } );
		// await editor.canvas
		await page
			.getByRole( 'document', { name: 'Block: Query Loop' } )
			.getByRole( 'button', { name: 'Start blank' } )
			.click();
		await page
			.getByLabel('Title & Date')
			.click();

		// Open sidebar and expect Block tab to be shown.
		await editor.openDocumentSettingsSidebar();
		await expect(
			page
				.getByRole( 'region', { name: 'Editor settings' } )
				.getByRole( 'tab', { selected: true } )
		).toHaveText( 'Block' );

		// change to custom query type
		const queryTypeSelector = page
			.getByRole( 'region', { name: 'Settings' } )
			.getByLabel( 'Custom' );
		await queryTypeSelector.click();

		// Change post type to tribe_events in block settings
		const postTypeSelector = page
			.getByRole( 'region', { name: 'Settings' } )
			.getByLabel( 'Post type' );
		await postTypeSelector.click();
		await postTypeSelector.selectOption('Event');

		await expect(
			page.getByRole( 'document', { name: 'Block: Query Loop' } )
		).toContainText( 'Future Test Event')

		await expect(
			page.getByRole( 'document', { name: 'Block: Query Loop' } )
		).toContainText( 'Past Test Event')
	});

	test('Query Loop block renders correctly on front end', async ({ admin, page, requestUtils }) => {
		const { id: postId } = await requestUtils.createPost({
			title: 'Event Test Post',
			content: '<!-- wp:query {"query":{"postType":"tribe_events"}} -->'
				+ '<div class="wp-block-query"><!-- wp:post-template -->'
				+ '<!-- wp:post-title /-->'
				+ '<!-- wp:post-date /-->'
				+ '<!-- /wp:post-template --></div>'
				+ '<!-- /wp:query -->',
			status: 'publish',
		});

		await page.goto(`/index.php?p=${postId}`);
		const body = await page.textContent('body');

		// Expect both events.
		expect(body).toContain('Future Test Event');
		expect(body).toContain('Past Test Event');
	});
});
