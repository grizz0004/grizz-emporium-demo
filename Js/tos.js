// Js/tos.js — Terms of Service page with collapsible sections
window.App = window.App || {};

document.addEventListener('DOMContentLoaded', () => {
  // Update cart pill on every page load
  window.App.cart?.updatePill?.();

  // Attach cart button click (every page)
  const cartBtn = document.getElementById('cartPill');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      if (window.App.checkout && window.App.checkout.openCart) {
        window.App.checkout.openCart();
      }
    });
  }

  // Handle collapsible sections
  const headers = document.querySelectorAll('.terms-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const section = header.dataset.section;
      const content = document.getElementById(section);

      if (!content) return;

      // Toggle active class on header
      header.classList.toggle('active');

      // Toggle active class on content
      content.classList.toggle('active');

      // Close other sections (optional - make them accordion style)
      // Uncomment the code below if you want only one section open at a time
      /*
      headers.forEach(otherHeader => {
        if (otherHeader !== header) {
          otherHeader.classList.remove('active');
          const otherSection = document.getElementById(otherHeader.dataset.section);
          if (otherSection) {
            otherSection.classList.remove('active');
          }
        }
      });
      */
    });
  });
});
