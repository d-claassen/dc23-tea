import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Yoast SEO on Events archive', () => {
	test.beforeEach( async ( { page, admin } ) => {
		// Set a custom archive title for events in Yoast SEO.
		await admin.visitAdminPage( 'admin.php', 'page=wpseo_page_settings' );

		// Close ai modal.
		const aiModal = await page.getByText(
			'Optimize your SEO content with Yoast AI'
		);
		if ( ( await aiModal.count() ) > 0 ) {
			await page.getByRole( 'button', { name: 'Close' } ).click();
		}

		// Navigate to events settings.
		await page
			.locator( '#wpbody' )
			.getByRole( 'link', { name: 'Events' } )
			.click();

		// Find the archive SEO title.
		const titleLabel = await page.getByText( 'SEO title' ).nth( 1 );
		await titleLabel.waitFor( { state: 'visible' } );
		await titleLabel.click();

		// Clear and fill the SEO title.
		await page.keyboard.press( 'ControlOrMeta+A+Backspace' );
		await page.keyboard.type(
			'Test Event Archive Title %%sep%% %%sitename%%'
		);

		// Find the archive meta description.
		const descriptionLabel = await page.getByText( 'Meta description' ).nth( 1 );
		await descriptionLabel.waitFor( { state: 'visible' } );
		await descriptionLabel.click();

		// Clear and fill the SEO title.
		await page.keyboard.press( 'ControlOrMeta+A+Backspace' );
		await page.keyboard.type(
			'Test upcoming events on %%sitename%%'
		);

		// Save the changes.
		await page.getByRole( 'button', { name: 'Save changes' } ).click();
	} );

	test( 'SEO title does not reflect Yoast SEO setting', async ( {
		page,
	} ) => {
		await page.goto( '/?post_type=tribe_events' );
		const pageTitle = await page.title();

		expect( pageTitle ).toContain( 'Test Event Archive Title' );
	} );

	test( 'Meta description does not reflect Yoast SEO setting', async ( {
		page,
	} ) => {
		await page.goto( '/?post_type=tribe_events' );

		const metaDescription = await page.locator( 'head > meta[name="description"]' ).getAttribute( 'content' );
		expect( metaDescription ).toContain( 'Test upcoming events' );
	} );
} );
