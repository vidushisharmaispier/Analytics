import { chromium } from "playwright";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
const assert = (v, m) => {
  if (!v) throw Error(m);
};
await page.goto("http://localhost:5173/");
await page.getByRole("link", { name: "Explore live demo" }).nth(0).click();
assert(page.url().includes("?demo=dashboard"), "Dashboard link failed");
assert(
  await page
    .getByRole("heading", { name: "Overview", exact: true })
    .isVisible(),
  "Dashboard not mounted",
);
await page.getByLabel("Report period").selectOption("Last month");
assert(
  (await page.locator(".analytics-metrics").innerText()).includes("$21,240"),
  "Period failed",
);
await page.getByRole("button", { name: "Transactions", exact: true }).click();
await page.getByLabel("Search transactions").fill("Alex");
assert((await page.locator("tbody tr").count()) === 1, "Search failed");
await page.getByLabel("Search transactions").fill("");
await page.getByLabel("Filter transaction status").selectOption("Pending");
assert((await page.locator("tbody tr").count()) === 2, "Status failed");
await page.getByLabel("Sort by amount").click();
assert(
  (await page.locator("tbody tr").first().innerText()).includes("129"),
  "Sort failed",
);
const downloadPromise = page.waitForEvent("download");
await page.getByRole("button", { name: "Export CSV" }).click();
assert(
  (await downloadPromise).suggestedFilename() === "clarity-transactions.csv",
  "CSV failed",
);
await page.getByRole("button", { name: "Customers", exact: true }).click();
await page.getByLabel("Search customers").fill("Jamie");
assert(
  (await page.locator(".customer-grid article").count()) === 1,
  "Customers search failed",
);
await page.getByRole("button", { name: "Reports", exact: true }).click();
assert(await page.locator(".full-bars").isVisible(), "Reports failed");
await page.getByRole("button", { name: "Settings", exact: true }).click();
await page.getByLabel("Workspace name").fill("My QA workspace");
await page.getByLabel("Display currency").selectOption("INR");
await page.getByRole("button", { name: "Save preferences" }).click();
assert(await page.getByRole("status").isVisible(), "Settings save failed");
await page.getByRole("button", { name: "Overview", exact: true }).click();
assert(
  (await page.locator(".analytics-top").innerText()).includes(
    "My QA workspace",
  ),
  "Workspace rename failed",
);
await page.reload();
assert(
  await page
    .getByRole("heading", { name: "Overview", exact: true })
    .isVisible(),
  "Direct URL reload failed",
);
await page.getByRole("link", { name: "Back to portfolio" }).click();
await page.getByRole("link", { name: "Open Forma Store application" }).click();
assert(page.url().includes("?demo=shop"), "Preview click failed");
await page.getByRole("button", { name: "Audio", exact: true }).click();
assert(
  (await page.locator(".products article").count()) === 1,
  "Shop filter failed",
);
await page.getByLabel("Add Studio headphones to cart").click();
await page.getByLabel("Toggle shopping cart").click();
assert(
  (await page.locator(".cart-panel").innerText()).includes("$129.00"),
  "Cart failed",
);
await page.getByLabel("Add one Studio headphones").click();
assert(
  (await page.locator(".cart-panel").innerText()).includes("$258.00"),
  "Quantity failed",
);
await page.getByLabel("Remove one Studio headphones").click();
await page.getByLabel("Remove one Studio headphones").click();
assert(
  (await page.locator(".cart-panel").innerText()).includes("empty"),
  "Remove failed",
);
await page
  .getByRole("navigation", { name: "Demo applications" })
  .getByRole("link", { name: "Flow Task Manager" })
  .click();
await page.getByLabel("New task").fill("Full page QA task");
await page.getByLabel("Task priority").selectOption("High");
await page.getByLabel("Add task", { exact: true }).click();
await page.getByLabel("Mark Full page QA task complete").click();
await page.getByRole("button", { name: "Completed", exact: true }).click();
assert(
  (await page.locator(".task-list").innerText()).includes("Full page QA task"),
  "Task filter failed",
);
await page.reload();
assert(
  (await page.locator(".task-list").innerText()).includes("Full page QA task"),
  "Task persistence failed",
);
await page.getByLabel("Delete Full page QA task").click();
for (const width of [320, 375, 768, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const id of ["dashboard", "shop", "tasks"]) {
    await page.goto("http://localhost:5173/?demo=" + id);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Page overflow ${id} ${width}`,
    );
    if (id === "dashboard") {
      await page
        .getByRole("button", { name: "Transactions", exact: true })
        .click();
      await page.getByLabel("Search transactions").fill("Alex");
      assert(
        (await page.locator("tbody tr").count()) === 1,
        "Mobile dashboard failed",
      );
    }
    if (id === "shop") {
      await page.getByLabel("Add Everyday tote to cart").click();
      await page.getByLabel("Toggle shopping cart").click();
      assert(
        (await page.locator(".cart-panel").innerText()).includes("$39.00"),
        "Mobile shop failed",
      );
    }
    if (id === "tasks") {
      await page.getByLabel("New task").fill("mobile QA");
      await page.getByLabel("Add task", { exact: true }).click();
      await page.getByLabel("Delete mobile QA").click();
    }
  }
}
assert(!errors.length, errors.join("; "));
console.log(
  "PASS: actual project links + preview links, full-page routing/reload/back, all dashboard tabs/search/filter/sort/CSV/settings, Redux cart, task persistence, all 3 apps at 320/375/768/1440, no browser errors.",
);
await browser.close();
