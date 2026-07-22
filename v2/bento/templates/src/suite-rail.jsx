// suite-rail.jsx — shared Suite shell rail for every product template.
// Mount with: <SuiteRail active="perch" /> (active = product key, or a legacy
// alias — see ALIASES below).
//
// Rail model + labels follow the social-os-reboot product nav: the codenames
// ARE the product names. Order top → bottom:
//   Perch · Nest · Lumen · Parliament · Wisdom · Vigil
// Sub-tools (Compose, Content, Drafts, Approvals, Ads, Boost, Explore, Hootbio)
// nest INSIDE their product area (mostly Perch); Vigil (governance) is a
// top-level item — there is no "More" overflow in this model.

function SuiteRail({ active }) {
  // Legacy / customer-facing aliases → reboot product keys, so templates that
  // still pass active="plan"/"inbox"/"create"/… highlight the right product.
  const ALIASES = {
    plan: "perch", create: "perch", composer: "perch", content: "perch",
    drafts: "perch", approvals: "perch", ads: "perch", boost: "perch",
    explore: "perch", hootbio: "perch", whiteboard: "perch", analytics: "perch", dm: "perch",
    inbox: "nest",
    listening: "lumen",
    amplify: "parliament",
    owlygpt: "wisdom",
    governance: "vigil",
  };
  const current = ALIASES[active] || active;

  const products = [
    { key: "perch",      icon: "calendar_month",  label: "Perch",      href: "planner.html"    },
    { key: "nest",       icon: "inbox",          label: "Nest",       href: "nest.html"       },
    { key: "lumen",      icon: "graphic_eq",     label: "Lumen",      href: "lumen.html"      },
    { key: "parliament", icon: "groups",         label: "Parliament", href: "parliament.html" },
    { key: "wisdom",     icon: "auto_awesome",   label: "Wisdom",     href: "wisdom.html"     },
    // Vigil (governance) hidden across templates while in progress — restore this
    // entry when it ships: { key: "vigil", icon: "verified_user", label: "Vigil", href: "governance.html" },
  ];

  return (
    <aside className="suite-rail">
      <div className="main">
        <a className="suite-brand" href="planner.html" aria-label="Hootsuite" title="Hootsuite">
          <img src="assets/hootsuite-owly-small.png" alt="Hootsuite" />
        </a>
        {products.map(p => (
          <a
            key={p.key}
            href={p.href}
            className={"suite-navbtn" + (current === p.key ? " is-selected" : "")}
            data-product={p.key}
            aria-current={current === p.key ? "page" : undefined}
          >
            <span className="circle"><span className="material-symbols-outlined">{p.icon}</span></span>
            <span className="lbl">{p.label}</span>
          </a>
        ))}
      </div>
      <div className="others">
        <a className="suite-navbtn util" href="analytics.html" aria-label="Analytics" title="Analytics">
          <span className="circle"><span className="material-symbols-outlined">bar_chart</span></span>
          <span className="lbl">Analytics</span>
        </a>
        <a
          className={"suite-navbtn util" + (current === "notifications" ? " is-selected" : "")}
          href="notifications.html" aria-label="Notifications" title="Notifications"
        >
          <span className="circle"><span className="material-symbols-outlined">notifications</span><span className="hint"></span></span>
          <span className="lbl">Notifications</span>
        </a>
        <button className="suite-navbtn util" type="button" aria-label="Help" title="Help" style={{ border: 0, background: "transparent", cursor: "pointer", padding: 0, width: "100%" }}>
          <span className="circle"><span className="material-symbols-outlined">help</span></span>
          <span className="lbl">Help</span>
        </button>
        <button className="suite-rail-avatar-btn" type="button" aria-label="Profile" title="Profile" style={{ border: 0, background: "transparent", cursor: "pointer", padding: 0 }}>
          <span className="avatar">RW</span>
        </button>
      </div>
    </aside>
  );
}

if (typeof window !== "undefined") { window.SuiteRail = SuiteRail; }
