// planner.jsx — Hootsuite "Plan" week calendar (Week condensed).
// Faithful to social-os-reboot.fig /Perch Calendar. Bento-backed.
// Rail comes from shared SuiteRail; Perch drawer from PerchDrawer.

const PERCH_NET_PATHS = {
  x:  "M13.3 10.6 20.5 2.5h-1.7l-6.2 7.05-5-7.05H2l7.5 10.65L2 21.5h1.7l6.6-7.45 5.3 7.45h5.6l-7.9-11zm-2.3 2.6-.77-1.07L4.3 3.8h2.6l4.9 6.9.77 1.07 6.4 9.03h-2.6z",
  fb: "M13.5 21v-8.2h2.75l.4-3.2h-3.15V7.55c0-.93.26-1.56 1.6-1.56h1.7V3.13c-.3-.04-1.3-.13-2.47-.13-2.45 0-4.13 1.5-4.13 4.24V9.6H7.5v3.2h2.7V21z",
  li: "M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM7 8.48H3V21h4zm6.32 0H9.5V21h3.82v-6.57c0-3.55 4.45-3.84 4.45 0V21H21.6v-7.93c0-6-6.9-5.78-8.32-2.83z",
  ig: "M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-11.85a1.44 1.44 0 1 1-1.44 1.44 1.44 1.44 0 0 1 1.44-1.44zm4.09 1.47a7.06 7.06 0 0 0-.48-2.34 4.92 4.92 0 0 0-2.81-2.81 7.06 7.06 0 0 0-2.34-.48C15.66 0 15.31 0 12 0S8.34 0 7.13.06a7.06 7.06 0 0 0-2.34.48 4.92 4.92 0 0 0-2.81 2.81 7.06 7.06 0 0 0-.48 2.34C1.44 6.34 1.44 6.69 1.44 10s0 3.66.06 4.87a7.06 7.06 0 0 0 .48 2.34 4.92 4.92 0 0 0 2.81 2.81 7.06 7.06 0 0 0 2.34.48C8.34 24 8.69 24 12 24s3.66 0 4.87-.06a7.06 7.06 0 0 0 2.34-.48 4.92 4.92 0 0 0 2.81-2.81 7.06 7.06 0 0 0 .48-2.34c.06-1.21.06-1.56.06-4.87s0-3.66-.06-4.69zm-2.16 9.45a4.36 4.36 0 0 1-1.15 1.6 4.36 4.36 0 0 1-1.6 1.04 6.3 6.3 0 0 1-2.14.4c-1.2.05-1.56.06-4.45.06s-3.25 0-4.45-.06a6.3 6.3 0 0 1-2.14-.4 4.36 4.36 0 0 1-1.6-1.04 4.36 4.36 0 0 1-1.04-1.6 6.3 6.3 0 0 1-.4-2.14C2.27 13.26 2.26 12.9 2.26 10s0-3.25.06-4.45a6.3 6.3 0 0 1 .4-2.14 4.36 4.36 0 0 1 1.04-1.6 4.36 4.36 0 0 1 1.6-1.04 6.3 6.3 0 0 1 2.14-.4C8.75 2.27 9.1 2.26 12 2.26s3.25 0 4.45.06a6.3 6.3 0 0 1 2.14.4 4.36 4.36 0 0 1 1.6 1.04 4.36 4.36 0 0 1 1.04 1.6 6.3 6.3 0 0 1 .4 2.14c.05 1.2.06 1.56.06 4.45s-.01 3.26-.35 4.22z",
  tt: "M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v13.2a2.4 2.4 0 1 1-2.4-2.4c.27 0 .53.04.78.12V8.5a5.73 5.73 0 0 0-.78-.05A5.73 5.73 0 1 0 15.3 14.2V8.9a7.5 7.5 0 0 0 4.3 1.36V7a4.28 4.28 0 0 1-3-1.18z",
  th: "M17.3 11.1c-.1-.05-.2-.1-.3-.14-.18-3.27-1.97-5.15-4.97-5.17h-.04c-1.8 0-3.3.77-4.22 2.17l1.65 1.13c.69-1.04 1.76-1.26 2.57-1.26h.03c1.01 0 1.77.3 2.27.87.36.42.6 1 .72 1.73-.92-.16-1.91-.2-2.97-.13-2.99.17-4.91 1.91-4.78 4.33.07 1.23.68 2.28 1.73 2.97.88.58 2.02.86 3.2.8 1.56-.09 2.78-.68 3.64-1.77.65-.82 1.06-1.89 1.24-3.24.74.45 1.29 1.04 1.59 1.75.51 1.21.54 3.2-1.08 4.82-1.42 1.42-3.13 2.03-5.72 2.05-2.87-.02-5.04-.94-6.45-2.74C7.32 18.5 6.6 16.6 6.57 14c.03-2.6.75-4.5 2.07-5.86C10.05 6.34 12.22 5.42 15.09 5.4c2.89.02 5.07.95 6.49 2.76.7.89 1.22 2.01 1.57 3.32l1.9-.51c-.42-1.61-1.08-3-1.98-4.15C20.32 4.31 17.5 3.06 14.1 3.04h-.01c-3.4.02-6.18 1.28-8.04 3.64C4.32 8.83 3.39 11.94 3.36 15.99v.02c.03 4.05.96 7.16 2.69 9.32 1.86 2.36 4.64 3.62 8.04 3.64h.01c3.02-.02 5.15-.81 6.9-2.56 2.29-2.29 2.22-5.16 1.47-6.92-.54-1.27-1.57-2.3-2.97-2.99zm-4.97 5.66c-1.3.07-2.66-.51-2.72-1.66-.05-.85.6-1.8 2.8-1.93.25-.01.5-.02.74-.02.8 0 1.55.08 2.23.23-.25 3.16-1.74 3.3-3.05 3.38z",
  pin: "M12.017 2C6.484 2 2 6.484 2 12.017c0 4.236 2.636 7.857 6.356 9.312-.088-.79-.166-2.005.034-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.853 0 1.265.64 1.265 1.41 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.846 0-4.516 2.135-4.516 4.34 0 .86.33 1.78.744 2.28a.3.3 0 0 1 .07.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.472 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.533 0 10.017-4.484 10.017-10.017C22.034 6.484 17.55 2 12.017 2z",
};
function Net({ k, size = 20 }) {
  return (
    <span className={"net " + k} style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "64%", height: "64%", display: "block" }}><path d={PERCH_NET_PATHS[k]} fill="#fff"></path></svg>
    </span>
  );
}

