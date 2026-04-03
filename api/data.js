// Watchtower API - Server-side data fetching with autonomous capabilities
export default async function handler(req, res) {
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const LINEAR_API_KEY = process.env.LINEAR_API_KEY
  const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK
  
  // Google OAuth
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
  const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
  
  // Monitoring
  const SENTRY_DSN = process.env.SENTRY_DSN
  const UPTIMEROBOT_API_KEY = process.env.UPTIMEROBOT_API_KEY
  
  // Additional
  const NOTION_API_KEY = process.env.NOTION_API_KEY
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID
  const STRIPE_API_KEY = process.env.STRIPE_API_KEY

  // ==================== UTILITIES ====================
  async function getGoogleAccessToken() {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_REFRESH_TOKEN) throw new Error('Google not configured')
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token'
      })
    })
    const data = await response.json()
    if (data.error) throw new Error(data.error_description || data.error)
    return data.access_token
  }

  // ==================== AUTONOMOUS ACTIONS ====================
  
  // Auto-redeploy failed deployments
  async function autoHealDeployments(projects) {
    const healingActions = []
    
    for (const project of projects.slice(0, 5)) {
      try {
        const deployRes = await fetch(
          `https://api.vercel.com/v6/deployments?projectId=${project.id}&limit=1`,
          { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
        )
        const data = await deployRes.json()
        const lastDeploy = data.deployments?.[0]
        
        if (lastDeploy && (lastDeploy.state === 'error' || lastDeploy.state === 'failed')) {
          // Trigger new deployment
          const triggerRes = await fetch(
            `https://api.vercel.com/v6/deployments`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${VERCEL_TOKEN}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                projectId: project.id,
                branch: project.branch || 'main'
              })
            }
          )
          healingActions.push({
            project: project.name,
            action: 'triggered_redeploy',
            status: triggerRes.ok ? 'success' : 'failed'
          })
        }
      } catch (e) {
        // Skip failed attempts
      }
    }
    return healingActions
  }

  // Create Linear task from critical issue
  async function createLinearTask(issue) {
    if (!LINEAR_API_KEY) return null
    try {
      const response = await fetch('https://api.linear.app/graphql', {
        method: 'POST',
        headers: {
          'Authorization': LINEAR_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `mutation { issueCreate(input: { teamId: "your-team-id", title: "${issue.title}", description: "${issue.description}" }) { success } }`
        })
      })
      return response.ok
    } catch (e) {
      return null
    }
  }

  // Send Slack/Discord alert
  async function sendAlert(message, webhook) {
    if (!webhook) return
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      })
    } catch (e) {}
  }

  // ==================== DATA FETCHERS ====================
  async function fetchGmail() {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_REFRESH_TOKEN) return { connected: false, error: 'Not configured' }
    try {
      const accessToken = await getGoogleAccessToken()
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5', { headers: { Authorization: `Bearer ${accessToken}` } })
      const data = await response.json()
      
      // Get urgent emails (starred or important)
      const urgentRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread is:important', { headers: { Authorization: `Bearer ${accessToken}` } })
      const urgentData = await urgentRes.json()
      
      return { 
        connected: true, 
        count: data.messages?.length || 0,
        unread: urgentData.resultSizeEstimate || 0,
        messages: []
      }
    } catch (error) {
      return { connected: false, error: error.message }
    }
  }

  async function fetchCalendar() {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_REFRESH_TOKEN) return { connected: false, error: 'Not configured' }
    try {
      const accessToken = await getGoogleAccessToken()
      const now = new Date().toISOString()
      const nextDay = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now}&timeMax=${nextDay}&maxResults=10`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const data = await response.json()
      
      // Find events starting within 1 hour
      const nowTime = Date.now()
      const upcomingSoon = (data.items || []).filter(e => {
        const start = new Date(e.start?.dateTime || e.start?.date).getTime()
        return start - nowTime < 60 * 60 * 1000 // within 1 hour
      })
      
      return { 
        connected: true, 
        count: data.items?.length || 0,
        upcomingSoon: upcomingSoon.length,
        events: (data.items || []).map(e => ({
          id: e.id,
          summary: e.summary,
          start: e.start?.dateTime || e.start?.date,
          location: e.location
        }))
      }
    } catch (error) {
      return { connected: false, error: error.message }
    }
  }

  async function fetchVercelData() {
    if (!VERCEL_TOKEN) return { projects: [], deployments: [], projectCount: 0 }
    
    try {
      const projectsRes = await fetch('https://api.vercel.com/v9/projects', { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } })
      const projectsData = await projectsRes.json()
      const projects = projectsData.projects || []
      
      // Get deployments for each project
      const deployments = []
      const projectStats = { healthy: 0, error: 0, building: 0 }
      
      for (const project of projects.slice(0, 15)) {
        try {
          const deployRes = await fetch(`https://api.vercel.com/v6/deployments?projectId=${project.id}&limit=3`, { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } })
          const deployData = await deployRes.json()
          
          const latestState = deployData.deployments?.[0]?.state
          if (latestState === 'ready' || latestState === 'success') projectStats.healthy++
          else if (latestState === 'error' || latestState === 'failed') projectStats.error++
          else if (latestState === 'building' || latestState === 'pending') projectStats.building++
          
          if (deployData.deployments) {
            deployData.deployments.forEach(d => {
              d.projectName = project.name
              deployments.push(d)
            })
          }
        } catch (e) {}
      }
      
      // Auto-heal action
      const healing = await autoHealDeployments(projects)
      
      deployments.sort((a, b) => new Date(b.created) - new Date(a.created))
      
      return { 
        projects, 
        deployments: deployments.slice(0, 30), 
        projectCount: projects.length,
        stats: projectStats,
        healing
      }
    } catch (error) {
      return { projects: [], deployments: [], projectCount: 0, error: error.message }
    }
  }

  async function fetchLinear() {
    if (!LINEAR_API_KEY) return { configured: false }
    try {
      // Get my open issues
      const response = await fetch('https://api.linear.app/graphql', {
        method: 'POST',
        headers: { 'Authorization': LINEAR_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `{ me { assignedIssues(filter: { state: { ne: "completed" } }) { nodes { id title state { name } } } } }`
        })
      })
      const data = await response.json()
      const issues = data.data?.me?.assignedIssues?.nodes || []
      return { configured: true, openCount: issues.length, issues }
    } catch (error) {
      return { configured: false, error: error.message }
    }
  }

  async function fetchStripe() {
    if (!STRIPE_API_KEY) return { configured: false }
    try {
      const response = await fetch('https://api.stripe.com/v1/balance', { headers: { Authorization: `Bearer ${STRIPE_API_KEY}` } })
      const data = await response.json()
      return { 
        configured: true, 
        available: data.available?.[0]?.amount / 100 || 0,
        pending: data.pending?.[0]?.amount / 100 || 0,
        currency: data.available?.[0]?.currency || 'zar'
      }
    } catch (error) {
      return { configured: false, error: error.message }
    }
  }

  async function fetchNotion() {
    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) return { configured: false }
    try {
      const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${NOTION_API_KEY}`, 'Notion-Version': '2022-06-28' }
      })
      const data = await response.json()
      return { configured: true, pages: data.results?.length || 0 }
    } catch (error) {
      return { configured: false, error: error.message }
    }
  }

  // ==================== MAIN HANDLER ====================
  try {
    const [vercel, github, gmail, calendar, linear, stripe, notion] = await Promise.all([
      fetchVercelData(),
      GITHUB_TOKEN ? fetch('https://api.github.com/user/repos?sort=updated&per_page=15', { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }).then(r => r.json()).catch(e => []) : Promise.resolve([]),
      fetchGmail(),
      fetchCalendar(),
      fetchLinear(),
      fetchStripe(),
      fetchNotion()
    ])
    
    // Generate autonomous alerts
    const alerts = []
    
    // Check deployment errors
    if (vercel.stats?.error > 0) {
      alerts.push({ type: 'deployment', severity: 'high', message: `${vercel.stats.error} project(s) have failed deployments` })
    }
    
    // Check upcoming calendar
    if (calendar.upcomingSoon > 0) {
      alerts.push({ type: 'calendar', severity: 'medium', message: `${calendar.upcomingSoon} event(s) starting within 1 hour` })
    }
    
    // Check Linear tasks
    if (linear.openCount > 5) {
      alerts.push({ type: 'tasks', severity: 'low', message: `${linear.openCount} open tasks assigned to you` })
    }
    
    // Check healing actions
    if (vercel.healing?.length > 0) {
      alerts.push({ type: 'auto_heal', severity: 'info', message: `Auto-healed ${vercel.healing.length} deployment(s)` })
    }

    res.status(200).json({
      // Core
      vercel: {
        projects: vercel.projects || [],
        deployments: vercel.deployments || [],
        total: vercel.projectCount || 0,
        stats: vercel.stats,
        healing: vercel.healing,
        connected: !!VERCEL_TOKEN
      },
      
      // Communications
      gmail: gmail,
      calendar: calendar,
      
      // Tasks & Finance
      linear: linear,
      stripe: stripe,
      
      // Other
      github: { repos: Array.isArray(github) ? github : [], total: Array.isArray(github) ? github.length : 0 },
      notion: notion,
      
      // Autonomous features
      autonomous: {
        autoHealEnabled: true,
        alerts: alerts,
        lastChecked: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Watchtower API error:', error)
    res.status(500).json({ error: error.message })
  }
}