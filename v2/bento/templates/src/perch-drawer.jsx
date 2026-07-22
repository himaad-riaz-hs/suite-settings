// perch-drawer.jsx — shared Perch product sub-nav drawer (304px).
// Matches the Calendar-Week PAGE INSTANCE (1530:166664): header "Perch" →
// Create-a-post (split button) → Plan/Ads/Analytics groups. (The 195:41686
// component also carries an "Overview" item, but it is NOT in the page
// instance, so it is excluded — page instance, not component.)
//   Plan:      Calendar, Drafts, Content, Approvals, Whiteboard, DM Automation, Hootbio
//   Ads:       Ads, Boost
//   Analytics: Explore, My Reports, Insights
// Mount: <PerchDrawer active="calendar" /> between SuiteRail (active="perch") and content.

function PerchDrawer({ active }) {
  const groups = [
    { headLabel: "Plan", items: [
      { key: "calendar",  icon: "calendar_month",  label: "Calendar",      href: "planner.html" },
      { key: "drafts",    icon: "edit_note",       label: "Drafts",        href: "drafts.html" },
      { key: "content",   icon: "perm_media",      label: "Content",       href: "content.html" },
      { key: "approvals", icon: "fact_check",      label: "Approvals",     href: "approvals.html" },
      { key: "whiteboard",icon: "view_column",     label: "Whiteboard",    href: "whiteboard.html" },
      { key: "dm",        icon: "smart_toy",       label: "DM Automation", href: "dm-automation.html" },
      { key: "hootbio",   icon: "link",            label: "Hootbio",       href: "hootbio.html" },
    ]},
    { headLabel: "Ads", items: [
      { key: "ads",   icon: "ad_group",      label: "Ads",   href: "ads.html" },
      { key: "boost", icon: "rocket_launch", label: "Boost", href: "boost.html" },
    ]},
    { headLabel: "Analytics", items: [
      // Board item set (user diff vs 195:41686): Explore, My Reports, Insights.
      // "My Reports" + "Insights" point to analytics.html as interim targets —
      // no dedicated screens built for them yet (flagged).
      { key: "explore",   icon: "travel_explore", label: "Explore",    href: "explore.html" },
      { key: "myreports", icon: "bar_chart",      label: "My Reports", href: "analytics.html" },
      { key: "insights",  icon: "insights",       label: "Insights",   href: "analytics.html" },
    ]},
  ];
  return (
    <aside className="perch-drawer">
      <div className="pd-head">
        Perch
        <button className="pd-collapse" type="button" aria-label="Collapse"><span className="material-symbols-outlined">keyboard_double_arrow_left</span></button>
      </div>
      <div className="pd-body">
        <div className="pd-compose">
          <a className="main" href="composer.html"><span className="material-symbols-outlined">add</span>Create a post</a>
          <button className="chev" type="button" aria-label="More create options"><span className="material-symbols-outlined">expand_more</span></button>
        </div>
        {groups.map((g, gi) => (
          <React.Fragment key={gi}>
            <div className="pd-group">{g.headLabel}</div>
            {g.items.map(it => (
              <a key={it.key} href={it.href} className={"pd-item" + (active === it.key ? " on" : "")} aria-current={active === it.key ? "page" : undefined}>
                <span className="material-symbols-outlined">{it.icon}</span>
                {it.label}
                {it.badge && <span className="sd-badge">{it.badge}</span>}
              </a>
            ))}
          </React.Fragment>
        ))}
      </div>
    </aside>
  );
}
if (typeof window !== "undefined") { window.PerchDrawer = PerchDrawer; }
