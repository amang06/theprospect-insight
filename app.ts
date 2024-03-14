const express = require("express");
const {
  Browser,
  BrowserContext,
  Page,
  Locator,
  chromium,
} = require("playwright");
const { selectors, ui } = require("./selectors");

const app = express();
const port = 3000;

app.get("/", async (req: any, res: any) => {
  return res.send("running");
});

app.get("/url-scrape", async (req: any, res: any) => {
  const { url } = req.query; // Get the URL from the query parameters
  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  try {
    const SBR_CDP =
      "";
    const browser = await chromium.connectOverCDP(SBR_CDP);

    const context = await browser.newContext();

    const page = await context.newPage();

    const google = "https://www.google.com";

    await page.goto(google);
    console.log("Redirecting to Google");
    await page.waitForSelector(ui.googleSearch);
    await page.locator(ui.googleSearch).fill(url);
    console.log("Searching for " + url);
    await page.keyboard.press("Enter");
    console.log("Pressed enter");

    for (let i = 0; i < 2; i++) {
      await page.waitForSelector(ui.googleSearchResultsPage);
      const result_text = await page.locator(ui.searchResults).textContent();
      await page.locator(ui.searchResults).click();
      console.log("Clicked search results: " + result_text);
      await page.waitForTimeout(1000);
      const lpage = await page.locator(selectors.summary).isVisible();
      if (lpage) {
        console.log("Linkedin page loaded");
        break;
      } else {
        console.log("Linkedin page not loaded, going back");
        page.screenshot();
        await page.goBack();
      }
    }

    const scrapedData: any = {};

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

    await page.close();

    res.json(scrapedData);
  } catch (error) {
    console.error("Error during scraping: " + error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/search-scrape", async (req: any, res: any) => {
  try {
    const SBR_WS_ENDPOINT =
      "";
    const browser = await chromium.launch({
      headless: true,
      proxy: {
        server: SBR_WS_ENDPOINT,
        username: "brd-customer-hl_10fb90e3-zone-theprospect_insight",
        password: "ie4smusfyeor",
      },
    });
    const context = await browser.newContext();
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

    const page = await context.newPage();

    const google = "https://www.google.com";

    await page.goto(google);
    console.log("Redirecting to Google");
    await page.waitForSelector(ui.googleSearch);
    await page
      .locator(ui.googleSearch)
      .fill(firstName + " " + lastName + " " + companyName + ' "Linkedin"');
    console.log(
      "Searching for " +
        firstName +
        " " +
        lastName +
        " " +
        companyName +
        ' "Linkedin"'
    );
    await page.keyboard.press("Enter");
    console.log("Pressed enter");

    for (let i = 0; i < 10; i++) {
      await page.waitForSelector(ui.googleSearchResultsPage);
      await page.locator(ui.searchResults).click();
      console.log("Clicked search results");
      await page.waitForTimeout(1000);
      const lpage = await page.locator(selectors.summary).isVisible();
      if (lpage) {
        console.log("Linkedin page loaded");
        break;
      } else {
        console.log("Linkedin page not loaded, going back");
        await page.goBack();
      }
    }

    const scrapedData: any = {};

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

    await page.close();

    res.json(scrapedData);
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
