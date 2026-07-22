// parliament.jsx — Parliament (Amplify / employee advocacy) on the Suite shell.
// Default page = Topics (subscribed topics card grid). Cards = Bento CardPost.
// Source: social-os-reboot.fig AreaParliament (195:41942). Rail active="parliament".

function ParliamentDrawer({ active, onNav }) {
  // Page instance 2030:163588 visible nav ONLY (For you/Drafts/My Team/Campaigns
  // are hidden component items, nestedNavVisible=false — excluded).
  const groups = [
    { head: "Parliament", items: [
      { key: "content",  icon: "article", label: "Content management" },
      { key: "topics",   icon: "label",   label: "Topics" },
    ]},
    { head: "Programs", items: [
      { key: "leaderboard", icon: "leaderboard", label: "Leaderboard" },
    ]},
    { head: "Analytics", items: [
      { key: "explore",   icon: "query_stats",  label: "Explore" },
      { key: "myreports", icon: "insert_chart", label: "My reports" },
    ]},
  ];
  return (
    <SuiteDrawer
      title="Parliament"
      active={active}
      lead={{ key: "overview", icon: "home", label: "Overview" }}
      compose={{ label: "New Parliament post", href: "#" }}
      groups={groups}
      onSelect={onNav}
    />
  );
}

const NETS = ["li", "fb", "ig", "x", "tt"];
const NET_PATHS = {
  x:  "M13.3 10.6 20.5 2.5h-1.7l-6.2 7.05-5-7.05H2l7.5 10.65L2 21.5h1.7l6.6-7.45 5.3 7.45h5.6l-7.9-11zm-2.3 2.6-.77-1.07L4.3 3.8h2.6l4.9 6.9.77 1.07 6.4 9.03h-2.6z",
  fb: "M13.5 21v-8.2h2.75l.4-3.2h-3.15V7.55c0-.93.26-1.56 1.6-1.56h1.7V3.13c-.3-.04-1.3-.13-2.47-.13-2.45 0-4.13 1.5-4.13 4.24V9.6H7.5v3.2h2.7V21z",
  li: "M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM7 8.48H3V21h4zm6.32 0H9.5V21h3.82v-6.57c0-3.55 4.45-3.84 4.45 0V21H21.6v-7.93c0-6-6.9-5.78-8.32-2.83z",
  ig: "M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-11.85a1.44 1.44 0 1 1-1.44 1.44 1.44 1.44 0 0 1 1.44-1.44zm4.09 1.47a7.06 7.06 0 0 0-.48-2.34 4.92 4.92 0 0 0-2.81-2.81 7.06 7.06 0 0 0-2.34-.48C15.66 0 15.31 0 12 0S8.34 0 7.13.06a7.06 7.06 0 0 0-2.34.48 4.92 4.92 0 0 0-2.81 2.81 7.06 7.06 0 0 0-.48 2.34C1.44 6.34 1.44 6.69 1.44 10s0 3.66.06 4.87a7.06 7.06 0 0 0 .48 2.34 4.92 4.92 0 0 0 2.81 2.81 7.06 7.06 0 0 0 2.34.48C8.34 24 8.69 24 12 24s3.66 0 4.87-.06a7.06 7.06 0 0 0 2.34-.48 4.92 4.92 0 0 0 2.81-2.81 7.06 7.06 0 0 0 .48-2.34c.06-1.21.06-1.56.06-4.87s0-3.66-.06-4.69zm-2.16 9.45a4.36 4.36 0 0 1-1.15 1.6 4.36 4.36 0 0 1-1.6 1.04 6.3 6.3 0 0 1-2.14.4c-1.2.05-1.56.06-4.45.06s-3.25 0-4.45-.06a6.3 6.3 0 0 1-2.14-.4 4.36 4.36 0 0 1-1.6-1.04 4.36 4.36 0 0 1-1.04-1.6 6.3 6.3 0 0 1-.4-2.14C2.27 13.26 2.26 12.9 2.26 10s0-3.25.06-4.45a6.3 6.3 0 0 1 .4-2.14 4.36 4.36 0 0 1 1.04-1.6 4.36 4.36 0 0 1 1.6-1.04 6.3 6.3 0 0 1 2.14-.4C8.75 2.27 9.1 2.26 12 2.26s3.25 0 4.45.06a6.3 6.3 0 0 1 2.14.4 4.36 4.36 0 0 1 1.6 1.04 4.36 4.36 0 0 1 1.04 1.6 6.3 6.3 0 0 1 .4 2.14c.05 1.2.06 1.56.06 4.45s-.01 3.26-.35 4.22z",
  tt: "M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v13.2a2.4 2.4 0 1 1-2.4-2.4c.27 0 .53.04.78.12V8.5a5.73 5.73 0 0 0-.78-.05A5.73 5.73 0 1 0 15.3 14.2V8.9a7.5 7.5 0 0 0 4.3 1.36V7a4.28 4.28 0 0 1-3-1.18z",
};
function NetMini({ k }) {
  return (
    <span className={"pl-netmini " + k}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={NET_PATHS[k]} fill="#fff"></path></svg>
    </span>
  );
}

