/**
 * x.GEN — Hash-based Router
 * Phase 1: Shell & Design System
 */

const PAGES = ['home', 'creation-kit', 'the-lab'];

class Router {
  constructor() {
    this.currentPage = null;
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  navigate(page = 'home', opts = {}) {
    if (!PAGES.includes(page)) page = 'home';

    const oldPage = this.currentPage;
    this.currentPage = page;

    PAGES.forEach(p => {
      const el = document.getElementById(`page-${p}`);
      if (el) el.classList.toggle('active', p === page);
    });

    const navItems = ['nav-home', 'nav-creation-kit', 'nav-the-lab'];
    const pageMap  = { home: 'nav-home', 'creation-kit': 'nav-creation-kit', 'the-lab': 'nav-the-lab' };
    navItems.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('active', id === pageMap[page]);
    });

    if (oldPage !== page) {
      const fab = document.getElementById('fab-container');
      if (fab) fab.style.display = page === 'creation-kit' ? 'flex' : 'none';
    }

    window.location.hash = page;

    if (!opts.replace && oldPage !== page) {
      this.loadPageModule(page);
    }

    if (oldPage === 'home' || page === 'home') {
      import('./pages/home.js').then(m => m.renderHome?.());
    }
    if (page === 'creation-kit') {
      import('./pages/creationKit.js').then(m => m.renderCreationKit?.());
    }
    if (page === 'the-lab') {
      import('./pages/theLab.js').then(m => m.renderLab?.());
    }
  }

  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    this.navigate(hash);
  }

  async loadPageModule(page) {
    // Page modules are loaded lazily on navigate
  }
}

export const router = new Router();
