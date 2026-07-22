// snav-members.jsx — Members page (the priority surface).
// Reuses real Bento: .hs-table (rows + .is-selected), .hs-avatar, .hs-check,
// .hs-badge (role + access tags), .hs-input, .hs-btn. Popover menus are a
// flagged snowflake (.snav-menu) — components.css ships no Bento Menu.
// Behaviors: row checkboxes + select-all (indeterminate), floating bulk-action
// bar on selection (change role / add to team / remove, each with undo toast),
// an access column tagged Direct / Via [team], a right drawer showing effective
// access (direct vs via-team), and a full-page Transfer & offboard flow.

const SEED = [
  { id: "ava",    name: "Ava Chen",      init: "AC", c: 1, email: "ava@somos.com",     role: "Admin",       direct: "Admin",       via: [] ,                                  last: "2h ago" },
  { id: "marcus", name: "Marcus Reed",   init: "MR", c: 2, email: "marcus@somos.com",  role: "Editor",      direct: null,          via: [{ team: "Brand studio", role: "Editor" }], last: "1d ago" },
  { id: "priya",  name: "Priya Nair",    init: "PN", c: 3, email: "priya@somos.com",   role: "Super admin", direct: "Super admin", via: [],                                   last: "5m ago" },
  { id: "tom",    name: "Tom Becker",    init: "TB", c: 4, email: "tom@somos.com",     role: "Editor",      direct: null,          via: [{ team: "Growth", role: "Limited" }, { team: "Customer care", role: "Editor" }], last: "3d ago" },
  { id: "lena",   name: "Lena Ortiz",    init: "LO", c: 5, email: "lena@somos.com",    role: "Admin",       direct: "Admin",       via: [{ team: "Regional — EMEA", role: "Editor" }], last: "1w ago" },
  { id: "sam",    name: "Sam Okafor",    init: "SO", c: 6, email: "sam@somos.com",     role: "Editor",      direct: null,          via: [{ team: "Customer care", role: "Editor" }], last: "2d ago" },
  { id: "mia",    name: "Mia Rossi",     init: "MI", c: 1, email: "mia@somos.com",     role: "View only",   direct: "View only",   via: [],                                   last: "30m ago" },
  { id: "jonah",  name: "Jonah Park",    init: "JP", c: 2, email: "jonah@somos.com",   role: "Advanced",    direct: null,          via: [{ team: "Brand studio", role: "Advanced" }], last: "4d ago" },
];
const ASSIGNABLE_ROLES = ["View only", "Editor", "Advanced", "Admin", "Super admin"];

function Check({ on, indeterminate, onChange, label }) {
  return (
    <button type="button" role="checkbox" aria-checked={indeterminate ? "mixed" : on} aria-label={label}
      className={"hs-check" + (indeterminate ? " indeterminate" : on ? " is-on" : "")}
      onClick={e => { e.stopPropagation(); onChange(!on); }}></button>
  );
}

function AccessTags({ m }) {
  return (
    <span className="snav-access">
      {m.direct && <span className="hs-badge hs-badge--neutral" title={"Direct: " + m.direct}>Direct</span>}
      {m.via.slice(0, 1).map((v, i) => <span key={i} className="hs-badge hs-badge--info" title={v.role + " via " + v.team}>Via {v.team}</span>)}
      {m.via.length > 1 && <span className="hs-badge hs-badge--info" title={m.via.slice(1).map(v => v.role + " via " + v.team).join(", ")}>+{m.via.length - 1}</span>}
    </span>
  );
}

/* Small popover anchored above the bulk bar. SNOWFLAKE (.snav-menu): tokenized,
   but components.css ships no Bento Menu/popover component to reuse. */
function BulkMenu({ items, onPick, onClose, title }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="snav-menu snav-bulkmenu" role="menu" ref={ref}>
      {title && <div className="snav-menu-lab">{title}</div>}
      {items.map(it => (
        <button key={it} role="menuitem" className="snav-menu-item" onClick={() => { onPick(it); onClose(); }}>{it}</button>
      ))}
    </div>
  );
}

