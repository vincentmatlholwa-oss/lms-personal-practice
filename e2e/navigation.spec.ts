import { test, expect } from "@playwright/test"

async function signIn(page, emailLabel: string) {
  await page.goto("/signin", { waitUntil: "networkidle" })
  await page.getByText(emailLabel).click()
  await page.getByRole("button", { name: /sign in/i }).click()
  await page.waitForURL("/dashboard", { timeout: 15000 })
}

test.describe("Role-based navigation", () => {
  test("admin sees all nav items", async ({ page }) => {
    await signIn(page, "admin@mdihub.com")
    await expect(page.getByRole("link", { name: /users/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole("link", { name: /analytics/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /courses/i }).first()).toBeVisible()
  })

  test("student does not see admin-only links", async ({ page }) => {
    await signIn(page, "john@email.com")
    await expect(page.getByRole("link", { name: /users/i })).not.toBeVisible()
    await expect(page.getByRole("link", { name: /analytics/i })).not.toBeVisible()
  })

  test("student sees study guides and certificates", async ({ page }) => {
    await signIn(page, "john@email.com")
    await expect(page.getByRole("link", { name: /study guides/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole("link", { name: /certificates/i })).toBeVisible()
  })

  test("facilitator sees facilitator-specific nav items", async ({ page }) => {
    await signIn(page, "mike@email.com")
    await expect(page.getByRole("link", { name: /courses/i }).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole("link", { name: /calendar/i })).toBeVisible()
  })
})

test.describe("Logout", () => {
  test("sign out returns to landing page", async ({ page }) => {
    await signIn(page, "admin@mdihub.com")
    const signOutButton = page.getByRole("button", { name: /sign out/i })
    await expect(signOutButton).toBeVisible({ timeout: 10000 })
    await signOutButton.click()
    await page.waitForURL("/signin", { timeout: 15000 })
    await expect(page.getByText("Welcome back", { exact: true })).toBeVisible({ timeout: 10000 })
  })
})
