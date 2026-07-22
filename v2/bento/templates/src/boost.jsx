// boost.jsx — Automated Boost. Boost is NOT a nav item; this flow is launched
// from Create ("Boost a post") and from Ads. Surfaces: automations list (main)
// · create-automated-boost flow (trigger → audience & budget → schedule & goal
// → review) · automation detail · empty · error · loading.
// Reuses ads.css wizard classes (.aw-*, .obj-*, .ad-kpi*). PerchNet from perch-common.

const AUTOMATIONS = [
  { id: "a1", name: "Boost top performers", rule: "When a post beats its 30-day average engagement by 50%", on: true, boosted: 18, spend: "$1,240", reach: "284K", icon: "trending_up" },
  { id: "a2", name: "Always-boost launches", rule: "Every post tagged #launch to Instagram & Facebook", on: true, boosted: 6, spend: "$680", reach: "96K", icon: "rocket_launch" },
  { id: "a3", name: "Weekend reach push", rule: "Posts published Sat–Sun, boosted for 48 hours", on: false, boosted: 11, spend: "$430", reach: "61K", icon: "weekend" },
];

function BoostTop({ crumbs, children }) {
  return (
    <header className="ads-top">
      {crumbs.length > 1 && <button className="ads-back" type="button" onClick={crumbs[0].onClick}><span className="material-symbols-outlined">arrow_back</span>Back</button>}
      {crumbs.length === 1
        ? <h1>{crumbs[0].label}</h1>
        : <div className="ads-crumb">{crumbs.map((c, i) => <React.Fragment key={i}>{i > 0 && <span className="material-symbols-outlined">chevron_right</span>}{i === crumbs.length - 1 ? <b>{c.label}</b> : <a href="#" onClick={e => { e.preventDefault(); c.onClick && c.onClick(); }} style={{ color: "inherit" }}>{c.label}</a>}</React.Fragment>)}</div>}
      <span className="ads-spacer"></span>
      {children}
      <button className="ads-ws" type="button"><span className="av">SOMOS</span>Somos<span className="material-symbols-outlined">expand_more</span></button>
    </header>
  );
}

// ── Drawer (lives within Ads family) ────────────────────────────────────
function BoostDrawer() {
  return (
    <aside className="suite-drawer" aria-label="Ads navigation">
      <div className="sd-head">Ads</div>
      <div className="sd-body">
        <a className="sd-item" href="ads.html"><span className="material-symbols-outlined">ad_group</span>Campaigns</a>
        <a className="sd-item on" href="boost.html"><span className="material-symbols-outlined">rocket_launch</span>Boost</a>
        <a className="sd-item" href="#"><span className="material-symbols-outlined">groups</span>Audiences</a>
        <a className="sd-item" href="#"><span className="material-symbols-outlined">bar_chart</span>Reporting</a>
      </div>
    </aside>
  );
}