/* ── Right drawer: effective access for one member ─────────────────────── */
function MemberDrawer({ m, onClose, onTransfer }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    if (ref.current) ref.current.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <React.Fragment>
      <div className="snav-drawer-scrim" onClick={onClose}></div>
      <aside className="snav-mdrawer" role="dialog" aria-modal="true" aria-label={"Access for " + m.name} ref={ref} tabIndex="-1">
        <header className="snav-mdrawer-head">
          <div className="snav-idcell"><span className="hs-avatar hs-avatar--md" data-c={m.c} aria-hidden="true">{m.init}</span><span className="tx"><span className="nm">{m.name}</span><span className="em">{m.email}</span></span></div>
          <button className="hs-btn hs-btn--icon" type="button" aria-label="Close" title="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
        </header>
        <div className="snav-mdrawer-body">
          <div className="snav-eff-h">Effective access</div>
          <p className="snav-eff-sub">Everything {m.name.split(" ")[0]} can do, and where it comes from.</p>

          <div className="snav-eff-sec">
            <div className="lbl"><span className="hs-badge hs-badge--neutral">Direct</span> Assigned directly</div>
            {m.direct
              ? <div className="snav-eff-row"><span className="material-symbols-outlined">person</span><span><b>{m.direct}</b> · Organisation</span></div>
              : <div className="snav-eff-empty">No roles assigned directly.</div>}
          </div>

          <div className="snav-eff-sec">
            <div className="lbl"><span className="hs-badge hs-badge--info">Via team</span> From a team</div>
            {m.via.length
              ? m.via.map((v, i) => <div className="snav-eff-row" key={i}><span className="material-symbols-outlined">groups</span><span><b>{v.role}</b> via <b>{v.team}</b></span></div>)
              : <div className="snav-eff-empty">Not a member of any team.</div>}
          </div>
        </div>
        <footer className="snav-mdrawer-foot">
          <button className="hs-btn hs-btn--secondary" type="button" onClick={onTransfer}><span className="material-symbols-outlined">swap_horiz</span>Transfer &amp; offboard</button>
        </footer>
      </aside>
    </React.Fragment>
  );
}

