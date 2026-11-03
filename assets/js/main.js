/* Nikko Homecare — site scripts */
(function () {
  'use strict';

  /* ---- Site settings: edit these ---- */
  var CONFIG = {
    // Paste your Formspree form ID (https://formspree.io) to receive form submissions by email.
    // While empty, forms open the visitor's email app with the message filled in.
    formEndpoint: '',
    email: 'care@nikkohomecare.co.ke',
    // Add your social media profile links. Empty links stay hidden.
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
    if (url) { a.href = url; a.hidden = false; }
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
  function loadMaps() {
    d.querySelectorAll('[data-map]').forEach(function (box) {
      if (box.querySelector('iframe')) return;
      var f = d.createElement('iframe');
      f.src = box.getAttribute('data-map');
      f.title = 'Map showing Nikko Homecare on Nandi Road, Karen';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.allowFullscreen = true;
      box.appendChild(f);
      var ph = box.querySelector('.map__placeholder');
      if (ph) ph.hidden = true;
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
    function say(msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form__status ' + (ok ? 'is-ok' : 'is-err');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      if (data.get('_gotcha')) return;
      var subject = form.getAttribute('data-subject') || 'Website enquiry';
      if (!CONFIG.formEndpoint) {
        var lines = [];
        data.forEach(function (v, k) { if (k.charAt(0) !== '_' && v) lines.push(k + ': ' + v); });
        window.location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
        say('Your email app should now open with your message. If it does not, call us on +254 726 440 428.', true);
        return;
      }
      data.append('_subject', subject);
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      fetch('https://formspree.io/f/' + CONFIG.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) { form.reset(); say('Thank you. A member of our team will call you back shortly.', true); }
          else { say('Sorry, something went wrong. Please call us on +254 726 440 428.', false); }
        })
        .catch(function () { say('Sorry, something went wrong. Please call us on +254 726 440 428.', false); })
        .then(function () { if (btn) btn.disabled = false; });
    });
  });
})();
