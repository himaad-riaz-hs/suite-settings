// hootbio.jsx — Hootbio editor on the Perch sub-nav shell. Board-faithful to
// node 3133:63229 (Perch - Hootbio), "Social" tab (Social multiple selected).
// Header "Hootbio" + Update; line-style in-page tabs Links/Social/Design/Profile
// (Social active); "Add a social icon" 3-col network-chip grid; reorderable URL
// rows with 6-dot drag handles; phone/profile-card live preview; bottom action
// bar (Your link + hootbio.com/… , dark Save changes). No-red; sample user Ryan.

const HB_TABS = ["Links", "Social", "Design", "Profile"];

// Network chips for "Add a social icon" (board 8-chip grid; checked = added).
const HB_NETWORKS = [
  { key: "instagram", label: "Instagram", glyph: "ig", on: true },
  { key: "tiktok",    label: "TikTok",    glyph: "tt", on: false },
  { key: "facebook",  label: "Facebook",  glyph: "fb", on: true },
  { key: "x",         label: "X",         glyph: "x",  on: false },
  { key: "youtube",   label: "YouTube",   glyph: "yt", on: false },
  { key: "whatsapp",  label: "WhatsApp",  glyph: "wa", on: false },
  { key: "linkedin",  label: "LinkedIn",  glyph: "li", on: false },
  { key: "email",     label: "Email",     glyph: "em", on: true },
];

// Brand glyph (inline SVG, brand colours — these are network brand marks, not UI).
function NetMark({ g }) {
  const wrap = (bg, node) => <span className="hb-netmark" style={{ background: bg }}>{node}</span>;
  switch (g) {
    case "ig": return wrap("linear-gradient(135deg,#FEDA75,#FA7E1E,#D62976,#962FBF)", <span className="material-symbols-outlined">photo_camera</span>);
    case "tt": return wrap("#111", <span className="material-symbols-outlined">music_note</span>);
    case "fb": return wrap("#1877F2", <span className="hb-glyphtext">f</span>);
    case "x":  return wrap("#111", <span className="hb-glyphtext">𝕏</span>);
    case "yt": return wrap("#FF0000", <span className="material-symbols-outlined">play_arrow</span>);
    case "wa": return wrap("#25D366", <span className="material-symbols-outlined">chat</span>);
    case "li": return wrap("#0A66C2", <span className="hb-glyphtext">in</span>);
    case "em": return wrap("#6B7280", <span className="material-symbols-outlined">mail</span>);
    default:   return wrap("#6B7280", <span className="material-symbols-outlined">link</span>);
  }
}

// URL rows beneath the chip grid (reorderable; one per added network).
const HB_INIT_ROWS = [
  { id: "r1", glyph: "ig", label: "Instagram url", prefix: "instagram.com/", value: "somosbank" },
  { id: "r2", glyph: "fb", label: "Facebook url",  prefix: "facebook.com/",  value: "somosbank" },
  { id: "r3", glyph: "em", label: "Email address", prefix: "",               value: "hello@somos.com" },
];

function HootbioTop({ tab, setTab }) {
  return (
    <div className="hb2-top">
      <div className="hb2-titlebar">
        <h1>Hootbio</h1>
        <span className="hb2-spacer"></span>
        <button className="hs-btn hs-btn--secondary" type="button">Update</button>
      </div>
      <nav className="hs-tabs hb2-tabs" role="tablist" aria-label="Hootbio sections">
        {HB_TABS.map(t => (
          <button key={t} role="tab" aria-selected={t === tab} className={"hs-tab" + (t === tab ? " is-active" : "")} onClick={() => setTab(t)}>{t}</button>
        ))}
      </nav>
    </div>
  );
}

// Phone / profile-card live preview (board IPhone11ProXPreview).
function HootbioPreview({ added }) {
  return (
    <div className="hb2-preview">
      <div className="hb2-card">
        <span className="hb2-avatar"></span>
        <div className="hb2-name">Somos Bank</div>
        <div className="hb2-sub">Banking built for the way you actually spend.</div>
        <div className="hb2-sociallist">
          {added.map(n => <span key={n.key} className="hb2-socialicon"><NetMark g={n.glyph} /></span>)}
        </div>
        <div className="hb2-foot">Powered by Hootsuite</div>
      </div>
    </div>
  );
}

