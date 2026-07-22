// settings-nav.jsx — Settings navigation panel + gated pages (Bento).
// Two nav layouts, switchable:
//   Option A: collapsible groups (chevron per group).
//             SNOWFLAKE — collapsible NavDrawer is not a Bento component;
//             pending design-system-lead approval; pull cleanly if rejected.
//             Isolated to <GroupA> + .snav-grouphead; core .sd-group untouched.
//   Option B: static groups; Organization broken into static sub-labels (the
//             .sd-group section-header pattern at a lighter token weight).
// The nav option changes ONLY the left panel — never page content (step 5).
//
// Gating is real (step 3): what renders depends on BOTH role and plan; anything
// the current context can't access is HIDDEN (never greyed), and a group header
// disappears when it has no visible items.
//
// NOTE: Option C (consolidated tabbed hubs) was removed this pass — the new
// direction bans in-page tabs and keeps items separate, which retires C's
// premise. Reinstate as stacked-section hubs if needed.

const USER = { name: "Ryan Williams", initials: "RW", email: "ryan@somos.com" };
const TEAMS = ["Brand studio", "Growth", "Customer care", "Regional — EMEA"];

/* ── Nav model — SAME items drive both options (step 1 merges applied) ──── */
const GROUPS = [
  { key: "account", label: "Account", defaultOpen: true, items: [
    // Preferences (time zone, language) is MERGED into Profile as a bottom
    // section — it is intentionally NOT a separate nav item (step 1).
    { key: "profile",       label: "Profile",            icon: "person" },
    { key: "notifications", label: "Notifications",      icon: "notifications" },
    { key: "security",      label: "Security & privacy", icon: "lock" },
  ]},
  { key: "org", label: "Organization", defaultOpen: true,
    // Option B static sub-structure (Overview alone, then sub-labels).
    sub: [
      { label: null,                items: ["org-overview"] },
      { label: "People & roles",    items: ["org-members", "org-teams", "org-roles"] },
      { label: "Accounts & assets", items: ["org-accounts", "org-vanity"] },
      { label: "Billing & plan",    items: ["org-billing"] },
    ],
    // Flat order (Option A) per spec: Overview, Members, Teams, Social accounts,
    // Roles & permissions, Vanity URLs, Plan & billing.
    items: [
      { key: "org-overview", label: "Overview",            icon: "dashboard" },
      { key: "org-members",  label: "Members",             icon: "group" },
      { key: "org-teams",    label: "Teams",               icon: "groups" },
      { key: "org-accounts", label: "Social accounts",     icon: "hub" },
      { key: "org-roles",    label: "Roles & permissions", icon: "admin_panel_settings" },
      // CONSOLIDATION CANDIDATE, pending open question — DO NOT MERGE YET.
      { key: "org-vanity",   label: "Vanity URLs",         icon: "link" },
      { key: "org-billing",  label: "Plan & billing",      icon: "credit_card" },
    ]},
  { key: "gov", label: "Security & governance", defaultOpen: false, items: [
    { key: "gov-sso",      label: "SSO & MFA",         icon: "vpn_key" },
    // Audit log + Data & exports MERGED into one page (step 1): audit on top,
    // exports below — stacked sections on one scrollable page, no tabs.
    { key: "gov-logs",     label: "Logs & exports",    icon: "history" },
    { key: "gov-profiles", label: "Security profiles", icon: "verified_user" },
  ]},
  { key: "int", label: "Integrations", defaultOpen: false, items: [
    // CONSOLIDATION CANDIDATE, pending open question — DO NOT MERGE YET.
    // (MCP connectors + Apps & API may later fold into one "Integrations" page.)
    { key: "int-mcp",  label: "MCP connectors", icon: "cable" },
    { key: "int-apps", label: "Apps & API",     icon: "extension" },
  ]},
];

const ALL_ITEMS = {};
GROUPS.forEach(g => g.items.forEach(it => { ALL_ITEMS[it.key] = { ...it, group: g.key, groupLabel: g.label }; }));

/* One-line page descriptions — rendered in the shared white header band (topbar)
   directly under the title, so breadcrumb + title + description read as ONE
   cohesive header block instead of the description floating alone on the grey body. */
