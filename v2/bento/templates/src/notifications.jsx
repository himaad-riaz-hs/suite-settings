// notifications.jsx — OPT 1 full-page, matching Figma exactly.
// Source: /Notifications/Design-exploration-KAIROS---WIP/index.jsx (OPT 1 frame)
// Layout: suite-rail | 240px drawer | content (list + at-a-glance panel)

const DRAWER_ITEMS = [
  { key: "all",       label: "All notifications",  icon: "notifications",    count: 300 },
  { key: "approval",  label: "Needs approval",      icon: "approval",         count: 105 },
  { key: "compliance",label: "Compliance",           icon: "policy",           count: 1 },
  { key: "social",    label: "Social activity",      icon: "trending_up",      count: 100 },
  { key: "mentions",  label: "Mentions",             icon: "alternate_email",  count: 30 },
  { key: "internal",  label: "Internal comments",    icon: "comment",          count: 10 },
  { key: "hootsuite", label: "Hootsuite",             icon: "auto_awesome",     count: 3 },
];

const NET_BG = { fb: "#1877F2", ig: "radial-gradient(circle at 30% 110%,#FFD774,#DD2A7B 55%,#515BD4)", x: "#000", li: "#0A66C2" };
const NET_PATH = {
  fb: "M13.5 21v-8.2h2.75l.4-3.2h-3.15V7.55c0-.93.26-1.56 1.6-1.56h1.7V3.13c-.3-.04-1.3-.13-2.47-.13-2.45 0-4.13 1.5-4.13 4.24V9.6H7.5v3.2h2.7V21z",
  ig: "M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-11.85a1.44 1.44 0 1 1-1.44 1.44 1.44 1.44 0 0 1 1.44-1.44z",
  x: "M13.3 10.6 20.5 2.5h-1.7l-6.2 7.05-5-7.05H2l7.5 10.65L2 21.5h1.7l6.6-7.45 5.3 7.45h5.6l-7.9-11zm-2.3 2.6-.77-1.07L4.3 3.8h2.6l4.9 6.9.77 1.07 6.4 9.03h-2.6z",
  li: "M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM7 8.48H3V21h4zm6.32 0H9.5V21h3.82v-6.57c0-3.55 4.45-3.84 4.45 0V21H21.6v-7.93c0-6-6.9-5.78-8.32-2.83z",
};

const makeRow = (id, net, prod, unread) => ({
  id,
  title: "John Smith has created a message which requires your approval",
  body: "Lorem ipsum dolor sit amet consectetur. Semper posuere aliquam pretium…",
  meta1: prod,
  meta2: "Needs approval",
  time: "2h",
  net,
  unread,
});

const NOTIFS_TODAY = [
  makeRow(1, "fb", "Nest", true),
  makeRow(2, "fb", "Perch", true),
  makeRow(3, "li", "Nest", true),
  makeRow(4, "ig", "Parliament", false),
  makeRow(5, "fb", "Nest", true),
];
const NOTIFS_YESTERDAY = [
  makeRow(6, "x", "Nest", true),
  makeRow(7, "fb", "Perch", false),
  makeRow(8, "li", "Perch", true),
];

function NfRow({ n, selected, onSelect }) {
  return (
    <div className={"nf-row" + (selected ? " on" : "")} onClick={() => onSelect(n)}>
      <div className="nf-avwrap">
        <div className="nf-av"><span className="material-symbols-outlined">person</span></div>
        {n.net && (
          <span className="nf-badge" style={{ background: NET_BG[n.net] }}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={NET_PATH[n.net]} fill="#fff"></path></svg>
          </span>
        )}
      </div>
      <div className="nf-rowbody">
        <div className="nf-rowtitle">{n.title}</div>
        <div className="nf-rowtext">{n.body}</div>
        <div className="nf-rowmeta">
          <span>{n.meta1}</span><span className="dot-sep"></span><span>{n.meta2}</span>
        </div>
      </div>
      <span className="nf-rowtime">{n.time}</span>
      {n.unread ? <span className="nf-dot"></span> : <span className="nf-nodot"></span>}
    </div>
  );
}

function AtAGlance() {
  return (
    <div className="nf-glancepanel">
      <div className="nf-glance-head">
        <img className="nf-glance-owly" src="assets/hootsuite-owly-small.png" alt="Owly" />
        <span>At a glance</span>
      </div>
      <div className="nf-kpi-row">
        <div className="nf-kpi--warning nf-kpi"><span className="kn">12</span><span className="kl">overdue</span></div>
        <div className="nf-kpi plain"><span className="kn">10</span><span className="kl">Pending</span></div>
        <div className="nf-kpi green"><span className="kn">26</span><span className="kl">approved today</span></div>
      </div>
      <div className="nf-alerts">
        <div className="nf-alert err">
          <span className="material-symbols-outlined">error</span>
          <p>12 posts have been waiting more than 48h. Oldest is 4 days old.</p>
        </div>
        <div className="nf-alert warn">
          <span className="material-symbols-outlined">warning</span>
          <p>3 posts are scheduled to publish within 2 hours and still need approval.</p>
        </div>
      </div>
    </div>
  );
}

