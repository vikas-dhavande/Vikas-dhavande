# AeroSys Engineering Hub — Comprehensive Testing Strategy & Framework Guide (`testing.md`)

**Document Version:** 1.0.0  
**Target Systems:** AeroSys Engineering Hub & Professional Telemetry Portal  
**Document Owner:** Vikas N Dhavande (Lead Product & Avionics Systems Engineer)  
**Last Updated:** October 24, 2026  
**Status:** Approved for Test Architecture & Execution  

---

## 1. Executive Summary & Testing Philosophy

The **AeroSys Engineering Hub** is an avionics-grade professional telemetry and engineering showcase built on Next.js 15, Three.js WebGL, Tailwind CSS v4, and Appwrite Cloud Backend. Because the platform serves aerospace directors, defense hiring executives, and embedded engineers, software quality must reflect the same rigor required for mission-critical hardware systems.

### 1.1 The Testing Pyramid
Our quality framework enforces four specialized layers:

```
                  / \
                 /   \
                /     \
               / JMeter \       <-- Performance, Stress & Throughput (API & Edge)
              /-----------\
             /  Playwright \     <-- Modern High-Velocity E2E (Chromium, Firefox, WebKit)
            /---------------\
           /    Selenium     \   <-- Enterprise Cross-Browser & Grid Verification
          /-------------------\
         / Unit & Component    \ <-- Vitest / React Testing Library (Isolated Logic)
        /-----------------------\
```

1. **Unit & Component Testing (Base):** Fast, isolated tests for UI primitives, mathematical utility functions, and theme switching logic.
2. **Playwright E2E Automation (Primary Browser Gate):** Modern, parallelized browser journeys validating dynamic UI interactions, 3D WebGL canvas mounts, and Appwrite authentication flows.
3. **Selenium WebDriver Automation (Enterprise Compatibility Gate):** Page Object Model (POM)-based cross-browser tests running against Selenium Grid across multiple OS and browser permutations.
4. **Apache JMeter Performance & Load Testing (Throughput & SLA Gate):** Non-GUI stress, peak concurrency, and latency profiling against Next.js ISR edge routes and Appwrite backend endpoints.

---

## 2. Playwright End-to-End (E2E) Test Suite

Playwright serves as the primary merge-blocking E2E automation tool in the CI/CD pipeline, guaranteeing sub-second interaction speed, zero flakiness, and deterministic verification.

### 2.1 Key Verification Objectives
* **WebGL Wave Grid Canvas (`FR-HERO-01`):** Ensure Three.js canvas dynamically mounts without blocking initial HTML LCP or throwing WebGL context errors.
* **Domain Experience Spotlight (`FR-EXP-01`):** Validate toggling between Spotlight card deck and Chronological List modes.
* **Tiered Appwrite Cloud Authentication (`FR-AUTH-01`):** Intercept and mock `/v1/account` sessions to verify authenticated states, deterministic Blobatar rendering, and guest 401 suppression.
* **Direct Contact Dispatch Form (`FR-DISP-01`):** Validate client-side field validation, accessible ARIA alerts, and submission feedback.

### 2.2 Configuration Architecture (`portfolio/playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { outputFolder: 'test-results/playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### 2.3 Sample Spec: Critical Journeys (`portfolio/e2e/home.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';

