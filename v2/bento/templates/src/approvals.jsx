// approvals.jsx — Perch › Approvals. Board table 1530:165724.
// Columns: Name (profile) / Content / Created by / Scheduled time / Approval / Actions.
// Realistic sample data (board frame uses {profileName}/{contentPost}/{userName} tokens).
// No-red: the reject (✕) action is amber (warning-700), approve is positive green.
const APPROVALS = [
  { net: "ig", profile: "somosbank",  thumb: "assets/dm/post1.jpg", content: "Plan your next impulse purchase on the go with the Somos app.", by: "Maria Rossi", created: "Thu Oct 30, 2025, 7:07 PM",  sched: "Wed Nov 5, 2025, 4:00 PM",  schedType: "scheduled" },
  { net: "fb", profile: "Somos Bank", thumb: "assets/dm/post2.jpg", content: "Our Spring Sale starts now — up to 40% off select plans.",      by: "Priya Nair",  created: "Thu Oct 30, 2025, 6:42 PM",  sched: "Wed Nov 5, 2025, 4:00 PM",  schedType: "scheduled" },
  { net: "x",  profile: "@somosbank", thumb: "assets/dm/post3.jpg", content: "Big things coming this spring. Stay tuned. 👀",                  by: "Liam Chen",   created: "Thu Oct 30, 2025, 5:30 PM",  sched: "Immediate",                schedType: "immediate" },
  { net: "li", profile: "Somos Bank", thumb: "assets/dm/post4.jpg", content: "We're hiring! Join our growing product team in Toronto.",        by: "Maria Rossi", created: "Wed Oct 29, 2025, 2:15 PM",  sched: "Wed Nov 5, 2025, 4:00 PM",  schedType: "scheduled" },
  { net: "ig", profile: "somos.uk",   thumb: "assets/dm/post5.jpg", content: "Behind the scenes at our Earth Day cleanup.",                    by: "Devin Park",  created: "Wed Oct 29, 2025, 11:00 AM", sched: "Immediate",                schedType: "immediate" },
  { net: "fb", profile: "Somos Bank", thumb: "assets/dm/post1.jpg", content: "Round-ups explained in 30 seconds — watch how it works.",        by: "Priya Nair",  created: "Tue Oct 28, 2025, 4:50 PM",  sched: "Thu Nov 6, 2025, 9:00 AM",  schedType: "scheduled" },
  { net: "x",  profile: "@somosbank", thumb: "assets/dm/post2.jpg", content: "Zero fees. Real savings. That's the Somos promise.",             by: "Liam Chen",   created: "Tue Oct 28, 2025, 1:20 PM",  sched: "Immediate",                schedType: "immediate" },
  { net: "li", profile: "Somos Bank", thumb: "assets/dm/post3.jpg", content: "Our 2025 sustainability report is live.",                        by: "Devin Park",  created: "Mon Oct 27, 2025, 9:45 AM",  sched: "Fri Nov 7, 2025, 10:30 AM", schedType: "scheduled" },
];

const ICON_SUBTLE = { fontSize: 18, color: "var(--bento-theme-color-icon-subtle)" };

function Approvals() {
  const [tab, setTab] = React.useState("assigned");
  const tabs = [["assigned", "Assigned", 10], ["created", "Created", 2], ["rejected", "Rejected", 2], ["expired", "Expired", null]];
  return (
    <div className="pp-main">
      <PerchTopBar title="Approvals">
        <button className="pp-icon ne-tooltipbtn" type="button" aria-label="Analytics" title="Analytics"><span className="material-symbols-outlined">monitoring</span></button>
        <button className="pp-icon ne-tooltipbtn" type="button" aria-label="Filters" title="Filters"><span className="material-symbols-outlined">tune</span></button>
      </PerchTopBar>
      <nav className="pp-tabs">
        {tabs.map(([k, label, n]) => (
          <a key={k} className={"pp-tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{label}{n != null && <span className="count">{n}</span>}</a>
        ))}
      </nav>
      <div className="pp-body">
        <div className="pp-panel">
          <div className="pp-toolbar">
            <button className="pp-sort" type="button">Sort by date modified<span className="material-symbols-outlined">keyboard_arrow_down</span></button>
            <span className="spacer"></span>
            <button className="pp-filter" type="button">Filters<span className="material-symbols-outlined">keyboard_arrow_down</span></button>
          </div>
          <table className="pp-table">
            <thead>
              <tr>
                <th className="pp-colcheck"><span className="pp-check"></span></th>
                <th>Name</th>
                <th>Content</th>
                <th>Created by</th>
                <th>Scheduled time</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {APPROVALS.map((r, i) => (
                <tr key={i}>
                  <td className="pp-colcheck"><span className="pp-check"></span></td>
                  <td><span className="pp-person"><PerchNet k={r.net} />{r.profile}</span></td>
                  <td>
                    <div className="pp-cellrow" style={{ alignItems: "flex-start" }}>
                      <span className="pp-thumb" style={{ backgroundImage: `url(${r.thumb})`, backgroundSize: "cover", backgroundPosition: "center" }}></span>
                      <div className="pp-cellstack">
                        <span className="pp-clamp2">{r.content}</span>
                        <span className="pp-cellrow"><span className="material-symbols-outlined">reply</span>Reply</span>
                      </div>
                    </div>
                  </td>
                  <td><div className="pp-cellstack"><span>{r.by}</span><span className="pp-cellsub">{r.created}</span></div></td>
                  <td><span className="pp-cellrow"><span className="material-symbols-outlined">{r.schedType === "immediate" ? "bolt" : "calendar_today"}</span>{r.sched}</span></td>
                  <td>
                    <div className="pp-rowactions">
                      <button className="pp-actbtn ne-tooltipbtn" type="button" aria-label="Approve" title="Approve" style={{ color: "var(--bento-system-sys-positive-600)" }}><span className="material-symbols-outlined">check_circle</span></button>
                      <button className="pp-actbtn ne-tooltipbtn" type="button" aria-label="Reject" title="Reject" style={{ color: "var(--bento-system-sys-warning-700)" }}><span className="material-symbols-outlined">cancel</span></button>
                      <button className="pp-actbtn ne-tooltipbtn" type="button" aria-label="More actions" title="More actions"><span className="material-symbols-outlined">more_horiz</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function App() {
  return <div className="suite-app"><SuiteRail active="perch" /><PerchDrawer active="approvals" /><Approvals /></div>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
