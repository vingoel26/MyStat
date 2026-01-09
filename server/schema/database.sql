-- DevStats Database Schema
-- PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    is_public BOOLEAN DEFAULT true,
    skills TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- =====================================================
-- PLATFORM ACCOUNTS TABLE
-- =====================================================
CREATE TABLE platform_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    platform_username VARCHAR(100) NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    last_synced_at TIMESTAMP WITH TIME ZONE,
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, platform)
);

-- Index for user lookups
CREATE INDEX idx_platform_accounts_user ON platform_accounts(user_id);
CREATE INDEX idx_platform_accounts_platform ON platform_accounts(platform);

-- =====================================================
-- SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform_account_id UUID REFERENCES platform_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    problem_id VARCHAR(100),
    problem_name VARCHAR(255) NOT NULL,
    problem_url VARCHAR(500),
    difficulty VARCHAR(20),
    status VARCHAR(20) NOT NULL,
    language VARCHAR(50),
    submitted_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for filtering and searching
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_platform ON submissions(platform);
CREATE INDEX idx_submissions_difficulty ON submissions(difficulty);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_date ON submissions(submitted_at DESC);

-- =====================================================
-- CONTESTS TABLE
-- =====================================================
CREATE TABLE contests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform_account_id UUID REFERENCES platform_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    contest_id VARCHAR(100),
    contest_name VARCHAR(255) NOT NULL,
    contest_url VARCHAR(500),
    rank INTEGER,
    rating_change INTEGER,
    new_rating INTEGER,
    problems_solved INTEGER DEFAULT 0,
    participated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX idx_contests_user ON contests(user_id);
CREATE INDEX idx_contests_platform ON contests(platform);
CREATE INDEX idx_contests_date ON contests(participated_at DESC);

-- =====================================================
-- DAILY STATS TABLE (for heatmap)
-- =====================================================
CREATE TABLE daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    problems_solved INTEGER DEFAULT 0,
    submissions_made INTEGER DEFAULT 0,
    platforms_active TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

-- Index for date range queries
CREATE INDEX idx_daily_stats_user ON daily_stats(user_id);
CREATE INDEX idx_daily_stats_date ON daily_stats(date DESC);

-- =====================================================
-- RATING HISTORY TABLE
-- =====================================================
CREATE TABLE rating_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform_account_id UUID REFERENCES platform_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    rating INTEGER NOT NULL,
    contest_id VARCHAR(100),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for querying
CREATE INDEX idx_rating_history_user ON rating_history(user_id);
CREATE INDEX idx_rating_history_platform ON rating_history(platform);
CREATE INDEX idx_rating_history_date ON rating_history(recorded_at DESC);

-- =====================================================
-- ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_key VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_key)
);

-- Index for user lookups
CREATE INDEX idx_achievements_user ON achievements(user_id);

-- =====================================================
-- SESSIONS TABLE (for JWT refresh tokens)
-- =====================================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token VARCHAR(500) NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for token lookups
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(refresh_token);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_accounts_updated_at
    BEFORE UPDATE ON platform_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at
    BEFORE UPDATE ON daily_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS
-- =====================================================

-- View for user statistics summary
CREATE VIEW user_stats_summary AS
SELECT 
    u.id AS user_id,
    u.username,
    COUNT(DISTINCT s.id) AS total_submissions,
    COUNT(DISTINCT CASE WHEN s.status = 'solved' THEN s.id END) AS total_solved,
    COUNT(DISTINCT c.id) AS total_contests,
    COUNT(DISTINCT pa.id) AS connected_platforms,
    MAX(ds.date) AS last_active_date
FROM users u
LEFT JOIN submissions s ON u.id = s.user_id
LEFT JOIN contests c ON u.id = c.user_id
LEFT JOIN platform_accounts pa ON u.id = pa.user_id
LEFT JOIN daily_stats ds ON u.id = ds.user_id AND ds.problems_solved > 0
GROUP BY u.id, u.username;
