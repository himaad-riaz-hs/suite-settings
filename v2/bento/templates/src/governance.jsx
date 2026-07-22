// governance.jsx — Vigil (Governance) template entry. Board-faithful drawer
// (Hootsuite/Vigil header, org select, Workspace/Configuration/Compliance groups
// with counts, weekly-digest card, "Org 1295809" footer). Default view = Policies
// (real screen, node 8160:66109). No-red. Loaded AFTER vigil-screens.jsx.

function GvDrawer({ active, onNav }) {
  const item = (k, ic, lb, badge) => <a key={k} href="#" className={"sd-item" + (k === active ? " on" : "")} onClick={e => { e.preventDefault(); onNav && onNav(k); }}><span className="material-symbols-outlined">{ic}</span><span className="sd-lbl">{lb}</span>{badge != null && <span className="sd-badge">{badge}</span>}</a>;
  return (
    <aside className="suite-drawer vg-drawer" aria-label="Vigil navigation">
      <div className="vg-brand"><span className="eyebrow">Hootsuite</span><span className="name"><span className="material-symbols-outlined">verified_user</span>Vigil</span><span className="tag">Compliance &amp; governance</span></div>
      <div className="vg-orgsel"><span className="l">Organization</span><button className="sel" type="button">Somos Financial<span className="material-symbols-outlined">expand_more</span></button></div>
      <div className="sd-body">
        {item("overview", "home", "Home")}
        <div className="sd-group">Workspace</div>
        {item("policies", "verified_user", "Policies", "8")}
        {item("audit", "subject", "Audit log", "40")}
        {item("reports", "bar_chart", "Reports")}
        <div className="sd-group">Configuration</div>
        {item("engine", "settings", "Engine")}
        {item("networks", "hub", "Networks", "229")}
        {item("members", "group", "Members & access")}
        {item("notifications", "notifications", "Notifications")}
        {item("retention", "autorenew", "Retention")}
        <div className="sd-group">Compliance and trust</div>
        {item("trust", "handshake", "Trust center")}
      </div>
      <div className="vg-digest">
        <div className="vg-digest-card">
          <div className="t">Weekly compliance digest</div>
          <div className="d">Export audit trails and severity rollups from Reports when your review window closes.</div>
          <button className="hs-btn hs-btn--primary hs-btn--sm" type="button" onClick={() => onNav && onNav("reports")}>Open reports</button>
        </div>
        <div className="vg-orgfoot">Org 1295809</div>
      </div>
    </aside>
  );
}

function App() {
  const [surface, setSurface] = React.useState("policies");
  const SCREENS = {
    overview: window.VgHome, policies: window.VgPolicies, reports: window.VgReports,
    engine: window.VgEngine, networks: window.VgNetworks, members: window.VgMembers,
    notifications: window.VgNotifications, retention: window.VgRetention, trust: window.VgTrust,
    audit: window.VgAudit,
  };
  const Screen = SCREENS[surface] || window.VgPolicies;
  return (
    <div className="suite-app">
      <SuiteRail active="vigil" />
      <GvDrawer active={surface} onNav={setSurface} />
      <Screen />
      <SuiteStates
        states={[["policies", "Policies"], ["overview", "Home"], ["audit", "Audit log"], ["reports", "Reports"], ["engine", "Engine"], ["networks", "Networks"], ["members", "Members"], ["notifications", "Notifs"], ["retention", "Retention"], ["trust", "Trust"]]}
        value={surface} onChange={setSurface}
      />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