test.describe('AeroSys Engineering Portal - Critical User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('P0: Hero Typography & Three.js Canvas mount cleanly', async ({ page }) => {
    // Monitor for browser errors
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    // Verify Display Heading
    const heroTitle = page.getByRole('heading', { level: 1 });
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText(/VIKAS/i);

    // Verify 3D Canvas element initialization
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Verify zero fatal browser errors
    expect(errors).toHaveLength(0);
  });

  test('P0: Experience Mode toggle operates without layout shift', async ({ page }) => {
    const spotlightBtn = page.getByRole('button', { name: /Spotlight/i });
    const listBtn = page.getByRole('button', { name: /List/i });

    // Switch to List Mode
    await listBtn.click();
    await expect(page.locator('[data-testid="experience-list-view"]')).toBeVisible();

    // Switch back to Spotlight Mode
    await spotlightBtn.click();
    await expect(page.locator('[data-testid="experience-spotlight-deck"]')).toBeVisible();
  });

  test('P1: Contact Dispatch form displays client validation errors', async ({ page }) => {
    // Scroll to contact form
    const submitBtn = page.getByRole('button', { name: /Send Message|Dispatch Inquiry/i });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    // Verify validation alerts are displayed
    const emailInput = page.getByLabel(/Email/i);
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
  });
});
```

---

## 3. Selenium WebDriver Cross-Browser Suite

Selenium WebDriver is deployed to guarantee long-term backward compatibility, multi-OS enterprise verification, and execution across dedicated Selenium Grid 4 nodes.

### 3.1 Design Principles
1. **Strict Page Object Model (POM):** Locators and interactions stay segregated from assertions.
2. **Explicit Waits Only:** Zero `time.sleep()`. All element queries utilize `WebDriverWait` with expected conditions (`visibility_of_element_located`, `element_to_be_clickable`).
3. **Cross-Browser Driver Factory:** Unified instantiation supporting Chrome, Firefox, Microsoft Edge, and Safari.

### 3.2 Python POM Implementation (`tests/selenium/pages/home_page.py`)
```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class AeroSysHomePage:
    def __init__(self, driver, base_url: str):
        self.driver = driver
        self.base_url = base_url
        self.wait = WebDriverWait(driver, timeout=10, poll_frequency=0.25)

        # Locators
        self._hero_heading = (By.TAG_NAME, "h1")
        self._canvas = (By.TAG_NAME, "canvas")
        self._spotlight_toggle = (By.XPATH, "//button[contains(., 'Spotlight')]")
        self._list_toggle = (By.XPATH, "//button[contains(., 'List')]")
        self._contact_submit = (By.CSS_SELECTOR, "button[type='submit']")

    def open(self):
        self.driver.get(self.base_url)
        return self

    def get_hero_text(self) -> str:
        elem = self.wait.until(EC.visibility_of_element_located(self._hero_heading))
        return elem.text

    def is_canvas_mounted(self) -> bool:
        try:
            self.wait.until(EC.presence_of_element_located(self._canvas))
            return True
        except Exception:
            return False

    def switch_to_list_mode(self):
        btn = self.wait.until(EC.element_to_be_clickable(self._list_toggle))
        btn.click()
        return self
```

### 3.3 Test Suite Execution (`tests/selenium/test_home.py`)
```python
import pytest
from pages.home_page import AeroSysHomePage

def test_home_page_canvas_and_branding(driver, base_url):
    home = AeroSysHomePage(driver, base_url).open()
    assert "VIKAS" in home.get_hero_text().upper()
    assert home.is_canvas_mounted() is True
```

### 3.4 Docker Selenium Grid Orchestration (`docker-compose.selenium.yml`)
```yaml
version: '3.8'
services:
  selenium-hub:
    image: selenium/hub:4.18.0
    container_name: selenium-hub
    ports:
      - "4442-4444:4442-4444"

  chrome-node:
    image: selenium/node-chrome:4.18.0
    shm_size: 2gb
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
    depends_on:
      - selenium-hub

  firefox-node:
    image: selenium/node-firefox:4.18.0
    shm_size: 2gb
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
    depends_on:
      - selenium-hub
```

---

## 4. Apache JMeter Performance & Load Testing Suite

Apache JMeter provides automated performance benchmarking, load tolerance profiling, and capacity planning for the edge and API layers.

### 4.1 Service Level Agreements (SLAs)

| Metric | Target SLA | Critical Limit | Measurement Route |
| :--- | :--- | :--- | :--- |
| **Static / Edge LCP Response** | $\le 200\text{ms}$ | $> 500\text{ms}$ | `GET /` |
| **Portfolio Data API Response** | $\le 300\text{ms}$ | $> 750\text{ms}$ | `GET /api/portfolio-data` |
| **Peak 95th Percentile ($p_{95}$)** | $\le 600\text{ms}$ | $> 1,200\text{ms}$ | All Combined HTTP Endpoints |
| **Maximum Error Rate** | $\le 0.01\%$ | $> 0.10\%$ | Entire Load Duration |
| **Target Throughput** | $\ge 250\text{ req/s}$ | $< 100\text{ req/s}$ | Nominal Concurrency Run |

### 4.2 Test Profiles

```
Throughput / Concurrency Curve:
Users
 500 │                  ┌────────────────────┐ (Stress Test: 500 vUsers)
     │                 /                      \
 250 │        ┌───────┘                        \ (Load Test: 250 vUsers)
     │       /                                  \
  50 │  ┌───┘                                    \ (Baseline: 50 vUsers)
   0 └──┴─────┴───────┴───────────────────────────┴─────────> Time (mins)
        0     5       15                         30
