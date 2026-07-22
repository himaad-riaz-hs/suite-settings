// nest.jsx — Nest (Engage / Inbox) on the Suite shell.
// Source: social-os-reboot.fig /Nest. Rail active="nest" (purple).

function NestDrawer({ active, onSelect }) {
  const groups = [
    { head: "Inbox", items: [
      { key: "conversations", icon: "forum",          label: "All conversations", badge: "12", href: "nest.html" },
      { key: "priority",      icon: "flag",           label: "Priority queue",    badge: "20" },
      { key: "assigned",      icon: "how_to_reg",     label: "Assigned to me",    badge: "100" },
      { key: "mentions",      icon: "alternate_email",label: "Mentions",          badge: "20" },
      { key: "streams",       icon: "dashboard",      label: "Streams" },
    ]},
    { head: "Workflows", items: [
      { key: "autoreplies", icon: "reply",      label: "Auto-replies" },
      { key: "routing",     icon: "alt_route",  label: "Routing rules" },
      { key: "slas",        icon: "timer",      label: "SLAs" },
    ]},
    { head: "Analytics", items: [
      { key: "explore",  icon: "query_stats",   label: "Explore" },
      { key: "myreports",icon: "assessment",    label: "My Reports" },
      { key: "realtime", icon: "monitor_heart", label: "Real-time monitoring" },
      { key: "exports",  icon: "file_download", label: "Exports" },
    ]},
  ];
  return <SuiteDrawer title="Nest" active={active} lead={{ key: "overview", icon: "home", label: "Overview" }} groups={groups} onSelect={onSelect} />;
}

// Board 4731:73453 — New queue (7 conversations).
const CONVOS = [
  { id: 1, init: "PP", img: "assets/nest/a1.jpg", c: "var(--hs-cat-3-bg)", cf: "var(--hs-cat-3-fg)", net: "ig", name: "PixelPioneer7", time: "5 hours ago", preview: "We offer standard, expedited, and express delivery.", reply: true, on: true, handle: "@pixelpioneer7", vis: "Private", sentiment: "neg", heat: 2, sla: "1d", timer: true, tags: ["Support"] },
  { id: 2, init: "CC", img: "assets/nest/a2.jpg", c: "var(--hs-cat-5-bg)", cf: "var(--hs-cat-5-fg)", net: "ig", name: "CodeCrafter_JS", time: "5 hours ago", preview: "Yes, we accept size exchanges. Please visit our return portal to begin.", reply: true, handle: "@codecrafter_js", vis: "Private", sentiment: "neg", heat: 1, tags: [] },
  { id: 3, init: "DD", img: "assets/nest/a3.jpg", c: "var(--hs-cat-1-bg)", cf: "var(--hs-cat-1-fg)", net: "fb", name: "DataDrivenDude", time: "15:17", preview: "Yes, we offer wholesale pricing. Please contact our sales team for details.", reply: true, handle: "Messenger", vis: "Public", sentiment: "pos", tags: [] },
  { id: 4, init: "ZZ", img: "assets/nest/a4.jpg", c: "var(--hs-cat-7-bg)", cf: "var(--hs-cat-7-fg)", net: "fb", name: "ZenithZephyrs", time: "15:11", preview: "Yes, we accept returns on unworn items. Please see our policy online.", reply: true, handle: "Messenger", vis: "Public", sentiment: "neu", tags: [] },
  { id: 5, init: "BB", img: "assets/nest/a5.jpg", c: "var(--hs-cat-9-bg)", cf: "var(--hs-cat-9-fg)", net: "x", name: "BinaryBlitz", time: "13:05", preview: "Hi there! Thanks for reaching out. How can I help you today?", reply: true, handle: "@binaryblitz", vis: "Private", sentiment: "neu", tags: [] },
  { id: 6, init: "DY", img: "assets/nest/a1.jpg", c: "var(--hs-cat-3-bg)", cf: "var(--hs-cat-3-fg)", net: "x", name: "DebugDynamo", time: "12:27", preview: "Thanks for the DM! Let me know how I can assist you.", reply: true, handle: "@debugdynamo", vis: "Private", sentiment: "neu", tags: [] },
  { id: 7, init: "IM", img: "assets/nest/a2.jpg", c: "var(--hs-cat-5-bg)", cf: "var(--hs-cat-5-fg)", net: "ig", name: "InnovateWithMia", time: "2 days ago", preview: "Thanks for your message! I'll respond as soon as possible.", reply: true, handle: "@innovatewithmia", vis: "Private", sentiment: "neu", tags: [] },
  { id: 8, init: "SB", img: "assets/nest/a3.jpg", c: "var(--hs-cat-2-bg)", cf: "var(--hs-cat-2-fg)", net: "x", name: "SophisticatedBytes", time: "00:28", preview: "Great, thanks for confirming! Let me know if you need anything else.", reply: true, handle: "@sophisticatedbytes", vis: "Private", sentiment: "neu", tags: [] },
];

