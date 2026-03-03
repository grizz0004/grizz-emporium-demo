window.App = window.App || {};

(() => {
  const KEY = "grizz_cart_v1";
  let cart = [];

  function load() {
    try {
      const raw = sessionStorage.getItem(KEY);
      cart = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }
  }

  function save() {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(cart));
    } catch {}
    window.dispatchEvent(new CustomEvent("cart:changed"));
  }

  load();

  window.App.cart = {
    get items() { return cart; },

    updatePill() {
      const pill = document.getElementById("cartPill");
      if (pill) pill.textContent = `Cart (${cart.length})`;
    },

    add(item) {
      cart.push(item);
      save();
      this.updatePill();
      window.App.toast?.(`Added: ${item.brand} — ${item.option}`);
    },

    remove(index) {
      cart.splice(index, 1);
      save();
      this.updatePill();
    },

    clear() {
      cart = [];
      save();
      this.updatePill();
    },

    total() {
      return cart.reduce((sum, it) => sum + (Number(it.price) || 0), 0);
    },
  };

  // Update cart pill automatically when cart changes (on any page)
  window.addEventListener("cart:changed", () => window.App.cart.updatePill());

  // Also update pill on initial load
  document.addEventListener("DOMContentLoaded", () => window.App.cart.updatePill());
})();