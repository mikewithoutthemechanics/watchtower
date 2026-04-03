import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './App.css'

// ==================== COMPONENTS ====================
const SectionCard = ({ title, icon, children, delay = 0 }) => (
  <motion.div 
    className="section-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <div className="section-header">
      <span className="section-icon">{icon}</span>
      <h2>{title}</h2>
    </div>
    <div className="section-content">{children}</div>
  </motion.div>
)

const StatBadge = ({ label, value, status }) => (
  <div className="stat-badge">
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
    {status && <span className={`stat-status ${status}`}>{status}</span>}
  </div>
)

const ProjectRow = ({ name, url, status, lastDeploy, branch }) => (
  <div className="project-row">
    <span className={`status-dot ${status}`} />
    <span className="project-name">{name}</span>
    <span className="project-branch">{branch || 'main'}</span>
    <span className="project-deploy">{lastDeploy}</span>
  </div>
)

const RepoRow = ({ name, description, language, stars, url, forks }) => (
  <a href={url} target="_blank" className="repo-row">
    <div className="repo-top">
      <span className="repo-name">{name}</span>
      {stars > 0 && <span className="repo-stars">⭐ {stars}</span>}
      {forks > 0 && <span className="repo-forks">⑂ {forks}</span>}
    </div>
    <span className="repo-desc">{description || 'No description'}</span>
    {language && <span className="repo-lang">{language}</span>}
  </a>
)

const DeploymentCard = ({ name, status, createdAt, state, branch, commit }) => (
  <div className="deployment-card">
    <div className="deploy-header">
      <h3>{name}</h3>
      <span className={`deploy-status ${state || status}`}>{state || status}</span>
    </div>
    <div className="deploy-meta">
      <span>Branch: {branch || 'main'}</span>
      <span>{commit?.substring(0, 7) || 'N/A'}</span>
      <span>{new Date(createdAt).toLocaleDateString()}</span>
    </div>
  </div>
)

const MonitoringCard = ({ name, icon, description, status, onSetup, error }) => {
  const isConfigured = status === 'configured' || status === true
  return (
    <div className="monitoring-card">
      <span className="monitor-icon">{icon}</span>
      <h4>{name}</h4>
      <p>{description}</p>
      <span className={`monitor-status ${isConfigured ? 'configured' : error ? 'error' : 'pending'}`}>
        {isConfigured ? 'Connected' : error ? 'Error' : 'Not configured'}
      </span>
      <button className="setup-btn" onClick={onSetup}>
        {isConfigured ? 'Configure' : 'Setup'}
      </button>
    </div>
  )
}

