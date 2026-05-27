const { Plugin, setIcon } = require("obsidian");

module.exports = class NavArrowsPlugin extends Plugin {
  onload() {
    this.registerEvent(this.app.workspace.on("layout-change", () => {
      this.updateState();
    }));

    this.registerEvent(this.app.workspace.on("active-leaf-change", () => {
      this.updateState();
    }));

    this.app.workspace.onLayoutReady(() => {
      this.inject();

      this.observer = new MutationObserver(() => {
        if (!document.querySelector(".nav-arrows-plugin")) this.inject();
      });
      this.observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  inject() {
    document.querySelectorAll(".nav-arrows-plugin").forEach((el) => el.remove());

    const wrapper = document.createElement("div");
    wrapper.className = "nav-arrows-plugin";

    wrapper.appendChild(this.makeBtn("back", "chevron-left", "Navigate back", () => {
      this.app.commands.executeCommandById("app:go-back");
      window.setTimeout(() => {
        this.updateState();
      }, 50);
    }));
    wrapper.appendChild(this.makeBtn("forward", "chevron-right", "Navigate forward", () => {
      this.app.commands.executeCommandById("app:go-forward");
      window.setTimeout(() => {
        this.updateState();
      }, 50);
    }));

    let toggleInMain = null;
    const allToggles = document.querySelectorAll(".sidebar-toggle-button.mod-left");
    for (let i = 0; i < allToggles.length; i++) {
      if (!allToggles[i].closest(".mod-left-split")) {
        toggleInMain = allToggles[i];
        break;
      }
    }

    if (toggleInMain) {
      toggleInMain.after(wrapper);
    } else {
      const mainHeader = document.querySelector(".mod-root .workspace-tab-header-container");
      if (!mainHeader) return;
      mainHeader.prepend(wrapper);
    }

    this.updateState();
  }

  makeBtn(name, icon, label, onClick) {
    const btn = document.createElement("div");
    btn.className = "clickable-icon nav-arrows-plugin-btn nav-arrow-" + name;
    btn.setAttribute("aria-label", label);
    setIcon(btn, icon);
    btn.addEventListener("click", onClick);
    return btn;
  }

  updateState() {
    try {
      const leaf = this.app.workspace.getMostRecentLeaf();
      const history = leaf ? leaf.history : null;
      const canBack = history && history.backHistory ? history.backHistory.length > 0 : false;
      const canFwd = history && history.forwardHistory ? history.forwardHistory.length > 0 : false;

      const backBtn = document.querySelector(".nav-arrow-back");
      const fwdBtn = document.querySelector(".nav-arrow-forward");
      if (backBtn) backBtn.classList.toggle("is-disabled", !canBack);
      if (fwdBtn) fwdBtn.classList.toggle("is-disabled", !canFwd);
    } catch {
      // Ignore history lookup errors during layout transitions.
    }
  }

  onunload() {
    if (this.observer) this.observer.disconnect();
    document.querySelectorAll(".nav-arrows-plugin").forEach((el) => el.remove());
  }
};
