// dm-automation.jsx — Perch › DM automation. Board 1530:165121 (DM automation).
// A table of published posts/reels with per-post DM automation toggled on/off.
// Columns: Status (toggle) · Post or reel (thumb + caption) · Post status ·
// Keyword · Total comments · DMs sent · Open rate · Total clicks · Action.
// Real Somos data, canonical grid table, no-red, 304px drawer, page-instance.

const POSTS = [
  { thumb: "assets/dm/post1.jpg", cap: "Excited to share my latest adventure! Just back from a breathtaking mountain hike — the views from the summit were absolutely unreal. Comment ADVENTURE for the full trip guide.", kw: "ADVENTURE", comments: "1,243", dms: "1,180", open: "68%", clicks: "412", on: true },
  { thumb: "assets/dm/post4.jpg", cap: "Just tried the new cafe downtown and it might be the best oat latte in the city. Drop CAFE below and I'll DM you the address plus a discount code for your first visit.", kw: "CAFE", comments: "892", dms: "845", open: "71%", clicks: "301", on: true },
  { thumb: "assets/dm/post3.jpg", cap: "Weekend reset at the beach — sun, sand, and zero notifications. Comment BEACH and I'll send you my full list of underrated coastal spots to visit this summer.", kw: "BEACH", comments: "1,508", dms: "1,402", open: "64%", clicks: "523", on: false },
  { thumb: "assets/dm/post1.jpg", cap: "Finished an unputdownable mystery novel this weekend and I need a new one immediately. Comment BOOK for my full reading list and I'll DM you where to grab a copy.", kw: "BOOK", comments: "674", dms: "640", open: "73%", clicks: "188", on: true },
  { thumb: "assets/dm/post5.jpg", cap: "Front row at the best live concert of the year — still buzzing. Comment CONCERT and I'll send you the setlist plus presale links for the next tour dates.", kw: "CONCERT", comments: "2,140", dms: "1,980", open: "59%", clicks: "712", on: true },
  { thumb: "assets/dm/post3.jpg", cap: "Sunday baking: fresh cinnamon rolls straight from the oven and the whole kitchen smells incredible. Comment BAKING and I'll DM you the recipe step by step.", kw: "BAKING", comments: "1,021", dms: "970", open: "66%", clicks: "355", on: false },
];

function DMTop({ onCreate }) {
  return (
    <PerchTopBar title="DM automation">
      <button className="pp-kebab ne-tooltipbtn" type="button" aria-label="Analytics" title="Analytics"><span className="material-symbols-outlined">monitoring</span></button>
      <button className="pp-kebab ne-tooltipbtn" type="button" aria-label="Filters" title="Filters"><span className="material-symbols-outlined">tune</span></button>
      <button className="pp-primary" type="button" style={{ marginRight: 4 }} onClick={onCreate}><span className="material-symbols-outlined">add</span>Create DM automation</button>
    </PerchTopBar>
  );
}

