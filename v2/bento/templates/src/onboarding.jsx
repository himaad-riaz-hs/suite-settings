// onboarding.jsx — Everything Welcome: onboarding tour + paywall + payment.
// Source: Everything Welcome (Copy).fig. Flows: Existing user (admin / user),
// New user, Paywall, Payment. PAYMENTS ARE UI ONLY — nothing is processed.
// Rail user = Ryan. No-red. Display font for splash / new-product saffron moments.

const OWL = "assets/hootsuite-owly-small.png";

function Backdrop() {
  return (
    <React.Fragment>
      <div className="ob-backdrop" aria-hidden="true">
        <div className="ob-bd-rail">
          <img src={OWL} alt="" />
          {[0,1,2,3,4,5].map(i => <span className="d" key={i}></span>)}
        </div>
        <div className="ob-bd-main">
          <div className="ob-bd-top"></div>
          <div className="ob-bd-grid">{[0,1,2,3,4,5].map(i => <div className="ob-bd-card" key={i}></div>)}</div>
        </div>
      </div>
      <div className="ob-scrim" aria-hidden="true"></div>
    </React.Fragment>
  );
}

// bold the lead phrase up to the first ":" or "." (e.g. "Same planning tools:")
function LeadText({ text }) {
  const m = text.match(/^([^:.]+[:.])\s*([\s\S]*)$/);
  if (!m) return <React.Fragment>{text}</React.Fragment>;
  return <React.Fragment><strong>{m[1]}</strong> {m[2]}</React.Fragment>;
}

function Progress({ total, index }) {
  return <div className="ob-progress" aria-hidden="true">{Array.from({ length: total }).map((_, i) => <span key={i} className={"ob-seg" + (i <= index ? " on" : "")}></span>)}</div>;
}

function TourModal({ step, total, index, onBack, onNext, onSkip, onClose }) {
  return (
    <div className="ob-modal" role="dialog" aria-modal="true" aria-label={step.title}>
      <div className="ob-modal-head">
        <span className={"ob-badge tone-" + step.tone}>
          <span className="material-symbols-outlined">{step.icon}</span>{step.badge}
          {step.isNew && <span className="new">NEW</span>}
        </span>
        <button className="ob-close" type="button" aria-label="Close tour" title="Close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
      </div>
      <div className="ob-cols">
        <div className="ob-text">
          <h1 className={"ob-title" + (step.display ? " display" : "")}>{step.title}</h1>
          {step.intro && <p className="ob-intro">{step.intro}</p>}
          {step.bullets && (
            <div className="ob-bullets">
              {step.bullets.map((b, i) => (
                <div className="ob-bullet" key={i}><span className="material-symbols-outlined">check_circle</span><span><LeadText text={b} /></span></div>
              ))}
            </div>
          )}
        </div>
        <div className="ob-media"><span className="lbl">{step.media} screen</span></div>
      </div>
      <div className="ob-foot">
        <Progress total={total} index={index} />
        <div className="ob-foot-btns">
          <button className="hs-btn hs-btn--ghost" type="button" onClick={onSkip}>Skip tour</button>
          {index > 0 && <button className="hs-btn hs-btn--outlined" type="button" onClick={onBack}>Back</button>}
          <button className="hs-btn hs-btn--primary" type="button" onClick={onNext}>{index === total - 1 ? "Finish" : "Next"}</button>
        </div>
      </div>
    </div>
  );
}

function Splash({ onStart, onSkip }) {
  return (
    <div className="ob-splash" role="dialog" aria-modal="true" aria-label="Introducing the Hootsuite Social OS">
      <div className="ob-splash-body">
        <span className="eyebrow">What's new</span>
        <h1>Introducing the Hootsuite Social OS</h1>
        <p>New agentic connectors, social-first embedded AI, and a suite of redefined products. Hootsuite is your AI-native social operating system, designed to help you activate social intelligence across everything you do.</p>
        <div className="acts">
          <button className="hs-btn hs-btn--primary" type="button" onClick={onStart}>Take the tour</button>
          <button className="hs-btn hs-btn--ghost" type="button" onClick={onSkip}>Skip for now</button>
        </div>
      </div>
      <div className="ob-splash-art"><img src={OWL} alt="" aria-hidden="true" /></div>
    </div>
  );
}

