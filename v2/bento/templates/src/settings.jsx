// settings.jsx — Social OS settings: categorized left nav (sd-* drawer) + content pane.
// Canonical Suite shell (SuiteRail + .suite-drawer). Account / Organization (admin,
// with a locked Governance sub-cluster) / Product settings deep-links.

const USER = { name: "Alex Andersson", initials: "AA", email: "alex@somos.com", title: "Social Media Manager", plan: "Enterprise plan" };

const NAV = {
  account: [
    { key: "profile",       label: "Profile",            icon: "person" },
    { key: "preferences",   label: "Preferences",        icon: "tune" },
    { key: "security",      label: "Security & Privacy", icon: "security" },
    { key: "notifications", label: "Notifications",      icon: "notifications" },
  ],
  organization: [
    { key: "org-overview",    label: "Overview",                         icon: "corporate_fare" },
    { key: "org-members",     label: "Members",                          icon: "group" },
    { key: "org-teams",       label: "Teams",                            icon: "groups" },
    { key: "org-accounts",    label: "Social Accounts",                  icon: "hub" },
    { key: "org-permissions", label: "Permissions & Roles",              icon: "admin_panel_settings" },
    { key: "org-seats",       label: "Seats & Licences",                 icon: "event_seat" },
    { key: "org-billing",     label: "Billing & plan",                   icon: "credit_card" },
    { key: "org-mcp",         label: "MCP connectors",                   icon: "cable" },
    { key: "org-integrations", label: "Integrations",                    icon: "extension" },
  ],
  governance: [
    { key: "gov-sso",      label: "SSO & MFA",         icon: "vpn_key" },
    { key: "gov-export",   label: "Data Export",       icon: "download" },
    { key: "gov-audit",    label: "Audit logs",        icon: "history" },
    { key: "gov-profiles", label: "Security Profiles", icon: "verified_user" },
  ],
  products: [
    { key: "p-nest",       label: "Inbox (Nest)",  icon: "inbox" },
    { key: "p-lumen",      label: "Lumen",         icon: "podcasts" },
    { key: "p-parliament", label: "Parliament",    icon: "campaign" },
    { key: "p-wisdom",     label: "Wisdom",        icon: "auto_awesome" },
    { key: "p-vigil",      label: "Vigil",         icon: "shield" },
  ],
};

function labelFor(key) {
  for (const grp of Object.values(NAV)) { const m = grp.find(i => i.key === key); if (m) return m.label; }
  return "Settings";
}

// ── Role-conditional IA ──────────────────────────────────────────────
// Items are ABSENT from the nav for roles that can't use them (hide, never grey).
// Account is always fully visible + editable. org-overview is visible to every
// role, so it's always a safe redirect target. Governance entitlement-gating is
// the documented exception to hide-don't-grey, kept ready behind SHOW_GOVERNANCE.
const VIEW_ROLES = ["Paying Super Admin", "Super Admin", "Admin", "View Only"];
const ORG_VISIBILITY = {
  "Paying Super Admin": ["org-overview", "org-members", "org-teams", "org-accounts", "org-permissions", "org-seats", "org-billing", "org-mcp", "org-integrations"],
  "Super Admin":        ["org-overview", "org-members", "org-teams", "org-accounts", "org-permissions", "org-seats", "org-billing", "org-mcp", "org-integrations"],
  "Admin":              ["org-overview", "org-members", "org-teams", "org-accounts", "org-permissions", "org-seats", "org-mcp", "org-integrations"],
  "View Only":          ["org-overview", "org-teams"],
};
function orgKeysFor(role) { return ORG_VISIBILITY[role] || ORG_VISIBILITY["Paying Super Admin"]; }

// Pane registry — Account panes register here; settings-org.jsx / settings-gov.jsx
// add Organization + Governance panes. App resolves the active pane by nav key.
window.SETTINGS_PANES = window.SETTINGS_PANES || {};
function groupLabelFor(key) {
  if (NAV.account.some(i => i.key === key)) return "Account";
  if (NAV.organization.some(i => i.key === key) || NAV.governance.some(i => i.key === key)) return "Organization";
  return "Settings";
}