// Week: Sun 21 – Sat 27, May 2026; today = Thu 22 (dark circle in Figma).
const DAYS = [
  { name: "Sun", date: 21 },
  { name: "Mon", date: 22 },
  { name: "Tue", date: 23, note: "Spring sale" },
  { name: "Wed", date: 24 },
  { name: "Thu", date: 22, today: true },
  { name: "Fri", date: 26, note: "Webinar", noteTone: "blue" },
  { name: "Sat", date: 27 },
];

// Card: { net, acct, time, status, thumb }  status: published|pending|draft
const CARDS = {
  21: [{ net: "ig", acct: "Somos", time: "12:30PM", status: "published" }],
  22: [
    { net: "fb", acct: "Somos", time: "12:30PM", status: null },
    { net: "li", acct: "Somos", time: "12:30PM", status: "pending" },
    { net: "tt", acct: "Somos", time: "12:30PM", status: "draft" },
  ],
  23: [{ net: "ig", acct: "Somos", time: "12:30PM", status: null }],
  24: [
    { net: "x",  acct: "Somos UK", time: "12:30PM", status: null },
    { net: "th", acct: "Somos UK", time: "12:30PM", status: "pending" },
  ],
  "22t": [{ net: "ig", acct: "Somos UK", time: "12:30PM", status: null }],
  26: [{ net: "fb", acct: "Somos", time: "12:30PM", status: null }],
  27: [
    { net: "ig", acct: "Somos UK", time: "12:30PM", status: "draft" },
    { net: "pin",acct: "Somos", time: "12:30PM", status: "draft" },
  ],
};

function StatusChip({ status }) {
  if (!status) return null;
  if (status === "published") {
    return <span className="cc-status pub"><svg className="cc-status-ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M8.00065 1.33331C4.32065 1.33331 1.33398 4.31998 1.33398 7.99998C1.33398 11.68 4.32065 14.6666 8.00065 14.6666C11.6807 14.6666 14.6673 11.68 14.6673 7.99998C14.6673 4.31998 11.6807 1.33331 8.00065 1.33331ZM6.66732 11.3333L3.33398 7.99998L4.27398 7.05998L6.66732 9.44665L11.7273 4.38665L12.6673 5.33331L6.66732 11.3333Z"></path></svg>Published</span>;
  }
  if (status === "pending") {
    return <span className="cc-status pend"><svg className="cc-status-ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M0.666016 14.3333H15.3327L7.99935 1.66666L0.666016 14.3333ZM8.66602 12.3333H7.33268V11H8.66602V12.3333ZM8.66602 9.66666H7.33268V6.99999H8.66602V9.66666Z"></path></svg>Pending</span>;
  }
  const map = {
    draft:     { cls: "draft", icon: null, label: "Draft" },
  };
  const s = map[status];
  return <span className={"cc-status " + s.cls}>{s.icon && <span className="material-symbols-outlined">{s.icon}</span>}{s.label}</span>;
}