/* ── Full-page Transfer & offboard flow ───────────────────────────────── */
function TransferFlow({ member, others, onCancel, onDone }) {
  const [step, setStep] = React.useState(0);
  const [heir, setHeir] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const heirM = others.find(o => o.id === heir);
  const canConfirm = confirm.trim() === member.name;

  return (
    <div className="snav-flow" role="dialog" aria-modal="true" aria-label="Transfer and offboard">
      <header className="snav-flow-head">
        <button className="hs-btn hs-btn--icon" type="button" aria-label="Cancel" title="Cancel" onClick={onCancel}><span className="material-symbols-outlined">close</span></button>
        <div className="ttl"><div className="crumb">Members › {member.name}</div><h1>Transfer &amp; offboard</h1></div>
        <div className="snav-flow-steps">
          {["Choose successor", "Review & confirm"].map((s, i) => (
            <span key={s} className={"st" + (i === step ? " on" : i < step ? " done" : "")}><span className="n">{i < step ? <span className="material-symbols-outlined">check</span> : i + 1}</span>{s}</span>
          ))}
        </div>
      </header>

      <div className="snav-flow-body">
        {step === 0 && (
          <div className="snav-flow-card">
            <h2>Who inherits {member.name.split(" ")[0]}’s access?</h2>
            <p>Their direct roles and team memberships move to the person you choose. You can change this later.</p>
            <div className="snav-radiolist">
              {others.map(o => (
                <label key={o.id} className={"snav-radio-row" + (heir === o.id ? " on" : "")}>
                  <span className={"hs-radio" + (heir === o.id ? " is-on" : "")} role="radio" aria-checked={heir === o.id}></span>
                  <span className="snav-idcell"><span className="hs-avatar hs-avatar--sm" data-c={o.c} aria-hidden="true">{o.init}</span><span className="tx"><span className="nm">{o.name}</span><span className="em">{o.email}</span></span></span>
                  <input type="radio" name="heir" checked={heir === o.id} onChange={() => setHeir(o.id)} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="snav-flow-card">
            <h2>Review &amp; confirm</h2>
            <div className="hs-alert hs-alert--warning"><span className="material-symbols-outlined">warning</span>
              <div><b>This offboards {member.name}.</b> They lose all access immediately. Their direct roles and team memberships transfer to {heirM ? heirM.name : "the chosen successor"}. This can’t be undone from here after it completes.</div></div>
            <div className="snav-review">
              <div className="rrow"><span className="k">Offboarding</span><span className="v">{member.name} · {member.email}</span></div>
              <div className="rrow"><span className="k">Access moves to</span><span className="v">{heirM ? heirM.name + " · " + heirM.email : "—"}</span></div>
              <div className="rrow"><span className="k">Direct roles</span><span className="v">{member.direct || "None"}</span></div>
              <div className="rrow"><span className="k">Team memberships</span><span className="v">{member.via.length ? member.via.map(v => v.team).join(", ") : "None"}</span></div>
            </div>
            <div className="snav-field" style={{ marginTop: "var(--bento-space-05)" }}>
              <label htmlFor="tf-confirm">Type <b>{member.name}</b> to confirm</label>
              <input id="tf-confirm" className="hs-input" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={member.name} autoComplete="off" />
            </div>
          </div>
        )}
      </div>

      <footer className="snav-flow-foot">
        <button className="hs-btn hs-btn--ghost" type="button" onClick={step === 0 ? onCancel : () => setStep(0)}>{step === 0 ? "Cancel" : "Back"}</button>
        <span className="grow"></span>
        {step === 0
          ? <button className="hs-btn hs-btn--primary" type="button" disabled={!heir} onClick={() => setStep(1)}>Continue</button>
          : <button className="hs-btn hs-btn--secondary" type="button" disabled={!canConfirm} onClick={() => onDone(heirM)}><span className="material-symbols-outlined">swap_horiz</span>Transfer &amp; offboard</button>}
      </footer>
    </div>
  );
}

/* ── Members page ─────────────────────────────────────────────────────── */
function MembersPage({ role }) {
  const { TEAMS } = window.SNAV;
  const [members, setMembers] = React.useState(SEED);
  const [sel, setSel] = React.useState(() => new Set());
  const [drawerId, setDrawerId] = React.useState(null);
  const [flowId, setFlowId] = React.useState(null);
  const [menu, setMenu] = React.useState(null); // "role" | "team" | null
  const canManage = window.SNAV.isAdminPlus(role);

  const allOn = sel.size > 0 && sel.size === members.length;
  const someOn = sel.size > 0 && !allOn;
  const toggleAll = on => setSel(on ? new Set(members.map(m => m.id)) : new Set());
  const toggleOne = (id, on) => setSel(s => { const n = new Set(s); on ? n.add(id) : n.delete(id); return n; });
  const clear = () => setSel(new Set());

  const drawerM = members.find(m => m.id === drawerId);
  const flowM = members.find(m => m.id === flowId);

  const bulkRole = newRole => { const n = sel.size; window.snavToast(`Role set to ${newRole} for ${n} member${n > 1 ? "s" : ""}`, { undo: () => {}, icon: "admin_panel_settings" }); clear(); };
  const bulkTeam = team => { const n = sel.size; window.snavToast(`Added ${n} member${n > 1 ? "s" : ""} to ${team}`, { undo: () => {}, icon: "group_add" }); clear(); };
  const bulkRemove = () => { const ids = new Set(sel); const removed = members.filter(m => ids.has(m.id)); setMembers(ms => ms.filter(m => !ids.has(m.id))); clear(); window.snavToast(`Removed ${removed.length} member${removed.length > 1 ? "s" : ""}`, { undo: () => setMembers(ms => [...ms, ...removed].sort((a, b) => SEED.findIndex(s => s.id === a.id) - SEED.findIndex(s => s.id === b.id))), icon: "person_remove" }); };

  const doTransfer = heir => {
    const m = flowM; setFlowId(null); setDrawerId(null);
    const snapshot = members;
    setMembers(ms => ms.filter(x => x.id !== m.id));
    window.snavToast(`${m.name} offboarded · access moved to ${heir ? heir.name : "successor"}`, { undo: () => setMembers(snapshot), icon: "swap_horiz" });
  };

  return (
    <div className="snav-pagewrap">
      {canManage && (
        <div className="snav-phead">
          <button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">person_add</span>Invite members</button>
        </div>
      )}

      <div className="snav-tablecard">
        {members.length === 0 ? (
          <div className="snav-table-empty">
            <span className="material-symbols-outlined">group_off</span>
            <div className="t">No members yet</div>
            <div className="d">Everyone has been removed from this organisation. Invite people to get started.</div>
            {canManage && <button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">person_add</span>Invite members</button>}
          </div>
        ) : (
        <table className="hs-table snav-mtable">
          <thead>
            <tr>
              {canManage && <th className="snav-checkcol"><Check on={allOn} indeterminate={someOn} onChange={toggleAll} label="Select all members" /></th>}
              <th>Member</th>
              <th>Role</th>
              <th>Access</th>
              <th>Last active</th>
              <th className="right"><span className="snav-sr">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} className={"snav-mrow" + (sel.has(m.id) ? " is-selected" : "")} onClick={() => setDrawerId(m.id)} style={{ cursor: "pointer" }}>
                {canManage && <td className="snav-checkcol"><Check on={sel.has(m.id)} onChange={on => toggleOne(m.id, on)} label={"Select " + m.name} /></td>}
                <td data-label="Member"><span className="snav-idcell"><span className="hs-avatar hs-avatar--sm" data-c={m.c} aria-hidden="true">{m.init}</span><span className="tx"><span className="nm">{m.name}</span><span className="em">{m.email}</span></span></span></td>
                <td data-label="Role"><span className="hs-badge hs-badge--neutral">{m.role}</span></td>
                <td data-label="Access"><AccessTags m={m} /></td>
                <td data-label="Last active" style={{ color: "var(--bento-theme-color-text-subtle)" }}>{m.last}</td>
                <td className="right"><button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label={"Open " + m.name} title="View access" onClick={e => { e.stopPropagation(); setDrawerId(m.id); }}><span className="material-symbols-outlined">chevron_right</span></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Floating bulk-action bar */}
      {sel.size > 0 && (
        <div className="snav-bulkbar" role="region" aria-label="Bulk actions">
          <span className="cnt">{sel.size} selected</span>
          <span className="sep"></span>
          <div className="snav-bulk-act">
            <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button" onClick={() => setMenu(menu === "role" ? null : "role")}><span className="material-symbols-outlined">admin_panel_settings</span>Change role</button>
            {menu === "role" && <BulkMenu title="Set role to" items={ASSIGNABLE_ROLES} onPick={bulkRole} onClose={() => setMenu(null)} />}
          </div>
          <div className="snav-bulk-act">
            <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button" onClick={() => setMenu(menu === "team" ? null : "team")}><span className="material-symbols-outlined">group_add</span>Add to team</button>
            {menu === "team" && <BulkMenu title="Add to" items={TEAMS} onPick={bulkTeam} onClose={() => setMenu(null)} />}
          </div>
          <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button" onClick={bulkRemove}><span className="material-symbols-outlined">person_remove</span>Remove</button>
          <span className="sep"></span>
          <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button" onClick={clear}>Clear</button>
        </div>
      )}

      {drawerM && <MemberDrawer m={drawerM} onClose={() => setDrawerId(null)} onTransfer={() => setFlowId(drawerM.id)} />}
      {flowM && <TransferFlow member={flowM} others={members.filter(m => m.id !== flowM.id)} onCancel={() => setFlowId(null)} onDone={doTransfer} />}
    </div>
  );
}

window.MembersPage = MembersPage;
