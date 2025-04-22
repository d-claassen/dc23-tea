import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('Yoast SEO on Events archive', () => {
	test.beforeEach(async ({ page, admin }) => {
		// Set a custom archive title for events in Yoast SEO.
		await admin.visitAdminPage('admin.php', 'page=wpseo_page_settings');

		// Close ai modal.
		const aiModal = await page.getByText('Optimize your SEO content with Yoast AI' );
		if ( await aiModal.count() > 0 ) {
			await page.getByRole('button', { name: 'Close' }).click();
		}

		// Navigate to events settings.
		await page.locator('#wpbody').getByRole('link', { name: 'Events' }).click();

		// Find the archive SEO title.
		const label = await page.getByText('SEO title').nth(1);
		await label.waitFor({ state: 'visible' });
		await label.click();

		// Clear and fill the SEO title.
		await page.keyboard.press('ControlOrMeta+A+Backspace');
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
