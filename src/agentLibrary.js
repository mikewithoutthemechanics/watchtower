// Agent Library - Ready-to-deploy specialized agents
// Each agent has: name, role, goal, tools, model preferences

export const AGENT_CATEGORIES = {
  research: "Research & Discovery",
  analysis: "Analysis & Evaluation", 
  creation: "Content & Creation",
  outreach: "Outreach & Communication",
  technical: "Technical & Development",
  operations: "Operations & Automation",
  management: "Project & Team Management"
}

export const AGENTS = {
  // ==================== RESEARCH & DISCOVERY ====================
  research_agent: {
    id: "research_agent",
    name: "Research Agent",
    category: "research",
    role: "Expert Researcher",
    goal: "Find and compile comprehensive information on any topic",
    tools: ["web_search", "web_fetch", "memory_search"],
    strengths: ["Deep research", "Data compilation", "Source verification"],
    description: "Specializes in finding businesses, information, and leads through web research"
  },
  
  competitor_researcher: {
    id: "competitor_researcher",
    name: "Competitor Analyst",
    category: "research",
    role: "Competitive Intelligence Expert",
    goal: "Analyze competitors and identify market positioning",
    tools: ["web_search", "web_fetch", "data_analysis"],
    strengths: ["SWOT analysis", "Pricing research", "Market positioning"],
    description: "Deep-dive into competitor websites, pricing, strengths, and weaknesses"
  },
  
  lead_finder: {
    id: "lead_finder",
    name: "Lead Finder",
    category: "research",
    role: "Lead Generation Specialist",
    goal: "Find potential customers matching ideal client criteria",
    tools: ["web_search", "directory_lookup", "social_scout"],
    strengths: ["Prospecting", " niche targeting", "contact discovery"],
    description: "Discovers businesses and contacts for sales pipelines"
  },

  // ==================== ANALYSIS & EVALUATION ====================
  qualify_agent: {
    id: "qualify_agent",
    name: "Qualify Agent",
    category: "analysis",
    role: "Lead Qualification Expert",
    goal: "Score and prioritize leads based on fit, budget, timeline",
    tools: ["data_analysis", "scoring_matrix"],
    strengths: ["Budget assessment", "tech fit evaluation", "timeline analysis"],
    description: "Evaluates leads and assigns scores based on conversion likelihood"
  },
  
  data_analyzer: {
    id: "data_analyzer",
    name: "Data Analyzer",
    category: "analysis",
    role: "Data Scientist",
    goal: "Extract insights from datasets and metrics",
    tools: ["data_analysis", "visualization", "statistics"],
    strengths: ["Pattern recognition", "trend analysis", "metrics interpretation"],
    description: "Analyzes metrics, logs, and data to find actionable insights"
  },
  
  code_reviewer: {
    id: "code_reviewer",
    name: "Code Reviewer",
    category: "analysis",
    role: "Senior Developer",
    goal: "Review code for quality, security, and best practices",
    tools: ["code_analysis", "security_scan", "linting"],
    strengths: ["Security auditing", "quality assurance", "architecture review"],
    description: "Provides detailed code reviews with improvement suggestions"
  },

  // ==================== CONTENT & CREATION ====================
  content_writer: {
    id: "content_writer",
    name: "Content Writer",
    category: "creation",
    role: "Professional Copywriter",
    goal: "Create compelling written content for various purposes",
    tools: ["writing", "editing", "seo_optimization"],
    strengths: ["Persuasive writing", "SEO", "brand voice"],
    description: "Writes blogs, landing pages, emails, and marketing copy"
  },
  
  email_drafter: {
    id: "email_drafter",
    name: "Email Specialist",
    category: "creation",
    role: "Email Marketing Expert",
    goal: "Draft effective cold emails and sequences",
    tools: ["template_library", "personalization", "copy_optimization"],
    strengths: ["Cold outreach", "follow-ups", "sequence design"],
    description: "Creates personalized cold emails that get responses"
  },
  
  documentation_writer: {
    id: "documentation_writer",
    name: "Tech Writer",
    category: "creation",
    role: "Technical Documentation Specialist",
    goal: "Create clear, comprehensive documentation",
    tools: ["markdown", "api_docs", "diagramming"],
    strengths: ["API docs", "user guides", "README creation"],
    description: "Writes technical documentation, API specs, and guides"
  },
  
  social_media_manager: {
    id: "social_media_manager",
    name: "Social Media Manager",
    category: "creation",
    role: "Social Content Creator",
    goal: "Create engaging social media content",
    tools: ["content_creation", "scheduling", "trend_analysis"],
    strengths: ["Viral content", "platform optimization", "engagement"],
    description: "Generates posts, captions, and content strategies"
  },

  // ==================== OUTREACH & COMMUNICATION ====================
  outreach_agent: {
    id: "outreach_agent",
    name: "Outreach Agent",
    category: "outreach",
    role: "Business Development Rep",
    goal: "Initiate contact and build relationships with prospects",
    tools: ["email_sending", "linkedin_outreach", "follow_ups"],
    strengths: ["Rapport building", "value proposition", "scheduling"],
    description: "Handles initial outreach and prospect engagement"
  },
  
  scheduler: {
    id: "scheduler",
    name: "Scheduler",
    category: "outreach",
    role: "Calendar Manager",
    goal: "Schedule meetings and manage appointments",
    tools: ["calendar_integration", "email_coordination"],
    strengths: ["Time zone management", "booking", "reminders"],
    description: "Coordinates and schedules meetings across time zones"
  },
  
  support_agent: {
    id: "support_agent",
    name: "Support Agent",
    category: "outreach",
    role: "Customer Success Specialist",
    goal: "Handle customer inquiries and resolve issues",
    tools: ["ticket_management", "knowledge_base", "escalation"],
    strengths: ["Problem solving", "customer relations", "troubleshooting"],
    description: "Provides customer support and issue resolution"
  },

  // ==================== TECHNICAL & DEVELOPMENT ====================
  developer_agent: {
    id: "developer_agent",
    name: "Developer",
    category: "technical",
    role: "Full-Stack Developer",
    goal: "Write, debug, and deploy code",
    tools: ["code_execution", "git_operations", "deployment"],
    strengths: ["Rapid prototyping", "bug fixing", "API development"],
    description: "Builds and deploys applications and features"
  },
  
  devops_agent: {
    id: "devops_agent",
    name: "DevOps Engineer",
    category: "technical",
    role: "Infrastructure Specialist",
    goal: "Manage deployments, CI/CD, and infrastructure",
    tools: ["docker", "cloud_deployment", "monitoring"],
    strengths: ["CI/CD pipelines", "infrastructure as code", "monitoring"],
    description: "Handles deployments, servers, and automation"
  },
  
  qa_tester: {
    id: "qa_tester",
    name: "QA Tester",
    category: "technical",
    role: "Quality Assurance Specialist",
    goal: "Test software and identify issues",
    tools: ["test_execution", "bug_tracking", "automation"],
    strengths: ["Regression testing", "edge case identification", "reproduction"],
    description: "Tests applications and documents bugs"
  },
  
  database_admin: {
    id: "database_admin",
    name: "Database Admin",
    category: "technical",
    role: "Data Engineer",
    goal: "Manage databases, queries, and data integrity",
    tools: ["sql_queries", "schema_design", "migration"],
    strengths: ["Performance tuning", "data modeling", "backup management"],
    description: "Handles database design, queries, and optimization"
  },

  // ==================== OPERATIONS & AUTOMATION ====================
  workflow_orchestrator: {
    id: "workflow_orchestrator",
    name: "Workflow Orchestrator",
    category: "operations",
    role: "Process Automation Manager",
    goal: "Coordinate multiple agents and manage complex workflows",
    tools: ["agent_spawning", "state_management", "error_handling"],
    strengths: ["Multi-agent coordination", "process design", "exception handling"],
    description: "Coordinates other agents in sequential or parallel workflows"
  },
  
  scraper_agent: {
    id: "scraper_agent",
    name: "Data Scraper",
    category: "operations",
    role: "Web Extraction Specialist",
    goal: "Extract structured data from websites",
    tools: ["web_scraping", "data_extraction", "parsing"],
    strengths: ["HTML parsing", "API reverse engineering", "data structuring"],
    description: "Collects structured data from websites and APIs"
  },
  
  file_manager: {
    id: "file_manager",
    name: "File Manager",
    category: "operations",
    role: "Document Management Specialist",
    goal: "Organize, process, and manage files",
    tools: ["file_operations", "compression", "conversion"],
    strengths: ["File organization", "format conversion", "batch processing"],
    description: "Handles file operations, organization, and conversions"
  },
  
  monitor_agent: {
    id: "monitor_agent",
    name: "System Monitor",
    category: "operations",
    role: "Infrastructure Watcher",
    goal: "Monitor systems and alert on issues",
    tools: ["health_checks", "alerting", "logging"],
    strengths: ["Uptime monitoring", "performance tracking", "alert management"],
    description: "Monitors deployments, APIs, and system health"
  },

  // ==================== PROJECT & TEAM MANAGEMENT ====================
  project_manager: {
    id: "project_manager",
    name: "Project Manager",
    category: "management",
    role: "Project Lead",
    goal: "Track tasks, milestones, and team progress",
    tools: ["task_management", "timeline_tracking", "reporting"],
    strengths: ["Task coordination", "deadline management", "status reporting"],
    description: "Manages projects, tasks, and team coordination"
  },
  
  report_generator: {
    id: "report_generator",
    name: "Report Generator",
    category: "management",
    role: "Analytics Reporter",
    goal: "Create comprehensive reports from data",
    tools: ["data_aggregation", "visualization", "formatting"],
    strengths: ["Executive summaries", "metrics dashboards", "automated reporting"],
    description: "Generates reports and dashboards from various data sources"
  }
}