function CalCard({ card, onOpen }) {
  return (
    <div className="cal-card" onClick={() => onOpen && onOpen(card)} role="button" tabIndex={0}>
      <div className="cc-thumb">
        {card.dur && <span className="cc-dur">{card.dur}</span>}
      </div>
      <div className="cc-body">
        <span className="cc-net"><Net k={card.net} size={20} /></span>
        <div className="cc-row"><span className="cc-acct">{card.acct}</span><span className="cc-time">{card.time}</span></div>
        <div className="cc-text">{card.acct === "Somos UK" ? "Behind the scenes at our Earth Day cleanup 🌍" : "Plan your next impulse purchase with the Somos app."}</div>
        <div className="cc-foot">
          <StatusChip status={card.status} />
          <button className="cc-comment" type="button" aria-label="Comments"><svg className="cc-comment-ico" viewBox="0 0 36 27" aria-hidden="true"><path d="M26.3243 6.83335C26.3243 5.91669 25.5827 5.16669 24.666 5.16669H11.3327C10.416 5.16669 9.66602 5.91669 9.66602 6.83335V16.8334C9.66602 17.75 10.416 18.5 11.3327 18.5H22.9993L26.3327 21.8334L26.3243 6.83335ZM24.666 6.83335V17.8084L23.691 16.8334H11.3327V6.83335H24.666ZM12.9993 13.5H22.9993V15.1667H12.9993V13.5ZM12.9993 11H22.9993V12.6667H12.9993V11ZM12.9993 8.50002H22.9993V10.1667H12.9993V8.50002Z"></path></svg></button>
        </div>
      </div>
    </div>
  );
}