/* ── Shared controls ─────────────────────────────────────────────────── */
function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} title={on ? "On" : "Off"}
      className={"hs-toggle" + (on ? " is-on" : "")} onClick={() => onChange(!on)} />
  );
}

function Segmented({ value, onChange, options, label }) {
  return (
    <div className="set-seg" role="radiogroup" aria-label={label}>
      {options.map(opt => (
        <button key={opt} type="button" role="radio" aria-checked={value === opt}
          className={value === opt ? "on" : ""} onClick={() => onChange(opt)}>{opt}</button>
      ))}
    </div>
  );
}

/* Non-expanding setting row: icon + title/helper + control on the right. */
function SettingRow({ icon, title, desc, children }) {
  return (
    <div className="set-row">
      {icon && <span className="set-row-icon"><span className="material-symbols-outlined">{icon}</span></span>}
      <span className="set-row-text">
        <span className="set-row-title">{title}</span>
        {desc && <span className="set-row-desc">{desc}</span>}
      </span>
      <span className="set-row-ctrl">{children}</span>
    </div>
  );
}

function GroupRow({ icon, label }) {
  return (
    <div className="set-grouprow">
      {icon && <span className="material-symbols-outlined">{icon}</span>}
      <span className="lbl">{label}</span>
    </div>
  );
}

/* Inline-edit accordion row (expands to a form). */
function AccRow({ item, open, onToggle, children }) {
  return (
    <div className={"set-acc-row" + (item.danger ? " danger" : "")}>
      <button className="set-acc-trigger" onClick={onToggle} aria-expanded={open} type="button">
        <span className="set-acc-icon"><span className="material-symbols-outlined">{item.icon}</span></span>
        <span className="set-acc-text">
          <span className="set-acc-title">{item.title}</span>
          <span className="set-acc-desc">{item.desc}</span>
        </span>
        <span className={"set-acc-chev" + (open ? " open" : "")}><span className="material-symbols-outlined">expand_more</span></span>
      </button>
      {open && <div className="set-acc-body">{children}</div>}
    </div>
  );
}

function LinkRow({ icon, title, desc, external, onClick }) {
  return (
    <button className="set-linkrow" type="button" onClick={onClick}
      title={external ? "Opens in a new tab" : undefined}>
      {icon && <span className="set-row-icon"><span className="material-symbols-outlined">{icon}</span></span>}
      <span className="set-row-text">
        <span className="set-row-title">{title}</span>
        {desc && <span className="set-row-desc">{desc}</span>}
      </span>
      <span className="set-row-end"><span className="material-symbols-outlined">{external ? "open_in_new" : "chevron_right"}</span></span>
    </button>
  );
}

function SaveFoot({ onCancel, label = "Save changes" }) {
  return (
    <div className="set-acc-foot">
      <button className="hs-btn hs-btn--ghost" type="button" onClick={onCancel}>Cancel</button>
      <button className="hs-btn hs-btn--primary" type="button" onClick={onCancel}>{label}</button>
    </div>
  );
}