```

1. **Baseline Smoke Test:** 25 Virtual Users, 10s ramp-up, 5m duration. Verifies healthy server response before heavy runs.
2. **Standard Load Test:** 150 Virtual Users, 60s ramp-up, 20m steady state. Simulates typical peak traffic from social announcement or tech portfolio feature.
3. **Stress & Breakpoint Test:** Ramp from 100 to 600 Virtual Users in 50-user steps. Identifies where API latency degrades or Vercel Edge caching becomes constrained.
4. **Endurance / Soak Test:** 100 Virtual Users sustained continuously for 4 hours to verify memory leak absence and connection pool hygiene.

### 4.3 CLI Execution Runbook
Execute all performance runs in headless non-GUI mode:

```bash
# 1. Baseline Verification Run
jmeter -n \
  -t tests/jmeter/aerosys_performance_plan.jmx \
  -l tests/jmeter/results/baseline_run.jtl \
  -e -o tests/jmeter/reports/baseline_dashboard/ \
  -Jhost=localhost \
  -Jport=3000 \
  -Jthreads=25 \
  -Jrampup=10 \
  -Jduration=300

# 2. Peak Load Run
jmeter -n \
  -t tests/jmeter/aerosys_performance_plan.jmx \
  -l tests/jmeter/results/peak_load_run.jtl \
  -e -o tests/jmeter/reports/peak_load_dashboard/ \
  -Jhost=aerosys.io \
  -Jthreads=200 \
  -Jrampup=60 \
  -Jduration=1200
```

---

## 5. Automated CI/CD Quality Pipeline (GitHub Actions)

The repository integrates all three automation frameworks into a unified GitHub Actions workflow (`.github/workflows/quality-gate.yml`):

```yaml
name: Avionics Quality Gate & Test Automation

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Layer 1: Lint & Static Code Analysis
  code-hygiene:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          cache-dependency-path: 'portfolio/pnpm-lock.yaml'
      - run: pnpm --prefix portfolio install --frozen-lockfile
      - run: pnpm --prefix portfolio run lint
      - run: pnpm --prefix portfolio run typecheck

  # Layer 2: Playwright Modern E2E (Sharded)
  playwright-e2e:
    needs: code-hygiene
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1/2, 2/2]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          cache-dependency-path: 'portfolio/pnpm-lock.yaml'
      - run: pnpm --prefix portfolio install --frozen-lockfile
      - run: npx playwright install --with-deps
      - run: pnpm --prefix portfolio run build
      - run: npx playwright test --shard=${{ matrix.shard }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-shard-${{ strategy.job-index }}
          path: portfolio/playwright-report/

  # Layer 3: Selenium Cross-Browser Smoke Check
  selenium-cross-browser:
    needs: code-hygiene
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install pytest selenium
      - run: |
          pytest tests/selenium/ \
            --headless \
            --junitxml=test-results/selenium-results.xml

  # Layer 4: JMeter Automated Performance Gate
  jmeter-performance-gate:
    needs: [playwright-e2e, selenium-cross-browser]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Apache JMeter
        run: |
          sudo apt-get update
          sudo apt-get install -y jmeter
      - name: Run JMeter Performance Baseline
        run: |
          jmeter -n \
            -t tests/jmeter/aerosys_performance_plan.jmx \
            -l test-results/jmeter_ci.jtl \
            -Jthreads=50 \
            -Jrampup=15 \
            -Jduration=60
      - name: Verify SLA Thresholds
        run: |
          python3 -c "
          import csv
          with open('test-results/jmeter_ci.jtl') as f:
              reader = csv.DictReader(f)
              latencies = [int(r['elapsed']) for r in reader]
              p95 = sorted(latencies)[int(len(latencies)*0.95)]
              print(f'CI P95 Latency: {p95}ms')
              assert p95 < 600, f'P95 latency {p95}ms exceeded SLA limit of 600ms'
          "
```

---

## 6. Test Data Management & Security Controls

1. **Synthetic Accounts:** No real developer credentials or production Appwrite administrative API keys may ever appear in test scripts or repository commits.
2. **Isolated Storage State:** Playwright tests authenticate via ephemeral synthetic users and save session tokens to `.auth/user.json` (ignored in `.gitignore`).
3. **Deterministic Seeders:** API mocks return static fixtures modeled on real avionics telemetry payloads, preventing data drift.
4. **Appwrite Cloud Rate Limits:** Test suites must utilize distinct API keys with rate-limit exemptions or employ local mock route handlers (`page.route()`) during CI runs.

---

## 7. Developer Quick Reference & Execution Commands

| Framework | Command | Target Artifacts |
| :--- | :--- | :--- |
| **Playwright (All)** | `npx playwright test` | `test-results/playwright-report/` |
| **Playwright (Headed)** | `npx playwright test --headed` | Interactive browser run |
| **Playwright (Trace View)** | `npx playwright show-trace test-results/trace.zip` | Interactive step debugger |
| **Selenium (PyTest)** | `pytest tests/selenium/ -v --headless` | Console summary & screenshots |
| **JMeter (Baseline CLI)** | `jmeter -n -t plan.jmx -l run.jtl -e -o ./report` | `report/index.html` dashboard |

---
*End of Testing Strategy & Framework Guide.*
