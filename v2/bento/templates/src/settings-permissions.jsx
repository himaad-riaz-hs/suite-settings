// settings-permissions.jsx — Permissions & Roles, calm role-list redesign.
// DEFAULT = a scannable list of role cards (name + plain-language summary) for the
// selected scope. The dense capability matrix is a deliberate "Compare roles" audit
// view behind a secondary button. Custom roles are the ONLY place permissions are
// hand-picked (3-step builder, Business/Enterprise). PARITY ONLY — no capability
// changes vs the prior matrix; this pass only re-presents it.
const { Toggle } = window;

// Plan gate for custom roles. Business / Enterprise unlock; others see locked.
const PLAN = "team";
const PLAN_ALLOWS_CUSTOM = PLAN === "business" || PLAN === "enterprise";

// Pending-engineering questions (rendered as amber "?" chips — cited, never asserted).
const PENDING = {
  C1: "Open (pending engineering): Can an Admin — not SA/PSA — disconnect a social profile?",
  C2: "Open (pending engineering): the 'Sync profiles' capability is undefined.",
  C3: "Open (pending engineering): Can a Super Admin create orgs, or is that Paying Super Admin only?",
  C4: "Open (pending engineering): Can an Admin reassign members across orgs?",
  C5: "Open (pending engineering): Can an Admin mandate MFA without configuring SSO?",
  C6: "Open (pending engineering): Data export scope per role is undefined.",
  C7: "Open (pending engineering): Do org/team roles ever grant publishing implicitly, or is a per-account social role always required?",
};
const AUTO_TIP = "Inherited (read-only): Paying Super Admin, Super Admin and Admin are Team Admin on every team.";
const GATE_TIP = "An org or team role alone doesn't grant publishing — it needs an Advanced or Editor social role on the account.";

/* ── Scope model: roles (columns) + capabilities (rows, grouped) ──────────
   `summary` is a plain-language description of what each role can do — derived
   verbatim from the capability rows below, never adding new capability.        */
