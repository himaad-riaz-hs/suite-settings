// analytics.jsx — Analytics template on the Suite shell.
// Six surfaces driven by `surface` state: overview (main) · detail · builder
// (create/edit) · empty · error · loading. Reports lives INSIDE Analytics.
// Natural nav: New report → builder; report row → detail; back returns to overview.
// A demo-state switcher (bottom) exposes empty/error/loading for review.

const NET = {
  ig: { bg: "var(--hs-cat-5)", label: "IG" },
  li: { bg: "var(--hs-cat-1)", label: "LI" },
  x:  { bg: "var(--hs-cat-2)", label: "X" },
  th: { bg: "var(--hs-cat-3)", label: "Th" },
};

const SAVED_REPORTS = [
  { id: "q2", title: "Q2 performance overview", range: "Apr 1 – Jun 30, 2026", nets: ["ig","li","x"], owner: "Ryan Williams", updated: "2 days ago", schedule: "Monthly" },
  { id: "wk", title: "Weekly engagement digest", range: "Last 7 days", nets: ["ig","x","th"], owner: "Ryan Williams", updated: "Yesterday", schedule: "Weekly · Mon 9:00" },
  { id: "comp", title: "Competitor benchmark", range: "Last 30 days", nets: ["ig","li"], owner: "Devin Park", updated: "1 week ago", schedule: "—" },
];

