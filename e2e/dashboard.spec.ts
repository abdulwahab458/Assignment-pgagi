import { test, expect } from "@playwright/test";

test.describe("Personalized Content Dashboard", () => {
  test("loads feed and navigates sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Your feed/i })).toBeVisible({
      timeout: 15_000,
    });

    await page.getByRole("button", { name: "Trending" }).click();
    await expect(
      page.getByRole("heading", { name: /Trending now/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Settings" }).click();
    await expect(page.getByRole("heading", { name: /Settings/i })).toBeVisible();
  });

  test("debounced search shows results section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("searchbox").fill("AI");
    await expect(page.getByRole("heading", { name: /Search results/i })).toBeVisible({
      timeout: 10_000,
    });
  });

  test("dark mode toggle updates html class", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Switch to dark mode/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("drag handle reorders feed cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Your feed/i })).toBeVisible({
      timeout: 15_000,
    });
    const titles = page.locator("article h3");
    await expect(titles.first()).toBeVisible();
    const firstTitle = await titles.nth(0).textContent();
    const handle = page.getByRole("button", { name: "Drag to reorder" }).first();
    const target = page.getByRole("button", { name: "Drag to reorder" }).nth(1);
    const from = await handle.boundingBox();
    const to = await target.boundingBox();
    if (!from || !to) throw new Error("Missing drag targets");
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 15 });
    await page.mouse.up();
    await expect(titles.first()).not.toHaveText(firstTitle ?? "");
  });

  test("favorite flow", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Your feed/i })).toBeVisible({
      timeout: 15_000,
    });
    const favBtn = page.getByRole("button", { name: "☆ Favorite" }).first();
    await favBtn.click();
    await page.getByRole("button", { name: "Favorites" }).click();
    await expect(page.getByRole("button", { name: /Favorited/i }).first()).toBeVisible();
  });
});