const PAGE_DESC = {
  profile: "Your personal account details and preferences.",
  notifications: "Choose what we tell you about. Changes save automatically.",
  security: "Protect your account and control your data.",
  "org-overview": "A summary of this organisation.",
  "org-members": "People in this organisation and the access they have.",
  "org-teams": "Groups that share social accounts and approvals.",
  "org-accounts": "Social profiles connected to this organisation.",
  "org-roles": "Pre-defined and custom roles for this organisation.",
  "org-vanity": "Branded short links for this organisation.",
  "org-billing": "Your plan, seats and invoices.",
  "gov-sso": "Single sign-on and multi-factor enforcement.",
  "gov-logs": "Audit history and data exports for this organisation.",
  "gov-profiles": "Reusable security policy profiles.",
  "int-mcp": "Model Context Protocol connectors for AI tools.",
  "int-apps": "Connected apps and API access.",
};

/* ── Real gating (step 3): visibility is a function of role AND plan ─────
   Roles: View only · Admin · Super admin · Paying member
   Plans: Standard · Enterprise
   Rules:
     • Plan & billing → Super admin + Paying member only
     • Security & governance group (SSO & MFA, Logs & exports, Security
       profiles) → Enterprise plan only (whole group + header vanish on Standard)
     • Vanity URLs → Enterprise plan only
     • Members and Roles & permissions → hidden for View only
     • Integrations → hidden for View only
   Verified counts: SA/Enterprise ≈ full; Admin/Standard ≈ 9–10; View only ≈ 6. */
const ROLES = ["View only", "Admin", "Super admin", "Paying member"];
const PLANS = ["Standard", "Enterprise"];
const isAdminPlus = role => role === "Admin" || role === "Super admin" || role === "Paying member";
function visible(key, role, plan) {
  switch (key) {
    case "org-billing": return role === "Super admin" || role === "Paying member";
    case "org-members":
    case "org-roles":   return isAdminPlus(role);
    case "org-vanity":  return plan === "Enterprise"; // (a View-only role gate could be layered later)
    case "gov-sso":
    case "gov-logs":
    case "gov-profiles": return plan === "Enterprise";
    case "int-mcp":
    case "int-apps":     return isAdminPlus(role);
    default: return true; // profile, notifications, security, overview, teams, social accounts
  }
}
const visGroups = (role, plan) => GROUPS
  .map(g => ({ g, items: g.items.filter(it => visible(it.key, role, plan)) }))
  .filter(x => x.items.length > 0);

/* Avatar-flyout quick links → deep-link to the page (filtered by visibility). */
const QUICK = [
  { label: "Profile",         icon: "person",      target: "profile" },
  { label: "Social accounts", icon: "hub",         target: "org-accounts" },
  { label: "MCP connectors",  icon: "cable",       target: "int-mcp" },
  { label: "Plan & billing",  icon: "credit_card", target: "org-billing" },
];

/* Shared with the page files (snav-pages.jsx / snav-members.jsx), read at runtime. */
window.SNAV = { USER, TEAMS, GROUPS, ALL_ITEMS, ROLES, PLANS, visible, isAdminPlus };

/* ── Toast host (autosave undo + action confirmations). Pages fire via
   window.snavToast(message, { undo, icon }). ───────────────────────────── */
function ToastHost() {
  const [toasts, setToasts] = React.useState([]);
  React.useEffect(() => {
    const onToast = e => {
      const id = Math.random().toString(36).slice(2);
      const t = { id, ...e.detail };
      setToasts(list => [...list, t]);
      t.timer = setTimeout(() => setToasts(list => list.filter(x => x.id !== id)), e.detail.duration || 5000);
    };
    window.addEventListener("snav-toast", onToast);
    return () => window.removeEventListener("snav-toast", onToast);
  }, []);
  const dismiss = id => setToasts(list => list.filter(x => x.id !== id));
  return (
    <div className="snav-toasts" role="status" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className="snav-toast">
          <span className="material-symbols-outlined">{t.icon || "check_circle"}</span>
          <span className="msg">{t.message}</span>
          {t.undo && <button type="button" className="undo" onClick={() => { t.undo(); dismiss(t.id); }}>Undo</button>}
          <button type="button" className="x" aria-label="Dismiss" title="Dismiss" onClick={() => dismiss(t.id)}><span className="material-symbols-outlined">close</span></button>
        </div>
      ))}
    </div>
  );
}
window.snavToast = (message, opts) => window.dispatchEvent(new CustomEvent("snav-toast", { detail: { message, ...(opts || {}) } }));