// ── Chart primitives (SVG placeholders, tokenized series colours) ──────
function LineChart() {
  return (
    <svg className="ph-line" viewBox="0 0 800 200" preserveAspectRatio="none" role="img" aria-label="Audience growth line chart">
      <g stroke="var(--an-grid)" strokeWidth="1"><line x1="0" y1="40" x2="800" y2="40"/><line x1="0" y1="80" x2="800" y2="80"/><line x1="0" y1="120" x2="800" y2="120"/><line x1="0" y1="160" x2="800" y2="160"/></g>
      <path d="M0,160 C60,150 120,140 180,135 C240,130 300,125 360,110 C420,100 480,80 540,75 C600,72 660,60 720,40 C760,28 780,30 800,30" fill="none" stroke="var(--an-s1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M0,170 C60,165 120,165 180,160 C240,155 300,158 360,150 C420,145 480,140 540,130 C600,125 660,115 720,108 C760,100 780,105 800,98" fill="none" stroke="var(--an-s2)" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function DonutChart() {
  return (
    <svg className="ph-donut" viewBox="0 0 200 200" role="img" aria-label="Followers by network donut chart">
      <circle cx="100" cy="100" r="70" fill="none" stroke="var(--an-grid)" strokeWidth="26"/>
      <circle cx="100" cy="100" r="70" fill="none" stroke="var(--hs-cat-5)" strokeWidth="26" strokeDasharray="180 440" transform="rotate(-90 100 100)"/>
      <circle cx="100" cy="100" r="70" fill="none" stroke="var(--hs-cat-1)" strokeWidth="26" strokeDasharray="120 440" strokeDashoffset="-180" transform="rotate(-90 100 100)"/>
      <circle cx="100" cy="100" r="70" fill="none" stroke="var(--hs-cat-2)" strokeWidth="26" strokeDasharray="80 440" strokeDashoffset="-300" transform="rotate(-90 100 100)"/>
      <circle cx="100" cy="100" r="70" fill="none" stroke="var(--hs-cat-3)" strokeWidth="26" strokeDasharray="60 440" strokeDashoffset="-380" transform="rotate(-90 100 100)"/>
      <text x="100" y="96" textAnchor="middle" fontWeight="700" fontSize="28" fill="var(--bento-theme-color-text-base)">142K</text>
      <text x="100" y="118" textAnchor="middle" fontSize="12" fill="var(--bento-theme-color-text-subtle)">followers</text>
    </svg>
  );
}
function BarChart() {
  return (
    <svg className="ph-bar" viewBox="0 0 600 200" role="img" aria-label="Top posts engagement bar chart">
      <g stroke="var(--an-grid)" strokeWidth="1"><line x1="0" y1="40" x2="600" y2="40"/><line x1="0" y1="80" x2="600" y2="80"/><line x1="0" y1="120" x2="600" y2="120"/><line x1="0" y1="160" x2="600" y2="160"/></g>
      <g fill="var(--an-s1)">
        <rect x="20" y="60" width="50" height="120" rx="4"/><rect x="90" y="40" width="50" height="140" rx="4"/><rect x="160" y="80" width="50" height="100" rx="4"/><rect x="230" y="100" width="50" height="80" rx="4"/><rect x="300" y="50" width="50" height="130" rx="4"/><rect x="370" y="90" width="50" height="90" rx="4"/><rect x="440" y="70" width="50" height="110" rx="4"/><rect x="510" y="110" width="50" height="70" rx="4"/>
      </g>
    </svg>
  );
}
function AreaChart() {
  return (
    <svg className="ph-area" viewBox="0 0 600 200" role="img" aria-label="Posting cadence area chart">
      <defs><linearGradient id="an-ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--an-s1)" stopOpacity="0.32"/><stop offset="100%" stopColor="var(--an-s1)" stopOpacity="0"/></linearGradient></defs>
      <path d="M0,200 L0,140 C60,130 120,135 180,120 C240,108 300,115 360,90 C420,76 480,85 540,70 C570,62 600,68 600,68 L600,200 Z" fill="url(#an-ag)" stroke="var(--an-s1)" strokeWidth="2"/>
    </svg>
  );
}

function Delta({ up, children }) {
  return (
    <span className={"dt " + (up ? "up" : "down")}>
      <span className="material-symbols-outlined">{up ? "trending_up" : "trending_down"}</span>{children}
    </span>
  );
}

function KpiCards() {
  const kpis = [
    { t: "Followers", s: "Total", v: "142.3K", d: "8.2% · 10.8K new", up: true },
    { t: "Engagement", s: "Rate", v: "4.7%", d: "0.4 pts", up: true },
    { t: "Reach", s: "Estimated", v: "312K", d: "2.1%", up: false },
    { t: "Click-through", s: "Average", v: "2.1%", d: "0.6 pts", up: true },
  ];
  return kpis.map((k, i) => (
    <div className="card s3" key={i}>
      <div className="h"><span className="t">{k.t}</span><span className="s">{k.s}</span></div>
      <div className="kpi-big">{k.v}</div>
      <Delta up={k.up}>{k.d}</Delta>
    </div>
  ));
}

// ── Filter toolbar (shared between overview + detail) ──────────────────
function FilterBar({ title }) {
  return (
    <div className="an-toolbar">
      <span className="sub-title">{title}</span>
      <div className="an-spacer"></div>
      <button className="cf selected" type="button"><span className="dot" style={{ background: "var(--bento-theme-color-bg-primary)" }}></span>All networks<span className="x"><span className="material-symbols-outlined">close</span></span></button>
      <button className="cf" type="button"><span className="dot" style={{ background: NET.ig.bg }}></span>Instagram<span className="material-symbols-outlined chev">expand_more</span></button>
      <button className="cf" type="button"><span className="dot" style={{ background: NET.li.bg }}></span>LinkedIn<span className="material-symbols-outlined chev">expand_more</span></button>
      <button className="cf" type="button"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>filter_list</span>Filters<span className="material-symbols-outlined chev">expand_more</span></button>
    </div>
  );
}

// ── 1 · OVERVIEW (main) — board "Your performance overview" (3781:272775)
const IMPACT = [
  { ic: "stacks", t: "Posts", v: "42", unit: "posts", d: "6%", from: "40", up: true },
  { ic: "visibility", t: "Impressions", v: "34,120", unit: "impressions", d: "2%", from: "34,393", up: false },
  { ic: "group_add", t: "New followers", v: "320", unit: "followers", d: "1.1%", from: "318", up: true },
  { ic: "group", t: "Total followers", v: "11,402", unit: "followers", d: "8%", from: "10,980", up: true },
  { ic: "favorite", t: "Post reactions & likes", v: "1,034", unit: "reactions & likes", d: "5%", from: "985", up: true, wide: true },
  { ic: "chat_bubble", t: "Post comments & replies", v: "802", unit: "comments & replies", d: "3%", from: "779", up: true, wide: true },
];
function ImpactDelta({ up, children }) {
  // no-red: a decrease shows in amber (warning), never red
  return <span className="an-idt" style={{ color: up ? "var(--bento-system-sys-positive-600)" : "var(--bento-theme-color-text-warning, var(--bento-system-sys-warning-700))" }}><span className="material-symbols-outlined">{up ? "trending_up" : "trending_down"}</span>{children}</span>;
}
function Overview({ onNew, onOpen }) {
  return (
    <div className="an">
      <header className="an-top">
        <h1>Analytics</h1>
        <button className="an-ws" type="button"><span className="av">SOMOS</span>Somos<span className="material-symbols-outlined">expand_more</span></button>
        <div className="an-spacer"></div>
        <button className="hs-btn hs-btn--ghost" type="button"><span className="material-symbols-outlined">calendar_today</span>Last 30 days<span className="material-symbols-outlined">expand_more</span></button>
        <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">file_download</span>Export</button>
        <button className="hs-btn hs-btn--primary" type="button" onClick={onNew}><span className="material-symbols-outlined">add</span>New report</button>
      </header>
      <div className="an-body">
        <h2 className="an-sech">Your performance overview</h2>
        <div className="an-score">
          <div className="sc-left">
            <div className="sc-t">Social performance score</div>
            <div className="sc-d">Track your content's impact at a glance. This score helps you measure effectiveness and uncover AI-driven insights to refine your strategy.</div>
            <div className="sc-num"><span className="big">736</span><span className="den">/ 1,000</span><span className="sc-arrow"><span className="material-symbols-outlined">north_east</span></span></div>
            <div className="sc-great">Doing great!</div>
            <div className="sc-greatsub">It increased by 10 points in the last week. Way to go!</div>
          </div>
          <div className="sc-right">
            <div className="sc-chart-t">SCORE HISTORY</div>
            <LineChart />
            <div className="sc-months"><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span></div>
          </div>
          <button className="hs-btn hs-btn--outlined sc-cta" type="button">View weekly score and insights</button>
        </div>
        <div className="an-impacthead">
          <div><h2 className="an-sech" style={{ margin: 0 }}>Your social impact at a glance</h2><p className="an-secsub">See the combined impact of your social accounts, then explore reports for deeper insights.</p></div>
          <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button"><span className="material-symbols-outlined">flag</span>Dec 25, 2024<span className="material-symbols-outlined">expand_more</span></button>
        </div>
        <div className="an-impactgrid">
          {IMPACT.map((k, i) => (
            <div className={"an-impact-card" + (k.wide ? " wide" : "")} key={i}>
              <div className="ai-h"><span className="ai-ic"><span className="material-symbols-outlined">{k.ic}</span></span><span className="ai-t">{k.t}</span><span className="ai-i ne-tooltipbtn" title={k.t}><span className="material-symbols-outlined">info</span></span></div>
              <div className="ai-v">{k.v}</div>
              <div className="ai-unit">{k.unit}</div>
              <div className="ai-delta"><ImpactDelta up={k.up}>{k.d}</ImpactDelta><span className="ai-from">from {k.from}</span></div>
            </div>
          ))}
        </div>
        <div className="card s12" style={{ gap: 0, padding: 0, marginTop: 16 }}>
          <div className="h" style={{ padding: "20px 20px 8px" }}><span className="t">Saved reports</span><span className="s">Click a report to open</span></div>
          <table className="an-table">
            <thead><tr><th>Report</th><th>Date range</th><th>Networks</th><th>Owner</th><th>Schedule</th><th>Updated</th></tr></thead>
            <tbody>
              {SAVED_REPORTS.map(r => (
                <tr key={r.id} style={{ cursor: "pointer" }} onClick={() => onOpen(r)}>
                  <td><div className="row-lead"><span className="net" style={{ background: "var(--bento-theme-color-bg-primary)" }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>description</span></span><span className="nm">{r.title}</span></div></td>
                  <td>{r.range}</td>
                  <td><span style={{ display: "inline-flex", gap: 4 }}>{r.nets.map(n => <span key={n} className="net" style={{ width: 22, height: 22, fontSize: 10, fontWeight: 700, background: NET[n].bg }}>{NET[n].label}</span>)}</span></td>
                  <td>{r.owner}</td>
                  <td>{r.schedule}</td>
                  <td>{r.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 2 · REPORT DETAIL ─────────────────────────────────────────────────
function ReportDetail({ report, onBack, onEdit }) {
  const r = report || SAVED_REPORTS[0];
  const rows = [
    { n: "ig", nm: "Instagram", su: "@somosbank", reach: "128.4K", eng: "5.9%", posts: 24, clicks: "3.1K" },
    { n: "li", nm: "LinkedIn", su: "Somos Bank", reach: "94.2K", eng: "4.1%", posts: 12, clicks: "2.4K" },
    { n: "x",  nm: "X", su: "@somosbank", reach: "61.0K", eng: "3.3%", posts: 31, clicks: "1.2K" },
  ];
  return (
    <div className="an">
      <header className="an-top">
        <button className="an-back" type="button" onClick={onBack}><span className="material-symbols-outlined">arrow_back</span>Reports</button>
        <div className="an-crumb"><span className="material-symbols-outlined">chevron_right</span><b>{r.title}</b></div>
        <div className="an-spacer"></div>
        <button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label="Schedule report" title="Schedule report"><span className="material-symbols-outlined">schedule</span></button>
        <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">file_download</span>Export PDF</button>
        <button className="hs-btn hs-btn--primary" type="button" onClick={onEdit}><span className="material-symbols-outlined">edit</span>Edit report</button>
      </header>
      <div className="an-body">
        <div className="rd-head">
          <div style={{ flex: 1 }}>
            <h2 className="rd-title">{r.title}</h2>
            <div className="rd-meta">
              <span><span className="material-symbols-outlined">calendar_today</span>{r.range}</span>
              <span><span className="material-symbols-outlined">person</span>{r.owner}</span>
              <span><span className="material-symbols-outlined">schedule_send</span>{r.schedule === "—" ? "Not scheduled" : r.schedule}</span>
              <span><span className="material-symbols-outlined">public</span>{r.nets.length} networks</span>
            </div>
          </div>
          <span className="hs-badge hs-badge--positive"><span className="material-symbols-outlined">check_circle</span>Up to date</span>
        </div>
        <div className="grid">
          <KpiCards />
          <div className="card s6">
            <div className="h"><span className="t">Engagement trend</span><span className="s">vs. previous period</span></div>
            <LineChart />
          </div>
          <div className="card s6">
            <div className="h"><span className="t">Posting cadence</span><span className="s">By week</span></div>
            <AreaChart />
          </div>
          <div className="card s12" style={{ gap: 0, padding: 0 }}>
            <div className="h" style={{ padding: "20px 20px 8px" }}><span className="t">Performance by network</span></div>
            <table className="an-table">
              <thead><tr><th>Network</th><th className="num">Reach</th><th className="num">Eng. rate</th><th className="num">Posts</th><th className="num">Link clicks</th></tr></thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.n}>
                    <td><div className="row-lead"><span className="net" style={{ background: NET[row.n].bg }}>{NET[row.n].label}</span><span><span className="nm" style={{ display: "block" }}>{row.nm}</span><span className="su">{row.su}</span></span></div></td>
                    <td className="num">{row.reach}</td><td className="num">{row.eng}</td><td className="num">{row.posts}</td><td className="num">{row.clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 3 · REPORT BUILDER (create / edit) ────────────────────────────────
const MODULES = [
  { id: "kpi", icon: "tag", nm: "KPI summary", md: "Followers, engagement, reach, CTR", on: true },
  { id: "growth", icon: "trending_up", nm: "Audience growth", md: "Line chart over time", on: true },
  { id: "network", icon: "donut_small", nm: "Followers by network", md: "Donut breakdown", on: true },
  { id: "top", icon: "bar_chart", nm: "Top posts", md: "Ranked by engagement", on: false },
  { id: "table", icon: "table_rows", nm: "Performance table", md: "Per-network metrics", on: true },
  { id: "audience", icon: "groups", nm: "Audience demographics", md: "Age, location, gender", on: false },
];

function Builder({ editing, onCancel, onSave }) {
  const [name, setName] = React.useState(editing ? "Q2 performance overview" : "Untitled report");
  const [mods, setMods] = React.useState(() => Object.fromEntries(MODULES.map(m => [m.id, m.on])));
  const [nets, setNets] = React.useState({ ig: true, li: true, x: true, th: false });
  const toggleMod = id => setMods(p => ({ ...p, [id]: !p[id] }));
  const toggleNet = id => setNets(p => ({ ...p, [id]: !p[id] }));
  const active = MODULES.filter(m => mods[m.id]);
  return (
    <div className="an">
      <header className="an-top">
        <button className="an-back" type="button" onClick={onCancel}><span className="material-symbols-outlined">arrow_back</span>Reports</button>
        <div className="an-crumb"><span className="material-symbols-outlined">chevron_right</span><b>{editing ? "Edit report" : "New report"}</b></div>
      </header>
      <div className="bd">
        <aside className="bd-config" aria-label="Report settings">
          <div className="bd-sec">
            <label className="lbl" htmlFor="bd-name">Report name</label>
            <input id="bd-name" className="hs-input an-field" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="bd-sec">
            <label className="lbl" htmlFor="bd-range">Date range</label>
            <div className="an-select">
              <select id="bd-range" className="hs-input an-field"><option>Last 30 days</option><option>Last 7 days</option><option>This quarter</option><option>Custom range…</option></select>
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
          <div className="bd-sec">
            <span className="lbl">Networks</span>
            <div className="bd-net">
              {Object.keys(NET).map(k => (
                <button key={k} type="button" className={"cf" + (nets[k] ? " selected" : "")} onClick={() => toggleNet(k)} aria-pressed={nets[k]}>
                  <span className="dot" style={{ background: nets[k] ? "var(--bento-theme-color-bg-primary)" : NET[k].bg }}></span>{({ig:"Instagram",li:"LinkedIn",x:"X",th:"Threads"})[k]}
                </button>
              ))}
            </div>
          </div>
          <div className="bd-sec">
            <span className="lbl">Modules</span>
            <p className="bd-hint">Choose what appears in the report.</p>
            <div className="bd-modules" role="group" aria-label="Report modules">
              {MODULES.map(m => (
                <div key={m.id} className="bd-mod" role="checkbox" aria-checked={mods[m.id]} tabIndex={0} onClick={() => toggleMod(m.id)}
                     onKeyDown={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleMod(m.id); } }}>
                  <span className="mi"><span className="material-symbols-outlined">{m.icon}</span></span>
                  <span className="mt"><span className="mn">{m.nm}</span><span className="md">{m.md}</span></span>
                  <span className={"an-check" + (mods[m.id] ? " on" : "")}><span className="material-symbols-outlined">check</span></span>
                </div>
              ))}
            </div>
          </div>
        </aside>
        <div className="bd-canvas">
          <div className="bd-paper">
            <div className="bd-paper-head">
              <h2>{name}</h2>
              <span className="sub">Last 30 days · {Object.values(nets).filter(Boolean).length} networks · Live preview</span>
            </div>
            <div className="bd-paper-body">
              {active.length === 0 && <div className="bd-block ghost full">Select modules on the left to build your report</div>}
              {active.map(m => {
                const full = m.id === "growth" || m.id === "table";
                return (
                  <div key={m.id} className={"bd-block" + (full ? " full" : "")}>
                    <span className="bb-t">{m.nm}</span>
                    {m.id === "kpi" && <div style={{ display: "flex", gap: 16 }}><div className="kpi-big" style={{ fontSize: 32 }}>142K</div><div className="kpi-big" style={{ fontSize: 32 }}>4.7%</div></div>}
                    {m.id === "growth" && <LineChart />}
                    {m.id === "network" && <DonutChart />}
                    {m.id === "top" && <BarChart />}
                    {m.id === "table" && <div className="bd-block ghost" style={{ minHeight: 60 }}>Per-network metrics table</div>}
                    {m.id === "audience" && <div className="bd-block ghost" style={{ minHeight: 60 }}>Demographic breakdown</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="bd-foot">
        <span className="meta">{active.length} module{active.length === 1 ? "" : "s"} · auto-saved as draft</span>
        <button className="hs-btn hs-btn--ghost" type="button" onClick={onCancel}>Cancel</button>
        <button className="hs-btn hs-btn--secondary" type="button">Preview</button>
        <button className="hs-btn hs-btn--primary" type="button" onClick={onSave}>{editing ? "Save changes" : "Save report"}</button>
      </div>
    </div>
  );
}

// ── 4/5/6 · EMPTY / ERROR / LOADING ───────────────────────────────────
function EmptyState({ onNew }) {
  return (
    <div className="an">
      <header className="an-top"><h1>Analytics</h1><button className="an-ws" type="button"><span className="av">SOMOS</span>Somos<span className="material-symbols-outlined">expand_more</span></button></header>
      <div className="suite-state empty">
        <div className="suite-state-inner">
          <div className="ico"><span className="material-symbols-outlined">monitoring</span></div>
          <h2>No reports yet</h2>
          <p>Build a report to track followers, engagement, and reach across your connected networks. Schedule it to land in your inbox automatically.</p>
          <div className="acts">
            <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">school</span>See an example</button>
            <button className="hs-btn hs-btn--primary" type="button" onClick={onNew}><span className="material-symbols-outlined">add</span>Build your first report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function ErrorState({ onRetry }) {
  return (
    <div className="an">
      <header className="an-top"><h1>Analytics</h1><button className="an-ws" type="button"><span className="av">SOMOS</span>Somos<span className="material-symbols-outlined">expand_more</span></button></header>
      <div className="suite-state error">
        <div className="suite-state-inner">
          <div className="ico"><span className="material-symbols-outlined">cloud_off</span></div>
          <h2>We couldn't load your analytics</h2>
          <p>The data service didn't respond. Your reports are safe — this is usually temporary. Check your connection and try again.</p>
          <div className="acts">
            <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">help</span>View status</button>
            <button className="hs-btn hs-btn--primary" type="button" onClick={onRetry}><span className="material-symbols-outlined">refresh</span>Try again</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function LoadingState() {
  return (
    <div className="an" aria-busy="true">
      <header className="an-top"><h1>Analytics</h1><div className="an-spacer"></div><div className="suite-sk" style={{ width: 120, height: 32, borderRadius: 8 }}></div></header>
      <div className="an-toolbar"><div className="suite-sk" style={{ width: 120, height: 24 }}></div><div className="an-spacer"></div><div className="suite-sk" style={{ width: 110, height: 32, borderRadius: 999 }}></div><div className="suite-sk" style={{ width: 110, height: 32, borderRadius: 999 }}></div></div>
      <div className="an-body">
        <div className="grid">
          {[0,1,2,3].map(i => <div className="card s3" key={i}><div className="suite-sk" style={{ width: "50%", height: 12 }}></div><div className="suite-sk" style={{ width: "60%", height: 48 }}></div><div className="suite-sk" style={{ width: "40%", height: 12 }}></div></div>)}
          <div className="card s8"><div className="suite-sk" style={{ width: "30%", height: 12 }}></div><div className="suite-sk" style={{ flex: 1, minHeight: 150, borderRadius: 8 }}></div></div>
          <div className="card s4"><div className="suite-sk" style={{ width: "50%", height: 12 }}></div><div className="suite-sk" style={{ flex: 1, minHeight: 150, borderRadius: 8 }}></div></div>
        </div>
      </div>
    </div>
  );
}

// ── App shell + drawer + demo switcher ────────────────────────────────
// Analytics section drawer (canonical .suite-drawer / .sd-* shell).
// Nav confirmed against social-os-reboot Figma (canonical per PRD ANL-25539);
// exact full drawer (Home/Settings ordering) still to be finalised with
// Alessia Pinna / Joao Ribeiro; v1 shipped an interim simplified nav.
function Drawer() {
  const items = [
    { key: "home",     icon: "home",        label: "Home" },
    { key: "explore",  icon: "explore",     label: "Explore" },
    { key: "reports",  icon: "description", label: "My reports" },
    { key: "settings", icon: "settings",    label: "Settings" },
  ];
  const active = "explore";
  return (
    <aside className="suite-drawer" aria-label="Analytics navigation">
      <div className="sd-head">Analytics
        <button className="sd-collapse" type="button" aria-label="Collapse" title="Collapse"><span className="material-symbols-outlined">keyboard_double_arrow_left</span></button>
      </div>
      <div className="sd-body">
        <button className="hs-btn hs-btn--secondary" type="button" style={{ width: "100%", marginBottom: 8 }}><span className="material-symbols-outlined">add</span>Create a report</button>
        {items.map(it => (
          <a key={it.key} href="#" className={"sd-item" + (active === it.key ? " on" : "")} aria-current={active === it.key ? "page" : undefined}>
            <span className="material-symbols-outlined">{it.icon}</span>{it.label}
          </a>
        ))}
      </div>
    </aside>
  );
}

const DEMO_STATES = [["main","Overview"],["detail","Report"],["builder","Builder"],["empty","Empty"],["error","Error"],["loading","Loading"]];

function App() {
  const [surface, setSurface] = React.useState("main");
  const [report, setReport] = React.useState(SAVED_REPORTS[0]);
  const [editing, setEditing] = React.useState(false);
  return (
    <div className="suite-app">
      <SuiteRail active="perch" />
      <Drawer />
      {surface === "main" && <Overview onNew={() => { setEditing(false); setSurface("builder"); }} onOpen={r => { setReport(r); setSurface("detail"); }} />}
      {surface === "detail" && <ReportDetail report={report} onBack={() => setSurface("main")} onEdit={() => { setEditing(true); setSurface("builder"); }} />}
      {surface === "builder" && <Builder editing={editing} onCancel={() => setSurface(editing ? "detail" : "main")} onSave={() => setSurface(editing ? "detail" : "main")} />}
      {surface === "empty" && <EmptyState onNew={() => { setEditing(false); setSurface("builder"); }} />}
      {surface === "error" && <ErrorState onRetry={() => setSurface("loading")} />}
      {surface === "loading" && <LoadingState />}

      <SuiteStates states={DEMO_STATES} value={surface} onChange={setSurface} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