const plImg = src => ({ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "var(--bento-system-sys-neutral-alt-200)" });
const PL_IMG = ["assets/dm/post1.jpg", "assets/parliament/t1.jpg", "assets/parliament/p1.jpg", "assets/parliament/t2.jpg", "assets/dm/post4.jpg", "assets/parliament/t3.jpg", "assets/dm/post2.jpg", "assets/parliament/t4.jpg"];
const TOPIC_CARDS = PL_IMG.map((src, i) => ({ src, video: i === 2 ? "3:23" : null }));

function PostCard({ card, onView }) {
  // Gallery card: thumbnail + title + description only (DX-3510 review).
  const open = () => onView && onView(card);
  return (
    <div className="pl-card pl-card--clickable" role="button" tabIndex={0} onClick={open}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}>
      <div className="pl-card-media" style={plImg(card.src)}>
        {card.video && <span className="pl-video"><span className="material-symbols-outlined">play_arrow</span>{card.video}</span>}
      </div>
      <div className="pl-card-body">
        <div className="pl-cardtitle">Plan your next impulse purchase</div>
        <div className="pl-caption">Round-ups, auto-save, and zero fees — made for the way you actually spend. Share it with your audience in one tap.</div>
      </div>
    </div>
  );
}

function PlTop({ title }) {
  return (
    <header className="pl-top">
      <h1>{title}</h1>
      <span className="spacer"></span>
      <button className="pl-iconbtn" type="button" aria-label="Settings" title="Settings"><span className="material-symbols-outlined">settings</span></button>
      <button className="pl-ws" type="button"><span className="av">SOMOS</span>Somos<span className="material-symbols-outlined chev">keyboard_arrow_down</span></button>
    </header>
  );
}

