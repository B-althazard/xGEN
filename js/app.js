/**
 * x.GEN — Main Application Entry Point
 * Phase 1: Shell & Design System
 */
import { store } from './store.js';
import { router } from './router.js';
import { initBridge } from './bridgeManager.js';
import { initOnboarding } from './components/onboarding.js';

const app = {
  async init() {
    const isFirstVisit = !localStorage.getItem('xgen_onboarding_done');

    if (isFirstVisit) {
      initOnboarding();
      return;
    }

    await store.init();
    const savedState = store.getState();
    document.documentElement.setAttribute('data-theme', savedState.app?.settings?.theme || 'dark');
    this.bindAppEvents();
    this.bindNavigation();
    this.bindFAB();
    this.bindTopBar();
    this.bindBridge();
    this.bindKeyboardShortcuts();
    this.bindPWAInstall();

    const initialPage = savedState?.app?.currentPage || 'home';
    router.navigate(initialPage, { replace: true });

    initBridge();
  },

  bindAppEvents() {
    window.addEventListener('xgen:app:show-toast', (e) => this.showToast(e.detail));
    window.addEventListener('xgen:app:hide-loading', () => this.hideLoadingOverlay());
    window.addEventListener('xgen:app:show-loading', (e) => this.showLoadingOverlay('Connecting to Venice', 'Keep Venice.ai open in a tab', e.detail?.timeout || 120000));
    window.addEventListener('xgen:app:show-error', (e) => this.showLabError(e.detail));
    window.addEventListener('xgen:app:clear-error', () => this.clearLabError());
    window.addEventListener('xgen:app:open-bridge-install', () => {
      import('./components/bridgeInstall.js').then(m => m.showInstallModal());
    });
    window.addEventListener('xgen:app:add-image', (e) => {
      store.dispatch({ type: 'ADD_IMAGE', payload: e.detail });
    });
    window.addEventListener('xgen:app:set-status', (e) => {
      store.dispatch({ type: 'SET_LAB_STATUS', payload: e.detail });
    });
    window.addEventListener('xgen:app:navigate', (e) => {
      router.navigate(e.detail);
    });
  },

  bindNavigation() {
    document.getElementById('nav-home')?.addEventListener('click', () => router.navigate('home'));
    document.getElementById('nav-creation-kit')?.addEventListener('click', () => router.navigate('creation-kit'));
    document.getElementById('nav-the-lab')?.addEventListener('click', () => router.navigate('the-lab'));
    document.getElementById('btn-new-dummy')?.addEventListener('click', () => {
      store.dispatch({ type: 'ADD_DUMMY' });
      router.navigate('creation-kit');
    });
    document.getElementById('lab-goto-kit')?.addEventListener('click', () => router.navigate('creation-kit'));
  },

  bindFAB() {
    const fabMain     = document.getElementById('fab-main');
    const fabActions  = document.getElementById('fab-actions');
    const fabBackdrop = document.getElementById('fab-backdrop');
    if (!fabMain) return;

    fabMain.addEventListener('click', () => {
      const isOpen = fabMain.classList.toggle('open');
      fabActions?.classList.toggle('open', isOpen);
      fabBackdrop?.classList.toggle('visible', isOpen);
      fabMain.setAttribute('aria-expanded', String(isOpen));
    });

    fabBackdrop?.addEventListener('click', () => fabMain.click());

    document.getElementById('fab-duplicate')?.addEventListener('click', () => {
      const prompt = store.getState().app.currentPrompt || '';
      if (prompt) navigator.clipboard.writeText(prompt).then(() => this.showToast('Prompt copied!'));
      fabMain.click();
    });

    document.getElementById('fab-randomize')?.addEventListener('click', () => {
      store.dispatch({ type: 'RANDOMIZE_FIELDS' });
      fabMain.click();
    });

    document.getElementById('fab-reset')?.addEventListener('click', () => {
      store.dispatch({ type: 'RESET_ALL_FIELDS' });
      fabMain.click();
    });
  },

  bindTopBar() {
    document.getElementById('btn-settings')?.addEventListener('click', () => {
      import('./components/settings.js').then(m => m.openSettings());
    });

    document.getElementById('bridge-banner-install')?.addEventListener('click', () => {
      import('./components/bridgeInstall.js').then(m => m.showInstallGuide());
    });

    document.getElementById('bridge-banner-dismiss')?.addEventListener('click', () => {
      localStorage.setItem('xgen_bridge_banner_dismissed', 'true');
      document.getElementById('bridge-banner')?.classList.remove('visible');
    });
  },

  bindBridge() {
    const banner   = document.getElementById('bridge-banner');
    const bridgeDot = document.getElementById('bridge-dot');

    window.addEventListener('xgen:app:bridge-connected', () => {
      bridgeDot?.classList.add('connected');
      banner?.classList.remove('visible');
    });
  },

  bindKeyboardShortcuts() {
    const isMac = navigator.platform.toUpperCase().includes('MAC');

    document.addEventListener('keydown', (e) => {
      const inInput = ['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName);
      const ctrl = isMac ? e.metaKey : e.ctrlKey;

      if (ctrl && e.key === 's' && !e.shiftKey) {
        e.preventDefault();
        import('./modules/presets.js').then(m => m.openSaveModal());
        return;
      }

      if (ctrl && e.key === 'g') {
        e.preventDefault();
        import('./bridgeManager.js').then(m => m.triggerGeneration?.());
        return;
      }

      if (ctrl && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        const prompt = store.getState().app.currentPrompt || '';
        navigator.clipboard.writeText(prompt).then(() => this.showToast('Prompt copied!'));
        return;
      }

      if (ctrl && e.key === 'z' && !e.shiftKey) {
        if (inInput) return;
        e.preventDefault();
        store.dispatch({ type: 'UNDO' });
        return;
      }

      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        store.dispatch({ type: 'REDO' });
        return;
      }

      if (e.key === 'r' && !inInput && !ctrl) {
        e.preventDefault();
        store.dispatch({ type: 'RANDOMIZE_FIELDS' });
        return;
      }

      if (e.key === 'Tab' && !inInput) {
        e.preventDefault();
        const categories = store.getState().app.categories || [];
        const current = store.getState().app.activeCategoryIndex ?? 0;
        const next = e.shiftKey
          ? (current - 1 + categories.length) % categories.length
          : (current + 1) % categories.length;
        store.dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: next });
      }

      if (e.key === 'Escape') {
        document.getElementById('fab-main')?.classList.contains('open') && document.getElementById('fab-main')?.click();
        this.closeAllModals();
      }
    });
  },

  bindPWAInstall() {
    let deferredPrompt = null;
    let bannerTimer = null;
    const banner = document.getElementById('pwa-install-banner');
    const isDismissed = localStorage.getItem('xgen_pwa_dismissed') === 'true';
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (isDismissed || isStandalone) return;
      clearTimeout(bannerTimer);
      bannerTimer = setTimeout(() => {
        banner?.classList.add('visible');
      }, 60000);
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      clearTimeout(bannerTimer);
      banner?.classList.remove('visible');
      localStorage.setItem('xgen_pwa_dismissed', 'true');
    });

    document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        banner?.classList.remove('visible');
        localStorage.setItem('xgen_pwa_dismissed', 'true');
      }
      deferredPrompt = null;
    });

    document.getElementById('pwa-install-dismiss')?.addEventListener('click', () => {
      banner?.classList.remove('visible');
      clearTimeout(bannerTimer);
      localStorage.setItem('xgen_pwa_dismissed', 'true');
    });
  },

  showToast(message, duration = 2500) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">✦</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => toast.remove(), 200);
    }, duration);
  },

  closeAllModals() {
    document.getElementById('modal-backdrop')?.classList.remove('open');
    document.getElementById('settings-panel')?.classList.remove('open');
  },

  openModal({ title = '', body = '', footer = '', wide = false } = {}) {
    const backdrop = document.getElementById('modal-backdrop');
    const modal   = document.getElementById('modal');
    if (!backdrop || !modal) return;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = body;
    document.getElementById('modal-footer').innerHTML = footer;
    if (wide) modal.style.maxWidth = '720px';
    backdrop.classList.add('open');
    backdrop.querySelector('.modal-close, #modal-close')?.addEventListener('click', () => this.closeAllModals());
  },

  showLoadingOverlay(message = 'Generating image', sub = 'Keep Venice.ai open in a tab', timeoutMs = 120000) {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;
    document.getElementById('loading-text').textContent = message;
    document.getElementById('loading-sub').textContent = sub;
    overlay.classList.add('visible');

    const interval = setInterval(() => {
      overlay._elapsed = (overlay._elapsed || 0) + 1000;
      const remaining = Math.max(0, timeoutMs - overlay._elapsed);
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      const el = document.getElementById('loading-countdown');
      if (el) el.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
    }, 1000);
    overlay._clearInterval = () => clearInterval(interval);
  },

  hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;
    overlay.classList.remove('visible');
    overlay._clearInterval?.();
    overlay._elapsed = 0;
    const el = document.getElementById('loading-countdown');
    if (el) el.textContent = '2:00';
  },

  showLabError(message) {
    const banner = document.getElementById('lab-error-banner');
    const text   = document.getElementById('lab-error-text');
    if (banner && text) {
      text.textContent = message;
      banner.style.display = 'flex';
    }
  },

  clearLabError() {
    const banner = document.getElementById('lab-error-banner');
    if (banner) banner.style.display = 'none';
  },
};

export default app;
export { app };

document.addEventListener('DOMContentLoaded', () => app.init());