function Finish({ admin, onExplore, onClose }) {
  return (
    <div className="ob-finish" role="dialog" aria-modal="true" aria-label="Explore the Hootsuite Social OS">
      <div className="ob-finish-art"><img src={OWL} alt="" aria-hidden="true" /></div>
      <div className="ob-finish-body">
        <h1>Explore the Hootsuite Social OS</h1>
        <p>{admin
          ? "Social OS is available for you now. Your organization stays on Classic until you enable it for them."
          : "Social OS is available for you now — jump in and explore everything that's moved, what's new, and what's the same."}</p>
        <div className="ob-finish-note">
          <span className="material-symbols-outlined">lightbulb</span>
          <span>Your data, settings, and saved work are all unchanged — some may have just moved to new homes. To take this tour again, go to Account → Take the Social OS tour.</span>
        </div>
        <div className="ob-finish-acts">
          {admin && <button className="hs-btn hs-btn--outlined" type="button" onClick={onExplore}>Enable for my organization</button>}
          <button className="hs-btn hs-btn--primary" type="button" onClick={onExplore}>Explore Social OS</button>
        </div>
      </div>
    </div>
  );
}

// ── Existing-user tour steps (board 11747:25267) ──────────────────────
const TOUR = {
  perch: { badge: "Perch", icon: "calendar_month", tone: "perch", media: "Perch",
    title: "Plan + Create + Ads are now Perch",
    intro: "Plan, Create, and Ads all live on the same branch now. One new home for your calendar, planning tools, content creation and boosting, and approval flows.",
    bullets: [
      "Same planning tools: Plan as a team, with a shared calendar, whiteboards, and effortless approval workflows.",
      "Same content tools: Create content with help from Hootsuite's social-first AI, built-in templates, and free stock images.",
      "Same publishing tools: Schedule your organic content to go live at the best time, then boost the top performers as ads.",
    ] },
  lumen: { badge: "Lumen", icon: "graphic_eq", tone: "lumen", media: "Lumen",
    title: "Listening is now Lumen",
    intro: "Your listening, measurement, and brand-protection tools now live together under Lumen.",
    bullets: [
      "Same listening tools: Monitor the entire web with the broadest data coverage — social and beyond, including blogs, forums, and review sites.",
      "Same measurement tools: Benchmark your brand sentiment, engagement and conversion — by campaign, region or topic.",
      "Same protection tools: Monitor everything people are saying about your brand — good and bad — so you can spot risks and opportunities early.",
    ] },
  parliament: { badge: "Parliament", icon: "campaign", tone: "parliament", media: "Parliament",
    title: "Amplify is now Parliament",
    intro: "Employee advocacy keeps everything you know, under a new name.",
    bullets: [
      "Same management tools: Create new posts and accept content suggestions. Control the social networks your members can share to.",
      "Same tracking tools: Award points for shares and the engagement they generate. A leaderboard taps into a healthy sense of competition.",
      "Same attribution tools: Tie revenue or leads to every shared post and calculate pipeline and impact by advocate.",
    ] },
  wisdom: { badge: "Wisdom", icon: "auto_awesome", tone: "wisdom", media: "Wisdom",
    title: "OwlyGPT is now Wisdom",
    intro: "Your social AI assistant has a new name and a bigger role across the Social OS.",
    bullets: [
      "Same ease of use: Ask your questions in plain language, and Wisdom dives in and delivers clarity and actionable suggestions.",
      "Same embedded access: With access across our new Social OS, Wisdom is your dedicated, context-aware social AI assistant.",
      "Same abilities: Go from answers to actions. Wisdom can take concrete steps to leverage its answers and insights.",
    ] },
  nest: { badge: "Nest", icon: "inbox", tone: "nest", media: "Nest",
    title: "Inbox is now Nest",
    intro: "Your unified inbox and automation tools have a cosier new home.",
    bullets: [
      "Same unified inbox: Respond to comments and DMs across every channel — all from a single inbox.",
      "Same automation tools: Use saved replies, auto-responders, and automated DMs to keep your inbox clean.",
      "Same routing tools: Use AI classifiers to auto-route messages to the right team member and prioritize specific conversations to boost SLAs.",
    ] },
  vigil: { badge: "Vigil", icon: "verified_user", tone: "vigil", media: "Vigil", isNew: true, display: true,
    title: "And introducing Compliance",
    intro: "Introducing Vigil — compliance for brand protection and regulated industries.",
    bullets: [
      "Block at publish. In Composer, with clear member-facing reasons.",
      "Audit-ready exports. 7-year retention, PDF + JSON for FINRA / SEC.",
    ] },
  analytics: { badge: "Analytics", icon: "insert_chart", tone: "analytics", media: "Analytics",
    title: "Analytics is now local",
    intro: "Each product now has its own dedicated analytics section. Your social performance score and other cross-product metrics now live under Perch." },
  mcp: { badge: "Employee plan", icon: "cable", tone: "mcp", media: "Connectors",
    title: "Connect your AI tools to Hootsuite",
    bullets: [
      "Built to be open: Every Hootsuite product exposes its data and actions so any MCP-compatible AI agent can read, act, and respond in context.",
      "Works with any model: Connect the AI tools your team already use, and let them work directly with your social data.",
    ] },
  teammate: { badge: "Wisdom", icon: "auto_awesome", tone: "wisdom", media: "Wisdom",
    title: "Wisdom is your AI teammate",
    intro: "Wisdom is your AI teammate that works across the Social OS. Plain-language questions produce clear answers, helping you uncover insights, create content, and take action with every chat." },
};

