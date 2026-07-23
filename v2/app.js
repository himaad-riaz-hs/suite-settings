/* Suite Settings v2 — interactive layer for the permissions + roles flows.
   Vanilla JS, no build step. State lives in localStorage so a scope or a new
   role survives navigating away and back (the DX-3804 fix: save + confirm +
   persist). Page-aware: each init only runs if its anchor elements exist. */
(function () {
  "use strict";

  var STORE_KEY = "ssv2";

  /* ---- seed data -------------------------------------------------------- */
  var PEOPLE = {
    jordan:  { name: "Jordan Lee",   email: "jordan@somos.co",  initials: "JL", role: "Super admin", status: "Active"  },
    marisol: { name: "Marisol Chen", email: "marisol@somos.co", initials: "MC", role: "Admin",       status: "Active"  },
    sam:     { name: "Sam Rivera",   email: "sam@somos.co",     initials: "SR", role: "Editor",      status: "Active"  },
    aisha:   { name: "Aisha Patel",  email: "aisha@somos.co",   initials: "AP", role: "Super admin", status: "Active"  },
    devin:   { name: "Devin Okafor", email: "devin@somos.co",   initials: "DO", role: "Editor",      status: "Active"  },
    marco:   { name: "Marco Silva",  email: "marco@somos.co",   initials: "MS", role: "Editor",      status: "Active"  },
    yuki:    { name: "Yuki Tanaka",  email: "yuki@somos.co",    initials: "YT", role: "Editor",      status: "Pending" },
    bryn:    { name: "Bryn Morales", email: "bryn@somos.co",    initials: "BM", role: "Editor",      status: "Active"  }
  };

  /* capability areas shown in the granular editor (product-realistic labels) */
  var CAPS = [
    { key: "content",   icon: "edit_note",   label: "Content & drafts",      desc: "Create, edit, schedule, and publish posts." },
    { key: "analytics", icon: "monitoring",  label: "Analytics & reports",   desc: "View performance and build reports." },
    { key: "social",    icon: "share",       label: "Social accounts",       desc: "Connect, disconnect, and manage accounts." },
    { key: "people",    icon: "group",       label: "Team & people",         desc: "Invite or remove people and set their roles." },
    { key: "billing",   icon: "credit_card", label: "Billing & plan",        desc: "See invoices and change the plan." },
    { key: "org",       icon: "settings",    label: "Organization settings", desc: "Rename the organization and change global settings." }
  ];

  var LEVELS = [
    { v: "none",   label: "No access" },
    { v: "view",   label: "View only" },
    { v: "manage", label: "Can manage" }
  ];

  function caps(content, analytics, social, people, billing, org) {
    return { content: content, analytics: analytics, social: social, people: people, billing: billing, org: org };
  }

  /* built-in roles and the scope each one grants */
  var PRESETS = {
    "Super admin": caps("manage", "manage", "manage", "manage", "manage", "manage"),
    "Admin":       caps("manage", "manage", "manage", "manage", "manage", "view"),
    "Editor":      caps("manage", "view",   "manage", "none",   "none",   "none"),
    "View only":   caps("view",   "view",   "view",   "none",   "none",   "view")
  };
  var PRESET_ORDER = ["Super admin", "Admin", "Editor", "View only"];
  var PRESET_DESC = {
    "Super admin": "Full control of everything, including billing and org settings.",
    "Admin":       "Manage people, content, and accounts. View org settings.",
    "Editor":      "Create and publish content. View analytics. No admin access.",
    "View only":   "See content, analytics, and accounts. Cannot make changes."
  };

  /* ---- state ------------------------------------------------------------ */
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(state) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function getState() {
    var s = load();
    if (!s.overrides) s.overrides = {};
    if (!s.customRoles) s.customRoles = [];
    if (!s.seeded) {
      // one starter custom role so an "edit an existing role" task has stable
      // ground (does not depend on the participant having created one first)
      s.customRoles.push({ id: "cr_campaign", name: "Campaign Manager",
        caps: caps("manage", "view", "manage", "none", "none", "none") });
      s.seeded = true;
      save(s);
    }
    return s;
  }

  function customRoleByName(state, name) {
    for (var i = 0; i < state.customRoles.length; i++) {
      if (state.customRoles[i].name === name) return state.customRoles[i];
    }
    return null;
  }

  function scopeForRole(state, role) {
    if (PRESETS[role]) return Object.assign({}, PRESETS[role]);
    var cr = customRoleByName(state, role);
    if (cr) return Object.assign({}, cr.caps);
    return caps("none", "none", "none", "none", "none", "none");
  }

  /* effective person = base seed + any saved override */
  function getPerson(state, id) {
    var base = PEOPLE[id];
    if (!base) return null;
    var ov = state.overrides[id];
    var role = (ov && ov.role) || base.role;
    var scope = (ov && ov.scope) || scopeForRole(state, role);
    return { id: id, name: base.name, email: base.email, initials: base.initials,
             status: base.status, role: role, scope: scope,
             removed: !!(ov && ov.removed) };
  }
  function setPerson(id, role, scope) {
    var state = getState();
    var ov = state.overrides[id] || {};
    ov.role = role; ov.scope = scope;
    state.overrides[id] = ov;
    save(state);
  }
  function removePerson(id) {
    var state = getState();
    var ov = state.overrides[id] || {};
    ov.removed = true;
    state.overrides[id] = ov;
    save(state);
  }

  function allRoles(state) {
    var out = PRESET_ORDER.slice();
    for (var i = 0; i < state.customRoles.length; i++) out.push(state.customRoles[i].name);
    return out;
  }
  function roleDesc(state, role) {
    if (PRESET_DESC[role]) return PRESET_DESC[role];
    var cr = customRoleByName(state, role);
    return cr ? "Custom role." : "";
  }

  /* ---- small UI helpers ------------------------------------------------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var _toastTimer = null;
  function toast(msg) {
    var t = document.getElementById("ssv2-toast");
    if (!t) {
      t = el("div", "toast");
      t.id = "ssv2-toast";
      t.setAttribute("role", "status");
      t.setAttribute("aria-live", "polite");
      document.body.appendChild(t);
    }
    t.innerHTML = '<span class="material-symbols-outlined" style="font-variation-settings:\'FILL\' 1">check_circle</span><span></span>';
    t.lastChild.textContent = msg;
    // force reflow so the transition runs even on rapid repeats
    void t.offsetWidth;
    t.classList.add("show");
    if (_toastTimer) clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* accessible-enough modal: esc + scrim close + focus move + focus return */
  function wireModal(wrap, opts) {
    opts = opts || {};
    var lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      wrap.hidden = false;
      var focusTarget = wrap.querySelector("[data-autofocus]") ||
        wrap.querySelector("input, button, [tabindex]");
      if (focusTarget) focusTarget.focus();
      document.addEventListener("keydown", onKey);
    }
    function close() {
      wrap.hidden = true;
      document.removeEventListener("keydown", onKey);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      if (opts.onClose) opts.onClose();
    }
    function onKey(e) { if (e.key === "Escape") close(); }
    wrap.addEventListener("mousedown", function (e) {
      if (e.target.classList && e.target.classList.contains("scrim")) close();
    });
    var closers = wrap.querySelectorAll("[data-close]");
    for (var i = 0; i < closers.length; i++) closers[i].addEventListener("click", close);
    return { open: open, close: close };
  }

  /* build a granular access editor into `container`; returns read()/set() */
  function buildPermEditor(container, scope) {
    container.innerHTML = "";
    scope = scope || caps("none", "none", "none", "none", "none", "none");
    CAPS.forEach(function (cap) {
      var row = el("div", "perm-row");
      row.setAttribute("data-cap", cap.key);
      var seg = LEVELS.map(function (lv) {
        var on = scope[cap.key] === lv.v ? " on" : "";
        var pressed = scope[cap.key] === lv.v ? "true" : "false";
        return '<button type="button" class="' + on.trim() + '" data-lvl="' + lv.v +
               '" aria-pressed="' + pressed + '">' + lv.label + "</button>";
      }).join("");
      row.innerHTML =
        '<span class="lead"><span class="material-symbols-outlined">' + cap.icon + "</span></span>" +
        '<div class="meta"><div class="k">' + cap.label + '</div><div class="d">' + cap.desc + "</div></div>" +
        '<div class="lvlseg" role="group" aria-label="' + esc(cap.label) + ' access">' + seg + "</div>";
      var segEl = row.querySelector(".lvlseg");
      segEl.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-lvl]");
        if (!b) return;
        var btns = segEl.querySelectorAll("button");
        for (var j = 0; j < btns.length; j++) {
          btns[j].classList.remove("on");
          btns[j].setAttribute("aria-pressed", "false");
        }
        b.classList.add("on");
        b.setAttribute("aria-pressed", "true");
      });
      container.appendChild(row);
    });
    return {
      read: function () {
        var out = {};
        CAPS.forEach(function (cap) {
          var on = container.querySelector('[data-cap="' + cap.key + '"] button.on');
          out[cap.key] = on ? on.getAttribute("data-lvl") : "none";
        });
        return out;
      },
      set: function (sc) { buildPermEditor(container, sc); }
    };
  }

  /* ---- person-detail page ---------------------------------------------- */
  function initPersonDetail() {
    var nameEl = document.getElementById("pdName");
    if (!nameEl) return; // not this page

    var state = getState();
    var params = new URLSearchParams(location.search);
    var id = params.get("p");
    if (!PEOPLE[id]) id = "jordan"; // graceful default
    var person = getPerson(state, id);

    // hydrate identity
    document.title = person.name + ": Suite Settings";
    nameEl.textContent = person.name;
    var countName = document.getElementById("pdCountName");
    if (countName) countName.textContent = person.name;
    var introName = document.getElementById("permIntroName");
    if (introName) introName.textContent = person.name;

    // role chip
    function paintChip() {
      var chip = document.getElementById("pdRole");
      if (chip) chip.innerHTML =
        '<span class="material-symbols-outlined">shield_person</span>' + esc(person.role);
    }
    paintChip();

    // tab switching
    var tabs = document.querySelectorAll(".tabs [data-tab]");
    var panels = document.querySelectorAll("[data-panel]");
    function showTab(key) {
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-tab") === key;
        t.classList.toggle("on", on);
        if (on) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
      });
      panels.forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== key; });
    }
    tabs.forEach(function (t) {
      t.addEventListener("click", function (e) { e.preventDefault(); showTab(t.getAttribute("data-tab")); });
    });

    // permissions editor
    var permList = document.getElementById("permList");
    var editor = permList ? buildPermEditor(permList, person.scope) : null;
    var savedNote = document.getElementById("permSaved");
    if (savedNote) savedNote.hidden = true;

    var saveBtn = document.getElementById("permSave");
    if (saveBtn && editor) {
      saveBtn.addEventListener("click", function () {
        var scope = editor.read();
        person.role = "Custom access";
        person.scope = scope;
        setPerson(id, person.role, scope);
        paintChip();
        if (savedNote) {
          savedNote.hidden = false;
          savedNote.querySelector("[data-saved-text]").textContent =
            "Access saved for " + person.name + ". This applies everywhere in Somos.";
        }
        toast("Access saved for " + person.name);
      });
    }

    // change-role modal
    var roleWrap = document.getElementById("roleModal");
    var roleBtn = document.getElementById("changeRoleBtn");
    if (roleWrap && roleBtn) {
      var m = wireModal(roleWrap);
      var subEl = roleWrap.querySelector("[data-role-sub]");
      var listEl = document.getElementById("roleOptions");
      function renderOptions() {
        listEl.innerHTML = "";
        allRoles(getState()).forEach(function (r) {
          var sel = r === person.role ? " selected" : "";
          var o = el("div", "opt" + sel);
          o.setAttribute("role", "button");
          o.setAttribute("tabindex", "0");
          o.innerHTML =
            '<span class="lead"><span class="material-symbols-outlined">shield_person</span></span>' +
            '<div class="txt"><div class="n">' + esc(r) + '</div><div class="d">' + esc(roleDesc(getState(), r)) + "</div></div>" +
            '<span class="material-symbols-outlined check">check</span>';
          function pick() {
            var st = getState();
            person.role = r;
            person.scope = scopeForRole(st, r);
            setPerson(id, person.role, person.scope);
            if (editor) editor.set(person.scope);
            paintChip();
            m.close();
            toast(person.name + " is now " + r);
          }
          o.addEventListener("click", pick);
          o.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); }
          });
          listEl.appendChild(o);
        });
      }
      roleBtn.addEventListener("click", function () {
        if (subEl) subEl.textContent = "Choose a role for " + person.name + ", or set custom access for finer control.";
        renderOptions();
        m.open();
      });
      var customLink = document.getElementById("roleCustomLink");
      if (customLink) customLink.addEventListener("click", function (e) {
        e.preventDefault(); m.close(); showTab("perms");
        var first = permList && permList.querySelector("button[data-lvl]");
        if (first) first.focus();
      });
    }
  }

  /* ---- people list page (hydrate saved roles so changes persist visibly) */
  function initPeopleList() {
    var grid = document.getElementById("gridView");
    var table = document.getElementById("tableView");
    if (!grid && !table) return;
    var state = getState();

    // card links -> per-person detail; role text reflects saved overrides
    var cards = document.querySelectorAll("#gridView .ecard");
    cards.forEach(function (card) {
      var link = card.querySelector(".nm .n a");
      if (!link) return;
      var id = link.getAttribute("data-pid");
      if (!id) return;
      link.setAttribute("href", "person-detail.html?p=" + id);
      var p = getPerson(state, id);
      if (p && p.removed) { card.style.display = "none"; return; }
      var roleSpan = card.querySelector(".foot > span:first-child");
      if (roleSpan && p) roleSpan.textContent = p.role;
    });

    var rows = document.querySelectorAll("#tableView tbody tr[data-pid]");
    rows.forEach(function (tr) {
      var id = tr.getAttribute("data-pid");
      var p = getPerson(state, id);
      if (p && p.removed) { tr.style.display = "none"; return; }
      var roleCell = tr.querySelector("[data-role-cell]");
      if (roleCell && p) roleCell.textContent = p.role;
    });
  }

  /* ---- roles page ------------------------------------------------------- */
  function initRoles() {
    var body = document.getElementById("rolesBody");
    if (!body) return;
    var state = getState();

    function assignedCount(role) {
      var n = 0;
      for (var pid in PEOPLE) {
        if (!PEOPLE.hasOwnProperty(pid)) continue;
        if (getPerson(state, pid).role === role) n++;
      }
      return n;
    }
    function summarize(scope) {
      var manage = [], view = [];
      CAPS.forEach(function (c) {
        if (scope[c.key] === "manage") manage.push(c.label.replace(" & ", " & "));
        else if (scope[c.key] === "view") view.push(c.label);
      });
      var parts = [];
      if (manage.length) parts.push("Manage: " + manage.join(", "));
      if (view.length) parts.push("View: " + view.join(", "));
      return parts.length ? parts.join(" · ") : "No access granted yet";
    }
    function render() {
      state = getState();
      body.innerHTML = "";
      var rows = [];
      PRESET_ORDER.forEach(function (r) { rows.push({ name: r, scope: PRESETS[r], custom: false }); });
      state.customRoles.forEach(function (cr) { rows.push({ name: cr.name, scope: cr.caps, custom: true }); });
      rows.forEach(function (r) {
        var tr = el("tr");
        tr.innerHTML =
          '<td><div class="cell-with-thumb"><span class="thumb"><span class="material-symbols-outlined">shield_person</span></span>' +
            '<span>' + esc(r.name) + (r.custom ? ' <span class="hs-badge hs-badge--discovery" style="margin-left:6px"><span class="material-symbols-outlined">bolt</span>Custom</span>' : "") + "</span></div></td>" +
          '<td class="hs-small">' + esc(summarize(r.scope)) + "</td>" +
          "<td>" + assignedCount(r.name) + "</td>" +
          '<td><button class="icon-btn ne-tooltipbtn" aria-label="Role actions"><span class="material-symbols-outlined">more_horiz</span></button></td>';
        body.appendChild(tr);
      });
      var countH = document.getElementById("rolesCount");
      if (countH) countH.textContent = rows.length + " roles in Somos";
    }
    render();
    if (window.SSV2) window.SSV2.rerenderRoles = render;

    // create-role modal
    var wrap = document.getElementById("createRoleModal");
    var openBtn = document.getElementById("createRoleBtn");
    if (wrap && openBtn) {
      var m = wireModal(wrap);
      var nameInput = document.getElementById("newRoleName");
      var permList = document.getElementById("newRolePerms");
      var errEl = document.getElementById("newRoleErr");
      var editor = buildPermEditor(permList, null);
      openBtn.addEventListener("click", function () {
        nameInput.value = "";
        if (errEl) errEl.hidden = true;
        editor.set(null);
        m.open();
      });
      var createBtn = document.getElementById("newRoleCreate");
      createBtn.addEventListener("click", function () {
        var name = nameInput.value.trim();
        var scope = editor.read();
        var any = CAPS.some(function (c) { return scope[c.key] !== "none"; });
        if (!name || !any) {
          if (errEl) {
            errEl.hidden = false;
            errEl.textContent = !name ? "Give the role a name." : "Grant at least one permission.";
          }
          nameInput.classList.toggle("hs-input--error", !name);
          return;
        }
        var st = getState();
        st.customRoles.push({ id: "cr" + (st.customRoles.length + 1), name: name, caps: scope });
        save(st);
        m.close();
        render();
        toast('Role "' + name + '" created');
      });
    }
  }

  /* ---- account section sub-tabs (highlight the current page) ----------- */
  function initAccountTabs() {
    var tabs = document.querySelectorAll('.tabs [data-acct]');
    if (!tabs.length) return;
    var file = location.pathname.split("/").pop() || "profile.html";
    tabs.forEach(function (t) {
      var h = t.getAttribute("data-acct");
      var on = (h === file) ||
        (file.indexOf("security") === 0 && h === "security.html") ||
        (file.indexOf("plan-billing") === 0 && h === "plan-billing.html") ||
        (file === "" && h === "profile.html");
      t.classList.toggle("on", on);
      if (on) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
    });
  }

  /* ---- boot ------------------------------------------------------------- */
  /* ---- shared API: inline page scripts persist through the SAME store ----
     (bulk actions, offboarding, teams, etc. all read/write via window.SSV2 so
     changes survive a reload and stay consistent across pages). ---- */
  window.SSV2 = {
    STORE_KEY: STORE_KEY,
    PEOPLE: PEOPLE, CAPS: CAPS, LEVELS: LEVELS,
    PRESETS: PRESETS, PRESET_ORDER: PRESET_ORDER, PRESET_DESC: PRESET_DESC,
    getState: getState, save: save,
    getPerson: getPerson, setPerson: setPerson, removePerson: removePerson,
    allRoles: allRoles, scopeForRole: scopeForRole, roleDesc: roleDesc,
    customRoleByName: customRoleByName,
    buildPermEditor: buildPermEditor, wireModal: wireModal,
    toast: toast, esc: esc, el: el,
    rerenderRoles: function () {}
  };

  function boot() {
    initPersonDetail();
    initPeopleList();
    initRoles();
    initAccountTabs();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

/* ---- a11y decoration: tabs (tablist/tab/aria-selected) + selectable table
   checkboxes (role=checkbox, tabindex, aria-checked, aria-label, keyboard).
   Read-only; runs after boot. Mirrored inline on team-detail (no app.js). ---- */
(function(){
  function decorate(){
    document.querySelectorAll("nav.tabs").forEach(function(nav){
      nav.setAttribute("role","tablist");
      nav.querySelectorAll("a").forEach(function(a){ a.setAttribute("role","tab"); a.setAttribute("aria-selected", a.classList.contains("on") ? "true" : "false"); });
    });
    document.querySelectorAll("table.hs-table .hs-check").forEach(function(c){
      c.setAttribute("role","checkbox"); if(!c.hasAttribute("tabindex")) c.setAttribute("tabindex","0");
      c.setAttribute("aria-checked", c.classList.contains("is-on") ? "true" : "false");
      if(!c.getAttribute("aria-label")){
        var head=c.closest("thead"), tr=c.closest("tr");
        var nameEl = tr && tr.querySelector(".cell-with-thumb a, .cell-with-thumb span:last-child");
        c.setAttribute("aria-label", head ? "Select all" : ("Select " + (nameEl ? nameEl.textContent.trim() : "row")));
      }
    });
    // decorative sort carets are not read by SR
    document.querySelectorAll(".th-sort .material-symbols-outlined").forEach(function(i){ i.setAttribute("aria-hidden","true"); });
    // give generic row-action buttons an entity-specific label + popup semantics
    var GEN=["more actions","actions","role actions","account actions","team actions"];
    function rowName(el){ if(!el) return ""; var sels=[".cell-with-thumb a",".cell-with-thumb span:last-child",".nm .n a",".nm .n",".n a",".n",".k"]; for(var i=0;i<sels.length;i++){ var e=el.querySelector(sels[i]); if(e && e.textContent.trim()) return e.textContent.trim(); } var td=el.querySelector("td:nth-child(2), td"); return td ? td.textContent.trim() : ""; }
    document.querySelectorAll(".icon-btn, .hs-btn--icon").forEach(function(b){
      var lbl=(b.getAttribute("aria-label")||"").trim().toLowerCase();
      if(GEN.indexOf(lbl)>=0){ var row=b.closest("tr")||b.closest(".ecard")||b.closest(".listrow"); var n=rowName(row); if(n) b.setAttribute("aria-label","Actions for "+n); b.setAttribute("aria-haspopup","menu"); b.setAttribute("aria-expanded","false"); }
    });
    // toggles behave as switches (settings pages ship them static; make them real)
    document.querySelectorAll(".hs-toggle").forEach(function(t){
      if(!t.getAttribute("role")) t.setAttribute("role","switch");
      if(!t.hasAttribute("tabindex")) t.setAttribute("tabindex","0");
      if(!t.hasAttribute("aria-checked")) t.setAttribute("aria-checked", t.classList.contains("is-on")?"true":"false");
    });
  }
  document.addEventListener("keydown", function(e){
    if(e.key!==" " && e.key!=="Enter") return;
    var c=e.target.closest && e.target.closest("table.hs-table .hs-check");
    if(c){ e.preventDefault(); c.click(); return; }
    var t=e.target.closest && e.target.closest(".hs-toggle");
    if(t && !t.hasAttribute("data-managed")){ e.preventDefault(); t.click(); }
  });
  document.addEventListener("click", function(e){
    var a=e.target.closest && e.target.closest("nav.tabs a");
    if(a){ setTimeout(function(){ var nav=a.closest("nav.tabs"); if(nav) nav.querySelectorAll("a").forEach(function(x){ x.setAttribute("aria-selected", x.classList.contains("on") ? "true" : "false"); }); },0); }
    var c=e.target.closest && e.target.closest("table.hs-table .hs-check");
    if(c){ setTimeout(function(){ c.setAttribute("aria-checked", c.classList.contains("is-on") ? "true" : "false"); },0); }
    // flip any toggle the page hasn't explicitly claimed (data-managed opts out)
    var t=e.target.closest && e.target.closest(".hs-toggle");
    if(t && !t.hasAttribute("data-managed")){ var on=t.classList.toggle("is-on"); t.setAttribute("aria-checked", on?"true":"false"); }
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", decorate);
  else decorate();
})();

/* ---- organizations: switcher + create + manage (global top-bar chrome).
   The ".orgsw" chip on every page was a dead control; this makes it a real
   workspace switcher. Self-contained (injects its own styles + modals) so it
   works on every page that loads app.js, without editing each file. ---- */
(function(){
  var K="ssv2";
  function load(){ try{return JSON.parse(localStorage.getItem(K))||{};}catch(e){return {};} }
  function persist(s){ try{localStorage.setItem(K,JSON.stringify(s));}catch(e){} }
  function ost(){ var s=load();
    if(!s.orgs) s.orgs=[{name:"Somos",role:"Super admin",plan:"Advanced",members:45,payer:true,def:true}];
    if(!s.currentOrg) s.currentOrg=(s.orgs[0]&&s.orgs[0].name)||"Somos";
    return s; }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){ return c==="&"?"&amp;":c==="<"?"&lt;":c===">"?"&gt;":"&quot;"; }); }
  function toast(m){ if(window.SSV2&&window.SSV2.toast) window.SSV2.toast(m); }
  function ini(n){ return (String(n||"").trim()[0]||"O").toUpperCase(); }
  function findOrg(s,name){ for(var i=0;i<s.orgs.length;i++) if(s.orgs[i].name===name) return s.orgs[i]; return null; }

  var css=
    ".ssv2-omenu{position:absolute;z-index:85;background:var(--bento-theme-color-bg-surface,#fff);border:1px solid var(--hs-border,#e3e6e8);border-radius:10px;box-shadow:0 10px 30px rgba(1,43,58,.18);min-width:264px;padding:6px;font:var(--hs-type-body-md,400 14px/1.4 Arial,sans-serif);color:var(--hs-fg,#1c1c1c)}"+
    ".ssv2-omenu button{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:0;padding:9px 10px;border-radius:8px;cursor:pointer;font:inherit;color:inherit}"+
    ".ssv2-omenu button:hover{background:var(--bento-system-sys-neutral-alt-100,#f2f4f5)}"+
    ".ssv2-omenu .oi{width:26px;height:26px;border-radius:6px;background:var(--bento-theme-color-bg-primary,#012b3a);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex:0 0 auto}"+
    ".ssv2-omenu .ck{margin-left:auto;color:var(--hs-action-primary,#1f60c9);font-size:18px}"+
    ".ssv2-omenu .sep{height:1px;background:var(--hs-border,#e3e6e8);margin:6px 4px}"+
    ".ssv2-omenu .mi .material-symbols-outlined{font-size:20px;color:var(--bento-theme-color-icon-subtle,#5a6a72)}"+
    ".ssv2-oovl{position:fixed;inset:0;background:var(--bento-theme-color-overlay-scrim,rgba(1,43,58,.32));display:none;align-items:flex-start;justify-content:center;padding:64px 16px;z-index:95}"+
    ".ssv2-oovl.open{display:flex}"+
    ".ssv2-om{width:560px;max-width:100%;background:var(--bento-theme-color-bg-surface,#fff);border-radius:14px;box-shadow:0 16px 44px rgba(1,43,58,.24);overflow:hidden;font:var(--hs-type-body-md,400 14px/1.45 Arial,sans-serif);color:var(--hs-fg,#1c1c1c)}"+
    ".ssv2-om.sm{width:440px}"+
    ".ssv2-om .mh{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--hs-border,#e3e6e8)}"+
    ".ssv2-om .mh h2{margin:0;font-size:18px;font-weight:700}"+
    ".ssv2-om .mb{padding:18px 20px;max-height:64vh;overflow:auto}"+
    ".ssv2-om .mf{display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--hs-border,#e3e6e8)}"+
    ".ssv2-om label{display:block;font-size:13px;font-weight:600;margin-bottom:6px}"+
    ".ssv2-in{width:100%;padding:10px 12px;border:1px solid var(--hs-border,#c9ced1);border-radius:8px;font:inherit;box-sizing:border-box}"+
    ".ssv2-om .err{color:#b3261e;font-size:12px;margin-top:6px}"+
    ".ssv2-orow{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--hs-border,#eef0f1)}"+
    ".ssv2-orow:last-of-type{border-bottom:0}"+
    ".ssv2-orow .oi{width:36px;height:36px;border-radius:8px;background:var(--bento-theme-color-bg-primary,#012b3a);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex:0 0 auto}"+
    ".ssv2-orow .meta{flex:1;min-width:0}.ssv2-orow .meta .n{font-weight:600}.ssv2-orow .meta .s{font-size:12px;color:var(--bento-theme-color-text-subtle,#5a6a72)}"+
    ".ssv2-orow .oact{display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end}"+
    ".ssv2-chip{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:var(--bento-system-sys-neutral-alt-100,#eef0f1);color:#3a4a52;margin-left:6px}"+
    ".ssv2-chip.cur{background:var(--bento-theme-color-bg-mint,#dfffde);color:#0a5f2c}";
  var styleEl=document.createElement("style"); styleEl.textContent=css; document.head.appendChild(styleEl);

  function paint(){ var name=ost().currentOrg;
    document.querySelectorAll(".orgsw").forEach(function(b){
      b.innerHTML='<span class="badge">'+esc(ini(name))+'</span>'+esc(name)+'<span class="material-symbols-outlined">expand_more</span>';
      b.setAttribute("aria-haspopup","menu"); }); }

  var menu=null;
  function closeMenu(){ if(menu&&menu.parentNode) menu.parentNode.removeChild(menu); menu=null; }
  function openMenu(anchor){ closeMenu(); var s=ost();
    menu=document.createElement("div"); menu.className="ssv2-omenu"; menu.setAttribute("role","menu");
    var h="";
    s.orgs.forEach(function(o){ h+='<button role="menuitem" data-sw="'+esc(o.name)+'"><span class="oi">'+esc(ini(o.name))+'</span>'+esc(o.name)+(o.name===s.currentOrg?'<span class="material-symbols-outlined ck">check</span>':'')+'</button>'; });
    h+='<div class="sep"></div>';
    h+='<button role="menuitem" class="mi" data-create="1"><span class="material-symbols-outlined">add</span>Create organization</button>';
    h+='<button role="menuitem" class="mi" data-manage="1"><span class="material-symbols-outlined">settings</span>Manage organizations</button>';
    menu.innerHTML=h; document.body.appendChild(menu);
    var r=anchor.getBoundingClientRect();
    menu.style.top=(r.bottom+6)+"px";
    menu.style.left=Math.max(8,Math.min(r.left,(window.innerWidth-menu.offsetWidth-8)))+"px"; }

  var nameOvl,nameIn,nameErr,nameGo,nameTitle,nameHint,nameMode="create",nameTarget=null;
  function buildNameModal(){
    nameOvl=document.createElement("div"); nameOvl.className="ssv2-oovl";
    nameOvl.innerHTML='<div class="ssv2-om sm" role="dialog" aria-modal="true" aria-label="Organization"><div class="mh"><h2 data-t>Create an organization</h2><button class="hs-btn hs-btn--ghost" data-x aria-label="Close" style="min-width:0;padding:6px"><span class="material-symbols-outlined">close</span></button></div><div class="mb"><label for="ssv2OrgName">Organization name</label><input id="ssv2OrgName" class="ssv2-in" type="text" placeholder="e.g. Somos EMEA" autocomplete="off"><p class="err" data-err hidden>Give the organization a name.</p><p data-hint style="font-size:13px;color:#5a6a72;margin-top:12px">You will be the Super admin of the new organization. It appears in your organization switcher once created.</p></div><div class="mf"><button class="hs-btn hs-btn--ghost" data-x>Cancel</button><button class="hs-btn hs-btn--primary" data-go disabled>Create organization</button></div></div>';
    document.body.appendChild(nameOvl);
    nameIn=nameOvl.querySelector("#ssv2OrgName"); nameErr=nameOvl.querySelector("[data-err]"); nameGo=nameOvl.querySelector("[data-go]"); nameTitle=nameOvl.querySelector("[data-t]"); nameHint=nameOvl.querySelector("[data-hint]");
    nameIn.addEventListener("input",function(){ nameGo.disabled=!nameIn.value.trim(); nameErr.hidden=true; });
    nameIn.addEventListener("keydown",function(e){ if(e.key==="Enter"&&!nameGo.disabled){e.preventDefault();nameSubmit();} else if(e.key==="Escape") closeName(); });
    nameOvl.addEventListener("mousedown",function(e){ if(e.target===nameOvl) closeName(); });
    nameOvl.querySelectorAll("[data-x]").forEach(function(b){ b.addEventListener("click",closeName); });
    nameGo.addEventListener("click",nameSubmit);
  }
  function openCreate(){ nameMode="create"; nameTarget=null; nameTitle.textContent="Create an organization"; nameGo.textContent="Create organization"; nameHint.style.display=""; nameIn.value=""; nameErr.hidden=true; nameGo.disabled=true; nameOvl.classList.add("open"); setTimeout(function(){nameIn.focus();},30); }
  function openRename(orgName){ nameMode="rename"; nameTarget=orgName; nameTitle.textContent="Rename organization"; nameGo.textContent="Save name"; nameHint.style.display="none"; nameIn.value=orgName; nameErr.hidden=true; nameGo.disabled=false; nameOvl.classList.add("open"); setTimeout(function(){nameIn.focus();nameIn.select();},30); }
  function closeName(){ nameOvl.classList.remove("open"); }
  function nameSubmit(){ var v=nameIn.value.trim(); if(!v){nameErr.hidden=false;return;} var s=ost();
    if(nameMode==="create"){ if(!findOrg(s,v)) s.orgs.push({name:v,role:"Super admin",plan:"Advanced",members:1,payer:true,def:false}); persist(s); closeName(); toast('Organization "'+v+'" created. Switch to it any time from the organization menu.'); }
    else { var o=findOrg(s,nameTarget); if(o){ var old=o.name; o.name=v; if(s.currentOrg===old) s.currentOrg=v; } persist(s); closeName(); paint(); toast('Organization renamed to "'+v+'".'); }
    renderManage(); }

  var mgOvl,mgBody;
  function buildManageModal(){
    mgOvl=document.createElement("div"); mgOvl.className="ssv2-oovl";
    mgOvl.innerHTML='<div class="ssv2-om" role="dialog" aria-modal="true" aria-label="Manage organizations"><div class="mh"><h2>Your organizations</h2><button class="hs-btn hs-btn--ghost" data-x aria-label="Close" style="min-width:0;padding:6px"><span class="material-symbols-outlined">close</span></button></div><div class="mb" data-body></div><div class="mf"><button class="hs-btn hs-btn--secondary" data-create><span class="material-symbols-outlined">add</span>Create organization</button><button class="hs-btn hs-btn--primary" data-x>Done</button></div></div>';
    document.body.appendChild(mgOvl);
    mgBody=mgOvl.querySelector("[data-body]");
    mgOvl.addEventListener("mousedown",function(e){ if(e.target===mgOvl) mgOvl.classList.remove("open"); });
    mgOvl.querySelectorAll("[data-x]").forEach(function(b){ b.addEventListener("click",function(){ mgOvl.classList.remove("open"); }); });
    mgOvl.querySelector("[data-create]").addEventListener("click",function(){ openCreate(); });
    mgBody.addEventListener("click",function(e){ var b=e.target.closest("button[data-act]"); if(!b) return; orgAction(b.getAttribute("data-act"),b.getAttribute("data-org")); });
  }
  function openManage(){ renderManage(); mgOvl.classList.add("open"); }
  function renderManage(){ if(!mgBody) return; var s=ost(); var h="";
    s.orgs.forEach(function(o){ var cur=o.name===s.currentOrg;
      h+='<div class="ssv2-orow"><span class="oi">'+esc(ini(o.name))+'</span><div class="meta"><div class="n">'+esc(o.name)+(o.def?'<span class="ssv2-chip">Default</span>':'')+(cur?'<span class="ssv2-chip cur">Current</span>':'')+'</div><div class="s">'+esc(o.role)+' &middot; '+esc(o.plan)+' plan &middot; '+o.members+' member'+(o.members===1?'':'s')+(o.payer?' &middot; billing owner':'')+'</div></div><div class="oact">';
      if(!cur) h+='<button class="hs-btn hs-btn--ghost hs-btn--sm" data-act="switch" data-org="'+esc(o.name)+'">Switch</button>';
      if(!o.def) h+='<button class="hs-btn hs-btn--ghost hs-btn--sm" data-act="default" data-org="'+esc(o.name)+'">Set default</button>';
      h+='<button class="hs-btn hs-btn--ghost hs-btn--sm" data-act="rename" data-org="'+esc(o.name)+'">Rename</button>';
      if(o.payer) h+='<button class="hs-btn hs-btn--outlined hs-btn--sm" data-act="delete" data-org="'+esc(o.name)+'">Delete</button>';
      else h+='<button class="hs-btn hs-btn--outlined hs-btn--sm" data-act="leave" data-org="'+esc(o.name)+'">Leave</button>';
      h+='</div></div>'; });
    h+='<p style="font-size:12px;color:#5a6a72;margin-top:14px">As the billing owner you cannot leave an organization; transfer billing or delete it instead. Only the billing owner can delete an organization, and you must belong to at least one.</p>';
    mgBody.innerHTML=h; }
  function orgAction(act,name){ var s=ost(),o=findOrg(s,name); if(!o) return;
    if(act==="switch"){ s.currentOrg=name; persist(s); paint(); renderManage(); toast("Switched to "+name+"."); }
    else if(act==="default"){ s.orgs.forEach(function(x){x.def=(x.name===name);}); persist(s); renderManage(); toast(name+" is now your default organization."); }
    else if(act==="rename"){ openRename(name); }
    else if(act==="delete"){ orgConfirm("delete",name); }
    else if(act==="leave"){ orgConfirm("leave",name); } }

  var cfOvl,cfMsg,cfGo,cfTitle,cfAct,cfOrg;
  function buildConfirm(){
    cfOvl=document.createElement("div"); cfOvl.className="ssv2-oovl";
    cfOvl.innerHTML='<div class="ssv2-om sm" role="dialog" aria-modal="true"><div class="mh"><h2 data-t>Confirm</h2><button class="hs-btn hs-btn--ghost" data-x aria-label="Close" style="min-width:0;padding:6px"><span class="material-symbols-outlined">close</span></button></div><div class="mb"><p data-msg></p></div><div class="mf"><button class="hs-btn hs-btn--ghost" data-x>Cancel</button><button class="hs-btn hs-btn--outlined" data-go>Confirm</button></div></div>';
    document.body.appendChild(cfOvl);
    cfMsg=cfOvl.querySelector("[data-msg]"); cfGo=cfOvl.querySelector("[data-go]"); cfTitle=cfOvl.querySelector("[data-t]");
    cfOvl.addEventListener("mousedown",function(e){ if(e.target===cfOvl) cfOvl.classList.remove("open"); });
    cfOvl.querySelectorAll("[data-x]").forEach(function(b){ b.addEventListener("click",function(){cfOvl.classList.remove("open");}); });
    cfGo.addEventListener("click",doConfirm); }
  function orgConfirm(act,name){ cfAct=act; cfOrg=name;
    if(act==="delete"){ cfTitle.textContent="Delete "+name+"?"; cfMsg.textContent="This permanently removes "+name+", all its teams, and its connected accounts. This cannot be undone."; cfGo.textContent="Delete organization"; }
    else { cfTitle.textContent="Leave "+name+"?"; cfMsg.textContent="You will lose access to "+name+" and its content."; cfGo.textContent="Leave organization"; }
    cfOvl.classList.add("open"); }
  function doConfirm(){ var s=ost();
    if(s.orgs.length<=1){ cfOvl.classList.remove("open"); toast("You must belong to at least one organization."); return; }
    var idx=-1; for(var i=0;i<s.orgs.length;i++) if(s.orgs[i].name===cfOrg) idx=i;
    if(idx<0){ cfOvl.classList.remove("open"); return; }
    var wasCurrent=s.currentOrg===cfOrg, wasDefault=s.orgs[idx].def;
    s.orgs.splice(idx,1);
    if(wasCurrent) s.currentOrg=s.orgs[0].name;
    if(wasDefault && s.orgs.length) s.orgs[0].def=true;
    persist(s); paint(); renderManage(); cfOvl.classList.remove("open");
    toast(cfAct==="delete"?('"'+cfOrg+'" deleted.'):('You left "'+cfOrg+'".')); }

  document.addEventListener("click",function(e){
    var sw=e.target.closest && e.target.closest(".orgsw");
    if(sw){ e.preventDefault(); e.stopPropagation(); if(menu) closeMenu(); else openMenu(sw); return; }
    if(menu){ var it=e.target.closest && e.target.closest(".ssv2-omenu button");
      if(it){ if(it.getAttribute("data-create")){ closeMenu(); openCreate(); }
        else if(it.getAttribute("data-manage")){ closeMenu(); openManage(); }
        else if(it.getAttribute("data-sw")){ var nm=it.getAttribute("data-sw"),s=ost(); s.currentOrg=nm; persist(s); paint(); closeMenu(); toast("Switched to "+nm+"."); }
        return; }
      closeMenu(); } });
  document.addEventListener("keydown",function(e){ if(e.key==="Escape") closeMenu(); });

  function boot(){ buildNameModal(); buildManageModal(); buildConfirm(); paint(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot); else boot();
})();
