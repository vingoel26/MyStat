# DevStats - Coding Portfolio & Progress Tracker

A comprehensive coding portfolio and progress tracking platform that unifies your competitive programming journey across multiple platforms.

## Features

- **Multi-Platform Integration**: Connect Codeforces, LeetCode, CodeChef, AtCoder, GitHub, GitLab, Kaggle, Stack Overflow, and Kattis
- **Unified Dashboard**: View all your coding stats in one beautiful interface
- **Deep Analytics**: Heatmaps, rating graphs, difficulty distribution, topic breakdown
- **Public Profiles**: Share your coding portfolio with recruiters and friends
- **Privacy Controls**: Choose what to show publicly

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS v4
- Framer Motion (animations)
- Recharts (data visualization)
- React Router v6

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/devstats.git
cd devstats
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Install backend dependencies:
```bash
cd ../server
npm install
```

4. Set up the database:
```bash
psql -U postgres -f schema/database.sql
```

5. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

6. Start development servers:

Frontend (port 3000):
```bash
cd client
npm run dev
```

Backend (port 5000):
```bash
cd server
npm run dev
```

## Project Structure

```
devstats/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── common/     # Button, Card, Input, etc.
│   │   │   ├── layout/     # Sidebar, Navbar, Footer
│   │   │   ├── dashboard/  # Dashboard-specific components
│   │   │   └── analytics/  # Charts and visualizations
│   │   ├── pages/          # Route pages
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Utilities and helpers
│   │   └── data/           # Mock data
│   └── public/             # Static assets
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   │   └── platforms/  # Platform-specific integrations
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   └── config/         # Configuration
│   └── schema/             # Database schemas
│
└── docs/                   # Documentation
```

## Supported Platforms

| Platform | API Status | Features |
|----------|------------|----------|
| Codeforces | ✅ Official API | Rating, contests, submissions |
| LeetCode | ⚠️ GraphQL | Problems solved, contests |
| CodeChef | ✅ Official API | Rating, problems, contests |
| AtCoder | ⚠️ Unofficial | Rating, contests |
| GitHub | ✅ Official API | Repos, contributions, stars |
| GitLab | ✅ Official API | Projects, contributions |
| Stack Overflow | ✅ Official API | Reputation, badges, answers |
| Kaggle | ✅ Official API | Competitions, notebooks |
| Kattis | ⚠️ Unofficial | Problems solved, score |

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Codolio and similar platforms
- Built with ❤️ for the competitive programming community
