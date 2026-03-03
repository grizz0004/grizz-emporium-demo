window.App = window.App || {};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const statusText = document.getElementById('supportStatusText');
  const waitText = document.getElementById('supportWaitText');

  function rotateStatus() {
    if (!statusText || !waitText) return;

    const statuses = [
      { label: 'Support Status: Online', wait: 'Average wait: 5–10 minutes' },
      { label: 'Support Status: Busy', wait: 'Average wait: 10–20 minutes' },
      { label: 'Support Status: Online', wait: 'Average wait: usually within 15 minutes' },
    ];

    const next = statuses[Math.floor(Math.random() * statuses.length)];
    statusText.textContent = next.label;
    waitText.textContent = next.wait;
  }

  rotateStatus();
  setInterval(rotateStatus, 15000);

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('contactName')?.value.trim() || '';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const message = document.getElementById('contactMessage')?.value.trim() || '';

    if (!name) {
      window.App.toast?.('Please enter your name.');
      return;
    }

    if (!window.App.isValidEmail || !window.App.isValidEmail(email)) {
      window.App.toast?.('Please enter a valid email address.');
      return;
    }

    if (!message || message.length < 10) {
      window.App.toast?.('Please write a message with at least 10 characters.');
      return;
    }

    window.App.toast?.('Message received. Support will contact you soon ✅');
    form.reset();
  });
});
