import { test, expect } from "@playwright/test"

async function signInAsStudent(page) {
  await page.goto("/signin", { waitUntil: "networkidle" })
  await page.getByText("john@email.com").click()
  await page.getByRole("button", { name: /sign in/i }).click()
  // Navigate away from dashboard to clear sign-in toast
  await page.waitForURL("/dashboard", { timeout: 15000 })
  await page.goto("/my-courses", { waitUntil: "networkidle" })
  await page.waitForTimeout(1000)
}

test.describe("Chatbot", () => {
  test.beforeEach(async ({ page }) => {
    await signInAsStudent(page)
  })

  test("chatbot bubble is visible on app pages", async ({ page }) => {
    const chatButton = page.getByRole("button", { name: /open chat/i })
    await expect(chatButton).toBeVisible({ timeout: 10000 })
  })

  test("chatbot opens and shows welcome message", async ({ page }) => {
    await page.getByRole("button", { name: /open chat/i }).click({ force: true })
    await expect(page.getByText(/MDiHub AI assistant/i).first()).toBeVisible({ timeout: 5000 })
  })

  test("chatbot responds to greeting", async ({ page }) => {
    await page.getByRole("button", { name: /open chat/i }).click({ force: true })
    await page.waitForTimeout(500)
    const input = page.getByPlaceholder(/type your question/i)
    await input.fill("hello")
    await input.press("Enter")
    await expect(page.getByText(/How can I help/)).toBeVisible({ timeout: 10000 })
  })

  test("chatbot closes with Escape key", async ({ page }) => {
    await page.getByRole("button", { name: /open chat/i }).click({ force: true })
    await page.waitForTimeout(500)
    await expect(page.getByPlaceholder(/type your question/i)).toBeVisible({ timeout: 5000 })
    await page.keyboard.press("Escape")
    await page.waitForTimeout(500)
    await expect(page.getByPlaceholder(/type your question/i)).not.toBeVisible()
  })
})
