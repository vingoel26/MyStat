/**
 * Validate email format
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * Returns { isValid, strength, message }
 */
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, strength: 0, message: 'Password is required' };
    }

    let strength = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach(check => {
        if (check) strength++;
    });

    let message = '';
    if (!checks.length) message = 'Password must be at least 8 characters';
    else if (strength < 3) message = 'Password is too weak';
    else if (strength < 4) message = 'Password could be stronger';
    else message = 'Strong password';

    return {
        isValid: checks.length && strength >= 3,
        strength: Math.round((strength / 5) * 100),
        message,
        checks,
    };
};

/**
 * Validate username format
 */
export const isValidUsername = (username) => {
    if (!username || username.length < 3 || username.length > 30) {
        return false;
    }
    // Allow alphanumeric, underscore, and hyphen
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    return usernameRegex.test(username);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validate platform username based on platform rules
 */
export const validatePlatformUsername = (platform, username) => {
    if (!username || username.trim().length === 0) {
        return { isValid: false, message: 'Username is required' };
    }

    const platformRules = {
        codeforces: {
            minLength: 3,
            maxLength: 24,
            pattern: /^[a-zA-Z0-9_]+$/,
            message: 'Codeforces username can only contain letters, numbers, and underscores',
        },
        leetcode: {
            minLength: 1,
            maxLength: 15,
            pattern: /^[a-zA-Z0-9_-]+$/,
            message: 'LeetCode username can only contain letters, numbers, underscores, and hyphens',
        },
        codechef: {
            minLength: 4,
            maxLength: 14,
            pattern: /^[a-z][a-z0-9_]+$/i,
            message: 'CodeChef username must start with a letter',
        },
        github: {
            minLength: 1,
            maxLength: 39,
            pattern: /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
            message: 'GitHub username can only contain alphanumeric characters or single hyphens',
        },
        gitlab: {
            minLength: 2,
            maxLength: 255,
            pattern: /^[a-zA-Z0-9_][a-zA-Z0-9_.-]*[a-zA-Z0-9_]$|^[a-zA-Z0-9_]$/,
            message: 'GitLab username format is invalid',
        },
    };

    const rules = platformRules[platform];
    if (!rules) {
        // Default validation for platforms without specific rules
        return { isValid: username.length >= 1 && username.length <= 50, message: '' };
    }

    if (username.length < rules.minLength) {
        return { isValid: false, message: `Username must be at least ${rules.minLength} characters` };
    }

    if (username.length > rules.maxLength) {
        return { isValid: false, message: `Username must be at most ${rules.maxLength} characters` };
    }

    if (!rules.pattern.test(username)) {
        return { isValid: false, message: rules.message };
    }

    return { isValid: true, message: '' };
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input) => {
    if (!input) return '';
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};
