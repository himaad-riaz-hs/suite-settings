// onboarding-paywall.jsx — Everything Welcome · Paywall (in-product upgrade).
// Source: Onboarding-paywalls/Paywall-Screens/PaywallPerch (11998:20406),
// Upgrade-downgrade/PaywallToUpgrade (13789:68095), PaywallMarketing/PaywallNest.
// A dimmed product app behind a centered upgrade modal. PAYMENTS ARE UI ONLY.
// Exports the shared product-app chrome (PwApp/PRODUCTS) used by the payment flow too.

const PW_OWL = "assets/hootsuite-owly-small.png";

// Product palette — tones match onboarding.css .tone-* + suite rail.
const PRODUCTS = {
  home:       { nm: "Home",       icon: "home",          fill: "var(--bento-system-sys-neutral-alt-200)", fg: "var(--bento-theme-color-text-base)" },
  perch:      { nm: "Perch",      icon: "calendar_month", fill: "#E5EDFF", fg: "#0F48D7" },
  search:     { nm: "Search",     icon: "search",         fill: "var(--bento-system-sys-neutral-alt-200)", fg: "var(--bento-theme-color-text-base)" },
  nest:       { nm: "Nest",       icon: "inbox",          fill: "#FDE8CF", fg: "#B4690E" },
  lumen:      { nm: "Lumen",      icon: "graphic_eq",     fill: "#D6F0F5", fg: "#0B7C92" },
  parliament: { nm: "Parliament", icon: "campaign",       fill: "#E3F3E8", fg: "#1F8A4C" },
  wisdom:     { nm: "Wisdom",     icon: "auto_awesome",   fill: "#F0E9FF", fg: "#6B3FA0" },
  vigil:      { nm: "Vigil",      icon: "verified_user",  fill: "#D6F6FB", fg: "#0B95AA" },
};
// Vigil hidden across templates while in progress — re-add "vigil" to restore.
const RAIL_ORDER = ["home", "perch", "search", "nest", "lumen", "parliament", "wisdom"];

