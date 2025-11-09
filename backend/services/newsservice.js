const axios = require('axios');
const NodeCache = require('node-cache');
const pLimit = require('p-limit');
const summarizer = require('./summarizer');

const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL_SECONDS || '300', 10) });
const limit = pLimit(parseInt(process.env.MAX_CONCURRENT_SUMMARIES || '5', 10));

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_BASE = process.env.NEWS_API_BASE || 'https://newsapi.org/v2/top-headlines';

async function fetchAndSummarize(options = {}) {
  const cacheKey = JSON.stringify(options);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const params = {
    apiKey: NEWS_API_KEY,
    pageSize: options.pageSize || 10,
    q: options.q,
    category: options.category || process.env.DEFAULT_NEWS_CATEGORY,
    country: options.country || process.env.DEFAULT_NEWS_COUNTRY,
  };
  Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);

  const response = await axios.get(NEWS_API_BASE, { params });
  const articles = response.data.articles.map((a, i) => ({
    id: a.url || `article_${i}`,
    title: a.title,
    description: a.description,
    content: a.content,
    source: a.source?.name,
    url: a.url,
    urlToImage: a.urlToImage,
    publishedAt: a.publishedAt,
  }));

  const summarized = await Promise.all(
    articles.map((a) =>
      limit(async () => ({
        ...a,
        summary: await summarizer.summarize(a.content || a.description || a.title || ''),
      }))
    )
  );

  const result = { fetchedAt: Date.now(), articles: summarized };
  cache.set(cacheKey, result);
  return result;
}

module.exports = { fetchAndSummarize };