/* ── A nav item row (reuses .sd-item) ────────────────────────────────── */
function NavItem({ item, active, onPick }) {
  return (
    <a href="#" className={"sd-item" + (active ? " on" : "")} aria-current={active ? "page" : undefined}
       onClick={e => { e.preventDefault(); onPick(item.key); }}>
      <span className="material-symbols-outlined">{item.icon}</span>{item.label}
    </a>
  );
}

/* ── Option A group: collapsible group header ─────────────────────────────
   SNOWFLAKE — collapsible NavDrawer is not a Bento component; pending
   design-system-lead approval; pull cleanly if rejected. Everything that makes
   collapse work lives in THIS component + the .snav-grouphead CSS block — the
   core .sd-group section header (used by Option B) is never modified, so this
   can be deleted without affecting the static drawer. ─────────────────────── */
function GroupA({ group, items, open, onToggle, active, onPick }) {
  const bodyId = "snav-grp-" + group.key;
  return (
    <React.Fragment>
      <button type="button" className={"snav-grouphead" + (open ? "" : " collapsed")}
        aria-expanded={open} aria-controls={bodyId}
        title={open ? "Collapse group" : "Expand group"}
        onClick={() => onToggle(group.key)}>
        <span>{group.label}</span>
        <span className="grow"></span>
        {!open && <span className="hs-badge hs-badge--neutral" aria-label={items.length + " items"}>{items.length}</span>}
        <span className="material-symbols-outlined chev">expand_more</span>
      </button>
      {open && <div id={bodyId}>{items.map(it => <NavItem key={it.key} item={it} active={active === it.key} onPick={onPick} />)}</div>}
    </React.Fragment>
  );
}

/* ── Option B group: static top-level; Organization gets sub-labels (lighter-
   weight .sd-group section-header). The sub-labels are ALSO collapsible — a
   SECOND level of the same SNOWFLAKE as Option A (collapsible NavDrawer is not
   a Bento component; pending design-system-lead approval; pull cleanly if
   rejected). All collapse logic is isolated to <GroupB>'s sub-head button +
   the .snav-subhead CSS block; the core .sd-group is never modified. ────── */