function NetGlyph({ k }) {
  const P = {
    x:  "M13.3 10.6 20.5 2.5h-1.7l-6.2 7.05-5-7.05H2l7.5 10.65L2 21.5h1.7l6.6-7.45 5.3 7.45h5.6l-7.9-11zm-2.3 2.6-.77-1.07L4.3 3.8h2.6l4.9 6.9.77 1.07 6.4 9.03h-2.6z",
    fb: "M13.5 21v-8.2h2.75l.4-3.2h-3.15V7.55c0-.93.26-1.56 1.6-1.56h1.7V3.13c-.3-.04-1.3-.13-2.47-.13-2.45 0-4.13 1.5-4.13 4.24V9.6H7.5v3.2h2.7V21z",
    li: "M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM7 8.48H3V21h4zm6.32 0H9.5V21h3.82v-6.57c0-3.55 4.45-3.84 4.45 0V21H21.6v-7.93c0-6-6.9-5.78-8.32-2.83z",
    ig: "M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-11.85a1.44 1.44 0 1 1-1.44 1.44 1.44 1.44 0 0 1 1.44-1.44zm4.09 1.47a7.06 7.06 0 0 0-.48-2.34 4.92 4.92 0 0 0-2.81-2.81 7.06 7.06 0 0 0-2.34-.48C15.66 0 15.31 0 12 0S8.34 0 7.13.06a7.06 7.06 0 0 0-2.34.48 4.92 4.92 0 0 0-2.81 2.81 7.06 7.06 0 0 0-.48 2.34C1.44 6.34 1.44 6.69 1.44 10s0 3.66.06 4.87a7.06 7.06 0 0 0 .48 2.34 4.92 4.92 0 0 0 2.81 2.81 7.06 7.06 0 0 0 2.34.48C8.34 24 8.69 24 12 24s3.66 0 4.87-.06a7.06 7.06 0 0 0 2.34-.48 4.92 4.92 0 0 0 2.81-2.81 7.06 7.06 0 0 0 .48-2.34c.06-1.21.06-1.56.06-4.87s0-3.66-.06-4.69zm-2.16 9.45a4.36 4.36 0 0 1-1.15 1.6 4.36 4.36 0 0 1-1.6 1.04 6.3 6.3 0 0 1-2.14.4c-1.2.05-1.56.06-4.45.06s-3.25 0-4.45-.06a6.3 6.3 0 0 1-2.14-.4 4.36 4.36 0 0 1-1.6-1.04 4.36 4.36 0 0 1-1.04-1.6 6.3 6.3 0 0 1-.4-2.14C2.27 13.26 2.26 12.9 2.26 10s0-3.25.06-4.45a6.3 6.3 0 0 1 .4-2.14 4.36 4.36 0 0 1 1.04-1.6 4.36 4.36 0 0 1 1.6-1.04 6.3 6.3 0 0 1 2.14-.4C8.75 2.27 9.1 2.26 12 2.26s3.25 0 4.45.06a6.3 6.3 0 0 1 2.14.4 4.36 4.36 0 0 1 1.6 1.04 4.36 4.36 0 0 1 1.04 1.6 6.3 6.3 0 0 1 .4 2.14c.05 1.2.06 1.56.06 4.45s-.01 3.26-.35 4.22z",
  };
  return (
    <span className={"net " + k}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={P[k]} fill="#fff"></path></svg>
    </span>
  );
}

