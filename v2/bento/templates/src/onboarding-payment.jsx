// onboarding-payment.jsx — Everything Welcome · Payment flow (UI ONLY).
// Source: Payment-Upgrade---Downgrade/Payment-flow (Plans 13774:38388, Profile,
// EndOfTrialFlow) + Current-payment/EpiredFlow/ReviewPlanDetails (11796:22779)
// + Upgrade-downgrade. Prices/copy lifted verbatim from those frames.
// NOTHING IS PROCESSED — card data is obviously fake (4242 4242 4242 4242).
// Reuses window.PwApp / window.PRODUCTS from onboarding-paywall.jsx.

const { PwApp } = window;
const usd = n => "US$" + n.toLocaleString("en-US");

const PLAN_DATA = {
  advanced: {
    nm: "Advanced", price: 249, plus: "Standard",
    feats: ["Unlimited social accounts", "Customizable analytics reports and templates", "Saved message replies and auto-responses", "Team approval workflows**"],
  },
  standard: {
    nm: "Standard", price: 99, plus: null,
    feats: ["Up to 5 social accounts", "Unlimited post scheduling", "Best time to post recommendations", "AI assistant with image and caption generator"],
  },
};

function PlanCard({ planKey, current, onAction }) {
  const p = PLAN_DATA[planKey];
  const isCurrent = planKey === current;
  // Action depends on relationship to the current plan.
  const order = { standard: 0, advanced: 1 };
  const action = isCurrent ? null : (order[planKey] > order[current] ? "Upgrade" : "Downgrade");
  return (
    <div className="pay-pcard">
      {isCurrent && <div className="pay-pcard-banner">Your current plan</div>}
      <div className="pay-pcard-in">
        <div className="pay-pcard-top">
          <div>
            <div className="pay-pname">{p.nm}</div>
            <div className="pay-pprice"><span className="amt">${p.price}</span><span className="per">/ per user / mo*</span></div>
          </div>
          {isCurrent
            ? <button className="pay-cur-btn" type="button" disabled>Current plan</button>
            : <button className={"hs-btn " + (action === "Upgrade" ? "hs-btn--primary" : "hs-btn--secondary")} type="button" onClick={() => onAction(planKey, action)}>{action}</button>}
        </div>
        {p.plus && <div className="pay-pcard-tag">Everything in <b>{p.plus}</b>, plus:</div>}
        <div className="pay-feat">
          {p.feats.map((f, i) => <span className="ln" key={i}><span className="material-symbols-outlined">check</span>{f}</span>)}
        </div>
        <a className="pay-learn" href="#" onClick={e => e.preventDefault()}>Learn more<span className="material-symbols-outlined">open_in_new</span></a>
      </div>
    </div>
  );
}

