(function () {
  'use strict';

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyCSjWkmKSzR5AKyRZyGi7H2Ak895l4DfjG8lOFvBCTktV20endrwWbV3QhnuSLlp4zqA/exec';
  const CALENDLY_URL = 'https://calendly.com/nilevaservices/30min';
  const form = document.getElementById('booking-form');
  const nameInput = document.getElementById('prefill-name');
  const emailInput = document.getElementById('prefill-email');
  const submitButton = document.getElementById('load-calendly');
  const formStatus = document.getElementById('form-status');
  let statusTimer;

  function showStatus(message, type) {
    if (!formStatus) return;
    window.clearTimeout(statusTimer);
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    statusTimer = window.setTimeout(() => {
      formStatus.className = 'form-status';
      formStatus.textContent = '';
    }, 8000);
  }

  function setSubmitting(isSubmitting) {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.textContent = isSubmitting ? 'OPENING BOOKING…' : 'BOOK NOW';
  }

  function openBooking(name, email) {
    const url = new URL(CALENDLY_URL);
    url.searchParams.set('name', name);
    url.searchParams.set('email', email);
    return window.open(url.toString(), '_blank', 'noopener,noreferrer');
  }

  async function sendLead(data) {
    // Apps Script can read this JSON from e.postData.contents. no-cors is used
    // because Apps Script web apps do not reliably return CORS headers.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(data)
    });
  }

  function configureMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('navLinks');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  function configureFaq() {
    document.querySelectorAll('.faq-question').forEach(button => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const willOpen = !item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(faqItem => {
          faqItem.classList.remove('active');
          faqItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          faqItem.querySelector('.faq-answer').hidden = true;
        });
        if (willOpen) {
          item.classList.add('active');
          button.setAttribute('aria-expanded', 'true');
          item.querySelector('.faq-answer').hidden = false;
        }
      });
    });
  }

  function configureTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('.service-card, .support-item, .stat-card, .testimonial-card, .booking-form').forEach(element => {
      element.addEventListener('pointermove', event => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--tilt-x', `${((rect.top + rect.height / 2 - event.clientY) / rect.height) * 8}deg`);
        element.style.setProperty('--tilt-y', `${((event.clientX - rect.left - rect.width / 2) / rect.width) * 8}deg`);
        element.classList.add('is-tilting');
      });
      element.addEventListener('pointerleave', () => element.classList.remove('is-tilting'));
    });
  }

  if (form && nameInput && emailInput) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      if (!name) {
        showStatus('Please enter your name to continue.', 'error');
        nameInput.focus();
        return;
      }
      setSubmitting(true);
      const bookingWindow = openBooking(name, email);
      if (!bookingWindow) showStatus('Your browser blocked the booking tab. Please allow pop-ups and try again.', 'error');
      try {
        await sendLead({ name, email, timestamp: new Date().toISOString(), source: 'NILE VA Services website' });
        // An opaque no-cors response cannot prove that the Apps Script added a row.
        showStatus(bookingWindow ? 'Your booking page is open. We sent your inquiry to our booking team.' : 'We sent your inquiry to our booking team.', 'success');
        form.reset();
      } catch (error) {
        showStatus(bookingWindow ? 'Your booking page is open, but we could not send your inquiry. Please email info@nile-va.com.' : 'We could not send your inquiry. Please email info@nile-va.com.', 'error');
      } finally {
        setSubmitting(false);
      }
    });
  }

  configureMenu();
  configureFaq();
  configureTilt();
}());
