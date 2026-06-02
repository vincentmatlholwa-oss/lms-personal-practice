import { test, expect } from "@playwright/test"

async function signInAsAdmin(page) {
  await page.goto("/signin", { waitUntil: "networkidle" })
  await page.getByText("admin@mdihub.com").click()
  await page.getByRole("button", { name: /sign in/i }).click()
  await page.waitForURL("/dashboard", { timeout: 15000 })
}

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await signInAsAdmin(page)
  })

  test("displays dashboard with key sections", async ({ page }) => {
    await expect(page.getByRole("main")).toBeVisible({ timeout: 10000 })
  })

  test("can navigate to courses", async ({ page }) => {
    await page.getByRole("link", { name: /courses/i }).first().click()
    await page.waitForURL(/\/courses$/, { timeout: 15000 })
  })

  test("can navigate to users (admin only)", async ({ page }) => {
    await page.getByRole("link", { name: /users/i }).click()
    await page.waitForURL("/users", { timeout: 15000 })
  })

  test("can navigate to analytics (admin only)", async ({ page }) => {
    await page.getByRole("link", { name: /analytics/i }).click()
    await page.waitForURL("/analytics", { timeout: 15000 })
  })

  test("profile page accessible", async ({ page }) => {
    await page.getByRole("link", { name: /profile/i }).click()
    await page.waitForURL("/profile", { timeout: 15000 })
    await expect(page.getByRole("heading", { name: /profile/i })).toBeVisible({ timeout: 10000 })
  })

  test("settings page accessible", async ({ page }) => {
    await page.getByRole("link", { name: /settings/i }).click()
    await page.waitForURL("/settings", { timeout: 15000 })
  })
})
