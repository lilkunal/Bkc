import { expect, test } from "@playwright/test";

test("quick view adds to the bag, and the heart saves to the wishlist", async ({ page }) => {
  await page.goto("shop");
  const card = page.locator("article").first();
  await card.hover();

  await card.getByRole("button", { name: /Save .* to wishlist/ }).click();
  await expect(page.getByRole("link", { name: "Wishlist, 1 saved" })).toBeVisible();

  await card.getByRole("button", { name: /Quick view/ }).click();
  const quick = page.getByRole("dialog", { name: /Bharat Ka/ });
  await expect(quick).toBeVisible();
  await quick.getByRole("button", { name: "Add to bag" }).click();
  await expect(quick.getByRole("status")).toHaveText("Pick a size first.");
  await quick.getByRole("button", { name: "M", exact: true }).click();
  await quick.getByRole("button", { name: "Add to bag" }).click();
  await expect(page.getByRole("dialog", { name: /Your bag \(1\)/ })).toBeVisible();

  await page.goto("wishlist");
  await expect(page.getByRole("heading", { name: "Your wishlist" })).toBeVisible();
  await expect(page.locator("article")).toHaveCount(1);
});

test("product reviews can be searched and filtered by topic", async ({ page }) => {
  await page.goto("product/BKC-1007");
  const reviews = page.locator("#reviews");
  await expect(reviews.getByRole("heading", { name: "Reviews" })).toBeVisible();

  await reviews.getByLabel("Search reviews").fill("exchange");
  await expect(reviews.getByText(/matching review/)).toHaveText("Showing 2 of 2 matching reviews");
  await expect(reviews.locator("mark").first()).toHaveText(/exchange/i);

  await reviews.getByLabel("Search reviews").fill("");
  await reviews.getByRole("button", { name: /^size/ }).click();
  await expect(reviews.getByText(/matching review/)).toHaveText("Showing 3 of 3 matching reviews");
});

test("price bands filter the shop from the URL", async ({ page }) => {
  await page.goto("shop?under=700");
  await expect(page.locator("#f-under")).toHaveValue("700");
  const prices = await page.locator("article .price > span").allTextContents();
  expect(prices.length).toBeGreaterThan(0);
  for (const price of prices) expect(Number(price.replace(/[^\d]/g, ""))).toBeLessThan(700);
});

test("home shows the 3D collection ring, or a product row without WebGL", async ({ page }) => {
  await page.goto("");
  const ring = page.locator("section", { has: page.getByRole("heading", { name: "Spin the collection" }) });
  await ring.scrollIntoViewIfNeeded();
  await expect(ring.locator("canvas.opacity-100").or(ring.locator("article").first())).toBeVisible({ timeout: 15000 });

  if (await ring.locator("canvas").count()) {
    await expect(ring.getByText("01 / 10")).toBeVisible();
    await ring.getByRole("button", { name: "Next design" }).click();
    await expect(ring.getByText("02 / 10")).toBeVisible();
  } else {
    await expect(ring.locator("article")).toHaveCount(4);
  }
});

test("the theme picker restyles the store and remembers the choice", async ({ page }) => {
  await page.goto("shop");
  await page.getByRole("button", { name: "Theme" }).click();
  await page.getByRole("radio", { name: /Frost/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "frost");
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(238, 242, 245)");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "frost");
});

test("header search suggests products as you type", async ({ page }) => {
  await page.goto("");
  await page.getByRole("button", { name: "Search the catalogue" }).click();
  const box = page.getByRole("combobox", { name: "Search the catalogue" });
  await box.fill("chai pe");
  await expect(page.getByRole("option", { name: /Chai Pe Charcha/ })).toBeVisible();
  await box.press("Enter");
  await expect(page).toHaveURL(/\/product\/BKC-1005$/);
});

test("a coupon code discounts the bag", async ({ page }) => {
  await page.goto("product/BKC-1002");
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: /^Add to bag/ }).click();
  await page.goto("cart");
  await page.getByLabel("Coupon code").fill("bkc10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText("BKC10 applied")).toBeVisible();
  await expect(page.getByTestId("discount")).toHaveText("−₹90");
});
