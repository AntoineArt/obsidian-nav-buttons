const { Plugin } = require('obsidian');

const BACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const FWD_SVG  = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

const STYLES = `
.nav-arrows-plugin { display: flex; align-items: center; gap: 2px; }
.nav-arrows-plugin-btn { display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: var(--radius-s); color: var(--icon-color); opacity: var(--icon-opacity); cursor: var(--cursor); }
.nav-arrows-plugin-btn:hover:not(.is-disabled) { opacity: var(--icon-opacity-hover); background: var(--background-modifier-hover); }
.nav-arrows-plugin-btn.is-disabled { opacity: 0.25; cursor: default; pointer-events: none; }
`;

module.exports = class NavArrowsPlugin extends Plugin {
  onload() {
    this.styleEl = document.createElement('style');
    this.styleEl.textContent = STYLES;
    document.head.appendChild(this.styleEl);

    this.registerEvent(this.app.workspace.on('layout-change', () => {
      if (!document.querySelector('.nav-arrows-plugin')) this.inject();
      else this.updateState();
    }));

    this.registerEvent(this.app.workspace.on('active-leaf-change', () => {
      this.updateState();
    }));

    this.app.workspace.onLayoutReady(() => {
      this.inject();

      this.observer = new MutationObserver(() => {
        if (!document.querySelector('.nav-arrows-plugin')) this.inject();
      });
      this.observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  inject() {
    var wrapper = document.createElement('div');
    wrapper.className = 'nav-arrows-plugin';

    var self = this;
    wrapper.appendChild(this.makeBtn('back', BACK_SVG, 'Navigate back', function() {
      self.app.commands.executeCommandById('app:go-back');
      setTimeout(function() { self.updateState(); }, 50);
    }));
    wrapper.appendChild(this.makeBtn('forward', FWD_SVG, 'Navigate forward', function() {
      self.app.commands.executeCommandById('app:go-forward');
      setTimeout(function() { self.updateState(); }, 50);
    }));

    var toggleInMain = null;
    var allToggles = document.querySelectorAll('.sidebar-toggle-button.mod-left');
    for (var i = 0; i < allToggles.length; i++) {
      if (!allToggles[i].closest('.mod-left-split')) {
        toggleInMain = allToggles[i];
        break;
      }
    }

    if (toggleInMain) {
      toggleInMain.after(wrapper);
    } else {
      var mainHeader = document.querySelector('.mod-root .workspace-tab-header-container');
      if (!mainHeader) return;
      mainHeader.prepend(wrapper);
    }

    this.updateState();
  }

  makeBtn(name, svg, label, onClick) {
    var btn = document.createElement('div');
    btn.className = 'clickable-icon nav-arrows-plugin-btn nav-arrow-' + name;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = svg;
    btn.addEventListener('click', onClick);
    return btn;
  }

  updateState() {
    try {
      var leaf = this.app.workspace.getMostRecentLeaf();
      var history = leaf ? leaf.history : null;
      var canBack = history && history.backHistory ? history.backHistory.length > 0 : false;
      var canFwd  = history && history.forwardHistory ? history.forwardHistory.length > 0 : false;

      var backBtn = document.querySelector('.nav-arrow-back');
      var fwdBtn  = document.querySelector('.nav-arrow-forward');
      if (backBtn) backBtn.classList.toggle('is-disabled', !canBack);
      if (fwdBtn)  fwdBtn.classList.toggle('is-disabled', !canFwd);
    } catch(e) {}
  }

  onunload() {
    if (this.observer) this.observer.disconnect();
    if (this.styleEl) this.styleEl.remove();
    var el = document.querySelector('.nav-arrows-plugin');
    if (el) el.remove();
  }
};