const MEET = { badge: "Product suite", icon: "grid_view", tone: "analytics", media: "Hootsuite Social OS",
  title: "Meet Hootsuite Social OS — your social operating system",
  intro: "We've reorganized everything into six clear products. Take a quick tour of what's moved, what's new, and what's the same." };

const ADMIN_ORDER = ["meet", "perch", "lumen", "parliament", "wisdom", "nest", "vigil", "analytics", "mcp", "teammate"];
const USER_ORDER  = ["meet", "perch", "lumen", "parliament", "wisdom", "nest", "vigil", "analytics", "teammate"];

function ExistingUserFlow({ admin, onClose }) {
  // phases: splash → tour steps → finish
  const order = admin ? ADMIN_ORDER : USER_ORDER;
  const steps = order.map(k => k === "meet" ? MEET : TOUR[k]);
  const [phase, setPhase] = React.useState("splash"); // splash | tour | finish
  const [i, setI] = React.useState(0);
  if (phase === "splash") return <Splash onStart={() => { setPhase("tour"); setI(0); }} onSkip={() => setPhase("finish")} />;
  if (phase === "finish") return <Finish admin={admin} onExplore={onClose} onClose={onClose} />;
  const step = steps[i];
  if (!step) return <Finish admin={admin} onExplore={onClose} onClose={onClose} />;
  return (
    <TourModal
      step={step} total={steps.length} index={i}
      onBack={() => setI(n => Math.max(0, n - 1))}
      onNext={() => setI(n => { if (n >= steps.length - 1) { setPhase("finish"); return n; } return n + 1; })}
      onSkip={() => setPhase("finish")}
      onClose={onClose}
    />
  );
}

function Sheet({ title, sub, total, index, onBack, onNext, nextLabel, onSkip, children, wide }) {
  return (
    <div className={"ob-sheet" + (wide ? " wide" : "")} role="dialog" aria-modal="true" aria-label={title}>
      <div className="ob-sheet-body">
        <h1 className="ob-sheet-title">{title}</h1>
        {sub && <p className="ob-sheet-sub">{sub}</p>}
        {children}
      </div>
      <div className="ob-sheet-foot">
        <Progress total={total} index={index} />
        <div className="ob-foot-btns">
          {onSkip && <button className="hs-btn hs-btn--ghost" type="button" onClick={onSkip}>Skip</button>}
          {index > 0 && <button className="hs-btn hs-btn--outlined" type="button" onClick={onBack}>Back</button>}
          <button className="hs-btn hs-btn--primary" type="button" onClick={onNext}>{nextLabel || "Next"}</button>
        </div>
      </div>
    </div>
  );
}

