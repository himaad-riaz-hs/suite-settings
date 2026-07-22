// analytics-overview.jsx — Hootsuite social analytics overview dashboard.
// Suite shell (SuiteRail perch + Analytics drawer) + KPI cards, performance chart,
// top posts table, per-network breakdown. Flat, Bento tokens, no red.

/* ── Analytics drawer (canonical .suite-drawer / .sd-*) ──────────────── */
function Drawer() {
  const items = [
    { key: "overview", icon: "home",        label: "Overview" },
    { key: "explore",  icon: "explore",     label: "Explore" },
    { key: "reports",  icon: "description", label: "My reports" },
    { key: "settings", icon: "settings",    label: "Settings" },
  ];
  const active = "overview";
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

/* ── Trend indicator (paired arrow; up=green, down=amber, never red) ──── */
function Trend({ dir, children }) {
  return (
    <span className={"ao-trend " + dir}>
      <span className="material-symbols-outlined">{dir === "up" ? "trending_up" : "trending_down"}</span>{children}
    </span>
  );
}

/* ── KPI summary cards ───────────────────────────────────────────────── */
const KPIS = [
  { key: "followers", icon: "group",        label: "Total followers",  val: "248,920", dir: "up",   delta: "+3.2%", note: "vs prev 30 days" },
  { key: "engage",    icon: "favorite",     label: "Engagement rate",  val: "4.8%",    dir: "up",   delta: "+0.6 pts", note: "vs prev 30 days" },
  { key: "impr",      icon: "visibility",   label: "Impressions",      val: "3.6M",    dir: "up",   delta: "+12.4%", note: "vs prev 30 days" },
  { key: "clicks",    icon: "ads_click",    label: "Link clicks",      val: "52,410",  dir: "down", delta: "-4.2%",  note: "vs prev 30 days" },
];
function KpiCards() {
  return (
    <div className="ao-kpis">
      {KPIS.map(k => (
        <div className="ao-kpi" key={k.key}>
          <div className="ao-kpi-label"><span className="material-symbols-outlined">{k.icon}</span>{k.label}</div>
          <div className="ao-kpi-val">{k.val}</div>
          <div className="ao-kpi-foot"><Trend dir={k.dir}>{k.delta}</Trend><span>{k.note}</span></div>
        </div>
      ))}
    </div>
  );
}

/* ── Performance-over-time chart (blue-led, flat) ────────────────────── */
const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
const THIS_P = [42, 55, 48, 67, 61, 78, 84, 92];   // engagement index, this period
const LAST_P = [40, 44, 46, 50, 53, 58, 60, 64];   // last period
const CX0 = 48, CX1 = 940, CY0 = 16, CY1 = 232, CMAX = 100;
const cx = i => CX0 + (i / (WEEKS.length - 1)) * (CX1 - CX0);
const cy = v => CY0 + (1 - v / CMAX) * (CY1 - CY0);
function smooth(data) {
  const p = data.map((v, i) => [cx(i), cy(v)]);
  let d = "M" + p[0][0] + "," + p[0][1];
  for (let i = 0; i < p.length - 1; i++) {
    const xm = (p[i][0] + p[i + 1][0]) / 2;
    d += " C" + xm + "," + p[i][1] + " " + xm + "," + p[i + 1][1] + " " + p[i + 1][0] + "," + p[i + 1][1];
  }
  return d;
}
function PerfChart() {
  const line = smooth(THIS_P);
  const area = line + " L" + CX1 + "," + CY1 + " L" + CX0 + "," + CY1 + " Z";
  const grid = [0, 25, 50, 75, 100];
  return (
    <div className="ao-card">
      <div className="ao-card-head">
        <div><h2>Performance over time</h2><div className="ao-card-sub">Engagement index · last 8 weeks</div></div>
        <div className="ao-chart-legend">
          <span className="ao-leg"><span className="swatch" style={{ background: "var(--ao-s1)" }}></span>This period</span>
          <span className="ao-leg"><span className="swatch" style={{ background: "var(--ao-s2)" }}></span>Previous period</span>
        </div>
      </div>
      <div className="ao-card-pad">
        <svg className="ao-chart" viewBox="0 0 980 260" role="img" aria-label="Engagement index over the last 8 weeks, this period versus previous period">
          {grid.map(v => (
            <g key={v}>
              <line className="gridline" x1={CX0} y1={cy(v)} x2={CX1} y2={cy(v)} />
              <text className="axislabel" x={CX0 - 10} y={cy(v) + 4} textAnchor="end">{v}</text>
            </g>
          ))}
          <path d={area} fill="var(--ao-s1)" fillOpacity="0.10" />
          <path d={smooth(LAST_P)} fill="none" stroke="var(--ao-s2)" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
          <path d={line} fill="none" stroke="var(--ao-s1)" strokeWidth="2.5" strokeLinecap="round" />
          {THIS_P.map((v, i) => <circle key={i} cx={cx(i)} cy={cy(v)} r="3.5" fill="var(--bento-theme-color-bg-surface)" stroke="var(--ao-s1)" strokeWidth="2" />)}
          {WEEKS.map((w, i) => <text key={w} className="axislabel" x={cx(i)} y={CY1 + 22} textAnchor="middle">{w}</text>)}
        </svg>
      </div>
    </div>
  );
}

/* ── Network glyphs (categorical tokens, never raw brand hex) ────────── */
const NET = {
  ig: { code: "IG", name: "Instagram", c: "var(--hs-cat-5-bg)", cf: "var(--hs-cat-5-fg)" },
  fb: { code: "FB", name: "Facebook",  c: "var(--hs-cat-3-bg)", cf: "var(--hs-cat-3-fg)" },
  li: { code: "LI", name: "LinkedIn",  c: "var(--hs-cat-1-bg)", cf: "var(--hs-cat-1-fg)" },
  x:  { code: "X",  name: "X",         c: "var(--hs-cat-9-bg)", cf: "var(--hs-cat-9-fg)" },
  tt: { code: "TT", name: "TikTok",    c: "var(--hs-cat-7-bg)", cf: "var(--hs-cat-7-fg)" },
};
function Glyph({ net, sm }) {
  const n = NET[net];
  return <span className={"ao-glyph" + (sm ? " sm" : "")} style={{ background: n.c, color: n.cf }} title={n.name} aria-label={n.name}>{n.code}</span>;
}

/* ── Top-performing posts table ──────────────────────────────────────── */
const POSTS = [
  { net: "ig", t: "Behind the scenes of our spring launch 🌱", d: "Apr 18 · Reel",   reach: "184.2K", eng: "9.1%", clicks: "4,820", dir: "up" },
  { net: "li", t: "How our team ships design systems faster",  d: "Apr 15 · Article", reach: "96.4K",  eng: "6.7%", clicks: "3,210", dir: "up" },
  { net: "tt", t: "3 scheduling tips every marketer needs",    d: "Apr 12 · Video",   reach: "142.8K", eng: "8.2%", clicks: "2,940", dir: "up" },
  { net: "x",  t: "We just crossed 250K followers — thank you", d: "Apr 10 · Post",    reach: "71.3K",  eng: "3.9%", clicks: "1,180", dir: "down" },
  { net: "fb", t: "Customer spotlight: Somos x Hootsuite",      d: "Apr 8 · Photo",    reach: "58.9K",  eng: "4.4%", clicks: "1,020", dir: "up" },
];
function TopPosts() {
  return (
    <div className="ao-card">
      <div className="ao-card-head">
        <div><h2>Top-performing posts</h2><div className="ao-card-sub">By engagement · last 30 days</div></div>
        <button className="ao-ghost" type="button">View all<span className="material-symbols-outlined">chevron_right</span></button>
      </div>
      <table className="ao-table">
        <thead><tr><th>Post</th><th className="num">Reach</th><th className="num">Engagement</th><th className="num">Link clicks</th></tr></thead>
        <tbody>
          {POSTS.map((p, i) => (
            <tr key={i}>
              <td>
                <div className="ao-post">
                  <span className="ao-thumb"><span className="material-symbols-outlined">image</span></span>
                  <div className="ao-post-tx">
                    <div className="t">{p.t}</div>
                    <div className="d"><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Glyph net={p.net} sm />{p.d}</span></div>
                  </div>
                </div>
              </td>
              <td className="num">{p.reach}</td>
              <td className="num">{p.eng}</td>
              <td className="num"><span style={{ display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>{p.clicks}<Trend dir={p.dir}></Trend></span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Per-network breakdown ───────────────────────────────────────────── */
const NETROWS = [
  { net: "ig", followers: "112.4K", share: 45, dir: "up",   delta: "+4.1%" },
  { net: "fb", followers: "58.2K",  share: 23, dir: "up",   delta: "+1.2%" },
  { net: "li", followers: "38.7K",  share: 16, dir: "up",   delta: "+6.8%" },
  { net: "x",  followers: "24.1K",  share: 10, dir: "down", delta: "-0.9%" },
  { net: "tt", followers: "15.5K",  share: 6,  dir: "up",   delta: "+11.3%" },
];
function NetworkBreakdown() {
  return (
    <div className="ao-card">
      <div className="ao-card-head"><div><h2>By network</h2><div className="ao-card-sub">Followers · share of audience</div></div></div>
      <div className="ao-net">
        {NETROWS.map(r => {
          const n = NET[r.net];
          return (
            <div className="ao-net-row" key={r.net}>
              <Glyph net={r.net} />
              <div className="ao-net-tx">
                <div className="ao-net-name">{n.name}</div>
                <div className="ao-bar"><span style={{ width: r.share + "%", background: n.c }}></span></div>
              </div>
              <div className="ao-net-val">
                <div className="v">{r.followers}</div>
                <div className="ao-net-sub"><Trend dir={r.dir}>{r.delta}</Trend></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── States ──────────────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="ao-state"><div className="ao-state-inner">
      <div className="ico"><span className="material-symbols-outlined">monitoring</span></div>
      <h2>No analytics yet</h2>
      <p>Connect a social account to start tracking followers, engagement, and reach. Data appears within a few hours of connecting.</p>
      <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">school</span>How analytics works</button><button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">add</span>Connect account</button></div>
    </div></div>
  );
}
function ErrorState({ onRetry }) {
  return (
    <div className="ao-state"><div className="ao-state-inner">
      <div className="ico"><span className="material-symbols-outlined">cloud_off</span></div>
      <h2>We couldn't load your analytics</h2>
      <p>Your data is safe — this is usually a brief connection issue. Try loading the dashboard again.</p>
      <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">help</span>View status</button><button className="hs-btn hs-btn--primary" type="button" onClick={onRetry}><span className="material-symbols-outlined">refresh</span>Try again</button></div>
    </div></div>
  );
}
function LoadingState() {
  return (
    <div className="ao-content" aria-busy="true"><div className="ao-wrap">
      <div className="ao-kpis">{[0,1,2,3].map(i => <div className="ao-kpi" key={i}><span className="ao-sk" style={{ width: 90, height: 12 }}></span><span className="ao-sk" style={{ width: 120, height: 30, marginTop: 8 }}></span><span className="ao-sk" style={{ width: 100, height: 12, marginTop: 8 }}></span></div>)}</div>
      <div className="ao-card ao-card-pad"><span className="ao-sk" style={{ width: 200, height: 16, display: "block" }}></span><span className="ao-sk" style={{ width: "100%", height: 240, display: "block", marginTop: 16, borderRadius: 8 }}></span></div>
    </div></div>
  );
}

/* ── App ─────────────────────────────────────────────────────────────── */
function App() {
  const [surface, setSurface] = React.useState("main");
  return (
    <div className="ao-app">
      <SuiteRail active="perch" />
      <Drawer />
      <main className="ao-main">
        <header className="ao-hdr">
          <h1>Overview</h1>
          <div className="grow"></div>
          <button className="ao-ghost" type="button"><span className="material-symbols-outlined">calendar_today</span>Last 30 days<span className="material-symbols-outlined">expand_more</span></button>
          <button className="ao-ghost" type="button"><span className="material-symbols-outlined">compare_arrows</span>Compare<span className="material-symbols-outlined">expand_more</span></button>
          <button className="ao-iconbtn" type="button" aria-label="Export" title="Export"><span className="material-symbols-outlined">download</span></button>
          <button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">add</span>New report</button>
        </header>
        {surface === "empty" ? <EmptyState />
          : surface === "error" ? <ErrorState onRetry={() => setSurface("loading")} />
          : surface === "loading" ? <LoadingState />
          : (
            <div className="ao-content"><div className="ao-wrap">
              <KpiCards />
              <PerfChart />
              <div className="ao-row">
                <TopPosts />
                <NetworkBreakdown />
              </div>
            </div></div>
          )}
      </main>
      <SuiteStates states={[["main", "Overview"], ["empty", "Empty"], ["error", "Error"], ["loading", "Loading"]]} value={surface} onChange={setSurface} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
