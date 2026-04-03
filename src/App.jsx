import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './App.css'

// ==================== LOGIN ====================
function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === 'admin' || password === 'michael') {
      localStorage.setItem('wt_user', 'true')
      onLogin(true)
    } else {
      setError('Invalid code')
    }
  }
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Watchtower</h1>
        <form onSubmit={handleSubmit}>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Access code" className="login-input" />
          <button type="submit" className="login-btn">Enter</button>
        </form>
        {error && <span className="login-error">{error}</span>}
      </div>
    </div>
  )
}

// ==================== COMPONENTS ====================
const SectionCard = ({ title, icon, children }) => (
  <motion.div className="section-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <div className="section-header">
      <span className="section-icon">{icon}</span>
      <h2>{title}</h2>
    </div>
    <div className="section-content">{children}</div>
  </motion.div>
)

const AlertBanner = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null
  return (
    <div className="alert-banner">
      {alerts.map((alert, i) => (
        <div key={i} className={`alert-item ${alert.severity}`}>
          <span className="alert-icon">
            {alert.severity === 'high' ? '🚨' : alert.severity === 'medium' ? '⚠️' : 'ℹ️'}
          </span>
          <span className="alert-message">{alert.message}</span>
        </div>
      ))}
    </div>
  )
}

const StatBadge = ({ label, value }) => (
  <div className="stat-badge">
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
  </div>
)

const LeadCard = ({ lead, onQualify, onRemove }) => (
  <div className="lead-card">
    <div className="lead-header">
      <span className="lead-name">{lead.name}</span>
      <span className={`lead-score ${lead.score >= 7 ? 'hot' : lead.score >= 4 ? 'warm' : 'cold'}`}>
        {lead.score}/10
      </span>
    </div>
    <div className="lead-details">
      {lead.location && <span className="lead-meta">📍 {lead.location}</span>}
      {lead.website && <span className="lead-meta">🌐 {lead.website}</span>}
      {lead.phone && <span className="lead-meta">📞 {lead.phone}</span>}
    </div>
    <div className="lead-notes">{lead.notes}</div>
    <div className="lead-actions">
      <button onClick={() => onQualify(lead.id)} className="lead-action-btn">✓ Qualify</button>
      <button onClick={() => onRemove(lead.id)} className="lead-action-btn remove">✕</button>
    </div>
  </div>
)

const WorkflowCard = ({ workflow, onRun }) => (
  <div className="workflow-card">
    <div className="workflow-header">
      <span className="workflow-icon">{workflow.icon}</span>
      <span className="workflow-name">{workflow.name}</span>
    </div>
    <p className="workflow-desc">{workflow.description}</p>
    <div className="workflow-agents">
      {workflow.agents.map((agent, i) => (
        <span key={i} className="agent-tag">{agent}</span>
      ))}
    </div>
    <button onClick={() => onRun(workflow.id)} className="workflow-run-btn">
      ▶ Run Workflow
    </button>
  </div>
)

const TaskRow = ({ task }) => (
  <div className="task-row">
    <span className="task-title">{task.title}</span>
    <span className={`task-state ${task.state?.name?.toLowerCase()}`}>{task.state?.name}</span>
  </div>
)

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

