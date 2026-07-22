// settings-org.jsx — Organization panes. Registers into window.SETTINGS_PANES.
// Shared helpers come from settings.jsx (loaded first).
const { Toggle, SettingRow, AccRow, LinkRow, SaveFoot, SETTINGS_USER } = window;

/* network glyph colours use categorical tokens (never raw brand hex) */
const NET = {
  ig: { code: "IG", name: "Instagram", c: "var(--hs-cat-5-bg)", cf: "var(--hs-cat-5-fg)" },
  fb: { code: "FB", name: "Facebook",  c: "var(--hs-cat-3-bg)", cf: "var(--hs-cat-3-fg)" },
  li: { code: "LI", name: "LinkedIn",  c: "var(--hs-cat-1-bg)", cf: "var(--hs-cat-1-fg)" },
  x:  { code: "X",  name: "X",         c: "var(--hs-cat-9-bg)", cf: "var(--hs-cat-9-fg)" },
  tt: { code: "TT", name: "TikTok",    c: "var(--hs-cat-7-bg)", cf: "var(--hs-cat-7-fg)" },
};

/* row actions menu */
function RowMenu({ items, label }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label={label} title={label}
        aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
      {open && (
        <div className="set-menu" role="menu">
          {items.map((it, i) => it.sep
            ? <div key={i} className="set-menu-sep" />
            : <button key={i} role="menuitem" type="button" className={"set-menu-item" + (it.danger ? " danger" : "")}
                onClick={() => { setOpen(false); it.onClick && it.onClick(); }}>
                <span className="material-symbols-outlined">{it.icon}</span>{it.label}
              </button>)}
        </div>
      )}
    </span>
  );
}

function Av({ init, c, cf, size }) {
  return <span className="set-av" style={{ background: c, color: cf, width: size, height: size }}>{init}</span>;
}
function NetAv({ net, init, c, cf }) {
  const n = NET[net];
  return (
    <span className="set-net">
      <span className="set-av" style={{ background: c, color: cf }}>{init}</span>
      <span className="glyph" style={{ background: n.c, color: n.cf }}>{n.code}</span>
    </span>
  );
}

/* ── Organization › Overview ─────────────────────────────────────────── */
function OrgDelete({ onCancel }) {
  const NAME = "Somos HQ";
  const [typed, setTyped] = React.useState("");
  const armed = typed.trim() === NAME;
  return (
    <div className="set-acc-fields">
      <div className="set-note warn"><span className="material-symbols-outlined">warning</span>
        <span>Deleting this organisation is permanent and affects everyone in it. This cannot be undone.</span></div>
      <ul className="set-del-list">
        <li><span className="material-symbols-outlined">close</span>All members, teams, and their access</li>
        <li><span className="material-symbols-outlined">close</span>Every connected social account and its history</li>
        <li><span className="material-symbols-outlined">close</span>All scheduled posts, reports, and saved searches</li>
      </ul>
      <div className="set-field set-del-confirm">
        <label htmlFor="org-del">Type <b>{NAME}</b> to confirm</label>
        <input id="org-del" className="set-input" value={typed} onChange={e => setTyped(e.target.value)} placeholder={NAME} autoComplete="off" />
      </div>
      <div className="set-del-foot">
        <button className="hs-btn hs-btn--ghost" type="button" onClick={onCancel}>Cancel</button>
        <button className="set-danger-btn" type="button" disabled={!armed} aria-disabled={!armed}>
          <span className="material-symbols-outlined">delete_forever</span>Delete organisation
        </button>
      </div>
    </div>
  );
}

function OrgOverviewPane({ role }) {
  const [openKey, setOpenKey] = React.useState("orgname");
  const toggle = k => setOpenKey(p => (p === k ? null : k));
  const close = () => setOpenKey(null);
  const [memberVisible, setMemberVisible] = React.useState(true);
  const isPSA = role === "Paying Super Admin";
  // View Only sees Overview read-only — no edit accordions, no toggle, no delete.
  if (role === "View Only") {
    return (
      <div className="set-body">
        <div className="set-accordion">
          <div className="set-row"><span className="set-row-icon"><span className="material-symbols-outlined">corporate_fare</span></span><span className="set-row-text"><span className="set-row-title">Organisation name</span><span className="set-row-desc">Somos HQ</span></span></div>
          <div className="set-row"><span className="set-row-icon"><span className="material-symbols-outlined">image</span></span><span className="set-row-text"><span className="set-row-title">Organisation avatar</span><span className="set-row-desc">Set by an administrator</span></span></div>
          <div className="set-row"><span className="set-row-icon"><span className="material-symbols-outlined">visibility</span></span><span className="set-row-text"><span className="set-row-title">Member visibility</span><span className="set-row-desc">Members can see each other and the teams they belong to.</span></span><span className="set-row-ctrl"><span className="set-status neutral"><span className="material-symbols-outlined">check</span>On</span></span></div>
        </div>
        <div className="set-privnote"><span className="material-symbols-outlined">visibility</span>
          <span>You have view-only access to organisation settings. Contact an administrator to make changes.</span></div>
      </div>
    );
  }
  return (
    <div className="set-body">
      <div className="set-accordion">
        <AccRow item={{ key: "orgname", icon: "corporate_fare", title: "Organisation name", desc: "The name shown to members across Hootsuite." }}
          open={openKey === "orgname"} onToggle={() => toggle("orgname")}>
          <div className="set-acc-fields">
            <div className="set-field" style={{ maxWidth: 420 }}><label htmlFor="orgnm">Organisation name<span className="req">*</span></label><input id="orgnm" className="set-input" defaultValue="Somos HQ" /></div>
            <SaveFoot onCancel={close} label="Save" />
          </div>
        </AccRow>
        <AccRow item={{ key: "orgav", icon: "image", title: "Organisation avatar", desc: "A logo or image that represents your organisation." }}
          open={openKey === "orgav"} onToggle={() => toggle("orgav")}>
          <div className="set-acc-fields">
            <div className="set-photo">
              <span className="set-photo-av">S</span>
              <button className="hs-btn hs-btn--secondary hs-btn--sm" type="button"><span className="material-symbols-outlined">upload</span>Upload image</button>
              <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button"><span className="material-symbols-outlined">delete</span>Delete</button>
            </div>
            <SaveFoot onCancel={close} label="Save" />
          </div>
        </AccRow>
        <SettingRow icon="visibility" title="Member visibility" desc="Let members see each other and the teams they belong to.">
          <Toggle on={memberVisible} onChange={setMemberVisible} label="Member visibility" />
        </SettingRow>
        {/* Delete organisation is Paying-Super-Admin only. */}
        {isPSA && (
          <AccRow item={{ key: "del", icon: "delete", title: "Delete organisation", desc: "Permanently delete this organisation and everything in it.", danger: true }}
            open={openKey === "del"} onToggle={() => toggle("del")}>
            <OrgDelete onCancel={close} />
          </AccRow>
        )}
      </div>
    </div>
  );
}

