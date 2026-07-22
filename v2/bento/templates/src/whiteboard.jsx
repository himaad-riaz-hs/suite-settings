// whiteboard.jsx — Perch › Whiteboard. Board 1530:165121.
// Three surfaces: Dashboard (card grid of whiteboards) · Individual whiteboard
// (canvas of Owly "Idea" sticky cards in columns) · Add task (canvas + modal).
// Real Somos/Halloween-campaign data. No-red, 304px drawer, page-instance.
const OWL = "assets/hootsuite-owly-small.png";
const AV = [["MR", "#7E48EC"], ["PN", "#2A6FDB"], ["LC", "#1F8A5B"], ["DP", "#C2611A"], ["RY", "#C9789B"], ["SK", "#3F8FD4"]];

const BOARDS = [
  { title: "Halloween campaign", desc: "Start brainstorming on our upcoming campaign and post ideas!", people: 5 },
  { title: "Winter sale", desc: "Ideas for the winter sale, and Christmas campaign brainstorm", people: 4 },
  { title: "Evergreen stuff", desc: "Keep these around for reuse! 🍃 ♻️", people: 6 },
  { title: "January webinar", desc: "Start thinking of social posts regarding the upcoming webinar", people: 3 },
];

// Individual whiteboard — columns of Owly idea cards (board: "Idea N: …")
const COLUMNS = [
  { title: "Ideas", cards: [
    { t: "Idea 1: Spooky recipe reel", d: "Short video or carousel featuring a Halloween-themed recipe with pumpkin, like a “Pumpkin Spice Float” or “Ghoulish Pumpkin Slushies.”", thumb: "assets/dm/post4.jpg" },
    { t: "Idea 2: Halloween contest", d: "Caption: Get ready to brew up some fun this Halloween! 🎃 Share your creations with #SomosHalloween and tag us for a chance to be featured!", thumb: "assets/dm/post3.jpg" },
  ]},
  { title: "Drafting", cards: [
    { t: "Idea 3: Costume reveal", d: "Team costume reveal countdown across stories, building to a launch-day group photo on the feed.", thumb: null },
  ]},
  { title: "Ready to schedule", cards: [
    { t: "Idea 4: Trick-or-treat giveaway", d: "Tag two friends to enter. Three winners get a year of zero-fee banking. Runs Oct 28–31.", thumb: "assets/dm/post1.jpg" },
  ]},
];

function IdeaCard({ c, onOpen }) {
  return (
    <div className="wb-idea" role="button" tabIndex={0} onClick={onOpen}>
      <div className="wb-idea-head"><img src={OWL} alt="" width="20" height="20" />Idea</div>
      <div className="wb-idea-body">
        <div className="t">{c.t}</div>
        <div className="d">{c.d}</div>
        {c.thumb && <span className="wb-idea-thumb" style={{ backgroundImage: `url(${c.thumb})`, backgroundSize: "cover", backgroundPosition: "center" }}></span>}
      </div>
    </div>
  );
}

function Dashboard({ onOpen }) {
  return (
    <div className="wb-body">
      <div className="wb-gallery">
        {BOARDS.map((b, i) => (
          <div className="wb-bcard" key={i} role="button" tabIndex={0} onClick={onOpen}>
            <div className="bbody">
              <div className="btitle">{b.title}</div>
              <div className="bdesc">{b.desc}</div>
              <div className="bavatars">
                {AV.slice(0, Math.min(b.people, 4)).map(([init, col], k) => <span className="av" key={k} style={{ background: col }}>{init}</span>)}
                {b.people > 4 && <span className="av more">+{b.people - 4}</span>}
              </div>
            </div>
            <button className="bkebab pp-actbtn ne-tooltipbtn" type="button" aria-label="Whiteboard options" title="Options" onClick={e => e.stopPropagation()}><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
        ))}
        <button className="wb-newcard" type="button"><span className="material-symbols-outlined">add</span>New whiteboard</button>
      </div>
    </div>
  );
}

function BoardCanvas({ onAdd, onOpen }) {
  return (
    <div className="wb-canvas">
      {COLUMNS.map((col, i) => (
        <div className="wb-col" key={i}>
          <div className="wb-col-head"><span className="t">{col.title}</span><span className="ct">{col.cards.length}</span></div>
          {col.cards.map((c, j) => <IdeaCard key={j} c={c} onOpen={onOpen} />)}
          <button className="wb-addcard" type="button" onClick={onAdd}><span className="material-symbols-outlined">add</span>Add task</button>
        </div>
      ))}
    </div>
  );
}

function AddTaskModal({ onClose }) {
  return (
    <div className="wb-modal-scrim" onClick={onClose}>
      <aside className="wb-modal" role="dialog" aria-modal="true" aria-label="Add task" onClick={e => e.stopPropagation()}>
        <div className="wb-modal-head"><h2>Add task</h2><button className="pp-actbtn ne-tooltipbtn" type="button" aria-label="Close" title="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button></div>
        <div className="wb-modal-body">
          <div className="wb-field"><label htmlFor="wb-t">Title</label><input id="wb-t" className="wb-input" placeholder="e.g. Pumpkin recipe reel" /></div>
          <div className="wb-field"><label htmlFor="wb-d">Description</label><textarea id="wb-d" className="wb-input wb-textarea" placeholder="Add notes, a caption draft, or a content idea…"></textarea></div>
          <div className="wb-field"><label>Cover</label><div className="wb-drop"><span className="material-symbols-outlined">add_photo_alternate</span>Drag an image here or browse</div></div>
          <div className="wb-field"><label htmlFor="wb-c">Column</label><select id="wb-c" className="wb-input" style={{ cursor: "pointer" }}><option>Ideas</option><option>Drafting</option><option>Ready to schedule</option></select></div>
        </div>
        <div className="wb-modal-foot"><button className="hs-btn hs-btn--ghost" type="button" onClick={onClose}>Cancel</button><button className="hs-btn hs-btn--primary" type="button" onClick={onClose}><span className="material-symbols-outlined">add</span>Add task</button></div>
      </aside>
    </div>
  );
}

function Whiteboard() {
  const [surface, setSurface] = React.useState("dashboard"); // dashboard | board | addtask
  return (
    <div className="pp-main">
      <PerchTopBar title={surface === "dashboard" ? "Whiteboard" : "Halloween campaign"}>
        {surface === "dashboard"
          ? <button className="pp-secondary" type="button" style={{ marginRight: 4 }} onClick={() => setSurface("board")}><span className="material-symbols-outlined">add</span>New whiteboard</button>
          : <button className="pp-secondary" type="button" style={{ marginRight: 4 }} onClick={() => setSurface("addtask")}><span className="material-symbols-outlined">add</span>Add task</button>}
      </PerchTopBar>
      {surface === "dashboard" && <Dashboard onOpen={() => setSurface("board")} />}
      {surface !== "dashboard" && <BoardCanvas onAdd={() => setSurface("addtask")} onOpen={() => {}} />}
      {surface === "addtask" && <AddTaskModal onClose={() => setSurface("board")} />}
      <SuiteStates states={[["dashboard", "Dashboard"], ["board", "Whiteboard"], ["addtask", "Add task"]]} value={surface} onChange={setSurface} />
    </div>
  );
}
function App() {
  return <div className="suite-app"><SuiteRail active="perch" /><PerchDrawer active="whiteboard" /><Whiteboard /></div>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
