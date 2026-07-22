// suite-drawer.jsx — reusable product sub-nav drawer (304px).
// <SuiteDrawer title="Nest" active="conversations" compose={null} groups={[...]} />
// groups: [{ head, items: [{ key, icon, label, badge, href }] }]

function SuiteDrawer({ title, active, compose, groups, lead, onSelect }) {
  const pick = (key, e) => { if (onSelect) { e.preventDefault(); onSelect(key); } };
  return (
    <aside className="suite-drawer">
      <div className="sd-head">
        {title}
        <button className="sd-collapse" type="button" aria-label="Collapse"><span className="material-symbols-outlined">keyboard_double_arrow_left</span></button>
      </div>
      <div className="sd-body">
        {lead && (
          <a href={lead.href || "#"} onClick={(e) => pick(lead.key, e)} className={"sd-item" + (active === lead.key ? " on" : "")} aria-current={active === lead.key ? "page" : undefined}>
            <span className="material-symbols-outlined">{lead.icon}</span>
            {lead.label}
          </a>
        )}
        {compose && (
          <div className="sd-compose">
            <a className="main" href={compose.href}><span className="material-symbols-outlined">add</span>{compose.label}</a>
            <button className="chev" type="button" aria-label="More options"><span className="material-symbols-outlined">expand_more</span></button>
          </div>
        )}
        {groups.map((g, gi) => (
          <React.Fragment key={gi}>
            {g.head && <div className="sd-group">{g.head}</div>}
            {g.items.map(it => (
              <a key={it.key} href={it.href || "#"} onClick={(e) => pick(it.key, e)} className={"sd-item" + (active === it.key ? " on" : "")} aria-current={active === it.key ? "page" : undefined}>
                <span className="material-symbols-outlined">{it.icon}</span>
                {it.label}
                {it.badge != null && <span className="sd-badge">{it.badge}</span>}
              </a>
            ))}
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
}
if (typeof window !== "undefined") { window.SuiteDrawer = SuiteDrawer; }