/* ── Drawer: categorized nav ─────────────────────────────────────────── */
// Governance is an Enterprise-only cluster with no actionable controls yet —
// hidden from the nav for now. Set true to bring the group back.
const SHOW_GOVERNANCE = false;
function SettingsDrawer({ active, setActive, role }) {
  const orgKeys = orgKeysFor(role);
  const orgItems = NAV.organization.filter(it => orgKeys.includes(it.key));
  return (
    <aside className="suite-drawer" aria-label="Settings navigation">
      <div className="sd-head">Settings
        <button className="sd-collapse" type="button" aria-label="Collapse" title="Collapse"><span className="material-symbols-outlined">keyboard_double_arrow_left</span></button>
      </div>
      <div className="sd-body">
        <div className="set-search">
          <span className="material-symbols-outlined">search</span>
          <input placeholder="Search settings" aria-label="Search settings" />
        </div>

        <div className="sd-group">Account</div>
        {NAV.account.map(it => (
          <a key={it.key} href="#" className={"sd-item" + (active === it.key ? " on" : "")} aria-current={active === it.key ? "page" : undefined}
             onClick={e => { e.preventDefault(); setActive(it.key); }}>
            <span className="material-symbols-outlined">{it.icon}</span>{it.label}
          </a>
        ))}

        <div className="sd-group">Organization</div>
        {orgItems.map(it => (
          <a key={it.key} href="#" className={"sd-item" + (active === it.key ? " on" : "")} aria-current={active === it.key ? "page" : undefined}
             onClick={e => { e.preventDefault(); setActive(it.key); }}>
            <span className="material-symbols-outlined">{it.icon}</span>{it.label}
          </a>
        ))}

        {/* Governance sub-cluster — hidden for now (nothing actionable yet).
           Pane code is kept; flip SHOW_GOVERNANCE to re-enable the nav group. */}
        {SHOW_GOVERNANCE && <div className="set-subgroup"><span className="material-symbols-outlined">lock</span>Governance</div>}
        {SHOW_GOVERNANCE && NAV.governance.map(it => (
          <a key={it.key} href="#" className={"sd-item gov" + (active === it.key ? " on" : "")} aria-current={active === it.key ? "page" : undefined} title="Enterprise feature"
             onClick={e => { e.preventDefault(); setActive(it.key); }}>
            <span className="material-symbols-outlined">{it.icon}</span>{it.label}
            <span className="material-symbols-outlined sd-lock" aria-label="Enterprise">lock</span>
          </a>
        ))}

        {/* Product settings deep-links removed — kept the nav focused on Account + Organization. */}
      </div>
    </aside>
  );
}

/* Delete-account: severity-scaled, type-the-name confirm, no red. */
function DeleteAccount({ onCancel }) {
  const [typed, setTyped] = React.useState("");
  const armed = typed.trim() === USER.name;
  return (
    <div className="set-acc-fields">
      <div className="set-note warn"><span className="material-symbols-outlined">warning</span>
        <span>Deleting your account is permanent and cannot be undone.</span></div>
      <ul className="set-del-list">
        <li><span className="material-symbols-outlined">close</span>Your profile, bio, and login</li>
        <li><span className="material-symbols-outlined">close</span>All scheduled and draft posts you own</li>
        <li><span className="material-symbols-outlined">close</span>Your reports, alerts, and saved searches</li>
      </ul>
      <div className="set-field set-del-confirm">
        <label htmlFor="del-confirm">Type <b>{USER.name}</b> to confirm</label>
        <input id="del-confirm" className="set-input" value={typed} onChange={e => setTyped(e.target.value)} placeholder={USER.name} autoComplete="off" />
      </div>
      <div className="set-del-foot">
        <button className="hs-btn hs-btn--ghost" type="button" onClick={onCancel}>Cancel</button>
        <button className="set-danger-btn" type="button" disabled={!armed} aria-disabled={!armed}>
          <span className="material-symbols-outlined">delete_forever</span>Delete my account
        </button>
      </div>
    </div>
  );
}

/* ── Account › Profile ───────────────────────────────────────────────── */
// Copy + order match social-os-reboot Figma (Account/Profile, Settings accordion).
const PROFILE_ROWS = [
  { key: "userinfo", icon: "person",   title: "User information", desc: "Update your display name, bio, job title, and profile photo visible to teammates." },
  { key: "timezone", icon: "schedule", title: "Time zone",        desc: "Set your local time zone to ensure posts are scheduled and reports display at the right times." },
  { key: "social",   icon: "link",     title: "Social profile",   desc: "Add a link to your profile to share with your organisation." },
  { key: "email",    icon: "mail",     title: "Email address",    desc: "Change the email used to log in and receive notifications from Hootsuite." },
  { key: "password", icon: "lock",     title: "Password",         desc: "Update your password or set a new one to keep your account secure." },
  { key: "delete",   icon: "delete",   title: "Delete account",   desc: "Permanently delete your account and the data it owns.", danger: true },
];

