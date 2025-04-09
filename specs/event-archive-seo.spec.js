import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('Yoast SEO on Events archive', () => {
	test.beforeEach(async ({ page, admin }) => {
		// Set a custom archive title for events in Yoast SEO
		await admin.visitAdminPage('admin.php', 'page=wpseo_page_settings#/post-type/events');
		await page.locator('#title-tribe_events-ptarchive').fill('Test Event Archive Title %%sep%% %%sitename%%');
		await page.locator('#submit').click();
	});

	test('SEO title does not reflect Yoast SEO setting', async ({ page }) => {
		await page.goto('/events/');
		const pageTitle = await page.title();

		expect(pageTitle).not.toContain('Test Event Archive Title');
	});
});