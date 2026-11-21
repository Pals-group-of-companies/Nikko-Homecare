/* Nikko Homecare — site scripts */
(function () {
  'use strict';

  /* ---- Site settings: edit these ---- */
  var CONFIG = {
    // Form submissions are emailed to this inbox through FormSubmit (formsubmit.co).
    // The first submission sends an "Activate Form" email to this inbox: click it once.
    // Set formService to '' to fall back to opening the visitor's email app instead.
    formService: 'https://formsubmit.co/ajax/',
    email: 'care@nikkohomecare.co.ke',
    // Paste your exact social media profile links here; empty ones keep the default link.
    social: {
      facebook: '',
      instagram: '',
      x: '',
      tiktok: 'https://www.tiktok.com/@nikko.homecare'
    }
  };

  var d = document;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Year */
  d.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Social links */
  d.querySelectorAll('[data-social]').forEach(function (a) {
    var url = CONFIG.social[a.getAttribute('data-social')];
    if (url) { a.href = url; }
  });

  /* Mobile menu */
  var menu = d.getElementById('mobile-menu');
  var openBtn = d.querySelector('[data-menu-open]');
  var closeBtn = d.querySelector('[data-menu-close]');
  function setMenu(open, restoreFocus) {
    if (!menu) return;
    menu.hidden = !open;
    d.body.classList.toggle('menu-open', open);
    if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
    if (open && closeBtn) closeBtn.focus();
    if (!open && restoreFocus && openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false, true); });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false, true);
  });
  if (window.matchMedia) {
    var wide = window.matchMedia('(min-width: 981px)');
    var onWide = function (e) { if (e.matches && menu && !menu.hidden) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide); else if (wide.addListener) wide.addListener(onWide);
  }

  /* Cookie consent */
  var KEY = 'nk-cookie-consent';
  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  var banner = d.getElementById('cookie-banner');
  /* Google Maps loads only after consent ("Accept all") or when the visitor taps "Show map" */
  function loadMaps() {
    d.querySelectorAll('[data-map-src]').forEach(function (ph) {
      var frame = ph.parentNode;
      if (!frame || frame.querySelector('iframe')) return;
      var f = d.createElement('iframe');
      f.src = ph.getAttribute('data-map-src');
      f.title = 'Map showing Nikko Homecare on Nandi Road, Karen, Nairobi';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.allowFullscreen = true;
      frame.appendChild(f);
      ph.hidden = true;
    });
  }
  if (banner && !getConsent()) banner.hidden = false;
  if (getConsent() === 'all') loadMaps();
  d.querySelectorAll('[data-consent]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-consent');
      setConsent(v);
      if (banner) banner.hidden = true;
      if (v === 'all') loadMaps();
    });
  });
  d.querySelectorAll('[data-cookie-settings]').forEach(function (b) {
    b.addEventListener('click', function () { if (banner) { banner.hidden = false; var f = banner.querySelector('button'); if (f) f.focus(); } });
  });
  d.querySelectorAll('[data-load-map]').forEach(function (b) { b.addEventListener('click', loadMaps); });

  /* Count-up stats */
  var counters = d.querySelectorAll('[data-count]');
  function runCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduceMotion) { el.textContent = target.toLocaleString('en-US'); return; }
    var t0 = null;
    function step(now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / 1800);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      counters.forEach(function (el) { el.textContent = '0'; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); io.unobserve(en.target); } });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { io.observe(el); });
    }
  }

  /* Tabs */
  d.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = d.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var n = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
          select(tabs[n], true);
        }
      });
    });
    var start = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
    if (start) select(start);
  });

  /* Forms */
  d.querySelectorAll('form[data-form]').forEach(function (form) {
    var status = form.querySelector('.form__status');
    var btn = form.querySelector('button[type="submit"]');
    var busy = false;
    function say(msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form__status ' + (ok ? 'is-ok' : 'is-err');
    }
    var FAIL = 'Sorry, your message could not be sent. Please call or WhatsApp us on +254 726 440 428.';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      if (data.get('_gotcha')) return;
      var subject = form.getAttribute('data-subject') || 'Website enquiry';
      var fields = {};
      data.forEach(function (v, k) {
        if (k.charAt(0) === '_') return;
        v = String(v).trim();
        if (v) fields[k] = v.slice(0, 3000);
      });
      if (!fields['Email updates']) fields['Email updates'] = 'No';
      busy = true;
      if (btn) btn.disabled = true;
      if (!CONFIG.formService) {
        var lines = Object.keys(fields).map(function (k) { return k + ': ' + fields[k]; });
        window.location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
        say('Your email app should now open with your message. If it does not, call us on +254 726 440 428.', true);
        setTimeout(function () { busy = false; if (btn) btn.disabled = false; }, 3000);
        return;
      }
      fields._subject = subject;
      fields._template = 'table';
      fields._captcha = 'false';
      say('Sending…', true);
      fetch(CONFIG.formService + encodeURIComponent(CONFIG.email), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(fields)
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok && String(res.j.success) === 'true') {
            form.reset();
            say('Thank you. A member of our team will call you back shortly.', true);
          } else {
            say(FAIL, false);
          }
        })
        .catch(function () { say(FAIL, false); })
        .then(function () { busy = false; if (btn) btn.disabled = false; });
    });
  });
})();

/* Floating navbar: stronger shadow once the page scrolls */
(function () {
  'use strict';
  var header = document.querySelector('.site-header');
  if (!header) return;
  var ticking = false;
  function update() { header.classList.toggle('is-scrolled', window.scrollY > 8); ticking = false; }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