// Shared product-app chrome: 80px rail + 64px top bar + slotted body.
function PwApp({ active = "perch", title, children, topRight }) {
  return (
    <div className="pwapp">
      <nav className="pwapp-rail" aria-label="Products">
        <img className="owl" src={PW_OWL} alt="Hootsuite" />
        {RAIL_ORDER.map(k => {
          const p = PRODUCTS[k];
          const on = k === active;
          return (
            <button key={k} type="button" className={"pwapp-navbtn" + (on ? " on" : "")}
              style={on ? { "--tone-fill": p.fill, "--tone-fg": p.fg } : null}
              aria-current={on ? "page" : undefined} title={p.nm}>
              <span className="material-symbols-outlined">{p.icon}</span>
              <span className="lbl">{p.nm}</span>
            </button>
          );
        })}
        <span className="spring"></span>
        <button type="button" className="pwapp-navbtn util" title="Analytics" aria-label="Analytics"><span className="material-symbols-outlined">bar_chart</span></button>
        <button type="button" className="pwapp-navbtn util" title="Notifications" aria-label="Notifications"><span className="material-symbols-outlined">notifications</span></button>
        <button type="button" className="pwapp-navbtn util" title="Help" aria-label="Help"><span className="material-symbols-outlined">help_outline</span></button>
      </nav>
      <div className="pwapp-main">
        <header className="pwapp-top">
          <h1>{title}</h1>
          <span className="spring"></span>
          {topRight || (
            <React.Fragment>
              <button className="pwapp-ico" type="button" aria-label="Settings" title="Settings"><span className="material-symbols-outlined">settings</span></button>
              <button className="pwapp-ws" type="button"><span className="av">R</span>Ryan · Somos<span className="material-symbols-outlined" style={{ fontSize: 20 }}>keyboard_arrow_down</span></button>
            </React.Fragment>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}

// Blurred planner backdrop content (only ever seen dimmed behind the paywall).
function PwPlannerBody() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const evt = ["#E5EDFF", "#E3F3E8", "#FDE8CF", "#F0E9FF", "#D6F0F5"];
  return (
    <div className="pwapp-body" aria-hidden="true">
      <div className="pwapp-toolbar">
        <span className="chip"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_month</span>June 2026</span>
        <span className="chip">All channels</span>
        <span className="spring" style={{ flex: 1 }}></span>
        <span className="chip">Week</span>
      </div>
      <div className="pwapp-cal">
        {Array.from({ length: 21 }).map((_, i) => (
          <div className="pwapp-cell" key={i}>
            <span className="dn">{days[i % 7]} {i + 1}</span>
            {i % 3 === 0 && <span className="pwapp-evt" style={{ background: evt[i % evt.length] }}></span>}
            {i % 4 === 1 && <span className="pwapp-evt" style={{ background: evt[(i + 2) % evt.length], width: "70%" }}></span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Per-product paywall copy — Lumen-Advanced upgrade-card pattern:
// headline · free-plan "upgrade to unlock" lede · three-tier feature grid.
const PAYWALL_COPY = {
  perch: {
    head: "Do it all with Perch Advanced",
    lede: "You're on the free plan — limited scheduling only. Upgrade to unlock the full calendar, AI creation, approvals, and ad boosting across your channels.",
    feats: [
      ["calendar_month", "Shared calendar & approvals", "Plan as a team with a shared calendar, whiteboards, and approval workflows."],
      ["auto_awesome", "Social-first AI", "Create with Hootsuite's AI, built-in templates, and free stock images."],
      ["trending_up", "Schedule & boost", "Publish at the best time, then boost top performers as ads."],
    ],
  },
  nest: {
    head: "Stay on top of every message with Nest Advanced",
    lede: "You're on the free plan — basic inbox only. Upgrade to unlock unified channels, automation, and smart routing so nothing slips through.",
    feats: [
      ["inbox", "Unified inbox", "Respond to comments and DMs across every channel from one inbox."],
      ["bolt", "Automation", "Saved replies, auto-responders, and automated DMs to handle volume."],
      ["alt_route", "Smart routing", "Auto-route messages to the right teammate with AI classifiers."],
    ],
  },
  lumen: {
    head: "See the full picture with Lumen Advanced",
    lede: "You're on the free plan — Quick Search only. Upgrade to unlock topic and channel analytics, AI insights, dashboards, and alerts across all your conversations.",
    feats: [
      ["sell", "Topic & channel analytics", "Track unlimited topics with sentiment, reach, and share of voice."],
      ["auto_awesome", "LLM Insights", "AI summaries of what's driving conversation, in plain language."],
      ["bar_chart", "Reports & alerts", "Scheduled exports and real-time alerts when mentions spike."],
    ],
  },
  parliament: {
    head: "Turn your team into advocates with Parliament Advanced",
    lede: "You're on the free plan — view-only access. Upgrade to unlock curated content, leaderboards, and pipeline attribution for every share.",
    feats: [
      ["edit_note", "Curated content", "Create posts and accept suggestions; control the networks members share to."],
      ["emoji_events", "Leaderboard & points", "Award points for shares and engagement, with a leaderboard."],
      ["paid", "Pipeline attribution", "Tie revenue and leads to every shared post by advocate."],
    ],
  },
  wisdom: {
    head: "Put AI to work with Wisdom Advanced",
    lede: "You're on the free plan — basic answers only. Upgrade to unlock context-aware AI that goes from insight to action across the Social OS.",
    feats: [
      ["chat", "Plain-language answers", "Ask questions in plain language and get actionable suggestions."],
      ["hub", "Context everywhere", "Context-aware access everywhere you work across the Social OS."],
      ["bolt", "Insight to action", "Wisdom can take concrete steps on your behalf."],
    ],
    noWisdomNote: true,
  },
  vigil: {
    head: "Publish with confidence with Vigil Advanced",
    lede: "You're on the free plan — manual review only. Upgrade to unlock publish-time blocking and audit-ready compliance for regulated teams.",
    feats: [
      ["block", "Block at publish", "Block risky content in Composer, with clear member-facing reasons."],
      ["description", "Audit-ready exports", "7-year retention — PDF + JSON for FINRA / SEC."],
      ["verified_user", "Stay compliant", "Brand protection for regulated industries, built in."],
    ],
  },
};

function PaywallModal({ product, onProduct, onUpgrade, onClose }) {
  const p = PRODUCTS[product];
  const c = PAYWALL_COPY[product];
  return (
    <div className="pw-card" role="dialog" aria-modal="true" aria-label={c.head}
      style={{ "--tone-fill": p.fill, "--tone-fg": p.fg }}>
      <button className="pw-close" type="button" aria-label="Close" title="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
      <span className="pw-badge2"><span className="material-symbols-outlined">workspace_premium</span>{p.nm} Advanced</span>
      <h1>{c.head}</h1>
      <p className="pw-lede">{c.lede}</p>
      <div className="pw-feats">
        {c.feats.map((f, i) => (
          <div className="pw-feat" key={i}>
            <span className="material-symbols-outlined">{f[0]}</span>
            <div className="ft">{f[1]}</div>
            <div className="fd">{f[2]}</div>
          </div>
        ))}
      </div>
      <div className="pw-cta">
        <button className="hs-btn hs-btn--primary" type="button" onClick={onUpgrade}><span className="material-symbols-outlined">arrow_upward</span>Upgrade to Advanced</button>
        <button className="hs-btn hs-btn--ghost" type="button" onClick={onUpgrade}>Compare plans</button>
      </div>
      {!c.noWisdomNote && (
        <span className="pw-poweredby"><span className="material-symbols-outlined">auto_awesome</span>Powered by <b>Wisdom</b>, your AI teammate</span>
      )}
      <div className="pw-switch">
        <span className="pw-foot-note">Preview product:</span>
        {["perch", "nest", "lumen", "parliament", "wisdom"].map(k => (
          <button key={k} type="button" className={"hs-btn hs-btn--sm " + (k === product ? "hs-btn--secondary" : "hs-btn--ghost")} onClick={() => onProduct(k)} aria-pressed={k === product}>{PRODUCTS[k].nm}</button>
        ))}
      </div>
    </div>
  );
}

function PaywallFlow({ onUpgrade, onClose }) {
  const [product, setProduct] = React.useState("perch");
  return (
    <div className="pw-root">
      <PwApp active={product} title={PRODUCTS[product].nm}><PwPlannerBody /></PwApp>
      <div className="pw-scrim"></div>
      <div className="pw-center">
        <PaywallModal product={product} onProduct={setProduct} onUpgrade={onUpgrade || (() => {})} onClose={onClose || (() => {})} />
      </div>
    </div>
  );
}

Object.assign(window, { PRODUCTS, RAIL_ORDER, PwApp, PaywallFlow, PW_OWL });
