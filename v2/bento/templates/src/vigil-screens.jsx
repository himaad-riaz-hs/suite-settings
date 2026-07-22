// vigil-screens.jsx — Vigil (Governance) compliance surfaces.
// Policies screen is board-faithful to node 8160:66109 (the .fig stores it as a
// flattened screenshot capture; rebuilt here as live Bento from that render).
// Severity badges use our no-red ladder (CRITICAL = strong amber, HIGH = amber,
// MEDIUM = neutral) — paired with the text label so colour never carries alone.
// Other Vigil sub-screens stay honest in-progress placeholders until the board
// ships them as real (non-screenshot) frames. Loaded AFTER perch-common.

function VgHeader({ title, sub, children }) {
  return (
    <header className="vg-header">
      <div className="vg-htext"><h1>{title}</h1>{sub && <div className="vg-sub">{sub}</div>}</div>
      <span className="vg-spacer"></span>
      <div className="vg-hactions">{children}</div>
    </header>
  );
}

const VG_POLICIES = [
  ["Profanity", "Compliance", "Keyword (4)", "high", "47", "May 17, 2026, 5:14 AM", "Maria R."],
  ["Hate Speech & Discriminatory Language", "Compliance", "Natural language", "critical", "12", "May 15, 2026, 7:30 AM", "Maria R."],
  ["Promissory & Guaranteed Returns", "Compliance", "Natural language · Keyword", "critical", "156", "May 10, 2026, 10:00 AM", "Maria R."],
  ["Past Performance Framing", "Legal", "Natural language", "high", "89", "May 8, 2026, 5:00 AM", "James T."],
  ["Comparative & Superlative Claims", "Legal", "Keyword · Natural language", "high", "34", "May 5, 2026, 12:45 PM", "James T."],
  ["FINRA Retail Disclaimer", "Compliance", "Natural language", "high", "28", "Apr 28, 2026, 6:30 AM", "Maria R."],
  ["Brand & Trademark Check", "Brand", "Keyword (2)", "medium", "19", "Apr 20, 2026, 9:00 AM", "Alex P."],
  ["PII & Sensitive Data Exposure", "Security", "Natural language (2)", "critical", "7", "Apr 15, 2026, 4:00 AM", "Maria R."],
];
const SEV = { critical: ["vg-sev critical", "CRITICAL"], high: ["vg-sev high", "HIGH"], medium: ["vg-sev medium", "MEDIUM"] };
const POLICY_PILLS = ["All", "Active", "Draft", "Natural language", "Keyword", "Regex", "Disclaimer", "Link rule"];
const POLICY_TAGS = ["All", "advertising", "brand", "compliance", "data-protection", "disclosure", "discrimination", "financial", "finra", "hate-speech", "language", "legal", "pii", "retail", "safety", "security", "trademark"];

