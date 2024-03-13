import express from 'express';
const { chromium, Browser, BrowserContext, Page, Locator } = require('playwright');
const { selectors, ui } = require('./selectors');

const router = express.Router();

router.get<{}>("/", (req, res) => {
  return res.send("running");
});

router.get("/url-scrape", async (req: any, res: any) => {
  try {
    const { url } = req; // Get the URL from the query parameters
    if (!url) {
      return res.status(400).json({ error: "URL parameter is required" });
    }
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const google = "https://www.google.com";

    await page.goto(google);
    await page.waitForSelector(ui.googleSearch);
    await page.locator(ui.googleSearch).fill(url);
    await page.keyboard.press("Enter");

    for (let i = 0; i < 10; i++) {
      await page.waitForSelector(ui.googleSearchResultsPage);
      await page.locator(ui.searchResults).click();
      await page.waitForTimeout(1000);
      const lpage = await page.locator(selectors.summary).isVisible();
      if (lpage) {
        break;
      } else {
        await page.goBack();
      }
    }

    const scrapedData: any = {};

    await page.waitForSelector(selectors.summary);

    for (const [key, selector] of Object.entries(selectors)) {
      const elements = await page.locator(selector).all();
      const data: Array<string | null> = [];

      for (const element of elements) {
        const text = await element.textContent();
        if (text) {
          data.push(text.replace(/\n/g, "").trim());
        }
      }

      scrapedData[key] = data;
    }

    await browser.close();

    res.json(scrapedData);
  } catch (error) {
    console.error("Error during scraping: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/search-scrape", async (req: any, res: any) => {
  try {
    const { firstName, lastName, companyName } = req.query; // Get the URL from the query parameters

    if (!lastName) {
      return res.status(400).json({ error: "lastName parameter is required" });
    }
    if (!firstName) {
      return res.status(400).json({ error: "firstName parameter is required" });
    }
    if (!companyName) {
      return res
        .status(400)
        .json({ error: "companyName parameter is required" });
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const google = "https://www.google.com";

    await page.goto(google);
    await page.waitForSelector(ui.googleSearch);
    await page
      .locator(ui.googleSearch)
      .fill(firstName + " " + lastName + " " + companyName);
    await page.keyboard.press("Enter");

    for (let i = 0; i < 10; i++) {
      await page.waitForSelector(ui.googleSearchResultsPage);
      await page.locator(ui.searchResults).click();
      await page.waitForTimeout(1000);
      const lpage = await page.locator(selectors.summary).isVisible();
      if (lpage) {
        break;
      } else {
        await page.goBack();
      }
    }

    const scrapedData: any = {};

    await page.waitForSelector(selectors.summary);

    for (const [key, selector] of Object.entries(selectors)) {
      const elements = await page.locator(selector).all();
      const data: Array<string | null> = [];

      for (const element of elements) {
        const text = await element.textContent();
        if (text) {
          data.push(text.replace(/\n/g, "").trim());
        }
      }

      scrapedData[key] = data;
    }

    await browser.close();

    res.json(scrapedData);
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
