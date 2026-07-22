// composer.jsx — Hootsuite "Create a post" with full Tagging flow.
// Built directly from /New-Composer-Flows-Web/Main-Flows/Default6 specs.

// ── Network glyphs ──────────────────────────────────────────────────
function XGlyph({ size = 20 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: 999, background: "#000",
      display: "inline-grid", placeItems: "center", color: "#fff",
      fontWeight: 700, fontSize: Math.round(size * 0.62), lineHeight: 1,
    }}>𝕏</span>
  );
}
function IGGlyph({ size = 20 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: Math.round(size * 0.28),
      background: "radial-gradient(circle at 30% 110%, #FFD774 0%, #F58529 25%, #DD2A7B 50%, #8134AF 75%, #515BD4 100%)",
      display: "inline-grid", placeItems: "center", color: "#fff",
    }}>
      <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}
function FBGlyph({ size = 20 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: 999, background: "#1877F2",
      display: "inline-grid", placeItems: "center", color: "#fff",
      fontFamily: "Georgia, serif", fontWeight: 700,
      fontSize: Math.round(size * 0.82), lineHeight: 1,
      paddingTop: Math.max(1, Math.round(size * 0.05)), boxSizing: "border-box",
    }}>f</span>
  );
}

// Geometrically-centered close glyph for the small dark clear circles
// (Material Symbols 'close' sits optically low in a 20px circle).
function ClearX() {
  return (
    <svg className="clear-x-svg" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M4 4l6 6M10 4l-6 6" />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg className="sparkle-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3v3M9 9v3M3 6h3M9 6h3" />
      <path d="M15 10l1.6 4.2L21 16l-4.4 1.6L15 22l-1.6-4.4L9 16l4.4-1.8L15 10z" />
    </svg>
  );
}

// Monochrome network glyphs for the "Your Post" per-network tabs (matches the
// dark, uncolored treatment in the composer board — NOT the brand-colored chips).
function NetTabGlyph({ net, size = 20 }) {
  const c = "var(--c-fg)";
  if (net === "fb") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={c}><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07c0 6 4.39 10.98 10.13 11.88v-8.4H7.08v-3.48h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.96.93-1.96 1.89v2.25h3.34l-.53 3.49h-2.8v8.4C19.61 23.05 24 18.07 24 12.07Z"/></svg>
  );
  if (net === "li") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={c}><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>
  );
  if (net === "ig") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9"><rect x="2.4" y="2.4" width="19.2" height="19.2" rx="5.2"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.4" cy="6.6" r="1.1" fill={c} stroke="none"/></svg>
  );
  if (net === "tt") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={c}><path d="M16.6 5.82a4.28 4.28 0 0 1-1.04-2.82h-3.1v12.4a2.59 2.59 0 1 1-1.84-2.48V9.74a5.66 5.66 0 1 0 4.94 5.61V8.9a7.34 7.34 0 0 0 4.28 1.37V7.16a4.28 4.28 0 0 1-3.24-1.34Z"/></svg>
  );
  return ( // x
    <svg width={size} height={size} viewBox="0 0 24 24" fill={c}><path d="M18.9 1.6h3.5l-7.64 8.73L23.76 22h-7.03l-5.5-7.19L4.93 22H1.42l8.17-9.34L.5 1.6h7.2l4.98 6.58 5.72-6.58Zm-1.23 18.3h1.94L6.42 3.6H4.34l13.33 16.3Z"/></svg>
  );
}

// ── Top bar ─────────────────────────────────────────────────────────
function TopBar({ onClose, editing }) {
  return (
    <header className="c-topbar">
      <h1>{editing ? "Edit draft" : "Create a post"}</h1>
      <button className="c-workspace" type="button">
        <span className="c-ws-avatar">SOMOS</span>
        <span>Somos</span>
        <span className="material-symbols-outlined">expand_more</span>
      </button>
      <div className="c-spacer"></div>
      <div className="c-actions">
        <button className="btn-outlined-sm" type="button">
          <span className="gpt-mark"><img src="assets/hootsuite-owly-small.png" alt="" /></span>
          Wisdom
        </button>
        <button className="c-iconbtn" type="button" title="Minimize">
          <span className="material-symbols-outlined">close_fullscreen</span>
        </button>
        <button className="c-iconbtn" type="button" onClick={onClose} title="Close">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </header>
  );
}

