// explore.jsx — Explore: topic-card discovery. Explore is NOT in the master
// nav → rail "More". Surfaces: discovery grid (main) · topic detail · empty ·
// error · loading. "Create a post about this" hands off to Composer (no own
// create surface — flagged). PerchNet from perch-common.

const TOPICS = [
  { id: "t1", name: "AI in the workplace", tag: "Trending", desc: "How teams are adopting AI tools and what it means for everyday work.", posts: "12.4K", up: "34%", spark: [3,4,4,6,5,7,9,8,10] },
  { id: "t2", name: "Sustainable banking", tag: "For you", desc: "Green finance, ethical lending, and climate-conscious money.", posts: "8.1K", up: "18%", spark: [4,3,5,4,6,5,7,6,8] },
  { id: "t3", name: "Open banking APIs", tag: "Industry", desc: "Connected accounts, data sharing, and the API economy in finance.", posts: "5.6K", up: "9%", spark: [5,5,4,6,5,6,7,7,8] },
  { id: "t4", name: "Gen Z money habits", tag: "Trending", desc: "How younger consumers save, spend, and think about money.", posts: "21.2K", up: "52%", spark: [2,3,4,5,7,8,9,11,12] },
  { id: "t5", name: "Fraud & security", tag: "For you", desc: "Protecting accounts and customers from scams and fraud.", posts: "6.9K", up: "12%", spark: [4,4,5,5,6,6,7,7,8] },
  { id: "t6", name: "Round-up savings", tag: "Industry", desc: "Spare-change saving features and the habits behind them.", posts: "3.4K", up: "7%", spark: [3,4,4,5,5,6,6,7,7] },
  { id: "t7", name: "Crypto regulation", tag: "Trending", desc: "Evolving rules shaping digital assets and exchanges.", posts: "15.8K", up: "41%", spark: [3,4,6,5,7,8,9,9,11] },
  { id: "t8", name: "Financial wellness", tag: "For you", desc: "Tools and content that help people feel in control of their money.", posts: "9.7K", up: "23%", spark: [4,5,5,6,7,7,8,9,10] },
];
const CATS = ["For you", "Trending", "Industry", "Hashtags", "Creators"];

function ExploreTop({ back, onBack, children }) {
  return (
    <header className="ex-top">
      {back && <button className="ex-back" type="button" onClick={onBack}><span className="material-symbols-outlined">arrow_back</span>Explore</button>}
      {!back && <h1>Explore</h1>}
      <div className="ex-search"><span className="material-symbols-outlined">search</span><input placeholder="Search topics, hashtags, and creators" /></div>
      <span className="ex-spacer"></span>
      {children}
      <button className="ex-ws" type="button"><span className="av">SOMOS</span>Somos<span className="material-symbols-outlined">expand_more</span></button>
    </header>
  );
}

function Spark({ data, max }) {
  const m = max || Math.max(...data);
  return <div className="ec-spark">{data.map((v, i) => <i key={i} className={i >= data.length - 2 ? "hot" : ""} style={{ height: (v / m * 100) + "%" }}></i>)}</div>;
}