const TIERS = {
  org: {
    label: "Org",
    scopeNoun: "organisation",
    roles: [
      { key: "psa", name: "Paying Super Admin", sub: "1 per org",
        summary: "Owns the organisation — one per org. Full control of everything, including billing, SSO, MFA, security profiles, and creating new organisations." },
      { key: "sa", name: "Super Admin",
        summary: "Full administrative control: manage teams, members and social accounts, grant Super Admin, build custom org roles, and configure SSO, MFA, security and billing." },
      { key: "admin", name: "Admin",
        summary: "Runs the org day to day — manage teams, members, social accounts and approvals, and assign roles up to Admin. No billing, SSO or security settings, and can't grant Super Admin." },
      { key: "view", name: "View Only",
        summary: "Read-only. Can view the organisation, its teams and social accounts, but can't make any changes." },
      { key: "custom", name: "Custom", custom: true,
        summary: "Hand-pick exactly the permissions a role needs — never exceeding Super Admin." },
    ],
    cats: [
      { name: "Org / Teams / Members", caps: [
        { label: "View organisation", v: ["yes","yes","yes","yes","cfg"] },
        { label: "Edit org name & avatar", v: ["yes","yes","yes","no","cfg"] },
        { label: "Create / delete teams", v: ["yes","yes","yes","no","cfg"] },
        { label: "Add / remove members", v: ["yes","yes","yes","no","cfg"] },
        { label: "Reassign members across orgs", v: ["yes","yes","p:C4","no","no"] },
        { label: "Create organisations", v: ["yes","p:C3","no","no","no"] },
      ]},
      { name: "Pre-defined permissions", caps: [
        { label: "Assign pre-defined org roles", v: ["yes","yes","yes","no","cfg"] },
        { label: "Grant Super Admin", delta: true, v: ["yes","yes","no","no","no"] },
      ]},
      { name: "Custom permissions", caps: [
        { label: "Create custom org role", v: ["yes","yes","no","no","no"] },
        { label: "Edit custom org role", v: ["yes","yes","no","no","cfg"] },
      ]},
      { name: "Social profiles", caps: [
        { label: "View social accounts", v: ["yes","yes","yes","yes","cfg"] },
        { label: "Add social account", v: ["yes","yes","yes","no","cfg"] },
        { label: "Disconnect social profile", v: ["yes","yes","p:C1","no","cfg"] },
        { label: "Sync profiles", v: ["p:C2","p:C2","p:C2","no","no"] },
        { label: "Add / delete Vanity URLs", delta: true, v: ["yes","yes","no","no","cfg"] },
      ]},
      { name: "Approvals", caps: [
        { label: "Configure approval workflows", v: ["yes","yes","yes","no","cfg"] },
        { label: "Approve / reject posts", v: ["yes","yes","yes","no","cfg"] },
      ]},
      { name: "Publishing", caps: [
        { label: "Publish / schedule posts", v: ["gate","gate","gate","no","gate"] },
        { label: "Org role grants publishing implicitly", v: ["p:C7","p:C7","p:C7","no","p:C7"] },
      ]},
      { name: "Data exporting", caps: [
        { label: "Export analytics & data", v: ["yes","yes","p:C6","no","cfg"] },
      ]},
      { name: "Security & access", caps: [
        { label: "Configure SSO", delta: true, v: ["yes","yes","no","no","no"] },
        { label: "Mandate MFA", delta: true, v: ["yes","yes","p:C5","no","no"] },
        { label: "Member visibility", delta: true, v: ["yes","yes","no","no","cfg"] },
        { label: "ProofPoint / compliance", delta: true, v: ["yes","yes","no","no","no"] },
        { label: "Security Profiles", delta: true, v: ["yes","yes","no","no","no"] },
        { label: "Billing — read / entry", delta: true, v: ["yes","yes","no","no","no"] },
      ]},
      { name: "Add-ons", caps: [
        { label: "Manage add-ons & integrations", v: ["yes","yes","yes","no","cfg"] },
        { label: "Manage billing for add-ons", v: ["yes","yes","no","no","no"] },
      ]},
    ],
  },
  team: {
    label: "Team",
    scopeNoun: "team",
    roles: [
      { key: "tadmin", name: "Team Admin",
        summary: "Manages a single team: its members, details, social accounts and approvals. Org admins are Team Admin on every team automatically." },
      { key: "tmember", name: "Team Member",
        summary: "Belongs to the team — views its social accounts and can approve team posts. Can't manage the team or its members." },
      { key: "custom", name: "Custom", custom: true,
        summary: "Hand-pick permissions for a team-scoped role — never exceeding Super Admin." },
    ],
    cats: [
      { name: "Org / Teams / Members", caps: [
        { label: "Org admins (PSA / SA / Admin)", v: ["auto","no","no"] },
        { label: "Manage team members", v: ["yes","no","cfg"] },
        { label: "Edit team details", v: ["yes","no","cfg"] },
        { label: "Delete team", v: ["yes","no","no"] },
      ]},
      { name: "Social profiles", caps: [
        { label: "Assign social accounts to team", v: ["yes","no","cfg"] },
        { label: "View team social accounts", v: ["yes","yes","cfg"] },
      ]},
      { name: "Approvals", caps: [
        { label: "Configure team approvals", v: ["yes","no","cfg"] },
        { label: "Approve / reject team posts", v: ["yes","yes","cfg"] },
      ]},
      { name: "Publishing", caps: [
        { label: "Publish on team accounts", v: ["gate","gate","gate"] },
      ]},
      { name: "Data exporting", caps: [
        { label: "Export team analytics", v: ["yes","p:C6","cfg"] },
      ]},
      { name: "Custom permissions", caps: [
        { label: "Create custom team role", v: ["no","no","no"] },
      ]},
    ],
  },
  social: {
    label: "Social account",
    scopeNoun: "social account",
    roles: [
      { key: "advanced", name: "Advanced",
        summary: "Full control of this account: publish and schedule, approve own posts, reply to messages, edit profile settings, and export analytics." },
      { key: "editor", name: "Editor", sub: "Default",
        summary: "The default for new members. Publish and schedule (sent for approval) and reply to messages. Can't approve own posts or change profile settings." },
      { key: "limited", name: "Limited",
        summary: "Reply to direct messages and export analytics, but can't publish, schedule or edit the profile. Posts always need approval." },
      { key: "none", name: "None",
        summary: "No access to this account — can't publish, message, or view its analytics." },
      { key: "custom", name: "Custom", custom: true,
        summary: "Hand-pick permissions for an account-scoped role — never exceeding Super Admin." },
    ],
    cats: [
      { name: "Publishing", caps: [
        { label: "Publish & schedule", v: ["yes","yes","no","no","cfg"] },
        { label: "Approve own posts", v: ["yes","no","no","no","cfg"] },
        { label: "Direct messages / replies", v: ["yes","yes","yes","no","cfg"] },
      ]},
      { name: "Social profiles", caps: [
        { label: "Edit profile settings", v: ["yes","no","no","no","cfg"] },
        { label: "Disconnect this profile", v: ["p:C1","no","no","no","no"] },
      ]},
      { name: "Approvals", caps: [
        { label: "Requires approval to publish", v: ["no","yes","yes","no","cfg"] },
      ]},
      { name: "Data exporting", caps: [
        { label: "Export account analytics", v: ["yes","yes","p:C6","no","cfg"] },
      ]},
      { name: "Pre-defined permissions", caps: [
        { label: "Default role for new members", v: ["no","yes","no","no","no"] },
      ]},
    ],
  },
};

