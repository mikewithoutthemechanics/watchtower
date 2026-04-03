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

// ==================== AGENT LIBRARY ====================
const AGENT_CATEGORIES = {
  research: "🔍 Research & Discovery",
  analysis: "📊 Analysis & Evaluation", 
  creation: "✍️ Content & Creation",
  outreach: "📢 Outreach & Communication",
  technical: "💻 Technical & Development",
  operations: "⚙️ Operations & Automation",
  management: "📋 Project & Team Management"
}

const AGENTS = {
  // ==================== UI/UX SPECIALIST ====================
  uiux_master: { 
    id: "uiux_master", 
    name: "UI/UX Master", 
    category: "technical", 
    role: "Design Systems Architect", 
    goal: "Build production-grade interfaces with cutting-edge animations, components, and interactions",
    tools: ["ui-ux-pro-max", "21st-dev", "marvin", "unicorn-studio", "framer", "react", "shadcn-ui", "framer-motion", "GSAP", "webfetch", "code_execution", "vercel"],
    capabilities: ["50+ UI styles", "21 color palettes", "50 font pairings", "99 UX guidelines", "Framer integration", "GSAP animations", "Shadcn components", "React/Vue", "Scroll effects", "Design tokens"],
    desc: "Master of modern UI/UX - Framer, ShadCN, GSAP, Unicorn Studio, 21st Dev, Marvin - builds stunning interfaces with text animations, scroll effects, and production-ready components"
  },

  // ==================== SOCIAL MEDIA PIPELINE ====================
  social_media_researcher: {
    id: "social_media_researcher",
    name: "Social Media Researcher",
    category: "research",
    role: "Trend Analyst",
    goal: "Research viral trends, audio transitions, and trending topics from last 3-5 days",
    tools: ["web_search", "social_scraping", "trend_analysis", "platform_research"],
    capabilities: ["Viral trends", "Audio transitions", "Hashtag research", "Platform algorithms", "Trend forecasting"],
    desc: "Researches what's trending across Instagram, Facebook, LinkedIn, TikTok - finds viral audio, formats, and topics from last 3-5 days"
  },
  
  content_writer: {
    id: "content_writer",
    name: "Content Writer",
    category: "creation",
    role: "Copywriter",
    goal: "Transform research into unique, platform-tailored written content",
    tools: ["writing", "seo", "platform_optimization", "thread_creation"],
    capabilities: ["Instagram captions", "Threads", "Facebook posts", "LinkedIn articles", "Hashtags", "Engagement optimization"],
    desc: "Takes research and writes unique, non-plagiarized content tailored to each platform - captions, threads, comments, hashtags"
  },
  
  content_generator: {
    id: "content_generator",
    name: "Image Generator",
    category: "creation",
    role: "Visual Designer",
    goal: "Generate high-fidelity, studio-grade images for each post using UI/UX principles",
    tools: ["image_generation", "ui-ux-pro-max", "dimension_optimization", "aesthetic_design", "platform_sizing"],
    capabilities: ["Studio-grade images", "Platform dimensions", "Aesthetic design", "Post-specific visuals", "High-fidelity output"],
    desc: "Works with UI/UX Master to create polished, designer-quality images tailored to each post and platform dimensions"
  },
  
  thread_creator: {
    id: "thread_creator",
    name: "Thread Creator",
    category: "creation",
    role: "Long-form Specialist",
    goal: "Create engaging threaded content for Twitter/X and LinkedIn",
    tools: ["thread_writing", "thread_design", "engagement_optimization", "formatting"],
    capabilities: ["Twitter threads", "LinkedIn threads", "Thread formatting", "Engagement hooks", "Carousel conversion"],
    desc: "Creates multi-post threads with optimal formatting for maximum engagement and save/share value"
  },
  
  qa_reviewer: {
    id: "qa_reviewer",
    name: "QA & SEO Reviewer",
    category: "analysis",
    role: "Quality Assurance",
    goal: "Review and optimize all content for SEO and accessibility compliance",
    tools: ["seo_analysis", "accessibility_check", "content_review", "optimization"],
    capabilities: ["SEO optimization", "Accessibility audit", "Quality scoring", "AR optimization", "Platform compliance"],
    desc: "Checks all content for SEO, accessibility, quality - ensures optimized for algorithms and human readers"
  },
  
  syndication_agent: {
    id: "syndication_agent",
    name: "Syndication Agent",
    category: "operations",
    role: "Distribution Manager",
    goal: "Deploy posts to all platforms and community spaces",
    tools: ["platform_posting", "scheduling", "api_integration", "cross_posting"],
    capabilities: ["Multi-platform deploy", "Instagram", "Facebook", "LinkedIn", "Twitter/X", "Community spaces", "Scheduling"],
    desc: "Distributes all content across Instagram, Facebook, LinkedIn, Twitter, and community spaces"
  },
  
  analytics_tracker: {
    id: "analytics_tracker",
    name: "Analytics Tracker",
    category: "management",
    role: "Metrics Analyst",
    goal: "Track, collect, and report performance data from all posts",
    tools: ["analytics_collection", "metrics_tracking", "performance_api", "reporting"],
    capabilities: ["Engagement metrics", "Reach analysis", "Conversion tracking", "ROI measurement", "Platform insights", "Embed tracking"],
    desc: "Collects all analytics data - likes, shares, comments, reach, conversions - embeds tracking and generates performance reports"
  },

  // ==================== NEW AGENTS ====================
  video_script_writer: {
    id: "video_script_writer",
    name: "Video Script Writer",
    category: "creation",
    role: "Content Creator",
    goal: "Write engaging video scripts for YouTube, TikTok, Reels",
    tools: ["script_writing", "video_format", "hooks", "cta_design"],
    capabilities: ["YouTube scripts", "TikTok scripts", "Reels scripts", "Hook writing", "CTA optimization", "Pacing"],
    desc: "Writes compelling video scripts with hooks, body, and CTAs tailored to each platform"
  },
  
  seo_analyzer: {
    id: "seo_analyzer",
    name: "SEO Analyzer",
    category: "analysis",
    role: "SEO Specialist",
    goal: "Analyze and optimize content for search engines",
    tools: ["keyword_research", "seo_audit", "meta_optimization", "backlink_analysis"],
    capabilities: ["Keyword research", "On-page SEO", "Meta tags", "Content scoring", "Competitor keywords", "Technical SEO"],
    desc: "Analyzes content for SEO performance - keywords, meta, readability, and search rankings"
  },
  
  contract_generator: {
    id: "contract_generator",
    name: "Contract Generator",
    category: "operations",
    role: "Legal Assistant",
    goal: "Generate legal contracts and agreements",
    tools: ["template_library", "clause_library", "legal_formatting", "variable_insertion"],
    capabilities: ["Service agreements", "NDA templates", "SLA contracts", "Clause library", "Custom variables", "PDF export"],
    desc: "Generates professional contracts from templates with customizable clauses and variables"
  },
  
  invoice_creator: {
    id: "invoice_creator",
    name: "Invoice Creator",
    category: "operations",
    role: "Finance Assistant",
    goal: "Create and send invoices",
    tools: ["invoice_template", "line_items", "tax_calculation", "pdf_generation"],
    capabilities: ["Professional invoices", "Line items", "Tax calculation", "Payment terms", "PDF export", "Email sending"],
    desc: "Creates polished invoices with line items, taxes, and sends to clients"
  },
  
  twitter_agent: {
    id: "twitter_agent",
    name: "Twitter/X Agent",
    category: "outreach",
    role: "Social Manager",
    goal: "Post to Twitter/X and engage with the community",
    tools: ["twitter_api", "post_creation", "engagement", "analytics"],
    capabilities: ["Tweet posting", "Thread creation", "Quote tweets", "Engagement replies", "Analytics", "Scheduling"],
    desc: "Posts directly to Twitter/X - tweets, threads, quotes - with engagement tracking"
  },
  
  slack_notifier: {
    id: "slack_notifier",
    name: "Slack Notifier",
    category: "operations",
    role: "Alert Manager",
    goal: "Send notifications to Slack channels",
    tools: ["slack_api", "channel_routing", "formatting", "webhooks"],
    capabilities: ["Channel routing", "Rich formatting", "File attachments", "Thread replies", "Mention routing"],
    desc: "Sends formatted notifications and alerts to Slack channels with mentions and attachments"
  },
  
  notion_sync: {
    id: "notion_sync",
    name: "Notion Sync",
    category: "operations",
    role: "Knowledge Manager",
    goal: "Sync docs and tasks with Notion",
    tools: ["notion_api", "page_creation", "database_sync", "task_sync"],
    capabilities: ["Page creation", "Database sync", "Task sync", "Template usage", "Link sync"],
    desc: "Creates and syncs pages, databases, and tasks between Watchtower and Notion"
  },
  
  whatsapp_business: {
    id: "whatsapp_business",
    name: "WhatsApp Business",
    category: "outreach",
    role: "Client Messenger",
    goal: "Send notifications to clients via WhatsApp",
    tools: ["whatsapp_api", "template_messages", "bulk_send", "media_sharing"],
    capabilities: ["Template messages", "Bulk broadcasts", "Media sharing", "Status updates", "Client notifications"],
    desc: "Sends WhatsApp messages to clients - notifications, updates, and follow-ups"
  },
  
  pr_reviewer: {
    id: "pr_reviewer",
    name: "PR Reviewer",
    category: "technical",
    role: "Code Reviewer",
    goal: "Auto-review GitHub pull requests",
    tools: ["github_api", "code_analysis", "comment_generation", "approval"],
    capabilities: ["PR detection", "Code analysis", "Comment suggestions", "Approval workflow", "Change requests"],
    desc: "Automatically reviews GitHub PRs - analyzes code, suggests improvements, approves or requests changes"
  },
  
  auto_support: {
    id: "auto_support",
    name: "Auto Support Agent",
    category: "outreach",
    role: "Support Automation",
    goal: "Auto-respond to support tickets",
    tools: ["ticket_analysis", "response_generation", "knowledge_base", "escalation"],
    capabilities: ["Ticket classification", "Auto-responses", "Knowledge base lookup", "Escalation", "SLA tracking"],
    desc: "Automatically responds to support tickets using knowledge base, escalates when needed"
  },
  
  property_manager: {
    id: "property_manager",
    name: "Property Manager",
    category: "operations",
    role: "Real Estate Assistant",
    goal: "Manage property listings and inquiries",
    tools: ["listing_management", "inquiry_routing", "tenant_screening", "maintenance_tracking"],
    capabilities: ["Listing creation", "Inquiry handling", "Tenant screening", "Maintenance requests", "Lease tracking"],
    desc: "Manages property listings, screens tenants, tracks maintenance - for real estate workflows"
  },
  
  ecommerce_lister: {
    id: "ecommerce_lister",
    name: "E-commerce Lister",
    category: "operations",
    role: "Store Manager",
    goal: "List products on e-commerce platforms",
    tools: ["product_data", "image_optimization", "platform_listing", "pricing_strategy"],
    capabilities: ["Product descriptions", "Image prep", "Platform listing", "Pricing", "Inventory sync"],
    desc: "Creates product listings for e-commerce - descriptions, images, pricing for multiple platforms"
  },
  
  candidate_screener: {
    id: "candidate_screener",
    name: "HR Candidate Screener",
    category: "operations",
    role: "Recruiter",
    goal: "Screen job candidates and schedule interviews",
    tools: ["resume_parsing", "score_matching", "interview_scheduling", "filtering"],
    capabilities: ["Resume analysis", "Skills matching", "Score ranking", "Interview scheduling", "Filter by criteria"],
    desc: "Screens candidates from resumes, scores fit, ranks applicants, schedules interviews"
  },

  // RESEARCH
  research_agent: { id: "research_agent", name: "Research Agent", category: "research", role: "Expert Researcher", goal: "Find and compile comprehensive information", tools: ["web_search", "web_fetch"], desc: "Specializes in finding businesses, information, and leads" },
  competitor_researcher: { id: "competitor_researcher", name: "Competitor Analyst", category: "research", role: "Competitive Intelligence", goal: "Analyze competitors and market positioning", tools: ["web_search", "data_analysis"], desc: "Deep-dive into competitor pricing, strengths, weaknesses" },
  lead_finder: { id: "lead_finder", name: "Lead Finder", category: "research", role: "Lead Generation", goal: "Find potential customers matching criteria", tools: ["web_search", "directory_lookup"], desc: "Discovers businesses and contacts for sales pipelines" },
  
  // ANALYSIS
  qualify_agent: { id: "qualify_agent", name: "Qualify Agent", category: "analysis", role: "Lead Qualification", goal: "Score leads on fit, budget, timeline", tools: ["data_analysis", "scoring"], desc: "Evaluates and assigns scores based on conversion likelihood" },
  data_analyzer: { id: "data_analyzer", name: "Data Analyzer", category: "analysis", role: "Data Scientist", goal: "Extract insights from datasets", tools: ["data_analysis", "visualization"], desc: "Analyzes metrics, logs, and data for actionable insights" },
  code_reviewer: { id: "code_reviewer", name: "Code Reviewer", category: "analysis", role: "Senior Developer", goal: "Review code for quality and security", tools: ["code_analysis", "security_scan"], desc: "Detailed code reviews with improvement suggestions" },
  
  // CREATION
  email_drafter: { id: "email_drafter", name: "Email Specialist", category: "creation", role: "Email Marketing", goal: "Draft effective cold emails", tools: ["template_library", "personalization"], desc: "Creates personalized cold emails that get responses" },
  documentation_writer: { id: "documentation_writer", name: "Tech Writer", category: "creation", role: "Documentation Specialist", goal: "Create clear documentation", tools: ["markdown", "api_docs"], desc: "Writes technical docs, API specs, and guides" },
  
  // OUTREACH
  outreach_agent: { id: "outreach_agent", name: "Outreach Agent", category: "outreach", role: "Business Development", goal: "Initiate contact with prospects", tools: ["email_sending", "linkedin"], desc: "Handles initial outreach and engagement" },
  scheduler: { id: "scheduler", name: "Scheduler", category: "outreach", role: "Calendar Manager", goal: "Schedule meetings", tools: ["calendar_integration", "email"], desc: "Coordinates and schedules meetings" },
  support_agent: { id: "support_agent", name: "Support Agent", category: "outreach", role: "Customer Success", goal: "Handle customer inquiries", tools: ["ticket_management", "knowledge_base"], desc: "Provides support and issue resolution" },
  
  // TECHNICAL
  developer_agent: { id: "developer_agent", name: "Developer", category: "technical", role: "Full-Stack Developer", goal: "Write and deploy code", tools: ["code_execution", "git", "deployment"], desc: "Builds and deploys applications" },
  devops_agent: { id: "devops_agent", name: "DevOps Engineer", category: "technical", role: "Infrastructure", goal: "Manage deployments and CI/CD", tools: ["docker", "monitoring", "deployment"], desc: "Handles deployments and infrastructure" },
  qa_tester: { id: "qa_tester", name: "QA Tester", category: "technical", role: "QA Specialist", goal: "Test software and identify issues", tools: ["test_execution", "bug_tracking"], desc: "Tests applications and documents bugs" },
  
  // OPERATIONS
  workflow_orchestrator: { id: "workflow_orchestrator", name: "Workflow Orchestrator", category: "operations", role: "Automation Manager", goal: "Coordinate multiple agents", tools: ["agent_spawning", "state_management"], desc: "Coordinates agents in sequential or parallel workflows" },
  monitor_agent: { id: "monitor_agent", name: "System Monitor", category: "operations", role: "Infrastructure Watcher", goal: "Monitor systems and alert", tools: ["health_checks", "alerting"], desc: "Monitors deployments and system health" },
  scraper_agent: { id: "scraper_agent", name: "Data Scraper", category: "operations", role: "Web Extraction", goal: "Extract structured data", tools: ["web_scraping", "data_extraction"], desc: "Collects structured data from websites" },
  
  // MANAGEMENT
  project_manager: { id: "project_manager", name: "Project Manager", category: "management", role: "Project Lead", goal: "Track tasks and progress", tools: ["task_management", "reporting"], desc: "Manages projects, tasks, and team coordination" },
  report_generator: { id: "report_generator", name: "Report Generator", category: "management", role: "Analytics Reporter", goal: "Create comprehensive reports", tools: ["data_aggregation", "visualization"], desc: "Generates reports from various data sources" }
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
          <span className="alert-icon">{alert.severity === 'high' ? '🚨' : alert.severity === 'medium' ? '⚠️' : 'ℹ️'}</span>
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
      <span className={`lead-score ${lead.score >= 7 ? 'hot' : lead.score >= 4 ? 'warm' : 'cold'}`}>{lead.score}/10</span>
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
      {workflow.agents.map((agent, i) => (<span key={i} className="agent-tag">{agent}</span>))}
    </div>
    <button onClick={() => onRun(workflow.id)} className="workflow-run-btn">▶ Run Workflow</button>
  </div>
)

