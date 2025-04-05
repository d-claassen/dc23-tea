test('Verify "At a Glance" widget presence', async ({ page, admin }) => {
  // Navigate to the WordPress admin dashboard
  await admin.visitAdminPage('index.php');

  // Assert that the "At a Glance" widget is visible
  await expect(page.locator('#dashboard_right_now')).toBeVisible();
});