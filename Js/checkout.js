// Js/checkout.js — global cart + checkout flow for ALL pages
window.App = window.App || {};

document.addEventListener("DOMContentLoaded", () => {
  // Ensure modal is initialized once
  if (!window.App.modal || !window.App.modal.init) {
    console.error("modal.js is missing or not loaded before checkout.js");
    return;
  }
  if (!window.App.__modalReady) {
    const ok = window.App.modal.init();
    window.App.__modalReady = !!ok;
  }

  // Update cart pill on every page load
  window.App.cart?.updatePill?.();

  // Attach cart button click (every page)
  const cartBtn = document.getElementById("cartPill");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => openCart());
  }

  // State for checkout
  let orderInfo = {};
  let selectedPayment = null;

  // Function to collect customer device, browser, and location information
  function collectCustomerInfo() {
    const info = {
      // Browser Information
      userAgent: navigator.userAgent,
      browser: getBrowserInfo(),
      language: navigator.language || navigator.userLanguage,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      
      // Device/PC Information
      platform: navigator.platform,
      operatingSystem: getOperatingSystem(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      screenAvailableSize: `${window.screen.availWidth}x${window.screen.availHeight}`,
      colorDepth: `${window.screen.colorDepth}-bit`,
      pixelRatio: window.devicePixelRatio || 1,
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
      
      // Window Information
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      
      // Location Information
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      timestamp: new Date().toISOString(),
      
      // Connection Information (if available)
      connectionType: navigator.connection ? navigator.connection.effectiveType : 'Unknown',
      onlineStatus: navigator.onLine
    };

    return info;
  }

  // Helper function to get browser name and version
  function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "Unknown";

    if (ua.indexOf("Firefox") > -1) {
      browserName = "Firefox";
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (ua.indexOf("Edg") > -1) {
      browserName = "Microsoft Edge";
      browserVersion = ua.match(/Edg\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (ua.indexOf("Chrome") > -1) {
      browserName = "Chrome";
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (ua.indexOf("Safari") > -1) {
      browserName = "Safari";
      browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
      browserName = "Opera";
      browserVersion = ua.match(/(?:Opera|OPR)\/([0-9.]+)/)?.[1] || "Unknown";
    }

    return `${browserName} ${browserVersion}`;
  }

  // Helper function to detect operating system
  function getOperatingSystem() {
    const ua = navigator.userAgent;
    
    if (ua.indexOf("Win") > -1) return "Windows";
    if (ua.indexOf("Mac") > -1) return "MacOS";
    if (ua.indexOf("Linux") > -1) return "Linux";
    if (ua.indexOf("Android") > -1) return "Android";
    if (ua.indexOf("iOS") > -1 || ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) return "iOS";
    
    return "Unknown";
  }

  // Optionally request geolocation (requires user permission)
  async function getGeolocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ error: "Geolocation not supported" });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toISOString()
          });
        },
        (error) => {
          resolve({ error: error.message });
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  }

  function openCart() {
    if (!window.App.modal?.root) return;

    window.App.modal.setTitle("Cart");
    window.App.modal.resetBack();

    const cartItems = window.App.cart?.items || [];
    const total = window.App.cart?.total ? window.App.cart.total() : 0;

    if (!cartItems.length) {
      window.App.modal.setBody(`
        <div class="coming-soon">Your cart is empty.</div>
        <div class="cart-actions">
          <button class="btn-main" data-action="close" type="button">Close</button>
        </div>
      `);
      window.App.modal.open();
      return;
    }

    window.App.modal.setBody(`
      <div class="cart-list">
        ${cartItems.map((it, idx) => `
          <div class="cart-row">
            <div>
              <div class="cart-name">${it.brand} — ${it.option}</div>
              <div class="cart-meta">${it.category}</div>
            </div>
            <div style="display:grid; gap:8px; justify-items:end;">
              <div class="cart-price">${Number(it.price).toFixed(2)} €</div>
              <button class="btn-danger" data-action="remove" data-index="${idx}" type="button">Remove</button>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="cart-actions">
        <button class="btn-danger" data-action="clear" type="button">Clear</button>
        <button class="btn-main" data-action="continue-info" type="button">
          Continue (${Number(total).toFixed(2)} €)
        </button>
      </div>
    `);

    window.App.modal.open();
  }

  function showOrderInfo() {
    window.App.modal.setTitle("Order Information");
    window.App.modal.showBack();
    window.App.modal.pushBack(openCart);

    const countries = window.App.getAllCountryOptionsSafe ? window.App.getAllCountryOptionsSafe() : [];
    const optionsHTML = countries.map(c => `<option value="${c.code}">${c.name}</option>`).join("");

    window.App.modal.setBody(`
      <div class="form-grid">
        <div>
          <label>First Name
            <input class="input" id="firstName" autocomplete="given-name" />
          </label>
        </div>

        <div>
          <label>Last Name
            <input class="input" id="lastName" autocomplete="family-name" />
          </label>
        </div>

        <div>
          <label>Email
            <input class="input" id="email" type="email" autocomplete="email" />
          </label>
        </div>

        <div>
          <label>Country
            <select class="input" id="country">
              <option value="" selected disabled>Select country</option>
              ${optionsHTML}
            </select>
          </label>
        </div>

        <div>
          <label>Address
            <input class="input" id="address" autocomplete="street-address" />
          </label>
        </div>

        <div>
          <label>Phone Number
            <input class="input" id="phone" type="tel" placeholder="+..." autocomplete="tel" />
          </label>
        </div>
      </div>

      <div class="cart-actions">
        <button class="btn-main" data-action="continue-pay" type="button">Continue</button>
      </div>
    `);

    // Auto-fill dial code and prevent editing of country code
    const countryEl = document.getElementById("country");
    const phoneEl = document.getElementById("phone");
    if (countryEl && phoneEl) {
      let currentDialCode = "";
      
      const updatePhoneWithDialCode = () => {
        const code = countryEl.value;
        const dial = window.App.DIAL_BY_COUNTRY?.[code] || "+";
        currentDialCode = dial;
        phoneEl.value = dial;
        phoneEl.dataset.minLength = dial.length;
      };

      countryEl.addEventListener("change", updatePhoneWithDialCode);

      // Prevent deletion or modification of country code prefix
      phoneEl.addEventListener("keydown", (e) => {
        const text = phoneEl.value;
        const cursorPos = phoneEl.selectionStart;
        const dialLen = currentDialCode.length;

        // Prevent backspace if cursor is within or at the end of dial code
        if (e.key === "Backspace" && cursorPos <= dialLen) {
          e.preventDefault();
          return;
        }

        // Prevent Delete key if it would affect dial code
        if (e.key === "Delete" && cursorPos < dialLen) {
          e.preventDefault();
          return;
        }

        // Prevent left arrow from going before dial code
        if (e.key === "ArrowLeft" && cursorPos === 0) {
          e.preventDefault();
          phoneEl.setSelectionRange(dialLen, dialLen);
          return;
        }
      });

      // Prevent pasting over dial code
      phoneEl.addEventListener("paste", (e) => {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData("text");
        const cursorPos = phoneEl.selectionStart;
        const dialLen = currentDialCode.length;

        if (cursorPos < dialLen) {
          // Only paste after dial code
          phoneEl.setSelectionRange(dialLen, phoneEl.value.length);
          document.execCommand("insertText", false, pastedText);
        } else {
          document.execCommand("insertText", false, pastedText);
        }
      });

      // Prevent cutting the dial code
      phoneEl.addEventListener("cut", (e) => {
        const dialLen = currentDialCode.length;
        const selStart = phoneEl.selectionStart;
        const selEnd = phoneEl.selectionEnd;

        if (selStart < dialLen || selEnd <= dialLen) {
          e.preventDefault();
        }
      });

      // Prevent direct text selection and deletion of dial code
      phoneEl.addEventListener("input", (e) => {
        if (!phoneEl.value.startsWith(currentDialCode)) {
          phoneEl.value = currentDialCode;
          phoneEl.setSelectionRange(currentDialCode.length, currentDialCode.length);
        }
        // Allow only numbers after the country code
        let value = phoneEl.value;
        const numberPart = value.substring(currentDialCode.length);
        const cleanedPart = numberPart.replace(/[^0-9]/g, '');
        phoneEl.value = currentDialCode + cleanedPart;
        phoneEl.setSelectionRange(phoneEl.value.length, phoneEl.value.length);
      });
    }

    window.App.modal.open();
  }

  function showPayment() {
    window.App.modal.setTitle("Payment Option");
    window.App.modal.showBack();
    window.App.modal.pushBack(showOrderInfo);

    selectedPayment = null;
    const total = window.App.cart?.total ? window.App.cart.total() : 0;

    window.App.modal.setBody(`
      <div class="pay-grid">
        <div class="pay-card" data-action="pay" data-pay="PayPal">PayPal</div>
        <div class="pay-card" data-action="pay" data-pay="Revolut">Revolut</div>
        <div class="pay-card" data-action="pay" data-pay="Card">Card</div>
        <div class="pay-card" data-action="pay" data-pay="Crypto">Crypto</div>
      </div>

      <div class="terms-section">
        <label class="terms-checkbox">
          <input type="checkbox" id="termsAccept" class="checkbox-input" />
          <span>I agree to the <a href="tos.html" target="_blank" class="terms-link">Terms of Service</a></span>
        </label>
        <button class="btn-main" data-action="place-order" type="button">
          Place Order (Demo) — ${Number(total).toFixed(2)} €
        </button>
      </div>
    `);

    window.App.modal.open();
  }

  // Modal action handling (works on EVERY page)
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;

    if (!window.App.modal?.root?.classList.contains("is-open")) return;
    if (!window.App.modal.root.contains(el)) return;

    const action = el.dataset.action;

    if (action === "close") return window.App.modal.close();

    if (action === "remove") {
      window.App.cart.remove(Number(el.dataset.index));
      return openCart();
    }

    if (action === "clear") {
      window.App.cart.clear();
      return openCart();
    }

    if (action === "continue-info") return showOrderInfo();

    if (action === "continue-pay") {
      const firstName = document.getElementById("firstName")?.value?.trim() || "";
      const lastName = document.getElementById("lastName")?.value?.trim() || "";
      const email = document.getElementById("email")?.value?.trim() || "";
      const address = document.getElementById("address")?.value?.trim() || "";
      const country = document.getElementById("country")?.value || "";
      const phoneRaw = document.getElementById("phone")?.value || "";
      const phone = window.App.normalizePhone ? window.App.normalizePhone(phoneRaw) : phoneRaw;

      if (!firstName) return window.App.toast("Please enter First Name");
      if (!window.App.isValidEmail || !window.App.isValidEmail(email)) return window.App.toast("Please enter a valid email");
      if (!country) return window.App.toast("Please select a country");
      if (!window.App.isValidPhone || !window.App.isValidPhone(phone)) return window.App.toast("Enter a real phone like +491234567890");
      if (!address) return window.App.toast("Please enter address");

      orderInfo = { firstName, lastName, email, address, country, phone };
      return showPayment();
    }

    if (action === "pay") {
      window.App.modal.body.querySelectorAll(".pay-card").forEach(c => c.classList.remove("is-selected"));
      el.classList.add("is-selected");
      selectedPayment = el.dataset.pay;
      return;
    }

    if (action === "place-order") {
      if (!selectedPayment) return window.App.toast("Select a payment method");
      
      const termsCheckbox = document.getElementById("termsAccept");
      if (!termsCheckbox || !termsCheckbox.checked) {
        return window.App.toast("Please accept the Terms of Service");
      }

      // Collect customer device, browser, and location information
      const customerInfo = collectCustomerInfo();

      // Optionally try to get precise geolocation (requires user permission)
      getGeolocation().then((geoData) => {
        customerInfo.geolocation = geoData;

        const orderData = {
          items: window.App.cart.items,
          orderInfo,
          selectedPayment,
          customerInfo,
          totalAmount: window.App.cart.total ? window.App.cart.total() : 0
        };

        console.log("=== ORDER DETAILS ===");
        console.log("Items:", orderData.items);
        console.log("Customer Info:", orderData.orderInfo);
        console.log("Payment Method:", orderData.selectedPayment);
        console.log("Total:", orderData.totalAmount.toFixed(2), "€");
        console.log("\n=== DEVICE & LOCATION INFO ===");
        console.log("Browser:", customerInfo.browser);
        console.log("OS:", customerInfo.operatingSystem);
        console.log("Platform:", customerInfo.platform);
        console.log("Screen:", customerInfo.screenResolution);
        console.log("Viewport:", customerInfo.viewportSize);
        console.log("Language:", customerInfo.language);
        console.log("Timezone:", customerInfo.timezone);
        console.log("Connection:", customerInfo.connectionType);
        console.log("Touch Support:", customerInfo.touchSupport);
        console.log("Device Memory:", customerInfo.deviceMemory);
        console.log("CPU Cores:", customerInfo.hardwareConcurrency);
        if (customerInfo.geolocation && !customerInfo.geolocation.error) {
          console.log("Geolocation:", customerInfo.geolocation);
        }
        console.log("\nFull Order Data:", orderData);

        // Here you would typically send orderData to your server
        // Example: fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderData) })

        window.App.toast("Order placed (demo) ✅");
        window.App.cart.clear();
        window.App.modal.close();
      });

      return; // Exit early since we're handling async geolocation
    }
  });

  // expose openCart in case you want to call it from other scripts
  window.App.checkout = { openCart };
});