// Watchtower API - Server-side data fetching with Gmail & Calendar
export default async function handler(req, res) {
  // Core API Tokens
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  
  // Google OAuth credentials (from gogcli or Google Cloud Console)
  // IMPORTANT: Add these to your Vercel project environment variables
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
  const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
  
  // Monitoring Service API Keys
  const SENTRY_DSN = process.env.SENTRY_DSN
  const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY
  const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID
  const PLAUSIBLE_SITE_ID = process.env.PLAUSIBLE_SITE_ID
  const UPTIMEROBOT_API_KEY = process.env.UPTIMEROBOT_API_KEY
  
  // Additional Integrations
  const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK
  const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK
  const NOTION_API_KEY = process.env.NOTION_API_KEY
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID
  const LINEAR_API_KEY = process.env.LINEAR_API_KEY
  const STRIPE_API_KEY = process.env.STRIPE_API_KEY
  
  // Helper to get Google access token
  async function getGoogleAccessToken() {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: 'refresh_token'
      })
    })
    const data = await response.json()
    return data.access_token
  }
  
  // Fetch Gmail messages
  async function fetchGmail() {
    try {
      const accessToken = await getGoogleAccessToken()
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const data = await response.json()
      
      // Get message details
      const messages = await Promise.all(
        (data.messages || []).slice(0, 5).map(async (msg) => {
          const msgRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          )
          const msgData = await msgRes.json()
          
          // Extract headers
          const headers = msgData.payload?.headers || []
          const subject = headers.find(h => h.name === 'Subject')?.value || 'No subject'
          const from = headers.find(h => h.name === 'From')?.value || 'Unknown'
          const date = headers.find(h => h.name === 'Date')?.value || ''
          
          return { id: msg.id, subject, from, date, snippet: msgData.snippet }
        })
      )
      
      return { count: messages.length, messages }
    } catch (error) {
      return { count: 0, messages: [], error: error.message }
    }
  }
  
  // Fetch Calendar events
  async function fetchCalendar() {
    try {
      const accessToken = await getGoogleAccessToken()
      const now = new Date().toISOString()
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&timeMax=${nextWeek}&maxResults=10`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const data = await response.json()
      
      const events = (data.items || []).map(event => ({
        id: event.id,
        summary: event.summary || 'No title',
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        location: event.location,
        description: event.description
      }))
      
      return { count: events.length, events }
    } catch (error) {
      return { count: 0, events: [], error: error.message }
    }
  }
  
  try {
    // Fetch Vercel projects
    const vercelRes = await fetch('https://api.vercel.com/v9/projects', {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
    })
    const vercelData = await vercelRes.json()
    
    // Fetch GitHub repos
    const githubRes = await fetch(
      'https://api.github.com/user/repos?sort=updated&per_page=15',
      { 
        headers: { 
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    )
    const githubData = await githubRes.json()
    
    // Fetch Gmail & Calendar in parallel
    const [gmail, calendar] = await Promise.all([fetchGmail(), fetchCalendar()])
    
  // Fetch monitoring services
  async function fetchSentry() {
    if (!SENTRY_DSN) return { configured: false }
    // Sentry DSN format: https://abc@sentry.io/123
    const match = SENTRY_DSN.match(/sentry\.io\/(\d+)/)
    if (!match) return { configured: false, error: 'Invalid DSN format' }
    
    try {
      const response = await fetch(`https://sentry.io/api/0/projects/${match[1]}/`, {
        headers: { Authorization: `DSN ${SENTRY_DSN}` }
      })
      const data = await response.json()
      return { configured: true, projects: data, org: match[1] }
    } catch (error) {
      return { configured: false, error: error.message }
    }
  }
  
  async function fetchPostHog() {
    if (!POSTHOG_API_KEY || !POSTHOG_PROJECT_ID) return { configured: false }
    try {
      const response = await fetch(
        `https://app.posthog.com/api/projects/${POSTHOG_PROJECT_ID}/insights/trend/?compare=previous`,
        { headers: { Authorization: `Bearer ${POSTHOG_API_KEY}` } }
      )
      const data = await response.json()
      return { configured: true, ...data }
    } catch (error) {
      return { configured: false, error: error.message }
    }
  }
  
  async function fetchPlausible() {
    if (!PLAUSIBLE_SITE_ID) return { configured: false }
    try {
      const response = await fetch(
        `https://plausible.io/api/v1/stats/aggregate?site_id=${PLAUSIBLE_SITE_ID}&period=7d`,
        { headers: { Authorization: `Bearer ${PLAUSIBLE_SITE_ID}` } }
      )
      const data = await response.json()
      return { configured: true, ...data }
    } catch (error) {
      return { configured: false, error: error.message }
    }
  }
  
  async function fetchUptimeRobot() {
    if (!UPTIMEROBOT_API_KEY) return { configured: false }
    try {
      const response = await fetch(
        'https://api.uptimerobot.com/v2/getMonitors',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: UPTIMEROBOT_API_KEY, format: 'json' })
        }
      )
      const data = await response.json()
      return { configured: true, monitors: data.monitors || [], total: data.total }
    } catch (error) {
      return { configured: false, error: error.message }
    }
  }
  
  // Fetch additional integrations
  async function fetchNotion() {
    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) return { configured: false }
    try {
      const response = await fetch(
        `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NOTION_API_KEY}`,
            'Notion-Version': '2022-06-28'
          }
        }
      )
      const data = await response.json()
      return { configured: true, pages: data.results?.length || 0 }
    } catch (error) {
      return { configured: false, error: error.message }
    }
  }
  
  async function fetchLinear() {
    if (!LINEAR_API_KEY) return { configured: false }
    try {
      const response = await fetch('https://api.linear.app/graphql', {
        method: 'POST',
        headers: {
          'Authorization': LINEAR_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: '{ issues { nodes { id title state { name } } } }' })
      })
      const data = await response.json()
      return { configured: true, issues: data.data?.issues?.nodes || [] }
    } catch (error) {
      return { configured: false, error: error.message }
    }
  }
  
  async function fetchStripe() {
    if (!STRIPE_API_KEY) return { configured: false }
    try {
      const response = await fetch('https://api.stripe.com/v1/balance', {
        headers: { Authorization: `Bearer ${STRIPE_API_KEY}` }
      })
      const data = await response.json()
      return { configured: true, balance: data }
    } catch (error) {
      return { configured: false, error: error.message }
    }
  }
  
  try {
    // Fetch all data in parallel
    const [
      vercelData,
      githubData,
      gmail,
      calendar,
      sentry,
      posthog,
      plausible,
      uptimerobot,
      notion,
      linear,
      stripe
    ] = await Promise.all([
      // Core
      VERCEL_TOKEN ? fetch('https://api.vercel.com/v9/projects', { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }).then(r => r.json()) : Promise.resolve({ projects: [] }),
      GITHUB_TOKEN ? fetch('https://api.github.com/user/repos?sort=updated&per_page=15', { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }).then(r => r.json()) : Promise.resolve([]),
      fetchGmail(),
      fetchCalendar(),
      // Monitoring
      fetchSentry(),
      fetchPostHog(),
      fetchPlausible(),
      fetchUptimeRobot(),
      // Additional
      fetchNotion(),
      fetchLinear(),
      fetchStripe()
    ])
    
    res.status(200).json({
      vercel: {
        projects: vercelData.projects || [],
        total: vercelData.projects?.length || 0,
        connected: !!VERCEL_TOKEN
      },
      github: {
        repos: Array.isArray(githubData) ? githubData : [],
        total: Array.isArray(githubData) ? githubData.length : 0,
        connected: !!GITHUB_TOKEN
      },
      gmail: gmail.error ? { ...gmail, connected: false } : { ...gmail, connected: !gmail.error },
      calendar: calendar.error ? { ...calendar, connected: false } : { ...calendar, connected: !calendar.error },
      monitoring: { sentry, posthog, plausible, uptimerobot },
      integrations: { notion, linear, stripe }
    })
    
  } catch (error) {
    console.error('Watchtower API error:', error)
    res.status(500).json({ error: error.message })
  }
}