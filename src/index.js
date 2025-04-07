const express = require('express');
const { getDownloadLink } = require('./scraper');

const app = express();
app.get('/api/download', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url.includes('terabox.com')) {
      return res.status(400).json({ error: 'Invalid Terabox URL' });
    }
    const result = await getDownloadLink(url);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
