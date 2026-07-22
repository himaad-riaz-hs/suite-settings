// drafts.jsx — Perch › Drafts. Board 1530:165121 (Drafts screen).
// Layout: "Your post volume" day-strip (day numbers + skeleton bars, current
// week outlined 2px #333) → day-grouped sections of calendar-landscape post
// cards (132px: thumbnail + account/time + caption + status + actions).
// Real Somos data. No-red (Draft = neutral, Published = positive, Scheduled = info).

const STATUS = {
  published: { cls: "pos", icon: "check_circle", label: "Published" },
  draft: { cls: "neutral", icon: "edit_note", label: "Draft" },
  scheduled: { cls: "info", icon: "schedule", label: "Scheduled" },
};

// month volume — day → post count (current week = 17–23, today = 17)
const COUNTS = { 2: 1, 4: 2, 6: 2, 9: 3, 12: 1, 14: 2, 16: 2, 17: 4, 18: 6, 19: 2, 20: 3, 22: 2, 24: 5, 27: 1, 29: 2 };
const VOL = Array.from({ length: 31 }, (_, i) => ({ d: i + 1, c: COUNTS[i + 1] || 0 }));
const WEEK_START = 17, WEEK_END = 23;

const SECTIONS = [
  { label: "Unscheduled drafts", count: "12 posts", unsched: true, cards: [
    { net: "ig", acct: "Somos", time: "", cap: "Plan your next impulse purchase on the go with the Somos app. Round-ups, auto-save, and zero fees.", thumb: "assets/dm/post1.jpg", status: "draft", meta: "Edited 2h ago by Ryan", cmt: 2 },
    { net: "li", acct: "Somos Bank", time: "", cap: "We're hiring! Join our growing product team in Toronto.", thumb: "assets/dm/post2.jpg", status: "draft", meta: "Edited yesterday by Ryan" },
    { net: "x", acct: "Somos", time: "", cap: "Big things coming this spring. Stay tuned.", thumb: "assets/dm/post3.jpg", status: "draft", meta: "Edited May 14 by Ryan" },
  ]},
  { label: "Tuesday May 19, 2026", count: "2 posts", cards: [
    { net: "fb", acct: "Somos", time: "9:00 AM", cap: "Our Spring Sale starts now — up to 40% off select plans.", thumb: "assets/dm/post4.jpg", status: "scheduled", meta: "Scheduled May 12 by Ryan", cmt: 1 },
    { net: "ig", acct: "Somos UK", time: "12:30 PM", cap: "Behind the scenes at our Earth Day cleanup.", thumb: "assets/dm/post5.jpg", status: "scheduled", meta: "Scheduled May 12 by Ryan" },
  ]},
  { label: "Wednesday May 20, 2026", count: "2 posts", cards: [
    { net: "li", acct: "Somos Bank", time: "10:30 AM", cap: "5 ways we cut banking fees this year — a thread.", thumb: "assets/dm/post1.jpg", status: "published", meta: "Published 10:30 AM by Ryan", cmt: 4 },
    { net: "x", acct: "Somos", time: "2:15 PM", cap: "Zero fees. Real savings. That's the Somos promise.", thumb: "assets/dm/post2.jpg", status: "published", meta: "Published 2:15 PM by Ryan" },
  ]},
];

function VolDay({ v, maxC }) {
  const h = v.c ? 8 + (v.c / maxC) * 28 : 4;
  return (
    <div className={"drv-day" + (v.d === 17 ? " today" : "")} title={v.c + " posts · May " + v.d}>
      <span className="drv-num">{v.d}</span>
      <span className="drv-bar" style={{ height: h + "px", background: v.c ? (v.d === 17 ? "var(--bento-system-sys-neutral-700)" : "rgb(217,217,217)") : "rgba(0,0,0,0.06)" }}></span>
    </div>
  );
}
function VolumeStrip() {
  const maxC = Math.max(...VOL.map(v => v.c));
  const before = VOL.filter(v => v.d < WEEK_START);
  const week = VOL.filter(v => v.d >= WEEK_START && v.d <= WEEK_END);
  const after = VOL.filter(v => v.d > WEEK_END);
  return (
    <div className="drv">
      <div className="drv-head">
        <div><div className="t">Your post volume</div></div>
        <div className="drv-month">May 2026</div>
        <button className="pp-actbtn ne-tooltipbtn" type="button" aria-label="Volume options" title="Options"><span className="material-symbols-outlined">more_horiz</span></button>
      </div>
      <div className="drv-strip">
        {before.map(v => <VolDay key={v.d} v={v} maxC={maxC} />)}
        <div className="drv-week">{week.map(v => <VolDay key={v.d} v={v} maxC={maxC} />)}</div>
        {after.map(v => <VolDay key={v.d} v={v} maxC={maxC} />)}
      </div>
    </div>
  );
}

function CalCard({ r }) {
  const s = STATUS[r.status];
  return (
    <div className="drc">
      <span className="drc-thumb" style={{ backgroundImage: `url(${r.thumb})` }}></span>
      <div className="drc-mid">
        <div className="drc-head"><PerchNet k={r.net} /><b>{r.acct}</b>{r.time && <span className="time">{r.time}</span>}</div>
        <div className="drc-cap">{r.cap}</div>
        <div className="drc-foot">
          <span className={"pp-badge " + s.cls}><span className="material-symbols-outlined">{s.icon}</span>{s.label}</span>
          <span className="meta">{r.meta}</span>
          {r.cmt && <span className="cmt"><span className="material-symbols-outlined">chat_bubble_outline</span>{r.cmt}</span>}
        </div>
      </div>
    </div>
  );
}

function Drafts() {
  return (
    <div className="pp-main">
      <PerchTopBar title="Drafts">
        <button className="pp-secondary" type="button" style={{ marginRight: 4 }}><span className="material-symbols-outlined">add</span>New draft</button>
      </PerchTopBar>
      <VolumeStrip />
      <div className="dr-body">
        {SECTIONS.map((g, i) => (
          <div className="drc-sec" key={i}>
            <div className="drc-sechead">
              <span className="t">{g.label}</span>
              <span className="ct">{g.count}</span>
              <span className="sp"></span>
              <button className="pp-actbtn ne-tooltipbtn" type="button" aria-label="Section options" title="Options"><span className="material-symbols-outlined">more_horiz</span></button>
            </div>
            <div className="drc-list">{g.cards.map((r, j) => <CalCard key={j} r={r} />)}</div>
            {g.unsched && <div className="drc-showmore"><button className="hs-btn hs-btn--ghost hs-btn--sm" type="button">Show more</button></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return <div className="suite-app"><SuiteRail active="perch" /><PerchDrawer active="drafts" /><Drafts /></div>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
