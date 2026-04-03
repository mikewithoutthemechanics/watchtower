// ==================== AUTONOMY LAYER ====================

// Custom Input Types
export const INPUT_TYPES = {
  text: { label: "Text Input", icon: "📝", placeholder: "Enter text..." },
  url: { label: "URL/Link", icon: "🔗", placeholder: "https://..." },
  file: { label: "File Upload", icon: "📁", accept: "*" },
  number: { label: "Number", icon: "🔢", placeholder: "0" },
  select: { label: "Dropdown", icon: "📋", options: [] },
  date: { label: "Date", icon: "📅" },
  checkbox: { label: "Checkbox", icon: "☑️" },
  json: { label: "JSON Data", icon: "{ }", placeholder: '{"key": "value"}' }
}

// Trigger Types
export const TRIGGER_TYPES = {
  manual: { label: "Manual", icon: "👆", description: "Run on demand" },
  scheduled: { label: "Scheduled", icon: "⏰", description: "Run on schedule" },
  webhook: { label: "Webhook", icon: "🔌", description: "Triggered by external event" },
  event: { label: "Event-Based", icon: "⚡", description: "Triggered by data change" }
}

// Schedule Options
export const SCHEDULE_OPTIONS = [
  { value: "hourly", label: "Every Hour" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom Cron" }
]

// Data Source Types
export const DATA_SOURCES = {
  api: { label: "REST API", icon: "🌐" },
  database: { label: "Database", icon: "🗄️" },
  spreadsheet: { label: "Spreadsheet", icon: "📊" },
  webhook: { label: "Webhook", icon: "🔌" },
  file: { label: "File/CSV", icon: "📄" },
  rss: { label: "RSS Feed", icon: "📰" }
}

// Autonomous Actions
export const AUTONOMOUS_ACTIONS = {
  send_notification: { label: "Send Notification", icon: "🔔" },
  update_database: { label: "Update Database", icon: "💾" },
  create_record: { label: "Create Record", icon: "➕" },
  send_email: { label: "Send Email", icon: "📧" },
  post_to_social: { label: "Post to Social", icon: "📱" },
  generate_report: { label: "Generate Report", icon: "📈" },
  trigger_workflow: { label: "Trigger Another Workflow", icon: "🔄" }
}

// Default Context Templates
export const CONTEXT_TEMPLATES = {
  lead_research: {
    name: "Lead Research Context",
    inputs: [
      { type: "text", key: "niche", label: "Industry/Niche", required: true },
      { type: "text", key: "location", label: "Location", required: true },
      { type: "number", key: "limit", label: "Max Results", default: 10 }
    ]
  },
  content_creation: {
    name: "Content Creation Context",
    inputs: [
      { type: "url", key: "reference_url", label: "Reference URL", required: false },
      { type: "file", key: "brand_assets", label: "Brand Assets", required: false },
      { type: "text", key: "topic", label: "Topic/Theme", required: true },
      { type: "select", key: "platforms", label: "Platforms", options: ["Instagram", "Facebook", "LinkedIn", "Twitter"] }
    ]
  },
  project_setup: {
    name: "Project Setup Context",
    inputs: [
      { type: "text", key: "project_name", label: "Project Name", required: true },
      { type: "url", key: "repo_url", label: "GitHub Repo", required: false },
      { type: "text", key: "stack", label: "Tech Stack", required: true },
      { type: "json", key: "env_vars", label: "Environment Variables", required: false }
    ]
  },
  custom: {
    name: "Custom Context",
    inputs: []
  }
}

export default {
  INPUT_TYPES,
  TRIGGER_TYPES,
  SCHEDULE_OPTIONS,
  DATA_SOURCES,
  AUTONOMOUS_ACTIONS,
  CONTEXT_TEMPLATES
}
