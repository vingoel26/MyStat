/**
 * In-Memory Database
 * Temporary storage for development without PostgreSQL
 * Replace with real database queries in production
 */

// In-memory user storage
const users = new Map();

// Generate a simple ID
const generateId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Mock query function that mimics PostgreSQL response format
 */
export const query = async (sql, params) => {
    // Parse the SQL to understand what operation is being requested
    const sqlLower = sql.toLowerCase().trim();

    // SELECT user by email
    if (sqlLower.includes('select') && sqlLower.includes('from users where email')) {
        const email = params[0];
        const user = Array.from(users.values()).find(u => u.email === email);
        return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    // SELECT user by ID
    if (sqlLower.includes('select') && sqlLower.includes('from users where id')) {
        const id = params[0];
        const user = users.get(id);
        return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    // SELECT user by username
    if (sqlLower.includes('select') && sqlLower.includes('from users where username')) {
        const username = params[0];
        const user = Array.from(users.values()).find(u => u.username === username);
        return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    // INSERT new user
    if (sqlLower.includes('insert into users')) {
        const [name, email, username, password_hash] = params;
        const id = generateId();
        const newUser = {
            id,
            name,
            email,
            username,
            password_hash,
            bio: null,
            avatar_url: null,
            is_public: true,
            skills: [],
            social_links: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        users.set(id, newUser);
        console.log(`✅ Created user: ${email}`);
        return { rows: [newUser], rowCount: 1 };
    }

    // UPDATE user
    if (sqlLower.includes('update users')) {
        const id = params[params.length - 1]; // ID is usually the last parameter
        const user = users.get(id);
        if (user) {
            // Simple update - just merge for now
            const updated = { ...user, updated_at: new Date().toISOString() };
            users.set(id, updated);
            return { rows: [updated], rowCount: 1 };
        }
        return { rows: [], rowCount: 0 };
    }

    // Default - return empty
    console.log('Unhandled query:', sql.substring(0, 100));
    return { rows: [], rowCount: 0 };
};

/**
 * Mock transaction function
 */
export const transaction = async (callback) => {
    // For in-memory, just execute the callback
    return await callback({ query });
};

// Export user storage for debugging
export const getUserStore = () => users;

// Log that we're using in-memory storage
console.log('📦 Using in-memory storage (no PostgreSQL)');

export default { query, transaction, getUserStore };