function ProfilePane() {
  const [openKey, setOpenKey] = React.useState("userinfo");
  const toggle = k => setOpenKey(p => (p === k ? null : k));
  const close = () => setOpenKey(null);
  return (
    <div className="set-body">
      <div className="set-identity">
        <span className="set-identity-av">{USER.initials}</span>
        <div>
          <div className="set-identity-name">{USER.name}</div>
          <div className="set-identity-meta"><span>{USER.email}</span><span className="dot"></span><span>{USER.title}</span></div>
        </div>
        <span className="set-plan">{USER.plan}</span>
      </div>

      <div className="set-accordion">
        {PROFILE_ROWS.map(row => (
          <AccRow key={row.key} item={row} open={openKey === row.key} onToggle={() => toggle(row.key)}>
            {row.key === "userinfo" && (
              <div className="set-acc-fields">
                <div className="set-photo">
                  <span className="set-photo-av">{USER.initials}</span>
                  <button className="hs-btn hs-btn--secondary hs-btn--sm" type="button"><span className="material-symbols-outlined">upload</span>Upload photo</button>
                  <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button"><span className="material-symbols-outlined">delete</span>Delete</button>
                </div>
                <div className="set-field-row">
                  <div className="set-field"><label htmlFor="fn">First name<span className="req">*</span></label><input id="fn" className="set-input" defaultValue="Alex" /></div>
                  <div className="set-field"><label htmlFor="ln">Last name<span className="req">*</span></label><input id="ln" className="set-input" defaultValue="Andersson" /></div>
                </div>
                <div className="set-field"><label htmlFor="bio">Bio<span className="opt">(optional)</span></label><textarea id="bio" className="set-input set-textarea" placeholder="A short bio shown to your teammates"></textarea></div>
                <div className="set-field-row">
                  <div className="set-field"><label htmlFor="co">Company</label><input id="co" className="set-input" defaultValue="Somos" /></div>
                  <div className="set-field"><label htmlFor="jt">Job title</label><input id="jt" className="set-input" defaultValue="Social Media Manager" /></div>
                </div>
                <SaveFoot onCancel={close} />
              </div>
            )}
            {row.key === "timezone" && (
              <div className="set-acc-fields">
                <div className="set-field" style={{ maxWidth: 400 }}><label htmlFor="tz">Time zone</label>
                  <select id="tz" className="set-input">
                    <option>Central European Time (CET) — UTC+1</option>
                    <option>Pacific Time (PT) — UTC-8</option>
                    <option>Eastern Time (ET) — UTC-5</option>
                    <option>UTC</option>
                  </select>
                </div>
                <SaveFoot onCancel={close} />
              </div>
            )}
            {row.key === "social" && (
              <div className="set-acc-fields">
                <div className="set-field" style={{ maxWidth: 460 }}><label htmlFor="su">Profile URL<span className="opt">(optional)</span></label><input id="su" className="set-input" placeholder="https://linkedin.com/in/yourname" /></div>
                <SaveFoot onCancel={close} label="Save" />
              </div>
            )}
            {row.key === "email" && (
              <div className="set-acc-fields">
                <div className="set-field" style={{ maxWidth: 400 }}><label htmlFor="em">Email address<span className="req">*</span></label><input id="em" className="set-input" type="email" defaultValue={USER.email} /></div>
                <div className="set-note warn"><span className="material-symbols-outlined">info</span>
                  <span>Changing your email can disconnect connected social accounts. You'll need to reconnect them after confirming the new address.</span></div>
                <SaveFoot onCancel={close} label="Update email" />
              </div>
            )}
            {row.key === "password" && (
              <div className="set-acc-fields">
                <div className="set-field" style={{ maxWidth: 400 }}><label htmlFor="cp">Current password</label><input id="cp" className="set-input" type="password" placeholder="••••••••" /></div>
                <div className="set-field" style={{ maxWidth: 400 }}><label htmlFor="np">New password</label><input id="np" className="set-input" type="password" placeholder="••••••••" /></div>
                <div className="set-field" style={{ maxWidth: 400 }}><label htmlFor="cf">Confirm new password</label><input id="cf" className="set-input" type="password" placeholder="••••••••" /></div>
                <SaveFoot onCancel={close} label="Update password" />
              </div>
            )}
            {row.key === "delete" && <DeleteAccount onCancel={close} />}
          </AccRow>
        ))}
      </div>
    </div>
  );
}

