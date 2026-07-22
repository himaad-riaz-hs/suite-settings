// settings-gov.jsx — Governance panes (Enterprise-gated). Registers into window.SETTINGS_PANES.
const { SaveFoot } = window;

/* visible-but-locked pane: explains the feature, no functional controls */
function GovLocked({ icon, title, what }) {
  return (
    <div className="set-body">
      <div className="set-locked">
        <div className="ico"><span className="material-symbols-outlined">{icon}</span></div>
        <h2>{title}</h2>
        <p>{what}</p>
        <span className="set-entitle"><span className="material-symbols-outlined">lock</span>Available on Enterprise · requires entitlement</span>
      </div>
    </div>
  );
}

function GovSsoPane() {
  return <GovLocked icon="vpn_key" title="SSO & MFA"
    what="Enforce single sign-on through your identity provider and require multi-factor authentication for everyone in your organisation. Configure SAML, SCIM provisioning, and session policy." />;
}
function GovAuditPane() {
  return <GovLocked icon="history" title="Audit logs"
    what="A searchable, exportable record of who did what and when across your organisation — sign-ins, permission changes, publishing, and account connections — for security review and compliance." />;
}
function GovProfilesPane() {
  return <GovLocked icon="verified_user" title="Security Profiles"
    what="Apply reusable security policies — password rules, session length, IP allowlists, and approval requirements — to groups of members in one place." />;
}

/* Data Export — exists today, functional, but gated with an entitlement note. */
const EXPORTS = [
  ["Analytics report", "CSV", "12 Jun 2026", "ok"],
  ["Member list", "CSV", "2 Jun 2026", "ok"],
  ["Audit log (last 90 days)", "JSON", "28 May 2026", "ok"],
];
function GovDataExportPane() {
  return (
    <div className="set-body">
      <div className="set-gate"><span className="material-symbols-outlined">lock</span>
        <span>Data Export is available on Enterprise and requires the data-export entitlement. Controls below are shown for your plan.</span></div>
      <div className="set-panel" style={{ maxWidth: 860 }}>
        <div className="set-panel-head"><div className="grow"><div className="set-panel-title">Request an export</div><div className="set-panel-sub">Generate a downloadable file of your organisation's data.</div></div></div>
        <div style={{ padding: "var(--bento-space-05)", display: "flex", flexDirection: "column", gap: "var(--bento-space-04)" }}>
          <div className="set-field-row">
            <div className="set-field"><label htmlFor="ex-data">Data type</label>
              <select id="ex-data" className="set-input"><option>Analytics report</option><option>Member list</option><option>Social accounts</option><option>Audit log</option></select>
            </div>
            <div className="set-field"><label htmlFor="ex-range">Date range</label>
              <select id="ex-range" className="set-input"><option>Last 30 days</option><option>Last 90 days</option><option>Last 12 months</option><option>All time</option></select>
            </div>
          </div>
          <div className="set-field" style={{ maxWidth: 280 }}><label htmlFor="ex-fmt">Format</label>
            <select id="ex-fmt" className="set-input"><option>CSV</option><option>JSON</option><option>PDF</option></select>
          </div>
          <div><button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">download</span>Request export</button></div>
        </div>
      </div>
      <div className="set-panel" style={{ maxWidth: 860 }}>
        <div className="set-panel-head"><div className="grow"><div className="set-panel-title">Recent exports</div><div className="set-panel-sub">Files are available to download for 7 days.</div></div></div>
        <table className="set-table">
          <thead><tr><th>Export</th><th>Format</th><th>Requested</th><th className="right">Download</th></tr></thead>
          <tbody>
            {EXPORTS.map((r, i) => (
              <tr key={i}>
                <td><span className="nm" style={{ fontWeight: 600 }}>{r[0]}</span></td>
                <td style={{ color: "var(--bento-theme-color-text-subtle)" }}>{r[1]}</td>
                <td style={{ color: "var(--bento-theme-color-text-subtle)" }}>{r[2]}</td>
                <td className="right"><button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label={"Download " + r[0]} title="Download"><span className="material-symbols-outlined">download</span></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window.SETTINGS_PANES, {
  "gov-sso": GovSsoPane,
  "gov-audit": GovAuditPane,
  "gov-profiles": GovProfilesPane,
  "gov-export": GovDataExportPane,
});
