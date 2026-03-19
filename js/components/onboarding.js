/**
 * x.GEN — Onboarding
 * Phase 7: Onboarding & Settings
 */

const SCREENS = [
  {
    icon: '✦',
    title: 'x.GEN',
    subtitle: 'Build your AI dummy. Generate stunning images using structured prompts optimized for the best AI image models.',
  },
  {
    icon: '⚡',
    title: 'Connect to Venice',
    subtitle: 'You need two things to generate images: Violentmonkey extension installed and Venice Bridge UserScript active.',
    actions: [
      { label: 'Install Violentmonkey', href: 'https://violentmonkey.github.io/', external: true },
      { label: 'Install Bridge Script', id: 'onboarding-install-bridge' },
    ],
  },
  {
    icon: '✓',
    title: "You're ready.",
    subtitle: "Start with a default Dummy or build yours from scratch in the Creation Kit.",
  },
];

let currentScreen = 0;

export function initOnboarding() {
  const screen = document.getElementById('onboarding-screen');
  if (!screen) return;

  screen.classList.add('visible');
  renderScreen(currentScreen);

  document.getElementById('onboarding-next')?.addEventListener('click', () => {
    if (currentScreen < SCREENS.length - 1) {
      currentScreen++;
      renderScreen(currentScreen);
    } else {
      finishOnboarding();
    }
  });

  document.getElementById('onboarding-skip')?.addEventListener('click', finishOnboarding);
}

function renderScreen(index) {
  const s = SCREENS[index];
  const screen = document.getElementById('onboarding-screen');
  if (!screen) return;

  const icon   = document.getElementById('onboarding-icon');
  const title  = document.getElementById('onboarding-title');
  const sub    = document.getElementById('onboarding-subtitle');
  const nextBtn = document.getElementById('onboarding-next');
  const skipBtn = document.getElementById('onboarding-skip');

  if (icon)  icon.textContent = s.icon;
  if (title) title.textContent = s.title;
  if (sub)   sub.textContent = s.subtitle;
  if (nextBtn) nextBtn.textContent = index === SCREENS.length - 1 ? "Start Creating" : "Next";

  const dots = document.getElementById('onboarding-dots');
  if (dots) {
    dots.innerHTML = SCREENS.map((_, i) =>
      `<span class="onboarding-dot${i === index ? ' active' : ''}"></span>`
    ).join('');
  }

  skipBtn.style.display = index === SCREENS.length - 1 ? 'none' : 'block';

  if (s.actions) {
    const existingActions = screen.querySelector('.onboarding-actions');
    existingActions?.remove();

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'onboarding-actions';
    actionsDiv.style.cssText = 'display:flex;flex-direction:column;gap:8px;width:100%;max-width:280px;';

    s.actions.forEach(action => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary btn-full';
      btn.textContent = action.label;
      if (action.external) {
        btn.addEventListener('click', () => window.open(action.href, '_blank'));
      } else if (action.id === 'onboarding-install-bridge') {
        btn.addEventListener('click', () => {
          import('./bridgeInstall.js').then(m => m.showInstallModal());
        });
      }
      actionsDiv.appendChild(btn);
    });

    sub.parentElement.insertBefore(actionsDiv, sub.nextSibling);
  }
}

function finishOnboarding() {
  localStorage.setItem('xgen_onboarding_done', 'true');
  const screen = document.getElementById('onboarding-screen');
  screen?.classList.remove('visible');

  import('../app.js').then(m => m.default.init());
}