function ReviewPlanScreen({ current, onConfirm }) {
  const [cycle, setCycle] = React.useState("annual"); // annual | monthly
  const [seats, setSeats] = React.useState(0);
  const users = 1 + seats;
  const annualPerYear = 2988, monthlyPerMonth = 399, annualSaving = 1800;
  const isAnnual = cycle === "annual";
  const total = isAnnual ? users * annualPerYear : users * monthlyPerMonth;
  const totalUnit = isAnnual ? "/ year" : "/ month";

  return (
    <div className="pay-page">
      <div className="pay-grid">
        <div>
          <h2 className="pay-h2">Review plan details</h2>
          <div className="pay-plans-row">
            <PlanCard planKey="advanced" current={current} onAction={onConfirm} />
            <PlanCard planKey="standard" current={current} onAction={onConfirm} />
          </div>
          <div className="pay-seats">
            <div className="lead">Your <b>{PLAN_DATA[current].nm}</b> plan includes 1 user. Each additional user is ${PLAN_DATA[current].price}.00 (${annualPerYear.toLocaleString("en-US")}.00/year).</div>
            <div className="pay-seats-ctl">
              <span className="t">Additional seats</span>
              <button className="pay-step" type="button" aria-label="Remove seat" onClick={() => setSeats(s => Math.max(0, s - 1))} disabled={seats === 0}><span className="material-symbols-outlined">remove</span></button>
              <span className="n" aria-live="polite">{seats}</span>
              <button className="pay-step" type="button" aria-label="Add seat" onClick={() => setSeats(s => s + 1)}><span className="material-symbols-outlined">add</span></button>
            </div>
            <div className="foot">Total of <b>{users} user{users > 1 ? "s" : ""}</b>. Add or remove users to change your add-on.</div>
          </div>
        </div>

        <div className="pay-side">
          <div>
            <div className="pay-side-h">Select your billing cycle<span className="material-symbols-outlined" title="Annual billing is charged once per year.">info</span></div>
            <button type="button" className={"pay-cyc" + (isAnnual ? " on" : "")} onClick={() => setCycle("annual")} aria-pressed={isAnnual}>
              <span className="pay-radio"></span>
              <span>
                <span className="nm">Annually</span>
                <span className="amt">{usd(249)}</span>
                <span className="sub">per user/month</span>
                <span className="sub">{usd(2988)} Billed annually</span>
              </span>
              <span className="pay-save"><span className="material-symbols-outlined">savings</span>Save {usd(1800)}</span>
            </button>
            <button type="button" className={"pay-cyc" + (!isAnnual ? " on" : "")} onClick={() => setCycle("monthly")} aria-pressed={!isAnnual}>
              <span className="pay-radio"></span>
              <span>
                <span className="nm">Monthly</span>
                <span className="amt">{usd(399)}</span>
                <span className="sub">per user/month</span>
                <span className="sub">Billed monthly</span>
              </span>
            </button>
          </div>

          <div>
            <div className="pay-side-h">Order summary</div>
            <div className="pay-summary">
              <div className="pay-sum-plan">
                <div className="k">Your plan</div>
                <div className="v">{PLAN_DATA[current].nm} · {usd(isAnnual ? 249 : 399)} / month</div>
              </div>
              <div className="pay-sum-div"></div>
              <div className="pay-sum-row"><span>{PLAN_DATA[current].nm} × {users} user{users > 1 ? "s" : ""}</span><span className="v">{usd(total)} {totalUnit}</span></div>
              {isAnnual && <div className="pay-sum-row" style={{ color: "var(--bento-theme-color-text-positive)" }}><span>Annual saving</span><span className="v">−{usd(users * annualSaving)}</span></div>}
              <div className="pay-sum-div"></div>
              <div className="pay-sum-total"><span>Total due today</span><span>{usd(total)} {totalUnit}</span></div>
              <button className="hs-btn hs-btn--primary" type="button" onClick={() => onConfirm(current, "Continue")}>Continue</button>
              <div className="pay-fineprint">Prices are displayed in USD. Tax not included.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingScreen() {
  const [editing, setEditing] = React.useState(false);
  return (
    <div className="pay-page">
      <div className="pay-settings">
        {/* Current plan */}
        <section className="pay-sec">
          <div className="pay-sec-h"><h3>Current plan</h3><span className="spring"></span><button className="hs-btn hs-btn--outlined hs-btn--sm" type="button">Change plan</button></div>
          <div className="pay-sec-b">
            <div className="pay-kv"><span className="k">Plan</span><span className="v"><span className="em">Advanced</span> · {usd(249)} / user / month</span></div>
            <div className="pay-kv"><span className="k">Billing cycle</span><span className="v">Billed annually — {usd(2988)} / year · renews 14 Jun 2027</span></div>
            <div className="pay-kv"><span className="k">Seats</span><span className="v">1 user</span></div>
            <div className="pay-kv"><span className="k">Status</span><span className="v"><span className="pay-trialbadge"><span className="material-symbols-outlined">check_circle</span>Active</span></span></div>
          </div>
        </section>

        {/* Payment method (fake) */}
        <section className="pay-sec">
          <div className="pay-sec-h"><h3>Payment method</h3><span className="spring"></span>{!editing && <button className="hs-btn hs-btn--outlined hs-btn--sm" type="button" onClick={() => setEditing(true)}>Edit</button>}</div>
          <div className="pay-sec-b">
            {!editing ? (
              <React.Fragment>
                <div className="pay-kv"><span className="k">Card</span><span className="v"><span className="pay-card-chip"><span className="pay-brand"></span><span className="em">Mastercard ···· 4242</span></span></span></div>
                <div className="pay-kv"><span className="k">Expires</span><span className="v">04 / 27</span></div>
                <div className="pay-kv"><span className="k">Name on card</span><span className="v">Ryan Carter</span></div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="pay-demo-note"><span className="material-symbols-outlined">info</span>Demo only — no real payment is processed. Use the placeholder card data below.</div>
                <div className="pay-form">
                  <div className="pay-fld full"><label htmlFor="cc-name">Name on card</label><input id="cc-name" type="text" defaultValue="Ryan Carter" autoComplete="off" /></div>
                  <div className="pay-fld full"><label htmlFor="cc-num">Card number</label><input id="cc-num" type="text" inputMode="numeric" defaultValue="4242 4242 4242 4242" autoComplete="off" /></div>
                  <div className="pay-fld"><label htmlFor="cc-exp">Expiry</label><input id="cc-exp" type="text" defaultValue="04 / 27" autoComplete="off" /></div>
                  <div className="pay-fld"><label htmlFor="cc-cvc">CVC</label><input id="cc-cvc" type="text" inputMode="numeric" defaultValue="•••" autoComplete="off" /></div>
                </div>
                <div className="pay-edit-acts"><button className="hs-btn hs-btn--ghost" type="button" onClick={() => setEditing(false)}>Cancel</button><button className="hs-btn hs-btn--primary" type="button" onClick={() => setEditing(false)}>Save card</button></div>
              </React.Fragment>
            )}
          </div>
        </section>

        {/* Billing address */}
        <section className="pay-sec">
          <div className="pay-sec-h"><h3>Billing address</h3><span className="spring"></span><button className="hs-btn hs-btn--outlined hs-btn--sm" type="button">Edit</button></div>
          <div className="pay-sec-b">
            <div className="pay-kv"><span className="k">Company</span><span className="v">Somos Inc.</span></div>
            <div className="pay-kv"><span className="k">Address</span><span className="v">5 Adelaide St E, Suite 400<br />Toronto, ON M5C 1J3<br />Canada</span></div>
            <div className="pay-kv"><span className="k">Billing email</span><span className="v">billing@somos.example</span></div>
          </div>
        </section>

        {/* Billing history */}
        <section className="pay-sec">
          <div className="pay-sec-h"><h3>Billing history</h3></div>
          <div className="pay-sec-b">
            <table className="pay-hist">
              <thead><tr><th>Date</th><th>Description</th><th className="num">Amount</th><th className="num">Invoice</th></tr></thead>
              <tbody>
                {[["14 Jun 2026", "Advanced — annual", "US$2,988.00"], ["14 Jun 2025", "Advanced — annual", "US$2,988.00"], ["14 Jun 2024", "Standard — annual", "US$1,188.00"]].map((r, i) => (
                  <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td className="num">{r[2]}</td><td className="num"><span className="dl">Download</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function TrialEndedModal({ onReview, onClose }) {
  return (
    <div className="pw-root">
      <PwApp active="perch" title="Perch"><div className="pwapp-body" aria-hidden="true"></div></PwApp>
      <div className="pw-scrim"></div>
      <div className="pw-center">
        <div className="pay-tmodal" role="dialog" aria-modal="true" aria-label="Your free trial has ended">
          <div className="pay-tmodal-art"><span className="material-symbols-outlined">hourglass_empty</span></div>
          <div className="pay-tmodal-b">
            <h2>Your free trial has ended</h2>
            <p>Your 30-day free trial for Hootsuite has ended. To continue accessing your projects and all of Hootsuite's powerful features, you'll need to upgrade your account. Don't worry, it only takes a minute.</p>
            <div className="pay-tmodal-acts">
              <button className="hs-btn hs-btn--ghost" type="button" onClick={onClose}>Contact sales</button>
              <button className="hs-btn hs-btn--primary" type="button" onClick={onReview}>Review plan details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ data, onClose }) {
  const verb = data.action === "Continue" ? "Confirm subscription" : `Confirm ${data.action.toLowerCase()}`;
  const target = PLAN_DATA[data.plan].nm;
  const body = data.action === "Continue"
    ? `You're subscribing to the ${target} plan. This is a demo — no payment will be processed and no card will be charged.`
    : `You're about to ${data.action.toLowerCase()} to the ${target} plan. This is a demo — no payment will be processed.`;
  return (
    <div className="pw-center" style={{ background: "rgba(1,43,58,0.5)" }} onClick={onClose}>
      <div className="pay-tmodal" role="dialog" aria-modal="true" aria-label={verb} onClick={e => e.stopPropagation()}>
        <div className="pay-confirm-b">
          <h2>{verb}</h2>
          <p>{body}</p>
          <div className="pay-demo-note"><span className="material-symbols-outlined">info</span>Payments are UI only in this template — nothing is charged.</div>
          <div className="pay-tmodal-acts">
            <button className="hs-btn hs-btn--ghost" type="button" onClick={onClose}>Cancel</button>
            <button className="hs-btn hs-btn--primary" type="button" onClick={onClose}>{data.action === "Continue" ? "Subscribe" : data.action}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const PAY_SUBS = [["plans", "Plans"], ["billing", "Billing & plan"], ["trial", "End of trial"], ["updown", "Upgrade / Downgrade"]];

function PaymentFlow() {
  const [sub, setSub] = React.useState("plans");
  const [confirm, setConfirm] = React.useState(null); // {plan, action} | null
  const onConfirm = (plan, action) => setConfirm({ plan, action });

  if (sub === "trial") {
    return (
      <React.Fragment>
        <TrialEndedModal onReview={() => setSub("plans")} onClose={() => setSub("plans")} />
        <SubBarFloating sub={sub} setSub={setSub} />
      </React.Fragment>
    );
  }

  const title = sub === "billing" ? "Billing & plan" : "Plans";
  return (
    <React.Fragment>
      <PwApp active="perch" title={title} topRight={
        <button className="pwapp-ws" type="button"><span className="av">R</span>Ryan · Somos<span className="material-symbols-outlined" style={{ fontSize: 20 }}>keyboard_arrow_down</span></button>
      }>
        <div className="pay-sub">
          <span className="lbl">DEMO</span>
          {PAY_SUBS.map(([k, lbl]) => <button key={k} type="button" className={sub === k ? "on" : ""} onClick={() => setSub(k)}>{lbl}</button>)}
        </div>
        <div className="pay-body">
          {sub === "plans" && <ReviewPlanScreen current="advanced" onConfirm={onConfirm} />}
          {sub === "updown" && <ReviewPlanScreen current="standard" onConfirm={onConfirm} />}
          {sub === "billing" && <BillingScreen />}
        </div>
      </PwApp>
      {confirm && <ConfirmModal data={confirm} onClose={() => setConfirm(null)} />}
    </React.Fragment>
  );
}

// the End-of-trial state hides the app sub-bar inside the modal; show a small floating one
function SubBarFloating({ sub, setSub }) {
  return (
    <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 40, display: "flex", gap: 4, padding: 6, borderRadius: 999, background: "var(--bento-theme-color-bg-surface)", boxShadow: "0 6px 20px rgba(1,43,58,0.25)" }}>
      <span className="lbl" style={{ fontWeight: 700, fontSize: 12, color: "var(--bento-theme-color-text-subtle)", alignSelf: "center", padding: "0 6px" }}>DEMO</span>
      {PAY_SUBS.map(([k, lbl]) => (
        <button key={k} type="button" onClick={() => setSub(k)} style={{ border: 0, cursor: "pointer", fontFamily: "var(--bento-theme-font-families-primary)", fontWeight: 600, fontSize: 14, height: 32, padding: "0 12px", borderRadius: 999, background: sub === k ? "var(--bento-theme-color-bg-primary)" : "transparent", color: sub === k ? "#fff" : "var(--bento-theme-color-text-subtle)" }}>{lbl}</button>
      ))}
    </div>
  );
}

window.PaymentFlow = PaymentFlow;
