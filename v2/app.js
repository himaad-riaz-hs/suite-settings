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
    aisha:   { name: "Aisha Patel",  email: "aisha@somos.co",   initials: "AP", role: "Admin",       status: "Pending" },
    devin:   { name: "Devin Okafor", email: "devin@somos.co",   initials: "DO", role: "Editor",      status: "Active"  },
    priya:   { name: "Priya Anand",  email: "priya@somos.co",   initials: "PA", role: "Editor",      status: "Active"  },
    marco:   { name: "Marco Silva",  email: "marco@somos.co",   initials: "MS", role: "Admin",       status: "Active"  },
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
             status: base.status, role: role, scope: scope };
  }
  function setPerson(id, role, scope) {
    var state = getState();
    state.overrides[id] = { role: role, scope: scope };
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
      var roleSpan = card.querySelector(".foot > span:first-child");
      if (roleSpan && p) roleSpan.textContent = p.role;
    });

    var rows = document.querySelectorAll("#tableView tbody tr[data-pid]");
    rows.forEach(function (tr) {
      var id = tr.getAttribute("data-pid");
      var p = getPerson(state, id);
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
  function boot() {
    initPersonDetail();
    initPeopleList();
    initRoles();
    initAccountTabs();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
