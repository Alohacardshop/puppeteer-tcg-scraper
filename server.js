const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/scrape-price', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes('tcgplayer.com/product')) {
    return res.status(400).json({ error: 'Invalid or missing TCGPlayer product URL.' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    await page.waitForSelector('.price-points__value', { timeout: 10000 });
    const price = await page.$eval('.price-points__value', el => el.textContent.trim());

    res.json({
      price: price.replace(/[^0-9.]/g, ''),
      url,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Scrape error:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.get('/', (req, res) => {
  res.send('✅ Puppeteer TCG Scraper is running!');
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});