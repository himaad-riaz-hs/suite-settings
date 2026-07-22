// snav-pages.jsx — page behavior behind the nav (shared across Option A/B).
// Reuses real Bento: .hs-table, .hs-toggle, .hs-badge, .hs-alert, .hs-btn,
// .hs-input, .hs-select. Pages are identical regardless of nav option (step 5).
// Toggles autosave with an undo toast — never a manual Save button (step 4).
const ORG = { name: "Somos Media", plan: "Enterprise", members: 8, created: "Mar 2023" };

/* ── Shared building blocks ───────────────────────────────────────────── */
function PageHeader({ title, sub, action }) {
  // Title + description now live in the shared white header band (topbar); the page
  // body carries only the primary action (right-aligned), or nothing.
  return action ? <div className="snav-phead">{action}</div> : null;
}
function Card({ title, desc, children, foot }) {
  return (
    <section className="snav-card">
      {(title || desc) && <header className="snav-card-h"><div className="grow"><h2>{title}</h2>{desc && <p>{desc}</p>}</div></header>}
      <div className="snav-card-body">{children}</div>
      {foot && <footer className="snav-card-foot">{foot}</footer>}
    </section>
  );
}
function Row({ title, desc, children }) {
  return (
    <div className="snav-setrow">
      <div className="grow"><div className="t">{title}</div>{desc && <div className="d">{desc}</div>}</div>
      <div className="ctrl">{children}</div>
    </div>
  );
}
/* Autosave toggle — flips instantly, fires an undo toast (no Save button). */
function Toggle({ defaultOn, label }) {
  const [on, setOn] = React.useState(!!defaultOn);
  const flip = () => {
    const prev = on, next = !on; setOn(next);
    window.snavToast(`${label} turned ${next ? "on" : "off"}`, { icon: next ? "check_circle" : "do_not_disturb_on", undo: () => setOn(prev) });
  };
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={"hs-toggle" + (on ? " is-on" : "")} onClick={flip}></button>;
}
function Select({ value, options, label }) {
  const [v, setV] = React.useState(value);
  return (
    <span className="hs-select snav-inlineselect">
      <select aria-label={label} value={v} onChange={e => { setV(e.target.value); window.snavToast(`${label} set to ${e.target.value}`, { icon: "check_circle" }); }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <span className="material-symbols-outlined chev">keyboard_arrow_down</span>
    </span>
  );
}

/* ── Profile (Preferences merged in as a bottom section — step 1) ──────── */
function ProfilePage() {
  return (
    <div className="snav-pagewrap">
      <PageHeader title="Profile" sub="Your personal account details and preferences." />
      <Card title="Your details">
        <div className="snav-formgrid">
          <div className="snav-field"><label htmlFor="pf-name">Full name</label><input id="pf-name" className="hs-input" defaultValue="Ryan Williams" /></div>
          <div className="snav-field"><label htmlFor="pf-email">Email</label><input id="pf-email" className="hs-input" defaultValue="ryan@somos.com" /></div>
          <div className="snav-field"><label htmlFor="pf-title">Job title</label><input id="pf-title" className="hs-input" defaultValue="Social media manager" /></div>
          <div className="snav-field"><label htmlFor="pf-phone">Phone</label><input id="pf-phone" className="hs-input" defaultValue="+1 (604) 555-0148" /></div>
        </div>
      </Card>
      {/* MERGED: the old Preferences page (time zone, language) now lives here. */}
      <Card title="Preferences" desc="Formerly a separate page — folded into Profile.">
        <Row title="Time zone" desc="Used for scheduling and reports."><Select label="Time zone" value="(GMT-08:00) Pacific Time" options={["(GMT-08:00) Pacific Time", "(GMT-05:00) Eastern Time", "(GMT+00:00) UTC", "(GMT+01:00) Central European"]} /></Row>
        <Row title="Language" desc="Language for the Hootsuite interface."><Select label="Language" value="English (US)" options={["English (US)", "English (UK)", "Français", "Español", "Deutsch"]} /></Row>
      </Card>
    </div>
  );
}

/* ── Notifications (sticky TOC + autosave toggles — step 4) ────────────── */
const NOTIF_SECTIONS = [
  { id: "nt-activity", label: "Account activity", rows: [
    { t: "Sign-ins from new devices", d: "Email me when a new device signs in.", on: true },
    { t: "Password & security changes", d: "Alert me to changes on my account.", on: true },
  ]},
  { id: "nt-publishing", label: "Posts & publishing", rows: [
    { t: "Post published", d: "Confirm when a scheduled post goes out.", on: false },
    { t: "Post failed", d: "Tell me immediately if a post fails.", on: true },
    { t: "Approvals needed", d: "Notify me when a post needs my approval.", on: true },
  ]},
  { id: "nt-messages", label: "Mentions & messages", rows: [
    { t: "New mentions", d: "When a connected profile is mentioned.", on: true },
    { t: "New direct messages", d: "Incoming DMs across networks.", on: false },
  ]},
  { id: "nt-team", label: "Team & members", rows: [
    { t: "Member joins", d: "When someone joins the organisation.", on: false },
    { t: "Role changes", d: "When a member’s role changes.", on: true },
  ]},
];
function NotificationsPage() {
  const [activeSec, setActiveSec] = React.useState(NOTIF_SECTIONS[0].id);
  const scroller = () => document.querySelector(".snav-content");
  const jump = id => {
    const c = scroller(), el = document.getElementById(id);
    if (c && el) { const top = el.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - 12; c.scrollTo({ top, behavior: "smooth" }); }
    setActiveSec(id);
  };
  React.useEffect(() => {
    const c = scroller(); if (!c) return;
    const onScroll = () => {
      let cur = NOTIF_SECTIONS[0].id;
      for (const s of NOTIF_SECTIONS) { const el = document.getElementById(s.id); if (el && el.getBoundingClientRect().top - c.getBoundingClientRect().top < 80) cur = s.id; }
      setActiveSec(cur);
    };
    c.addEventListener("scroll", onScroll); return () => c.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="snav-pagewrap">
      <PageHeader title="Notifications" sub="Choose what we tell you about. Changes save automatically." />
      <div className="snav-toc-layout">
        <nav className="snav-toc" aria-label="Sections">
          {NOTIF_SECTIONS.map(s => (
            <button key={s.id} type="button" className={"snav-toc-item" + (activeSec === s.id ? " on" : "")} aria-current={activeSec === s.id ? "true" : undefined} onClick={() => jump(s.id)}>{s.label}</button>
          ))}
        </nav>
        <div className="snav-toc-body">
          {NOTIF_SECTIONS.map(s => (
            <section id={s.id} key={s.id} className="snav-card" style={{ scrollMarginTop: 12 }}>
              <header className="snav-card-h"><div className="grow"><h2>{s.label}</h2></div></header>
              <div className="snav-card-body">
                {s.rows.map((r, i) => <Row key={i} title={r.t} desc={r.d}><Toggle defaultOn={r.on} label={r.t} /></Row>)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Overview (delete-org destructive flow, Paying member only) ────────── */
function OverviewPage({ role }) {
  const [confirm, setConfirm] = React.useState("");
  const canDelete = role === "Paying member";
  return (
    <div className="snav-pagewrap">
      <PageHeader title="Overview" sub="A summary of this organisation." />
      <Card title="Organisation">
        <Row title="Name"><span className="snav-val">{ORG.name}</span></Row>
        <Row title="Plan"><span className="hs-badge hs-badge--info">{ORG.plan}</span></Row>
        <Row title="Members"><span className="snav-val">{ORG.members}</span></Row>
        <Row title="Created"><span className="snav-val">{ORG.created}</span></Row>
      </Card>

      {/* Destructive pattern: amber warning, type-to-confirm, NO red button. */}
      {canDelete && (
        <section className="snav-card snav-danger">
          <header className="snav-card-h"><div className="grow"><h2>Delete organisation</h2><p>Permanently deletes {ORG.name}, its teams, members and connected accounts.</p></div></header>
          <div className="snav-card-body">
            <div className="hs-alert hs-alert--warning"><span className="material-symbols-outlined">warning</span>
              <div><b>This can’t be undone.</b> All teams, members, scheduled posts and connected social accounts will be removed for everyone.</div></div>
            <div className="snav-field" style={{ maxWidth: 420 }}>
              <label htmlFor="ov-confirm">Type <b>{ORG.name}</b> to confirm</label>
              <input id="ov-confirm" className="hs-input" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={ORG.name} autoComplete="off" />
            </div>
          </div>
          <footer className="snav-card-foot">
            <button className="hs-btn hs-btn--secondary snav-destruct" type="button" disabled={confirm.trim() !== ORG.name}
              onClick={() => { window.snavToast(`${ORG.name} scheduled for deletion`, { icon: "delete", undo: () => {} }); setConfirm(""); }}>
              <span className="material-symbols-outlined">delete</span>Delete organisation
            </button>
          </footer>
        </section>
      )}
      {!canDelete && (
        <div className="hs-alert"><span className="material-symbols-outlined">lock</span><div>Only the account owner (Paying member) can delete this organisation.</div></div>
      )}
    </div>
  );
}

/* ── Logs & exports (Audit log + Data exports merged, stacked — step 1) ── */
const AUDIT = [
  { who: "Priya Nair", act: "Changed role · Ava Chen → Admin", when: "Today, 09:14" },
  { who: "Ryan Williams", act: "Connected social account · @somos", when: "Yesterday, 16:40" },
  { who: "Lena Ortiz", act: "Removed member · Chris Vo", when: "Mon, 11:02" },
  { who: "System", act: "SSO sign-in enforced", when: "Mar 4, 08:00" },
];
function LogsExportsPage() {
  return (
    <div className="snav-pagewrap">
      <PageHeader title="Logs & exports" sub="Audit history and data exports for this organisation." />
      <Card title="Audit log" desc="Recent administrative activity." foot={<button className="hs-btn hs-btn--ghost hs-btn--sm" type="button"><span className="material-symbols-outlined">download</span>Export log</button>}>
        <table className="hs-table">
          <thead><tr><th>Person</th><th>Action</th><th>When</th></tr></thead>
          <tbody>{AUDIT.map((a, i) => <tr key={i}><td>{a.who}</td><td>{a.act}</td><td style={{ color: "var(--bento-theme-color-text-subtle)" }}>{a.when}</td></tr>)}</tbody>
        </table>
      </Card>
      <Card title="Data exports" desc="Request and download your organisation’s data.">
        <Row title="Members & roles (CSV)" desc="Everyone and their access."><button className="hs-btn hs-btn--secondary hs-btn--sm" type="button"><span className="material-symbols-outlined">download</span>Request export</button></Row>
        <Row title="Post history (CSV)" desc="All published posts and metrics."><button className="hs-btn hs-btn--secondary hs-btn--sm" type="button"><span className="material-symbols-outlined">download</span>Request export</button></Row>
        <Row title="Full account archive" desc="A complete copy, emailed when ready."><button className="hs-btn hs-btn--secondary hs-btn--sm" type="button"><span className="material-symbols-outlined">download</span>Request export</button></Row>
      </Card>
    </div>
  );
}

/* ── Lighter pages — real header + parity content, data-driven ─────────── */
const LIGHT = {
  "security": { sub: "Protect your account and control your data.", cards: [
    { title: "Sign-in", rows: [
      { kind: "toggle", t: "Two-factor authentication", d: "Require a code at sign-in.", on: true },
      { kind: "toggle", t: "Trusted devices only", d: "Block sign-ins from unknown devices.", on: false },
    ]},
    { title: "Privacy", rows: [
      { kind: "toggle", t: "Discoverable by email", d: "Let teammates find you by email.", on: true },
      { kind: "toggle", t: "Product usage analytics", d: "Share anonymous usage to improve Hootsuite.", on: true },
    ]},
  ]},
  "org-teams": { sub: "Groups that share social accounts and approvals.", action: { label: "New team", icon: "add", primary: true }, table: {
    head: ["Team", "Members", "Accounts"],
    rows: [["Brand studio", "6", "4"], ["Growth", "4", "3"], ["Customer care", "5", "2"], ["Regional — EMEA", "3", "5"]],
  }},
  "org-accounts": { sub: "Social profiles connected to this organisation.", action: { label: "Connect account", icon: "add", primary: true }, cards: [
    { title: "Connected accounts", rows: [
      { kind: "status", t: "@somos", d: "Instagram", badge: "Connected", net: 1 },
      { kind: "status", t: "Somos Media", d: "LinkedIn", badge: "Connected", net: 2 },
      { kind: "status", t: "@somos", d: "X", badge: "Connected", net: 3 },
      { kind: "status", t: "Somos", d: "Facebook", badge: "Needs reconnect", net: 4, warn: true },
    ]},
  ]},
  "org-roles": { sub: "Pre-defined and custom roles for this organisation.", action: { label: "Compare roles", icon: "table_view" }, cards: [
    { title: "Roles", rows: [
      { kind: "val", t: "Super admin", d: "Full control" , v: "2 people" },
      { kind: "val", t: "Admin", d: "Manage members, teams, accounts", v: "1 person" },
      { kind: "val", t: "Editor", d: "Publish & schedule", v: "4 people" },
      { kind: "val", t: "View only", d: "Read-only", v: "1 person" },
    ]},
  ]},
  "org-vanity": { sub: "Branded short links for this organisation.", action: { label: "Add vanity URL", icon: "add", primary: true }, cards: [
    { title: "Vanity URLs", rows: [
      { kind: "val", t: "soms.to", d: "Default", v: "1,204 links" },
      { kind: "val", t: "go.somos.com", d: "Campaigns", v: "318 links" },
    ]},
  ]},
  "org-billing": { sub: "Your plan, seats and invoices.", action: { label: "Manage plan", icon: "open_in_new" }, cards: [
    { title: "Current plan", rows: [
      { kind: "val", t: "Enterprise", d: "Billed annually", v: "Renews Mar 2027" },
      { kind: "val", t: "Seats", d: "Used of purchased", v: "8 of 25" },
    ]},
    { title: "Billing contact", rows: [{ kind: "val", t: "Ryan Williams", d: "ryan@somos.com", v: "Primary" }] },
  ]},
  "gov-sso": { sub: "Single sign-on and multi-factor enforcement.", cards: [
    { title: "Single sign-on", rows: [
      { kind: "status", t: "SAML SSO", d: "Okta", badge: "Connected" },
      { kind: "toggle", t: "Require SSO for all members", d: "Members must sign in through Okta.", on: true },
    ]},
    { title: "Multi-factor", rows: [{ kind: "toggle", t: "Enforce MFA org-wide", d: "Everyone must set up MFA.", on: false }] },
  ]},
  "gov-profiles": { sub: "Reusable security policy profiles.", action: { label: "New profile", icon: "add", primary: true }, cards: [
    { title: "Profiles", rows: [
      { kind: "val", t: "Standard staff", d: "Default policy", v: "6 members" },
      { kind: "val", t: "Elevated admin", d: "Stricter session limits", v: "2 members" },
    ]},
  ]},
  "int-mcp": { sub: "Model Context Protocol connectors for AI tools.", action: { label: "Add connector", icon: "add", primary: true }, cards: [
    { title: "Connectors", rows: [
      { kind: "status", t: "Claude", d: "Anthropic", badge: "Connected" },
      { kind: "status", t: "Internal analytics", d: "Custom MCP server", badge: "Connected" },
    ]},
  ]},
  "int-apps": { sub: "Connected apps and API access.", action: { label: "Create API key", icon: "add", primary: true }, cards: [
    { title: "API keys", rows: [
      { kind: "val", t: "Production key", d: "Created Jan 2026", v: "Last used 2h ago" },
      { kind: "status", t: "Zapier", d: "OAuth app", badge: "Connected" },
    ]},
  ]},
};
function LightRow({ r }) {
  if (r.kind === "toggle") return <Row title={r.t} desc={r.d}><Toggle defaultOn={r.on} label={r.t} /></Row>;
  if (r.kind === "status") return <Row title={r.t} desc={r.d}><span className={"hs-badge " + (r.warn ? "hs-badge--warning" : "hs-badge--positive")}><span className="material-symbols-outlined">{r.warn ? "error" : "check_circle"}</span>{r.badge}</span></Row>;
  return <Row title={r.t} desc={r.d}><span className="snav-val">{r.v}</span></Row>;
}
function LightPage({ id, title, onPick }) {
  const cfg = LIGHT[id] || { sub: "", cards: [] };
  const action = cfg.action ? (
    <button className={"hs-btn " + (cfg.action.primary ? "hs-btn--primary" : "hs-btn--secondary")} type="button" onClick={() => { if (id === "org-roles") onPick && onPick("org-roles"); }}>
      {cfg.action.icon && <span className="material-symbols-outlined">{cfg.action.icon}</span>}{cfg.action.label}
    </button>
  ) : null;
  return (
    <div className="snav-pagewrap">
      <PageHeader title={title} sub={cfg.sub} action={action} />
      {cfg.table && (
        <div className="snav-tablecard">
          <table className="hs-table">
            <thead><tr>{cfg.table.head.map((h, i) => <th key={i} className={i > 0 ? "right" : ""}>{h}</th>)}</tr></thead>
            <tbody>{cfg.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} data-label={cfg.table.head[j]} className={j > 0 ? "right" : ""}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
      {(cfg.cards || []).map((c, i) => (
        <Card key={i} title={c.title}>{c.rows.map((r, j) => <LightRow key={j} r={r} />)}</Card>
      ))}
    </div>
  );
}

/* ── Router ───────────────────────────────────────────────────────────── */
function PageRouter({ active, role, plan, onPick }) {
  const item = window.SNAV.ALL_ITEMS[active];
  const title = item ? item.label : "Settings";
  if (active === "org-members") { const M = window.MembersPage; return M ? <M role={role} plan={plan} /> : <div className="snav-pagewrap">Loading…</div>; }
  if (active === "profile") return <ProfilePage />;
  if (active === "notifications") return <NotificationsPage />;
  if (active === "org-overview") return <OverviewPage role={role} />;
  if (active === "gov-logs") return <LogsExportsPage />;
  return <LightPage id={active} title={title} onPick={onPick} />;
}
window.PageRouter = PageRouter;