// ── Chip ────────────────────────────────────────────────────────────
function Chip({ icon, dark, children, onRemove }) {
  return (
    <span className={
      "chip" +
      (icon ? " has-icon" : "") +
      (dark ? " is-dark" : "")
    }>
      {icon && <span className="chip-icon">{icon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button className="chip-x" type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }} aria-label="Remove">
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </span>
  );
}

// ── Tag picker dropdown (the grouped picker) ────────────────────────
//
// Spec from dev notes:
//   • Required groups expanded by default with "Required" badge
//   • Optional groups collapsed
//   • Favorites first (if any), then required A-Z, optional A-Z, ungrouped last
//   • Individual tag selection only (no parent checkbox)
//   • Selected tags appear as individual pills above input
function TagPicker({ groups, selected, onToggle, onSearch, search }) {
  const [openGroups, setOpenGroups] = React.useState(() => {
    // Required groups + favorites open by default
    const map = {};
    groups.forEach(g => { map[g.id] = g.required || g.favorite; });
    return map;
  });
  const toggleGroup = (id) => setOpenGroups(o => ({ ...o, [id]: !o[id] }));

  // Filter tags by search
  const visible = groups.map(g => {
    if (!search) return g;
    const q = search.toLowerCase();
    return {
      ...g,
      tags: g.tags.filter(t => t.label.toLowerCase().includes(q)),
    };
  }).filter(g => !search || g.tags.length > 0);

  return (
    <div className="dropdown">
      <div className="dropdown-search">
        <div className="dropdown-search-wrap">
          <span className="material-symbols-outlined">search</span>
          <input
            className="dropdown-search-input"
            placeholder="Search tags"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      <div className="dropdown-body">
        {visible.map(group => {
          const isOpen = !!openGroups[group.id] || !!search;
          return (
            <div key={group.id} className={"dropdown-group" + (isOpen ? " is-open" : "")}>
              <button className="dropdown-group-head" type="button" onClick={() => toggleGroup(group.id)}>
                <span className="chev">
                  <span className="material-symbols-outlined">chevron_right</span>
                </span>
                <span className="gname">{group.label}</span>
                {group.required && (
                  <span className={"badge" + (group.unsatisfied ? " is-error" : "")}>
                    {group.unsatisfied ? "Required · Not satisfied" : "Required"}
                  </span>
                )}
              </button>
              {isOpen && group.tags.map(tag => {
                const isSel = selected.some(s => s.id === tag.id);
                return (
                  <button
                    key={tag.id}
                    className={"dropdown-item" + (isSel ? " is-selected" : "")}
                    type="button"
                    onClick={() => onToggle(tag, group)}
                  >
                    <span className="checkbox"></span>
                    <span className="label">{tag.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Composer-Organic profiles (board 1530:166210 / picker 1530:166349) ──
const ALL_PROFILES = [
  { key: "x",   net: "x",  label: "somosbank" },
  { key: "ig",  net: "ig", label: "somostbank" },
  { key: "fb",  net: "fb", label: "somosbank" },
  { key: "x2",  net: "x",  label: "somos_uk" },
  { key: "ig2", net: "ig", label: "somos.uk" },
  { key: "fb2", net: "fb", label: "Somos UK" },
];
function profileGlyph(net) {
  return net === "ig" ? <IGGlyph size={20} /> : net === "fb" ? <FBGlyph size={20} /> : <XGlyph size={20} />;
}
function DisconnectedBanner() {
  return (
    <div className="c-disc">
      <div className="c-disc-card">
        <span className="c-disc-icon"><span className="material-symbols-outlined">groups</span></span>
        <span className="c-disc-txt"><strong>99+</strong> Disconnected profiles</span>
        <span className="pt-spacer"></span>
        <button className="c-disc-viewall" type="button">View all</button>
      </div>
    </div>
  );
}
function ProfilePicker({ all, selected, onToggle }) {
  return (
    <div className="dropdown c-profilepicker">
      <div className="dropdown-search"><div className="dropdown-search-wrap"><span className="material-symbols-outlined">search</span><input className="dropdown-search-input" placeholder="Search profiles" autoFocus /></div></div>
      <div className="dropdown-body">
        <div className="c-pp-grouplabel">Recently used</div>
        {all.map(p => {
          const isSel = selected.some(s => s.key === p.key);
          return (
            <button key={p.key} className={"dropdown-item c-pp-item" + (isSel ? " is-selected" : "")} type="button" onClick={(e) => { e.stopPropagation(); onToggle(p); }}>
              <span className="checkbox"></span>
              <span className="c-pp-av">{profileGlyph(p.net)}</span>
              <span className="label">{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Composer ────────────────────────────────────────────────────────
// variant: "organic" = Composer-Organic board (canonical; disconnected-profiles
// banner + profile-picker dropdown + charcoal account chips); "flows" = the
// New-Composer-Flows-Web design preserved as a separate state.
function Composer({ editing, variant = "organic" }) {
  const organic = variant === "organic";
  const [campaign, setCampaign] = React.useState("Spring campaign");
  const [accounts, setAccounts] = React.useState([
    { key: "x",  net: "x",  label: "somosbank" },
    { key: "ig", net: "ig", label: "somostbank" },
    { key: "fb", net: "fb", label: "somosbank" },
  ]);
  const [profilePickerOpen, setProfilePickerOpen] = React.useState(false);
  const [tab, setTab] = React.useState("all");
  const [caption, setCaption] = React.useState(editing ? "Spring is here. Refresh your savings goals with the Somos app — round-ups, auto-save, and zero fees. Link in bio." : "✨ Plan your next impulse purchase on the go with the Somos app.");

  // ── Tagging state ─────────────────────────────────────────────────
  const TAG_GROUPS = [
    {
      id: "brand",
      label: "Brand",
      required: true,
      tags: [
        { id: "b1", label: "Coke" },
        { id: "b2", label: "Diet Coke" },
        { id: "b3", label: "Coke Zero" },
        { id: "b4", label: "Fanta" },
        { id: "b5", label: "Sprite" },
      ],
    },
    {
      id: "campaign",
      label: "Campaign",
      required: true,
      tags: [
        { id: "c1", label: "Summer2026" },
        { id: "c2", label: "Holiday2025" },
        { id: "c3", label: "Spring2026" },
        { id: "c4", label: "BackToSchool" },
      ],
    },
    {
      id: "region",
      label: "Region",
      tags: [
        { id: "r1", label: "North America" },
        { id: "r2", label: "Latin America" },
        { id: "r3", label: "EMEA" },
        { id: "r4", label: "APAC" },
      ],
    },
    {
      id: "content",
      label: "Content type",
      tags: [
        { id: "ct1", label: "Product launch" },
        { id: "ct2", label: "Behind-the-scenes" },
        { id: "ct3", label: "User-generated" },
        { id: "ct4", label: "Announcement" },
      ],
    },
  ];

  const [tags, setTags] = React.useState([
    { id: "b1", label: "Coke", groupId: "brand" },
    { id: "c1", label: "Summer2026", groupId: "campaign" },
  ]);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [tagSearch, setTagSearch]   = React.useState("");

  const toggleTag = (tag, group) => {
    setTags(curr => {
      const exists = curr.find(t => t.id === tag.id);
      if (exists) return curr.filter(t => t.id !== tag.id);
      return [...curr, { ...tag, groupId: group.id }];
    });
  };

  const removeAccount = (key) => setAccounts(a => a.filter(x => x.key !== key));
  const toggleProfile = (p) => setAccounts(a => a.some(x => x.key === p.key) ? a.filter(x => x.key !== p.key) : [...a, { key: p.key, net: p.net, label: p.label }]);

  // Click-away to close the profile picker (Composer-Organic)
  const profileRef = React.useRef(null);
  React.useEffect(() => {
    if (!profilePickerOpen) return;
    const onClick = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfilePickerOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [profilePickerOpen]);

  // Click-away to close picker
  const pickerRef = React.useRef(null);
  React.useEffect(() => {
    if (!pickerOpen) return;
    const onClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [pickerOpen]);

  return (
    <div className="composer">
      <TopBar editing={editing} />

      <main className="c-body">
        <section className="c-card">

          {/* LEFT — form */}
          <div className="c-left">

            {/* Campaign (optional) */}
            <div className="field">
              <label className="field-label">
                Campaign <span className="modifier">(optional)</span>
              </label>
              <div className="selector">
                <span className={"value" + (!campaign ? " is-placeholder" : "")}>
                  {campaign || "Select a campaign"}
                </span>
                {campaign && (
                  <button className="clear" type="button" onClick={() => setCampaign("")} aria-label="Clear">
                    <ClearX />
                  </button>
                )}
                <span className="chev">
                  <span className="material-symbols-outlined">expand_more</span>
                </span>
              </div>
            </div>

            {/* Publish to */}
            <div className="field">
              <div className="field-label-row">
                <label className="field-label">{organic ? "Select your social accounts" : "Publish to"}</label>
              </div>
              <div className="c-combowrap" ref={profileRef} style={{ position: "relative" }}>
                <div className={"combobox" + (profilePickerOpen ? " is-focus" : "")} onClick={() => organic && setProfilePickerOpen(true)}>
                  <div className="chips">
                    {accounts.map(acc => (
                      <Chip key={acc.key} icon={profileGlyph(acc.net)} dark={organic} onRemove={() => removeAccount(acc.key)}>
                        {acc.label}
                      </Chip>
                    ))}
                  </div>
                  {accounts.length > 0 && (
                    <button
                      className="clear-all"
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setAccounts([]); }}
                      aria-label="Clear all accounts"
                    >
                      <ClearX />
                    </button>
                  )}
                  <button className="chev" type="button" aria-label="Expand" onClick={(e) => { e.stopPropagation(); if (organic) setProfilePickerOpen(p => !p); }}>
                    <span className="material-symbols-outlined">expand_more</span>
                  </button>
                </div>
                {organic && profilePickerOpen && <ProfilePicker all={ALL_PROFILES} selected={accounts} onToggle={toggleProfile} />}
              </div>
              {organic && <DisconnectedBanner />}
            </div>

            {/* Your post tabs + caption */}
            <div className="field">
              <div className="post-tabs">
                <button className={"post-tab" + (tab === "all" ? " is-active" : "")} onClick={() => setTab("all")}>
                  Your Post
                </button>
                <button className={"post-tab" + (tab === "fb" ? " is-active" : "")} onClick={() => setTab("fb")} aria-label="Facebook" title="Facebook">
                  <span className="net-glyph"><NetTabGlyph net="fb" size={18} /></span>
                </button>
                <button className={"post-tab" + (tab === "li" ? " is-active" : "")} onClick={() => setTab("li")} aria-label="LinkedIn" title="LinkedIn">
                  <span className="net-glyph"><NetTabGlyph net="li" size={18} /></span>
                </button>
                <button className={"post-tab" + (tab === "ig" ? " is-active" : "")} onClick={() => setTab("ig")} aria-label="Instagram" title="Instagram">
                  <span className="net-glyph"><NetTabGlyph net="ig" size={18} /></span>
                </button>
                <button className={"post-tab" + (tab === "x" ? " is-active" : "")} onClick={() => setTab("x")} aria-label="X" title="X">
                  <span className="net-glyph"><NetTabGlyph net="x" size={18} /></span>
                </button>
                <button className={"post-tab" + (tab === "tt" ? " is-active" : "")} onClick={() => setTab("tt")} aria-label="TikTok" title="TikTok">
                  <span className="net-glyph"><NetTabGlyph net="tt" size={18} /></span>
                </button>
              </div>
              <div className="post-shell">
                <textarea
                  className="post-textarea"
                  placeholder="Write your captions, then customize it for each social network"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={2}
                />
                <div className="post-tools-row">
                  <span className="pt-spacer"></span>
                  <button className="owly-btn" type="button" title="Enhance with OwlyWriter AI">
                    <img className="owly-spark" src="assets/icons/composer/owlywriter.svg" alt="" />
                    Enhance with OwlyWriter
                  </button>
                  <button className="tool-btn" type="button" title="Emoji" aria-label="Emoji">
                    <img className="tool-ic" src="assets/icons/composer/emoji.svg" alt="" />
                  </button>
                  <button className="tool-btn" type="button" title="Hashtags" aria-label="Hashtags">
                    <img className="tool-ic" src="assets/icons/composer/hashtag.svg" alt="" />
                  </button>
                </div>
                <div className="media-row">
                  <button className="media-add" type="button" title="Add media" aria-label="Add media">
                    <span className="material-symbols-outlined">image</span>
                  </button>
                  <div className="media-thumbs">
                    <span className="media-thumb" style={{ backgroundImage: "url(assets/nest/a2.jpg)" }}></span>
                    <span className="media-thumb has-video" style={{ backgroundImage: "url(assets/nest/a4.jpg)" }}>
                      <span className="mt-dur"><span className="material-symbols-outlined">play_arrow</span>2:22</span>
                    </span>
                    <span className="media-thumb" style={{ backgroundImage: "url(assets/nest/a1.jpg)" }}></span>
                  </div>
                  <span className="pt-spacer"></span>
                  <button className="media-app canva" type="button" title="Design in Canva" aria-label="Design in Canva">
                    <img src="assets/icons/composer/canva.svg" alt="" />
                  </button>
                  <button className="media-app adobe" type="button" title="Adobe Express" aria-label="Adobe Express">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 4.5 17 19h-3.2l-1-3.1H9.1l1.05-2.7h1.78L10.4 8.9 7 19H3.8L9 4.5h3Z" fill="#fff"/></svg>
                  </button>
                </div>
                <div className="thread-row">
                  <div className="col">
                    <span className="tr-title">Thread</span>
                    <span className="tr-sub">Add another post to start a thread</span>
                  </div>
                  <button className="tr-add" type="button">
                    <span className="material-symbols-outlined">add_circle</span>
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Tag (required) — with grouped picker */}
            <div className="field" ref={pickerRef} style={{ position: "relative" }}>
                <label className="field-label">
                  Tag <span className="modifier">(required)</span>
                </label>
                <p className="field-help" style={{ margin: 0 }}>
                  Select at least 1 tag each from the required groups (Brand, Campaign)
                </p>
                <div
                  className={"combobox" + (pickerOpen ? " is-focus" : "")}
                  onClick={() => setPickerOpen(true)}
                >
                  <div className="chips">
                    {tags.map(tag => (
                      <Chip key={tag.id} dark onRemove={() => setTags(t => t.filter(x => x.id !== tag.id))}>
                        {tag.label}
                      </Chip>
                    ))}
                    {pickerOpen && (
                      <input
                        className="ti-input"
                        placeholder={tags.length === 0 ? "Search and select tags…" : ""}
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                  {tags.length > 0 && (
                    <button
                      className="clear-all"
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setTags([]); setTagSearch(""); }}
                      aria-label="Clear all tags"
                    >
                      <ClearX />
                    </button>
                  )}
                  <button className="chev" type="button" onClick={(e) => { e.stopPropagation(); setPickerOpen(p => !p); }}>
                    <span className="material-symbols-outlined">{pickerOpen ? "expand_less" : "expand_more"}</span>
                  </button>
                </div>
                {pickerOpen && (
                  <TagPicker
                    groups={TAG_GROUPS}
                    selected={tags}
                    onToggle={toggleTag}
                    onSearch={setTagSearch}
                    search={tagSearch}
                  />
                )}
            </div>
          </div>

          {/* RIGHT — preview (reflects selected network tab) */}
          <aside className="c-right">
            {(() => {
              const net = tab === "ig" ? "ig" : tab === "fb" ? "fb" : "x";
              const META = {
                x:  { glyph: <XGlyph size={20} />,  title: "Twitter/X", handle: "@somosbank" },
                ig: { glyph: <IGGlyph size={20} />, title: "Instagram", handle: "somosbank" },
                fb: { glyph: <FBGlyph size={20} />, title: "Facebook",  handle: "Somos Bank" },
              };
              const m = META[net];
              return (
                <div className={"preview net-" + net}>
                  <div className="preview-head">
                    <span className="net-glyph">{m.glyph}</span>
                    <span className="x-title">{m.title}</span>
                  </div>
                  <div className="preview-card">
                    <span className="pc-avatar">SOMOS</span>
                    <div className="col" style={{ minWidth: 0 }}>
                      <div className="pc-meta">
                        <span className="pc-name">Somos Bank</span>
                        <span className="pc-handle">{m.handle}</span>
                        <span className="pc-time">•Just now</span>
                      </div>
                      {caption
                        ? <div className="pc-caption">{caption}</div>
                        : <div className="pc-caption pc-placeholder">Your caption will appear here as you type…</div>}
                      <div className="pc-actions">
                        <button className="pcb" type="button" aria-label="Reply"><span className="material-symbols-outlined">chat_bubble_outline</span></button>
                        <button className="pcb" type="button" aria-label="Repost"><span className="material-symbols-outlined">repeat</span></button>
                        <button className="pcb" type="button" aria-label="Like"><span className="material-symbols-outlined">favorite_border</span></button>
                        <span style={{ flex: 1 }}></span>
                        <button className="pcb" type="button" aria-label="More"><span className="material-symbols-outlined">more_horiz</span></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </aside>
        </section>
      </main>

      <footer className="c-footer">
        <a className="btn-ghost" href="boost.html" style={{ marginRight: "auto", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span className="material-symbols-outlined">rocket_launch</span>Boost a post
        </a>
        <button className="btn-ghost" type="button">Save as draft</button>
        <button className="btn-chip" type="button">
          Schedule for later
          <span className="material-symbols-outlined">expand_more</span>
        </button>
        <div className="split-btn">
          <button className="sb-main" type="button">{editing ? "Update post" : "Post now"}</button>
          <span className="sb-divider"></span>
          <button className="sb-chev" type="button">
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

// ── State surfaces ────────────────────────────────────────────────────
function ComposerEmpty({ onConnect }) {
  return (
    <div className="composer">
      <TopBar />
      <div className="suite-state empty">
        <div className="suite-state-inner">
          <div className="ico"><span className="material-symbols-outlined">group_add</span></div>
          <h2>Connect an account to start posting</h2>
          <p>You haven't connected any social accounts yet. Add at least one network and you can compose, schedule, and publish from here.</p>
          <div className="acts">
            <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">help</span>Learn more</button>
            <button className="hs-btn hs-btn--primary" type="button" onClick={onConnect}><span className="material-symbols-outlined">add</span>Connect an account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function ComposerError({ onRetry }) {
  return (
    <div className="composer">
      <TopBar />
      <div className="suite-state error">
        <div className="suite-state-inner">
          <div className="ico"><span className="material-symbols-outlined">error</span></div>
          <h2>We couldn't publish your post</h2>
          <p>X declined the request — your draft is saved and nothing was posted. Reconnect the account or try publishing again.</p>
          <div className="acts">
            <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">link</span>Reconnect X</button>
            <button className="hs-btn hs-btn--primary" type="button" onClick={onRetry}><span className="material-symbols-outlined">refresh</span>Try again</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function ComposerLoading() {
  return (
    <div className="composer" aria-busy="true">
      <TopBar />
      <main className="c-body">
        <section className="c-card">
          <div className="c-left" style={{ display: "flex", flexDirection: "column", gap: 20, padding: 24 }}>
            <div className="suite-sk" style={{ width: "40%", height: 14 }}></div>
            <div className="suite-sk" style={{ width: "100%", height: 44, borderRadius: 8 }}></div>
            <div className="suite-sk" style={{ width: "30%", height: 14 }}></div>
            <div className="suite-sk" style={{ width: "100%", height: 44, borderRadius: 8 }}></div>
            <div className="suite-sk" style={{ width: "100%", height: 160, borderRadius: 8 }}></div>
            <div className="suite-sk" style={{ width: "50%", height: 44, borderRadius: 8 }}></div>
          </div>
          <aside className="c-right" style={{ padding: 24 }}>
            <div className="suite-sk" style={{ width: "100%", height: 220, borderRadius: 12 }}></div>
          </aside>
        </section>
      </main>
    </div>
  );
}
function ComposerScheduled({ onNew, onView }) {
  return (
    <div className="composer">
      <TopBar />
      <div className="suite-state">
        <div className="suite-state-inner">
          <div className="ico" style={{ background: "var(--bento-system-sys-positive-50)", color: "var(--bento-system-sys-positive-700)" }}><span className="material-symbols-outlined">task_alt</span></div>
          <h2 style={{ fontFamily: "var(--bento-theme-font-families-secondary)", fontSize: 30, lineHeight: 1.15 }}>Scheduled!</h2>
          <p>Your post goes live <strong>Tomorrow at 12:30 PM</strong> across <strong>3 networks</strong>. You'll find it on the calendar and can edit it any time before then.</p>
          <div className="acts">
            <button className="hs-btn hs-btn--secondary" type="button" onClick={onView}><span className="material-symbols-outlined">calendar_today</span>View in calendar</button>
            <button className="hs-btn hs-btn--primary" type="button" onClick={onNew}><span className="material-symbols-outlined">add</span>Create another</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [surface, setSurface] = React.useState("organic"); // organic | flows | edit | detail | empty | error | loading
  return (
    <div className="suite-app">
      <SuiteRail active="perch" />
      {surface === "organic" && <Composer key="organic" editing={false} variant="organic" />}
      {surface === "flows" && <Composer key="flows" editing={false} variant="flows" />}
      {surface === "edit" && <Composer key="edit" editing={true} variant="organic" />}
      {surface === "detail" && <ComposerScheduled onNew={() => setSurface("organic")} onView={() => setSurface("organic")} />}
      {surface === "empty" && <ComposerEmpty onConnect={() => setSurface("organic")} />}
      {surface === "error" && <ComposerError onRetry={() => setSurface("loading")} />}
      {surface === "loading" && <ComposerLoading />}
      <SuiteStates
        states={[["organic", "Composer"], ["flows", "Flows (legacy)"], ["edit", "Edit"], ["detail", "Scheduled"], ["empty", "Empty"], ["error", "Error"], ["loading", "Loading"]]}
        value={surface} onChange={setSurface}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
