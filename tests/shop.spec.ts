import { expect, test } from "@playwright/test";

test.describe("BKC storefront — Hinglish tees", () => {
  test("home sells a printed tee, not a government portal", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("tee");
    await expect(page.getByRole("link", { name: /Shop the full catalogue/i })).toBeVisible();
  });

  test("shop catalogue is a real route", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Shop the full catalogue/i }).click();
    await expect(page).toHaveURL(/\/shop\/?/);
    await expect(page.getByText(/Shop everything/i)).toBeVisible();
  });
});