/* ── Account › Preferences ───────────────────────────────────────────── */
const LANGUAGES = ["English (US)", "English (UK)", "Français", "Español", "Deutsch", "Português (BR)", "日本語"];

function PreferencesPane() {
  const [openKey, setOpenKey] = React.useState(null);
  const toggle = k => setOpenKey(p => (p === k ? null : k));
  const close = () => setOpenKey(null);
  const [pref, setPref] = React.useState({ cached: true, retweets: false, recommended: true, viaSocial: false });
  const [workView, setWorkView] = React.useState("Condensed");
  const [weekStart, setWeekStart] = React.useState("Monday");
  const set = (k, v) => setPref(p => ({ ...p, [k]: v }));
  return (
    <div className="set-body">
      <div className="set-accordion">
        <AccRow item={{ key: "lang", icon: "translate", title: "Language", desc: "The language used across the Hootsuite web app." }}
          open={openKey === "lang"} onToggle={() => toggle("lang")}>
          <div className="set-acc-fields">
            <div className="set-field" style={{ maxWidth: 400 }}><label htmlFor="lang">Display language</label>
              <select id="lang" className="set-input" defaultValue="English (US)">
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <SaveFoot onCancel={close} label="Save" />
          </div>
        </AccRow>
        <AccRow item={{ key: "tz", icon: "schedule", title: "Time zone", desc: "Used to schedule posts and display reports in your local time." }}
          open={openKey === "tz"} onToggle={() => toggle("tz")}>
          <div className="set-acc-fields">
            <div className="set-field" style={{ maxWidth: 400 }}><label htmlFor="ptz">Time zone</label>
              <select id="ptz" className="set-input">
                <option>Central European Time (CET) — UTC+1</option>
                <option>Pacific Time (PT) — UTC-8</option>
                <option>Eastern Time (ET) — UTC-5</option>
                <option>UTC</option>
              </select>
            </div>
            <SaveFoot onCancel={close} label="Save" />
          </div>
        </AccRow>
        <SettingRow icon="cached" title="Cached messages" desc="Keep recent messages available offline for faster loading.">
          <Toggle on={pref.cached} onChange={v => set("cached", v)} label="Cached messages" />
        </SettingRow>
        <SettingRow icon="repeat" title="Retweets" desc="Include retweets in your streams and reports.">
          <Toggle on={pref.retweets} onChange={v => set("retweets", v)} label="Retweets" />
        </SettingRow>

        <GroupRow icon="calendar_month" label="Calendar display" />
        <SettingRow icon="view_week" title="Work view" desc="How densely scheduled posts are shown in the planner.">
          <Segmented value={workView} onChange={setWorkView} options={["Condensed", "Expanded"]} label="Work view" />
        </SettingRow>
        <SettingRow icon="today" title="Start week on" desc="The first day shown in the calendar week.">
          <Segmented value={weekStart} onChange={setWeekStart} options={["Sunday", "Monday"]} label="Start week on" />
        </SettingRow>
        <SettingRow icon="event_available" title="Show recommended times" desc="Highlight times your audience is most active.">
          <Toggle on={pref.recommended} onChange={v => set("recommended", v)} label="Show recommended times" />
        </SettingRow>
        <SettingRow icon="public" title="Show posts published via social" desc="Include posts published directly on the network, outside Hootsuite.">
          <Toggle on={pref.viaSocial} onChange={v => set("viaSocial", v)} label="Show posts published via social" />
        </SettingRow>
      </div>
    </div>
  );
}

