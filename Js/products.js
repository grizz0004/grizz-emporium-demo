// Js/products.js — Products page only (opens subscription list + adds items to cart)
window.App = window.App || {};

document.addEventListener("DOMContentLoaded", () => {
  if (!window.App.modal || !window.App.modal.init) {
    console.error("modal.js missing");
    return;
  }
  if (!window.App.__modalReady) {
    const ok = window.App.modal.init();
    window.App.__modalReady = !!ok;
  }

  window.App.cart?.updatePill?.();

  const LOGO_BASE = "../Assets/logos/";
  const SUBS = window.App.SUBSCRIPTIONS_SORTED || window.App.SUBSCRIPTIONS || [];
  const GAMES = window.App.GAMES || [];
  const SERVICES = window.App.SERVICES || [];
  let modalContext = null; // 'subscriptions' | 'games' | 'services'

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function getSearchText(item) {
    const optionsText = (item.options || [])
      .map(opt => {
        const suboptionsText = (opt.suboptions || []).map(sub => sub.option).join(" ");
        return `${opt.option} ${suboptionsText}`;
      })
      .join(" ");
    return normalizeText(`${item.brand} ${optionsText}`);
  }

  function findProductMatch(query) {
    const needle = normalizeText(query);
    if (!needle) return null;

    const buckets = [
      { category: "subscriptions", items: SUBS },
      { category: "games", items: GAMES },
      { category: "services", items: SERVICES },
    ];

    for (const bucket of buckets) {
      const exactIndex = bucket.items.findIndex(item => normalizeText(item.brand) === needle);
      if (exactIndex >= 0) return { category: bucket.category, index: exactIndex };
    }

    for (const bucket of buckets) {
      const partialIndex = bucket.items.findIndex(item => getSearchText(item).includes(needle));
      if (partialIndex >= 0) return { category: bucket.category, index: partialIndex };
    }

    return null;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderBrandRow(item, index) {
    const logoPath = item.logo ? `${LOGO_BASE}${item.logo}` : "";
    return `
      <button class="brand-row" type="button" data-action="open-brand" data-brand-index="${index}">
        ${
          logoPath
            ? `<img class="brand-logo" src="${logoPath}" alt="${item.brand} logo"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';" />`
            : ""
        }
        <div class="brand-fallback" aria-hidden="true">${item.brand.trim().charAt(0)}</div>
        <div class="brand-name">${item.brand}</div>
        <div class="brand-arrow">→</div>
      </button>
    `;
  }

  function renderOptionCard(opt, brandIndex, optIndex) {
    const disabled = opt.disabled ? "is-disabled" : "";
    const hasSubOptions = opt.suboptions && opt.suboptions.length > 0;
    const priceText = opt.disabled ? "" : hasSubOptions ? "" : `${Number(opt.price).toFixed(2)} €`;
    return `
      <div class="option-card ${disabled}">
        <div class="option-title">${opt.option}</div>
        <div class="option-note">${opt.disabled ? "Available soon" : "Demo item"}</div>
        <div class="option-footer">
          <div class="option-price">${priceText}</div>
          <button class="option-buy" type="button"
            data-action="${hasSubOptions ? "show-suboptions" : "add"}"
            data-brand-index="${brandIndex}"
            data-opt-index="${optIndex}"
            ${opt.disabled ? "disabled" : ""}>
            ${hasSubOptions ? "Choose Duration" : "Add"}
          </button>
        </div>
      </div>
    `;
  }

  function showBrandList() {
    window.App.modal.setTitle("Subscriptions");
    window.App.modal.resetBack();
    modalContext = 'subscriptions';

    if (!SUBS.length) {
      window.App.modal.setBody(`<div class="coming-soon">No subscription data found.</div>`);
      window.App.modal.open();
      return;
    }

    window.App.modal.setBody(`
      <div class="list">
        ${SUBS.map((item, i) => renderBrandRow(item, i)).join("")}
      </div>
    `);
    window.App.modal.open();
  }

  function showOptions(brandIndex) {
    const item = SUBS[brandIndex];
    if (!item) return;
    modalContext = 'subscriptions';

    window.App.modal.setTitle(item.brand);
    window.App.modal.showBack();
    window.App.modal.pushBack(showBrandList);

    window.App.modal.setBody(`
      <div class="options-grid">
        ${item.options.map((opt, j) => renderOptionCard(opt, brandIndex, j)).join("")}
      </div>
    `);
    window.App.modal.open();
  }

  function renderSubOptionCard(subopt, brandIndex, optIndex, suboptIndex) {
    return `
      <div class="option-card">
        <div class="option-title">${subopt.option}</div>
        <div class="option-note">Demo item</div>
        <div class="option-footer">
          <div class="option-price">${Number(subopt.price).toFixed(2)} €</div>
          <button class="option-buy" type="button"
            data-action="add-suboption"
            data-brand-index="${brandIndex}"
            data-opt-index="${optIndex}"
            data-subopt-index="${suboptIndex}">
            Add
          </button>
        </div>
      </div>
    `;
  }

  function showSubOptions(brandIndex, optIndex) {
    const item = SUBS[brandIndex];
    const opt = item?.options?.[optIndex];
    if (!item || !opt || !opt.suboptions) return;

    window.App.modal.setTitle(`${item.brand} — ${opt.option}`);
    window.App.modal.showBack();
    window.App.modal.pushBack(() => showOptions(brandIndex));

    window.App.modal.setBody(`
      <div class="options-grid">
        ${opt.suboptions.map((subopt, k) => renderSubOptionCard(subopt, brandIndex, optIndex, k)).join("")}
      </div>
    `);
    window.App.modal.open();
  }

  function showGamesList() {
    window.App.modal.setTitle("Games");
    window.App.modal.resetBack();
    modalContext = 'games';

    if (!GAMES.length) {
      window.App.modal.setBody(`<div class="coming-soon">No game data found.</div>`);
      window.App.modal.open();
      return;
    }

    window.App.modal.setBody(`
      <div class="list">
        ${GAMES.map((item, i) => renderBrandRow(item, i)).join("")}
      </div>
    `);
    window.App.modal.open();
  }

  function showGameOptions(brandIndex) {
    const item = GAMES[brandIndex];
    if (!item) return;
    modalContext = 'games';

    window.App.modal.setTitle(item.brand);
    window.App.modal.showBack();
    window.App.modal.pushBack(showGamesList);

    window.App.modal.setBody(`
      <div class="options-grid">
        ${item.options.map((opt, j) => renderOptionCard(opt, brandIndex, j)).join("")}
      </div>
    `);
    window.App.modal.open();
  }

  function showServicesList() {
    window.App.modal.setTitle("Services");
    window.App.modal.resetBack();
    modalContext = 'services';

    if (!SERVICES.length) {
      window.App.modal.setBody(`<div class="coming-soon">No service data found.</div>`);
      window.App.modal.open();
      return;
    }

    window.App.modal.setBody(`
      <div class="list">
        ${SERVICES.map((item, i) => renderBrandRow(item, i)).join("")}
      </div>
    `);
    window.App.modal.open();
  }

  function showServiceOptions(brandIndex) {
    const item = SERVICES[brandIndex];
    if (!item) return;
    modalContext = 'services';

    window.App.modal.setTitle(item.brand);
    window.App.modal.showBack();
    window.App.modal.pushBack(showServicesList);

    window.App.modal.setBody(`
      <div class="options-grid">
        ${item.options.map((opt, j) => renderOptionCard(opt, brandIndex, j)).join("")}
      </div>
    `);
    window.App.modal.open();
  }

  function showServiceSubOptions(brandIndex, optIndex) {
    const item = SERVICES[brandIndex];
    const opt = item?.options?.[optIndex];
    if (!item || !opt || !opt.suboptions) return;

    window.App.modal.setTitle(`${item.brand} — ${opt.option}`);
    window.App.modal.showBack();
    window.App.modal.pushBack(() => showServiceOptions(brandIndex));

    window.App.modal.setBody(`
      <div class="options-grid">
        ${opt.suboptions.map((subopt, k) => renderSubOptionCard(subopt, brandIndex, optIndex, k)).join("")}
      </div>
    `);
    window.App.modal.open();
  }

  // category buttons
  document.querySelectorAll(".category-card").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.category;
      if (cat === "subscriptions") return showBrandList();
      if (cat === "games") return showGamesList();      if (cat === "services") return showServicesList();
      window.App.modal.setTitle("Coming soon");
      window.App.modal.resetBack();
      window.App.modal.setBody(`<div class="coming-soon">We’ll add ${cat} after subscriptions ✅</div>`);
      window.App.modal.open();
    });
  });

  const searchQuery = new URLSearchParams(window.location.search).get("q") || "";
  if (searchQuery.trim()) {
    const match = findProductMatch(searchQuery);
    if (match?.category === "subscriptions") {
      showOptions(match.index);
    } else if (match?.category === "games") {
      showGameOptions(match.index);
    } else if (match?.category === "services") {
      showServiceOptions(match.index);
    } else {
      window.App.modal.setTitle("No results");
      window.App.modal.resetBack();
      window.App.modal.setBody(`<div class="coming-soon">No product found for "${escapeHtml(searchQuery)}".</div>`);
      window.App.modal.open();
    }
  }

  // Only handle subscription actions here (cart/checkout handled by checkout.js)
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;

    if (!window.App.modal?.root?.classList.contains("is-open")) return;
    if (!window.App.modal.root.contains(el)) return;

    const action = el.dataset.action;

    if (action === "open-brand") {
      const idx = Number(el.dataset.brandIndex);
      if (modalContext === 'games') return showGameOptions(idx);
      if (modalContext === 'services') return showServiceOptions(idx);
      return showOptions(idx);
    }

    if (action === "show-suboptions") {
      const brandIdx = Number(el.dataset.brandIndex);
      const optIdx = Number(el.dataset.optIndex);
      if (modalContext === 'services') return showServiceSubOptions(brandIdx, optIdx);
      return showSubOptions(brandIdx, optIdx);
    }

    if (action === "add") {
      const brandIdx = Number(el.dataset.brandIndex);
      const optIdx = Number(el.dataset.optIndex);

      let brand, category;
      if (modalContext === 'games') {
        brand = GAMES[brandIdx];
        category = "Games";
      } else if (modalContext === 'services') {
        brand = SERVICES[brandIdx];
        category = "Services";
      } else {
        brand = SUBS[brandIdx];
        category = "Subscriptions";
      }

      const opt = brand?.options?.[optIdx];
      if (!brand || !opt || opt.disabled) return;

      window.App.cart.add({
        category: category,
        brand: brand.brand,
        option: opt.option,
        price: opt.price,
      });
    }

    if (action === "add-suboption") {
      const brandIdx = Number(el.dataset.brandIndex);
      const optIdx = Number(el.dataset.optIndex);
      const suboptIdx = Number(el.dataset.suboptIndex);

      let brand, category;
      if (modalContext === 'services') {
        brand = SERVICES[brandIdx];
        category = "Services";
      } else {
        brand = SUBS[brandIdx];
        category = "Subscriptions";
      }

      const opt = brand?.options?.[optIdx];
      const subopt = opt?.suboptions?.[suboptIdx];
      if (!brand || !opt || !subopt) return;

      window.App.cart.add({
        category: category,
        brand: brand.brand,
        option: `${opt.option} — ${subopt.option}`,
        price: subopt.price,
      });
    }
  });
});