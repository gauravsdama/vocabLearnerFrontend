import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("marketing page loads", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Habit-building vocabulary review")).toBeVisible();
  await expect(page.getByRole("link", { name: "VocabCat home" })).toBeVisible();
});

test("protected settings route redirects unauthenticated users to login", async ({ page }) => {
  await page.goto("/settings");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Log in to keep learning." })).toBeVisible();
});

test("verify-email route fails safely when token is missing", async ({ page }) => {
  await page.goto("/verify-email");

  await expect(page.getByText("We could not verify this link.")).toBeVisible();
  await expect(page.getByText("This verification link is missing a token.")).toBeVisible();
});

test("verify-email route fails safely when backend rejects the token", async ({ page }) => {
  await page.route("**/api/v1/auth/verify-email?token=bad-token", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        error: {
          code: "invalid_verification_token",
          message: "This verification link is invalid or expired.",
        },
      }),
    });
  });

  await page.goto("/verify-email?token=bad-token");

  await expect(page.getByText("We could not verify this link.")).toBeVisible();
  await expect(page.getByText("This verification link is invalid or expired.")).toBeVisible();
});

test("reset-password route fails safely when the token is missing", async ({ page }) => {
  await page.goto("/reset-password");

  await page.getByLabel("New password").fill("NewPassword123");
  await page.getByLabel("Confirm password").fill("NewPassword123");
  await page.getByRole("button", { name: "Update password" }).click();

  await expect(page.getByText("This reset link is missing a token.")).toBeVisible();
});

for (const route of ["/", "/privacy", "/terms", "/accessibility"]) {
  test(`${route} has no serious accessibility violations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([]);
  });

  test(`${route} fits a narrow phone viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