// ── 1 · DISCOVERY GRID (main) ───────────────────────────────────────────
function Discover({ onOpen }) {
  const [cat, setCat] = React.useState("For you");
  return (
    <div className="ex-main">
      <ExploreTop />
      <div className="ex-body">
        <div className="ex-cats">{CATS.map(c => <button key={c} type="button" className={"cf" + (cat === c ? " selected" : "")} onClick={() => setCat(c)}>{c}</button>)}</div>
        <div className="ex-sec-h"><h2>Topics gaining traction</h2><a>See all</a></div>
        <div className="ex-grid">
          {TOPICS.map(t => (
            <button key={t.id} className="ex-card" type="button" onClick={() => onOpen(t)}>
              <div className="media"><span className="material-symbols-outlined">image</span></div>
              <div className="ec-body">
                <span className="ec-name">{t.name}</span>
                <span className="ec-desc">{t.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 2 · TOPIC DETAIL ────────────────────────────────────────────────────
function TopicDetail({ topic, onBack }) {
  const t = topic;
  const posts = [
    { net: "li", g: 2, who: "Fintech Today", time: "2h", text: "Why challenger banks are leaning into financial wellness as a differentiator.", likes: "1.2K", shares: "340" },
    { net: "x", g: 0, who: "@maya_builds", time: "5h", text: "Round-ups quietly became the killer feature. Nobody talks about it but everyone uses it.", likes: "880", shares: "120" },
    { net: "ig", g: 3, who: "moneywithpriya", time: "1d", text: "3 settings to turn on in your banking app today 👇", likes: "4.1K", shares: "612" },
  ];
  return (
    <div className="ex-main">
      <ExploreTop back onBack={onBack}>
        <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">bookmark_add</span>Save topic</button>
        <a className="hs-btn hs-btn--primary" href="composer.html"><span className="material-symbols-outlined">edit_square</span>Create a post</a>
      </ExploreTop>
      <div className="ex-body">
        <div className="ex-detailwrap">
          <div className="ex-hero">
            <div className="hero-copy">
              <h1>{t.name}</h1>
              <div className="meta"><span><span className="material-symbols-outlined" style={{ fontSize: 16 }}>forum</span>{t.posts} posts</span><span><span className="material-symbols-outlined" style={{ fontSize: 16 }}>trending_up</span>{t.up} this week</span><span><span className="material-symbols-outlined" style={{ fontSize: 16 }}>sentiment_satisfied</span>68% positive</span></div>
            </div>
          </div>
          <div className="ex-detail-grid">
            <div>
              <div className="ex-panel">
                <h3>Volume · last 9 days</h3>
                <div className="ex-trend-spark">{t.spark.concat(t.spark.slice(0,0)).map((v, i) => <i key={i} style={{ height: (v / Math.max(...t.spark) * 100) + "%" }}></i>)}</div>
              </div>
              <div className="ex-panel">
                <h3>Top posts in this topic</h3>
                {posts.map((p, i) => (
                  <div className="ex-post" key={i}>
                    <span className="thumb"><span className="material-symbols-outlined">image</span></span>
                    <div className="pbody">
                      <div className="pmeta"><PerchNet k={p.net} /><strong style={{ color: "var(--bento-theme-color-text-base)" }}>{p.who}</strong>· {p.time}</div>
                      <div className="ptext">{p.text}</div>
                      <div className="pstats"><span><span className="material-symbols-outlined">favorite</span>{p.likes}</span><span><span className="material-symbols-outlined">repeat</span>{p.shares}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <aside className="ex-side">
              <div className="ex-panel">
                <h3>Related topics</h3>
                <div className="ex-related">{["Open banking","Fintech","Savings","Gen Z money","Neobanks"].map(r => <button key={r} type="button" className="cf">{r}</button>)}</div>
              </div>
              <div className="ex-panel">
                <h3>Suggested for a post</h3>
                <div className="ex-related">{["#financialwellness","#fintech","#moneytips","#banking"].map(r => <span key={r} className="hs-badge hs-badge--neutral" style={{ height: 28 }}>{r}</span>)}</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── States ──────────────────────────────────────────────────────────────
function ExploreEmpty() {
  return (
    <div className="ex-main"><ExploreTop /><div className="suite-state empty"><div className="suite-state-inner">
      <div className="ico"><span className="material-symbols-outlined">travel_explore</span></div>
      <h2>Nothing to explore yet</h2>
      <p>Follow a few topics or connect your accounts and we'll surface trending conversations, hashtags, and creators in your industry.</p>
      <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">add</span>Follow topics</button><button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">explore</span>Browse all</button></div>
    </div></div></div>
  );
}
function ExploreErrorState({ onRetry }) {
  return (
    <div className="ex-main"><ExploreTop /><div className="suite-state error"><div className="suite-state-inner">
      <div className="ico"><span className="material-symbols-outlined">cloud_off</span></div>
      <h2>We couldn't load discovery</h2>
      <p>The discovery feed didn't respond. Your followed topics are safe — this is usually a brief connection issue.</p>
      <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">help</span>View status</button><button className="hs-btn hs-btn--primary" type="button" onClick={onRetry}><span className="material-symbols-outlined">refresh</span>Try again</button></div>
    </div></div></div>
  );
}
function ExploreLoading() {
  return (
    <div className="ex-main" aria-busy="true"><ExploreTop /><div className="ex-body">
      <div className="ex-cats">{[0,1,2,3].map(i => <div key={i} className="suite-sk" style={{ width: 90, height: 36, borderRadius: 999 }}></div>)}</div>
      <div className="ex-grid">{[0,1,2,3,4,5,6,7].map(i => <div key={i} className="ex-card"><div className="suite-sk" style={{ height: 130 }}></div><div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}><div className="suite-sk" style={{ width: "70%", height: 14 }}></div><div className="suite-sk" style={{ width: "50%", height: 12 }}></div><div className="suite-sk" style={{ width: "100%", height: 28 }}></div></div></div>)}</div>
    </div></div>
  );
}

function App() {
  const [surface, setSurface] = React.useState("main");
  const [topic, setTopic] = React.useState(TOPICS[0]);
  return (
    <div className="suite-app">
      <SuiteRail active="perch" />
      <PerchDrawer active="explore" />
      {surface === "main" && <Discover onOpen={t => { setTopic(t); setSurface("detail"); }} />}
      {surface === "detail" && <TopicDetail topic={topic} onBack={() => setSurface("main")} />}
      {surface === "empty" && <ExploreEmpty />}
      {surface === "error" && <ExploreErrorState onRetry={() => setSurface("loading")} />}
      {surface === "loading" && <ExploreLoading />}
      <SuiteStates
        states={[["main", "Discover"], ["detail", "Topic"], ["empty", "Empty"], ["error", "Error"], ["loading", "Loading"]]}
        value={surface} onChange={setSurface}
      />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