// Collapsed contact-tools rail (board 4731:73423, far-right 56px column).
function ContactRail({ onOpen }) {
  return (
    <aside className="ne-crail" aria-label="Conversation tools">
      <button className="ne-icon ne-tooltipbtn" type="button" aria-label="Contact details" title="Contact details" onClick={onOpen}><span className="material-symbols-outlined">account_circle</span></button>
      <button className="ne-icon ne-tooltipbtn" type="button" aria-label="Conversation history" title="Conversation history" style={{ marginTop: "auto" }}><span className="material-symbols-outlined">forum</span></button>
    </aside>
  );
}

function ContactPanel({ contact, onClose }) {
  const c = contact;
  return (
    <aside className="ne-contact" aria-label="Contact details">
      <div className="ne-cdhead">
        <span>Contact details</span>
        <button className="ne-icon ne-tooltipbtn" type="button" aria-label="Close details" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
      </div>
      <div className="ne-cdbody">
        <div className="ne-cdprofile">
          <span className="avatar" style={c.img ? { backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: c.c, color: c.cf }}>{!c.img && c.init}<NetGlyph k={c.net} /></span>
          <div className="nm">{c.name}</div>
          <div className="hd">{c.handle}</div>
          <div className="ne-cdfaces">
            <span className="hs-badge hs-badge--neutral"><span className="material-symbols-outlined">verified</span>Verified customer</span>
          </div>
        </div>
        <div className="ne-cdsec">
          <div className="ne-cdlabel">Assigned to</div>
          <button className="ne-cdfield" type="button"><span className="av-sm">RW</span>Ryan Williams<span className="material-symbols-outlined">expand_more</span></button>
        </div>
        <div className="ne-cdsec">
          <div className="ne-cdlabel">Status</div>
          <span className="hs-badge hs-badge--neutral" style={{ height: 28 }}>New</span>
        </div>
        <div className="ne-cdsec">
          <div className="ne-cdlabel">Tags</div>
          <div className="ne-cdtags">{(c.tags && c.tags.length ? c.tags : ["—"]).map((t, i) => <span key={i} className="hs-badge hs-badge--neutral" style={{ height: 28 }}>{t}</span>)}</div>
        </div>
        <div className="ne-cdsec">
          <div className="ne-cdlabel">Contact groups</div>
          <div className="ne-cdtags"><span className="hs-badge hs-badge--info" style={{ height: 28 }}>VIP</span><span className="hs-badge hs-badge--neutral" style={{ height: 28 }}>Verified</span></div>
        </div>
        <div className="ne-cdsec">
          <div className="ne-cdlabel">Past conversations</div>
          <div className="ne-cdpast"><span className="material-symbols-outlined">forum</span>3 earlier threads</div>
          <div className="ne-cdpast"><span className="material-symbols-outlined">schedule</span>First contact Mar 2025</div>
        </div>
      </div>
    </aside>
  );
}

