import { expect, test } from "@playwright/test";

test("a shopper can add a tee to the bag and complete the demo checkout", async ({ page }) => {
  await page.goto("product/BKC-1001");
  await page.getByRole("button", { name: "L", exact: true }).click();
  await page.getByRole("button", { name: /^Add to bag/ }).click();

  const bag = page.getByRole("dialog", { name: /Your bag/i });
  await expect(bag).toBeVisible();
  await bag.getByRole("link", { name: "Checkout", exact: true }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole("heading", { name: /Almost yours/i })).toBeVisible();

  // Continuing with empty fields keeps the shopper on the contact step.
  await page.getByRole("button", { name: /^Continue/ }).click();
  await expect(page.getByLabel("Full name")).toBeVisible();

  await page.getByLabel("Full name").fill("Asha Rawat");
  await page.getByLabel("Email", { exact: true }).fill("asha@example.com");
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByRole("button", { name: /^Continue/ }).click();

  await page.getByLabel("House, street and area").fill("12 Mall Road");
  await page.getByLabel("City").fill("Nainital");
  await page.getByLabel("State").selectOption("Uttarakhand");
  await page.getByLabel("Pincode").fill("263001");
  await page.getByLabel(/^Express/).check();
  await page.getByRole("button", { name: /^Continue/ }).click();

  await page.getByLabel(/^Cash on delivery/).check();
  await page.getByRole("button", { name: /^Continue/ }).click();

  await expect(page.getByRole("heading", { name: "Review your order" })).toBeVisible();
  await page.getByRole("button", { name: /Place order/ }).click();

  await expect(page).toHaveURL(/\/order\/BKC-/);
  await expect(page.getByRole("heading", { name: /Thank you, Asha/i })).toBeVisible();
  await expect(page.getByText(/no payment was taken/i)).toBeVisible();

  await page.goto("account");
  await expect(page.getByRole("heading", { name: "Your account" })).toBeVisible();
  await expect(page.getByText(/^BKC-[A-Z0-9]+$/).first()).toBeVisible();
});
