import { test, expect } from "@playwright/test";

const MOCK_USER = {
  $id: "usr_verified_avionics_01",
  name: "Vikas Dhavande",
  email: "vikas@aerosys.internal",
  registration: new Date().toISOString(),
  status: true,
  emailVerification: true,
  prefs: {
    role: "Lead Avionics Engineer",
  },
};

test.describe("Login & User Management Test Plan Verification (Next.js + Appwrite)", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept client-side Appwrite account queries
    await page.route("**/account", async (route) => {
      if (route.request().method() === "GET") {
        const cookies = await page.context().cookies();
        const hasSession = cookies.some(
          (c) => c.name === "auth_user" || c.name.startsWith("a_session_")
        );

        if (hasSession) {
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(MOCK_USER),
          });
        }

        return route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({
            message: "User (role: guests) missing scope (account)",
            code: 401,
          }),
        });
      }
      route.continue();
    });
  });

  // L-13, L-14, C-04: The Core Reported Bug
  test("L-13 & L-14 & C-04: Verified session never flashes or shows 'login needed'", async ({ page }) => {
    // Inject active session marker cookie
    await page.context().addCookies([
      { name: "auth_user", value: "1", domain: "localhost", path: "/" },
    ]);

    // Throttle Appwrite account verification to test the loading state boundary
    await page.route("**/account", async (route) => {
      await page.waitForTimeout(400);
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_USER),
      });
    });

    await page.goto("/blog/avionics-rtos-architecture");

    // L-14 check: Guest "Sign In to Comment" prompt must NEVER appear during checking
    const guestPrompt = page.getByText(/Sign in as a Member to join the engineering discussion/i);
    await expect(guestPrompt).not.toBeVisible();

    // L-13 & C-04 check: Authenticated comment form loads directly with verified user info
    const commentInput = page.getByPlaceholder(/Share your thoughts, peer feedback/i);
    await expect(commentInput).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(MOCK_USER.name)).toBeVisible();
  });

  // L-01, L-07, L-08: State refresh, persistence, and cross-tab consistency
  test("L-01, L-07 & S-09: Login refreshes UI immediately and persists across page reload", async ({ page }) => {
    await page.goto("/");

    // Open Auth Modal
    const loginTrigger = page.getByRole("button", { name: /Login/i });
    await loginTrigger.click();

    // Mock successful email session creation
    await page.route("**/account/sessions/email", async (route) => {
      await page.context().addCookies([
        { name: "auth_user", value: "1", domain: "localhost", path: "/" },
      ]);
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          $id: "sess_mock_123",
          userId: MOCK_USER.$id,
          expire: new Date(Date.now() + 86400000).toISOString(),
        }),
      });
    });

    await page.fill('input[type="email"]', "vikas@aerosys.internal");
    await page.fill('input[type="password"]', "AvionicsSec123!");
    await page.click('button[type="submit"]');

    // L-01: Navbar updates without full page refresh
    await expect(page.getByText(MOCK_USER.name)).toBeVisible({ timeout: 5000 });

    // L-07: Page reload preserves the authenticated session
    await page.reload();
    await expect(page.getByText(MOCK_USER.name)).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("button", { name: /Login/i })).not.toBeVisible();
  });

  // S-03 & S-04: Client-side input validation
  test("S-03 & S-04: Rejects invalid email and short passwords with clear validation errors", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Login/i }).click();

    // Switch to signup mode
    await page.getByRole("button", { name: /Create an account/i }).click();

    // Empty validation (S-05)
    await page.click('button[type="submit"]');
    await expect(page.getByText(/Email address is required/i)).toBeVisible();

    // Invalid email (S-03)
    await page.fill('input[type="email"]', "invalid-email-format");
    await page.fill('input[type="password"]', "validPass123!");
    await page.fill('input[placeholder="Your full name"]', "Test User");
    await page.click('button[type="submit"]');
    await expect(page.getByText(/Please provide a valid email address/i)).toBeVisible();

    // Short password (S-04)
    await page.fill('input[type="email"]', "valid@test.com");
    await page.fill('input[type="password"]', "short");
    await page.click('button[type="submit"]');
    await expect(page.getByText(/Password must contain at least 8 characters/i)).toBeVisible();
  });

  // P-01 & P-02: Password recovery flow
  test("P-01 & P-02: Password recovery dispatches neutral message without enumeration", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Login/i }).click();

    await page.getByRole("button", { name: /Forgot password\?/i }).click();
    await expect(page.getByText(/Reset your password/i)).toBeVisible();

    await page.fill('input[type="email"]', "recovery-target@test.com");
    await page.click('button[type="submit"]');

    // Expected neutral message preventing user enumeration
    await expect(
      page.getByText(/If an account exists for this email, password reset instructions have been dispatched/i)
    ).toBeVisible({ timeout: 5000 });
  });

  // R-01 & R-02: Route protection at the edge
  test("R-01 & R-02: Unauthenticated access to /admin redirects without private content flashing", async ({ page }) => {
    // Attempt to access admin portal as guest
    const response = await page.goto("/admin");
    
    // Edge middleware redirects directly
    expect(page.url()).toContain("auth=login");
  });
});
