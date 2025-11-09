require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const newsService = require('./services/newsService');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/news', async (req, res) => {
  try {
    const options = {
      q: req.query.q,
      category: req.query.category,
      country: req.query.country || process.env.DEFAULT_NEWS_COUNTRY,
      pageSize: Math.min(parseInt(req.query.pageSize || '10', 10), 50),
      summarize: req.query.summarize !== 'false'
    };

    const result = await newsService.fetchAndSummarize(options);
    res.json(result);
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running at http://localhost:${PORT}`));

