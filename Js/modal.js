window.App = window.App || {};

(() => {
  let modal, modalBody, modalTitle, closeBtn, backBtn;
  let stack = [];

  const setBackVisible = (visible) => {
    backBtn.style.visibility = visible ? "visible" : "hidden";
  };

  window.App.modal = {
    init() {
      modal = document.getElementById("modal");
      modalBody = document.getElementById("modalBody");
      modalTitle = document.getElementById("modalTitle");
      closeBtn = document.getElementById("closeModal");
      backBtn = document.getElementById("modalBack");

      if (!modal || !modalBody || !modalTitle || !closeBtn || !backBtn) {
        console.error("Modal elements missing. Check ids: modal, modalBody, modalTitle, closeModal, modalBack");
        return false;
      }

      backBtn.addEventListener("click", () => {
        const back = stack.pop();
        if (back) back();
      });

      closeBtn.addEventListener("click", this.close);

      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) this.close();
      });

      return true;
    },

    open() {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    },

    close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      stack = [];
    },

    setTitle(t) { modalTitle.textContent = t; },
    setBody(html) { modalBody.innerHTML = html; },
    pushBack(fn) { stack.push(fn); },

    resetBack() { stack = []; setBackVisible(false); },
    showBack() { setBackVisible(true); },

    get body() { return modalBody; },
    get root() { return modal; },
  };
})();