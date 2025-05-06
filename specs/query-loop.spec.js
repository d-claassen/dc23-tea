import { test, expect } from '@playwright/test';
import { createPost, visitAdminPage, insertBlock, publishPost, setPostContent } from '@wordpress/e2e-test-utils-playwright';

test.describe('Query Loop block with tribe_events', () => {
	test.beforeEach(async ({ page }) => {
		// Login as admin
		await page.goto('/wp-login.php');
		await page.fill('#user_login', 'admin');
		await page.fill('#user_pass', 'password');
		await page.click('#wp-submit');

		// Create some events via REST API or wp.data.dispatch
		await page.evaluate(async () => {
			const createEvent = (title, startDate) => {
				return fetch('/wp-json/wp/v2/tribe_events', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Basic ' + btoa('admin:password'),
					},
					body: JSON.stringify({
						title: title,
						status: 'publish',
						meta: {
							_EventStartDate: startDate,
						},
					}),
				});
			};

			await createEvent('Past Event', '2023-01-01 10:00:00');
			await createEvent('Future Event', '2099-01-01 10:00:00');
		});
	});

	test('Query Loop block shows incorrect order in editor', async ({ page }) => {
		await visitAdminPage(page, 'post-new.php');

		// Insert Query Loop block
		await insertBlock(page, 'Query Loop');
		await page.click('text=Start blank');

		// Select tribe_events post type in the block inspector (assuming CPT is public and in REST)
		await page.click('[aria-label="Display settings"]');
		await page.selectOption('select[name="postType"]', 'tribe_events');

		// Check editor preview: does it show events in publish date order (not event date)?
		const preview = page.locator('.block-editor-block-list__block');
		const content = await preview.textContent();

		expect(content).toContain('Past Event');
		expect(content).toContain('Future Event');

		// Optionally: assert ordering
		const pastIndex = content.indexOf('Past Event');
		const futureIndex = content.indexOf('Future Event');
		expect(pastIndex).toBeLessThan(futureIndex); // i.e., publish date ordering
	});

	test('Query Loop block renders correctly on front end', async ({ page }) => {
		const postId = await createPost({
			title: 'Event Test Post',
			content: '<!-- wp:query {"postType":"tribe_events"} --><!-- /wp:query -->',
			status: 'publish',
		});

		await page.goto(`/index.php?p=${postId}`);
		const body = await page.textContent('body');

		// If pre_get_posts fix is in place, it should not show the past event
		expect(body).toContain('Future Event');
		expect(body).not.toContain('Past Event');
	});
});