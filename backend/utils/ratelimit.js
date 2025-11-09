const rateLimiters = new Map();

/**
 * Basic in-memory rate limiter (no external DB)
 * @param {number} maxRequests - number of requests allowed per minute
 */
function createRateLimiter(maxRequests = 60) {
  const windowMs = 60 * 1000; // 1 minute

  return function (req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimiters.has(ip)) {
      rateLimiters.set(ip, []);
    }

    const timestamps = rateLimiters.get(ip).filter((t) => now - t < windowMs);
    timestamps.push(now);
    rateLimiters.set(ip, timestamps);

    if (timestamps.length > maxRequests) {
      return res.status(429).json({ error: "Too many requests. Please slow down." });
    }

    next();
  };
}

module.exports = { createRateLimiter };

