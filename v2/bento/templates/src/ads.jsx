// ads.jsx — Ads campaign manager (first-class template, full redesign).
// Surfaces: all-campaigns list (main) · campaign overview (detail) · ad-set
// view · create-campaign flow (objective → audience & budget → creative →
// review) · empty · error · loading. Ads is NOT in the HS-Bento-master main
// nav → reached via the rail "More" overflow (flagged). PerchNet from perch-common.

const ADIMG = ["assets/dm/post1.jpg", "assets/dm/post3.jpg", "assets/dm/post5.jpg", "assets/dm/post4.jpg", "assets/dm/post2.jpg", "assets/dm/post1.jpg"];
const imgFill = src => ({ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" });

const CAMPAIGNS = [
  { id: "c1", name: "Spring Sale — Conversions", net: "fb", obj: "Sales", status: "active", budget: "$1,200", spend: "$842.18", results: "312 purchases", cpr: "$2.70", reach: "48,210", impr: "210K", clicks: "6,420", res: "312", on: true, err: "Limited delivery — audience too narrow" },
  { id: "c2", name: "App Installs — Q2", net: "ig", obj: "App promotion", status: "active", budget: "$2,000", spend: "$1,556.40", results: "1,204 installs", cpr: "$1.29", reach: "112,540", impr: "480K", clicks: "14,200", res: "1,204", on: true },
  { id: "c3", name: "Brand Awareness — Always On", net: "fb", obj: "Awareness", status: "active", budget: "$800", spend: "$640.00", results: "210K impressions", cpr: "$3.05 CPM", reach: "186,300", impr: "712K", clicks: "3,180", res: "210K", on: true },
  { id: "c4", name: "Lead Gen — Newsletter", net: "li", obj: "Leads", status: "active", budget: "$700", spend: "$390.00", results: "486 leads", cpr: "$0.80", reach: "38,900", impr: "96K", clicks: "2,410", res: "486", on: true },
  { id: "c5", name: "Hiring — Toronto", net: "li", obj: "Traffic", status: "paused", budget: "$500", spend: "$128.75", results: "1,840 clicks", cpr: "$0.07", reach: "22,100", impr: "54K", clicks: "1,840", res: "—", on: false },
  { id: "c6", name: "Retargeting — Cart", net: "ig", obj: "Sales", status: "ended", budget: "$600", spend: "$598.20", results: "248 purchases", cpr: "$2.41", reach: "31,400", impr: "88K", clicks: "2,950", res: "248", on: false },
];
const AD_SETS = [
  { id: "s1", name: "Lookalike 1% — Canada", status: "active", budget: "$400", spend: "$312.40", results: "142 purchases", cpr: "$2.20" },
  { id: "s2", name: "Interests — Fintech", status: "active", budget: "$500", spend: "$401.10", results: "118 purchases", cpr: "$3.40" },
  { id: "s3", name: "Retargeting — 30d visitors", status: "paused", budget: "$300", spend: "$128.68", results: "52 purchases", cpr: "$2.47" },
];
const ADS_IN_SET = [
  { id: "a1", name: "Carousel — Spring looks", status: "active", g: 0, impr: "82,140", ctr: "2.4%", res: "88" },
  { id: "a2", name: "Single image — 20% off", status: "active", g: 2, impr: "61,330", ctr: "1.9%", res: "41" },
  { id: "a3", name: "Video — App walkthrough", status: "paused", g: 1, impr: "24,900", ctr: "1.2%", res: "13" },
];
const STP = { active: ["active", "check_circle", "Active"], paused: ["paused", "pause_circle", "Paused"], ended: ["ended", "stop_circle", "Ended"] };
function Pill({ s }) { const [cls, ic, lb] = STP[s]; return <span className={"ad-pill " + cls}><span className="material-symbols-outlined">{ic}</span>{lb}</span>; }

// ── Drawer ─────────────────────────────────────────────────────────────
function AdsDrawer({ active }) {
  const items = [
    ["campaigns", "ad_group", "Campaigns"], ["adsets", "tune", "Ad sets"], ["ads", "image", "Ads"],
    ["audiences", "groups", "Audiences"], ["reporting", "bar_chart", "Reporting"],
  ];
  return (
    <aside className="suite-drawer" aria-label="Ads navigation">
      <div className="sd-head">Ads</div>
      <div className="sd-body">
        {items.map(([k, ic, lb]) => <a key={k} href="#" className={"sd-item" + (k === active ? " on" : "")}><span className="material-symbols-outlined">{ic}</span>{lb}</a>)}
        <a className="sd-item" href="boost.html"><span className="material-symbols-outlined">rocket_launch</span>Boost</a>
        <div className="sd-group">Settings</div>
        <a className="sd-item" href="#"><span className="material-symbols-outlined">account_balance_wallet</span>Billing</a>
        <a className="sd-item" href="#"><span className="material-symbols-outlined">link</span>Ad accounts</a>
      </div>
    </aside>
  );
}

function AdsTop({ crumbs, children }) {
  return (
    <header className="ads-top">
      {crumbs.length > 1 && <button className="ads-back" type="button" onClick={crumbs[0].onClick}><span className="material-symbols-outlined">arrow_back</span>Back</button>}
      {crumbs.length === 1
        ? <h1>{crumbs[0].label}</h1>
        : <div className="ads-crumb">{crumbs.map((c, i) => (
            <React.Fragment key={i}>{i > 0 && <span className="material-symbols-outlined">chevron_right</span>}{i === crumbs.length - 1 ? <b>{c.label}</b> : <a href="#" onClick={e => { e.preventDefault(); c.onClick && c.onClick(); }} style={{ color: "inherit" }}>{c.label}</a>}</React.Fragment>
          ))}</div>}
      <span className="ads-spacer"></span>
      {children}
      <button className="ads-ws" type="button"><span className="av">SOMOS</span>Somos Ads<span className="material-symbols-outlined">expand_more</span></button>
    </header>
  );
}

// ── 1 · ALL CAMPAIGNS (main) — board 1530:168411 ────────────────────────
function AdAccountCard() {
  return (
    <div className="ad-acctcard">
      <h3>Ad account details</h3>
      <span className="ad-pill active" style={{ marginBottom: 14 }}><span className="material-symbols-outlined">check_circle</span>Active</span>
      <ul className="ad-acctlist">
        <li>ID: 1386964148244875</li>
        <li>Timezone: America/Los_Angeles</li>
        <li>Currency: USD</li>
      </ul>
      <p className="ad-acctnote">This ad account has spent a total of <strong>$ 0.00</strong> and <strong>has no spending limit</strong>. All active ads will run until the campaign budget is spent or the campaign ends.</p>
    </div>
  );
}
function EventActivityCard() {
  return (
    <div className="ad-acctcard">
      <button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label="More options" title="More options" style={{ position: "absolute", top: 16, right: 16 }}><span className="material-symbols-outlined">more_horiz</span></button>
      <h3>Event activity</h3>
      <div className="ad-acctsub">AdEspresso's Pixel</div>
      <span className="ad-pill active" style={{ marginBottom: 18 }}><span className="material-symbols-outlined">check_circle</span>Active</span>
      <div className="ad-events">
        <div><div className="ad-num ev">8162</div><div className="k">Events received</div></div>
        <div><div className="ad-num ev">3369</div><div className="k">Events sent</div></div>
      </div>
    </div>
  );
}
function CampaignsList({ onOpen, onCreate }) {
  const [tab, setTab] = React.useState("campaigns");
  const tabs = [["campaigns", "Ad campaigns"], ["drafts", "Drafts"], ["pixel", "Pixel connector"]];
  return (
    <div className="ads-main">
      <nav className="ad-tabbar">
        {tabs.map(([k, lb]) => (
          <button key={k} type="button" className={"ad-tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{lb}</button>
        ))}
        <span className="ads-spacer"></span>
        <button className="hs-btn hs-btn--primary" type="button" onClick={onCreate}><span className="material-symbols-outlined">add</span>Create ad campaign</button>
      </nav>
      <div className="ads-body">
        <div className="ad-acctbar">
          <button className="hs-btn hs-btn--outlined" type="button"><span className="ad-acctdot"></span>Somos ad account 1<span className="material-symbols-outlined">expand_more</span></button>
          <button className="hs-btn hs-btn--outlined" type="button">All campaign status<span className="material-symbols-outlined">expand_more</span></button>
        </div>
        <div className="ad-cards">
          <AdAccountCard />
          <EventActivityCard />
        </div>
        <div className="pp-panel" style={{ padding: 0 }}>
          <table className="pp-table">
            <thead><tr><th>Campaign Name</th><th>Status</th><th className="ad-num">Reach</th><th className="ad-num">Impressions</th><th className="ad-num">Clicks</th><th className="ad-num">Results</th><th className="ad-num">Spend</th><th aria-label="Action">Action</th></tr></thead>
            <tbody>
              {CAMPAIGNS.map(c => (
                <tr key={c.id} style={{ cursor: "pointer" }} onClick={() => onOpen(c)}>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                      <PerchNet k={c.net} />
                      <span style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <span className="ad-name" style={{ fontWeight: 600 }}>{c.name}</span>
                          {c.err && <span className="ad-errbadge" title={c.err} aria-label={c.err}><span className="material-symbols-outlined">priority_high</span></span>}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--bento-theme-color-text-subtle)" }}>Objective · {c.obj}</span>
                      </span>
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span className={"ad-switch" + (c.on ? "" : " off")} role="switch" aria-checked={c.on} tabIndex={0} aria-label={"Toggle " + c.name} style={c.on ? { background: "var(--bento-system-sys-positive-600)" } : undefined}><span className="knob"></span></span>
                      {c.status === "active" ? "Active" : c.status === "paused" ? "Paused" : "Ended"}
                    </span>
                  </td>
                  <td className="ad-num">{c.reach}</td>
                  <td className="ad-num">{c.impr}</td>
                  <td className="ad-num">{c.clicks}</td>
                  <td className="ad-num">{c.res}</td>
                  <td className="ad-num">{c.spend}</td>
                  <td onClick={e => e.stopPropagation()}><button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label={"Manage " + c.name} title="Manage"><span className="material-symbols-outlined">more_horiz</span></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ad-pager">
            <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button"><span className="material-symbols-outlined">chevron_left</span>Prev</button>
            <span className="ads-spacer"></span>
            <span className="ad-pagecount">1 of 77</span>
            <button className="hs-btn hs-btn--ghost hs-btn--sm" type="button">Next<span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 2 · CAMPAIGN OVERVIEW (detail) ──────────────────────────────────────
function CampaignOverview({ campaign, onBack, onOpenSet }) {
  return (
    <div className="ads-main">
      <AdsTop crumbs={[{ label: "Campaigns", onClick: onBack }, { label: campaign.name }]}>
        <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">edit</span>Edit</button>
        <button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">add</span>New ad set</button>
      </AdsTop>
      <div className="ads-body">
        <div className="ad-kpis">
          <div className="ad-kpi"><div className="lbl">Spend</div><div className="val ad-num">{campaign.spend}</div><div className="lbl">of {campaign.budget} budget</div></div>
          <div className="ad-kpi"><div className="lbl">Results</div><div className="val">{campaign.results}</div><div className="lbl">{campaign.cpr} per result</div></div>
          <div className="ad-kpi"><div className="lbl">Reach</div><div className="val ad-num">{campaign.reach}</div></div>
          <div className="ad-kpi"><div className="lbl">Status</div><div className="val" style={{ fontSize: 20 }}><Pill s={campaign.status} /></div><div className="lbl" style={{ marginTop: 6 }}>{campaign.obj}</div></div>
        </div>
        <div className="pp-panel">
          <div className="pp-toolbar"><h2 className="pp-h2" style={{ fontSize: 18, margin: 0, fontWeight: 700 }}>Ad sets</h2><span className="spacer"></span><button className="hs-btn hs-btn--ghost hs-btn--sm" type="button"><span className="material-symbols-outlined">filter_list</span>Filter</button></div>
          <table className="pp-table">
            <thead><tr><th style={{ width: 48 }}></th><th>Ad set</th><th>Status</th><th className="ad-num">Budget</th><th className="ad-num">Spend</th><th>Results</th><th className="ad-num">Cost / result</th><th></th></tr></thead>
            <tbody>
              {AD_SETS.map(a => (
                <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => onOpenSet(a)}>
                  <td onClick={e => e.stopPropagation()}><span className={"ad-switch" + (a.status === "paused" ? " off" : "")}><span className="knob"></span></span></td>
                  <td><span className="ad-name">{a.name}</span></td>
                  <td><Pill s={a.status} /></td>
                  <td className="ad-num">{a.budget}</td>
                  <td className="ad-num">{a.spend}</td>
                  <td>{a.results}</td>
                  <td className="ad-num">{a.cpr}</td>
                  <td onClick={e => e.stopPropagation()}><button className="hs-btn hs-btn--ghost hs-btn--icon" type="button" aria-label="Manage ad set" title="Manage"><span className="material-symbols-outlined">more_horiz</span></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 3 · AD SET VIEW (ads with creatives) ────────────────────────────────
function AdSetView({ campaign, adset, onBack, onCampaign }) {
  return (
    <div className="ads-main">
      <AdsTop crumbs={[{ label: "Campaigns", onClick: onCampaign }, { label: campaign.name, onClick: onBack }, { label: adset.name }]}>
        <button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">edit</span>Edit ad set</button>
        <button className="hs-btn hs-btn--primary" type="button"><span className="material-symbols-outlined">add</span>New ad</button>
      </AdsTop>
      <div className="ads-body">
        <div className="ad-kpis">
          <div className="ad-kpi"><div className="lbl">Spend</div><div className="val ad-num">{adset.spend}</div><div className="lbl">of {adset.budget} budget</div></div>
          <div className="ad-kpi"><div className="lbl">Results</div><div className="val">{adset.results}</div></div>
          <div className="ad-kpi"><div className="lbl">Cost / result</div><div className="val ad-num">{adset.cpr}</div></div>
          <div className="ad-kpi"><div className="lbl">Status</div><div className="val" style={{ fontSize: 20 }}><Pill s={adset.status} /></div></div>
        </div>
        <h2 className="pp-h2" style={{ fontSize: 18, margin: "4px 2px 14px", fontWeight: 700 }}>Ads in this set</h2>
        <div className="adset-grid">
          {ADS_IN_SET.map(ad => (
            <div className="adset-card" key={ad.id}>
              <div className="media" style={imgFill(ADIMG[ad.g])}><Pill s={ad.status} /></div>
              <div className="ac-body">
                <span className="ac-name">{ad.name}</span>
                <div className="ac-stats">
                  <div className="ac-stat"><span className="v">{ad.impr}</span><span className="k">Impressions</span></div>
                  <div className="ac-stat"><span className="v">{ad.ctr}</span><span className="k">CTR</span></div>
                  <div className="ac-stat"><span className="v">{ad.res}</span><span className="k">Results</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 4 · CREATE-CAMPAIGN WIZARD ──────────────────────────────────────────
const OBJECTIVES = [
  ["awareness", "visibility", "Awareness", "Show your brand to the most people."],
  ["traffic", "ads_click", "Traffic", "Send people to your site or profile."],
  ["engagement", "thumb_up", "Engagement", "Get more likes, comments, and shares."],
  ["leads", "contact_mail", "Leads", "Collect sign-ups and enquiries."],
  ["app", "smartphone", "App promotion", "Drive installs and app actions."],
  ["sales", "shopping_cart", "Sales", "Find people likely to purchase."],
];
const WIZARD_STEPS = [
  ["Objective", "What do you want to achieve?"],
  ["Audience & budget", "Who to reach and how much to spend"],
  ["Creative", "Build the ad people will see"],
  ["Review", "Check everything, then launch"],
];
function CreateWizard({ onCancel, onLaunch }) {
  const [step, setStep] = React.useState(0);
  const [obj, setObj] = React.useState("sales");
  const [budgetType, setBudgetType] = React.useState("daily");
  const [interests, setInterests] = React.useState({ Fintech: true, Saving: true, "Mobile banking": false, Students: false, Investing: false });
  const objLabel = OBJECTIVES.find(o => o[0] === obj)[2];
  const toggleInt = k => setInterests(p => ({ ...p, [k]: !p[k] }));
  const next = () => setStep(s => Math.min(3, s + 1));
  const back = () => step === 0 ? onCancel() : setStep(s => s - 1);
  return (
    <div className="ads-main">
      <AdsTop crumbs={[{ label: "Campaigns", onClick: onCancel }, { label: "New campaign" }]} />
      <div className="aw">
        <aside className="aw-steps" aria-label="Steps">
          {WIZARD_STEPS.map(([t, d], i) => (
            <div key={i} className={"aw-step" + (i === step ? " on" : i < step ? " done" : "")}>
              <span className="num">{i < step ? <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span> : i + 1}</span>
              <div><div className="t">{t}</div><div className="d">{d}</div></div>
            </div>
          ))}
        </aside>
        <div className="aw-canvas">
          <div className="aw-inner">
            {step === 0 && (<React.Fragment>
              <h2>Choose your objective</h2>
              <p className="aw-sub">We'll optimise delivery and bidding for the goal you pick.</p>
              <div className="obj-grid">
                {OBJECTIVES.map(([k, ic, t, d]) => (
                  <button key={k} type="button" className={"obj-card" + (obj === k ? " on" : "")} aria-pressed={obj === k} onClick={() => setObj(k)}>
                    <span className="oc-ic"><span className="material-symbols-outlined">{ic}</span></span>
                    <span className="oc-t">{t}</span><span className="oc-d">{d}</span>
                  </button>
                ))}
              </div>
            </React.Fragment>)}

            {step === 1 && (<React.Fragment>
              <h2>Audience &amp; budget</h2>
              <p className="aw-sub">Define who sees this campaign and what you'll spend.</p>
              <div className="aw-row">
                <div className="aw-field"><label>Location</label><input className="hs-input" defaultValue="Canada, United States" /></div>
                <div className="aw-field"><label>Age range</label>
                  <div className="an-select" style={{ position: "relative" }}><select className="hs-input" style={{ appearance: "none" }}><option>18 – 65+</option><option>18 – 34</option><option>25 – 44</option></select><span className="material-symbols-outlined" style={{ position: "absolute", right: 12, top: 11, pointerEvents: "none", color: "var(--bento-theme-color-text-subtle)" }}>expand_more</span></div>
                </div>
              </div>
              <div className="aw-field"><label>Interests</label><p className="hint">Narrow your audience by what they care about.</p>
                <div className="aw-chips">{Object.keys(interests).map(k => <button key={k} type="button" className={"cf" + (interests[k] ? " selected" : "")} aria-pressed={interests[k]} onClick={() => toggleInt(k)}>{k}{interests[k] ? <span className="x"><span className="material-symbols-outlined">close</span></span> : <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>}</button>)}</div>
              </div>
              <div className="aw-field"><label>Budget</label>
                <div className="aw-seg" style={{ marginBottom: 10 }}><button type="button" className={"cf" + (budgetType === "daily" ? " selected" : "")} onClick={() => setBudgetType("daily")}>Daily</button><button type="button" className={"cf" + (budgetType === "lifetime" ? " selected" : "")} onClick={() => setBudgetType("lifetime")}>Lifetime</button></div>
                <div className="aw-budget"><span className="cur">$</span><input className="hs-input" defaultValue="40" /><span style={{ color: "var(--bento-theme-color-text-subtle)" }}>{budgetType === "daily" ? "per day" : "total"}</span></div>
              </div>
            </React.Fragment>)}

            {step === 2 && (<React.Fragment>
              <h2>Build your creative</h2>
              <p className="aw-sub">This is the ad people will see in their feed.</p>
              <div className="aw-creative">
                <div>
                  <div className="aw-field"><label>Format</label><div className="aw-seg"><button type="button" className="cf selected">Single image</button><button type="button" className="cf">Carousel</button><button type="button" className="cf">Video</button></div></div>
                  <div className="aw-field"><label>Media</label><div className="aw-drop"><span className="material-symbols-outlined">add_photo_alternate</span><span>Drag an image here or browse</span><span style={{ fontSize: 12 }}>1080×1080 · JPG or PNG</span></div></div>
                  <div className="aw-field"><label>Primary text</label><textarea className="hs-input" style={{ height: 80, padding: 12, resize: "none" }} defaultValue="Round-ups, auto-save, and zero fees. Banking built for the way you actually spend."></textarea></div>
                  <div className="aw-row">
                    <div className="aw-field"><label>Headline</label><input className="hs-input" defaultValue="Open an account in minutes" /></div>
                    <div className="aw-field"><label>Call to action</label><div className="an-select" style={{ position: "relative" }}><select className="hs-input" style={{ appearance: "none" }}><option>Sign up</option><option>Learn more</option><option>Get offer</option><option>Download</option></select><span className="material-symbols-outlined" style={{ position: "absolute", right: 12, top: 11, pointerEvents: "none", color: "var(--bento-theme-color-text-subtle)" }}>expand_more</span></div></div>
                  </div>
                </div>
                <div className="aw-prev">
                  <div className="aw-prevcard">
                    <div className="ph"><span className="av">SOMOS</span><span><span className="nm" style={{ display: "block" }}>Somos Bank</span><span className="su">Sponsored</span></span></div>
                    <div className="ptext">Round-ups, auto-save, and zero fees.</div>
                    <div className="pimg" style={imgFill(ADIMG[1])}></div>
                    <div className="pfoot"><div><div style={{ fontSize: 12, color: "var(--bento-theme-color-text-subtle)" }}>somos.com</div><div className="h">Open an account in minutes</div></div><span className="pcta">Sign up</span></div>
                  </div>
                </div>
              </div>
            </React.Fragment>)}

            {step === 3 && (<React.Fragment>
              <h2>Review &amp; launch</h2>
              <p className="aw-sub">You can edit anything before this campaign goes live.</p>
              <div className="aw-review">
                <div className="aw-rev-row"><span className="rk">Objective</span><span className="rv">{objLabel}</span><button className="ed" type="button" onClick={() => setStep(0)}>Edit</button></div>
                <div className="aw-rev-row"><span className="rk">Audience</span><span className="rv">Canada, United States · 18–65+ · <span className="chip-line" style={{ display: "inline-flex" }}>{Object.keys(interests).filter(k => interests[k]).map(k => <span key={k} className="hs-badge hs-badge--neutral" style={{ height: 24 }}>{k}</span>)}</span></span><button className="ed" type="button" onClick={() => setStep(1)}>Edit</button></div>
                <div className="aw-rev-row"><span className="rk">Budget</span><span className="rv">$40 {budgetType === "daily" ? "per day" : "total"} · estimated 4.8K–13K reach / day</span><button className="ed" type="button" onClick={() => setStep(1)}>Edit</button></div>
                <div className="aw-rev-row"><span className="rk">Creative</span><span className="rv">Single image · "Open an account in minutes" · CTA Sign up</span><button className="ed" type="button" onClick={() => setStep(2)}>Edit</button></div>
              </div>
            </React.Fragment>)}
          </div>
        </div>
      </div>
      <div className="aw-foot">
        <span className="meta">Step {step + 1} of 4 · {WIZARD_STEPS[step][0]}</span>
        <button className="hs-btn hs-btn--ghost" type="button" onClick={back}>{step === 0 ? "Cancel" : "Back"}</button>
        {step < 3
          ? <button className="hs-btn hs-btn--primary" type="button" onClick={next}>Continue</button>
          : <button className="hs-btn hs-btn--primary" type="button" onClick={onLaunch}><span className="material-symbols-outlined">rocket_launch</span>Launch campaign</button>}
      </div>
    </div>
  );
}

// ── States ──────────────────────────────────────────────────────────────
function AdsEmpty({ onCreate }) {
  return (
    <div className="ads-main"><AdsTop crumbs={[{ label: "Campaigns" }]} /><div className="suite-state empty"><div className="suite-state-inner">
      <div className="ico"><span className="material-symbols-outlined">ad_group</span></div>
      <h2>No campaigns yet</h2>
      <p>Create your first ad campaign to reach new audiences, drive installs, or boost sales — all from inside Hootsuite.</p>
      <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">school</span>How ads work</button><button className="hs-btn hs-btn--primary" type="button" onClick={onCreate}><span className="material-symbols-outlined">add</span>Create campaign</button></div>
    </div></div></div>
  );
}
function AdsErrorState({ onRetry }) {
  return (
    <div className="ads-main"><AdsTop crumbs={[{ label: "Campaigns" }]} /><div className="suite-state error"><div className="suite-state-inner">
      <div className="ico"><span className="material-symbols-outlined">cloud_off</span></div>
      <h2>We couldn't load your campaigns</h2>
      <p>Your ad accounts are connected — we just couldn't pull their data. This is usually a brief connection issue.</p>
      <div className="acts"><button className="hs-btn hs-btn--secondary" type="button"><span className="material-symbols-outlined">link</span>Check ad accounts</button><button className="hs-btn hs-btn--primary" type="button" onClick={onRetry}><span className="material-symbols-outlined">refresh</span>Try again</button></div>
    </div></div></div>
  );
}
function AdsLoading() {
  return (
    <div className="ads-main" aria-busy="true"><AdsTop crumbs={[{ label: "Campaigns" }]} /><div className="ads-body">
      <div className="ad-kpis">{[0,1,2,3].map(i => <div className="ad-kpi" key={i}><div className="suite-sk" style={{ width: "50%", height: 12 }}></div><div className="suite-sk" style={{ width: "70%", height: 30, margin: "10px 0" }}></div><div className="suite-sk" style={{ width: "40%", height: 12 }}></div></div>)}</div>
      <div className="pp-panel"><div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>{[0,1,2,3,4].map(i => <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}><div className="suite-sk" style={{ width: 36, height: 20, borderRadius: 999 }}></div><div className="suite-sk" style={{ flex: 1, height: 14 }}></div><div className="suite-sk" style={{ width: 80, height: 14 }}></div></div>)}</div></div>
    </div></div>
  );
}

// ── App ─────────────────────────────────────────────────────────────────
function App() {
  const [surface, setSurface] = React.useState("campaigns");
  const [campaign, setCampaign] = React.useState(CAMPAIGNS[0]);
  const [adset, setAdset] = React.useState(AD_SETS[0]);
  const onState = k => setSurface(k);
  const drawerActive = surface === "create" ? "campaigns" : ["campaigns","empty","error","loading"].includes(surface) ? "campaigns" : surface === "adset" ? "adsets" : surface === "overview" ? "campaigns" : "campaigns";
  return (
    <div className="suite-app">
      <SuiteRail active="perch" />
      <PerchDrawer active="ads" />
      {surface === "campaigns" && <CampaignsList onOpen={c => { setCampaign(c); setSurface("overview"); }} onCreate={() => setSurface("create")} />}
      {surface === "overview" && <CampaignOverview campaign={campaign} onBack={() => setSurface("campaigns")} onOpenSet={a => { setAdset(a); setSurface("adset"); }} />}
      {surface === "adset" && <AdSetView campaign={campaign} adset={adset} onBack={() => setSurface("overview")} onCampaign={() => setSurface("campaigns")} />}
      {surface === "create" && <CreateWizard onCancel={() => setSurface("campaigns")} onLaunch={() => setSurface("campaigns")} />}
      {surface === "empty" && <AdsEmpty onCreate={() => setSurface("create")} />}
      {surface === "error" && <AdsErrorState onRetry={() => setSurface("loading")} />}
      {surface === "loading" && <AdsLoading />}
      <SuiteStates
        states={[["campaigns", "Campaigns"], ["overview", "Campaign"], ["adset", "Ad set"], ["create", "Create"], ["empty", "Empty"], ["error", "Error"], ["loading", "Loading"]]}
        value={surface} onChange={onState}
      />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
