// wisdom.jsx — Wisdom (OwlyGPT / AI) on the Suite shell. Rail active="wisdom".
// Board nodes: landing 1:6411 · Agents 10:82031 · Connectors 49:19108 ·
// Knowledge (Trends table) 49:32816. Drawer = AreaWisdom + landing's chat
// history + Prompt library item. No-red (Connector "Error" → amber).

const CHAT_HISTORY = [
  "Find me top hashtags for our…",
  "Summarise overnight mentions",
  "Compare our share of voice vs…",
  "Draft 5 LinkedIn posts for product…",
  "Alert me if brand mentions spike",
  "What's the best time to post this…",
];

function WisdomDrawer({ active, onNav }) {
  // Latest Wisdom landing (Wisdom v1 /Dev-ready): New chat · Search chats ·
  // Prompt library · Agents · Connectors, then a grouped chat history.
  const nav = [
    ["search", "search", "Search chats", "home"],
    ["prompts", "library_books", "Prompt library", "prompts"],
    ["agents", "support_agent", "Agents", "agents"],
    ["connectors", "cable", "Connectors", "connectors"],
  ];
  return (
    <aside className="suite-drawer">
      <div className="sd-head">Wisdom
        <button className="sd-collapse" type="button" aria-label="Collapse"><span className="material-symbols-outlined">keyboard_double_arrow_left</span></button>
      </div>
      <div className="sd-body">
        <div className="sd-compose">
          <button className={"main" + (active === "home" ? " on" : "")} type="button" onClick={() => onNav("home")}><span className="material-symbols-outlined">add</span>New chat</button>
        </div>
        {nav.map(([k, ic, lb, dest]) => (
          <a key={k} className={"sd-item" + (active === k ? " on" : "")} role="button" tabIndex={0} onClick={() => onNav(dest)} onKeyDown={e => { if (e.key === "Enter") onNav(dest); }}><span className="material-symbols-outlined">{ic}</span>{lb}</a>
        ))}
        <div className="sd-group">Chats</div>
        <div className="wi-subhead">Today</div>
        {CHAT_HISTORY.map((t, i) => (
          <a key={i} className="wi-chatitem" role="button" tabIndex={0} onClick={() => onNav("home")} title={t}>{t}</a>
        ))}
      </div>
    </aside>
  );
}

const PROMPTS = [
  { cat: "Analytics", text: "Give me a quarterly performance report with trends, top posts, and next steps" },
  { cat: "Create", text: "Draft a short, on-brand video script to promote this new product feature: [product description]" },
  { cat: "Perch", text: "Suggest a posting schedule for next month" },
  { cat: "Analytics", text: "How have I performed on Instagram last month?" },
  // 5th card (Perch): exact board text per live-board read.
  { cat: "Perch", text: "What type of content should I post on Instagram?" },
];

function PromptText({ text }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return <React.Fragment>{parts.map((p, i) => p.startsWith("[") ? <strong key={i}>{p}</strong> : p)}</React.Fragment>;
}

function WisdomTop() {
  return (
    <header className="wi-top">
      <span className="spacer"></span>
      <button className="wi-orgpicker" type="button">
        <span className="wi-org-av"><img src="assets/nest/a1.jpg" alt="" /></span>
        Org picker
        <span className="material-symbols-outlined chev">keyboard_arrow_down</span>
      </button>
    </header>
  );
}

function WisdomComposer({ onSend, placeholder, showDisclaimer }) {
  return (
    <div className="wi-composer">
      <div className="wi-inputbox">
        <textarea placeholder={placeholder || "Get insights into your metrics or deep-dive into a specific account"}></textarea>
        <div className="wi-inputtools">
          <button className="wi-tool" type="button" aria-label="Attach files" title="Attach files"><span className="material-symbols-outlined">attach_file</span></button>
          <button className="wi-agentpill" type="button" title="Choose agent">
            <span className="wi-agentpill-ic"><span className="material-symbols-outlined">calendar_today</span></span>
            Perch
            <span className="material-symbols-outlined chev">keyboard_arrow_down</span>
          </button>
          <button className="wi-tool" type="button" aria-label="Customize" title="Customize"><span className="material-symbols-outlined">tune</span></button>
          <span className="spacer"></span>
          <button className="wi-send" type="button" aria-label="Send" onClick={onSend}><span className="material-symbols-outlined">arrow_upward</span></button>
        </div>
      </div>
      {showDisclaimer && <div className="wi-disclaimer">Like all AI tools, Wisdom may not always be accurate. Verify important details.</div>}
    </div>
  );
}

