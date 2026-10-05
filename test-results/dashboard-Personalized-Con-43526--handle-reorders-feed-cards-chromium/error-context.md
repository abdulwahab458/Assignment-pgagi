# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Personalized Content Dashboard >> drag handle reorders feed cards
- Location: e2e\dashboard.spec.ts:33:7

# Error details

```
Error: expect(received).not.toEqual(expected) // deep equality

Expected: not "AI Assistants Reshape Developer Workflows"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]
  - alert [ref=e11]
  - generic [ref=e12]:
    - complementary [ref=e13]:
      - paragraph [ref=e14]: Navigation
      - navigation "Main" [ref=e15]:
        - button "Feed" [ref=e16]:
          - generic [aria-hidden] [ref=e17]: ◎
          - text: Feed
        - button "Trending" [ref=e18]:
          - generic [aria-hidden] [ref=e19]: ↑
          - text: Trending
        - button "Favorites" [ref=e20]:
          - generic [aria-hidden] [ref=e21]: ★
          - text: Favorites
        - button "Settings" [ref=e22]:
          - generic [aria-hidden] [ref=e23]: ⚙
          - text: Settings
    - generic [ref=e24]:
      - banner [ref=e25]:
        - generic [ref=e26]:
          - paragraph [ref=e27]: Personalized Dashboard
          - heading "Welcome, Guest User" [level=1] [ref=e28]
        - generic [ref=e29]:
          - generic [ref=e30]: Search content
          - searchbox "Search content" [ref=e31]
        - generic [ref=e32]:
          - button "Switch to dark mode" [ref=e33]: ☾ Dark
          - generic [aria-hidden] [ref=e34]: G
      - main [ref=e35]:
        - region [ref=e36]:
          - generic [ref=e37]:
            - heading "Your feed" [level=2] [ref=e38]
            - paragraph [ref=e39]: News, recommendations, and social posts tailored to your preferences. Drag cards by the handle to reorder.
          - list [ref=e40]:
            - listitem [ref=e41]:
              - article [ref=e43]:
                - generic [ref=e44]: News
                - generic [ref=e46]:
                  - generic [ref=e47]:
                    - heading "AI Assistants Reshape Developer Workflows" [level=3] [ref=e48]
                    - button "Drag to reorder" [active] [ref=e49]: ⋮⋮
                  - paragraph [ref=e50]: Teams report faster prototyping as coding agents integrate with CI pipelines.
                  - generic [ref=e51]:
                    - link "Read More" [ref=e52] [cursor=pointer]:
                      - /url: https://example.com/news/ai-dev
                    - button "☆ Favorite" [ref=e53]
            - listitem [ref=e54]:
              - article [ref=e56]:
                - generic [ref=e57]: News
                - generic [ref=e59]:
                  - generic [ref=e60]:
                    - heading "Quantum Networking Milestone Announced" [level=3] [ref=e61]
                    - button "Drag to reorder" [ref=e62]: ⋮⋮
                  - paragraph [ref=e63]: Researchers demonstrate stable entanglement over metropolitan distances.
                  - generic [ref=e64]:
                    - link "Read More" [ref=e65] [cursor=pointer]:
                      - /url: https://example.com/news/quantum
                    - button "☆ Favorite" [ref=e66]
            - listitem [ref=e67]:
              - article [ref=e69]:
                - generic [ref=e70]: News
                - generic [ref=e72]:
                  - generic [ref=e73]:
                    - heading "Streaming Giant Greenlights Sci-Fi Anthology" [level=3] [ref=e74]
                    - button "Drag to reorder" [ref=e75]: ⋮⋮
                  - paragraph [ref=e76]: Award-winning creators join an eight-episode limited series.
                  - generic [ref=e77]:
                    - link "Read More" [ref=e78] [cursor=pointer]:
                      - /url: https://example.com/news/streaming
                    - button "☆ Favorite" [ref=e79]
            - listitem [ref=e80]:
              - article [ref=e82]:
                - generic [ref=e83]: Movies
                - generic [ref=e85]:
                  - generic [ref=e86]:
                    - heading "Neon Horizon" [level=3] [ref=e87]
                    - button "Drag to reorder" [ref=e88]: ⋮⋮
                  - paragraph [ref=e89]: A pilot discovers a signal that could rewrite human history.
                  - generic [ref=e90]:
                    - link "View Details" [ref=e91] [cursor=pointer]:
                      - /url: https://www.themoviedb.org/
                    - button "☆ Favorite" [ref=e92]
            - listitem [ref=e93]:
              - article [ref=e95]:
                - generic [ref=e96]: Movies
                - generic [ref=e98]:
                  - generic [ref=e99]:
                    - heading "The Last Archive" [level=3] [ref=e100]
                    - button "Drag to reorder" [ref=e101]: ⋮⋮
                  - paragraph [ref=e102]: Librarians race to preserve culture before a global blackout.
                  - generic [ref=e103]:
                    - link "View Details" [ref=e104] [cursor=pointer]:
                      - /url: https://www.themoviedb.org/
                    - button "☆ Favorite" [ref=e105]
            - listitem [ref=e106]:
              - article [ref=e108]:
                - generic [ref=e109]: Movies
                - generic [ref=e111]:
                  - generic [ref=e112]:
                    - heading "Circuit Breaker" [level=3] [ref=e113]
                    - button "Drag to reorder" [ref=e114]: ⋮⋮
                  - paragraph [ref=e115]: Hackers and regulators collide in a near-future thriller.
                  - generic [ref=e116]:
                    - link "View Details" [ref=e117] [cursor=pointer]:
                      - /url: https://www.themoviedb.org/
                    - button "☆ Favorite" [ref=e118]
          - status [ref=e119]: Draggable item mock-news-tech-1 was dropped over droppable area mock-news-tech-1
          - button "Refresh feed" [disabled] [ref=e121]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Personalized Content Dashboard", () => {
  4  |   test("loads feed and navigates sections", async ({ page }) => {
  5  |     await page.goto("/");
  6  |     await expect(page.getByRole("heading", { name: /Your feed/i })).toBeVisible({
  7  |       timeout: 15_000,
  8  |     });
  9  | 
  10 |     await page.getByRole("button", { name: "Trending" }).click();
  11 |     await expect(
  12 |       page.getByRole("heading", { name: /Trending now/i }),
  13 |     ).toBeVisible();
  14 | 
  15 |     await page.getByRole("button", { name: "Settings" }).click();
  16 |     await expect(page.getByRole("heading", { name: /Settings/i })).toBeVisible();
  17 |   });
  18 | 
  19 |   test("debounced search shows results section", async ({ page }) => {
  20 |     await page.goto("/");
  21 |     await page.getByRole("searchbox").fill("AI");
  22 |     await expect(page.getByRole("heading", { name: /Search results/i })).toBeVisible({
  23 |       timeout: 10_000,
  24 |     });
  25 |   });
  26 | 
  27 |   test("dark mode toggle updates html class", async ({ page }) => {
  28 |     await page.goto("/");
  29 |     await page.getByRole("button", { name: /Switch to dark mode/i }).click();
  30 |     await expect(page.locator("html")).toHaveClass(/dark/);
  31 |   });
  32 | 
  33 |   test("drag handle reorders feed cards", async ({ page }) => {
  34 |     await page.goto("/");
  35 |     await expect(page.getByRole("heading", { name: /Your feed/i })).toBeVisible({
  36 |       timeout: 15_000,
  37 |     });
  38 |     const handles = page.getByRole("button", { name: "Drag to reorder" });
  39 |     await expect(handles.first()).toBeVisible();
  40 |     const count = await handles.count();
  41 |     expect(count).toBeGreaterThan(1);
  42 |     const firstTitle = await page.locator("article h3").first().textContent();
  43 |     const secondHandle = handles.nth(1);
  44 |     const firstHandle = handles.first();
  45 |     await firstHandle.dragTo(secondHandle);
  46 |     const newFirstTitle = await page.locator("article h3").first().textContent();
> 47 |     expect(newFirstTitle).not.toEqual(firstTitle);
     |                               ^ Error: expect(received).not.toEqual(expected) // deep equality
  48 |   });
  49 | 
  50 |   test("favorite flow", async ({ page }) => {
  51 |     await page.goto("/");
  52 |     await expect(page.getByRole("heading", { name: /Your feed/i })).toBeVisible({
  53 |       timeout: 15_000,
  54 |     });
  55 |     const favBtn = page.getByRole("button", { name: "☆ Favorite" }).first();
  56 |     await favBtn.click();
  57 |     await page.getByRole("button", { name: "Favorites" }).click();
  58 |     await expect(page.getByRole("button", { name: /Favorited/i }).first()).toBeVisible();
  59 |   });
  60 | });
  61 | 
```