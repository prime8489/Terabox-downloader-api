const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function getDownloadLink(shareUrl) {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport
    });

    const page = await browser.newPage();
    await page.goto(shareUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Example: Wait for download button and get URL
    await page.waitForSelector('a[href*="download"]', { timeout: 5000 });
    const downloadLink = await page.evaluate(() => {
      return document.querySelector('a[href*="download"]').href;
    });

    if (!downloadLink) throw new Error('Download link not found');
    return { 
      success: true, 
      url: downloadLink,
      filename: downloadLink.split('/').pop() || 'file'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { getDownloadLink };