// ── Month view ──────────────────────────────────────────────────────
const MONTH_DAYS = (() => {
  const cells = [];
  [27, 28, 29, 30].forEach(d => cells.push({ date: d, muted: true }));
  for (let d = 1; d <= 31; d++) cells.push({ date: d });
  let t = 1;
  while (cells.length % 7 !== 0) cells.push({ date: t++, muted: true });
  return cells;
})();
const PILL = (label, time, tone) => ({ kind: "pill", label, time, tone });
const POST = (net, acct, time) => ({ kind: "post", net, acct, time });
const MONTH_EVENTS = {
  1:  [PILL("Quarterly", "8AM", "blue"), POST("ig", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  2:  [POST("fb", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  3:  [POST("fb", "Somos UK", "12:30PM"), POST("x", "Somos", "2:00PM")],
  4:  [PILL("Webinar", "1PM", "pink"), POST("fb", "Somos UK", "12:30PM"), { kind: "more", n: 10 }],
  5:  [PILL("Big sale!!", "12 - 2PM", "blue"), POST("fb", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  6:  [POST("x", "Somos", "2:00PM")],
  7:  [PILL("Team chat", "12 - 2PM", "blue"), POST("fb", "Somos UK", "12:30PM"), { kind: "more", n: 10 }],
  8:  [PILL("Quarterly", "8AM", "blue"), POST("fb", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  9:  [POST("ig", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  10: [POST("ig", "Somos UK", "12:30PM"), POST("x", "Somos", "2:00PM")],
  11: [PILL("Big sale!!", "12 - 2PM", "blue"), POST("fb", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  12: [PILL("Big sale!!", "12 - 2PM", "blue"), POST("fb", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  13: [POST("ig", "Somos", "12:30PM"), POST("ig", "Somos", "1:00PM"), POST("x", "Somos", "2:00PM")],
  14: [PILL("Webinar", "1PM", "pink"), POST("ig", "Somos UK", "12:30PM"), { kind: "more", n: 10 }],
  15: [POST("ig", "Somos", "2:00PM")],
  16: [PILL("Team chat", "12 - 2PM", "blue"), POST("ig", "Somos UK", "12:30PM"), { kind: "more", n: 10 }],
  17: [PILL("Quarterly", "8AM", "blue"), POST("ig", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  18: [POST("x", "Somos", "2:00PM")],
  19: [PILL("Big sale!!", "12 - 2PM", "blue"), POST("fb", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  20: [PILL("Team chat", "12 - 2PM", "blue"), POST("fb", "Somos UK", "12:30PM"), { kind: "more", n: 10 }],
  21: [PILL("Webinar", "1PM", "pink"), POST("ig", "Somos UK", "12:30PM"), { kind: "more", n: 10 }],
  22: [PILL("Big sale!!", "12 - 2PM", "blue"), POST("ig", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  23: [PILL("Quarterly", "8AM", "blue"), POST("ig", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  24: [POST("ig", "Somos UK", "12:30PM"), POST("ig", "Somos", "2:00PM")],
  25: [PILL("Big sale!!", "12 - 2PM", "blue"), POST("fb", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  26: [PILL("Big sale!!", "12 - 2PM", "blue"), POST("fb", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  27: [PILL("Webinar", "1PM", "pink"), POST("ig", "Somos UK", "12:30PM"), { kind: "more", n: 10 }],
  28: [PILL("Team chat", "12 - 2PM", "blue"), POST("fb", "Somos UK", "12:30PM"), { kind: "more", n: 10 }],
  29: [PILL("Quarterly", "8AM", "blue"), POST("ig", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  30: [POST("ig", "Somos UK", "12:30PM"), POST("ig", "Somos", "1:00PM")],
  31: [POST("x", "Somos", "2:00PM"), POST("ig", "Somos", "2:00PM")],
};
function MonthEvent({ ev, onOpen }) {
  if (ev.kind === "more") return <a className="me-more">{ev.n} more</a>;
  if (ev.kind === "pill") return (
    <div className={"me-pill " + ev.tone}><span className="material-symbols-outlined">event</span><span className="lbl">{ev.label}</span><span className="t">{ev.time}</span></div>
  );
  return (
    <div className="me-post" onClick={() => onOpen && onOpen({ net: ev.net, acct: ev.acct, time: ev.time, status: "published" })} role="button" tabIndex={0}>
      <Net k={ev.net} size={16} /><span className="acct">{ev.acct}</span><span className="t">{ev.time}</span>
    </div>
  );
}
function MonthCalendar({ onOpen }) {
  const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div className="p-month">
      <div className="pm-head">{WD.map(w => <div key={w} className="pm-hcell">{w}</div>)}</div>
      <div className="pm-grid">
        {MONTH_DAYS.map((c, i) => (
          <div key={i} className={"pm-cell" + (c.muted ? " muted" : "")}>
            <div className="pm-date">{c.date}</div>
            {!c.muted && (MONTH_EVENTS[c.date] || []).map((ev, j) => <MonthEvent key={j} ev={ev} onOpen={onOpen} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekCalendar({ onOpen, onOpenNote }) {
  return (
    <div className="p-week">
      <div className="p-gutter-head">GMT<br/>-04:00</div>
      {DAYS.map((d, i) => (
        <div key={i} className={"p-dayhead" + (d.today ? " today" : "")}>
          <span className="dname">{d.name}</span>
          <span className="p-datenum">{d.date}</span>
          {d.note && <div className={"p-note" + (d.noteTone ? " " + d.noteTone : "")} onClick={() => onOpenNote && onOpenNote({ title: d.note, tone: d.noteTone })} role="button" tabIndex={0}><span className="material-symbols-outlined">sticky_note_2</span>{d.note}</div>}
        </div>
      ))}
      <div className="p-gutter"></div>
      {DAYS.map((d, i) => {
        const key = d.today ? "22t" : d.date;
        return (
          <div key={i} className="p-daycol">
            {(CARDS[key] || []).map((c, j) => <CalCard key={j} card={c} onOpen={onOpen} />)}
          </div>
        );
      })}
    </div>
  );
}

// ── List view (board 1530:167451) — post-volume bar + day-grouped landscape cards ──
const CAL_CAPTION = "We're going to be in California for the month of August. Come see us and find out why Hayward is the best place to go next year :)";
const CAL_META = "Created at 6:30am · June 1, 2022 by Adrian Jung";
const LIST_DAYS = [
  { label: "Today | Thu May 21, 2026", count: "2 posts", posts: [
    { net: "ig", acct: "Somos",    time: "2:30PM", status: "published", dur: "2:36", n: "3" },
    { net: "x",  acct: "Somos UK", time: "2:30PM", status: "draft",     dur: "2:36", n: "3" },
  ] },
  { label: "Fri May 22, 2026", count: "2 posts", note: { title: "Webinar", tone: "blue" }, posts: [
    { net: "fb", acct: "Somos",    time: "2:30PM", status: "pending", dur: "2:36", n: "3" },
    { net: "ig", acct: "Somos UK", time: "2:30PM", status: "draft",   dur: "2:36", n: "3" },
  ] },
  { label: "Sat May 23, 2026", count: "2 posts", posts: [
    { net: "li", acct: "Somos",    time: "2:30PM", status: "draft", dur: "2:36", n: "3" },
    { net: "tt", acct: "Somos UK", time: "2:30PM", status: "draft", dur: "2:36", n: "3" },
  ] },
];
const VOL_WEEKS = [
  [[26,.3],[27,.35],[28,0],[29,0],[30,.3],[1,.3],[2,0]],
  [[3,0],[4,0],[5,.35],[6,.3],[7,.35],[8,0],[9,0]],
  [[10,.3],[11,.35],[12,.45],[13,0],[14,.4],[15,.45],[16,.3]],
  [[17,0],[18,0],[19,.5],[20,.45],[21,.6],[22,.35],[23,0]],
  [[24,0],[25,0],[26,.4],[27,.45],[28,.4],[29,.45],[30,0]],
];
function PostVolume() {
  return (
    <div className="pl-volume">
      <div className="plv-top">
        <span className="plv-title">Your post volume</span>
        <span className="plv-month">May 2026</span>
        <button className="icon-btn" type="button" aria-label="Collapse post volume" title="Collapse"><span className="material-symbols-outlined">keyboard_arrow_up</span></button>
      </div>
      <div className="plv-bars">
        {VOL_WEEKS.map((wk, i) => (
          <div className="plv-week" key={i}>
            {wk.map(([n, v], j) => (
              <div className={"plv-day" + (n === 21 ? " today" : "")} key={j}>
                <span className="n">{n}</span>
                {v > 0 && <span className="bar" style={{ height: (6 + v * 38) + "px" }}></span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
function LandscapeCard({ p, onOpen }) {
  return (
    <div className="lc-card" onClick={() => onOpen && onOpen({ net: p.net, acct: p.acct, time: p.time, status: p.status })} role="button" tabIndex={0}>
      <div className="lc-thumb">
        <div className="lc-badges">
          <span className="lc-badge"><span className="material-symbols-outlined">collections</span>{p.n}</span>
          <span className="lc-badge"><span className="material-symbols-outlined">play_arrow</span>{p.dur}</span>
        </div>
        <div className="lc-hover">
          <button className="lc-hbtn" type="button" aria-label="Quick add" onClick={(e) => e.stopPropagation()}><span className="material-symbols-outlined">add</span></button>
          <button className="lc-hbtn" type="button" aria-label="More options" onClick={(e) => e.stopPropagation()}><span className="material-symbols-outlined">more_horiz</span></button>
        </div>
      </div>
      <div className="lc-body">
        <div className="lc-top"><span className="lc-av"><Net k={p.net} size={20} /></span><span className="lc-acct">{p.acct}</span><span className="lc-time">{p.time}</span></div>
        <div className="lc-cap">{CAL_CAPTION}</div>
        <div className="lc-foot"><StatusChip status={p.status} /><span className="lc-meta">{CAL_META}</span><button className="lc-comment" type="button" aria-label="Comments" onClick={(e) => e.stopPropagation()}><span className="material-symbols-outlined">chat_bubble_outline</span></button></div>
      </div>
    </div>
  );
}
function ListView({ onOpen }) {
  return (
    <div className="pl-listwrap">
      <PostVolume />
      <div className="pl-list">
        {LIST_DAYS.map((day, i) => (
          <div className="pl-day" key={i}>
            <div className="pl-dayhead"><span className="d">{day.label}</span><span className="c">{day.count}</span><button className="icon-btn" type="button" aria-label="Day options" style={{ marginLeft: "auto" }}><span className="material-symbols-outlined">more_horiz</span></button></div>
            {day.note && <div className={"pl-noterow " + (day.note.tone || "")}><span className="material-symbols-outlined">sticky_note_2</span>{day.note.title}</div>}
            {day.posts.map((p, j) => <LandscapeCard key={j} p={p} onOpen={onOpen} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

function PostStatusHeader({ status, onClose }) {
  const map = {
    published: { bg: "var(--bento-system-sys-positive-50)",  fg: "#01781B", label: "Published", icon: "check_circle" },
    pending:   { bg: "var(--bento-system-sys-warning-100)", fg: "#6B4B15", label: "Pending",   icon: "warning" },
    draft:     { bg: "var(--bento-system-sys-neutral-alt-300)",     fg: "var(--bento-theme-color-text-base)", label: "Draft", icon: "edit_note" },
  };
  const s = map[status] || { bg: "var(--bento-system-sys-neutral-alt-300)", fg: "var(--bento-theme-color-text-base)", label: "Scheduled", icon: "schedule" };
  return (
    <div className="pd-status" style={{ background: s.bg, color: s.fg }}>
      <span className="material-symbols-outlined pd-status-ico">{s.icon}</span>
      <span className="pd-status-label">{s.label}</span>
      <button className="pd-x" type="button" aria-label="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
    </div>
  );
}

function PostDrawer({ card, onClose }) {
  if (!card) return null;
  const netName = { ig: "Instagram", fb: "Facebook", x: "X", li: "LinkedIn", tt: "TikTok", th: "Threads", pin: "Pinterest" }[card.net] || "Instagram";
  return (
    <aside className="post-drawer">
      <PostStatusHeader status={card.status} onClose={onClose} />
      <div className="pd-createdby">Created by Maria Rossi</div>
      <div className="pd-actions">
        <button className="pd-btn" type="button">Duplicate</button>
        <button className="pd-kebab" type="button" aria-label="More"><span className="material-symbols-outlined">more_horiz</span></button>
      </div>
      <div className="pd-preview">
        <div className="pd-pv-net"><Net k={card.net} size={20} /><span>{netName}</span></div>
        <div className="pd-pv-card">
          <div className="pd-pv-head">
            <span className="pd-pv-av"><Net k={card.net} size={18} /></span>
            <div className="pd-pv-acct"><span className="n">{card.acct}</span><span className="loc">Canada</span></div>
            <button className="pd-iconbtn sm" type="button" aria-label="More"><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
          <div className="pd-pv-img"></div>
          <div className="pd-pv-actions">
            <span className="material-symbols-outlined">favorite_border</span>
            <span className="material-symbols-outlined">chat_bubble_outline</span>
            <span className="material-symbols-outlined">send</span>
            <span className="material-symbols-outlined book">bookmark_border</span>
          </div>
          <div className="pd-pv-cap"><strong>{card.acct} Bank</strong> Plan your next impulse purchase on the go with the {card.acct} app.</div>
        </div>
      </div>
      <div className="pd-tabs">
        <button className="pd-tab on" type="button">Details</button>
        <button className="pd-tab" type="button">Internal comments <span className="pd-tabct">2+</span></button>
      </div>
      <div className="pd-list">
        <div className="pd-row"><div className="lbl">Scheduled by</div><div className="val">Maria Rossi</div></div>
        <div className="pd-row"><div className="lbl">Scheduled time</div><div className="val">Wednesday, Oct 24 at 2:30pm</div></div>
        <div className="pd-row"><div className="lbl">Whiteboard</div><div className="val">Halloween campaign</div></div>
        <div className="pd-row"><div className="lbl row">Tags<button className="pd-edit" type="button" aria-label="Edit tags"><span className="material-symbols-outlined">edit</span></button></div><div className="val">Task, top 3</div></div>
      </div>
    </aside>
  );
}

function NoteDrawer({ note, onClose }) {
  if (!note) return null;
  const colorName = note.tone === "blue" ? "Blue" : "Yellow";
  const dot = note.tone === "blue" ? "var(--bento-global-categorical-color-1-fill)" : "var(--bento-system-sys-warning-300)";
  return (
    <aside className="post-drawer">
      <div className="pd-status nd-status">
        <span className="material-symbols-outlined pd-status-ico">sticky_note_2</span>
        <span className="pd-status-label">{note.title}</span>
        <button className="pd-x" type="button" aria-label="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
      </div>
      <div className="pd-createdby">Created by Maria Rossi</div>
      <div className="pd-actions">
        <button className="pd-btn" type="button">Create post</button>
        <button className="pd-btn" type="button">Delete</button>
        <button className="pd-kebab" type="button" aria-label="More"><span className="material-symbols-outlined">more_horiz</span></button>
      </div>
      <div className="pd-tabs">
        <button className="pd-tab on" type="button">Details</button>
        <button className="pd-tab" type="button">Internal comments</button>
      </div>
      <div className="nd-form">
        <label className="nd-field">
          <span className="nd-lbl">Color</span>
          <button className="nd-select" type="button"><span className="nd-dot" style={{ background: dot }}></span>{colorName}<span className="material-symbols-outlined">keyboard_arrow_down</span></button>
        </label>
        <label className="nd-field">
          <span className="nd-lbl">Start date</span>
          <div className="nd-input"><span className="material-symbols-outlined lead">calendar_today</span><input defaultValue="5 / 23 / 2024" /><button className="nd-clear" type="button" aria-label="Clear"><span className="material-symbols-outlined">cancel</span></button></div>
        </label>
        <div className="nd-toggle">
          <span className="nd-switch on"><span className="knob"></span></span>
          <span>All day</span>
        </div>
        <label className="nd-field">
          <span className="nd-lbl">Title</span>
          <div className="nd-input"><input defaultValue={note.title} /><button className="nd-clear" type="button" aria-label="Clear"><span className="material-symbols-outlined">cancel</span></button></div>
        </label>
        <label className="nd-field">
          <span className="nd-lbl">Description</span>
          <div className="nd-input area"><textarea defaultValue="We're having a sale, please use this creative for any posts going out today!"></textarea><button className="nd-clear" type="button" aria-label="Clear"><span className="material-symbols-outlined">cancel</span></button></div>
        </label>
        <div className="nd-media">
          <button className="nd-addimg" type="button" aria-label="Add image"><span className="material-symbols-outlined">image</span></button>
          <span className="nd-thumb"><button className="nd-thumbx" type="button" aria-label="Remove"><span className="material-symbols-outlined">cancel</span></button></span>
        </div>
      </div>
      <div className="nd-foot">
        <button className="nd-clearbtn" type="button">Clear</button>
        <button className="nd-apply" type="button">Apply</button>
      </div>
    </aside>
  );
}

function PlanEmpty({ onCreate }) {
  return (
    <div className="suite-state empty">
      <div className="suite-state-inner">
        <div className="ico"><span className="material-symbols-outlined">event_available</span></div>
        <h2>Nothing scheduled this week</h2>
        <p>Your calendar is clear. Create a post or drop in a note to start planning the week ahead.</p>
        <div className="acts">
          <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">sticky_note_2</span>Add a note</button>
          <button className="hs-btn hs-btn--primary" type="button" onClick={onCreate}><span className="material-symbols-outlined">add</span>Create a post</button>
        </div>
      </div>
    </div>
  );
}
function PlanError({ onRetry }) {
  return (
    <div className="suite-state error">
      <div className="suite-state-inner">
        <div className="ico"><span className="material-symbols-outlined">cloud_off</span></div>
        <h2>We couldn't load your calendar</h2>
        <p>Your scheduled posts are safe. This is usually a brief connection hiccup — try loading the week again.</p>
        <div className="acts">
          <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">help</span>View status</button>
          <button className="hs-btn hs-btn--primary" type="button" onClick={onRetry}><span className="material-symbols-outlined">refresh</span>Try again</button>
        </div>
      </div>
    </div>
  );
}
function PlanLoading() {
  return (
    <div className="p-week" aria-busy="true">
      <div className="p-gutter-head"><div className="suite-sk" style={{ width: 32, height: 24, margin: "8px auto" }}></div></div>
      {DAYS.map((d, i) => (
        <div key={i} className="p-dayhead"><div className="suite-sk" style={{ width: 60, height: 14, margin: "6px 0" }}></div><div className="suite-sk" style={{ width: 28, height: 28, borderRadius: 999 }}></div></div>
      ))}
      <div className="p-gutter"></div>
      {DAYS.map((d, i) => (
        <div key={i} className="p-daycol">
          {[0, 1].slice(0, (i % 3)).map(j => <div key={j} className="suite-sk" style={{ height: 150, borderRadius: 8, margin: "8px" }}></div>)}
        </div>
      ))}
    </div>
  );
}

function Planner() {
  const [view, setView] = React.useState("week");
  const [surface, setSurface] = React.useState("calendar"); // calendar | empty | error | loading
  const [openCard, setOpenCard] = React.useState(null);
  const [openNote, setOpenNote] = React.useState(null);
  const showCard = (c) => { setOpenNote(null); setOpenCard(c); };
  const showNote = (n) => { setOpenCard(null); setOpenNote(n); };
  const SAMPLE_CARD = CARDS["22"][1];
  const SAMPLE_NOTE = { title: "Spring sale", tone: undefined };
  const DEMO = [["detail", "Detail"], ["edit", "Edit"], ["empty", "Empty"], ["error", "Error"], ["loading", "Loading"]];
  const onState = (k) => {
    if (k === "detail") { setSurface("calendar"); showCard(SAMPLE_CARD); }
    else if (k === "edit") { setSurface("calendar"); showNote(SAMPLE_NOTE); }
    else { setOpenCard(null); setOpenNote(null); setSurface(k); }
  };
  const demoValue = openCard ? "detail" : openNote ? "edit" : surface === "calendar" ? "calendar" : surface;
  return (
    <div className={"planner" + (openCard || openNote ? " has-drawer" : "")}>
      <header className="p-topbar">
        <h1>Calendar</h1>
        <div className="p-spacer"></div>
        <button className="icon-btn" type="button" aria-label="Display settings"><span className="material-symbols-outlined">tune</span></button>
        <button className="icon-btn" type="button" aria-label="Share"><span className="material-symbols-outlined">share</span></button>
        <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">download</span>Export</button>
        <div className="p-split">
          <button className="p-split-main" type="button"><span className="material-symbols-outlined">add</span>Create a post</button>
          <button className="p-split-chev" type="button" aria-label="More create options"><span className="material-symbols-outlined">expand_more</span></button>
        </div>
        <span className="p-divider"></span>
        <button className="p-ws" type="button"><span className="p-ws-av">S</span>Somos<span className="material-symbols-outlined">expand_more</span></button>
        <button className="icon-btn" type="button" aria-label="Settings"><span className="material-symbols-outlined">settings</span></button>
      </header>

      <div className="p-toolbar">
        <button className="icon-btn" type="button" aria-label="Previous week"><span className="material-symbols-outlined">chevron_left</span></button>
        <button className="p-today-btn" type="button">Today</button>
        <button className="icon-btn" type="button" aria-label="Next week"><span className="material-symbols-outlined">chevron_right</span></button>
        <span className="p-divider"></span>
        <button className="p-range" type="button">{view === "week" ? "May 17–23, 2026" : "May 2026"}<span className="material-symbols-outlined">expand_more</span></button>
        <div className="p-spacer"></div>
        <button className="p-viewsel" type="button" onClick={() => setView(v => v === "week" ? "month" : v === "month" ? "list" : "week")}>{view === "month" ? "Month" : view === "list" ? "List" : "Week condensed"}<span className="material-symbols-outlined">expand_more</span></button>
        <button className="icon-btn" type="button" aria-label="Media view"><span className="material-symbols-outlined">image_search</span></button>
        <button className="icon-btn" type="button" aria-label="Grid view"><span className="material-symbols-outlined">apps</span></button>
        <button className="p-filters" type="button"><span className="material-symbols-outlined">filter_list</span>Filters<span className="material-symbols-outlined">expand_more</span></button>
      </div>

      <div className="p-cal-row">
        <div className="p-cal-wrap">
          {surface === "empty" ? <PlanEmpty onCreate={() => setSurface("calendar")} />
            : surface === "error" ? <PlanError onRetry={() => setSurface("loading")} />
            : surface === "loading" ? <PlanLoading />
            : (view === "month" ? <MonthCalendar onOpen={showCard} /> : view === "list" ? <ListView onOpen={showCard} /> : <WeekCalendar onOpen={showCard} onOpenNote={showNote} />)}
        </div>
        {surface === "calendar" && <OverviewRail />}
      </div>
      {openCard && <PostDrawer card={openCard} onClose={() => setOpenCard(null)} />}
      {openNote && <NoteDrawer note={openNote} onClose={() => setOpenNote(null)} />}
      <SuiteStates states={[["calendar", view === "month" ? "Month" : view === "list" ? "List" : "Week"], ...DEMO]} value={demoValue} onChange={onState} />
    </div>
  );
}

/* Right-side Calendar overview rail (board "Calendar - overview (NEW)"):
   three flat Bento summary cards. Green/amber deltas only (no-red rule). */
function OverviewRail() {
  return (
    <aside className="p-overview" aria-label="Calendar overview">
      <div className="po-card">
        <div className="po-lbl">Scheduled this week</div>
        <div className="po-val">8</div>
        <div className="po-delta up"><span className="material-symbols-outlined">arrow_upward</span>+3 vs last week</div>
      </div>
      <div className="po-card">
        <div className="po-lbl">Awaiting approval</div>
        <div className="po-val">2</div>
        <div className="po-sub">1 due today</div>
      </div>
      <div className="po-card">
        <div className="po-lbl">Auto-boost spend</div>
        <div className="po-val">$1,240</div>
        <div className="po-delta down"><span className="material-symbols-outlined">arrow_downward</span>-4.2% ROAS</div>
      </div>
    </aside>
  );
}

function App() {
  return <div className="suite-app"><SuiteRail active="perch" /><PerchDrawer active="calendar" /><Planner /></div>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
