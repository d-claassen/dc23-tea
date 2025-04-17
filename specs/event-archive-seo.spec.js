import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('Yoast SEO on Events archive', () => {
	test.beforeEach(async ({ page, admin }) => {
		// Set a custom archive title for events in Yoast SEO
		await admin.visitAdminPage('admin.php', 'page=wpseo_page_settings#/post-type/events');
		
		// close ai modal
		const aiModal = await page.getByText('Optimize your SEO content with Yoast AI' );
		if ( await aiModal.count() > 0 ) {
			await page.getByRole('button', { name: 'Close' }).click();
		}
		
		console.log({ url: await page.url() });

		//Navigate to events settings.
		await page.getByRole('link', { name: 'Events' }).click();

		// Fill the SEO title
		const label = await page.getByText('SEO title');
		await label.waitFor({ state: 'visible' });
		await label.click();
		await page.keyboard.type('Test Event Archive Title %%sep%% %%sitename%%');
		
		// Save the changes.
		await page.getByRole('button', { name: 'Save changes' }).click();
	});
	
	test.afterEach(async ({ page }) => {
		const log = await page.evaluate(async () => {
			const res = await fetch('/wp-content/debug-events.log');
			return await res.text();
		});
		console.log(log);
	});

	test('SEO title does not reflect Yoast SEO setting', async ({ page }) => {
		await page.goto('/?post_type=tribe_events');
		const pageTitle = await page.title();

		expect(pageTitle).toContain('Test Event Archive Title');
	});
});
