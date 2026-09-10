import { expect, test } from "@playwright/test";

test.describe("BKC storefront — Hinglish tees", () => {
  test("home sells a printed tee, not a government portal", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(/from gaali/i);
    await expect(page.getByText(/240 GSM tees/i).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Shop the collection/i })).toBeVisible();
  });

  test("shop catalogue is a real route", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Shop the collection/i }).click();
    await expect(page).toHaveURL(/\/shop\/?/);
    await expect(page.getByRole("heading", { name: /Shop everything/i })).toBeVisible();
  });
});
