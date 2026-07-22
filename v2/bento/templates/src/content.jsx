// content.jsx — Perch › Content (library) page on the Suite shell.
// Source: social-os-reboot.fig Perch "CL - Template (main page)". Rail active="perch".

const LIBRARIES = ["Brand evergreen", "Spring campaign", "Product launches", "Holiday 2025", "UGC & community"];

const IMG = ["assets/dm/post1.jpg", "assets/dm/post2.jpg", "assets/dm/post3.jpg", "assets/dm/post4.jpg", "assets/dm/post5.jpg"];
const TPL = [
  { thumb: IMG[0] }, { thumb: IMG[1], dur: "0:30" }, { thumb: IMG[2] }, { thumb: IMG[3] },
  { thumb: IMG[4] }, { thumb: IMG[0] }, { thumb: IMG[1] }, { thumb: IMG[2], dur: "1:12" },
  { thumb: IMG[3] }, { thumb: IMG[4] }, { thumb: IMG[0] }, { thumb: IMG[1] },
];

function TemplateCard({ c }) {
  return (
    <div className="ct-card">
      <div className="ct-thumb" style={{ backgroundImage: `url(${c.thumb})` }}>
        {c.dur && <span className="ct-mdur"><span className="material-symbols-outlined">play_arrow</span>{c.dur}</span>}
      </div>
      <div className="ct-cbody">
        <div className="ct-desc">A short description of the app to convince users to install it, keeping in…</div>
        <div className="ct-tags">#Tags, #Tags, #Tags, #Tags</div>
        <div className="ct-cfoot">
          <span className="ct-avail"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M7.99992 1.33325C4.31992 1.33325 1.33325 4.31992 1.33325 7.99992C1.33325 11.6799 4.31992 14.6666 7.99992 14.6666C11.6799 14.6666 14.6666 11.6799 14.6666 7.99992C14.6666 4.31992 11.6799 1.33325 7.99992 1.33325ZM6.66658 11.3333L3.33325 7.99992L4.27325 7.05992L6.66658 9.44658L11.7266 4.38659L12.6666 5.33325L6.66658 11.3333Z"></path></svg>Available</span>
          <span className="ct-used">Used 10 times</span>
        </div>
      </div>
    </div>
  );
}

// Media assets (board 1530:163735 "Library (1st Tab) - Media") — image-forward
// cards: thumbnail + filename + used-count, with a hover select checkbox.
const MEDIA = [
  { name: "spring-hero.jpg",    used: 12, thumb: IMG[0] },
  { name: "product-launch.png", used: 4,  thumb: IMG[3] },
  { name: "promo-reel.mp4",     used: 8,  dur: "0:30", thumb: IMG[1] },
  { name: "ugc-beach.jpg",      used: 3,  thumb: IMG[4] },
  { name: "holiday-bg.png",     used: 21, thumb: IMG[2] },
  { name: "brand-pattern.png",  used: 6,  thumb: IMG[0] },
  { name: "founder-quote.jpg",  used: 9,  thumb: IMG[3] },
  { name: "store-front.jpg",    used: 2,  thumb: IMG[1] },
];
function MediaCard({ m }) {
  return (
    <div className="ct-mcard" role="button" tabIndex={0}>
      <div className="ct-mthumb" style={{ backgroundImage: `url(${m.thumb})` }}>
        <span className="ct-mcheck" aria-hidden="true"></span>
        {m.dur && <span className="ct-mdur"><span className="material-symbols-outlined">play_arrow</span>{m.dur}</span>}
      </div>
      <div className="ct-mfoot">
        <span className="ct-mname">{m.name}</span>
        <span className="ct-mused">Used {m.used} times</span>
      </div>
    </div>
  );
}

function Content() {
  const [tab, setTab] = React.useState("library");
  const [seg, setSeg] = React.useState("templates");
  const [lib, setLib] = React.useState(0);
  return (
    <div className="ct-main">
      <header className="ct-top">
        <h1>Content</h1>
        <span className="spacer"></span>
        <button className="ct-icon ne-tooltipbtn" type="button" aria-label="Analytics"><span className="material-symbols-outlined">trending_up</span></button>
        <button className="ct-icon ne-tooltipbtn" type="button" aria-label="Display options"><span className="material-symbols-outlined">tune</span></button>
        <div className="ct-split">
          <button className="main" type="button"><span className="material-symbols-outlined">add</span>Create a post</button>
          <button className="chev" type="button" aria-label="More create options"><span className="material-symbols-outlined">expand_more</span></button>
        </div>
        <span className="ct-topdiv"></span>
        <button className="ct-ws" type="button"><span className="av">SOMOS</span>Somos<span className="material-symbols-outlined chev">keyboard_arrow_down</span></button>
        <button className="ct-icon ne-tooltipbtn" type="button" aria-label="Settings"><span className="material-symbols-outlined">settings</span></button>
      </header>

      <nav className="ct-tabs">
        <a className={"ct-tab" + (tab === "library" ? " on" : "")} onClick={() => setTab("library")}>Library</a>
        <a className={"ct-tab" + (tab === "apps" ? " on" : "")} onClick={() => setTab("apps")}>Apps</a>
      </nav>

      <div className="ct-body">
       <div className="ct-shell">
        <aside className="ct-libs">
          <button className="ct-addlib" type="button"><span className="material-symbols-outlined">add</span>Add a new library</button>
          <div className="ct-libhead">Libraries</div>
          {LIBRARIES.map((name, i) => (
            <button key={i} className={"ct-libitem" + (lib === i ? " on" : "")} onClick={() => setLib(i)}>{name}</button>
          ))}
        </aside>

        <section className="ct-panel">
          <div className="ct-toolbar">
            <div className="ct-toggle">
              <button className={"ct-tog" + (seg === "templates" ? " on" : "")} onClick={() => setSeg("templates")}>{seg === "templates" && <span className="material-symbols-outlined">check</span>}Templates</button>
              <button className={"ct-tog" + (seg === "media" ? " on" : "")} onClick={() => setSeg("media")}>{seg === "media" && <span className="material-symbols-outlined">check</span>}Media</button>
            </div>
            <button className="ct-sort" type="button">Newest<span className="material-symbols-outlined">keyboard_arrow_down</span></button>
            <span className="spacer"></span>
            <button className="ct-filter" type="button">Filter<span className="material-symbols-outlined">keyboard_arrow_down</span></button>
            <button className="ct-kebab" type="button" aria-label="More"><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
          <div className="ct-scroll">
            {seg === "media"
              ? <div className="ct-mgrid">{MEDIA.map((m, i) => <MediaCard key={i} m={m} />)}</div>
              : <div className="ct-grid">{TPL.map((c, i) => <TemplateCard key={i} c={c} />)}</div>}
          </div>
        </section>
       </div>
      </div>
    </div>
  );
}

function App() {
  return <div className="suite-app"><SuiteRail active="perch" /><PerchDrawer active="content" /><Content /></div>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