// ==================== MAIN APP ====================
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [leads, setLeads] = useState([])
  const [workflowsRunning, setWorkflowsRunning] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  // Workflow definitions
  const workflows = [
    {
      id: 'research_leads',
      name: 'Research Leads',
      icon: '🔍',
      description: 'Find businesses in a niche and location',
      agents: ['Research Agent'],
      prompt: 'Find 5 yoga studios in Cape Town, South Africa. For each provide: name, location, website, phone if available.'
    },
    {
      id: 'research_qualify',
      name: 'Research + Qualify',
      icon: '🎯',
      description: 'Find leads and score them for fit',
      agents: ['Research Agent', 'Qualify Agent'],
      prompt: 'Find 5瑜伽 studios in Cape Town, then score each on: budget potential (1-10), tech fit (1-10), timeline (1-10)'
    },
    {
      id: 'full_outreach',
      name: 'Full Pipeline',
      icon: '🚀',
      description: 'Research, qualify, and draft outreach',
      agents: ['Research Agent', 'Qualify Agent', 'Outreach Agent'],
      prompt: 'Find 5 businesses, qualify top 3, draft outreach email for each'
    },
    {
      id: 'competitor_analysis',
      name: 'Competitor Analysis',
      icon: '⚔️',
      description: 'Research a competitor in detail',
      agents: ['Research Agent', 'Analysis Agent'],
      prompt: 'Research a competitor. Find: what they do, pricing, strengths, weaknesses, recent news'
    }
  ]

  // Pre-loaded leads from research
  const sampleLeads = [
    { id: 1, name: 'Yoga Loft', location: 'Kloof St & Waterkant St, Cape Town', website: 'yogaloft.co.za', phone: '', score: 7, notes: 'Premium studio, likely mid-high budget' },
    { id: 2, name: 'Yo Yoga', location: 'Observatory, Cape Town', website: 'yoyoga.co.za', phone: '083 690 7967', score: 6, notes: 'Heated yoga, modern setup' },
    { id: 3, name: 'Yoga Life', location: 'Waterkant St, Cape Town', website: 'yogalife.co.za', phone: '021 418 2884', score: 8, notes: 'Established, good potential' },
  ]

  useEffect(() => {
    if (localStorage.getItem('wt_user')) setIsLoggedIn(true)
    setLeads(sampleLeads)
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/data')
      if (!res.ok) throw new Error('API error')
      setData(await res.json())
      setError(null)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchData()
      const interval = setInterval(fetchData, 60000)
      return () => clearInterval(interval)
    }
  }, [isLoggedIn])

  const runWorkflow = async (workflowId) => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (!workflow) return
    
    setWorkflowsRunning(prev => ({ ...prev, [workflowId]: true }))
    
    // Simulate workflow - in production this would call API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setWorkflowsRunning(prev => ({ ...prev, [workflowId]: false }))
    
    // Add sample lead results
    if (workflowId === 'research_leads' || workflowId === 'research_qualify') {
      const newLeads = [
        { id: Date.now(), name: 'New Business Found', location: 'Cape Town', website: 'example.com', score: 5, notes: 'Discovered via research' }
      ]
      setLeads(prev => [...newLeads, ...prev])
    }
  }

  const removeLead = (id) => {
    setLeads(prev => prev.filter(l => l.id !== id))
  }

  const qualifyLead = (id) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, qualified: true } : l))
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'agents', label: 'Agents', icon: '🤖' },
    { id: 'leads', label: 'Leads', icon: '🎯' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'tasks', label: 'Tasks', icon: '📋' },
  ]

  if (!isLoggedIn) return <Login onLogin={setIsLoggedIn} />

  return (
    <div className="watchtower">
      <div className="bg-pattern" />
      <div className="container">
        <motion.header className="header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Watchtower</h1>
          <p>Autonomous Agent System</p>
        </motion.header>

        {data?.autonomous?.alerts && data.autonomous.alerts.length > 0 && (
          <AlertBanner alerts={data.autonomous.alerts} />
        )}

        <div className="controls">
          <nav className="tabs">
            {tabs.map(tab => (
              <button key={tab.id} className={`tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </nav>
          <div className="controls-right">
            <button className="refresh-btn" onClick={fetchData}>🔄</button>
            <button className="logout-btn" onClick={() => { localStorage.removeItem('wt_user'); setIsLoggedIn(false) }}>🔒</button>
          </div>
        </div>

        {loading ? <div className="loading"><div className="spinner" />Loading...</div> : error ? <div className="error">{error}</div> : (
          <div className="content">
            {/* OVERVIEW */}
            {activeTab === 'overview' && data && (
              <div className="overview-grid">
                <SectionCard title="System Health" icon="💚">
                  <div className="health-grid">
                    <div className="health-item healthy"><span className="health-num">{data.vercel?.stats?.healthy || 0}</span><span className="health-label">Healthy</span></div>
                    <div className="health-item error"><span className="health-num">{data.vercel?.stats?.error || 0}</span><span className="health-label">Errors</span></div>
                    <div className="health-item building"><span className="health-num">{leads.length}</span><span className="health-label">Leads</span></div>
                  </div>
                </SectionCard>
                <SectionCard title="Quick Stats" icon="📈">
                  <div className="stats-grid">
                    <StatBadge label="Projects" value={data.vercel?.total || 0} />
                    <StatBadge label="Repos" value={data.github?.total || 0} />
                    <StatBadge label="Tasks" value={data.linear?.openCount || 0} />
                    <StatBadge label="Leads" value={leads.length} />
                  </div>
                </SectionCard>
                <SectionCard title="Recent Activity" icon="🚀">
                  <div className="deployments-list">
                    {(data.vercel?.deployments || []).slice(0, 4).map((d, i) => (
                      <div key={i} className="deployment-item">
                        <span className={`deploy-state ${d.state}`}>{d.state}</span>
                        <span className="deploy-name">{d.projectName}</span>
                        <span className="deploy-time">{formatTimeAgo(new Date(d.created))}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
                <SectionCard title="Today's Tasks" icon="📋">
                  <div className="tasks-list">
                    {(data.linear?.issues || []).slice(0, 4).map((t, i) => <TaskRow key={i} task={t} />)}
                    {(!data.linear?.issues || data.linear.issues.length === 0) && <div className="empty-state">No tasks</div>}
                  </div>
                </SectionCard>
              </div>
            )}

            {/* AGENTS TAB */}
            {activeTab === 'agents' && (
              <SectionCard title="Agent Workflows" icon="🤖">
                <p className="section-desc">Run multi-agent workflows to automate research, qualification, and outreach</p>
                <div className="workflows-grid">
                  {workflows.map(w => (
                    <WorkflowCard 
                      key={w.id} 
                      workflow={w} 
                      onRun={runWorkflow}
                    />
                  ))}
                </div>
                {Object.values(workflowsRunning).some(v => v) && (
                  <div className="workflow-status">
                    ⏳ Running workflow...
                  </div>
                )}
              </SectionCard>
            )}

            {/* LEADS TAB */}
            {activeTab === 'leads' && (
              <SectionCard title="Lead Pipeline" icon="🎯">
                <div className="leads-stats">
                  <span className="lead-stat hot">Hot: {leads.filter(l => l.score >= 7).length}</span>
                  <span className="lead-stat warm">Warm: {leads.filter(l => l.score >= 4 && l.score < 7).length}</span>
                  <span className="lead-stat cold">Cold: {leads.filter(l => l.score < 4).length}</span>
                </div>
                <div className="leads-list">
                  {leads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} onQualify={qualifyLead} onRemove={removeLead} />
                  ))}
                  {leads.length === 0 && <div className="empty-state">No leads yet. Run a research workflow to find leads.</div>}
                </div>
              </SectionCard>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && data && (
              <SectionCard title="All Projects" icon="📁">
                <div className="all-projects-list">
                  {filterBySearch(data.vercel?.projects || []).map(p => (
                    <div key={p.id} className="project-full-row">
                      <div className="project-main">
                        <span className="project-name">{p.name}</span>
                        <span className="project-meta">{p.framework || 'unknown'}</span>
                      </div>
                      <div className="project-actions">
                        {p.latestDeployments?.[0]?.url && <a href={p.latestDeployments[0].url} target="_blank" className="project-link">Live</a>}
                        <a href={`https://vercel.com/dashboard?project=${p.id}`} target="_blank" className="project-link">Dashboard</a>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* TASKS TAB */}
            {activeTab === 'tasks' && data && (
              <SectionCard title="Linear Tasks" icon="📋">
                <div className="tasks-full-list">
                  {(data.linear?.issues || []).map(t => (
                    <div key={t.id} className="task-full-row">
                      <span className="task-title">{t.title}</span>
                      <span className={`task-state ${t.state?.name?.toLowerCase()}`}>{t.state?.name}</span>
                    </div>
                  ))}
                  {(!data.linear?.issues || data.linear.issues.length === 0) && <div className="empty-state">No tasks or Linear not configured</div>}
                </div>
              </SectionCard>
            )}
          </div>
        )}

        <footer className="footer">Watchtower v4.0 • Agent System • <a href="https://github.com/mikewithoutthemechanics/watchtower">GitHub</a></footer>
      </div>
    </div>
  )
  
  function filterBySearch(items) {
    if (!searchTerm || !items) return items
    return items.filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  }
}

export default App