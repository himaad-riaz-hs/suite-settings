// perch-common.jsx — shared bits for Perch flow pages (net logos, top bar, drawer-mount helper).
// Exposes globals: PerchNet, PerchTopBar.

const PERCH_NET_PATHS = {
  x:  "M13.3 10.6 20.5 2.5h-1.7l-6.2 7.05-5-7.05H2l7.5 10.65L2 21.5h1.7l6.6-7.45 5.3 7.45h5.6l-7.9-11zm-2.3 2.6-.77-1.07L4.3 3.8h2.6l4.9 6.9.77 1.07 6.4 9.03h-2.6z",
  fb: "M13.5 21v-8.2h2.75l.4-3.2h-3.15V7.55c0-.93.26-1.56 1.6-1.56h1.7V3.13c-.3-.04-1.3-.13-2.47-.13-2.45 0-4.13 1.5-4.13 4.24V9.6H7.5v3.2h2.7V21z",
  li: "M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM7 8.48H3V21h4zm6.32 0H9.5V21h3.82v-6.57c0-3.55 4.45-3.84 4.45 0V21H21.6v-7.93c0-6-6.9-5.78-8.32-2.83z",
  ig: "M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-11.85a1.44 1.44 0 1 1-1.44 1.44 1.44 1.44 0 0 1 1.44-1.44zm4.09 1.47a7.06 7.06 0 0 0-.48-2.34 4.92 4.92 0 0 0-2.81-2.81 7.06 7.06 0 0 0-2.34-.48C15.66 0 15.31 0 12 0S8.34 0 7.13.06a7.06 7.06 0 0 0-2.34.48 4.92 4.92 0 0 0-2.81 2.81 7.06 7.06 0 0 0-.48 2.34C1.44 6.34 1.44 6.69 1.44 10s0 3.66.06 4.87a7.06 7.06 0 0 0 .48 2.34 4.92 4.92 0 0 0 2.81 2.81 7.06 7.06 0 0 0 2.34.48C8.34 24 8.69 24 12 24s3.66 0 4.87-.06a7.06 7.06 0 0 0 2.34-.48 4.92 4.92 0 0 0 2.81-2.81 7.06 7.06 0 0 0 .48-2.34c.06-1.21.06-1.56.06-4.87s0-3.66-.06-4.69zm-2.16 9.45a4.36 4.36 0 0 1-1.15 1.6 4.36 4.36 0 0 1-1.6 1.04 6.3 6.3 0 0 1-2.14.4c-1.2.05-1.56.06-4.45.06s-3.25 0-4.45-.06a6.3 6.3 0 0 1-2.14-.4 4.36 4.36 0 0 1-1.6-1.04 4.36 4.36 0 0 1-1.04-1.6 6.3 6.3 0 0 1-.4-2.14C2.27 13.26 2.26 12.9 2.26 10s0-3.25.06-4.45a6.3 6.3 0 0 1 .4-2.14 4.36 4.36 0 0 1 1.04-1.6 4.36 4.36 0 0 1 1.6-1.04 6.3 6.3 0 0 1 2.14-.4C8.75 2.27 9.1 2.26 12 2.26s3.25 0 4.45.06a6.3 6.3 0 0 1 2.14.4 4.36 4.36 0 0 1 1.6 1.04 4.36 4.36 0 0 1 1.04 1.6 6.3 6.3 0 0 1 .4 2.14c.05 1.2.06 1.56.06 4.45s-.01 3.26-.35 4.22z",
  tt: "M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v13.2a2.4 2.4 0 1 1-2.4-2.4c.27 0 .53.04.78.12V8.5a5.73 5.73 0 0 0-.78-.05A5.73 5.73 0 1 0 15.3 14.2V8.9a7.5 7.5 0 0 0 4.3 1.36V7a4.28 4.28 0 0 1-3-1.18z",
};
const PERCH_NET_BG = { x: "#000", fb: "#1877F2", li: "#0A66C2", tt: "#000", ig: "radial-gradient(circle at 30% 110%, #FFD774, #DD2A7B 55%, #515BD4)" };

function PerchNet({ k }) {
  return (
    <span className="net" style={{ background: PERCH_NET_BG[k] }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={PERCH_NET_PATHS[k]} fill="#fff"></path></svg>
    </span>
  );
}

// Shared Perch top bar. Pass title (string) OR back+title for sub-screens.
function PerchTopBar({ title, back, onBack, children }) {
  return (
    <header className="pp-top">
      {back && <button className="pp-back" type="button" aria-label="Back" onClick={onBack}><span className="material-symbols-outlined">arrow_back</span></button>}
      <h1>{title}</h1>
      <span className="spacer"></span>
      {children}
      <a className="pp-split" href="composer.html"><span className="main"><span className="material-symbols-outlined">add</span>Create a post</span><span className="chev" role="button" aria-label="More create options"><span className="material-symbols-outlined">expand_more</span></span></a>
      <span className="pp-topdiv"></span>
      <button className="pp-ws" type="button"><span className="av">SOMOS</span>Somos<span className="material-symbols-outlined chev">keyboard_arrow_down</span></button>
      <button className="pp-icon ne-tooltipbtn" type="button" aria-label="Settings"><span className="material-symbols-outlined">settings</span></button>
    </header>
  );
}

Object.assign(window, { PerchNet, PerchTopBar });
