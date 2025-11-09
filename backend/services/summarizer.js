const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const TARGET_WORDS = parseInt(process.env.SUMMARY_TARGET_WORDS || '60', 10);

async function summarize(text) {
  if (!text || !GEMINI_API_KEY) return text;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: `Summarize this in ${TARGET_WORDS} words:\n\n${text}` }] }],
      }
    );
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || text;
  } catch (err) {
    console.warn('Gemini summarization failed:', err.message);
    return text;
  }
}

module.exports = { summarize };