const AgentCard = ({ agent, selected, onToggle }) => (
  <div className={`agent-card ${selected ? 'selected' : ''}`} onClick={() => onToggle(agent.id)}>
    <div className="agent-card-header">
      <span className="agent-name">{agent.name}</span>
      <span className="agent-check">{selected ? '✓' : '+'}</span>
    </div>
    <p className="agent-desc">{agent.desc}</p>
    {agent.capabilities && (
      <div className="agent-capabilities">
        {agent.capabilities.slice(0, 5).map((cap, i) => <span key={i} className="cap-tag">{cap}</span>)}
      </div>
    )}
    <div className="agent-tools">
      {agent.tools.map((t, i) => (<span key={i} className="tool-tag">{t}</span>))}
    </div>
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
  
  // Agent library state
  const [selectedAgents, setSelectedAgents] = useState([])
  const [workflowName, setWorkflowName] = useState('')
  const [customWorkflows, setCustomWorkflows] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [workflowInput, setWorkflowInput] = useState('')
  const [runningCustom, setRunningCustom] = useState(false)
  
  // Autonomy layer state
  const [triggerType, setTriggerType] = useState('manual')
  const [scheduleTime, setScheduleTime] = useState('daily')
  const [autonomousActions, setAutonomousActions] = useState([])
  const [customInputs, setCustomInputs] = useState([])
  const [inputType, setInputType] = useState('text')
  const [newInputLabel, setNewInputLabel] = useState('')
  const [contextTemplate, setContextTemplate] = useState('custom')

  // Pre-built workflows
  const workflows = [
    // Original workflows
    { id: 'research_leads', name: 'Research Leads', icon: '🔍', description: 'Find businesses in niche + location', agents: ['Research Agent'], prompt: 'Find 5 yoga studios in Cape Town, South Africa' },
    { id: 'research_qualify', name: 'Research + Qualify', icon: '🎯', description: 'Find leads and score for fit', agents: ['Research Agent', 'Qualify Agent'], prompt: 'Find businesses then score on budget, tech fit, timeline' },
    { id: 'full_outreach', name: 'Full Pipeline', icon: '🚀', description: 'Research → Qualify → Outreach', agents: ['Research Agent', 'Qualify Agent', 'Outreach Agent'], prompt: 'Find 5 businesses, qualify top 3, draft outreach' },
    { id: 'competitor_analysis', name: 'Competitor Analysis', icon: '⚔️', description: 'Deep dive on competitor', agents: ['Competitor Analyst', 'Data Analyzer'], prompt: 'Research competitor: pricing, strengths, weaknesses' },
    { id: 'content_pipeline', name: 'Content Pipeline', icon: '📝', description: 'Research → Write → Optimize', agents: ['Research Agent', 'Content Writer', 'Tech Writer'], prompt: 'Research topic, write article, format as docs' },
    { id: 'code_review', name: 'Code Review', icon: '🔧', description: 'Scan → Review → Report', agents: ['QA Tester', 'Code Reviewer', 'Report Generator'], prompt: 'Review code for quality and security' },
    { id: 'uiux_build', name: 'Build UI/UX Project', icon: '🎨', description: 'Create stunning interface with Framer, ShadCN, GSAP', agents: ['UI/UX Master'], prompt: 'Build a modern landing page with scroll animations and premium components' },
    { id: 'social_media_pipeline', name: 'Social Media Pipeline', icon: '📱', description: 'Research → Write → Generate Images → QA → Syndicate → Track', agents: ['Social Media Researcher', 'Content Writer', 'Image Generator', 'Thread Creator', 'QA & SEO Reviewer', 'Syndication Agent', 'Analytics Tracker'], prompt: 'Full social media pipeline' },
    // NEW UNIQUE WORKFLOWS
    { id: 'niche_scout', name: 'Niche Scout', icon: '🎣', description: 'Find businesses by industry + location', agents: ['Lead Finder', 'Data Analyzer'], prompt: 'Find 10 web development agencies in Johannesburg' },
    { id: 'project_kickoff', name: 'Project Kickoff', icon: '⚡', description: 'Setup repo, Vercel, Supabase, docs', agents: ['Developer', 'DevOps Agent', 'Documentation Writer'], prompt: 'Initialize new project: create repo, setup Vercel, configure Supabase, generate README' },
    { id: 'warm_outreach', name: 'Warm Outreach', icon: '🔥', description: 'Research → Personalize → Email → Follow-up', agents: ['Research Agent', 'Content Writer', 'Outreach Agent'], prompt: 'Find 5 agencies in Cape Town, personalize outreach email for each' },
    { id: 'blog_pipeline', name: 'Blog Pipeline', icon: '✍️', description: 'Research → Write → SEO → Schedule', agents: ['Research Agent', 'Content Writer', 'QA & SEO Reviewer', 'Syndication Agent'], prompt: 'Write SEO-optimized blog post' },
    { id: 'daily_standup', name: 'Daily Standup', icon: '📋', description: 'Aggregate tasks from Linear + GitHub', agents: ['Data Analyzer', 'Report Generator'], prompt: 'Summarize tasks from Linear and recent GitHub commits' },
    { id: 'competitor_watch', name: 'Competitor Watch', icon: '👁️', description: 'Monitor pricing/features → Weekly digest', agents: ['Competitor Researcher', 'Report Generator'], prompt: 'Monitor competitor: track pricing, features, news - generate weekly digest' },
    { id: 'incident_response', name: 'Incident Response', icon: '🚨', description: 'Alert → Diagnose → Fix → Document', agents: ['Monitor Agent', 'Developer', 'Documentation Writer'], prompt: 'Handle incident: diagnose, implement fix, document root cause' },
    { id: 'feature_gap', name: 'Feature Gap Analysis', icon: '📊', description: 'Compare product vs competitors', agents: ['Competitor Researcher', 'Data Analyzer', 'Report Generator'], prompt: 'Analyze competitor features vs ours, identify gaps' },
    // NEW INTEGRATION WORKFLOWS
    { id: 'video_pipeline', name: 'Video Pipeline', icon: '🎬', description: 'Research → Script → Optimize for platforms', agents: ['Research Agent', 'Video Script Writer', 'SEO Analyzer'], prompt: 'Research topic, write video script, optimize for YouTube/TikTok' },
    { id: 'contract_workflow', name: 'Contract Generator', icon: '📜', description: 'Generate legal contracts from templates', agents: ['Contract Generator', 'QA & SEO Reviewer'], prompt: 'Generate a service agreement with custom terms' },
    { id: 'invoice_workflow', name: 'Invoice Workflow', icon: '💰', description: 'Create and send invoice to client', agents: ['Invoice Creator', 'Analytics Tracker'], prompt: 'Create invoice with line items and send to client' },
    { id: 'social_post_twitter', name: 'Post to Twitter', icon: '🐦', description: 'Post content directly to Twitter/X', agents: ['Twitter Agent', 'Analytics Tracker'], prompt: 'Post tweet with tracking' },
    { id: 'slack_alert', name: 'Slack Alert', icon: '🔔', description: 'Send alert to Slack channel', agents: ['Slack Notifier'], prompt: 'Send formatted alert to Slack channel' },
    { id: 'notion_sync_workflow', name: 'Notion Sync', icon: '📒', description: 'Sync docs and tasks with Notion', agents: ['Notion Sync', 'Documentation Writer'], prompt: 'Create Notion page from docs and sync tasks' },
    { id: 'auto_pr_review', name: 'Auto PR Review', icon: '🔍', description: 'Auto-review GitHub pull requests', agents: ['PR Reviewer', 'Code Reviewer'], prompt: 'Review latest PR and approve/request changes' },
    { id: 'support_automation', name: 'Auto Support', icon: '🎧', description: 'Auto-respond to support tickets', agents: ['Auto Support Agent', 'Knowledge Base'], prompt: 'Classify and respond to incoming tickets' },
    { id: 'property_pipeline', name: 'Property Pipeline', icon: '🏠', description: 'Manage property listings and inquiries', agents: ['Property Manager', 'Lead Finder'], prompt: 'Create listing and screen incoming inquiries' },
    { id: 'ecommerce_listing', name: 'E-commerce Listing', icon: '🛒', description: 'List products on e-commerce platforms', agents: ['E-commerce Lister', 'Image Generator', 'SEO Analyzer'], prompt: 'Create product listing with images and SEO' },
    { id: 'hr_screening', name: 'HR Candidate Screening', icon: '👤', description: 'Screen candidates and schedule interviews', agents: ['Candidate Screener', 'Scheduler'], prompt: 'Screen resumes and schedule qualified candidates' }
  ]

  const sampleLeads = [
    { id: 1, name: 'Yoga Loft', location: 'Kloof St, Cape Town', website: 'yogaloft.co.za', phone: '', score: 7, notes: 'Premium studio, mid-high budget' },
    { id: 2, name: 'Yo Yoga', location: 'Observatory, Cape Town', website: 'yoyoga.co.za', phone: '083 690 7967', score: 6, notes: 'Heated yoga, modern setup' },
    { id: 3, name: 'Yoga Life', location: 'Waterkant St, Cape Town', website: 'yogalife.co.za', phone: '021 418 2884', score: 8, notes: 'Established, good potential' },
  ]

  useEffect(() => {
    if (localStorage.getItem('wt_user')) setIsLoggedIn(true)
    setLeads(sampleLeads)
    // Load custom workflows from localStorage
    const saved = localStorage.getItem('wt_custom_workflows')
    if (saved) setCustomWorkflows(JSON.parse(saved))
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
    if (isLoggedIn) { fetchData(); const interval = setInterval(fetchData, 60000); return () => clearInterval(interval) }
  }, [isLoggedIn])

  const runWorkflow = async (workflowId) => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (!workflow) return
    setWorkflowsRunning(prev => ({ ...prev, [workflowId]: true }))
    await new Promise(resolve => setTimeout(resolve, 2000))
    setWorkflowsRunning(prev => ({ ...prev, [workflowId]: false }))
    if (workflowId.includes('research') || workflowId === 'full_outreach') {
      setLeads(prev => [{ id: Date.now(), name: 'New Business', location: 'Cape Town', website: 'example.com', score: 5, notes: 'Discovered via workflow' }, ...prev])
    }
  }

  const runCustomWorkflow = async () => {
    if (selectedAgents.length === 0 || !workflowInput.trim()) return
    setRunningCustom(true)
    // In production, this would spawn agents in sequence
    for (const agentId of selectedAgents) {
      const agent = Object.values(AGENTS).find(a => a.id === agentId)
      console.log(`Running ${agent.name} with input: ${workflowInput}`)
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    setRunningCustom(false)
    // Save workflow
    const newWorkflow = { id: Date.now(), name: workflowName || 'Custom Workflow', agents: [...selectedAgents], input: workflowInput }
    const updated = [...customWorkflows, newWorkflow]
    setCustomWorkflows(updated)
    localStorage.setItem('wt_custom_workflows', JSON.stringify(updated))
    setSelectedAgents([])
    setWorkflowName('')
    setWorkflowInput('')
  }

  const toggleAgent = (agentId) => {
    setSelectedAgents(prev => prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId])
  }

  const removeLead = (id) => setLeads(prev => prev.filter(l => l.id !== id))
  const qualifyLead = (id) => setLeads(prev => prev.map(l => l.id === id ? { ...l, qualified: true } : l))

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'agents', label: 'Workflows', icon: '🚀' },
    { id: 'library', label: 'Agent Library', icon: '🤖' },
    { id: 'autonomy', label: 'Autonomy', icon: '🧠' },
    { id: 'leads', label: 'Leads', icon: '🎯' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'tasks', label: 'Tasks', icon: '📋' },
  ]

  const categories = ['all', 'research', 'analysis', 'creation', 'outreach', 'technical', 'operations', 'management']
  
  const filteredAgents = Object.values(AGENTS).filter(a => activeCategory === 'all' || a.category === activeCategory)

  if (!isLoggedIn) return <Login onLogin={setIsLoggedIn} />

  return (
    <div className="watchtower">
      <div className="bg-pattern" />
      <div className="container">
        <motion.header className="header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Watchtower</h1>
          <p>Autonomous Agent System • {Object.keys(AGENTS).length} Agents Ready</p>
        </motion.header>

        {data?.autonomous?.alerts?.length > 0 && <AlertBanner alerts={data.autonomous.alerts} />}

        <div className="controls">
          <nav className="tabs">
            {tabs.map(tab => (<button key={tab.id} className={`tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}><span>{tab.icon}</span> {tab.label}</button>))}
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
                    <StatBadge label="Agents" value={Object.keys(AGENTS).length} />
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
                    {(!data.linear?.issues?.length) && <div className="empty-state">No tasks</div>}
                  </div>
                </SectionCard>
              </div>
            )}

            {/* WORKFLOWS TAB */}
            {activeTab === 'agents' && (
              <div className="agents-section">
                <SectionCard title="Pre-built Workflows" icon="🚀">
                  <p className="section-desc">Ready-to-run multi-agent pipelines</p>
                  <div className="workflows-grid">
                    {workflows.map(w => (
                      <WorkflowCard key={w.id} workflow={w} onRun={runWorkflow} />
                    ))}
                  </div>
                  {Object.values(workflowsRunning).some(v => v) && <div className="workflow-status">⏳ Running workflow...</div>}
                </SectionCard>

                {customWorkflows.length > 0 && (
                  <SectionCard title="Your Custom Workflows" icon="⭐">
                    <div className="workflows-grid">
                      {customWorkflows.map(w => (
                        <div key={w.id} className="workflow-card">
                          <div className="workflow-header">
                            <span className="workflow-name">{w.name}</span>
                          </div>
                          <p className="workflow-desc">{w.agents.length} agents chained</p>
                          <div className="workflow-agents">
                            {w.agents.map((a, i) => <span key={i} className="agent-tag">{a}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}
              </div>
            )}

            {/* AGENT LIBRARY TAB */}
            {activeTab === 'library' && (
              <div className="library-section">
                <SectionCard title="Build Custom Workflow" icon="🛠️">
                  <div className="workflow-builder">
                    <div className="builder-inputs">
                      <input type="text" placeholder="Workflow name" value={workflowName} onChange={e => setWorkflowName(e.target.value)} className="builder-input" />
                      <input type="text" placeholder="What do you want to do? (e.g., Find 5 plumbers in Johannesburg)" value={workflowInput} onChange={e => setWorkflowInput(e.target.value)} className="builder-input task-input" />
                    </div>
                    <div className="selected-agents">
                      <span className="selected-label">Selected: {selectedAgents.length} agents</span>
                      <div className="selected-chips">
                        {selectedAgents.map(id => {
                          const agent = Object.values(AGENTS).find(a => a.id === id)
                          return <span key={id} className="chip" onClick={() => toggleAgent(id)}>{agent.name} ×</span>
                        })}
                      </div>
                    </div>
                    <button onClick={runCustomWorkflow} disabled={selectedAgents.length === 0 || !workflowInput.trim() || runningCustom} className="run-custom-btn">
                      {runningCustom ? '⏳ Running...' : '▶ Run Custom Workflow'}
                    </button>
                  </div>
                </SectionCard>

                <SectionCard title="Agent Library" icon="🤖">
                  <div className="category-filters">
                    {categories.map(cat => (
                      <button key={cat} className={`category-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                        {cat === 'all' ? 'All' : AGENT_CATEGORIES[cat]}
                      </button>
                    ))}
                  </div>
                  <div className="agents-grid">
                    {filteredAgents.map(agent => (
                      <AgentCard key={agent.id} agent={agent} selected={selectedAgents.includes(agent.id)} onToggle={toggleAgent} />
                    ))}
                  </div>
                </SectionCard>
              </div>
            )}

            {/* AUTONOMY TAB */}
            {activeTab === 'autonomy' && (
              <div className="autonomy-section">
                <SectionCard title="🧠 Build Autonomous Workflow" icon="⚡">
                  <p className="section-desc">Create self-running workflows with custom inputs, triggers, and autonomous actions</p>
                  
                  <div className="autonomy-grid">
                    <div className="autonomy-card">
                      <h3>📋 Workflow Details</h3>
                      <div className="form-group">
                        <label className="form-label">Workflow Name</label>
                        <input type="text" className="form-input" placeholder="My Autonomous Workflow" value={workflowName} onChange={e => setWorkflowName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Context Template</label>
                        <select className="form-select" value={contextTemplate} onChange={e => setContextTemplate(e.target.value)}>
                          <option value="custom">Custom Inputs</option>
                          <option value="lead_research">Lead Research</option>
                          <option value="content_creation">Content Creation</option>
                          <option value="project_setup">Project Setup</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="autonomy-card">
                      <h3>⚡ Trigger Type</h3>
                      <div className="trigger-options">
                        <button className={`trigger-btn ${triggerType === 'manual' ? 'active' : ''}`} onClick={() => setTriggerType('manual')}>👆 Manual</button>
                        <button className={`trigger-btn ${triggerType === 'scheduled' ? 'active' : ''}`} onClick={() => setTriggerType('scheduled')}>⏰ Scheduled</button>
                        <button className={`trigger-btn ${triggerType === 'webhook' ? 'active' : ''}`} onClick={() => setTriggerType('webhook')}>🔌 Webhook</button>
                        <button className={`trigger-btn ${triggerType === 'event' ? 'active' : ''}`} onClick={() => setTriggerType('event')}>⚡ Event</button>
                      </div>
                      {triggerType === 'scheduled' && (
                        <div className="form-group" style={{marginTop: '1rem'}}>
                          <select className="form-select" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)}>
                            <option value="hourly">Every Hour</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      )}
                    </div>
                    
                    <div className="autonomy-card">
                      <h3>🔧 Autonomous Actions (Post-run)</h3>
                      <p style={{fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem'}}>What should happen automatically after the workflow runs?</p>
                      <div className="action-chips">
                        {['Send Notification', 'Update Database', 'Create Record', 'Send Email', 'Post to Social', 'Generate Report', 'Trigger Another Workflow'].map(action => (
                          <span key={action} className={`action-chip ${autonomousActions.includes(action) ? 'active' : ''}`} onClick={() => setAutonomousActions(prev => prev.includes(action) ? prev.filter(a => a !== action) : [...prev, action])}>
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="autonomy-card" style={{marginTop: '1rem'}}>
                    <h3>📝 Custom Input Fields</h3>
                    <p style={{fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem'}}>Define what inputs this workflow needs</p>
                    <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
                      <select className="form-select" style={{width: '120px'}} value={inputType} onChange={e => setInputType(e.target.value)}>
                        <option value="text">Text</option>
                        <option value="url">URL</option>
                        <option value="number">Number</option>
                        <option value="file">File</option>
                        <option value="date">Date</option>
                      </select>
                      <input type="text" className="form-input" placeholder="Field label" value={newInputLabel} onChange={e => setNewInputLabel(e.target.value)} style={{flex: 1}} />
                      <button onClick={() => { if (newInputLabel) { setCustomInputs([...customInputs, { type: inputType, label: newInputLabel }]); setNewInputLabel('') } }} className="trigger-btn active" style={{padding: '0.5rem 1rem'}}>Add</button>
                    </div>
                    <div className="action-chips">
                      {customInputs.map((inp, i) => <span key={i} className="action-chip" onClick={() => setCustomInputs(customInputs.filter((_, idx) => idx !== i))}>{inp.type}: {inp.label} ×</span>)}
                      {customInputs.length === 0 && <span style={{fontSize: '0.8rem', color: 'var(--text-dim)'}}>No custom inputs defined</span>}
                    </div>
                  </div>
                  
                  <div className="autonomy-card" style={{marginTop: '1rem'}}>
                    <h3>🤖 Select Agents</h3>
                    <p style={{fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem'}}>Choose agents for this workflow</p>
                    <div className="category-filters">
                      {categories.slice(0, 5).map(cat => (
                        <button key={cat} className={`category-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat === 'all' ? 'All' : cat}</button>
                      ))}
                    </div>
                    <div className="agents-grid" style={{marginTop: '1rem'}}>
                      {filteredAgents.slice(0, 12).map(agent => (
                        <AgentCard key={agent.id} agent={agent} selected={selectedAgents.includes(agent.id)} onToggle={toggleAgent} />
                      ))}
                    </div>
                  </div>
                  
                  <button className="save-workflow-btn" onClick={() => { const newWf = { id: Date.now(), name: workflowName || 'Custom', agents: selectedAgents, trigger: triggerType, schedule: scheduleTime, actions: autonomousActions, inputs: customInputs, template: contextTemplate }; const updated = [...customWorkflows, newWf]; setCustomWorkflows(updated); localStorage.setItem('wt_custom_workflows', JSON.stringify(updated)); setSelectedAgents([]); setAutonomousActions([]); setCustomInputs([]); }} disabled={selectedAgents.length === 0}>
                    💾 Save Autonomous Workflow
                  </button>
                </SectionCard>
                
                <SectionCard title="🚀 Your Autonomous Workflows" icon="🧠">
                  {customWorkflows.filter(w => w.trigger || w.actions?.length > 0).length === 0 ? (
                    <div className="empty-state">No autonomous workflows yet. Build one above!</div>
                  ) : (
                    <div className="workflows-grid">
                      {customWorkflows.filter(w => w.trigger || w.actions?.length > 0).map(w => (
                        <div key={w.id} className="workflow-card">
                          <div className="workflow-header">
                            <span className="workflow-icon">🧠</span>
                            <span className="workflow-name">{w.name}</span>
                          </div>
                          <p className="workflow-desc">{w.agents?.length || 0} agents • {w.trigger || 'manual'} trigger</p>
                          <div className="workflow-agents">
                            {w.actions?.map((a, i) => <span key={i} className="agent-tag" style={{background: 'rgba(0,208,132,0.2)', color: 'var(--success)'}}>{a}</span>)}
                          </div>
                          <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                            <button className="workflow-run-btn" style={{flex: 1, fontSize: '0.8rem'}}>▶ Run</button>
                            <button className="workflow-run-btn" style={{flex: 1, fontSize: '0.8rem', background: 'var(--border)'}}>⚙️ Config</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>
              </div>
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
                  {leads.map(lead => (<LeadCard key={lead.id} lead={lead} onQualify={qualifyLead} onRemove={removeLead} />))}
                  {leads.length === 0 && <div className="empty-state">No leads. Run a research workflow.</div>}
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
                  {(!data.linear?.issues?.length) && <div className="empty-state">No tasks or Linear not configured</div>}
                </div>
              </SectionCard>
            )}
          </div>
        )}

        <footer className="footer">Watchtower v5.0 • {Object.keys(AGENTS).length} Agents • <a href="https://github.com/mikewithoutthemechanics/watchtower">GitHub</a></footer>
      </div>
    </div>
  )
  
  function filterBySearch(items) {
    if (!searchTerm || !items) return items
    return items.filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  }
}

export default App