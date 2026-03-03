window.App = window.App || {};

document.addEventListener('DOMContentLoaded', () => {
  // ensure modal is available just like on products page
  if (!window.App.modal || !window.App.modal.init) {
    console.error('modal.js missing');
    return;
  }
  if (!window.App.__modalReady) {
    const ok = window.App.modal.init();
    window.App.__modalReady = !!ok;
  }

  const searchToggle = document.getElementById('heroSearchToggle');
  const searchOverlay = document.getElementById('heroSearchOverlay');
  const searchPopup = document.getElementById('heroSearchPopup');
  const searchForm = document.getElementById('heroSearchForm');
  const searchInput = document.getElementById('heroSearchInput');
  const searchResults = document.getElementById('heroSearchResults');
  const searchSuggestions = document.getElementById('heroSearchSuggestions');
  const liveOrderCounter = document.getElementById('liveOrderCounter');
  const stickyCartBtn = document.getElementById('stickyCartBtn');

  const allProducts = [
    ...(window.App.SUBSCRIPTIONS_SORTED || window.App.SUBSCRIPTIONS || []),
    ...(window.App.GAMES || []),
    ...(window.App.SERVICES || []),
  ];

  const uniqueTitles = [...new Set(allProducts.map(item => item.brand).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function closeSearchPopup() {
    if (!searchPopup || !searchToggle) return;
    searchPopup.classList.remove('is-open');
    searchOverlay?.classList.remove('is-open');
    searchPopup.setAttribute('aria-hidden', 'true');
    searchOverlay?.setAttribute('aria-hidden', 'true');
    searchToggle.setAttribute('aria-expanded', 'false');
  }

  function openSearchPopup() {
    if (!searchPopup || !searchToggle) return;
    searchPopup.classList.add('is-open');
    searchOverlay?.classList.add('is-open');
    searchPopup.setAttribute('aria-hidden', 'false');
    searchOverlay?.setAttribute('aria-hidden', 'false');
    searchToggle.setAttribute('aria-expanded', 'true');
    searchInput?.focus();
  }

  function redirectToProduct(title) {
    window.location.href = `products.html?q=${encodeURIComponent(title)}`;
  }

  function updateStickyCartCount() {
    if (!stickyCartBtn || !window.App.cart) return;
    stickyCartBtn.textContent = `Checkout (${window.App.cart.items.length})`;
  }

  function renderSuggestions(query) {
    if (!searchResults || !searchSuggestions) return;
    const typed = normalizeText(query);
    if (!typed) {
      searchSuggestions.innerHTML = '';
      searchResults.hidden = true;
      return;
    }

    const matches = uniqueTitles
      .filter(title => normalizeText(title).startsWith(typed))
      .slice(0, 8);

    if (!matches.length) {
      searchSuggestions.innerHTML = '';
      searchResults.hidden = true;
      return;
    }

    searchSuggestions.innerHTML = matches
      .map(title => `<li><button type="button" class="hero-search-item" data-title="${title.replace(/"/g, '&quot;')}">${title}</button></li>`)
      .join('');
    searchResults.hidden = false;
  }

  if (searchToggle && searchPopup && searchInput && searchForm && searchResults && searchSuggestions) {
    searchToggle.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = searchPopup.classList.contains('is-open');
      if (isOpen) {
        closeSearchPopup();
      } else {
        openSearchPopup();
      }
    });

    searchInput.addEventListener('input', () => {
      renderSuggestions(searchInput.value);
    });

    searchSuggestions.addEventListener('click', (event) => {
      const item = event.target.closest('.hero-search-item');
      if (!item) return;
      const title = item.dataset.title;
      if (!title) return;
      redirectToProduct(title);
    });

    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const rawValue = searchInput.value.trim();
      if (!rawValue) return;

      const typed = normalizeText(rawValue);
      const firstMatch = uniqueTitles.find(title => normalizeText(title).startsWith(typed));
      redirectToProduct(firstMatch || rawValue);
    });

    document.addEventListener('click', (event) => {
      if (!searchPopup.classList.contains('is-open')) return;
      if (searchPopup.contains(event.target) || searchToggle.contains(event.target)) return;
      closeSearchPopup();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeSearchPopup();
    });
  }

  if (stickyCartBtn) {
    stickyCartBtn.addEventListener('click', () => {
      const cartPill = document.getElementById('cartPill');
      if (cartPill) cartPill.click();
    });
    updateStickyCartCount();
    window.addEventListener('cart:changed', updateStickyCartCount);
  }

  if (liveOrderCounter) {
    const updateLiveCounter = () => {
      const count = Math.floor(Math.random() * 18) + 8;
      liveOrderCounter.textContent = `🔥 ${count} people purchased in the last hour`;
    };
    updateLiveCounter();
    setInterval(updateLiveCounter, 12000);
  }

  const LOGO_BASE = "../Assets/logos/";
  const listEl = document.getElementById('popularList');
  if (!listEl) return;

  // use predefined popular items if available, otherwise fall back to random
  let items = (window.App.POPULAR_ITEMS || []).filter(i=>i);
  if (!items.length) {
    const subs = (window.App.SUBSCRIPTIONS_SORTED || window.App.SUBSCRIPTIONS || []).map(s => ({...s, category:'Subscriptions'}));
    const games = (window.App.GAMES || []).map(g => ({...g, category:'Games'}));
    items = [...subs, ...games].slice(0,10);
  }

  // helper for option cards inside modal
  function renderOptionCard(opt, idx) {
    const disabled = opt.disabled ? 'is-disabled' : '';
    const priceText = opt.disabled ? '' : `${Number(opt.price).toFixed(2)} €`;
    return `
      <div class="option-card ${disabled}">
        <div class="option-title">${opt.option}</div>
        <div class="option-note">${opt.disabled ? 'Available soon' : 'Demo item'}</div>
        <div class="option-footer">
          <div class="option-price">${priceText}</div>
          <button class="option-buy" type="button"
            data-action="popular-add"
            data-opt-index="${idx}"
            ${opt.disabled ? 'disabled' : ''}>
            Add
          </button>
        </div>
      </div>
    `;
  }

  // current item being shown in modal
  let modalItem = null;

  function showOptionsFor(item) {
    modalItem = item;
    window.App.modal.setTitle(item.brand);
    window.App.modal.resetBack();
    window.App.modal.setBody(`
      <div class="options-grid">
        ${(item.options || []).map((o, j) => renderOptionCard(o, j)).join('')}
      </div>
    `);
    window.App.modal.open();
  }

  function firstAvailablePrice(item) {
    const options = item?.options || [];
    for (const option of options) {
      if (option?.disabled) continue;
      if (Number(option?.price) > 0) return Number(option.price);
      const subOption = (option?.suboptions || []).find(sub => Number(sub.price) > 0);
      if (subOption) return Number(subOption.price);
    }
    return null;
  }

  function createPopularCard(item) {
    const card = document.createElement('div');
    card.className = 'popular-item simple';

    const logoPath = item.logo ? `${LOGO_BASE}${item.logo}` : '';
    if (logoPath) {
      const img = document.createElement('img');
      img.src = logoPath;
      img.alt = item.brand + ' logo';
      img.onerror = () => { img.style.display = 'none'; fallback.style.display = 'grid'; };
      card.appendChild(img);
    }

    const fallback = document.createElement('div');
    fallback.className = 'brand-fallback';
    fallback.style.display = logoPath ? 'none' : 'grid';
    fallback.textContent = item.brand.trim().charAt(0);
    card.appendChild(fallback);

    const name = document.createElement('div');
    name.className = 'p-name';
    name.textContent = item.brand;
    card.appendChild(name);

    const currentPrice = firstAvailablePrice(item);
    if (currentPrice) {
      const originalPrice = (currentPrice * 2.15).toFixed(2);
      const discountPercent = Math.round((1 - (currentPrice / Number(originalPrice))) * 100);

      const pricing = document.createElement('div');
      pricing.className = 'p-pricing';
      pricing.innerHTML = `
        <span class="p-old">€${originalPrice}</span>
        <span class="p-new">€${currentPrice.toFixed(2)}</span>
        <span class="p-off">🔥 ${discountPercent}% OFF</span>
      `;
      card.appendChild(pricing);
    }

    const buyBtn = document.createElement('button');
    buyBtn.className = 'p-buy-now';
    buyBtn.type = 'button';
    buyBtn.textContent = 'Buy Now';
    buyBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      showOptionsFor(item);
    });
    card.appendChild(buyBtn);

    card.addEventListener('click', () => {
      showOptionsFor(item);
    });

    return card;
  }

  items.slice(0,10).forEach(item => {
    listEl.appendChild(createPopularCard(item));
  });

  // Duplicate items for infinite carousel effect
  items.slice(0,10).forEach(item => {
    listEl.appendChild(createPopularCard(item));
  });

  // Start continuous carousel animation
  if (listEl) {
    listEl.classList.add('auto-scrolling');
  }

  // carousel button handling for manual scroll and pause
  const scrollWrapper = document.querySelector('.popular-scroll-wrapper');
  const scrollLeftBtn = document.getElementById('scrollLeft');
  const scrollRightBtn = document.getElementById('scrollRight');
  
  if (scrollWrapper && scrollLeftBtn && scrollRightBtn && listEl) {
    let isAnimationPaused = false;
    let isResetting = false;

    function pauseAnimation() {
      if (!isAnimationPaused) {
        listEl.style.animationPlayState = 'paused';
        isAnimationPaused = true;
        // Resume after 5 seconds of inactivity
        setTimeout(() => {
          if (isAnimationPaused) {
            listEl.style.animationPlayState = 'running';
            isAnimationPaused = false;
          }
        }, 5000);
      }
    }

    // Handle carousel looping at the end
    function handleCarouselLoop() {
      if (isResetting) return;
      
      const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
      const currentScroll = scrollWrapper.scrollLeft;
      
      // When near the end (duplicates section), reset to beginning
      if (currentScroll > maxScroll - 100) {
        isResetting = true;
        listEl.style.animationPlayState = 'paused';
        listEl.classList.remove('auto-scrolling');
        
        // Smoothly scroll back to beginning
        scrollWrapper.scroll({
          left: 0,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          // Restart animation from the beginning
          listEl.classList.add('auto-scrolling');
          listEl.style.animationPlayState = 'running';
          isResetting = false;
        }, 600);
      }
    }

    scrollLeftBtn.addEventListener('click', () => {
      pauseAnimation();
      // Scroll left by calculating width of visible items with smooth animation
      const itemWidth = 132; // item width + gap
      const newScroll = Math.max(0, scrollWrapper.scrollLeft - (itemWidth * 5));
      scrollWrapper.scroll({
        left: newScroll,
        behavior: 'smooth'
      });
    });

    scrollRightBtn.addEventListener('click', () => {
      pauseAnimation();
      const itemWidth = 132;
      scrollWrapper.scroll({
        left: scrollWrapper.scrollLeft + (itemWidth * 5),
        behavior: 'smooth'
      });
    });

    // Check for end of carousel and loop
    scrollWrapper.addEventListener('scroll', handleCarouselLoop);
  }

  // handle add clicks inside modal
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action="popular-add"]');
    if (!el) return;
    const idx = Number(el.dataset.optIndex);
    const opt = modalItem?.options?.[idx];
    if (!modalItem || !opt || opt.disabled) return;
    window.App.cart.add({
      category: modalItem.category || (window.App.GAMES.includes(modalItem)?'Games':'Subscriptions'),
      brand: modalItem.brand,
      option: opt.option,
      price: opt.price,
    });
  });

  // FAQ toggle functionality
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.closest('.faq-item');
      const isActive = faqItem.classList.contains('active');
      
      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Toggle the clicked item
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });
});