function DMCreateModal({ onClose }) {
  const [sel, setSel] = React.useState(0);
  return (
    <div className="wb-modal-scrim" onClick={onClose}>
      <aside className="wb-modal" role="dialog" aria-modal="true" aria-label="Create DM automation" onClick={e => e.stopPropagation()}>
        <div className="wb-modal-head"><h2>Create DM automation</h2><button className="pp-actbtn ne-tooltipbtn" type="button" aria-label="Close" title="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button></div>
        <div className="wb-modal-body">
          <div className="wb-field"><label>1 · Choose a post or reel</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {POSTS.slice(0, 3).map((p, i) => (
                <button key={i} type="button" className={"dm-pick" + (sel === i ? " on" : "")} onClick={() => setSel(i)}>
                  <span className="dm-thumb" style={{ background: "var(--bento-system-sys-neutral-alt-200)", width: 40, height: 40, backgroundImage: "url(" + p.thumb + ")", backgroundSize: "cover", backgroundPosition: "center" }}></span>
                  <span className="dm-pick-cap">{p.cap}</span>
                  {sel === i && <span className="material-symbols-outlined" style={{ marginLeft: "auto", color: "var(--bento-theme-color-bg-primary)" }}>check_circle</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="wb-field"><label htmlFor="dm-kw">2 · Trigger keyword</label><input id="dm-kw" className="wb-input" placeholder="e.g. ADVENTURE" defaultValue={POSTS[sel].kw} /></div>
          <div className="wb-field"><label htmlFor="dm-msg">3 · Auto-reply message</label><textarea id="dm-msg" className="wb-input wb-textarea" placeholder="Thanks for your interest! Here's the link you asked for \u2192"></textarea></div>
        </div>
        <div className="wb-modal-foot"><button className="hs-btn hs-btn--ghost" type="button" onClick={onClose}>Cancel</button><button className="hs-btn hs-btn--primary" type="button" onClick={onClose}><span className="material-symbols-outlined">bolt</span>Create automation</button></div>
      </aside>
    </div>
  );
}

function DMAutomation({ onCreate }) {
  const [on, setOn] = React.useState(POSTS.map(p => p.on));
  return (
    <div className="pp-main">
      <DMTop onCreate={onCreate} />
      <div className="pp-body">
        <div className="pp-panel" style={{ padding: 0 }}>
          <table className="pp-table dm-posts">
            <thead>
              <tr>
                <th>Status</th>
                <th>Post or reel</th>
                <th>Post status</th>
                <th>Keyword</th>
                <th className="num">Total comments</th>
                <th className="num">DMs sent</th>
                <th className="num">Open rate</th>
                <th className="num">Total clicks</th>
                <th aria-label="Action"></th>
              </tr>
            </thead>
            <tbody>
              {POSTS.map((p, i) => (
                <tr key={i}>
                  <td><span className={"pp-toggle" + (on[i] ? " on" : "")} role="switch" aria-checked={on[i]} aria-label={on[i] ? "DM automation on" : "DM automation off"} tabIndex={0} onClick={() => setOn(a => a.map((v, j) => j === i ? !v : v))} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOn(a => a.map((v, j) => j === i ? !v : v)); } }}><span className="knob"></span></span></td>
                  <td><div className="pp-cellrow" style={{ alignItems: "flex-start", gap: 12 }}><img className="dm-thumb" src={p.thumb} alt="" /><span className="dm-cap">{p.cap}</span></div></td>
                  <td><span className="pp-badge pos"><span className="material-symbols-outlined">check_circle</span>Published</span></td>
                  <td>{p.kw}</td>
                  <td className="num">{p.comments}</td>
                  <td className="num">{p.dms}</td>
                  <td className="num">{p.open}</td>
                  <td className="num">{p.clicks}</td>
                  <td><button className="pp-actbtn ne-tooltipbtn" type="button" aria-label="Edit automation" title="Edit"><span className="material-symbols-outlined">edit</span></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DMEmpty() {
  return (
    <div className="pp-main">
      <DMTop />
      <div className="suite-state empty"><div className="suite-state-inner">
        <div className="ico"><span className="material-symbols-outlined">smart_toy</span></div>
        <h2>No DM automations yet</h2>
        <p>Turn a published post into a lead magnet — when someone comments your keyword, Nest sends them a DM automatically. Pick a post to get started.</p>
        <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">menu_book</span>Browse templates</button><button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">add</span>Create DM automation</button></div>
      </div></div>
    </div>
  );
}
function DMError({ onRetry }) {
  return (
    <div className="pp-main">
      <DMTop />
      <div className="suite-state error"><div className="suite-state-inner">
        <div className="ico"><span className="material-symbols-outlined">cloud_off</span></div>
        <h2>We couldn't load your automations</h2>
        <p>Your automations are still running — we just can't show them right now. This is usually a brief connection issue.</p>
        <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">help</span>View status</button><button className="hs-btn hs-btn--primary" type="button" onClick={onRetry}><span className="material-symbols-outlined">refresh</span>Try again</button></div>
      </div></div>
    </div>
  );
}
function DMLoading() {
  return (
    <div className="pp-main" aria-busy="true">
      <DMTop />
      <div className="pp-body"><div className="pp-panel" style={{ padding: 0 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, padding: "20px 16px", borderBottom: "1px solid var(--bento-theme-color-border-subtle)" }}>
              <div className="suite-sk" style={{ width: 44, height: 24, borderRadius: 999 }}></div>
              <div className="suite-sk" style={{ width: 56, height: 56, borderRadius: 8 }}></div>
              <div className="suite-sk" style={{ flex: 1, height: 14 }}></div>
              <div className="suite-sk" style={{ width: 90, height: 24, borderRadius: 8 }}></div>
              <div className="suite-sk" style={{ width: 48, height: 14 }}></div>
            </div>
          ))}
        </div>
      </div></div>
    </div>
  );
}
function App() {
  const [surface, setSurface] = React.useState("list");
  return (
    <div className="suite-app">
      <SuiteRail active="perch" /><PerchDrawer active="dm" />
      {(surface === "list" || surface === "create") && <DMAutomation onCreate={() => setSurface("create")} />}
      {surface === "empty" && <DMEmpty />}
      {surface === "error" && <DMError onRetry={() => setSurface("loading")} />}
      {surface === "loading" && <DMLoading />}
      {surface === "create" && <DMCreateModal onClose={() => setSurface("list")} />}
      <SuiteStates states={[["list", "Automations"], ["create", "Create"], ["empty", "Empty"], ["error", "Error"], ["loading", "Loading"]]} value={surface} onChange={setSurface} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