function NfDetail({ n, onClose }) {
  return (
    <aside className="nf-detail" role="dialog" aria-label="Notification details">
      <div className="nf-detail-head">
        <span>Notification</span>
        <button className="nf-detail-close ne-tooltipbtn" type="button" aria-label="Close" title="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
      </div>
      <div className="nf-detail-body">
        <div className="nf-detail-row"><div className="nf-av"><span className="material-symbols-outlined">person</span></div><div><div className="nf-detail-who">John Smith</div><div className="nf-detail-sub">{n.meta1} · {n.meta2} · {n.time} ago</div></div></div>
        <p className="nf-detail-text">{n.title}. {n.body} Reprehenderit ut consectetur, aliquam pretium commodo. Requires your approval before it can be scheduled.</p>
        <div className="nf-detail-preview"><div className="nf-detail-thumb"></div><div className="nf-detail-cap">“Plan your next impulse purchase on the go with the Somos app.”</div></div>
        <div className="nf-detail-acts">
          <button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">check</span>Approve</button>
          <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">edit</span>Request changes</button>
          <button className="hs-btn hs-btn--ghost" type="button">Open in {n.meta1}</button>
        </div>
      </div>
    </aside>
  );
}

function NotifPage({ drawerActive }) {
  const [tab, setTab] = React.useState("all");
  const [selected, setSelected] = React.useState(null);
  const cat = DRAWER_ITEMS.find(d => d.key === drawerActive) || DRAWER_ITEMS[0];
  const todayRows = tab === "unread" ? NOTIFS_TODAY.filter(n => n.unread) : NOTIFS_TODAY;
  const yesterdayRows = tab === "unread" ? NOTIFS_YESTERDAY.filter(n => n.unread) : NOTIFS_YESTERDAY;
  const allCount = cat.count;
  const unreadCount = [...NOTIFS_TODAY, ...NOTIFS_YESTERDAY].filter(n => n.unread).length;

  return (
    <div className="nf-page">
      {/* top bar */}
      <div className="nf-topbar">
        <h1>{cat.label}</h1>
        <button className="nf-org-pill" type="button">
          <span className="nf-org-av"></span>
          Somos
          <span className="material-symbols-outlined">keyboard_arrow_down</span>
        </button>
        <button className="nf-topbar-gear ne-tooltipbtn" type="button" aria-label="Settings">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      {/* filter bar */}
      <div className="nf-filterbar">
        <div className="nf-inline-tabs">
          <button className={"nf-itab" + (tab === "all" ? " on" : "")} onClick={() => setTab("all")} type="button">
            All <span className="cnt">{allCount}</span>
          </button>
          <button className={"nf-itab" + (tab === "unread" ? " on" : "")} onClick={() => setTab("unread")} type="button">
            Unread <span className="cnt">20</span>
          </button>
        </div>
        <span className="nf-fsep"></span>
        <div className="nf-keyword">
          <span className="material-symbols-outlined">search</span>
          <input placeholder="Search by keyword" />
        </div>
        <button className="nf-ddown" type="button">Last 30 days <span className="material-symbols-outlined">keyboard_arrow_down</span></button>
        <button className="nf-filterbtn" type="button">Filter</button>
      </div>

      {/* two-column body */}
      <div className="nf-body">
        {/* notification list */}
        <div className="nf-listpanel">
          <div className="nf-listheader">
            <span className="nf-listlabel">Last 30 days</span>
            <button className="nf-markread" type="button">Mark all as read</button>
            <button className="nf-more ne-tooltipbtn" type="button" aria-label="More options">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div className="nf-list">
            {todayRows.length > 0 && (
              <React.Fragment>
                <div className="nf-date">Today</div>
                {todayRows.map(n => <NfRow key={n.id} n={n} selected={selected?.id === n.id} onSelect={setSelected} />)}
              </React.Fragment>
            )}
            {yesterdayRows.length > 0 && (
              <React.Fragment>
                <div className="nf-date">Yesterday</div>
                {yesterdayRows.map(n => <NfRow key={n.id} n={n} selected={selected?.id === n.id} onSelect={setSelected} />)}
              </React.Fragment>
            )}
          </div>
        </div>

        {/* at a glance OR notification detail */}
        {selected ? <NfDetail n={selected} onClose={() => setSelected(null)} /> : <AtAGlance />}
      </div>
    </div>
  );
}

function NfDrawer({ active, setActive }) {
  return (
    <div className="nf-drawer">
      <div className="nf-drawer-head">
        <span>Notifications</span>
        <button className="nf-drawer-collapse ne-tooltipbtn" type="button" aria-label="Collapse">
          <span className="material-symbols-outlined">keyboard_double_arrow_left</span>
        </button>
      </div>
      <div className="nf-drawer-list">
        {DRAWER_ITEMS.map(item => (
          <div key={item.key} className={"nf-ditem" + (active === item.key ? " on" : "")} onClick={() => setActive(item.key)} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && setActive(item.key)}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="dlabel">{item.label}</span>
            {item.count > 0 && <span className="dcount">{item.count}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [active, setActive] = React.useState("approval");
  return (
    <div className="suite-app">
      <SuiteRail active="notifications" />
      <NfDrawer active={active} setActive={setActive} />
      <NotifPage drawerActive={active} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