const IntegrationCard = ({ name, icon, description, connected, onSetup }) => (
  <div className="integration-card">
    <div className="integration-header">
      <div className="integration-icon">{icon}</div>
      <div className="integration-info">
        <h4>{name}</h4>
        <p>{description}</p>
      </div>
    </div>
    <div className="integration-status">
      <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`} />
      <span>{connected ? 'Connected' : 'Not connected'}</span>
    </div>
  </div>
)

// ==================== MAIN APP ====================
function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('API error')
        const apiData = await res.json()
        setData(apiData)
        setError(null)
      } catch (e) {
        console.error('API fetch failed:', e)
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'deployments', label: 'Deployments', icon: '🚀' },
    { id: 'code', label: 'Code', icon: '🐙' },
    { id: 'communications', label: 'Comm', icon: '📧' },
    { id: 'monitoring', label: 'Monitoring', icon: '🔍' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
  ]

  return (
    <div className="watchtower">
      <div className="bg-pattern" />
      
      <div className="container">
        <motion.header 
          className="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Watchtower</h1>
          <p>Your mission control center</p>
        </motion.header>

        <nav className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <p>Loading Watchtower...</p>
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="content">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && data && (
              <div className="overview-grid">
                <SectionCard title="Vercel Projects" icon="▲" delay={0}>
                  {data.vercel?.projects?.slice(0, 5).map(p => (
                    <ProjectRow 
                      key={p.id} 
                      name={p.name} 
                      url={p.url} 
                      status="ready" 
                      lastDeploy={new Date(p.updatedAt || Date.now()).toLocaleDateString()}
                      branch={p.branch}
                    />
                  ))}
                  {data.vercel?.total > 5 && (
                    <div className="view-more">
                      +{data.vercel.total - 5} more projects
                    </div>
                  )}
                </SectionCard>
                
                <SectionCard title="GitHub Repositories" icon="🐙" delay={0.1}>
                  {data.github?.repos?.slice(0, 5).map(r => (
                    <RepoRow 
                      key={r.id}
                      name={r.name}
                      description={r.description}
                      language={r.language}
                      stars={r.stargazers_count}
                      forks={r.forks_count}
                      url={r.html_url}
                    />
                  ))}
                </SectionCard>
                
                <SectionCard title="Quick Stats" icon="📈" delay={0.2}>
                  <div className="stats-grid">
                    <StatBadge label="Projects" value={data.vercel?.total || 0} status={data.vercel?.connected ? "ready" : "pending"} />
                    <StatBadge label="Repos" value={data.github?.total || 0} status={data.github?.connected ? "ready" : "pending"} />
                    <StatBadge label="Monitoring" value={Object.values(data.monitoring || {}).filter(m => m.configured).length} status="ready" />
                    <StatBadge label="APIs" value={Object.values(data.integrations || {}).filter(i => i.configured).length} status="ready" />
                  </div>
                </SectionCard>
                
                <SectionCard title="System Status" icon="⚡" delay={0.3}>
                  <div className="system-status">
                    <div className="status-item">
                      <span className="status-label">Vercel</span>
                      <span className={`status-value ${data.vercel?.connected ? 'ready' : 'disconnected'}`}>
                        {data.vercel?.connected ? 'Connected' : 'Not configured'}
                      </span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">GitHub</span>
                      <span className={`status-value ${data.github?.connected ? 'ready' : 'disconnected'}`}>
                        {data.github?.connected ? 'Connected' : 'Not configured'}
                      </span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Gmail</span>
                      <span className={`status-value ${data.gmail?.connected ? 'ready' : 'disconnected'}`}>
                        {data.gmail?.connected ? `${data.gmail.count} messages` : 'Not configured'}
                      </span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Calendar</span>
                      <span className={`status-value ${data.calendar?.connected ? 'ready' : 'disconnected'}`}>
                        {data.calendar?.connected ? `${data.calendar.count} events` : 'Not configured'}
                      </span>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* DEPLOYMENTS TAB */}
            {activeTab === 'deployments' && data && (
              <SectionCard title="All Projects & Deployments" icon="🚀" delay={0}>
                {data.vercel?.projects?.map(p => (
                  <DeploymentCard 
                    key={p.id}
                    name={p.name}
                    state="ready"
                    createdAt={p.updatedAt}
                    branch={p.branch}
                  />
                ))}
                {(!data.vercel?.projects || data.vercel.projects.length === 0) && (
                  <p className="empty-state">No projects found. Configure VERCEL_TOKEN to see deployments.</p>
                )}
              </SectionCard>
            )}

            {/* CODE TAB */}
            {activeTab === 'code' && data && (
              <SectionCard title="GitHub Repositories" icon="🐙" delay={0}>
                {data.github?.repos?.map(r => (
                  <RepoRow 
                    key={r.id}
                    name={r.name}
                    description={r.description}
                    language={r.language}
                    stars={r.stargazers_count}
                    forks={r.forks_count}
                    url={r.html_url}
                  />
                ))}
                {(!data.github?.repos || data.github.repos.length === 0) && (
                  <p className="empty-state">No repositories found. Configure GITHUB_TOKEN to see repos.</p>
                )}
              </SectionCard>
            )}

            {/* COMMUNICATIONS TAB */}
            {activeTab === 'communications' && data && (
              <div className="comm-grid">
                <SectionCard title="Gmail" icon="📧" delay={0}>
                  <div className="email-list">
                    {data.gmail?.messages?.length > 0 ? (
                      data.gmail.messages.slice(0, 5).map(m => (
                        <div key={m.id} className="email-item">
                          <div className="email-from">{m.from}</div>
                          <div className="email-subject">{m.subject}</div>
                          <div className="email-snippet">{m.snippet?.substring(0, 80)}...</div>
                        </div>
                      ))
                    ) : (
                      <p className="empty-state">
                        {data.gmail?.connected ? 'No recent emails' : 'Configure GOOGLE_REFRESH_TOKEN to see emails'}
                      </p>
                    )}
                  </div>
                </SectionCard>
                <SectionCard title="Calendar" icon="📅" delay={0.1}>
                  <div className="calendar-list">
                    {data.calendar?.events?.length > 0 ? (
                      data.calendar.events.slice(0, 5).map(e => (
                        <div key={e.id} className="calendar-item">
                          <div className="event-title">{e.summary}</div>
                          <div className="event-time">🕐 {e.start}</div>
                          {e.location && <div className="event-location">📍 {e.location}</div>}
                        </div>
                      ))
                    ) : (
                      <p className="empty-state">
                        {data.calendar?.connected ? 'No upcoming events this week' : 'Configure GOOGLE_REFRESH_TOKEN to see calendar'}
                      </p>
                    )}
                  </div>
                </SectionCard>
              </div>
            )}

            {/* MONITORING TAB */}
            {activeTab === 'monitoring' && data && (
              <SectionCard title="Monitoring & Analytics" icon="🔍" delay={0}>
                <div className="monitoring-grid">
                  <MonitoringCard 
                    name="Sentry" 
                    icon="🐛"
                    description="Error tracking & performance monitoring"
                    status={data.monitoring?.sentry?.configured}
                    error={data.monitoring?.sentry?.error}
                    onSetup={() => alert('Add SENTRY_DSN to Watchtower API environment variables')}
                  />
                  <MonitoringCard 
                    name="PostHog" 
                    icon="📈"
                    description="Product analytics, funnels, session recordings"
                    status={data.monitoring?.posthog?.configured}
                    error={data.monitoring?.posthog?.error}
                    onSetup={() => alert('Add POSTHOG_API_KEY and POSTHOG_PROJECT_ID to Watchtower API environment variables')}
                  />
                  <MonitoringCard 
                    name="Plausible" 
                    icon="📊"
                    description="Privacy-friendly website analytics"
                    status={data.monitoring?.plausible?.configured}
                    error={data.monitoring?.plausible?.error}
                    onSetup={() => alert('Add PLAUSIBLE_SITE_ID to Watchtower API environment variables')}
                  />
                  <MonitoringCard 
                    name="UptimeRobot" 
                    icon="⏰"
                    description="Website uptime monitoring & alerts"
                    status={data.monitoring?.uptimerobot?.configured}
                    error={data.monitoring?.uptimerobot?.error}
                    onSetup={() => alert('Add UPTIMEROBOT_API_KEY to Watchtower API environment variables')}
                  />
                </div>
              </SectionCard>
            )}

            {/* INTEGRATIONS TAB */}
            {activeTab === 'integrations' && data && (
              <SectionCard title="Additional Integrations" icon="🔗" delay={0}>
                <div className="integrations-grid">
                  <IntegrationCard 
                    name="Slack" 
                    icon="💬"
                    description="Team messaging & alerts"
                    connected={!!data.integrations?.slack}
                    onSetup={() => alert('Add SLACK_WEBHOOK to Watchtower API environment variables')}
                  />
                  <IntegrationCard 
                    name="Discord" 
                    icon="🎮"
                    description="Server & community platform"
                    connected={!!data.integrations?.discord}
                    onSetup={() => alert('Add DISCORD_WEBHOOK to Watchtower API environment variables')}
                  />
                  <IntegrationCard 
                    name="Notion" 
                    icon="📝"
                    description="Knowledge base & docs"
                    connected={data.integrations?.notion?.configured}
                    onSetup={() => alert('Add NOTION_API_KEY and NOTION_DATABASE_ID to Watchtower API environment variables')}
                  />
                  <IntegrationCard 
                    name="Linear" 
                    icon="📋"
                    description="Issue tracking & project management"
                    connected={data.integrations?.linear?.configured}
                    onSetup={() => alert('Add LINEAR_API_KEY to Watchtower API environment variables')}
                  />
                  <IntegrationCard 
                    name="Stripe" 
                    icon="💳"
                    description="Payments & billing"
                    connected={data.integrations?.stripe?.configured}
                    onSetup={() => alert('Add STRIPE_API_KEY to Watchtower API environment variables')}
                  />
                </div>
              </SectionCard>
            )}
          </div>
        )}

        <footer className="footer">
          <p>Watchtower v1.0 • Configure API keys in your Vercel project settings</p>
        </footer>
      </div>
    </div>
  )
}

export default App