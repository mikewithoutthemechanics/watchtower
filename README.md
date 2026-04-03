# Watchtower 🛡️

Your mission control center for monitoring all your development projects, communications, and integrations in one unified dashboard.

![Watchtower Preview](https://via.placeholder.com/800x400/1a1a1a/C0C0C0?text=Watchtower)

## Features

### 📊 Overview Dashboard
- Quick stats across all connected services
- System status indicators
- Real-time project & deployment metrics

### 🚀 Deployment Management
- Vercel projects overview
- Deployment status tracking
- Branch and commit info

### 🐙 Code Repositories  
- GitHub repositories with star/fork counts
- Language detection
- Direct links to repos

### 📧 Communications
- Gmail integration (recent emails)
- Google Calendar (upcoming events)
- Real-time message syncing

### 🔍 Monitoring
- **Sentry** - Error tracking & performance
- **PostHog** - Product analytics
- **Plausible** - Privacy-friendly analytics
- **UptimeRobot** - Uptime monitoring

### 🔗 Integrations
- **Slack** - Team messaging
- **Discord** - Community platform
- **Notion** - Knowledge base
- **Linear** - Issue tracking
- **Stripe** - Payments

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Custom CSS (Space Grotesk font)
- **Animation:** Framer Motion
- **API:** Server-side data fetching

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mikewithoutthemechanics/watchtower.git
cd watchtower
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your API keys:

```env
# Core API Tokens
VERCEL_TOKEN=your_vercel_token
GITHUB_TOKEN=your_github_token

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token

# Monitoring Services
SENTRY_DSN=https://your-key@sentry.io/your-project-id
POSTHOG_API_KEY=your_posthog_api_key
POSTHOG_PROJECT_ID=your_posthog_project_id
PLAUSIBLE_SITE_ID=your_plausible_site_id
UPTIMEROBOT_API_KEY=your_uptimerobot_api_key

# Additional Integrations
SLACK_WEBHOOK=https://hooks.slack.com/services/...
DISCORD_WEBHOOK=https://discord.com/api/webhooks/...
NOTION_API_KEY=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
LINEAR_API_KEY=your_linear_api_key
STRIPE_API_KEY=sk_live_...
```

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
# Using Vercel CLI
vercel deploy

# Or connect GitHub repo in Vercel dashboard
```

## Project Structure

```
watchtower/
├── api/
│   └── data.js          # Server-side API handler
├── src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # Styling
│   └── main.jsx         # Entry point
├── public/
│   └── index.html       # HTML template
├── .env.example         # Environment template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## API Keys Guide

### Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Account Settings → Tokens
3. Create a new token with needed permissions

### GitHub
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic) with `repo` scope

### Google OAuth
Use [gog](https://github.com/Mikubill/gog) CLI to get OAuth tokens:
```bash
gog login
gog userinfo
```

### Sentry
1. Create project in [Sentry](https://sentry.io)
2. Settings → Projects → YOUR_PROJECT → Client Keys (DSN)

### PostHog
1. Go to [PostHog](https://posthog.com)
2. Project Settings → Environment Variables

### Notion
1. [Notion My Integrations](https://www.notion.so/my-integrations)
2. Create new integration
3. Share database with integration to get database ID

### Linear
1. Linear Settings → API
2. Generate API key

### Stripe
1. [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy secret key (starts with `sk_`)

## License

MIT License - feel free to use and modify!

---

Built with ❤️ by [Agentcy.co.za](https://agentcy.co.za)