function Social() {
  const [nets, setNets] = React.useState(HB_NETWORKS);
  const [rows, setRows] = React.useState(HB_INIT_ROWS);
  const toggleNet = key => setNets(ns => ns.map(n => n.key === key ? { ...n, on: !n.on } : n));
  const removeRow = id => setRows(rs => rs.filter(r => r.id !== id));
  const added = nets.filter(n => n.on);
  return (
    <div className="hb2-main">
      <div className="hb2-body">
        <div className="hb2-left">
          <div className="hb2-panel">
            <div className="hb2-panel-h">Add a social icon</div>
            <div className="hb2-netgrid">
              {nets.map(n => (
                <button key={n.key} type="button" role="checkbox" aria-checked={n.on} className={"hb2-netchip" + (n.on ? " on" : "")} onClick={() => toggleNet(n.key)}>
                  <span className={"hb2-check" + (n.on ? " on" : "")} aria-hidden="true">{n.on && <span className="material-symbols-outlined">check</span>}</span>
                  <NetMark g={n.glyph} />
                  <span className="hb2-netlabel">{n.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="hb2-rows">
            {rows.map(r => (
              <div className="hb2-row" key={r.id}>
                <span className="hb2-drag" aria-hidden="true"><span className="material-symbols-outlined">drag_indicator</span></span>
                <div className="hb2-rowfield">
                  <label className="hb2-rowlabel">{r.label}</label>
                  <div className="hb2-input">
                    {r.prefix && <span className="hb2-prefix">{r.prefix}</span>}
                    <input defaultValue={r.value} aria-label={r.label} />
                    <button className="hb2-del" type="button" aria-label={"Remove " + r.label} title="Remove" onClick={() => removeRow(r.id)}><span className="material-symbols-outlined">delete</span></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <HootbioPreview added={added} />
      </div>

      <div className="hb2-actionbar">
        <span className="hb2-yourlink">Your link: <a href="#" className="hb2-link">hootbio.com/ryanwilliams</a></span>
        <span className="hb2-spacer"></span>
        <button className="hs-btn hs-btn--primary hb2-save" type="button">Save changes</button>
      </div>
    </div>
  );
}

// Other tabs reuse the prior editor content as honest placeholders so the tab
// bar is functional; the board's detailed Links/Design/Profile tabs aren't in
// scope for this pass.
function TabPlaceholder({ tab }) {
  return (
    <div className="hb2-main">
      <div className="hb2-body" style={{ alignItems: "stretch" }}>
        <div className="hb2-left">
          <div className="suite-state" style={{ minHeight: 360, border: 0 }}>
            <div className="suite-state-inner">
              <div className="ico"><span className="material-symbols-outlined">{tab === "Links" ? "link" : tab === "Design" ? "palette" : "person"}</span></div>
              <h2>{tab}</h2>
              <p>The {tab} tab isn't part of this board-fidelity pass. Switch to <strong>Social</strong> to see the matched screen.</p>
            </div>
          </div>
        </div>
        <HootbioPreview added={HB_NETWORKS.filter(n => n.on)} />
      </div>
      <div className="hb2-actionbar">
        <span className="hb2-yourlink">Your link: <a href="#" className="hb2-link">hootbio.com/ryanwilliams</a></span>
        <span className="hb2-spacer"></span>
        <button className="hs-btn hs-btn--primary hb2-save" type="button">Save changes</button>
      </div>
    </div>
  );
}

// Creating a Hootbio (board 3133:64210) — setup form: name, bio, profile
// picture upload, and custom URL with availability check (filled variant).
function CreatingHootbio() {
  return (
    <div className="hb2-main">
      <div className="hb2-body hbc-body">
        <div className="hbc-card">
          <h2 className="hbc-title">Create your Hootbio</h2>
          <div className="hbc-field">
            <div className="hbc-lbl">Name<span className="material-symbols-outlined info">info</span></div>
            <input className="hbc-input" defaultValue="Somos Bank" aria-label="Name" />
          </div>
          <div className="hbc-field">
            <div className="hbc-lbl">Bio<span className="hbc-opt">(optional)</span><span className="material-symbols-outlined info">info</span></div>
            <input className="hbc-input" defaultValue="Banking built for the way you actually spend." aria-label="Bio" />
          </div>
          <div className="hbc-field">
            <div className="hbc-lbl">Profile picture<span className="hbc-opt">(optional)</span><span className="material-symbols-outlined info">info</span></div>
            <div className="hbc-drop">
              <div className="hbc-droptext">Drop files here to upload</div>
              <button className="hs-btn hs-btn--secondary hs-btn--sm" type="button">Browse files</button>
            </div>
            <div className="hbc-file">
              <span className="hbc-filethumb"></span>
              <span className="hbc-filename">somos-mark.png</span>
              <span className="material-symbols-outlined ok">check</span>
              <button className="hbc-filex" type="button" aria-label="Remove file"><span className="material-symbols-outlined">cancel</span></button>
            </div>
          </div>
          <div className="hbc-field">
            <div className="hbc-lbl">Your link url<span className="material-symbols-outlined info">info</span></div>
            <div className="hbc-urlrow">
              <span className="hbc-urlprefix">hootbio.com/</span>
              <div className="hbc-urlinput"><input defaultValue="ryanwilliams" aria-label="Custom URL" /><button className="hbc-filex" type="button" aria-label="Clear"><span className="material-symbols-outlined">cancel</span></button></div>
            </div>
            <div className="hbc-avail"><span className="material-symbols-outlined">check_circle</span>This name is available!<button className="hbc-availx" type="button" aria-label="Dismiss"><span className="material-symbols-outlined">close</span></button></div>
          </div>
          <button className="hs-btn hs-btn--primary hbc-create" type="button">Create</button>
        </div>
        <HootbioPreview added={HB_NETWORKS.filter(n => n.on)} />
      </div>
    </div>
  );
}

function App() {
  const [tab, setTab] = React.useState("Social");
  const [surface, setSurface] = React.useState("editor");
  return (
    <div className="suite-app">
      <SuiteRail active="perch" />
      <PerchDrawer active="hootbio" />
      <div className="hb2-wrap">
        {surface === "creating"
          ? <CreatingHootbio />
          : <React.Fragment><HootbioTop tab={tab} setTab={setTab} />{tab === "Social" ? <Social /> : <TabPlaceholder tab={tab} />}</React.Fragment>}
      </div>
      <SuiteStates states={[["editor", "Editor"], ["creating", "Creating"]]} value={surface} onChange={setSurface} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