function AssignModal({ contact, onClose }) {
  const agents = [["RW", "Ryan Williams", true], ["DP", "Devin Park", false], ["team", "Support team", false]];
  return (
    <div className="ne-modal-scrim" onClick={onClose}>
      <div className="ne-modal" role="dialog" aria-modal="true" aria-label="Assign conversation" onClick={e => e.stopPropagation()}>
        <div className="ne-modal-head"><h2>Assign conversation</h2><button className="ne-icon ne-tooltipbtn" type="button" aria-label="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button></div>
        <div className="ne-modal-body">
          <div className="ne-modal-sec">
            <div className="ne-cdlabel">Assign to</div>
            <div className="ne-agentlist">
              {agents.map(([init, nm, on]) => (
                <label key={init} className={"ne-agent" + (on ? " on" : "")}>
                  <span className="av-sm">{init === "team" ? <span className="material-symbols-outlined" style={{ fontSize: 16 }}>group</span> : init}</span>
                  <span className="nm">{nm}</span>
                  <span className={"ne-radio" + (on ? " on" : "")}></span>
                </label>
              ))}
            </div>
          </div>
          <div className="ne-modal-sec">
            <div className="ne-cdlabel">Set status</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="cf selected" type="button">New</button>
              <button className="cf" type="button">Pending</button>
              <button className="cf" type="button">Resolved</button>
            </div>
          </div>
        </div>
        <div className="ne-modal-foot">
          <button className="hs-btn hs-btn--ghost" type="button" onClick={onClose}>Cancel</button>
          <button className="hs-btn hs-btn--primary" type="button" onClick={onClose}>Assign</button>
        </div>
      </div>
    </div>
  );
}

function NestEmpty() {
  return (
    <div className="ne-main"><header className="ne-comphead"></header>
      <div className="suite-state empty"><div className="suite-state-inner">
        <div className="ico"><span className="material-symbols-outlined">mark_email_read</span></div>
        <h2>You're all caught up</h2>
        <p>No conversations need attention right now. New messages from every connected channel land here automatically.</p>
        <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">done_all</span>View resolved</button><button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">tune</span>Adjust filters</button></div>
      </div></div>
    </div>
  );
}
function NestError({ onRetry }) {
  return (
    <div className="ne-main"><header className="ne-comphead"></header>
      <div className="suite-state error"><div className="suite-state-inner">
        <div className="ico"><span className="material-symbols-outlined">cloud_off</span></div>
        <h2>We couldn't load your inbox</h2>
        <p>Messages are still arriving — we just can't show them yet. This is usually a brief connection issue.</p>
        <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">help</span>View status</button><button className="hs-btn hs-btn--primary" type="button" onClick={onRetry}><span className="material-symbols-outlined">refresh</span>Try again</button></div>
      </div></div>
    </div>
  );
}
function NestLoading() {
  return (
    <div className="ne-main" aria-busy="true"><header className="ne-comphead"></header>
      <div className="ne-panes">
        <section className="ne-list"><div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          {[0,1,2,3,4].map(i => <div key={i} style={{ display: "flex", gap: 12 }}><div className="suite-sk" style={{ width: 40, height: 40, borderRadius: 999, flexShrink: 0 }}></div><div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}><div className="suite-sk" style={{ width: "60%", height: 12 }}></div><div className="suite-sk" style={{ width: "90%", height: 12 }}></div></div></div>)}
        </div></section>
        <section className="ne-detail" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="suite-sk" style={{ width: 200, height: 28, borderRadius: 8 }}></div>
          <div className="suite-sk" style={{ width: "70%", height: 60, borderRadius: 12 }}></div>
          <div className="suite-sk" style={{ width: "60%", height: 60, borderRadius: 12, alignSelf: "flex-end" }}></div>
        </section>
      </div>
    </div>
  );
}