/* ── Organization › Members ──────────────────────────────────────────── */
// People modelled person-outward: org role + team memberships + per-account
// social roles, each tagged with provenance (Direct vs via a Team). Social
// access in this org spans ORG_ACCT_TOTAL accounts.
const ORG_ACCT_TOTAL = 12;
const ORG_MEMBERS = [
  { id: "rw", init: "RW", c: "var(--hs-cat-1-bg)", cf: "var(--hs-cat-1-fg)", nm: "Ryan Williams", em: "ryan@somos.com", added: "12 Jan 2026", role: "Super Admin", status: "active",
    teams: [{ name: "Marketing", confers: "Team Admin · Advanced on its 5 accounts" }, { name: "Sales", confers: "Member · Editor on its 2 accounts" }],
    social: [
      { handle: "@somos", net: "ig", role: "Advanced", src: "Direct" },
      { handle: "Somos", net: "fb", role: "Advanced", src: "Marketing", ambiguous: true },
      { handle: "@somos.official", net: "tt", role: "Editor", src: "Marketing" },
      { handle: "@somos.care", net: "ig", role: "Editor", src: "Marketing" },
      { handle: "Somos Inc", net: "li", role: "Editor", src: "Marketing" },
      { handle: "Somos Careers", net: "fb", role: "Editor", src: "Sales" },
    ] },
  { id: "dp", init: "DP", c: "var(--hs-cat-3-bg)", cf: "var(--hs-cat-3-fg)", nm: "Devin Park", em: "devin@somos.com", added: "3 Feb 2026", role: "Admin", status: "active",
    teams: [{ name: "Marketing", confers: "Member · Editor on its accounts" }],
    social: [
      { handle: "@somos", net: "ig", role: "Editor", src: "Marketing" },
      { handle: "Somos", net: "fb", role: "Editor", src: "Marketing" },
      { handle: "@somos.official", net: "tt", role: "Editor", src: "Marketing" },
      { handle: "Somos Inc", net: "li", role: "Editor", src: "Marketing", ambiguous: true },
    ] },
  { id: "al", init: "AL", c: "var(--hs-cat-5-bg)", cf: "var(--hs-cat-5-fg)", nm: "Aisha Lund", em: "aisha@somos.com", added: "20 Feb 2026", role: "View Only", status: "active",
    teams: [], social: [] },
  { id: "tk", init: "TK", c: "var(--hs-cat-9-bg)", cf: "var(--hs-cat-9-fg)", nm: "Tomas Kane", em: "tomas@somos.com", added: "—", role: "Admin", status: "pending",
    teams: [{ name: "Sales", confers: "Member · Editor on its accounts" }], social: [] },
];
const ORG_ROLES = ["Primary Super Admin", "Super Admin", "Admin", "View Only", "Custom"];
// One-line role summaries for the bulk role picker (mirror the Permissions screen).
const ORG_ROLE_INFO = {
  "Super Admin": "Full administrative control across the organisation.",
  "Admin": "Manage teams, members and social accounts; assign roles up to Admin.",
  "View Only": "Read-only access — can view but not change anything.",
  "Custom": "A tailored role with hand-picked permissions.",
};
const AMBIG_TEXT = "The system stores one combined permission per member, so this access may also be set directly; removing the team may not remove it.";
// Per-member social-access summary for the table column, e.g. "Editor on 4 of 12".
function socialSummary(m) {
  if (m.status === "pending") return { label: "Pending invite", hint: null };
  const s = m.social || [];
  if (!s.length) return { label: "No social access", hint: null };
  const roles = Array.from(new Set(s.map(x => x.role)));
  const roleLabel = roles.length === 1 ? roles[0] : "Mixed";
  const anyDirect = s.some(x => x.src === "Direct");
  const anyTeam = s.some(x => x.src !== "Direct");
  const hint = anyDirect && anyTeam ? "Direct + via teams" : anyDirect ? "All direct" : "via teams";
  return { label: roleLabel + " on " + s.length + " of " + ORG_ACCT_TOTAL, hint };
}