// ── New-user onboarding (board /Onboarding-paywalls/New-User-Onboarding) ──
const NU_INDUSTRIES = ["Agency", "Retail & e-commerce", "Financial services", "Technology", "Healthcare", "Media & entertainment", "Nonprofit", "Education", "Other"];
const NU_ROLES = ["Social media manager", "Marketing lead", "Content creator", "Customer care", "Executive", "Agency owner", "Other"];
const NU_SIZES = ["1–10", "11–50", "51–200", "201–1,000", "1,000+"];
const NU_PRODUCTS = [
  { k: "perch", icon: "calendar_month", tone: "perch", nm: "Perch", d: "Create, plan, and publish — all from the same perch." },
  { k: "lumen", icon: "graphic_eq", tone: "lumen", nm: "Lumen", d: "Listen, measure, and protect your brand." },
  { k: "parliament", icon: "campaign", tone: "parliament", nm: "Parliament", d: "Turn your team into advocates." },
  { k: "wisdom", icon: "auto_awesome", tone: "wisdom", nm: "Wisdom", d: "Your AI teammate, everywhere you work." },
  { k: "nest", icon: "inbox", tone: "nest", nm: "Nest", d: "A home for every message." },
  { k: "vigil", icon: "verified_user", tone: "vigil", nm: "Vigil", d: "Compliance and brand protection, built in." },
];
const NU_NETS = [
  { k: "li", nm: "LinkedIn", c: "#0A66C2", g: "in" },
  { k: "ig", nm: "Instagram", c: "#DD2A7B", g: "IG" },
  { k: "fb", nm: "Facebook", c: "#1877F2", g: "f" },
  { k: "x", nm: "X", c: "#000000", g: "X" },
  { k: "tt", nm: "TikTok", c: "#000000", g: "TT" },
  { k: "yt", nm: "YouTube", c: "#FF0000", g: "▶" },
];
const NU_AITOOLS = [
  { nm: "Claude", d: "Anthropic's assistant — read and act across your social data.", ic: "smart_toy" },
  { nm: "ChatGPT", d: "Bring OpenAI models into your Hootsuite workflows.", ic: "forum" },
  { nm: "Slack", d: "Send summaries and alerts, or ask Wisdom from Slack.", ic: "tag" },
  { nm: "Notion", d: "Reference wikis, playbooks, and campaign pages.", ic: "description" },
];

function NewUserFlow({ onClose }) {
  const STEPS = ["welcome", "business", "start", "connect", "ai", "finish"];
  const [i, setI] = React.useState(0);
  const [pick, setPick] = React.useState("perch");
  const [nets, setNets] = React.useState({});
  const total = STEPS.length;
  const step = STEPS[i];
  const next = () => setI(n => Math.min(n + 1, total - 1));
  const back = () => setI(n => Math.max(0, n - 1));

  if (step === "welcome") {
    return (
      <div className="ob-splash" role="dialog" aria-modal="true" aria-label="Welcome to Hootsuite">
        <div className="ob-splash-body">
          <span className="eyebrow">Welcome</span>
          <h1>Welcome to Hootsuite</h1>
          <p>Let's set up your workspace. A few quick questions and you'll be ready to plan, publish, listen, and grow — all in one place.</p>
          <div className="acts"><button className="hs-btn hs-btn--primary" type="button" onClick={next}>Get started</button></div>
        </div>
        <div className="ob-splash-art"><img src={OWL} alt="" aria-hidden="true" /></div>
      </div>
    );
  }
  if (step === "business") {
    return (
      <Sheet title="Tell us about your business" sub="We'll use this to personalize your experience." total={total} index={i} onBack={back} onNext={next} nextLabel="Continue" onSkip={next}>
        <div className="ob-fields">
          <div className="ob-field"><label htmlFor="nu-ind">Industry</label><select id="nu-ind" className="ob-select">{NU_INDUSTRIES.map(o => <option key={o}>{o}</option>)}</select></div>
          <div className="ob-field"><label htmlFor="nu-role">Role</label><select id="nu-role" className="ob-select">{NU_ROLES.map(o => <option key={o}>{o}</option>)}</select></div>
          <div className="ob-field"><label htmlFor="nu-size">Company size</label><select id="nu-size" className="ob-select">{NU_SIZES.map(o => <option key={o}>{o}</option>)}</select></div>
        </div>
      </Sheet>
    );
  }
  if (step === "start") {
    return (
      <Sheet title="Where do you want to start?" sub="Six products inside the Social OS. Pick one to start with — you can switch anytime. Wisdom runs across all of them." total={total} index={i} onBack={back} onNext={next} nextLabel="Continue" wide>
        <div className="ob-pickgrid">
          {NU_PRODUCTS.map(p => (
            <button key={p.k} type="button" className={"ob-pick" + (pick === p.k ? " on" : "")} onClick={() => setPick(p.k)} aria-pressed={pick === p.k}>
              <span className={"ob-pick-ic tone-" + p.tone}><span className="material-symbols-outlined">{p.icon}</span></span>
              <div><div className="nm">{p.nm}</div><div className="d">{p.d}</div></div>
              {pick === p.k && <span className="chk"><span className="material-symbols-outlined">check_circle</span></span>}
            </button>
          ))}
        </div>
      </Sheet>
    );
  }
  if (step === "connect") {
    return (
      <Sheet title="Connect your social accounts" sub="Link the networks you manage so you can publish and listen across all of them." total={total} index={i} onBack={back} onNext={next} nextLabel="Continue" onSkip={next}>
        <div className="ob-netgrid">
          {NU_NETS.map(n => (
            <div className={"ob-net" + (nets[n.k] ? " done" : "")} key={n.k}>
              <span className="ob-net-ic" style={{ background: n.c }}>{n.g}</span>
              <span className="nm">{n.nm}</span>
              <button className={"hs-btn hs-btn--sm " + (nets[n.k] ? "hs-btn--ghost" : "hs-btn--outlined")} type="button" onClick={() => setNets(s => ({ ...s, [n.k]: !s[n.k] }))}>{nets[n.k] ? "Connected" : "Connect"}</button>
            </div>
          ))}
        </div>
      </Sheet>
    );
  }
  if (step === "ai") {
    return (
      <Sheet title="Connect your AI tools to Hootsuite" sub="Bring the AI tools your team already uses into Hootsuite. Optional — you can do this later." total={total} index={i} onBack={back} onNext={next} nextLabel="Continue" onSkip={next}>
        <div className="ob-netgrid">
          {NU_AITOOLS.map(t => (
            <div className="ob-net" key={t.nm}>
              <span className="ob-net-ic" style={{ background: "var(--bento-system-sys-neutral-700)" }}><span className="material-symbols-outlined" style={{ fontSize: 18 }}>{t.ic}</span></span>
              <span className="nm">{t.nm}</span>
              <button className="hs-btn hs-btn--sm hs-btn--outlined" type="button"><span className="material-symbols-outlined">add_link</span>Connect</button>
            </div>
          ))}
        </div>
      </Sheet>
    );
  }
  // finish
  const prod = NU_PRODUCTS.find(p => p.k === pick);
  return (
    <div className="ob-finish" role="dialog" aria-modal="true" aria-label="You're all set">
      <div className="ob-finish-art"><img src={OWL} alt="" aria-hidden="true" /></div>
      <div className="ob-finish-body">
        <h1>You're all set, Ryan</h1>
        <p>Your workspace is ready. We'll drop you into <strong>{prod ? prod.nm : "Perch"}</strong> to get started — Wisdom is along for the ride across everything.</p>
        <div className="ob-finish-note"><span className="material-symbols-outlined">lightbulb</span><span>You can connect more networks and AI tools any time from Settings.</span></div>
        <div className="ob-finish-acts"><button className="hs-btn hs-btn--primary" type="button" onClick={onClose}>Go to Hootsuite</button></div>
      </div>
    </div>
  );
}

