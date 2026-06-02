import { test, expect } from "@playwright/test"

test("landing page loads and shows key elements", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" })
  await expect(page.getByRole("heading", { name: /learn, teach/i })).toBeVisible({ timeout: 15000 })
  await expect(page.getByRole("link", { name: "MDiHub" }).first()).toBeVisible()
  await expect(page.getByRole("link", { name: "Get started", exact: true }).first()).toBeVisible()
})

test("landing page features section exists", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" })
  await page.getByRole("link", { name: "Explore features" }).click()
  await expect(page.getByRole("heading", { name: "Everything you need" })).toBeVisible({ timeout: 10000 })
})

test("landing page shows stats", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" })
  const statsSection = page.locator("section").filter({ hasText: "Active Courses" }).first()
  await statsSection.scrollIntoViewIfNeeded()
  await expect(statsSection.getByText("Active Courses")).toBeVisible({ timeout: 10000 })
  await expect(statsSection.getByText("Students Enrolled")).toBeVisible()
  await expect(statsSection.getByText("Facilitators", { exact: true })).toBeVisible()
})

test("landing page how-it-works section", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" })
  await page.getByRole("heading", { name: "How it works" }).scrollIntoViewIfNeeded()
  await expect(page.getByRole("heading", { name: "How it works" })).toBeVisible({ timeout: 10000 })
  await expect(page.getByText("Sign Up", { exact: true })).toBeVisible()
})

test("navigate to sign in from landing", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" })
  await page.getByRole("link", { name: /sign in/i }).first().click()
  await page.waitForURL("/signin", { timeout: 15000 })
  await expect(page.getByText("Welcome back", { exact: true })).toBeVisible({ timeout: 10000 })
})