// ── 1 · AUTOMATIONS LIST (main) ─────────────────────────────────────────
function Automations({ onCreate, onOpen }) {
  return (
    <div className="ads-main">
      <BoostTop crumbs={[{ label: "Boost" }]}>
        <button className="hs-btn hs-btn--primary" type="button" onClick={onCreate}><span className="material-symbols-outlined">add</span>Create automation</button>
      </BoostTop>
      <div className="ads-body">
        <div className="bo-note"><span className="material-symbols-outlined">bolt</span>Automated boosts run in the background — they promote your best organic posts automatically. You can also boost a single post from Create or Ads.</div>
        <div className="ad-kpis">
          <div className="ad-kpi"><div className="lbl">Active automations</div><div className="val ad-num">2</div></div>
          <div className="ad-kpi"><div className="lbl">Posts boosted · 30d</div><div className="val ad-num">35</div></div>
          <div className="ad-kpi"><div className="lbl">Spend · 30d</div><div className="val ad-num">$2,350</div></div>
          <div className="ad-kpi"><div className="lbl">Added reach</div><div className="val ad-num">441K</div><div className="ad-delta up"><span className="material-symbols-outlined">trending_up</span>22%</div></div>
        </div>
        <div className="pp-panel" style={{ padding: 0 }}>
          <div className="pp-toolbar" style={{ padding: "16px 20px", margin: 0, borderBottom: "1px solid var(--bento-theme-color-border-subtle)" }}><h2 style={{ fontSize: 18, margin: 0, fontWeight: 700 }}>Your automations</h2></div>
          {AUTOMATIONS.map(a => (
            <div className="bo-auto" key={a.id} style={{ cursor: "pointer" }} onClick={() => onOpen(a)}>
              <span className="bo-ic"><span className="material-symbols-outlined">{a.icon}</span></span>
              <div className="bo-body"><div className="bo-name">{a.name}</div><div className="bo-rule">{a.rule}</div></div>
              <div className="bo-metrics">
                <div className="bo-metric"><div className="v">{a.boosted}</div><div className="k">Boosted</div></div>
                <div className="bo-metric"><div className="v">{a.reach}</div><div className="k">Reach</div></div>
              </div>
              <span className={"ad-switch" + (a.on ? "" : " off")} role="switch" aria-checked={a.on} aria-label={"Toggle " + a.name} onClick={e => e.stopPropagation()}><span className="knob"></span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 2 · AUTOMATION DETAIL ───────────────────────────────────────────────
function AutomationDetail({ automation, onBack }) {
  const a = automation;
  return (
    <div className="ads-main">
      <BoostTop crumbs={[{ label: "Boost", onClick: onBack }, { label: a.name }]}>
        <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">edit</span>Edit rule</button>
        <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">pause</span>Pause</button>
      </BoostTop>
      <div className="ads-body">
        <div className="bo-note"><span className="material-symbols-outlined">bolt</span>{a.rule}</div>
        <div className="ad-kpis">
          <div className="ad-kpi"><div className="lbl">Posts boosted</div><div className="val ad-num">{a.boosted}</div></div>
          <div className="ad-kpi"><div className="lbl">Spend</div><div className="val ad-num">{a.spend}</div></div>
          <div className="ad-kpi"><div className="lbl">Added reach</div><div className="val ad-num">{a.reach}</div></div>
          <div className="ad-kpi"><div className="lbl">Status</div><div className="val" style={{ fontSize: 20 }}><span className={"ad-pill " + (a.on ? "active" : "paused")}><span className="material-symbols-outlined">{a.on ? "check_circle" : "pause_circle"}</span>{a.on ? "Active" : "Paused"}</span></div></div>
        </div>
        <div className="pp-panel">
          <div className="pp-toolbar"><h2 style={{ fontSize: 18, margin: 0, fontWeight: 700 }}>Recently boosted by this rule</h2></div>
          <table className="pp-table">
            <thead><tr><th>Post</th><th className="ad-num">Spend</th><th className="ad-num">Added reach</th><th>Boosted</th><th>Status</th></tr></thead>
            <tbody>
              {[["Behind the scenes at our cleanup 🌍","ig","$120","18,400","3 days ago","active"],["Spring Sale starts now — up to 40% off","fb","$250","42,900","6 days ago","ended"],["Plan your next purchase with the app","ig","$80","9,120","2 weeks ago","ended"]].map((r,i)=>(
                <tr key={i}>
                  <td><span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><PerchNet k={r[1]} /><span className="ad-name">{r[0]}</span></span></td>
                  <td className="ad-num">{r[2]}</td><td className="ad-num">{r[3]}</td><td>{r[4]}</td>
                  <td><span className={"ad-pill " + (r[5] === "active" ? "active" : "ended")}><span className="material-symbols-outlined">{r[5] === "active" ? "check_circle" : "stop_circle"}</span>{r[5] === "active" ? "Active" : "Ended"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 3 · CREATE-AUTOMATED-BOOST FLOW ─────────────────────────────────────
const TRIGGERS = [
  ["top", "trending_up", "Top performers", "Boost posts that beat their recent average engagement."],
  ["tag", "sell", "Posts with a tag", "Automatically boost every post with a chosen tag."],
  ["profile", "account_circle", "All posts to a profile", "Boost everything published to selected accounts."],
  ["schedule", "schedule", "Time-based", "Boost posts published in a chosen window."],
];
const BSTEPS = [
  ["Trigger", "When should a post get boosted?"],
  ["Audience & budget", "Who to reach and the spend per boost"],
  ["Schedule & goal", "How long each boost runs"],
  ["Review", "Check the rule, then turn it on"],
];
// Board "create automated boost" (Perch 1530:164851 → local-comp-ads/creation/
// flow-boost): a CENTERED single-column flow — comp-header, a ~637px form
// (Trigger card → Include keywords → Boost by tags → Boost duration), and a
// right-aligned footer. Not a left-rail stepper.
function BoostWizard({ onCancel, onLaunch }) {
  return (
    <div className="ads-main">
      <div className="bo-flowhead">
        <button className="ads-back" type="button" onClick={onCancel}><span className="material-symbols-outlined">arrow_back</span>Back</button>
        <h1>Create automated boost</h1>
      </div>
      <div className="bo-flowscroll">
        <div className="bo-flow">
          <div className="bo-fld">
            <label>Trigger</label>
            <div className="bo-trigcard on">
              <span className="bo-trigradio" aria-hidden="true"></span>
              <span className="bo-trigtx"><span className="t">Boost post</span><span className="d">A post that has hit a specific threshold will get boosted.</span></span>
            </div>
            <button className="bo-addtrig" type="button"><span className="material-symbols-outlined">add</span>Add another trigger</button>
          </div>

          <div className="bo-fld">
            <label>Threshold</label>
            <p className="bo-hint">Boost when a post beats its 30-day average engagement by:</p>
            <div className="bo-inline"><input className="hs-input" defaultValue="50" style={{ width: 90 }} /><span className="bo-pct">%</span></div>
          </div>

          <div className="bo-fld">
            <label>Include keywords <span className="bo-opt">(optional)</span></label>
            <input className="hs-input" placeholder="Add a keyword" />
          </div>

          <div className="bo-fld">
            <label>Boost by tags <span className="bo-opt">(optional)</span></label>
            <input className="hs-input" placeholder="Add a tag" />
          </div>

          <div className="bo-fld">
            <label>Boost duration</label>
            <div className="an-select" style={{ position: "relative", maxWidth: 220 }}>
              <select className="hs-input" style={{ appearance: "none" }}><option>3 days</option><option>5 days</option><option>7 days</option></select>
              <span className="material-symbols-outlined" style={{ position: "absolute", right: 12, top: 11, pointerEvents: "none", color: "var(--bento-theme-color-text-subtle)" }}>expand_more</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bo-flowfoot">
        <button className="hs-btn hs-btn--ghost" type="button" onClick={onCancel}>Cancel</button>
        <button className="hs-btn hs-btn--primary" type="button" onClick={onLaunch}>Create</button>
      </div>
    </div>
  );
}

// ── States ──────────────────────────────────────────────────────────────
function BoostEmpty({ onCreate }) {
  return (
    <div className="ads-main"><BoostTop crumbs={[{ label: "Boost" }]} /><div className="suite-state empty"><div className="suite-state-inner">
      <div className="ico"><span className="material-symbols-outlined">bolt</span></div>
      <h2>Put your best posts to work</h2>
      <p>Set up an automation and Hootsuite will boost your top-performing organic posts for you — no manual ad buying. You can also boost a single post from Create.</p>
      <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">school</span>How it works</button><button className="hs-btn hs-btn--primary" type="button" onClick={onCreate}><span className="material-symbols-outlined">add</span>Create automation</button></div>
    </div></div></div>
  );
}
function BoostErrorState({ onRetry }) {
  return (
    <div className="ads-main"><BoostTop crumbs={[{ label: "Boost" }]} /><div className="suite-state error"><div className="suite-state-inner">
      <div className="ico"><span className="material-symbols-outlined">cloud_off</span></div>
      <h2>We couldn't load your automations</h2>
      <p>Your boost rules are still running — we just couldn't show them. This is usually a brief connection issue.</p>
      <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">help</span>View status</button><button className="hs-btn hs-btn--primary" type="button" onClick={onRetry}><span className="material-symbols-outlined">refresh</span>Try again</button></div>
    </div></div></div>
  );
}
function BoostLoading() {
  return (
    <div className="ads-main" aria-busy="true"><BoostTop crumbs={[{ label: "Boost" }]} /><div className="ads-body">
      <div className="ad-kpis">{[0,1,2,3].map(i => <div className="ad-kpi" key={i}><div className="suite-sk" style={{ width: "50%", height: 12 }}></div><div className="suite-sk" style={{ width: "60%", height: 30, marginTop: 10 }}></div></div>)}</div>
      <div className="pp-panel"><div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 18 }}>{[0,1,2].map(i => <div key={i} style={{ display: "flex", gap: 14, alignItems: "center" }}><div className="suite-sk" style={{ width: 44, height: 44, borderRadius: 12 }}></div><div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}><div className="suite-sk" style={{ width: "40%", height: 14 }}></div><div className="suite-sk" style={{ width: "70%", height: 12 }}></div></div><div className="suite-sk" style={{ width: 36, height: 20, borderRadius: 999 }}></div></div>)}</div></div>
    </div></div>
  );
}

// ── App ─────────────────────────────────────────────────────────────────
function App() {
  const [surface, setSurface] = React.useState("main");
  const [automation, setAutomation] = React.useState(AUTOMATIONS[0]);
  return (
    <div className="suite-app">
      <SuiteRail active="perch" />
      <PerchDrawer active="boost" />
      {surface === "main" && <Automations onCreate={() => setSurface("create")} onOpen={a => { setAutomation(a); setSurface("detail"); }} />}
      {surface === "create" && <BoostWizard onCancel={() => setSurface("main")} onLaunch={() => setSurface("main")} />}
      {surface === "detail" && <AutomationDetail automation={automation} onBack={() => setSurface("main")} />}
      {surface === "empty" && <BoostEmpty onCreate={() => setSurface("create")} />}
      {surface === "error" && <BoostErrorState onRetry={() => setSurface("loading")} />}
      {surface === "loading" && <BoostLoading />}
      <SuiteStates
        states={[["main", "Automations"], ["create", "Create flow"], ["detail", "Detail"], ["empty", "Empty"], ["error", "Error"], ["loading", "Loading"]]}
        value={surface} onChange={setSurface}
      />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
