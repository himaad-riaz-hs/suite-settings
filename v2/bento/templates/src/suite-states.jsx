// suite-states.jsx — shared demo-state switcher for every product template.
// A review aid (NOT product chrome): lets a reviewer flip between the six
// surfaces a template ships — main · detail · create/edit · empty · error ·
// loading — without needing a natural in-product trigger for each.
// Mount: <SuiteStates states={[["main","Overview"],…]} value={s} onChange={setS} />

function SuiteStates({ states, value, onChange }) {
  return (
    <div className="suite-demo" role="group" aria-label="Demo states">
      <span className="lab">States</span>
      {states.map(([k, lbl]) => (
        <button key={k} type="button" aria-pressed={value === k} className={value === k ? "on" : ""} onClick={() => onChange(k)}>{lbl}</button>
      ))}
    </div>
  );
}

if (typeof window !== "undefined") { window.SuiteStates = SuiteStates; }
