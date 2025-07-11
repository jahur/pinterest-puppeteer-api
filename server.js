import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/pinterest-suggest', async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required.' });
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://www.pinterest.com/', { waitUntil: 'networkidle2' });

    await page.type('input[name="searchBoxInput"]', keyword, { delay: 100 });

    await page.waitForTimeout(2000);

    const suggestions = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('[data-test-id="typeahead-suggestions"] li').forEach(el => {
        const text = el.textContent.trim();
        if (text) results.push(text);
      });
      return results;
    });

    await browser.close();

    return res.json({ suggestions });
  } catch (err) {
    console.error(err);
    if (browser) await browser.close();
    return res.status(500).json({ error: 'Failed to scrape Pinterest suggestions.' });
  }
});

app.get('/', (req, res) => {
  res.send('Pinterest Puppeteer API is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Pinterest Puppeteer API running on port ${PORT}`);
});