function ComingSoon({ label }) {
  return (
    <div className="ob-finish" role="dialog" aria-label={label}>
      <div className="ob-finish-art"><img src={OWL} alt="" aria-hidden="true" /></div>
      <div className="ob-finish-body">
        <h1>{label}</h1>
        <p>This flow is being built next from the Everything Welcome file.</p>
      </div>
    </div>
  );
}

const FLOWS = [
  ["admin", "Existing user · admin"],
  ["user", "Existing user · user"],
  ["newuser", "New user"],
  ["paywall", "Paywall"],
  ["payment", "Payment"],
];

function App() {
  const [flow, setFlow] = React.useState("admin");
  // Overlay flows render as a centered modal over the generic dimmed suite.
  // Full-bleed flows (paywall / payment) render their own product surface.
  const overlay = flow === "admin" || flow === "user" || flow === "newuser";
  const screen = flow === "admin" ? <ExistingUserFlow key="admin" admin onClose={() => {}} />
    : flow === "user" ? <ExistingUserFlow key="user" admin={false} onClose={() => {}} />
    : flow === "newuser" ? <NewUserFlow key="newuser" onClose={() => {}} />
    : flow === "paywall" ? <window.PaywallFlow key="paywall" onUpgrade={() => setFlow("payment")} onClose={() => setFlow("admin")} />
    : <window.PaymentFlow key="payment" />;
  return (
    <div className="ob-app">
      {overlay && <Backdrop />}
      {overlay ? <div className="ob-stage">{screen}</div> : screen}
      <div className="ob-flowbar" role="tablist" aria-label="Flows">
        <span className="lbl">FLOW</span>
        {FLOWS.map(([k, lbl]) => (
          <button key={k} type="button" className={flow === k ? "on" : ""} onClick={() => setFlow(k)}>{lbl}</button>
        ))}
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