function Parliament({ onView, onShare }) {
  const [tab, setTab] = React.useState("subscribed");
  return (
    <div className="pl-main">
      <PlTop title="Topics" />
      <nav className="pl-tabs">
        <a className={"pl-tab" + (tab === "subscribed" ? " on" : "")} onClick={() => setTab("subscribed")}>Subscribed topics</a>
        <a className={"pl-tab" + (tab === "other" ? " on" : "")} onClick={() => setTab("other")}>Explore other topics</a>
      </nav>
      <div className="pl-topicbody">
        <div className="pl-panel">
          <div className="pl-toolbar">
            <button className="pl-sort" type="button">Newest posts<span className="material-symbols-outlined">keyboard_arrow_down</span></button>
            <div className="pl-search"><span className="material-symbols-outlined">search</span><input placeholder="Search content by keywords" /></div>
            <button className="pl-sort" type="button">All topics<span className="material-symbols-outlined">keyboard_arrow_down</span></button>
            <button className="pl-filters" type="button">Filters<span className="material-symbols-outlined">keyboard_arrow_down</span></button>
          </div>
          <div className="pl-cardgrid">
            {TOPIC_CARDS.map((c, i) => <PostCard key={i} card={c} onView={onView} onShare={onShare} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Content detail drawer (detail) ────────────────────────────────── */
function ContentDetail({ card, onClose, onShare }) {
  return (
    <aside className="pl-detail" aria-label="Content details">
      <div className="pl-detail-head">Content details
        <button className="pl-iconbtn" type="button" aria-label="Close details" title="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
      </div>
      <div className="pl-detail-body">
        <div className="pl-detail-media" style={plImg(card.src)}>{card.video && <span className="pl-video"><span className="material-symbols-outlined">play_arrow</span>{card.video}</span>}</div>
        <div className="pl-detail-cap">Plan your next impulse purchase on the go with the Somos app. Round-ups, auto-save, and zero fees — made for the way you actually spend.</div>
        <div className="pl-detail-topics"><span className="pl-topicchip">Know your social</span><span className="pl-topicchip">Product</span></div>
        <div className="pl-detail-stats">
          <div className="pl-stat"><span className="v">20</span><span className="l">Shares</span></div>
          <div className="pl-stat"><span className="v">1.4K</span><span className="l">Clicks</span></div>
          <div className="pl-stat"><span className="v">38K</span><span className="l">Reach</span></div>
        </div>
        <div className="pl-detail-sec"><div className="pl-detail-lbl">Shared to</div><img className="pl-nets-img" src="assets/social-networks.svg" alt="LinkedIn, Facebook, Instagram, X, TikTok" /></div>
        <div className="pl-detail-sec"><div className="pl-detail-lbl">Suggested hashtags</div><div className="pl-detail-topics"><span className="hs-badge hs-badge--neutral" style={{ height: 28 }}>#fintech</span><span className="hs-badge hs-badge--neutral" style={{ height: 28 }}>#savings</span><span className="hs-badge hs-badge--neutral" style={{ height: 28 }}>#mobilebanking</span></div></div>
      </div>
      <div className="pl-detail-foot">
        <button className="hs-btn hs-btn--ghost" type="button" onClick={onClose}>Close</button>
        <button className="hs-btn hs-btn--primary" type="button" onClick={() => onShare(card)}><span className="material-symbols-outlined">share</span>Share</button>
      </div>
    </aside>
  );
}

/* ── Share flow modal (create/edit) ────────────────────────────────── */
function ShareModal({ card, onClose }) {
  const [nets, setNets] = React.useState({ li: true, fb: true, ig: false, x: false, tt: false });
  const labels = { li: "LinkedIn", fb: "Facebook", ig: "Instagram", x: "X", tt: "TikTok" };
  const toggle = k => setNets(p => ({ ...p, [k]: !p[k] }));
  return (
    <div className="pl-modal-scrim" onClick={onClose}>
      <div className="pl-modal" role="dialog" aria-modal="true" aria-label="Share to your networks" onClick={e => e.stopPropagation()}>
        <div className="pl-modal-head"><h2>Share to your networks</h2><button className="pl-iconbtn" type="button" aria-label="Close" title="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button></div>
        <div className="pl-modal-body">
          <div className="pl-modal-sec"><div className="pl-detail-lbl">Post to</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {NETS.map(k => <button key={k} type="button" className={"cf" + (nets[k] ? " selected" : "")} aria-pressed={nets[k]} onClick={() => toggle(k)}><NetMini k={k} />{labels[k]}</button>)}
            </div>
          </div>
          <div className="pl-modal-sec"><div className="pl-detail-lbl">Caption</div>
            <textarea className="hs-input" style={{ height: 96, padding: 12, resize: "none" }} defaultValue="Plan your next impulse purchase on the go with the Somos app. Round-ups, auto-save, and zero fees."></textarea>
          </div>
        </div>
        <div className="pl-modal-foot">
          <button className="hs-btn hs-btn--ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="hs-btn hs-btn--secondary" type="button">Schedule</button>
          <button className="hs-btn hs-btn--primary" type="button" onClick={onClose}>Share now</button>
        </div>
      </div>
    </div>
  );
}

/* ── Leaderboard ───────────────────────────────────────────────────── */
const LEADERS = [
  { r: 1, init: "RW", c: "var(--hs-cat-1-bg)", cf: "var(--hs-cat-1-fg)", nm: "Ryan Williams", team: "Marketing", shares: 142, clicks: "8.4K", reach: "212K" },
  { r: 2, init: "DP", c: "var(--hs-cat-3-bg)", cf: "var(--hs-cat-3-fg)", nm: "Devin Park", team: "Sales", shares: 119, clicks: "6.1K", reach: "168K" },
  { r: 3, init: "AL", c: "var(--hs-cat-5-bg)", cf: "var(--hs-cat-5-fg)", nm: "Aisha Lund", team: "Product", shares: 98, clicks: "5.5K", reach: "140K" },
  { r: 4, init: "TK", c: "var(--hs-cat-9-bg)", cf: "var(--hs-cat-9-fg)", nm: "Tomas K.", team: "Sales", shares: 76, clicks: "3.9K", reach: "98K" },
  { r: 5, init: "RM", c: "var(--hs-cat-7-bg)", cf: "var(--hs-cat-7-fg)", nm: "Ramyar M.", team: "Support", shares: 54, clicks: "2.6K", reach: "71K" },
];
function Leaderboard() {
  return (
    <div className="pl-main">
      <PlTop title="Leaderboard" />
      <div className="pl-topicbody">
        <div className="pl-panel" style={{ padding: 0 }}>
          <div className="pl-lb-head"><span>Top advocates · this quarter</span><button className="hs-btn hs-btn--ghost hs-btn--sm" type="button">This quarter<span className="material-symbols-outlined">expand_more</span></button></div>
          <table className="pl-table">
            <thead><tr><th style={{ width: 56 }}>#</th><th>Advocate</th><th>Team</th><th className="num">Shares</th><th className="num">Clicks</th><th className="num">Reach</th></tr></thead>
            <tbody>
              {LEADERS.map(p => (
                <tr key={p.r}>
                  <td><span className={"pl-rank" + (p.r <= 3 ? " top" : "")}>{p.r}</span></td>
                  <td><div className="pl-lead"><span className="av" style={{ background: p.c, color: p.cf }}>{p.init}</span>{p.nm}</div></td>
                  <td>{p.team}</td><td className="num">{p.shares}</td><td className="num">{p.clicks}</td><td className="num">{p.reach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── State surfaces ────────────────────────────────────────────────── */
function PlEmpty() {
  return (
    <div className="pl-main"><PlTop title="Topics" />
      <div className="suite-state empty"><div className="suite-state-inner">
        <div className="ico"><span className="material-symbols-outlined">campaign</span></div>
        <h2>No content to share yet</h2>
        <p>When your team adds approved posts to Amplify, they'll show up here ready for you to share to your own networks in one tap.</p>
        <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">label</span>Browse topics</button><button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">add</span>New Amplify post</button></div>
      </div></div>
    </div>
  );
}
function PlError({ onRetry }) {
  return (
    <div className="pl-main"><PlTop title="Topics" />
      <div className="suite-state error"><div className="suite-state-inner">
        <div className="ico"><span className="material-symbols-outlined">cloud_off</span></div>
        <h2>We couldn't load your content</h2>
        <p>The Amplify feed didn't respond. Your shares and stats are safe — this is usually a brief connection issue.</p>
        <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">help</span>View status</button><button className="hs-btn hs-btn--primary" type="button" onClick={onRetry}><span className="material-symbols-outlined">refresh</span>Try again</button></div>
      </div></div>
    </div>
  );
}
function PlLoading() {
  return (
    <div className="pl-main" aria-busy="true"><PlTop title="Topics" />
      <div className="pl-topicbody"><div className="pl-panel">
        <div className="pl-cardgrid">
          {[0,1,2,3,4,5,6,7].map(i => <div key={i} className="pl-card"><div className="suite-sk" style={{ height: 132 }}></div><div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}><div className="suite-sk" style={{ width: "90%", height: 12 }}></div><div className="suite-sk" style={{ width: "60%", height: 12 }}></div><div className="suite-sk" style={{ width: "100%", height: 32, borderRadius: 8 }}></div></div></div>)}
        </div>
      </div></div>
    </div>
  );
}

/* ── Admin · Content management (KPI widgets + topics table) ─────── */
const ADMIN_TOPICS = [
  ["Marketing Campaigns", 42, "128", "4.2K", true],
  ["Customer Campaigns", 31, "96", "3.1K", true],
  ["Know Your Social", 28, "212", "6.8K", true],
  ["Product Development", 19, "74", "1.9K", true],
  ["Hiring", 12, "54", "1.2K", false],
  ["Industry News", 24, "180", "5.4K", true],
  ["Social Trends 2026", 16, "61", "2.0K", false],
  ["Events", 9, "33", "840", true],
];
function PlKpis({ items }) {
  return <div className="pl-kpis">{items.map(([l, v, d, up], i) => (
    <div className="pl-kpi" key={i}><div className="lbl">{l}</div><div className="val">{v}</div>{d && <div className={"pl-delta" + (up ? " up" : "")}><span className="material-symbols-outlined">{up ? "trending_up" : "trending_flat"}</span>{d}</div>}</div>
  ))}</div>;
}
function Admin() {
  return (
    <div className="pl-main">
      <PlTop title="Content management" />
      <nav className="pl-tabs"><a className="pl-tab on">Topics</a><a className="pl-tab">Posts</a><a className="pl-tab">Members</a></nav>
      <div className="pl-topicbody">
        <PlKpis items={[["Active topics", "11", "+2", true], ["Posts shared", "312", "22%", true], ["Active advocates", "48", "+6", true], ["Est. reach", "441K", "18%", true]]} />
        <div className="pl-panel" style={{ padding: 0 }}>
          <div className="pl-lb-head"><span>Topics</span><button className="hs-btn hs-btn--primary hs-btn--sm" type="button"><span className="material-symbols-outlined">add</span>New topic</button></div>
          <table className="pl-table">
            <thead><tr><th>Topic</th><th className="num">Posts</th><th className="num">Subscribers</th><th className="num">Reach</th><th>Status</th><th aria-label="Actions"></th></tr></thead>
            <tbody>
              {ADMIN_TOPICS.map(([nm, posts, subs, reach, on], i) => (
                <tr key={i}>
                  <td><span className="pl-lead"><span className="av" style={{ background: "var(--bento-suite-parliament-fill, var(--bento-system-sys-info-50))", color: "var(--bento-suite-parliament-icon, var(--bento-system-sys-info-700))" }}><span className="material-symbols-outlined" style={{ fontSize: 16 }}>label</span></span>{nm}</span></td>
                  <td className="num">{posts}</td><td className="num">{subs}</td><td className="num">{reach}</td>
                  <td><span className={"hs-badge " + (on ? "hs-badge--positive" : "hs-badge--neutral")} style={{ height: 26 }}>{on ? "Active" : "Paused"}</span></td>
                  <td style={{ textAlign: "right" }}><button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label={"Manage " + nm} title="Manage"><span className="material-symbols-outlined">more_horiz</span></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Analytics · grouped performance table ──────────────────────── */
const AN_ROWS = [
  ["Spring drop is live — new colours", "Marketing Campaigns", "42", "3.4K", "128K", "6.1%"],
  ["5 ways we cut banking fees", "Know Your Social", "38", "2.9K", "104K", "5.4%"],
  ["Behind the scenes: Earth Day", "Events", "31", "2.1K", "88K", "4.8%"],
  ["We're hiring across product", "Hiring", "19", "1.2K", "54K", "3.9%"],
  ["Round-ups explained in 30s", "Product Development", "27", "1.8K", "71K", "4.2%"],
];
function Analytics() {
  return (
    <div className="pl-main">
      <PlTop title="Analytics" />
      <nav className="pl-tabs"><a className="pl-tab on">Campaigns</a><a className="pl-tab">Explore</a><a className="pl-tab">My reports</a></nav>
      <div className="pl-topicbody">
        <div className="pl-toolbar" style={{ marginBottom: 16 }}>
          <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button">Last 30 days<span className="material-symbols-outlined">expand_more</span></button>
          <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button">All topics<span className="material-symbols-outlined">expand_more</span></button>
          <span className="spacer"></span>
          <button className="hs-btn hs-btn--secondary hs-btn--sm" type="button"><span className="material-symbols-outlined">file_download</span>Export</button>
        </div>
        <PlKpis items={[["Posts shared", "312", "22%", true], ["Total clicks", "11.4K", "15%", true], ["Est. reach", "441K", "18%", true], ["Earned media value", "$38.2K", "9%", true]]} />
        <div className="pl-panel" style={{ padding: 0 }}>
          <div className="pl-lb-head"><span>Top shared posts</span><button className="hs-btn hs-btn--ghost hs-btn--sm" type="button">Shares<span className="material-symbols-outlined">expand_more</span></button></div>
          <table className="pl-table">
            <thead><tr><th>Post</th><th>Topic</th><th className="num">Shares</th><th className="num">Clicks</th><th className="num">Reach</th><th className="num">Eng. rate</th></tr></thead>
            <tbody>
              {AN_ROWS.map((r, i) => (
                <tr key={i}><td style={{ maxWidth: 320 }}><span className="ad-name" style={{ fontWeight: 600 }}>{r[0]}</span></td><td><span className="pl-topicchip">{r[1]}</span></td><td className="num">{r[2]}</td><td className="num">{r[3]}</td><td className="num">{r[4]}</td><td className="num">{r[5]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Advocate · "For you" gallery (board 2030:154931) ─────────── */
function Advocate({ onView, onShare }) {
  return (
    <div className="pl-main">
      <PlTop title="For you" />
      <div className="pl-topicbody">
        <div className="pl-advostrip">
          <div className="pl-advo-greet">Welcome back, Ryan</div>
          <div className="pl-advo-stats">
            <div className="pl-advo-stat"><span className="v">18</span><span className="l">Your shares</span></div>
            <div className="pl-advo-stat"><span className="v">2.3K</span><span className="l">Clicks driven</span></div>
            <div className="pl-advo-stat"><span className="v">#4</span><span className="l">Team rank</span></div>
            <div className="pl-advo-stat"><span className="v">1,240</span><span className="l">Points</span></div>
          </div>
        </div>
        <div className="pl-panel">
          <div className="pl-toolbar">
            <button className="pl-sort" type="button">Suggested for you<span className="material-symbols-outlined">keyboard_arrow_down</span></button>
            <div className="pl-search"><span className="material-symbols-outlined">search</span><input placeholder="Search content by keywords" /></div>
            <button className="pl-filters" type="button">Filters<span className="material-symbols-outlined">keyboard_arrow_down</span></button>
          </div>
          <div className="pl-cardgrid">
            {TOPIC_CARDS.map((c, i) => <PostCard key={i} card={c} onView={onView} onShare={onShare} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Future-state · advocate home dashboard (board 1530:202225) ─────
   "Suggested posts to share" rich card row + "Your performance" KPI grid
   + "Topics to follow" featured-topic list. Distinct designed frame. */
function FutureCard({ card, onView }) {
  // Gallery card: thumbnail + title + description only (DX-3510 review).
  const open = () => onView && onView(card);
  return (
    <div className="plf-card plf-card--clickable" role="button" tabIndex={0} onClick={open}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}>
      <div className="plf-card-media" style={plImg(card.src)}>
        {card.video && <span className="pl-video"><span className="material-symbols-outlined">play_arrow</span>{card.video}</span>}
      </div>
      <div className="plf-card-body">
        <div className="plf-cardtitle">Plan your next impulse purchase</div>
        <div className="plf-caption">Round-ups, auto-save, and zero fees — made for the way you actually spend. Share it with your audience in one tap.</div>
      </div>
    </div>
  );
}

const FS_KPIS = [
  ["24", "Post shared", "6.3%", "trending_up"],
  ["863", "Engagements", "3%", "trending_up"],
  ["10.5K", "Total impressions", "16%", "trending_up"],
  ["#5", "Leaderboard rank", "#2", "arrow_upward"],
];
const FS_TOPICS = [
  { nm: "Future of Work", n: "27 posts", d: "Remote culture, productivity tools, and the evolving workplace.", src: "assets/parliament/t4.jpg" },
  { nm: "Sustainable finance", n: "18 posts", d: "ESG investing, green banking, and climate-positive products.", src: "assets/parliament/t2.jpg" },
  { nm: "AI & automation", n: "31 posts", d: "How teams are putting AI to work across the organization.", src: "assets/parliament/t3.jpg" },
  { nm: "Member stories", n: "12 posts", d: "Real members, real results — straight from the community.", src: "assets/parliament/t1.jpg" },
];
function FutureState({ onView, onShare }) {
  return (
    <div className="pl-main">
      <PlTop title="Overview" />
      <div className="pl-topicbody">
        <div className="plf-dash">
          <section className="pl-panel plf-panel">
            <div className="plf-panel-h">
              <div className="t">Suggested posts to share</div>
              <div className="s">Curated for your audience on LinkedIn, X, and Instagram</div>
            </div>
            <div className="plf-cardgrid">
              {TOPIC_CARDS.slice(0, 4).map((c, i) => <FutureCard key={i} card={c} onView={onView} onShare={onShare} />)}
            </div>
          </section>
          <div className="plf-cols">
            <section className="pl-panel plf-panel">
              <div className="plf-panel-h"><div className="t">Your performance</div><div className="s">Last 30 days</div></div>
              <div className="plf-kpigrid">
                {FS_KPIS.map(([v, l, d, ic], i) => (
                  <div className="plf-kpi" key={i}>
                    <div className="v">{v}</div>
                    <div className="m"><span className="l">{l}</span><span className="d"><span className="material-symbols-outlined">{ic}</span>{d}</span></div>
                  </div>
                ))}
              </div>
            </section>
            <section className="pl-panel plf-panel">
              <div className="plf-panel-h"><div className="t">Topics to follow</div><div className="s">Based on your activity and team</div></div>
              <div className="plf-topiclist">
                {FS_TOPICS.map((t, i) => (
                  <div className="plf-topicrow" key={i}>
                    <span className="plf-topicthumb" style={plImg(t.src)}></span>
                    <div className="plf-topicmeta">
                      <div className="hd"><span className="nm">{t.nm}</span><span className="n">{t.n}</span></div>
                      <div className="d">{t.d}</div>
                    </div>
                    <button className="hs-btn hs-btn--outlined hs-btn--sm" type="button">Subscribe</button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [surface, setSurface] = React.useState("main"); // main | leaderboard | empty | error | loading
  const [detail, setDetail] = React.useState(null);   // card | null
  const [share, setShare] = React.useState(null);      // card | null
  const onState = (k) => {
    if (k === "detail") { setSurface("main"); setShare(null); setDetail(TOPIC_CARDS[0]); }
    else if (k === "share") { setSurface("main"); setDetail(null); setShare(TOPIC_CARDS[0]); }
    else { setDetail(null); setShare(null); setSurface(k); }
  };
  const demoValue = share ? "share" : detail ? "detail" : surface;
  const drawerActive = surface === "future" ? "overview" : surface === "leaderboard" ? "leaderboard" : surface === "admin" ? "content" : surface === "analytics" ? "myreports" : "topics";
  return (
    <div className="suite-app">
      <SuiteRail active="parliament" />
      <ParliamentDrawer active={drawerActive} onNav={k => onState({ overview: "future", content: "admin", topics: "main", leaderboard: "leaderboard", explore: "analytics", myreports: "analytics" }[k] || "main")} />
      {surface === "main" && <Parliament onView={setDetail} onShare={setShare} />}
      {surface === "future" && <FutureState onView={setDetail} onShare={setShare} />}
      {surface === "advocate" && <Advocate onView={setDetail} onShare={setShare} />}
      {surface === "admin" && <Admin />}
      {surface === "analytics" && <Analytics />}
      {surface === "leaderboard" && <Leaderboard />}
      {surface === "empty" && <PlEmpty />}
      {surface === "error" && <PlError onRetry={() => setSurface("loading")} />}
      {surface === "loading" && <PlLoading />}
      {detail && <ContentDetail card={detail} onClose={() => setDetail(null)} onShare={c => { setDetail(null); setShare(c); }} />}
      {share && <ShareModal card={share} onClose={() => setShare(null)} />}
      <SuiteStates
        states={[["future", "Home"], ["main", "Topics"], ["advocate", "Advocate"], ["detail", "Detail"], ["share", "Share"], ["admin", "Admin"], ["analytics", "Analytics"], ["leaderboard", "Leaderboard"], ["empty", "Empty"], ["error", "Error"], ["loading", "Loading"]]}
        value={demoValue} onChange={onState}
      />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
