// Suite Settings prototype — lightweight clickable interactions (visual only).
(function () {
  function exclusiveRadio(rad) {
    var scope = rad.closest('.hs-field') || rad.closest('.grid2') || document;
    scope.querySelectorAll('.hs-radio').forEach(function (x) { x.classList.remove('is-on'); });
    rad.classList.add('is-on');
  }

  document.addEventListener('click', function (e) {
    // Accordion: toggle open/closed on header click
    var head = e.target.closest('.acc-head');
    if (head) {
      var item = head.closest('.acc-item');
      if (item && !item.classList.contains('disabled')) {
        var open = item.classList.toggle('open');
        var chev = head.querySelector('.chevron');
        if (chev) chev.textContent = open ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
      }
      return;
    }

    // Close overlays by clicking the dim scrim
    if (e.target.classList && e.target.classList.contains('scrim')) {
      var fly = document.querySelector('.flyout');
      if (fly) { document.querySelectorAll('.scrim, .flyout').forEach(function (n) { n.remove(); }); return; }
      if (document.querySelector('.modal')) { window.location.href = 's6-org-overview.html'; return; }
    }

    // Resolve a form control from the click target or its wrapping label
    var label = e.target.closest('label');
    var tog = e.target.closest('.hs-toggle');
    var chk = e.target.closest('.hs-check');
    var rad = e.target.closest('.hs-radio');
    if (label) {
      tog = tog || label.querySelector('.hs-toggle');
      chk = chk || label.querySelector('.hs-check');
      rad = rad || label.querySelector('.hs-radio');
    }
    if (rad) { e.preventDefault(); exclusiveRadio(rad); return; }
    if (chk) { e.preventDefault(); chk.classList.toggle('is-on'); return; }
    if (tog) { e.preventDefault(); tog.classList.toggle('is-on'); return; }

    // Search "clear" affix buttons just clear their input
    var clr = e.target.closest('.hs-input .clr');
    if (clr) {
      var input = clr.parentElement.querySelector('input');
      if (input && !input.readOnly) { e.preventDefault(); input.value = ''; input.focus(); }
    }
  });

  // Esc closes any open overlay
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var fly = document.querySelector('.flyout');
    if (fly) { document.querySelectorAll('.scrim, .flyout').forEach(function (n) { n.remove(); }); }
    else if (document.querySelector('.modal')) { window.location.href = 's6-org-overview.html'; }
  });
})();