// ── Landing / new-chat ────────────────────────────────────────────────
const LANDING_PROMPTS = [
  "What new trends, keywords, and conversations are emerging or gaining traction in my industry this week?",
  "Draft a short, on-brand video script to promote this new product feature: [product description]",
  "Give me a quarterly performance report with trends, top posts, and next steps",
  "How have I performed on Instagram last month?",
];

function WisdomLanding({ onSend }) {
  return (
    <div className="wi-main">
      <WisdomTop />
      <div className="wi-home">
        <div className="wi-landing">
          <h1 className="wi-title">Good morning, Ryan</h1>
          <WisdomComposer onSend={onSend} />
          <div className="wi-prompts">
            <h2 className="wi-prompts-h">Prompts to get you started</h2>
            <div className="wi-promptgrid">
              {LANDING_PROMPTS.map((t, i) => (
                <button key={i} className="wi-pcard" type="button" onClick={onSend}>
                  <span className="wi-pcard-ic"><span className="material-symbols-outlined">calendar_today</span></span>
                  <span className="wi-pcard-text"><PromptText text={t} /></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Prompt library (drawer item on the board landing 1:6411) ──────────
function PromptLibrary() {
  return (
    <div className="wi-main">
      <WisdomTop />
      <div className="wi-manage-body" style={{ paddingTop: 24 }}>
        <h1 style={{ fontWeight: 700, fontSize: 24, margin: "0 0 16px" }}>Prompt library</h1>
        <div className="wi-cards" style={{ maxWidth: 920, flexWrap: "wrap" }}>
          {PROMPTS.map((p, i) => (
            <button key={i} className="wi-card" type="button">
              <span className={"wi-cardcat wi-cardcat--" + p.cat.toLowerCase()}>{p.cat}</span>
              <span className="wi-cardtext"><PromptText text={p.text} /></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Manage shell (Agents · Connectors · Knowledge) ────────────────────
function WisdomManage({ searchPlaceholder, actionLabel, tabs, children }) {
  const [tab, setTab] = React.useState(tabs[0]);
  return (
    <div className="wi-main">
      <WisdomTop />
      <div className="wi-manage-bar">
        <div className="wi-search"><span className="material-symbols-outlined">search</span><input placeholder={searchPlaceholder} /></div>
        <span className="spacer"></span>
        <button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">add</span>{actionLabel}</button>
      </div>
      <div className="wi-manage-body">
        <div className="wi-filterbar">{tabs.map(t => <button key={t} type="button" className={"cf" + (tab === t ? " selected" : "")} onClick={() => setTab(t)}>{t}</button>)}</div>
        {children}
      </div>
    </div>
  );
}

// Agents — board 10:82031 (7 agents; one card instance repeated in VFS, names
// per design). Scope pills: Default ×4, My agent ×2, Shared agent ×1.
const AGENTS = [
  { nm: "Insight & Research Agent", d: "Conducts always-on social listening, deeper market and consumer research, and builds living research dossiers on audiences, categories, competitors, and cultural trends.", scope: "Default", av: "IR", c: "var(--hs-cat-3-bg)", cf: "var(--hs-cat-3-fg)" },
  { nm: "Strategy Agent", d: "Turns research and goals into social strategy — audience priorities, channel mix, and campaign themes.", scope: "Default", av: "ST", c: "var(--hs-cat-5-bg)", cf: "var(--hs-cat-5-fg)" },
  { nm: "Creator Agent", d: "Drafts on-brand posts, captions, and creative variations tuned to each network's voice.", scope: "Default", av: "CR", c: "var(--hs-cat-1-bg)", cf: "var(--hs-cat-1-fg)" },
  { nm: "Publishing Agent", d: "Schedules and queues approved content across networks at the right cadence and times.", scope: "Default", av: "PU", c: "var(--hs-cat-2-bg)", cf: "var(--hs-cat-2-fg)" },
  { nm: "Community Agent", d: "Drafts fast, on-tone replies to comments and messages, flagging anything sensitive.", scope: "My agent", av: "CO", c: "var(--hs-cat-7-bg)", cf: "var(--hs-cat-7-fg)" },
  { nm: "Ad Ops Agent", d: "Sets up, monitors, and optimizes paid campaigns against budget and performance goals.", scope: "My agent", av: "AO", c: "var(--hs-cat-9-bg)", cf: "var(--hs-cat-9-fg)" },
  { nm: "Reporting Agent", d: "Compiles reach, engagement, and sentiment into scheduled readouts with clear next steps.", scope: "Shared agent", av: "RE", c: "var(--hs-cat-4-bg)", cf: "var(--hs-cat-4-fg)" },
];
const SCOPE_TONE = { "Default": "hs-badge--discovery", "My agent": "hs-badge--positive", "Shared agent": "hs-badge--info" };
function Agents() {
  return (
    <WisdomManage searchPlaceholder="Search agents…" actionLabel="New agent" tabs={["All", "Default", "My Agents", "Shared agents"]}>
      <div className="wi-cardgrid">
        {AGENTS.map((a, i) => (
          <div className="wi-agentcard" key={i}>
            <div className="ac-head"><span className="ac-av" style={{ background: a.c, color: a.cf }}>{a.av}</span><span className="ac-nm">{a.nm}</span></div>
            <div className="ac-d">{a.d}</div>
            <div className="ac-foot"><span className={"hs-badge " + SCOPE_TONE[a.scope]} style={{ height: 26 }}>{a.scope}</span><span className="spacer"></span><button className="hs-btn hs-btn--ghost hs-btn--sm" type="button">Edit</button><button className="hs-btn hs-btn--secondary hs-btn--sm" type="button">Chat</button></div>
          </div>
        ))}
      </div>
    </WisdomManage>
  );
}

// Connectors — board 49:19108 (9 connectors). Status: Connected (green) /
// Error (amber, NOT red) / Disconnected (neutral).
const CONNECTORS = [
  { nm: "GitHub",        d: "Browse repositories, read files, and manage issues and pull requests.", ic: "code",            st: "on" },
  { nm: "Linear",        d: "Sync issues and project status into Wisdom's context.",                ic: "timeline",        st: "on" },
  { nm: "Notion",        d: "Reference wikis, playbooks, and campaign pages.",                       ic: "description",     st: "on" },
  { nm: "Slack",         d: "Send summaries and alerts to a channel, or ask Wisdom from Slack.",    ic: "forum",           st: "on" },
  { nm: "Atlassian",     d: "Pull Jira and Confluence work items and docs.",                         ic: "hub",             st: "on" },
  { nm: "Google Drive",  d: "Pull briefs, brand docs, and assets. Reconnect to restore access.",     ic: "add_to_drive",    st: "error" },
  { nm: "Sentry",        d: "Surface error and release-health signals.",                             ic: "bug_report",      st: "off" },
  { nm: "Figma",         d: "Reference design files and exported assets.",                           ic: "design_services", st: "off" },
  { nm: "Stripe",        d: "Bring billing and revenue context into answers.",                       ic: "credit_card",     st: "off" },
];
function ConnStatus({ st }) {
  if (st === "on") return <span className="hs-badge hs-badge--positive" style={{ height: 24, marginLeft: "auto" }}><span className="material-symbols-outlined">check</span>Connected</span>;
  if (st === "error") return <span className="hs-badge hs-badge--warning" style={{ height: 24, marginLeft: "auto" }}><span className="material-symbols-outlined">error</span>Error</span>;
  return <span className="hs-badge hs-badge--neutral" style={{ height: 24, marginLeft: "auto" }}>Disconnected</span>;
}
function Connectors() {
  return (
    <WisdomManage searchPlaceholder="Search connectors…" actionLabel="Add connector" tabs={["All", "Connected", "Available"]}>
      <div className="wi-cardgrid">
        {CONNECTORS.map((c, i) => (
          <div className="wi-connectorcard" key={i}>
            <div className="cc-head"><span className="cc-ic"><span className="material-symbols-outlined">{c.ic}</span></span><span className="cc-nm">{c.nm}</span><ConnStatus st={c.st} /></div>
            <div className="cc-d">{c.d}</div>
            <div className="cc-foot">
              {c.st === "on" ? <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button">Manage</button>
                : c.st === "error" ? <button className="hs-btn hs-btn--secondary hs-btn--sm" type="button"><span className="material-symbols-outlined">refresh</span>Reconnect</button>
                : <button className="hs-btn hs-btn--secondary hs-btn--sm" type="button"><span className="material-symbols-outlined">add_link</span>Connect</button>}
            </div>
          </div>
        ))}
      </div>
    </WisdomManage>
  );
}

// Knowledge — board 49:32816 is a Trends TABLE (Trends · Results · Unique
// authors · Engagement · Actions). Trend names are board content; metric
// values are illustrative (the board cells are unresolved flexible slots).
const TRENDS = [
  ["AI Supercomputing platforms", "12,480", "3,210", "4.8%"],
  ["AI-driven drug discovery", "9,640", "2,540", "5.2%"],
  ["Physical AI Integration", "7,820", "1,990", "3.9%"],
  ["AI-Powered Cyber security", "15,120", "4,070", "6.1%"],
  ["Humanoid robots in automation", "6,310", "1,640", "3.4%"],
];
function Knowledge() {
  return (
    <WisdomManage searchPlaceholder="Search knowledge…" actionLabel="Add knowledge" tabs={["All", "Trends", "Sources", "Saved"]}>
      <div className="wi-ktable-wrap">
        <table className="wi-ktable">
          <thead><tr><th>Trends</th><th className="num">Results</th><th className="num">Unique authors</th><th className="num">Engagement</th><th aria-label="Actions"></th></tr></thead>
          <tbody>
            {TRENDS.map((r, i) => (
              <tr key={i}>
                <td><span className="wi-kname"><span className="wi-kic"><span className="material-symbols-outlined">trending_up</span></span>{r[0]}</span></td>
                <td className="num">{r[1]}</td><td className="num">{r[2]}</td><td className="num">{r[3]}</td>
                <td style={{ textAlign: "right" }}><button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label="Trend actions" title="Actions"><span className="material-symbols-outlined">more_horiz</span></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WisdomManage>
  );
}

// ── Error / Loading ───────────────────────────────────────────────────
function WisdomError({ onRetry }) {
  return (
    <div className="wi-main"><WisdomTop />
      <div className="suite-state error"><div className="suite-state-inner">
        <div className="ico"><span className="material-symbols-outlined">error</span></div>
        <h2>Wisdom couldn't respond</h2>
        <p>The model timed out before finishing. Your chat is saved — try sending your message again.</p>
        <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">help</span>Get help</button><button className="hs-btn hs-btn--primary" type="button" onClick={onRetry}><span className="material-symbols-outlined">refresh</span>Regenerate</button></div>
      </div></div>
    </div>
  );
}
function WisdomLoading() {
  return (
    <div className="wi-main" aria-busy="true"><WisdomTop />
      <div className="wi-thread"><div className="wi-thread-inner">
        <div className="wi-msg user"><div className="wi-bubble">What new trends, keywords, and conversations are emerging or gaining traction in my industry this week?</div></div>
        <div className="wi-msg owly">
          <img className="wi-owly-logo" src="assets/hootsuite-owly-small.png" alt="Wisdom" width="32" height="32" />
          <div className="wi-owly-card">
            <div className="wi-typing"><span></span><span></span><span></span></div>
            <div className="suite-sk" style={{ width: "80%", height: 12 }}></div>
            <div className="suite-sk" style={{ width: "95%", height: 12 }}></div>
            <div className="suite-sk" style={{ width: "60%", height: 12 }}></div>
          </div>
        </div>
      </div></div>
    </div>
  );
}

// ── Answered chat thread — board 10:53736 (Wisdom3). User question (right-
// aligned pill) → owl logo → response card (Idea 1/2/3 + Create post / Add to
// Whiteboard + action icons) → assist follow-up chips → composer + disclaimer.
const WI_FOLLOWUPS = [
  "Can you suggest a posting schedule?",
  "Do you have advice for launching a campaign?",
  "What platforms should we post on?",
];
function WisdomThread() {
  return (
    <div className="wi-main"><WisdomTop />
      <div className="wi-thread"><div className="wi-thread-inner">
        <div className="wi-msg user"><div className="wi-bubble">What new trends, keywords, and conversations are emerging or gaining traction in my industry this week?</div></div>
        <div className="wi-msg owly">
          <img className="wi-owly-logo" src="assets/hootsuite-owly-small.png" alt="Wisdom" width="32" height="32" />
          <div className="wi-owly-card">
            <div className="wi-owly-text">
              <p><strong>Idea 1:</strong> Three themes are picking up speed in personal finance this week. “AI-assisted budgeting” is up 38% in conversation volume, sustainability-linked accounts are resonating with Gen Z, and “fee transparency” keeps surfacing in competitor comment threads. A short, plain-language explainer on how Somos keeps fees flat would ride the first wave well.</p>
              <p><strong>Idea 2:</strong> #smartmoney #fintech #budgetingtips #feefree #moneytok</p>
              <p><strong>Idea 3:</strong> Thursday at 7 PM, just before the weekend — finance content sees its highest save rate as people plan the days ahead.</p>
            </div>
            <div className="wi-owly-actions">
              <button className="hs-btn hs-btn--outlined hs-btn--sm" type="button"><span className="material-symbols-outlined">edit_square</span>Create post</button>
              <button className="hs-btn hs-btn--outlined hs-btn--sm" type="button"><span className="material-symbols-outlined">add</span>Add to Whiteboard</button>
              <button className="wi-mact" type="button" aria-label="Rewrite" title="Rewrite"><span className="material-symbols-outlined">autorenew</span></button>
              <button className="wi-mact" type="button" aria-label="Turn into campaign" title="Turn into campaign"><span className="material-symbols-outlined">campaign</span></button>
              <button className="wi-mact" type="button" aria-label="Bad response" title="Bad response"><span className="material-symbols-outlined">thumb_down</span></button>
              <span className="spacer"></span>
              <button className="wi-mact" type="button" aria-label="Mention" title="Mention"><span className="material-symbols-outlined">alternate_email</span></button>
              <button className="wi-mact" type="button" aria-label="Attach" title="Attach"><span className="material-symbols-outlined">attach_file</span></button>
              <button className="wi-mact" type="button" aria-label="More" title="More"><span className="material-symbols-outlined">more_horiz</span></button>
              <button className="wi-mact" type="button" aria-label="Good response" title="Good response"><span className="material-symbols-outlined">thumb_up</span></button>
              <button className="wi-mact" type="button" aria-label="Save" title="Save"><span className="material-symbols-outlined">bookmark</span></button>
            </div>
            <div className="wi-owly-chips">
              {WI_FOLLOWUPS.map((f, i) => <button key={i} className="wi-assistchip" type="button">{f}</button>)}
            </div>
          </div>
        </div>
      </div></div>
      <div className="wi-thread-composer"><WisdomComposer placeholder="Get insights into your metrics or deep-dive into a specific account" /></div>
    </div>
  );
}

function App() {
  const [surface, setSurface] = React.useState("home");
  const go = k => setSurface(k);
  return (
    <div className="suite-app">
      <SuiteRail active="wisdom" />
      <WisdomDrawer active={surface} onNav={go} />
      {surface === "home" && <WisdomLanding onSend={() => setSurface("loading")} />}
      {surface === "thread" && <WisdomThread />}
      {surface === "prompts" && <PromptLibrary />}
      {surface === "agents" && <Agents />}
      {surface === "connectors" && <Connectors />}
      {surface === "knowledge" && <Knowledge />}
      {surface === "error" && <WisdomError onRetry={() => setSurface("loading")} />}
      {surface === "loading" && <WisdomLoading />}
      <SuiteStates
        states={[["home", "Home"], ["thread", "Chat"], ["prompts", "Prompts"], ["agents", "Agents"], ["connectors", "Connectors"], ["knowledge", "Knowledge"], ["error", "Error"], ["loading", "Generating"]]}
        value={surface} onChange={setSurface}
      />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