function GroupB({ group, role, plan, active, onPick, openSubs, toggleSub }) {
  if (group.sub) {
    const blocks = group.sub
      .map(s => ({ label: s.label, items: s.items.map(k => ALL_ITEMS[k]).filter(it => visible(it.key, role, plan)) }))
      .filter(b => b.items.length > 0);
    return (
      <React.Fragment>
        <div className="sd-group">{group.label}</div>
        {blocks.map((b, i) => {
          // Unlabelled lead block (Overview): no sub-header, always shown.
          if (!b.label) return (
            <React.Fragment key={"_top" + i}>
              {b.items.map(it => <NavItem key={it.key} item={it} active={active === it.key} onPick={onPick} />)}
            </React.Fragment>
          );
          const subKey = group.key + "/" + b.label;
          const lockedOpen = b.items.some(it => it.key === active); // sub-group with the active page never collapses
          const open = lockedOpen || (openSubs[subKey] ?? true);     // session-only; default expanded
          const bodyId = "snav-sub-" + subKey.replace(/[^a-z0-9]+/gi, "-");
          return (
            <React.Fragment key={b.label}>
              <button type="button"
                className={"snav-subhead" + (open ? "" : " collapsed") + (lockedOpen ? " locked-open" : "")}
                aria-expanded={open} aria-controls={bodyId}
                title={lockedOpen ? "Contains the current page — stays open" : open ? "Collapse " + b.label : "Expand " + b.label}
                onClick={() => { if (!lockedOpen) toggleSub(subKey); }}>
                <span>{b.label}</span>
                <span className="grow"></span>
                {!open && <span className="hs-badge hs-badge--neutral" aria-label={b.items.length + " items"}>{b.items.length}</span>}
                <span className="material-symbols-outlined chev">expand_more</span>
              </button>
              {open && <div id={bodyId}>{b.items.map(it => <NavItem key={it.key} item={it} active={active === it.key} onPick={onPick} />)}</div>}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <div className="sd-group">{group.label}</div>
      {group.items.filter(it => visible(it.key, role, plan)).map(it => <NavItem key={it.key} item={it} active={active === it.key} onPick={onPick} />)}
    </React.Fragment>
  );
}

/* ── The settings nav panel ──────────────────────────────────────────── */
function NavPanel({ option, role, plan, active, onPick, query, setQuery, openGroups, toggleGroup, openSubs, toggleSub }) {
  const activeGroup = ALL_ITEMS[active] ? ALL_ITEMS[active].group : null;
  const q = query.trim().toLowerCase();
  const live = visGroups(role, plan);

  return (
    <aside className="suite-drawer snav-drawer" aria-label="Settings navigation">
      <div className="sd-head">Settings
        <button className="sd-collapse" type="button" aria-label="Collapse panel" title="Collapse"><span className="material-symbols-outlined">keyboard_double_arrow_left</span></button>
      </div>
      <div className="sd-body">
        <div className="snav-search">
          <span className="material-symbols-outlined snav-search-ic">search</span>
          <input className="hs-input snav-search-input" placeholder="Search settings" aria-label="Search settings" value={query} onChange={e => setQuery(e.target.value)} />
          {query && <button type="button" className="snav-search-clear" aria-label="Clear search" title="Clear" onClick={() => setQuery("")}><span className="material-symbols-outlined">close</span></button>}
        </div>

        {q ? (
          (() => {
            const hits = live
              .map(x => ({ g: x.g, items: x.items.filter(it => it.label.toLowerCase().includes(q)) }))
              .filter(x => x.items.length > 0);
            if (hits.length === 0) return (
              <div className="snav-empty">
                <span className="material-symbols-outlined">search_off</span>
                <div className="t">No settings match “{query}”</div>
                <div className="d">Try a different term, or clear the search.</div>
              </div>
            );
            return hits.map(x => (
              <React.Fragment key={x.g.key}>
                <div className="snav-resultgroup">{x.g.label}</div>
                {x.items.map(it => <NavItem key={it.key} item={it} active={active === it.key} onPick={onPick} />)}
              </React.Fragment>
            ));
          })()
        ) : option === "A" ? (
          live.map(({ g, items }) => {
            const open = openGroups[g.key] ?? g.defaultOpen;
            return <GroupA key={g.key} group={g} items={items} open={open} onToggle={toggleGroup} active={active} onPick={onPick} />;
          })
        ) : (
          live.map(({ g }) => <GroupB key={g.key} group={g} role={role} plan={plan} active={active} onPick={onPick} openSubs={openSubs} toggleSub={toggleSub} />)
        )}
      </div>
    </aside>
  );
}

/* ── Rail + avatar flyout ────────────────────────────────────────────── */
function Flyout({ role, plan, onPick, onClose }) {
  const links = QUICK.filter(q => visible(q.target, role, plan));
  return (
    <div className="snav-menu snav-flyout" role="menu">
      <div className="fly-id">
        <span className="hs-avatar hs-avatar--md" data-c="3" aria-hidden="true">{USER.initials}</span>
        <span><span className="fly-nm" style={{ display: "block" }}>{USER.name}</span><span className="fly-em">{USER.email}</span></span>
      </div>
      <div className="snav-menu-sep"></div>
      <div className="snav-menu-lab">Quick links</div>
      {links.map(q => (
        <button key={q.target} role="menuitem" className="snav-menu-item" onClick={() => { onPick(q.target); onClose(); }}>
          <span className="material-symbols-outlined">{q.icon}</span>{q.label}
        </button>
      ))}
      <div className="snav-menu-sep"></div>
      <button role="menuitem" className="snav-menu-item" onClick={() => { onPick("profile"); onClose(); }}><span className="material-symbols-outlined">settings</span>All settings</button>
      <button role="menuitem" className="snav-menu-item" onClick={onClose}><span className="material-symbols-outlined">logout</span>Sign out</button>
    </div>
  );
}

function Rail({ flyoutOpen, setFlyoutOpen, role, plan, onPick }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!flyoutOpen) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setFlyoutOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, [flyoutOpen]);
  const products = [
    { key: "perch", icon: "calendar_month", label: "Perch" },
    { key: "nest", icon: "inbox", label: "Nest" },
    { key: "lumen", icon: "graphic_eq", label: "Lumen" },
    { key: "parliament", icon: "groups", label: "Parliament" },
    { key: "wisdom", icon: "auto_awesome", label: "Wisdom" },
  ];
  return (
    <aside className="suite-rail">
      <div className="main">
        <a className="suite-brand" href="#" aria-label="Hootsuite" title="Hootsuite" onClick={e => e.preventDefault()}><img src="assets/hootsuite-owly-small.png" alt="Hootsuite" /></a>
        {products.map(p => (
          <a key={p.key} href="#" className="suite-navbtn" data-product={p.key} onClick={e => e.preventDefault()}>
            <span className="circle"><span className="material-symbols-outlined">{p.icon}</span></span>
            <span className="lbl">{p.label}</span>
          </a>
        ))}
      </div>
      <div className="others">
        <button className="suite-navbtn util ne-tooltipbtn" type="button" aria-label="Help" title="Help" style={{ border: 0, background: "transparent", cursor: "pointer", padding: 0, width: "100%" }}>
          <span className="circle"><span className="material-symbols-outlined">help</span></span>
        </button>
        <div className="snav-avatarwrap" ref={ref}>
          <button className="suite-rail-avatar-btn" type="button" aria-haspopup="menu" aria-expanded={flyoutOpen} aria-label="Account menu" title="Account" style={{ border: 0, background: "transparent", cursor: "pointer", padding: 0 }} onClick={() => setFlyoutOpen(o => !o)}>
            <span className="hs-avatar hs-avatar--sm" data-c="3" aria-hidden="true">{USER.initials}</span>
          </button>
          {flyoutOpen && <Flyout role={role} plan={plan} onPick={onPick} onClose={() => setFlyoutOpen(false)} />}
        </div>
      </div>
    </aside>
  );
}

/* ── App ─────────────────────────────────────────────────────────────── */
function App() {
  const [option, setOption] = React.useState("B");
  const [role, setRole] = React.useState("Paying member");
  const [plan, setPlan] = React.useState("Enterprise");
  const [active, setActive] = React.useState("profile"); // View-only-safe landing
  const [query, setQuery] = React.useState("");
  const [openGroups, setOpenGroups] = React.useState({}); // session-only (Option A)
  const [openSubs, setOpenSubs] = React.useState({}); // session-only (Option B sub-groups)
  const [flyoutOpen, setFlyoutOpen] = React.useState(false);
  const [mobileFly, setMobileFly] = React.useState(false);
  const [navOpen, setNavOpen] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(true); // dev controls visible (low-key toggle)
  const roleSelRef = React.useRef(null);
  // Force the native <select> to reflect state (defeats Chrome form-restore after
  // reload/bfcache, which otherwise shows a stale role). Runs post-paint + on pageshow.
  React.useEffect(() => {
    const fix = () => { if (roleSelRef.current && roleSelRef.current.value !== role) roleSelRef.current.value = role; };
    fix();
    // Chrome's <select> form-restore can fire after mount/raf with no React re-render
    // to correct it; poll briefly to guarantee the control reflects state.
    let n = 0; const id = setInterval(() => { fix(); if (++n > 12) clearInterval(id); }, 100);
    window.addEventListener("pageshow", fix);
    return () => { clearInterval(id); window.removeEventListener("pageshow", fix); };
  }, [role]);

  const toggleGroup = key => setOpenGroups(o => ({ ...o, [key]: !(o[key] ?? GROUPS.find(g => g.key === key).defaultOpen) }));
  const toggleSub = key => setOpenSubs(o => ({ ...o, [key]: !(o[key] ?? true) })); // sub-groups default expanded

  // If the active page becomes invisible under the new context, fall back.
  const reconcile = (r, p) => { if (!visible(active, r, p)) setActive("profile"); };
  const onRole = r => { setRole(r); reconcile(r, plan); };
  const onPlan = p => { setPlan(p); reconcile(role, p); };

  const pick = key => {
    setActive(key); setQuery(""); setNavOpen(false);
    const grp = ALL_ITEMS[key] && ALL_ITEMS[key].group;
    if (grp) setOpenGroups(o => ({ ...o, [grp]: true })); // Option A auto-expand
  };

  const item = ALL_ITEMS[active] || { label: "Settings", groupLabel: null };
  const PageRouter = window.PageRouter;

  return (
    <div className={"suite-app snav-app" + (navOpen ? " nav-open" : "")}>
      <Rail flyoutOpen={flyoutOpen} setFlyoutOpen={setFlyoutOpen} role={role} plan={plan} onPick={pick} />
      <div className="snav-backdrop" onClick={() => setNavOpen(false)}></div>
      <NavPanel option={option} role={role} plan={plan} active={active} onPick={pick}
        query={query} setQuery={setQuery} openGroups={openGroups} toggleGroup={toggleGroup} openSubs={openSubs} toggleSub={toggleSub} />
      <main className="snav-main">
        {/* DEV/DEMO PREVIEW BAR — visually distinct from product chrome (step: polish) */}
        {previewOpen ? (
        <div className="snav-previewbar" role="region" aria-label="Preview controls (not part of the product)">
          <span className="hs-badge hs-badge--info pv-badge"><span className="material-symbols-outlined">science</span>Preview</span>
          <span className="pv-help">Demo controls — not part of Settings</span>
          <span className="pv-grow"></span>
          <div className="pv-ctrl">
            <span className="pv-lbl" id="pv-layout">Layout</span>
            <div className="hs-display-toggle" role="radiogroup" aria-labelledby="pv-layout">
              <button type="button" role="radio" aria-checked={option === "A"} className={"opt" + (option === "A" ? " active" : "")} onClick={() => setOption("A")} title="Collapsible groups"><span className="material-symbols-outlined">expand_more</span>A · Collapsible</button>
              <button type="button" role="radio" aria-checked={option === "B"} className={"opt" + (option === "B" ? " active" : "")} onClick={() => setOption("B")} title="Static sub-groups"><span className="material-symbols-outlined">segment</span>B · Static</button>
            </div>
          </div>
          <div className="pv-ctrl">
            <span className="pv-lbl" id="pv-plan">Plan</span>
            <div className="hs-display-toggle" role="radiogroup" aria-labelledby="pv-plan">
              {PLANS.map(p => (
                <button key={p} type="button" role="radio" aria-checked={plan === p} className={"opt" + (plan === p ? " active" : "")} onClick={() => onPlan(p)}>{p}</button>
              ))}
            </div>
          </div>
          <div className="pv-ctrl">
            <span className="pv-lbl" id="pv-role">Role</span>
            <span className="hs-select pv-roleselect" title="Preview the menu as each role sees it">
              <select ref={roleSelRef} value={role} onChange={e => onRole(e.target.value)} aria-labelledby="pv-role" autoComplete="off">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
              <span className="material-symbols-outlined chev">keyboard_arrow_down</span>
            </span>
          </div>
          <button className="pv-hide" type="button" aria-label="Hide preview controls" title="Hide preview controls" onClick={() => setPreviewOpen(false)}><span className="material-symbols-outlined">close</span></button>
        </div>
        ) : (
          <button className="snav-preview-show" type="button" aria-label="Show preview controls" title="Show preview controls" onClick={() => setPreviewOpen(true)}><span className="material-symbols-outlined">science</span>Preview</button>
        )}

        {/* PRODUCT TOP BAR */}
        <div className="snav-topbar">
          <button className="hs-btn hs-btn--icon snav-menubtn ne-tooltipbtn" type="button" aria-label="Open settings menu" title="Menu" onClick={() => setNavOpen(true)}><span className="material-symbols-outlined">menu</span></button>
          <div className="ttl">
            <div className="crumb">Settings{item.groupLabel && <React.Fragment><span className="material-symbols-outlined">chevron_right</span>{item.groupLabel}</React.Fragment>}</div>
            <h1>{item.label}</h1>
            {PAGE_DESC[active] && <p className="snav-topbar-desc">{PAGE_DESC[active]}</p>}
          </div>
          <div className="snav-mobile-av">
            <button className="suite-rail-avatar-btn" type="button" aria-haspopup="menu" aria-expanded={mobileFly} aria-label="Account menu" onClick={() => setMobileFly(o => !o)}><span className="hs-avatar hs-avatar--sm" data-c="3" aria-hidden="true">{USER.initials}</span></button>
            {mobileFly && <Flyout role={role} plan={plan} onPick={k => pick(k)} onClose={() => setMobileFly(false)} />}
          </div>
        </div>

        <div className="snav-content">
          {PageRouter
            ? <PageRouter active={active} role={role} plan={plan} onPick={pick} />
            : <div className="snav-pagewrap"><div className="snav-page-empty">Loading…</div></div>}
        </div>
      </main>
      <ToastHost />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
