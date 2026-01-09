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
 * Made lenient - the platform API will validate if the user exists
 */
export const validatePlatformUsername = (platform, username) => {
    if (!username || username.trim().length === 0) {
        return { isValid: false, message: 'Username is required' };
    }

    // Trim whitespace
    const trimmed = username.trim();

    // Very lenient validation - just check basic length
    // Platform APIs will validate if the username actually exists
    if (trimmed.length < 1) {
        return { isValid: false, message: 'Username is required' };
    }

    if (trimmed.length > 100) {
        return { isValid: false, message: 'Username is too long' };
    }

    // Allow most characters - platforms like GitHub allow dots, hyphens, etc.
    // The actual platform API will tell us if the username is valid
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
