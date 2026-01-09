import rateLimit from 'express-rate-limit';

// General API rate limit
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth endpoints rate limit (stricter)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per 15 minutes
    message: { error: 'Too many login attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Platform sync rate limit
export const syncLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // 10 syncs per 5 minutes
    message: { error: 'Sync rate limit reached, please wait before syncing again.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Platform-specific rate limits (to respect external API limits)
export const platformRateLimits = {
    codeforces: {
        requestsPerSecond: 1, // Codeforces allows ~1 request per second
        burstLimit: 5,
    },
    leetcode: {
        requestsPerSecond: 2,
        burstLimit: 10,
    },
    github: {
        requestsPerMinute: 30, // GitHub allows 60 per hour unauthenticated
        burstLimit: 10,
    },
    // Add more platform limits as needed
};

/**
 * Create a rate limiter for a specific platform
 */
export const createPlatformLimiter = (platform) => {
    const limits = platformRateLimits[platform] || {
        requestsPerSecond: 1,
        burstLimit: 5,
    };

    return rateLimit({
        windowMs: 1000, // 1 second
        max: limits.requestsPerSecond,
        message: { error: `Rate limit reached for ${platform}. Please wait.` },
    });
};
