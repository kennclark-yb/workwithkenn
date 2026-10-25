// Portfolio content and homepage placement live here, independently of renderers.
export const work = [
  {
    id: 'yoink', kind: 'project', classification: 'SHIPPED PERSONAL PROJECT',
    title: 'Y.O.I.N.K.', subtitle: 'Your Oversized Interactions, Nicely Kept.',
    summary: 'A portable Windows app that turns long shared ChatGPT conversations into clean, split, copyable context—built to make project handoffs and fresh-chat continuation less painful.',
    status: 'v1.0.0 RELEASED',
    technologies: ['Python', 'PySide6', 'Playwright', 'Portable Windows App'],
    homepage: { show: true, tier: 'primary', order: 2, mediaSide: 'right' },
    media: { type: 'image', src: 'assets/projects/yoink/successcreen.png', alt: 'Y.O.I.N.K. application showing a successful conversation extraction split into two copyable parts.' },
    links: [{ label: 'Public GitHub repository', href: 'https://github.com/kennclark-yb/YOINK' }],
    note: 'Local-LLM-assisted workflow for turning oversized project conversations into useful project records and handoffs.',
    noteLabel: 'PLANNED FEATURE',
  },
  {
    id: 'jihyo', kind: 'project', classification: 'ACTIVE PERSONAL PROJECT',
    title: 'Personal Smart Secretary', subtitle: 'Codename: Secretary Jihyo',
    summary: 'A personal automation that brings Gmail and Google Calendar into Telegram. It organizes email, tracks unread follow-ups, sends event reminders, and creates calendar events with explicit confirmation. An on-demand /briefme command brings unread mail and the day’s schedule together.',
    status: '', stackLabel: 'BUILT WITH',
    technologies: ['Google Apps Script', 'Gmail', 'Google Calendar', 'Telegram Bot API'],
    runtimeHighlight: { title: 'Rule-based automation.', lines: ['No paid AI API.', 'No self-hosted server.'] },
    technologyMarks: [
      { name: 'Gmail', src: 'assets/projects/jihyo/technology/gmail.svg' },
      { name: 'Google Calendar', src: 'assets/projects/jihyo/technology/google-calendar.svg' },
      { name: 'Telegram', src: 'assets/projects/jihyo/technology/telegram.svg' },
      { name: 'Google Apps Script', src: 'assets/projects/jihyo/technology/google-apps-script.png' },
    ],
    homepage: { show: true, tier: 'primary', order: 1, mediaSide: 'left', layout: 'showcase' },
    media: {
      type: 'interaction-showcase', defaultScene: 'briefing',
      name: 'Secretary Jihyo', channel: 'Personal secretary · Telegram preview',
      illustrationLabel: 'Illustrative interaction — based on implemented behavior.',
      // Synthetic examples follow the implemented formatters, not private transcripts.
      // Counts, subjects and event details are illustrative; dates are kept relative.
      scenes: [
        {
          id: 'inbox', label: 'Inbox awareness', hint: 'Know what still needs you.',
          title: 'Unread, not forgotten.',
          description: 'New mail gets noticed. Older unread mail comes back when it’s time for a nudge.',
          context: 'A scheduled inbox check-in',
          messages: [
            { speaker: 'assistant', title: '💌 Just a quick inbox check for you, Sir.', blocks: [
              { text: '📨 New: 1\n🔔 Pending: 1\n📬 Total unread: 2' },
              { text: '[💼 Jobs] Sample job alert\n📌 Remote operations role\n💬 A new opening to review.' },
              { label: 'Summary Breakdown:', text: '💼 Job Alerts: 1\n📰 Newsletters: 1' },
              { text: '— Secretary Jihyo, standing by. 💖' },
            ] },
          ],
          takeaway: 'Organized mail can still be unread. Jihyo remembers the difference.',
        },
        {
          id: 'briefing', label: 'Brief me', hint: 'Mail and calendar, together.',
          title: 'Your day, in one reply.',
          description: 'Unread mail, today’s calendar, and what’s next. A read-only snapshot, on demand.',
          context: 'An on-demand briefing',
          messages: [
            { speaker: 'user', variant: 'command', text: '/briefme' },
            { speaker: 'assistant', title: "💌 Here's your brief~", blocks: [
              { label: '📬 Gmail', text: '2 unread messages retrieved\n• Sample alerts — Remote operations\n• Newsletter — A calmer workday' },
              { label: '📅 Today', text: 'Nothing scheduled today~' },
              { label: '⏰ Next up', text: 'Tomorrow\n• Planning session\n2:00 PM–2:30 PM\n📅 Main/Personal Calendar' },
            ] },
          ],
          takeaway: 'A bounded, read-only snapshot. Requested by you, right when you need it.',
        },
        {
          id: 'create', label: 'Create an event', hint: 'A draft, then your say.',
          title: 'You ask. You approve.',
          description: 'A supported event request becomes a draft. Nothing is created until you explicitly confirm.',
          context: 'A confirmed Calendar action',
          messages: [
            { speaker: 'user', text: 'Create “Planning session” tomorrow, 2–2:30 pm, on my main calendar.' },
            { speaker: 'assistant', title: 'Please confirm these details~', event: { title: 'Planning session', when: 'Tomorrow · 2:00–2:30 PM (Asia/Manila)', calendar: 'Main/Personal Calendar' }, text: 'Reply yes to create it, correct the details, or cancel.' },
            { speaker: 'user', text: 'Yes, please' },
            { speaker: 'assistant', text: 'Created and verified your event~' },
          ],
          takeaway: 'Conflicts are rechecked before the write. The result is verified afterward.',
        },
      ],
      evidence: {
        label: 'Behind the scenes',
        groups: [
          { title: 'How it works', text: "Google Apps Script connects Gmail, Google Calendar, and Telegram, with workflows designed to operate within the platform's available free usage quotas. Scheduled checks track unread follow-ups, while Calendar changes require explicit confirmation. The current system follows defined rules without relying on an AI model." },
          { title: "What's next", text: "Planned: Gemini-powered natural-language understanding through the Gemini API, richer email intelligence, task integration, and more capable automated briefings. The goal is to stay within available free-tier AI usage without operating a separate AI server, while protecting sensitive information and retaining confirmation and validation safeguards. Privacy requirements, API limits, and pricing will be evaluated before integration." },
        ],
      },
      caption: 'She checks the inbox so I don’t have to pretend I was going to.',
    },
    links: [], note: '',
  },
  {
    id: 'operations-reporting', kind: 'professional-experience', classification: 'PROFESSIONAL EXPERIENCE',
    title: 'Operations Reporting & Coordination', subtitle: '',
    summary: 'Project reporting, follow-up coordination, and documentation control—tracking submissions, consolidating updates, and supporting compliance follow-through.',
    status: '',
    technologies: ['Excel / VBA', 'Compliance Tracking', 'Resource Reporting', 'Process Coordination'],
    homepage: { show: true, tier: 'supporting', order: 3, mediaSide: 'right' },
    media: { type: 'process', steps: [
      { label: 'Reporting', detail: 'Submissions' },
      { label: 'Follow-up', detail: 'Consolidated updates' },
      { label: 'Documentation', detail: 'Compliance follow-through' },
    ] },
    links: [], note: 'Tracked completion improved from roughly 40% to full compliance.',
  },
  {
    id: 'notion-system', kind: 'project', classification: 'ACTIVE PERSONAL PROJECT',
    title: 'Personal Notion System', subtitle: '',
    summary: 'A working second-brain and project/application tracking system built around relational databases, status telemetry, and lightweight reporting.',
    status: '',
    technologies: ['Relational Databases', 'Project Tracking', 'Application Tracking', 'Status Telemetry', 'Reporting'],
    homepage: { show: true, tier: 'supporting', order: 4, mediaSide: 'right' },
    media: null,
    links: [], note: '',
  },
];