// ==================== WORKFLOW TEMPLATES ====================
export const WORKFLOW_TEMPLATES = {
  // Pre-built workflows using multiple agents
  lead_generation: {
    name: "Full Lead Generation",
    description: "Find → Qualify → Outreach pipeline",
    steps: [
      { agentId: "lead_finder", input: "niche + location", output: "lead_list" },
      { agentId: "qualify_agent", input: "lead_list", output: "scored_leads" },
      { agentId: "outreach_agent", input: "scored_leads", output: "contacted_leads" }
    ]
  },
  
  competitor_analysis: {
    name: "Competitor Deep Dive",
    description: "Research → Analyze → Report",
    steps: [
      { agentId: "competitor_researcher", input: "competitor_name", output: "raw_data" },
      { agentId: "data_analyzer", input: "raw_data", output: "swot_analysis" },
      { agentId: "report_generator", input: "swot_analysis", output: "final_report" }
    ]
  },
  
  content_pipeline: {
    name: "Content Pipeline",
    description: "Research → Write → Optimize → Publish",
    steps: [
      { agentId: "research_agent", input: "topic + keywords", output: "research_notes" },
      { agentId: "content_writer", input: "research_notes + style", output: "draft_content" },
      { agentId: "documentation_writer", input: "draft_content", output: "final_content" }
    ]
  },
  
  code_review_pipeline: {
    name: "Code Review Pipeline",
    description: "Scan → Review → Report",
    steps: [
      { agentId: "scraper_agent", input: "repo_url", output: "codebase" },
      { agentId: "code_reviewer", input: "codebase", output: "review_notes" },
      { agentId: "report_generator", input: "review_notes", output: "report" }
    ]
  },
  
  support_automation: {
    name: "Support Automation",
    description: "Classify → Respond → Escalate",
    steps: [
      { agentId: "support_agent", input: "incoming_ticket", output: "classification" },
      { agentId: "content_writer", input: "classification + knowledge_base", output: "response_draft" },
      { agentId: "scheduler", input: "escalation_required", output: "meeting_scheduled" }
    ]
  }
}

// ==================== TOOL DEFINITIONS ====================
export const TOOLS = {
  web_search: { name: "Web Search", description: "Search the web for information" },
  web_fetch: { name: "Web Fetch", description: "Retrieve and parse web pages" },
  memory_search: { name: "Memory Search", description: "Search conversation history" },
  email_sending: { name: "Email Sending", description: "Send emails via configured provider" },
  calendar_integration: { name: "Calendar", description: "Manage calendar events" },
  code_execution: { name: "Code Execution", description: "Run code in sandboxed environment" },
  git_operations: { name: "Git Operations", description: "Clone, commit, push to repos" },
  deployment: { name: "Deployment", description: "Deploy to Vercel/Cloudflare/etc" },
  file_operations: { name: "File Operations", description: "Read, write, organize files" },
  agent_spawning: { name: "Agent Spawning", description: "Launch sub-agents for parallel work" },
  data_analysis: { name: "Data Analysis", description: "Analyze datasets and metrics" },
  alerting: { name: "Alerts", description: "Send notifications via configured channels" }
}

// Export for use in Watchtower
export default { AGENTS, AGENT_CATEGORIES, WORKFLOW_TEMPLATES, TOOLS }