function AddMemberModal({ onClose }) {
  const [picked, setPicked] = React.useState({ ig: true, li: true });
  const toggle = k => setPicked(p => ({ ...p, [k]: !p[k] }));
  return (
    <div className="set-modal-scrim" onClick={onClose}>
      <div className="set-modal" role="dialog" aria-modal="true" aria-label="Add member" onClick={e => e.stopPropagation()}>
        <div className="set-modal-head"><h2>Add member</h2>
          <button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label="Close" title="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
        </div>
        <div className="set-modal-body">
          <div className="set-field"><label htmlFor="am-email">Email address<span className="req">*</span></label><input id="am-email" className="set-input" type="email" placeholder="name@company.com" /></div>
          <div className="set-field">
            <label>Social accounts they can use</label>
            <div className="set-netpick">
              {Object.entries(NET).map(([k, n]) => (
                <button key={k} type="button" className={"set-netchip" + (picked[k] ? " on" : "")} aria-pressed={!!picked[k]} onClick={() => toggle(k)}>
                  <span className="dot" style={{ background: n.c, color: n.cf }}>{n.code}</span>{n.name}
                </button>
              ))}
            </div>
          </div>
          <div className="set-field"><label htmlFor="am-role">Role</label>
            <select id="am-role" className="set-input">
              {ORG_ROLES.filter(r => r !== "Primary Super Admin").map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="set-modal-foot">
          <button className="hs-btn hs-btn--ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="hs-btn hs-btn--primary" type="button" onClick={onClose}>Send invite</button>
        </div>
      </div>
    </div>
  );
}

/* ════ Reusable primitive — SOURCE CHIP (access provenance) ═══════════════
   Bento badge: "Direct" (neutral) or "via [Team]" (info). The ambiguous variant
   adds an info affordance carrying the combined-permission caveat. Never renders
   editable per-source checkboxes — provenance is display-only. */
function SourceChip({ src, ambiguous }) {
  if (src === "Direct")
    return <span className="hs-badge hs-badge--neutral set-srcchip"><span className="material-symbols-outlined">person</span>Direct</span>;
  return (
    <span className="hs-badge hs-badge--info set-srcchip">
      <span className="material-symbols-outlined">groups</span>via {src}
      {ambiguous && (
        <button type="button" className="set-srcchip-i" aria-label={AMBIG_TEXT} title={AMBIG_TEXT}>
          <span className="material-symbols-outlined">info</span>
        </button>
      )}
    </span>
  );
}

/* ════ Reusable primitive — SELECTION TOOLBAR (snowflake) ═════════════════
   Composed from Bento tokens + buttons (no Bento bulk-action-bar component
   exists). Sticky inside the panel; "N selected" + clear + contextual actions.
   Actions autosave with an undo toast — no per-section Save button. */
function SelectionToolbar({ count, onClear, children }) {
  return (
    <div className="set-seltoolbar" role="region" aria-label={count + " selected"}>
      <span className="cnt"><b>{count}</b> selected</span>
      <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button" onClick={onClear}><span className="material-symbols-outlined">close</span>Clear</button>
      <span className="set-seltoolbar-sep"></span>
      <div className="set-seltoolbar-act">{children}</div>
    </div>
  );
}

/* Upward popover used by the toolbar (role picker, team picker). */
function ToolbarMenu({ icon, label, width, children }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span className="material-symbols-outlined">{icon}</span>{label}<span className="material-symbols-outlined chev">expand_more</span>
      </button>
      {open && <div className="set-menu set-menu--up" role="menu" style={{ minWidth: width }}>{children(() => setOpen(false))}</div>}
    </span>
  );
}

/* Checkbox (Bento .hs-check) as a button so it supports the mixed state. */
function Check({ on, indeterminate, onChange, label }) {
  return (
    <button type="button" role="checkbox" aria-checked={indeterminate ? "mixed" : on} aria-label={label}
      className={"hs-check" + (indeterminate ? " indeterminate" : on ? " is-on" : "")}
      onClick={e => { e.stopPropagation(); onChange(!on); }}></button>
  );
}

/* Autosave toast with optional undo. */
function useToasts() {
  const [toasts, setToasts] = React.useState([]);
  const push = (msg, opts) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg, ...(opts || {}) }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), (opts && opts.duration) || 6000);
  };
  const dismiss = id => setToasts(t => t.filter(x => x.id !== id));
  return { toasts, push, dismiss };
}
function ToastStack({ toasts, dismiss }) {
  return (
    <div className="set-toasts" role="status" aria-live="polite">
      {toasts.map(t => (
        <div className="set-toast" key={t.id}>
          <span className="material-symbols-outlined">{t.icon || "check_circle"}</span>
          <span className="msg">{t.msg}</span>
          {t.undo && <button className="undo" type="button" onClick={() => { t.undo(); dismiss(t.id); }}>Undo</button>}
          <button className="x" type="button" aria-label="Dismiss" title="Dismiss" onClick={() => dismiss(t.id)}><span className="material-symbols-outlined">close</span></button>
        </div>
      ))}
    </div>
  );
}

/* Member detail (person-outward): org role + team memberships (with the access
   each confers) + per-account social roles tagged with the Source chip. */
function MemberDetail({ m, onClose, push }) {
  const [confirmTeam, setConfirmTeam] = React.useState(null);
  const hasDirect = (m.social || []).some(s => s.src === "Direct");
  React.useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  const first = m.nm.split(" ")[0];
  const doRemove = t => push("Removed " + first + " from " + t.name, { icon: "group_remove", undo: () => {} });
  const onRemoveTeam = t => { if (hasDirect) { setConfirmTeam(t); } else { doRemove(t); } };
  return (
    <React.Fragment>
      <div className="set-fd-scrim" onClick={onClose}></div>
      <div className="set-mdrawer" role="dialog" aria-modal="true" aria-label={"Access for " + m.nm}>
        <div className="set-mdrawer-head">
          <div className="set-cell"><Av init={m.init} c={m.c} cf={m.cf} size={44} /><span><span className="nm" style={{ fontSize: 16 }}>{m.nm}</span><span className="em">{m.em}</span></span></div>
          <button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label="Close" title="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
        </div>
        <div className="set-mdrawer-body">
          <section className="set-mdsec">
            <div className="set-mdsec-h">Organisation role</div>
            <div className="set-mdrow"><span className="hs-badge hs-badge--neutral" style={{ height: 26 }}>{m.role}</span><span className="set-mdrow-sum">{ORG_ROLE_INFO[m.role] || "Owns the organisation — full control of everything."}</span></div>
          </section>

          <section className="set-mdsec">
            <div className="set-mdsec-h">Team memberships <span className="n">{m.teams.length}</span></div>
            {m.teams.length === 0 ? <div className="set-mdempty">Not a member of any team.</div> :
              m.teams.map((t, i) => (
                <div className="set-mdteam" key={i}>
                  <span className="material-symbols-outlined ic">groups</span>
                  <span className="set-mdteam-tx"><span className="nm">{t.name}</span><span className="confers">{t.confers}</span></span>
                  <button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label={"Remove from " + t.name} title={"Remove from " + t.name} onClick={() => onRemoveTeam(t)}><span className="material-symbols-outlined">close</span></button>
                </div>
              ))}
            {confirmTeam && (
              <div className="set-note warn set-mdwarn"><span className="material-symbols-outlined">warning</span>
                <div><b>{first} also has direct access to some accounts.</b> Removing them from {confirmTeam.name} won’t remove access they hold directly.
                  <div className="set-mdwarn-act">
                    <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button" onClick={() => setConfirmTeam(null)}>Cancel</button>
                    <button className="hs-btn hs-btn--secondary hs-btn--sm" type="button" onClick={() => { const t = confirmTeam; setConfirmTeam(null); doRemove(t); }}>Remove from team</button>
                  </div>
                </div></div>
            )}
          </section>

          <section className="set-mdsec">
            <div className="set-mdsec-h">Social account access <span className="n">{(m.social || []).length}</span></div>
            {(m.social || []).length === 0 ? <div className="set-mdempty">No social account access.</div> :
              m.social.map((s, i) => (
                <div className="set-mdacct" key={i}>
                  <NetAv net={s.net} init="SO" c={NET_AV[s.net][0]} cf={NET_AV[s.net][1]} />
                  <span className="set-mdacct-tx"><span className="nm">{s.handle}</span><span className="role">{s.role}</span></span>
                  <SourceChip src={s.src} ambiguous={s.ambiguous} />
                </div>
              ))}
          </section>
        </div>
      </div>
    </React.Fragment>
  );
}