/* ── Account › Security & Privacy ────────────────────────────────────── */
const SESSIONS = [
  { id: "s1", icon: "laptop_mac", name: "MacBook Pro", current: true, meta: "Chrome · Barcelona, ES · Active now" },
  { id: "s2", icon: "smartphone", name: "iPhone 15", current: false, meta: "Hootsuite app · Barcelona, ES · 2 hours ago" },
  { id: "s3", icon: "computer",   name: "Windows PC", current: false, meta: "Edge · Lisbon, PT · Yesterday" },
];

function SecurityPane({ nav }) {
  const onGoToSso = () => nav && nav("gov-sso");
  const [openKey, setOpenKey] = React.useState(null);
  const toggle = k => setOpenKey(p => (p === k ? null : k));
  const close = () => setOpenKey(null);
  const [sessions, setSessions] = React.useState(SESSIONS);
  const revoke = id => setSessions(s => s.filter(x => x.id !== id || x.current));
  return (
    <div className="set-body">
      <div className="set-accordion">
        <SettingRow icon="phonelink_lock" title="Two-step verification" desc="Add a second step at sign-in to keep your account secure.">
          <span className="hs-badge hs-badge--neutral"><span className="material-symbols-outlined">block</span>Off</span>
          <button className="hs-btn hs-btn--secondary hs-btn--sm" type="button"><span className="material-symbols-outlined">add</span>Enable</button>
        </SettingRow>

        <AccRow item={{ key: "pw", icon: "lock", title: "Change password", desc: "Update your password to keep your account secure." }}
          open={openKey === "pw"} onToggle={() => toggle("pw")}>
          <div className="set-acc-fields">
            <div className="set-field" style={{ maxWidth: 400 }}><label htmlFor="scp">Current password</label><input id="scp" className="set-input" type="password" placeholder="••••••••" /></div>
            <div className="set-field" style={{ maxWidth: 400 }}><label htmlFor="snp">New password</label><input id="snp" className="set-input" type="password" placeholder="••••••••" /></div>
            <SaveFoot onCancel={close} label="Update password" />
          </div>
        </AccRow>

        <AccRow item={{ key: "sessions", icon: "devices", title: "Active sessions", desc: "Devices currently signed in to your account." }}
          open={openKey === "sessions"} onToggle={() => toggle("sessions")}>
          <div className="set-acc-fields">
            <div className="set-sessions">
              {sessions.map(s => (
                <div className="set-session" key={s.id}>
                  <span className="material-symbols-outlined dev">{s.icon}</span>
                  <span className="set-session-text">
                    <span className="set-session-name">{s.name}{s.current && <span className="hs-badge hs-badge--positive"><span className="material-symbols-outlined">check_circle</span>This device</span>}</span>
                    <span className="set-session-meta">{s.meta}</span>
                  </span>
                  {!s.current && <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button" onClick={() => revoke(s.id)}><span className="material-symbols-outlined">logout</span>Revoke</button>}
                </div>
              ))}
            </div>
          </div>
        </AccRow>

        <LinkRow icon="policy" title="Privacy policy" desc="Read how Hootsuite handles your data." external onClick={() => {}} />

        <GroupRow icon="admin_panel_settings" label="Admin" />
        <LinkRow icon="vpn_key" title="SSO & MFA" desc="Manage single sign-on and multi-factor authentication for your organisation." onClick={onGoToSso} />
      </div>
    </div>
  );
}

/* ── Account › Notifications ─────────────────────────────────────────── */
const NOTIF_GROUPS = [
  { group: "Alerts", icon: "notifications_active", rows: [
    { key: "a-mention", title: "Mentions & comments", desc: "When someone mentions you or comments on your content.", on: true },
    { key: "a-approval", title: "Approvals", desc: "When a post needs your approval or yours is approved.", on: true },
    { key: "a-failed", title: "Failed posts", desc: "When a scheduled post fails to publish so you can fix it.", on: true },
    { key: "a-streams", title: "New stream messages", desc: "New messages in the streams you follow.", on: false },
    { key: "a-listening", title: "Listening alerts", desc: "Spikes in volume or sentiment for your tracked topics.", on: false },
  ]},
  { group: "Inbox 2.0", icon: "inbox", rows: [
    { key: "i-assigned", title: "Assigned to me", desc: "When a conversation is assigned to you.", on: true },
    { key: "i-mention", title: "Team mentions", desc: "When a teammate @mentions you in a conversation.", on: true },
    { key: "i-internal", title: "Internal comments", desc: "When a teammate leaves an internal comment on a conversation.", on: true },
  ]},
  { group: "Product notifications", icon: "campaign", rows: [
    { key: "p-news", title: "Product news", desc: "New features, improvements, and announcements.", on: false },
    { key: "p-tips", title: "Tips & best practices", desc: "Occasional guidance to help you get more from Hootsuite.", on: false },
  ]},
];

function NotificationsPane() {
  const flat = {};
  NOTIF_GROUPS.forEach(g => g.rows.forEach(r => { flat[r.key] = r.on; }));
  const [state, setState] = React.useState(flat);
  const set = (k, v) => setState(s => ({ ...s, [k]: v }));
  return (
    <div className="set-body">
      <div className="set-section">
        <h2>Email notifications</h2>
        <div className="sub">Choose which emails you'd like to receive. Changes apply right away.</div>
        <div className="set-accordion">
          {NOTIF_GROUPS.map((g, gi) => (
            <React.Fragment key={g.group}>
              <GroupRow icon={g.icon} label={g.group} />
              {g.rows.map(r => (
                <SettingRow key={r.key} title={r.title} desc={r.desc}>
                  <Toggle on={state[r.key]} onChange={v => set(r.key, v)} label={r.title} />
                </SettingRow>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="set-section">
        <h2>Managed elsewhere</h2>
        <div className="sub">Some notifications are controlled in their own product or on your device.</div>
        <div className="set-accordion">
          <LinkRow icon="notifications" title="Notification Center" desc="In-app alerts and their delivery." external onClick={() => {}} />
          <LinkRow icon="inbox" title="Inbox 2.0" desc="Conversation routing and assignment notifications." external onClick={() => {}} />
          <LinkRow icon="smartphone" title="Mobile" desc="Push notifications, managed in the Hootsuite mobile app." external onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}

/* ── States + stubs ──────────────────────────────────────────────────── */
function PlaceholderPane({ label }) {
  return (
    <div className="set-body">
      <div className="set-placeholder">
        <span className="material-symbols-outlined">construction</span>
        <div className="t">{label}</div>
        <div className="d">This section is being built out.</div>
      </div>
    </div>
  );
}

function EmptyPane() {
  return (
    <div className="set-body">
      <div className="suite-state empty" style={{ background: "var(--bento-theme-color-bg-surface)", border: "1px solid var(--bento-theme-color-border-subtle)", borderRadius: 8, maxWidth: 860, width: "100%", minHeight: 360 }}>
        <div className="suite-state-inner">
          <div className="ico"><span className="material-symbols-outlined">tune</span></div>
          <h2>Choose a setting</h2>
          <p>Pick a category from the left to view and edit its settings. Your profile is a good place to start.</p>
        </div>
      </div>
    </div>
  );
}
function ErrorPane({ onRetry }) {
  return (
    <div className="set-body">
      <div className="suite-state error" style={{ background: "var(--bento-theme-color-bg-surface)", border: "1px solid var(--bento-theme-color-border-subtle)", borderRadius: 8, maxWidth: 860, width: "100%", minHeight: 360 }}>
        <div className="suite-state-inner">
          <div className="ico"><span className="material-symbols-outlined">cloud_off</span></div>
          <h2>We couldn't load your settings</h2>
          <p>Your account settings are safe — this is usually a brief connection issue. Try loading them again.</p>
          <div className="acts">
            <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">help</span>View status</button>
            <button className="hs-btn hs-btn--primary" type="button" onClick={onRetry}><span className="material-symbols-outlined">refresh</span>Try again</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function LoadingPane() {
  return (
    <div className="set-body" aria-busy="true">
      <div className="set-identity" style={{ alignItems: "center" }}>
        <span className="set-sk" style={{ width: 52, height: 52, borderRadius: 999 }}></span>
        <div style={{ flex: 1 }}><span className="set-sk" style={{ display: "block", width: 180, height: 16 }}></span><span className="set-sk" style={{ display: "block", width: 240, height: 12, marginTop: 8 }}></span></div>
        <span className="set-sk" style={{ width: 110, height: 26, borderRadius: 999 }}></span>
      </div>
      <div className="set-accordion">
        {[0,1,2,3].map(i => (
          <div className="set-acc-row" key={i}><div className="set-acc-trigger" style={{ cursor: "default" }}>
            <span className="set-sk" style={{ width: 24, height: 24, borderRadius: 6 }}></span>
            <span style={{ flex: 1 }}><span className="set-sk" style={{ display: "block", width: 160, height: 14 }}></span><span className="set-sk" style={{ display: "block", width: 280, height: 11, marginTop: 7 }}></span></span>
            <span className="set-sk" style={{ width: 20, height: 20, borderRadius: 6 }}></span>
          </div></div>
        ))}
      </div>
    </div>
  );
}

/* ── App ─────────────────────────────────────────────────────────────── */
function App() {
  const [active, setActive] = React.useState("org-permissions");
  const [surface, setSurface] = React.useState("main"); // main | empty | error | loading
  const [role, setRole] = React.useState("Paying Super Admin");
  const select = k => { setActive(k); setSurface("main"); };
  const onRole = r => {
    setRole(r);
    // If the open Organization pane isn't visible to the new role, fall back to
    // Overview (visible to every role). Account panes stay put.
    if (NAV.organization.some(i => i.key === active) && !orgKeysFor(r).includes(active)) {
      setActive("org-overview");
    }
  };

  const Pane = window.SETTINGS_PANES[active];
  const mainPane = Pane ? <Pane nav={select} role={role} label={labelFor(active)} /> : <PlaceholderPane label={labelFor(active)} />;

  const pane = surface === "empty" ? <EmptyPane />
    : surface === "error" ? <ErrorPane onRetry={() => setSurface("loading")} />
    : surface === "loading" ? <LoadingPane />
    : mainPane;

  const headLabel = surface === "main" ? labelFor(active) : "Profile";
  const headGroup = surface === "main" ? groupLabelFor(active) : "Account";

  return (
    <div className="suite-app">
      <SuiteRail active="settings" />
      <SettingsDrawer active={surface === "main" ? active : "profile"} setActive={select} role={role} />
      <main className="set-main">
        <div className="set-pagehead">
          <button className="set-back" type="button" aria-label="Back" title="Back"><span className="material-symbols-outlined">arrow_back</span></button>
          <div className="set-head-text">
            <div className="set-crumb">{headGroup}<span className="material-symbols-outlined">chevron_right</span>{headLabel}</div>
            <h1>{headLabel}</h1>
          </div>
          <label className="set-viewas" title="Preview the IA each org role actually sees">
            <span className="material-symbols-outlined">visibility</span>
            <span className="lbl">Viewing as</span>
            <select value={role} onChange={e => onRole(e.target.value)} aria-label="Viewing as role">
              {VIEW_ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </label>
          <button className="set-org-pill" type="button" title="Switch organisation">
            <span className="set-org-av">S</span>Somos HQ<span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
        {pane}
      </main>
      <SuiteStates
        states={[["main", "Profile"], ["empty", "Empty"], ["error", "Error"], ["loading", "Loading"]]}
        value={surface} onChange={setSurface}
      />
    </div>
  );
}
// Share helpers with settings-org.jsx / settings-gov.jsx, and register Account panes.
Object.assign(window, { Toggle, Segmented, SettingRow, GroupRow, AccRow, LinkRow, SaveFoot, SETTINGS_USER: USER });
Object.assign(window.SETTINGS_PANES, {
  profile: ProfilePane, preferences: PreferencesPane, security: SecurityPane, notifications: NotificationsPane,
});

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