function Nest({ view, panel, assignOpen, onCloseAssign, onClosePanel, onOpenPanel }) {
  const [sel, setSel] = React.useState(1);
  const active = CONVOS.find(c => c.id === sel) || CONVOS[0];
  return (
    <div className="ne-main">
      <header className="ne-comphead"></header>

      <div className="ne-panes">
        <section className="ne-list">
          <div className="ne-listchips">
            <button className="ne-chip" type="button">Channels <strong>9+</strong><span className="material-symbols-outlined">close</span></button>
            <button className="ne-chip" type="button">Filter <strong>9+</strong><span className="material-symbols-outlined">close</span></button>
            <button className="ne-icon" type="button" aria-label="More" style={{ marginLeft: "auto" }}><span className="material-symbols-outlined">more_horiz</span></button>
          </div>
          <div className="ne-listtabs">
            <a className="ne-tab on">New <span>99+</span></a>
            <a className="ne-tab">Pending <span>23</span></a>
            <button className="ne-select" type="button" style={{ marginLeft: "auto" }}>Select</button>
          </div>
          <div className="ne-convos">
            {CONVOS.map(c => (
              <div key={c.id} className={"ne-convo" + (c.unread ? " unread" : "") + (c.id === sel ? " on" : "")} onClick={() => setSel(c.id)}>
                <span className="avatar" style={c.img ? { backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: c.c, color: c.cf }}>{!c.img && c.init}<NetGlyph k={c.net} /></span>
                <div className="body">
                  <div className="row1"><span className="name">{c.name}</span><span className="time">{c.time}</span></div>
                  <div className="preview">{c.reply && <span className="material-symbols-outlined rep">reply</span>}{c.preview}</div>
                  <div className="ne-meta">
                    <span className={"vis " + (c.vis === "Public" ? "pub" : "")}>{c.vis}</span>
                    {c.sentiment === "neg" && <span className="face neg"><span className="material-symbols-outlined">mood_bad</span></span>}
                    {c.sentiment === "pos" && <span className="face pos"><span className="material-symbols-outlined">sentiment_satisfied</span></span>}
                    {c.sentiment === "neu" && <span className="face"><span className="material-symbols-outlined">sentiment_neutral</span></span>}
                    {c.heat && <span className="heat"><span className="material-symbols-outlined">local_fire_department</span>{c.heat}</span>}
                    {c.sla && <span className="sla">{c.sla}</span>}
                    {c.timer && <span className="face"><span className="material-symbols-outlined">timer</span></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ne-detail">
          <div className="ne-dethead">
            <span className="hs-badge hs-badge--neutral" style={{ height: 28 }}><span className="material-symbols-outlined">replay</span>Resolved</span>
            <span className="hs-badge hs-badge--positive" style={{ height: 28 }}><span className="material-symbols-outlined">sentiment_satisfied</span>Positive</span>
            <span className="ne-heat"><span className="material-symbols-outlined">local_fire_department</span>1</span>
            <span className="spacer"></span>
            <span className="ne-hotel"><span className="avatar sm" style={{ background: active.c, color: active.cf }}><NetGlyph k={active.net} /></span>Aura &amp; Ash</span>
            <button className="ne-icon ne-tooltipbtn" type="button" aria-label="Favorite" title="Favorite"><span className="material-symbols-outlined">favorite</span></button>
          </div>
          <div className="ne-subhead">
            <span className="ne-cg"><strong>Contact groups:</strong> VIP, Verified customers</span>
            <span className="ne-topics"><strong>Topics:</strong> billing</span>
            <button className="ne-edittopics" type="button">Edit topics</button>
          </div>
          <div className="ne-thread">
            <div className="ne-msg in">
              <div className="msg-col">
                <div className="msg-from"><span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: "-3px", marginRight: 4 }}>mail</span>Private message from <strong>{active.name}</strong> on Aug 10, 2023, 2:41pm</div>
                <div className="msg-row">
                  <span className="msg-av" style={active.img ? { backgroundImage: `url(${active.img})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: active.c, color: active.cf }}>{!active.img && active.init}<NetGlyph k={active.net} /></span>
                  <div className="b">What are my shipping options and how fast can I get my order?<button className="ne-react" type="button" aria-label="React"><span className="material-symbols-outlined">add_reaction</span></button></div>
                </div>
                <div className="msg-badges">
                  <span className="hs-badge hs-badge--neutral" style={{ height: 28 }}><span className="material-symbols-outlined">sentiment_neutral</span>Neutral</span>
                </div>
                <div className="msg-tags"><strong>Tags:</strong> <button className="ne-edittags" type="button">Add tags</button></div>
              </div>
            </div>
            <div className="ne-addnote"><button type="button"><span className="material-symbols-outlined">add_circle</span>Add note</button></div>
            <div className="ne-msg out">
              <div className="msg-col">
                <div className="msg-from"><span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: "-3px", marginRight: 4 }}>mail</span>Private message from Nest_hotels by external user on Aug 10, 2023, 2:41pm<svg className="send-ico" viewBox="0 0 20 20" aria-hidden="true"><path d="M2.925 5.025L9.18333 7.70833L2.91667 6.875L2.925 5.025ZM9.175 12.2917L2.91667 14.975V13.125L9.175 12.2917ZM1.25833 2.5L1.25 8.33333L13.75 10L1.25 11.6667L1.25833 17.5L18.75 10L1.25833 2.5Z"></path></svg></div>
                <div className="msg-row">
                  <div className="b">We offer standard, expedited, and express delivery options. Which works best?</div>
                  <span className="msg-av brand">AA<NetGlyph k={active.net} /></span>
                </div>
                <div className="msg-tags"><button className="ne-edittags" type="button">Add tags</button></div>
              </div>
            </div>
          </div>
          <div className="ne-reply ne-reply--resolved">
            <div className="ne-replybar">
              <button className="ne-trigger" type="button"><span>Unassigned</span><span className="material-symbols-outlined">keyboard_arrow_down</span></button>
              <span className="spacer"></span>
              <div className="ne-sendsplit">
                <button className="main" type="button">Move to New</button>
                <button className="chev" type="button" aria-label="More options"><span className="material-symbols-outlined">keyboard_arrow_down</span></button>
              </div>
            </div>
            <div className="ne-resolved-msg">
              <span className="material-symbols-outlined">lock</span>
              <span className="r-title">Resolved</span>
              <span className="r-sub">Move the conversation to New to reopen it and reply – <button className="r-link" type="button">Move to New</button></span>
            </div>
          </div>
        </section>
        {panel === "contact"
          ? <ContactPanel contact={active} onClose={onClosePanel} />
          : <ContactRail onOpen={onOpenPanel} />}
      </div>
      {assignOpen && <AssignModal contact={active} onClose={onCloseAssign} />}
    </div>
  );
}

function App() {
  const [view, setView] = React.useState("conversations");
  const [surface, setSurface] = React.useState("main"); // main | empty | error | loading
  const [panel, setPanel] = React.useState("none");      // none | contact
  const [assignOpen, setAssignOpen] = React.useState(false);
  const onState = (k) => {
    if (k === "detail") { setSurface("main"); setAssignOpen(false); setPanel("contact"); }
    else if (k === "edit") { setSurface("main"); setPanel("none"); setAssignOpen(true); }
    else { setPanel("none"); setAssignOpen(false); setSurface(k); }
  };
  const demoValue = assignOpen ? "edit" : panel === "contact" ? "detail" : surface;
  return (
    <div className="suite-app">
      <SuiteRail active="nest" />
      <NestDrawer active={view} onSelect={setView} />
      {surface === "main" && <Nest view={view} panel={panel} assignOpen={assignOpen} onCloseAssign={() => setAssignOpen(false)} onClosePanel={() => setPanel("none")} onOpenPanel={() => setPanel("contact")} />}
      {surface === "empty" && <NestEmpty />}
      {surface === "error" && <NestError onRetry={() => setSurface("loading")} />}
      {surface === "loading" && <NestLoading />}
      <SuiteStates
        states={[["main", "Inbox"], ["detail", "Contact"], ["edit", "Assign"], ["empty", "Empty"], ["error", "Error"], ["loading", "Loading"]]}
        value={demoValue} onChange={onState}
      />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
