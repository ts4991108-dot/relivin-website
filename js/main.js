(function () {
  'use strict';

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var nav = document.querySelector('.nav');
  var navToggle = document.getElementById('navToggle');
  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.querySelectorAll('.mobile-menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Waitlist forms -> Supabase REST insert
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setStatus(el, message, state) {
    if (!el) return;
    el.textContent = message;
    if (state) {
      el.setAttribute('data-state', state);
    } else {
      el.removeAttribute('data-state');
    }
  }

  async function submitToWaitlist(email) {
    var config = window.RELIVIN_CONFIG;
    if (!config || !config.supabaseUrl || !config.supabaseAnonKey) {
      throw new Error('Waitlist is not configured yet.');
    }

    var response = await fetch(config.supabaseUrl + '/rest/v1/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.supabaseAnonKey,
        Authorization: 'Bearer ' + config.supabaseAnonKey,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ email: email }),
    });

    if (response.ok) return { ok: true };

    if (response.status === 409) {
      return { ok: true, alreadyJoined: true };
    }

    try {
      var data = await response.json();
      console.error('Waitlist signup failed:', data);
    } catch (e) {
      console.error('Waitlist signup failed:', response.status);
    }
    throw new Error('Something went wrong. Please try again in a moment.');
  }

  function wireWaitlistForm(formId, statusId) {
    var form = document.getElementById(formId);
    var statusEl = document.getElementById(statusId);
    if (!form) return;

    var button = form.querySelector('button[type="submit"]');
    var input = form.querySelector('input[type="email"]');

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var email = (input.value || '').trim();

      if (!isValidEmail(email)) {
        setStatus(statusEl, 'Please enter a valid email address.', 'error');
        input.focus();
        return;
      }

      button.classList.add('is-loading');
      setStatus(statusEl, '', null);

      try {
        var result = await submitToWaitlist(email);
        input.value = '';
        setStatus(
          statusEl,
          result.alreadyJoined ? "You're already on the list!" : "You're on the list! We'll be in touch.",
          'success'
        );
      } catch (err) {
        setStatus(statusEl, err.message || 'Something went wrong. Please try again.', 'error');
      } finally {
        button.classList.remove('is-loading');
      }
    });
  }

  wireWaitlistForm('heroForm', 'heroStatus');
  wireWaitlistForm('ctaForm', 'ctaStatus');
})();
