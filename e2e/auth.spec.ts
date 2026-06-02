import { test, expect } from "@playwright/test"

async function signIn(page, emailLabel: string) {
  await page.goto("/signin", { waitUntil: "networkidle" })
  await page.getByText(emailLabel).click()
  await page.getByRole("button", { name: /sign in/i }).click()
  await page.waitForURL("/dashboard", { timeout: 15000 })
}

test.describe("Sign In", () => {
  test("signs in with admin credentials", async ({ page }) => {
    await signIn(page, "admin@mdihub.com")
    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test("signs in with student credentials", async ({ page }) => {
    await signIn(page, "john@email.com")
    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test("signs in with facilitator credentials", async ({ page }) => {
    await signIn(page, "mike@email.com")
    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test("shows error with invalid credentials", async ({ page }) => {
    await page.goto("/signin", { waitUntil: "networkidle" })
    await page.getByLabel(/email/i).fill("nonexistent@test.com")
    await page.getByLabel(/password/i).fill("wrongpassword")
    await page.getByRole("button", { name: /sign in/i }).click()
    const toast = page.getByText(/invalid email or password/i)
    await expect(toast).toBeVisible({ timeout: 5000 })
  })

  test("shows validation for empty fields", async ({ page }) => {
    await page.goto("/signin", { waitUntil: "networkidle" })
    await page.getByRole("button", { name: /sign in/i }).click()
    const emailError = page.getByText(/email is required/i)
    await expect(emailError).toBeVisible({ timeout: 3000 })
  })

  test("forgot password flow", async ({ page }) => {
    await page.goto("/signin", { waitUntil: "networkidle" })
    await page.getByText(/forgot password/i).click()
    await page.getByLabel(/email/i).fill("john@email.com")
    await page.getByRole("button", { name: /send reset/i }).click()
    await expect(page.getByText(/check your email/i)).toBeVisible({ timeout: 5000 })
  })
})

test.describe("Registration", () => {
  test("shows registration form", async ({ page }) => {
    await page.goto("/signin", { waitUntil: "networkidle" })
    await page.getByRole("button", { name: /register/i }).click()
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible({ timeout: 5000 })
  })

  test("registers a new student account", async ({ page }) => {
    await page.goto("/signin", { waitUntil: "networkidle" })
    await page.getByRole("button", { name: /register/i }).click()
    await page.getByLabel(/first name/i).fill("Test")
    await page.getByLabel(/last name/i).fill("User")
    const email = `e2e-user-${Date.now()}@test.com`
    await page.getByLabel(/email address/i).fill(email)
    await page.getByLabel(/password/i).fill("test1234")
    await page.getByLabel(/phone/i).fill("0111111111")
    await page.getByLabel(/id number/i).fill("E2E001")
    await page.getByRole("button", { name: /create account/i }).click()
    await page.waitForURL("/dashboard", { timeout: 15000 })
  })

  test("shows registration validation errors", async ({ page }) => {
    await page.goto("/signin", { waitUntil: "networkidle" })
    await page.getByRole("button", { name: /register/i }).click()
    await page.getByRole("button", { name: /create account/i }).click()
    await expect(page.getByText(/first name is required/i)).toBeVisible({ timeout: 3000 })
  })

  test("shows facilitator extra fields on role select", async ({ page }) => {
    await page.goto("/signin", { waitUntil: "networkidle" })
    await page.getByRole("button", { name: /register/i }).click()
    await page.locator("#reg-role").click()
    await page.getByRole("option", { name: /facilitator/i }).click()
    await expect(page.locator("#reg-subject")).toBeVisible({ timeout: 5000 })
    await expect(page.locator("#reg-qualifications")).toBeVisible()
  })
})