/* ── Cell mark renderer (audit matrix) ───────────────────────────────── */
function Mark({ v }) {
  if (v === "yes") return <span className="material-symbols-outlined pr-can" title="Can" aria-label="Can">check_circle</span>;
  if (v === "no") return <span className="material-symbols-outlined pr-cannot" title="Cannot" aria-label="Cannot">close</span>;
  if (v === "cfg") return <span className="pr-tilde" title="Depends on the custom role's configuration" aria-label="Configuration-dependent">~</span>;
  if (v === "auto") return <span className="pr-chip-auto" title={AUTO_TIP}><span className="material-symbols-outlined">bolt</span>Auto</span>;
  if (v === "gate") return <span className="pr-gate" title={GATE_TIP}><span className="material-symbols-outlined">lock_clock</span>Per account</span>;
  if (v && v.indexOf("p:") === 0) { const c = v.slice(2); return <span className="pr-chip-pending" title={PENDING[c]} aria-label={"Pending question: " + PENDING[c]}>?</span>; }
  return null;
}
// Resolve a matrix value to a boolean "granted" for the role-list / review summary.
const GRANTED = v => v === "yes" || v === "auto" || v === "gate";

/* ── Compare roles: full-width capability matrix (sticky header + first col) ── */
function CompareMatrix({ tier, highlight }) {
  const t = TIERS[tier];
  const n = t.roles.length;
  const hi = i => highlight != null && t.roles[i].key === highlight;
  return (
    <div className="pr-matrixwrap">
      <table className="pr-matrix" aria-label={t.label + " roles compared by capability"}>
        <thead>
          <tr className="pr-eyebrow">
            <th className="pr-corner" rowSpan={2} scope="col">What they can do</th>
            <th className="pr-roleslabel" colSpan={n}>Roles</th>
          </tr>
          <tr className="pr-rolerow">
            {t.roles.map((r, i) => (
              <th key={r.key} scope="col" className={"pr-rolehead" + (r.custom && !PLAN_ALLOWS_CUSTOM ? " locked" : "") + (hi(i) ? " hl" : "")}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
                  {r.custom && !PLAN_ALLOWS_CUSTOM && <span className="material-symbols-outlined" style={{ fontSize: 14 }} title="Business / Enterprise only">lock</span>}
                  {r.name}
                </span>
                {r.sub && <span className="sub">{r.sub}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.cats.map(cat => (
            <React.Fragment key={cat.name}>
              <tr><th className="pr-catrow-th" colSpan={n + 1} scope="colgroup"><span className="pr-catlabel">{cat.name}</span></th></tr>
              {cat.caps.map(cap => (
                <tr key={cap.label}>
                  <th scope="row" className={"pr-caplbl" + (cap.delta ? " delta" : "")}>
                    {cap.label}{cap.delta && <span className="dchip" title="Super Admin can; Admin cannot">SA only</span>}
                  </th>
                  {cap.v.map((val, i) => (
                    <td key={i} className={hi(i) ? "hl" : undefined}><Mark v={val} /></td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MatrixLegend() {
  return (
    <div className="pr-legend">
      <span className="it"><span className="material-symbols-outlined pr-can">check_circle</span>Can</span>
      <span className="it"><span className="material-symbols-outlined pr-cannot">close</span>Cannot</span>
      <span className="it"><span className="pr-chip-auto"><span className="material-symbols-outlined">bolt</span>Auto</span>Inherited (read-only)</span>
      <span className="it"><span className="pr-tilde">~</span>Set by the custom role</span>
      <span className="it"><span className="pr-gate"><span className="material-symbols-outlined">lock_clock</span>Per account</span>Publishing gate</span>
      <span className="it"><span className="pr-chip-pending">?</span>Pending engineering</span>
    </div>
  );
}

/* ── Custom-role builder (full page, 3 steps) ────────────────────────── */
const WIZ_STEPS = ["Basic details", "Set permissions", "Review"];
const CEILING_RE = /SSO|MFA|Create organisations|Create custom org role|across orgs/i;

function Ceiling() {
  return (
    <div className="pr-ceiling"><span className="material-symbols-outlined">shield</span>
      <span>A custom role can never exceed Super Admin. <b>SSO, MFA, creating orgs, creating a custom org role, and cross-org reassignment</b> are never grantable.</span></div>
  );
}

function CustomRoleWizard({ tier, onClose }) {
  const t = TIERS[tier];
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [dup, setDup] = React.useState(""); // role key to duplicate, "" = blank
  const [perms, setPerms] = React.useState({}); // cap.label -> bool

  // Seed permissions from the duplicated role's column (ceiling caps stay off).
  const seedFrom = key => {
    const idx = t.roles.findIndex(r => r.key === key);
    const next = {};
    t.cats.forEach(cat => cat.caps.forEach(cap => {
      next[cap.label] = idx >= 0 && !CEILING_RE.test(cap.label) && GRANTED(cap.v[idx]);
    }));
    setPerms(next);
  };
  const onDup = key => { setDup(key); seedFrom(key); };
  const setPerm = (label, on) => setPerms(p => ({ ...p, [label]: on }));

  const grantedCount = Object.values(perms).filter(Boolean).length;
  const next = () => setStep(s => Math.min(2, s + 1));
  const back = () => step === 0 ? onClose() : setStep(s => s - 1);

  return (
    <React.Fragment>
      <div className="pr-wizard">
        <div className="pr-wiz-steps">
          {WIZ_STEPS.map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className={"pr-wiz-line" + (i <= step ? " on" : "")}></span>}
              <span className={"pr-wiz-step" + (i === step ? " on" : i < step ? " done" : "")}>
                <span className="num">{i < step ? <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span> : i + 1}</span>{s}
              </span>
            </React.Fragment>
          ))}
        </div>

        {step === 0 && (
          <div className="set-panel" style={{ maxWidth: 760 }}>
            <div className="set-panel-head"><div className="grow"><div className="set-panel-title">Basic details</div><div className="set-panel-sub">Name your custom {t.label.toLowerCase()} role and choose what to start from.</div></div></div>
            <div style={{ padding: "var(--bento-space-05)", display: "flex", flexDirection: "column", gap: "var(--bento-space-04)" }}>
              <div className="set-field"><label htmlFor="cr-name">Role name<span className="req">*</span></label><input id="cr-name" className="set-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Content Approver" /></div>
              <div className="set-field"><label htmlFor="cr-desc">Description <span className="opt">(optional)</span></label><textarea id="cr-desc" className="set-input set-textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What this role is for"></textarea></div>
              <div className="set-field"><label htmlFor="cr-dup">Start from</label>
                <select id="cr-dup" className="set-input" value={dup} onChange={e => onDup(e.target.value)}>
                  <option value="">Blank role (no permissions)</option>
                  {t.roles.filter(r => !r.custom).map(r => <option key={r.key} value={r.key}>Duplicate of {r.name}</option>)}
                </select>
              </div>
              <Ceiling />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="set-panel" style={{ maxWidth: 760 }}>
            <div className="set-panel-head"><div className="grow"><div className="set-panel-title">Set permissions</div><div className="set-panel-sub">Turn on each permission this role should have. Greyed rows are above the ceiling and can't be granted.</div></div><span className="pr-prov direct" style={{ alignSelf: "center" }}>{grantedCount} on</span></div>
            <div style={{ padding: "var(--bento-space-02) 0" }}>
              {t.cats.map(cat => (
                <React.Fragment key={cat.name}>
                  <div className="set-grouprow"><span className="lbl">{cat.name}</span></div>
                  {cat.caps.map(cap => {
                    const ceiling = CEILING_RE.test(cap.label);
                    return (
                      <div className="set-row" key={cap.label} style={ceiling ? { opacity: 0.5 } : null}>
                        <span className="set-row-text"><span className="set-row-title" style={{ fontSize: 15 }}>{cap.label}{ceiling && <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--bento-theme-color-icon-disabled)" }} title="Above the ceiling — not grantable">block</span>}</span></span>
                        <span className="set-row-ctrl"><Toggle on={!ceiling && !!perms[cap.label]} onChange={v => !ceiling && setPerm(cap.label, v)} label={cap.label} /></span>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="pr-review">
            <div className="set-panel-head" style={{ paddingLeft: 0, paddingRight: 0, borderBottom: "1px solid var(--bento-theme-color-border-subtle)", marginBottom: "var(--bento-space-05)" }}>
              <div className="grow"><div className="set-panel-title">Review new role</div><div className="set-panel-sub">Confirm the role and everything it can do before creating it.</div></div>
            </div>
            <div className="pr-review-meta">
              <div><div className="k">Role name</div><div className="v">{name || "Untitled role"}</div></div>
              <div><div className="k">Scope</div><div className="v">{t.label}</div></div>
              <div><div className="k">Started from</div><div className="v">{dup ? "Duplicate of " + (t.roles.find(r => r.key === dup) || {}).name : "Blank role"}</div></div>
              <div><div className="k">Permissions on</div><div className="v">{grantedCount}</div></div>
            </div>
            {desc && <p style={{ fontSize: 14, color: "var(--bento-theme-color-text-subtle)", margin: "0 0 var(--bento-space-05)", lineHeight: 1.55 }}>{desc}</p>}
            <div className="pr-review-grid">
              {t.cats.map(cat => {
                const on = cat.caps.filter(c => perms[c.label]).length;
                return (
                  <div className="pr-review-cat" key={cat.name}>
                    <div className="pr-review-cat-h">{cat.name}<span className="n">{on}/{cat.caps.length}</span></div>
                    {cat.caps.map(cap => {
                      const granted = !!perms[cap.label] && !CEILING_RE.test(cap.label);
                      return (
                        <div key={cap.label} className={"pr-review-row " + (granted ? "on" : "off")}>
                          <span className="material-symbols-outlined">{granted ? "check_circle" : "remove"}</span>{cap.label}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <Ceiling />
          </div>
        )}

        <div style={{ display: "flex", gap: "var(--bento-space-03)", marginTop: "var(--bento-space-05)", maxWidth: step === 2 ? 960 : 760 }}>
          <button className="hs-btn hs-btn--ghost" type="button" onClick={back}>{step === 0 ? "Cancel" : "Back"}</button>
          <span style={{ flex: 1 }}></span>
          {step < 2
            ? <button className="hs-btn hs-btn--primary" type="button" onClick={next} disabled={step === 0 && !name.trim()}>Continue</button>
            : <button className="hs-btn hs-btn--primary" type="button" onClick={onClose}>Create role</button>}
        </div>
      </div>
    </React.Fragment>
  );
}

/* ── Role list (default calm view) ───────────────────────────────────── */
function RoleCard({ role, onCompare }) {
  return (
    <div className="pr-rolecard">
      <div className="pr-rolecard-head">
        <span className="pr-rolecard-name">{role.name}</span>
        {role.sub && <span className="pr-rolecard-tag">{role.sub}</span>}
      </div>
      <p className="pr-rolecard-sum">{role.summary}</p>
      <div className="pr-rolecard-foot">
        <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button" onClick={onCompare}>
          <span className="material-symbols-outlined">table_view</span>View permissions
        </button>
      </div>
    </div>
  );
}

function CustomRoleCard({ tier, onCreate }) {
  if (PLAN_ALLOWS_CUSTOM) {
    return (
      <div className="pr-rolecard builder">
        <div className="pr-rolecard-head">
          <span className="material-symbols-outlined">tune</span>
          <span className="pr-rolecard-name">Custom roles</span>
        </div>
        <p className="pr-rolecard-sum">Build a role with exactly the permissions you need for this {TIERS[tier].scopeNoun} — start blank or duplicate an existing role. A custom role can never exceed Super Admin.</p>
        <div className="pr-rolecard-foot">
          <button className="hs-btn hs-btn--secondary hs-btn--sm" type="button" onClick={onCreate}><span className="material-symbols-outlined">add</span>Create custom role</button>
        </div>
      </div>
    );
  }
  return (
    <div className="pr-customlock">
      <span className="ic"><span className="material-symbols-outlined">lock</span></span>
      <div className="tx"><div className="t">Custom roles are a Business &amp; Enterprise feature</div><div className="d">Build a role with exactly the permissions you need for this {TIERS[tier].scopeNoun}, never exceeding Super Admin. Upgrade to unlock the role builder.</div></div>
      <button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">workspace_premium</span>Compare plans</button>
    </div>
  );
}

/* ── Pane root ───────────────────────────────────────────────────────── */
function PermissionsRolesPane() {
  const [view, setView] = React.useState("list"); // list | matrix | builder
  const [tier, setTier] = React.useState("org");
  const [highlight, setHighlight] = React.useState(null); // role key to highlight in matrix
  const t = TIERS[tier];

  const openMatrix = (roleKey) => { setHighlight(roleKey || null); setView("matrix"); };
  const backToList = () => { setView("list"); setHighlight(null); };
  const setScope = k => { setTier(k); setHighlight(null); };

  const crumbLeaf = view === "matrix" ? "Compare roles" : view === "builder" ? "New custom role" : t.label + " roles";

  return (
    <div className="set-body">
      {/* persistent breadcrumb + scope chip */}
      <div className="pr-context">
        <nav className="pr-crumb" aria-label="Breadcrumb">
          {view === "list"
            ? <span className="cur">Permissions &amp; Roles</span>
            : <React.Fragment>
                <button type="button" onClick={backToList}>Permissions &amp; Roles</button>
                <span className="material-symbols-outlined">chevron_right</span>
                <span className="cur">{crumbLeaf}</span>
              </React.Fragment>}
        </nav>
        <span className="pr-scopechip"><span className="material-symbols-outlined">{tier === "org" ? "corporate_fare" : tier === "team" ? "groups" : "hub"}</span>Scope:&nbsp;<b>{t.label}</b></span>
      </div>

      {/* ── LIST (default) ── */}
      {view === "list" && (
        <React.Fragment>
          <div className="pr-listhead">
            <div className="set-seg" role="radiogroup" aria-label="Role scope">
              {Object.entries(TIERS).map(([k, v]) => (
                <button key={k} type="button" role="radio" aria-checked={tier === k} className={tier === k ? "on" : ""} onClick={() => setScope(k)}>{v.label}</button>
              ))}
            </div>
            <span className="grow"></span>
            <button className="hs-btn hs-btn--secondary" type="button" onClick={() => openMatrix(null)}><span className="material-symbols-outlined">table_view</span>Compare roles</button>
            {PLAN_ALLOWS_CUSTOM
              ? <button className="hs-btn hs-btn--outlined" type="button" onClick={() => setView("builder")}><span className="material-symbols-outlined">add</span>Create custom role</button>
              : <button className="hs-btn hs-btn--outlined" type="button" disabled title="Custom roles are available on Business and Enterprise"><span className="material-symbols-outlined">lock</span>Create custom role</button>}
          </div>

          <p className="pr-listintro">
            These are the roles for the <b>{t.scopeNoun}</b> scope and what each one can do. To audit them side by side, use <b>Compare roles</b>.
            {tier === "team" && " Org admins are Team Admin on every team automatically."}
            {tier === "social" && " Publishing on an account always requires one of these account roles."}
          </p>

          <div className="pr-rolelist">
            {t.roles.filter(r => !r.custom).map(r => (
              <RoleCard key={r.key} role={r} onCompare={() => openMatrix(r.key)} />
            ))}
            <CustomRoleCard tier={tier} onCreate={() => setView("builder")} />
          </div>
        </React.Fragment>
      )}

      {/* ── COMPARE (matrix audit view) ── */}
      {view === "matrix" && (
        <React.Fragment>
          <div className="pr-listhead">
            <div className="set-seg" role="radiogroup" aria-label="Role scope">
              {Object.entries(TIERS).map(([k, v]) => (
                <button key={k} type="button" role="radio" aria-checked={tier === k} className={tier === k ? "on" : ""} onClick={() => setScope(k)}>{v.label}</button>
              ))}
            </div>
            <span className="grow"></span>
            <button className="hs-btn hs-btn--ghost" type="button" onClick={backToList}><span className="material-symbols-outlined">arrow_back</span>Back to roles</button>
          </div>
          <div className="pr-banner"><span className="material-symbols-outlined">info</span>
            <span>Every cell shows what a <b>role</b> can do — not who's assigned to it. Paying Super Admin, Super Admin and Admin are <b>Team Admin</b> on all teams automatically (<b>Auto</b>). Publishing always needs a social role per account.</span></div>
          <MatrixLegend />
          <CompareMatrix tier={tier} highlight={highlight} />
        </React.Fragment>
      )}

      {/* ── BUILDER (custom role, the only place permissions are hand-picked) ── */}
      {view === "builder" && (
        <CustomRoleWizard tier={tier} onClose={backToList} />
      )}
    </div>
  );
}

window.SETTINGS_PANES = window.SETTINGS_PANES || {};
window.SETTINGS_PANES["org-permissions"] = PermissionsRolesPane;
