/**
 * x.GEN — Bridge Install Guide
 * Phase 6: The Lab & Bridge
 */

import { app } from '../app.js';

export function showInstallModal() {
  app.openModal({
    title: '⚡ Install Venice Bridge',
    body: `
      <p style="color:var(--text-secondary);margin-bottom:16px;">The Venice Bridge UserScript is required to generate images.</p>
      <ol style="color:var(--text-secondary);line-height:1.8;padding-left:20px;list-style:decimal;font-size:14px;">
        <li>Install <strong style="color:var(--text-primary)">Violentmonkey</strong> (Chrome or Firefox extension)</li>
        <li>Open the Bridge script URL and click Install</li>
        <li>Keep <strong style="color:var(--text-primary)">Venice.ai</strong> open in a tab</li>
        <li>Return here and press Generate</li>
      </ol>
      <div style="margin-top:20px;display:flex;flex-direction:column;gap:8px;">
        <a href="https://violentmonkey.github.io/" target="_blank" class="btn btn-secondary btn-full" style="text-align:center;">
          Install Violentmonkey →
        </a>
        <button class="btn btn-secondary btn-full" id="bridge-install-copy" style="text-align:center;">
          Copy Bridge Script URL
        </button>
      </div>
    `,
    footer: `<button class="btn btn-ghost" id="modal-close-btn">Close</button>`,
  });

  document.getElementById('modal-close-btn')?.addEventListener('click', () => app.closeAllModals());
  document.getElementById('bridge-install-copy')?.addEventListener('click', () => {
    const scriptUrl = 'https://raw.githubusercontent.com/b-althazard/xgen/main/userscript/xgen-venice-bridge.user.js';
    navigator.clipboard.writeText(scriptUrl).then(() => app.showToast('URL copied!'));
  });
}

export function showInstallGuide() {
  app.openModal({
    title: '⚡ Bridge Install Guide',
    body: `
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <div style="font-weight:600;margin-bottom:4px;">Step 1 — Install Violentmonkey</div>
          <p style="font-size:13px;color:var(--text-tertiary);">Required browser extension to run UserScripts.</p>
          <a href="https://violentmonkey.github.io/" target="_blank" class="btn btn-secondary" style="margin-top:8px;display:inline-flex;align-items:center;gap:6px;">
            violentmonkey.github.io ↗
          </a>
        </div>
        <div class="divider"></div>
        <div>
          <div style="font-weight:600;margin-bottom:4px;">Step 2 — Install Bridge Script</div>
          <p style="font-size:13px;color:var(--text-tertiary);">Copy the script URL and open it in Violentmonkey.</p>
          <div style="display:flex;gap:8px;margin-top:8px;">
            <input class="input-field" readonly value="https://raw.githubusercontent.com/b-althazard/xgen/main/userscript/xgen-venice-bridge.user.js" style="font-size:11px;cursor:text;" id="bridge-url-input">
            <button class="btn btn-secondary" id="bridge-copy-url">Copy</button>
          </div>
        </div>
        <div class="divider"></div>
        <div>
          <div style="font-weight:600;margin-bottom:4px;">Step 3 — Keep Venice.ai Open</div>
          <p style="font-size:13px;color:var(--text-tertiary);">Venice.ai must be open in a tab for generation to work.</p>
          <a href="https://venice.ai/chat/" target="_blank" class="btn btn-secondary" style="margin-top:8px;display:inline-flex;align-items:center;gap:6px;">
            Open Venice.ai ↗
          </a>
        </div>
      </div>
    `,
    footer: `<button class="btn btn-primary" id="bridge-guide-close">Got it</button>`,
  });

  document.getElementById('bridge-copy-url')?.addEventListener('click', () => {
    const input = document.getElementById('bridge-url-input');
    if (input) {
      input.select();
      navigator.clipboard.writeText(input.value).then(() => app.showToast('URL copied!'));
    }
  });

  document.getElementById('bridge-guide-close')?.addEventListener('click', () => app.closeAllModals());
}