function OrgMembersPane({ role }) {
  const [phase] = React.useState("ready"); // ready | loading | error — all states exist for review
  const [tab, setTab] = React.useState("active");
  const [modal, setModal] = React.useState(false);
  const [members, setMembers] = React.useState(ORG_MEMBERS);
  const [sel, setSel] = React.useState(() => new Set());
  const [detailId, setDetailId] = React.useState(null);
  const { toasts, push, dismiss } = useToasts();

  // View Only never manages Members — permission state.
  if (role === "View Only") {
    return (
      <div className="set-body">
        <div className="set-permstate">
          <span className="material-symbols-outlined">lock</span>
          <div className="t">You don’t have access to members</div>
          <div className="d">View-only members can’t see or manage the people in this organisation. Contact an administrator if you need access.</div>
        </div>
      </div>
    );
  }

  // Admin assigns only up to their own level — never Super Admin / Primary Super Admin.
  const isAdmin = role === "Admin";
  const aboveAdmin = r => r === "Primary Super Admin" || r === "Super Admin";
  const assignable = isAdmin ? ["Admin", "View Only", "Custom"] : ["Super Admin", "Admin", "View Only", "Custom"];
  const rows = members.filter(m => (tab === "active" ? m.status === "active" : m.status === "pending"));
  const actionable = rows.filter(m => m.role !== "Primary Super Admin" && !(isAdmin && aboveAdmin(m.role)));
  const allOn = actionable.length > 0 && actionable.every(m => sel.has(m.id));
  const someOn = sel.size > 0 && !allOn;
  const toggleAll = on => setSel(on ? new Set(actionable.map(m => m.id)) : new Set());
  const toggleOne = (id, on) => setSel(s => { const n = new Set(s); on ? n.add(id) : n.delete(id); return n; });
  const clear = () => setSel(new Set());

  const applyRole = roleName => {
    const ids = new Set(sel), snapshot = members, n = ids.size;
    setMembers(ms => ms.map(m => ids.has(m.id) ? { ...m, role: roleName } : m));
    clear();
    push("Set " + n + " member" + (n > 1 ? "s" : "") + " to " + roleName, { icon: "manage_accounts", undo: () => setMembers(snapshot) });
  };
  const applyTeam = team => { const n = sel.size; clear(); push("Added " + n + " member" + (n > 1 ? "s" : "") + " to " + team, { icon: "group_add", undo: () => {} }); };
  const applyRemove = () => {
    const ids = new Set(sel), snapshot = members, removed = members.filter(m => ids.has(m.id));
    setMembers(ms => ms.filter(m => !ids.has(m.id)));
    clear();
    push("Removed " + removed.length + " member" + (removed.length > 1 ? "s" : ""), { icon: "person_remove", undo: () => setMembers(snapshot) });
  };

  const detailM = members.find(m => m.id === detailId);

  return (
    <div className="set-body">
      <div className="set-panel">
        <div className="set-panel-head">
          <div className="grow"><div className="set-panel-title">All members</div><div className="set-panel-sub">{members.length} people · 2 seats remaining</div></div>
          <button className="hs-btn hs-btn--primary" type="button" onClick={() => setModal(true)}><span className="material-symbols-outlined">add</span>Add member</button>
        </div>
        <div className="set-toolbar">
          <div className="hs-tabs" role="tablist">
            <button className={"hs-tab" + (tab === "active" ? " is-active" : "")} role="tab" aria-selected={tab === "active"} onClick={() => { setTab("active"); clear(); }}>Active</button>
            <button className={"hs-tab" + (tab === "pending" ? " is-active" : "")} role="tab" aria-selected={tab === "pending"} onClick={() => { setTab("pending"); clear(); }}>Pending</button>
          </div>
          <div className="grow"></div>
          <button className="cf" type="button">Permissions<span className="material-symbols-outlined chev">expand_more</span></button>
          <button className="cf" type="button">Status<span className="material-symbols-outlined chev">expand_more</span></button>
        </div>

        {phase === "loading" ? (
          <div className="set-skel" aria-busy="true" aria-label="Loading members">
            {[0, 1, 2, 3].map(i => <div className="set-skel-row" key={i}><span className="set-skel-dot"></span><span className="set-skel-line"></span></div>)}
          </div>
        ) : phase === "error" ? (
          <div className="set-note warn" style={{ margin: "var(--bento-space-05)" }}><span className="material-symbols-outlined">error</span>
            <span>We couldn’t load members. <button className="hs-linkbtn" type="button">Try again</button></span></div>
        ) : rows.length === 0 ? (
          <div className="set-emptystate">
            <span className="material-symbols-outlined">group_off</span>
            <div className="t">No {tab === "pending" ? "pending invites" : "active members"}</div>
            <div className="d">{tab === "pending" ? "Invitations you send appear here until they’re accepted." : "Add members to start collaborating."}</div>
          </div>
        ) : (
        <table className="set-table set-table--select">
          <thead><tr>
            <th className="set-checkcol"><Check on={allOn} indeterminate={someOn} onChange={toggleAll} label="Select all members" /></th>
            <th>Member</th><th>Social access</th><th>Added on</th><th>Permissions</th><th className="right">Actions</th>
          </tr></thead>
          <tbody>
            {rows.map(m => {
              const locked = m.role === "Primary Super Admin" || (isAdmin && aboveAdmin(m.role));
              const ss = socialSummary(m);
              return (
              <tr key={m.id} className={sel.has(m.id) ? "sel" : ""}>
                <td className="set-checkcol">{locked ? <span className="set-checklock" title="You can’t manage this member" aria-label="You can’t manage this member"><span className="material-symbols-outlined">lock</span></span> : <Check on={sel.has(m.id)} indeterminate={false} onChange={on => toggleOne(m.id, on)} label={"Select " + m.nm} />}</td>
                <td><button className="set-cell set-cell--btn" type="button" onClick={() => setDetailId(m.id)} aria-label={"View " + m.nm}><Av init={m.init} c={m.c} cf={m.cf} /><span><span className="nm">{m.nm}</span><span className="em">{m.em}</span></span></button></td>
                <td>{ss.hint ? <span className="set-social-sum"><span className="lbl">{ss.label}</span><span className="hint">{ss.hint}</span></span> : <span style={{ color: "var(--bento-theme-color-text-subtle)" }}>{ss.label}</span>}</td>
                <td style={{ color: "var(--bento-theme-color-text-subtle)" }}>{m.added}</td>
                <td>
                  <select className="set-rolesel" value={m.role} onChange={e => setMembers(ms => ms.map(x => x.id === m.id ? { ...x, role: e.target.value } : x))} aria-label={"Permissions for " + m.nm} disabled={locked}>
                    {(assignable.includes(m.role) ? assignable : [m.role, ...assignable]).map(r => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className="right"><RowMenu label={"Actions for " + m.nm} items={[
                  { icon: "person", label: "View details", onClick: () => setDetailId(m.id) },
                  { icon: "mail", label: m.status === "pending" ? "Resend invite" : "Email member" },
                  { sep: true },
                  { icon: "person_remove", label: "Remove from org", danger: true },
                ]} /></td>
              </tr>
            ); })}
          </tbody>
        </table>
        )}

        {sel.size > 0 && (
          <SelectionToolbar count={sel.size} onClear={clear}>
            <ToolbarMenu icon="manage_accounts" label="Set org role" width={320}>
              {close => (
                <div className="set-rolemenu">
                  <div className="set-menu-lab">Set org role</div>
                  {assignable.map(r => (
                    <button key={r} role="menuitemradio" aria-checked="false" type="button" className="set-rolemenu-item" onClick={() => { applyRole(r); close(); }}>
                      <span className="nm">{r}</span>
                      <span className="sum">{ORG_ROLE_INFO[r] || "A tailored role with hand-picked permissions."}</span>
                    </button>
                  ))}
                  {isAdmin && <div className="set-rolemenu-note"><span className="material-symbols-outlined">info</span>You can assign roles up to your own level (Admin).</div>}
                </div>
              )}
            </ToolbarMenu>
            <ToolbarMenu icon="group_add" label="Add to team" width={240}>
              {close => (
                <div>
                  <div className="set-menu-lab">Add to team</div>
                  {TEAMS.map(t => <button key={t.nm} role="menuitem" type="button" className="set-menu-item" onClick={() => { applyTeam(t.nm); close(); }}><span className="material-symbols-outlined">groups</span>{t.nm}</button>)}
                </div>
              )}
            </ToolbarMenu>
            <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button" onClick={applyRemove}><span className="material-symbols-outlined">person_remove</span>Remove</button>
          </SelectionToolbar>
        )}
      </div>
      <div className="set-bulk">
        <span className="material-symbols-outlined">upload_file</span>
        <div className="set-bulk-text"><div className="set-bulk-title">Add members in bulk</div><div className="set-bulk-desc">Upload a CSV of email addresses and roles to invite many people at once.</div></div>
        <button className="hs-btn hs-btn--secondary hs-btn--sm" type="button"><span className="material-symbols-outlined">upload</span>Upload CSV</button>
      </div>
      {modal && <AddMemberModal onClose={() => setModal(false)} />}
      {detailM && <MemberDetail m={detailM} onClose={() => setDetailId(null)} push={push} />}
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </div>
  );
}

/* ── Organization › Teams ────────────────────────────────────────────── */
const TEAMS = [
  { nm: "Marketing", created: "12 Jan 2026", admins: [["RW","var(--hs-cat-1-bg)","var(--hs-cat-1-fg)"],["DP","var(--hs-cat-3-bg)","var(--hs-cat-3-fg)"]], members: 8, accounts: 5 },
  { nm: "Customer Care", created: "3 Feb 2026", admins: [["AL","var(--hs-cat-5-bg)","var(--hs-cat-5-fg)"]], members: 6, accounts: 3 },
  { nm: "Sales", created: "20 Feb 2026", admins: [["TK","var(--hs-cat-9-bg)","var(--hs-cat-9-fg)"],["RW","var(--hs-cat-1-bg)","var(--hs-cat-1-fg)"]], members: 4, accounts: 2 },
];
function OrgTeamsPane() {
  return (
    <div className="set-body">
      <div className="set-panel">
        <div className="set-panel-head">
          <div className="grow"><div className="set-panel-title">All teams</div><div className="set-panel-sub">{TEAMS.length} teams</div></div>
          <button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">add</span>Create team</button>
        </div>
        <table className="set-table">
          <thead><tr><th>Team</th><th>Created on</th><th>Team admins</th><th className="num">Members</th><th className="num">Social accounts</th><th className="right">Actions</th></tr></thead>
          <tbody>
            {TEAMS.map((t, i) => (
              <tr key={i}>
                <td><span className="nm" style={{ fontWeight: 600 }}>{t.nm}</span></td>
                <td style={{ color: "var(--bento-theme-color-text-subtle)" }}>{t.created}</td>
                <td><span className="set-avstack">{t.admins.map((a, j) => <span key={j} className="set-av" style={{ background: a[1], color: a[2] }}>{a[0]}</span>)}</span></td>
                <td className="num">{t.members}</td>
                <td className="num">{t.accounts}</td>
                <td className="right"><RowMenu label={"Actions for " + t.nm} items={[
                  { icon: "visibility", label: "View details" },
                  { icon: "group_add", label: "Add members" },
                  { icon: "hub", label: "Assign social accounts" },
                  { sep: true },
                  { icon: "delete", label: "Delete team", danger: true },
                ]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Organization › Social Accounts & Connection Health ──────────────── */
// Org-admin scope = team accounts only. Private accounts stay with their owner.
const NET_AV = { ig: ["var(--hs-cat-5-bg)","var(--hs-cat-5-fg)"], fb: ["var(--hs-cat-3-bg)","var(--hs-cat-3-fg)"], li: ["var(--hs-cat-1-bg)","var(--hs-cat-1-fg)"], x: ["var(--hs-cat-9-bg)","var(--hs-cat-9-fg)"], tt: ["var(--hs-cat-7-bg)","var(--hs-cat-7-fg)"] };
const ACCOUNTS = [
  { net: "ig", handle: "@somos",          added: "12 Jan 2026", status: "ok",   team: "Marketing",     perm: "Advanced" },
  { net: "fb", handle: "Somos",           added: "12 Jan 2026", status: "ok",   team: "Marketing",     perm: "Advanced" },
  { net: "li", handle: "Somos Inc",       added: "3 Feb 2026",  status: "warn", team: "Customer Care", perm: "Editor" },
  { net: "x",  handle: "@somos",          added: "20 Feb 2026", status: "warn", team: "Sales",         perm: "Editor" },
  { net: "tt", handle: "@somos.official", added: "5 Mar 2026",  status: "ok",   team: "Marketing",     perm: "Limited" },
  { net: "ig", handle: "@somos.care",     added: "8 Mar 2026",  status: "warn", team: "Customer Care", perm: "Editor" },
  { net: "fb", handle: "Somos Careers",   added: "15 Mar 2026", status: "ok",   team: "Sales",         perm: "Advanced" },
  { net: "li", handle: "Somos Eng",       added: "20 Mar 2026", status: "ok",   team: "Sales",         perm: "Limited" },
];
const PRIVATE_COUNT = 1;

function StatusPill({ status }) {
  if (status === "ok") return <span className="set-status ok"><span className="material-symbols-outlined">check_circle</span>Connected</span>;
  return <span className="set-status warn"><span className="material-symbols-outlined">warning</span>Disconnected</span>;
}

/* Connection-health widget — per-network connected / disconnected bars. */
function ConnectionHealth() {
  const nets = ["ig", "fb", "li", "x", "tt"].filter(n => ACCOUNTS.some(a => a.net === n));
  const total = ACCOUNTS.length;
  const connected = ACCOUNTS.filter(a => a.status === "ok").length;
  const attention = total - connected;
  return (
    <section className="set-health" aria-label="Connection health">
      <div className="set-health-top">
        <span className="v">{connected}/{total}</span>
        <span className="l">accounts connected</span>
        {attention > 0 && <span className="att"><span className="material-symbols-outlined">warning</span>{attention} need attention</span>}
      </div>
      <div className="set-hgrid">
        {nets.map(n => {
          const list = ACCOUNTS.filter(a => a.net === n);
          const ok = list.filter(a => a.status === "ok").length;
          const warn = list.length - ok;
          const okPct = Math.round((ok / list.length) * 100);
          return (
            <div className="set-hrow" key={n}>
              <span className="set-glyph net" style={{ background: NET[n].c, color: NET[n].cf }}>{NET[n].code}</span>
              <span className="nm">{NET[n].name}</span>
              <span className="set-hbar" role="img" aria-label={NET[n].name + ": " + ok + " connected, " + warn + " need attention"}>
                <span className="ok" style={{ width: okPct + "%" }}></span>
                <span className="warn" style={{ width: (100 - okPct) + "%" }}></span>
              </span>
              <span className="cnt">{ok} ok{warn > 0 && <> · <b>{warn} ⚠</b></>}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* Bento filter drawer ("Filter base") — four groups, each defaults to All;
   Status lands on Disconnected (this is a remediation surface). */
const FILTER_GROUPS = [
  { key: "team", label: "Team", opts: ["All", "Marketing", "Customer Care", "Sales"] },
  { key: "status", label: "Status", opts: ["All", "Connected", "Disconnected"] },
  { key: "perm", label: "Permission", opts: ["All", "Advanced", "Editor", "Limited"] },
  { key: "net", label: "Social account", opts: ["All", "Instagram", "Facebook", "LinkedIn", "X", "TikTok"] },
];
const NET_NAME = { ig: "Instagram", fb: "Facebook", li: "LinkedIn", x: "X", tt: "TikTok" };
function matchAccount(a, f) {
  if (f.team !== "All" && a.team !== f.team) return false;
  if (f.status !== "All" && (f.status === "Connected" ? a.status !== "ok" : a.status !== "warn")) return false;
  if (f.perm !== "All" && a.perm !== f.perm) return false;
  if (f.net !== "All" && NET_NAME[a.net] !== f.net) return false;
  return true;
}

function FilterDrawer({ filters, onApply, onClose }) {
  const [draft, setDraft] = React.useState(filters);
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const countFor = (gkey, opt) => {
    if (opt === "All") return ACCOUNTS.length;
    const probe = { ...{ team: "All", status: "All", perm: "All", net: "All" }, [gkey]: opt };
    return ACCOUNTS.filter(a => matchAccount(a, probe)).length;
  };
  return (
    <React.Fragment>
      <div className="set-fd-scrim" onClick={onClose}></div>
      <div className="set-fd" role="dialog" aria-modal="true" aria-label="Filter social accounts">
        <div className="set-fd-head"><h2>Filters</h2>
          <button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label="Close filters" title="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
        </div>
        <div className="set-fd-body">
          {FILTER_GROUPS.map(g => (
            <div className="set-fd-group" key={g.key}>
              <div className="set-fd-grouptitle">{g.label}{draft[g.key] !== "All" && <span className="n">{draft[g.key]}</span>}</div>
              {g.opts.map(opt => {
                const on = draft[g.key] === opt;
                return (
                  <label className="set-fd-opt" key={opt}>
                    <span className={"hs-radio" + (on ? " is-on" : "")} aria-hidden="true"></span>
                    <input type="radio" name={"fd-" + g.key} checked={on} onChange={() => set(g.key, opt)} style={{ position: "absolute", opacity: 0 }} />
                    <span className="lbl">{opt}</span>
                    <span className="n">{countFor(g.key, opt)}</span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
        <div className="set-fd-foot">
          <button className="hs-btn hs-btn--ghost" type="button" onClick={() => setDraft({ team: "All", status: "All", perm: "All", net: "All" })}>Clear all</button>
          <span className="grow"></span>
          <button className="hs-btn hs-btn--primary" type="button" onClick={() => onApply(draft)}>Show results</button>
        </div>
      </div>
    </React.Fragment>
  );
}

function OrgAccountsPane({ role }) {
  // Status lands on "Disconnected" — remediation focus; other groups default to All.
  const [filters, setFilters] = React.useState({ team: "All", status: "Disconnected", perm: "All", net: "All" });
  const [drawer, setDrawer] = React.useState(false);
  // Disconnect + Transfer are Super-Admin-only; Admin keeps connect / reconnect / assign-to-team.
  const isSA = role === "Super Admin" || role === "Paying Super Admin";
  const menuFor = a => {
    const base = a.status === "warn"
      ? [{ icon: "sync", label: "Reconnect" }, { icon: "settings", label: "Edit settings" }, { icon: "groups", label: "Assign to team" }]
      : [{ icon: "settings", label: "Edit settings" }, { icon: "sync", label: "Reconnect" }, { icon: "groups", label: "Assign to team" }];
    if (isSA) base.push({ sep: true }, { icon: "swap_horiz", label: "Transfer ownership" }, { icon: "link_off", label: "Disconnect", danger: true });
    return base;
  };
  const rows = ACCOUNTS.filter(a => matchAccount(a, filters));
  const activeCount = Object.entries(filters).filter(([, v]) => v !== "All").length;
  const STATUS_SEG = ["All", "Connected", "Disconnected"];
  return (
    <div className="set-body">
      <ConnectionHealth />
      <div className="set-privnote"><span className="material-symbols-outlined">lock</span>
        <span>{PRIVATE_COUNT} private account is managed by its owner and stays outside organisation settings.</span></div>
      <div className="set-panel">
        <div className="set-panel-head">
          <div className="grow"><div className="set-panel-title">All social accounts</div><div className="set-panel-sub">{ACCOUNTS.length} accounts · {ACCOUNTS.filter(a => a.status === "warn").length} need attention</div></div>
          <button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">add</span>Add social account</button>
        </div>
        <div className="set-acct-bar">
          <div className="set-seg" role="radiogroup" aria-label="Connection status">
            {STATUS_SEG.map(s => (
              <button key={s} type="button" role="radio" aria-checked={filters.status === s} className={filters.status === s ? "on" : ""} onClick={() => setFilters(f => ({ ...f, status: s }))}>{s}</button>
            ))}
          </div>
          <span className="set-search-inline"><span className="material-symbols-outlined">search</span><input placeholder="Search accounts" aria-label="Search accounts" /></span>
          <div className="grow"></div>
          <button className="set-filterbtn" type="button" onClick={() => setDrawer(true)} aria-label="Open filters" title="Filters">
            <span className="material-symbols-outlined">tune</span>Filters{activeCount > 0 && <span className="set-fcount">{activeCount}</span>}
          </button>
        </div>
        {rows.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--bento-theme-color-text-subtle)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, display: "block", marginBottom: 8, color: "var(--bento-theme-color-icon-disabled)" }}>filter_alt_off</span>
            <div style={{ fontWeight: 700, color: "var(--bento-theme-color-text-base)" }}>No accounts match these filters</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>Try clearing a filter to see more accounts.</div>
          </div>
        ) : (
        <table className="set-table">
          <thead><tr><th>Social account</th><th>Added on</th><th>Status</th><th>Team</th><th>Permission</th><th className="right">Actions</th></tr></thead>
          <tbody>
            {rows.map((a, i) => (
              <tr key={i}>
                <td><div className="set-acct"><NetAv net={a.net} init="SO" c={NET_AV[a.net][0]} cf={NET_AV[a.net][1]} /><span><span className="nm" style={{ fontWeight: 600, display: "block" }}>{a.handle}</span><span className="em" style={{ fontSize: 13, color: "var(--bento-theme-color-text-subtle)" }}>{NET[a.net].name}</span></span></div></td>
                <td style={{ color: "var(--bento-theme-color-text-subtle)" }}>{a.added}</td>
                <td><StatusPill status={a.status} /></td>
                <td>{a.team}</td>
                <td style={{ color: "var(--bento-theme-color-text-subtle)" }}>{a.perm}</td>
                <td className="right"><RowMenu label={"Actions for " + a.handle} items={menuFor(a)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      {drawer && <FilterDrawer filters={filters} onApply={f => { setFilters(f); setDrawer(false); }} onClose={() => setDrawer(false)} />}
    </div>
  );
}

/* ── Organization › Permissions & Roles ──────────────────────────────── */
// Built in settings-permissions.jsx (unified 3-tier screen). Registered there.

/* ── Organization › Seats & Licences ─────────────────────────────────── */
function OrgSeatsPane() {
  const TEAM_LIMITS = [
    ["Marketing", 8, 10, 5, 8],
    ["Customer Care", 6, 8, 3, 5],
    ["Sales", 4, 6, 2, 4],
  ];
  return (
    <div className="set-body">
      <div className="set-summary">
        <div className="set-sumcard"><div className="k"><span className="material-symbols-outlined">event_seat</span>Member seats</div><div className="v">18 / 20</div><div className="sub">2 seats available</div></div>
        <div className="set-sumcard"><div className="k"><span className="material-symbols-outlined">hub</span>Social account licences</div><div className="v">10 / 15</div><div className="sub">5 licences available</div></div>
        <div className="set-sumcard"><div className="k"><span className="material-symbols-outlined">workspace_premium</span>Plan</div><div className="v" style={{ fontSize: 22 }}>Enterprise</div><div className="sub">Renews 12 Jan 2027</div></div>
      </div>
      <div className="set-panel">
        <div className="set-panel-head"><div className="grow"><div className="set-panel-title">Team limits</div><div className="set-panel-sub">Seats and social-account allocation per team</div></div></div>
        <table className="set-table">
          <thead><tr><th>Team</th><th className="num">Members</th><th className="num">Seat limit</th><th className="num">Social accounts</th><th className="num">Account limit</th></tr></thead>
          <tbody>
            {TEAM_LIMITS.map((r, i) => (
              <tr key={i}>
                <td><span className="nm" style={{ fontWeight: 600 }}>{r[0]}</span></td>
                <td className="num">{r[1]}</td><td className="num">{r[2]}</td><td className="num">{r[3]}</td><td className="num">{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Organization › Billing & plan ───────────────────────────────────── */
function OrgBillingPane({ role }) {
  // Super Admin: read / entry only (footnoted). Paying Super Admin: full edit.
  const isPSA = role === "Paying Super Admin";
  return (
    <div className="set-body">
      <div className="set-panel">
        <div className="set-panel-head"><div className="grow"><div className="set-panel-title">Current plan</div><div className="set-panel-sub">Enterprise · billed annually</div></div>
          <span className="hs-badge hs-badge--positive"><span className="material-symbols-outlined">check_circle</span>Active</span>
        </div>
        <div style={{ padding: "var(--bento-space-05)", display: "flex", flexDirection: "column", gap: "var(--bento-space-04)" }}>
          <div className="set-summary" style={{ maxWidth: "none" }}>
            <div className="set-sumcard"><div className="k">Plan</div><div className="v" style={{ fontSize: 22 }}>Enterprise</div></div>
            <div className="set-sumcard"><div className="k">Renews</div><div className="v" style={{ fontSize: 22 }}>12 Jan 2027</div></div>
            <div className="set-sumcard"><div className="k">Seats</div><div className="v" style={{ fontSize: 22 }}>20</div></div>
          </div>
          <div className="set-note info"><span className="material-symbols-outlined">info</span>
            <span>Billing, invoices, and payment methods are managed in the billing portal, outside Settings.{!isPSA && " As a Super Admin you can view and enter billing; only the Paying Super Admin can change the plan."}</span></div>
          <div><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">open_in_new</span>{isPSA ? "Manage billing" : "View billing"}</button></div>
        </div>
      </div>
    </div>
  );
}

/* ── Organization › Integrations ─────────────────────────────────────── */
const MCP = [
  { icon: "smart_toy", name: "Claude (Anthropic)", desc: "Let approved agents draft and analyse content through the Model Context Protocol.", connected: true },
  { icon: "dataset", name: "Snowflake", desc: "Sync audience and performance data to your warehouse.", connected: false },
  { icon: "hub", name: "Zapier MCP", desc: "Bridge Hootsuite actions to thousands of apps over MCP.", connected: false },
];
const APPS = [
  { icon: "image", name: "Canva", desc: "Design and import visuals without leaving the composer.", connected: true },
  { icon: "support_agent", name: "Zendesk", desc: "Turn social conversations into support tickets.", connected: false },
  { icon: "shopping_bag", name: "Shopify", desc: "Tag products from your store in posts.", connected: false },
];
function IntgRow({ it }) {
  return (
    <div className="set-intg">
      <span className="set-intg-icon"><span className="material-symbols-outlined">{it.icon}</span></span>
      <div className="set-intg-text">
        <div className="set-intg-name">{it.name}{it.connected && <span className="hs-badge hs-badge--positive"><span className="material-symbols-outlined">check_circle</span>Connected</span>}</div>
        <div className="set-intg-desc">{it.desc}</div>
      </div>
      <button className={"hs-btn hs-btn--sm " + (it.connected ? "hs-btn--ghost" : "hs-btn--secondary")} type="button">
        {it.connected ? "Manage" : "Connect"}
      </button>
    </div>
  );
}
function OrgMcpPane() {
  return (
    <div className="set-body">
      <div className="set-section">
        <h2>MCP connectors</h2>
        <div className="sub">Give approved AI agents access to your Hootsuite data and actions through the Model Context Protocol.</div>
        <div className="set-panel" style={{ maxWidth: "none" }}>{MCP.map((it, i) => <IntgRow key={i} it={it} />)}</div>
        <div style={{ marginTop: "var(--bento-space-04)" }}><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">add</span>Add MCP connector</button></div>
      </div>
    </div>
  );
}
function OrgIntegrationsPane() {
  return (
    <div className="set-body">
      <div className="set-section">
        <h2>Apps</h2>
        <div className="sub">Extend Hootsuite with apps from the marketplace.</div>
        <div className="set-panel" style={{ maxWidth: "none" }}>{APPS.map((it, i) => <IntgRow key={i} it={it} />)}</div>
        <div style={{ marginTop: "var(--bento-space-04)" }}><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">storefront</span>Browse app marketplace</button></div>
      </div>
    </div>
  );
}

Object.assign(window.SETTINGS_PANES, {
  "org-overview": OrgOverviewPane,
  "org-members": OrgMembersPane,
  "org-teams": OrgTeamsPane,
  "org-accounts": OrgAccountsPane,
  "org-seats": OrgSeatsPane,
  "org-billing": OrgBillingPane,
  "org-mcp": OrgMcpPane,
  "org-integrations": OrgIntegrationsPane,
});