function VgPolicies() {
  const [pill, setPill] = React.useState("All");
  const [tag, setTag] = React.useState("All");
  return (
    <div className="gv-main">
      <VgHeader title="Policies" sub="8 policies · 8 active · 0 draft · evaluating 229 social profiles">
        <button className="hs-btn hs-btn--ghost" type="button"><span className="material-symbols-outlined">upload_file</span>Import CSV</button>
        <button className="hs-btn hs-btn--ghost" type="button"><span className="material-symbols-outlined">dashboard_customize</span>Templates</button>
        <button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">add</span>New policy</button>
      </VgHeader>
      <div className="gv-body">
        <div className="vg-toolbar">
          <div className="vg-search"><span className="material-symbols-outlined">search</span><input placeholder="Search policies…" /></div>
          <div className="vg-pills">{POLICY_PILLS.map(p => <button key={p} type="button" className={"cf" + (pill === p ? " selected" : "")} onClick={() => setPill(p)}>{p}</button>)}</div>
        </div>
        <div className="vg-tags"><span className="vg-tags-label">Tags</span>{POLICY_TAGS.map(t => <button key={t} type="button" className={"cf cf--sm" + (tag === t ? " selected" : "")} onClick={() => setTag(t)}>{t}</button>)}</div>
        <div className="vg-tablewrap">
          <table className="vg-table">
            <thead><tr><th>Policy</th><th>Level</th><th>Team</th><th>Type</th><th>Severity</th><th className="num">Matches · 7d</th><th>Status</th><th>Modified</th></tr></thead>
            <tbody>
              {VG_POLICIES.map((r, i) => {
                const [cls, lb] = SEV[r[3]];
                return (
                  <tr key={i}>
                    <td className="vg-pname">{r[0]}</td>
                    <td><span className="vg-lvl">Org</span></td>
                    <td>{r[1]}</td>
                    <td className="vg-type">{r[2]}</td>
                    <td><span className={cls}>{lb}</span></td>
                    <td className="num">{r[4]}</td>
                    <td><span className="hs-badge hs-badge--positive" style={{ height: 24 }}>Active</span></td>
                    <td className="vg-mod">{r[5]} · {r[6]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="vg-tablefoot"><span>Showing 8 of 8</span><span className="vg-pager"><button className="vg-pg" type="button" aria-label="Previous">‹</button><button className="vg-pg on" type="button">1</button><button className="vg-pg" type="button" aria-label="Next">›</button></span><button className="vg-perpage" type="button">50 / page<span className="material-symbols-outlined">expand_more</span></button></div>
        </div>
      </div>
    </div>
  );
}

function VgInProgress({ title, sub, icon }) {
  return (
    <div className="gv-main">
      <VgHeader title={title} sub={sub} />
      <div className="gv-body">
        <div className="suite-state" style={{ minHeight: 420 }}>
          <div className="suite-state-inner">
            <div className="ico"><span className="material-symbols-outlined">{icon || "draft"}</span></div>
            <h2>{title} — in design</h2>
            <p>This Vigil surface is still being designed in Figma (the board currently holds screenshot explorations, not final frames). It's intentionally left as a placeholder rather than filled with invented data.</p>
            <div className="acts"><span className="hs-badge hs-badge--neutral" style={{ height: 28 }}><span className="material-symbols-outlined">schedule</span>In progress</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const VG_RECENT = [
  ["10:32", "BLOCK", "critical", "Carter D.", "\u201cNew high-yield account — guaranteed 8% returns for our valued advisors. Apply now before rates change\u2026\u201d", "Promissory & Guaranteed Returns"],
  ["09:58", "WARN", "high", "Priya R.", "\u201cExcited to share — we beat the market again this quarter, up 14% YTD. Our track record speaks for itself.\u201d", "Past Performance Framing"],
  ["09:14", "BLOCK", "critical", "Marcus L.", "\u201cBig news for our advisors: forecasted gains in Q3 should easily clear 10% — don\u2019t miss the window\u2026\u201d", "Promissory & Guaranteed Returns"],
  ["08:42", "HOLD", "medium", "Amelia C.", "\u201cOur advisors would love to help with your retirement strategy — book a free call today.\u201d", "FINRA Retail Disclaimer"],
  ["07:30", "BLOCK", "high", "Tom\u00e1s G.", "\u201cWe offer the best APR in the industry — guaranteed. Get pre-approved with zero obligation today.\u201d", "Comparative & Superlative Claims"],
  ["06:18", "WARN", "medium", "Sara O.", "\u201cThrilled to welcome our newest StateFarm\u00ae partner advisors to the team — big quarter ahead!\u201d", "Brand & Trademark Check"],
];
const VG_DEC = { BLOCK: "vh-dec block", WARN: "vh-dec warn", HOLD: "vh-dec hold" };
function VgHome() {
  return (
    <div className="gv-main">
      <div className="vh-banner">
        <span className="material-symbols-outlined">visibility</span>
        <div><strong>Sample compliance workspace</strong><span>You're exploring what Vigil looks like for a fully configured org. None of this data is yours; save and delete actions are disabled.</span></div>
        <button className="hs-btn hs-btn--outlined hs-btn--sm" type="button">Set up your org<span className="material-symbols-outlined">arrow_forward</span></button>
      </div>
      <div className="gv-body vh-body">
        <div className="vh-kpis">
          <div className="vh-kpi"><div className="l">Posts evaluated (7d)</div><div className="v dash">—</div><div className="s">across 229 networks</div></div>
          <div className="vh-kpi"><div className="l">Posts blocked</div><div className="v dash">—</div><div className="s">no data yet</div></div>
          <div className="vh-kpi"><div className="l">Active policies</div><div className="v">8</div><div className="s">0 in draft</div></div>
          <div className="vh-kpi"><div className="l">Compliance score</div><div className="v"><span className="vh-ring"></span></div><div className="s">no data yet</div></div>
        </div>
        <div className="vh-cols">
          <div className="vh-panel">
            <div className="vh-panel-h"><span className="t">Evaluations · last 14 days</span><div className="vh-legend"><span className="pass">Pass</span><span className="warn">Warn</span><span className="block">Block</span></div></div>
            <div className="vh-eval-empty">
              <div className="h">No evaluations yet</div>
              <div className="d">Vigil starts evaluating posts as soon as you connect a social profile and activate a policy.</div>
              <ul className="vh-check">
                <li><span className="material-symbols-outlined">check_box</span>Connect a social profile</li>
                <li><span className="material-symbols-outlined">check_box</span>Create at least one policy</li>
                <li><span className="material-symbols-outlined">check_box</span>Publish a post to see your first evaluation</li>
              </ul>
              <div className="vh-eval-acts"><button className="hs-btn hs-btn--primary" type="button">Manage policies</button><button className="hs-btn hs-btn--secondary" type="button">Live demo</button></div>
            </div>
            <div className="vh-topmatched"><div className="lbl">Top matched policies (7d)</div><div className="empty">No matched policies in the last 7 days.</div></div>
          </div>
          <div className="vh-panel vh-decisions">
            <div className="vh-panel-h"><span className="t">Recent decisions</span><a className="vh-link" href="#">View audit log →</a></div>
            <div className="vh-declist">
              {VG_RECENT.map((r, i) => (
                <div className="vh-decrow" key={i}>
                  <span className="time">{r[0]}</span>
                  <div className="body">
                    <div className="meta"><span className={VG_DEC[r[1]]}>{r[1]}</span><span className={"vh-sevdot " + r[2]}></span><span className="sev">{r[2].charAt(0).toUpperCase() + r[2].slice(1)}</span><span className="who">· {r[3]}</span></div>
                    <div className="quote">{r[4]}</div>
                    <a className="policy" href="#">{r[5]}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="vh-cols">
          <div className="vh-panel">
            <div className="vh-panel-h"><span className="t">Quick actions</span></div>
            <button className="vh-action" type="button"><span className="ic"><span className="material-symbols-outlined">verified_user</span></span><div><div className="t">New policy</div><div className="d">Start from a Hootsuite template</div></div><span className="material-symbols-outlined chev">chevron_right</span></button>
            <button className="vh-action" type="button"><span className="ic"><span className="material-symbols-outlined">description</span></span><div><div className="t">Import CSV</div><div className="d">Bulk import blocked terms from a spreadsheet</div></div><span className="material-symbols-outlined chev">chevron_right</span></button>
          </div>
          <div className="vh-panel">
            <div className="vh-panel-h"><span className="t">Coverage</span><a className="vh-link" href="#">All active profiles →</a></div>
            <div className="vh-coverage">
              <div className="vh-cov-ring">229/229<span>social profiles</span></div>
              <div className="vh-cov-stats"><div><div className="v">229</div><div className="l">profiles connected</div></div><div><div className="v">8</div><div className="l">active policies</div></div><div><div className="v">7 years</div><div className="l">data retention</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const VgReports       = () => <VgInProgress title="Reports" icon="bar_chart" />;
const VgEngine        = () => <VgInProgress title="Engine" icon="settings" />;
const VgNetworks      = () => <VgInProgress title="Networks" icon="hub" />;
const VgMembers       = () => <VgInProgress title="Members & access" icon="group" />;
const VgNotifications = () => <VgInProgress title="Notifications" icon="notifications" />;
const VgRetention     = () => <VgInProgress title="Retention" icon="autorenew" />;
const VgTrust         = () => <VgInProgress title="Trust center" icon="handshake" />;
// Audit log intentionally left as an in-progress placeholder: the board only
// holds screenshot captures of it, not a real designed frame, so we don't
// invent it. (Reverted per direction — Policies is the shipped Vigil screen.)
const VgAudit = () => <VgInProgress title="Audit log" icon="subject" />;

if (typeof window !== "undefined") {
  Object.assign(window, { VgPolicies, VgHome, VgReports, VgEngine, VgNetworks, VgMembers, VgNotifications, VgRetention, VgTrust, VgAudit });
}
