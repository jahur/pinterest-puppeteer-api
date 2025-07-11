import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

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

    const keywordEncoded = encodeURIComponent(keyword);
    await page.goto(`https://www.pinterest.com/search/pins/?q=${keywordEncoded}`, { waitUntil: 'networkidle2' });

    // Grab related searches instead of typeahead
    const suggestions = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('a[data-test-id="related-searches-link"]').forEach(el => {
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
