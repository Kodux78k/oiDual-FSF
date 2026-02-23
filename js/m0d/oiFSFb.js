/* app.js — modularizado */
/* Coloque este arquivo em /js/app.js ou na raiz e aponte no index.html */

(function () {
  'use strict';

  const APPS = [
    { id: 'atlas', name: 'Atlas Strategic', icon: 'fa-satellite', url: 'https://duckduckgo.com' },
    { id: 'serena', name: 'Serena AI', icon: 'fa-leaf', url: 'https://wikipedia.org' },
    { id: 'solus', name: 'Solus Arcana', icon: 'fa-gem', url: 'https://bing.com' },
    { id: 'kodux', name: 'Kodux Lab', icon: 'fa-flask-vial', url: 'https://example.com' },
    { id: 'lumine', name: 'Lumine', icon: 'fa-bolt', url: 'https://www.google.com/search?q=news' },
    { id: 'vortex', name: 'Vortex CRM', icon: 'fa-hurricane', url: 'https://duckduckgo.com/?q=crm' }
  ];

  const state = {
    activeSessions: [],
    currentView: 'home'
  };

  /* ---- DOM helpers ---- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function log(msg) {
    const term = $('#terminal');
    if (!term) return;
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.textContent = `[${time}] ${msg}`;
    term.prepend(entry);
  }

  /* ---- View switching ---- */
  function switchView(viewId, el) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    if (el) el.classList.add('active');

    state.currentView = viewId;
    log(`View switched to: ${viewId.toUpperCase()}`);
  }

  /* ---- Apps rendering & stack ---- */
  function renderApps() {
    const container = $('#apps-container');
    if (!container) return;
    container.innerHTML = '';
    APPS.forEach(app => {
      const item = document.createElement('div');
      item.className = 'app-item';
      item.innerHTML = `
        <i class="fa-solid ${app.icon}"></i>
        <span>${app.name}</span>
      `;
      item.addEventListener('click', () => openApp(app));
      container.appendChild(item);
    });
  }

  function openApp(app) {
    const sid = 'session_' + Math.random().toString(36).substr(2, 9);
    const session = { ...app, sid, status: 'active', height: 500 };
    state.activeSessions.push(session);
    renderStack();
    // switch to stack view programmatically
    const navStack = document.querySelectorAll('.nav-item')[1];
    switchView('stack', navStack);
    log(`Started Process: ${app.name}`);
  }

  function renderStack() {
    const container = $('#stack-container');
    if (!container) return;

    if (state.activeSessions.length === 0) {
      container.innerHTML = `
        <div class="empty-stack" style="text-align: center; opacity: 0.3; padding: 40px;">
          <i class="fa-solid fa-layer-group" style="font-size: 30px; margin-bottom: 10px;"></i>
          <p style="font-size: 12px;">Nenhum processo no monólito.</p>
        </div>
      `;
      renderDock();
      return;
    }

    container.innerHTML = '';
    state.activeSessions.forEach(session => {
      if (session.status === 'minimized') return;

      const win = document.createElement('div');
      win.className = `session-window ${session.status === 'maximized' ? 'maximized' : ''}`;
      win.id = session.sid;
      win.style.height = session.status === 'maximized' ? '100%' : `${session.height}px`;

      win.innerHTML = `
        <div class="win-hdr" data-sid="${session.sid}">
          <div class="win-title">
            <i class="fa-solid ${session.icon}"></i>
            <span class="win-name">${session.name}</span>
          </div>
          <div class="win-controls">
            <button class="btn-min" title="minimize"><i class="fa-solid fa-minus"></i></button>
            <button class="btn-max" title="maximize"><i class="fa-solid fa-expand"></i></button>
            <button class="btn-close close" title="close"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
        <iframe class="win-frame" src="${session.url}"></iframe>
      `;

      // header click toggles collapse
      const hdr = win.querySelector('.win-hdr');
      hdr.addEventListener('click', () => toggleCollapse(session.sid));

      // controls
      win.querySelector('.btn-min').addEventListener('click', (ev) => {
        ev.stopPropagation();
        minimizeApp(session.sid);
      });
      win.querySelector('.btn-max').addEventListener('click', (ev) => {
        ev.stopPropagation();
        maximizeApp(session.sid);
      });
      win.querySelector('.btn-close').addEventListener('click', (ev) => {
        ev.stopPropagation();
        closeApp(session.sid);
      });

      container.appendChild(win);
    });

    renderDock();
  }

  function minimizeApp(sid) {
    const s = state.activeSessions.find(x => x.sid === sid);
    if (s) s.status = 'minimized';
    renderStack();
    log(`Process minimized: ${s ? s.name : sid}`);
  }

  function maximizeApp(sid) {
    const s = state.activeSessions.find(x => x.sid === sid);
    if (!s) return;
    s.status = (s.status === 'maximized') ? 'active' : 'maximized';
    renderStack();
  }

  function closeApp(sid) {
    const s = state.activeSessions.find(x => x.sid === sid);
    state.activeSessions = state.activeSessions.filter(x => x.sid !== sid);
    renderStack();
    log(`Process terminated: ${s ? s.name : sid}`);
  }

  function clearAll() {
    state.activeSessions = [];
    renderStack();
    log(`Kernel Clean: All processes killed.`);
  }

  function renderDock() {
    const dock = $('#dock');
    if (!dock) return;
    dock.innerHTML = '';
    const minimized = state.activeSessions.filter(s => s.status === 'minimized');

    minimized.forEach(s => {
      const b = document.createElement('div');
      b.className = 'dock-bubble';
      b.innerHTML = `<i class="fa-solid ${s.icon}"></i>`;
      b.addEventListener('click', () => {
        s.status = 'active';
        renderStack();
      });
      dock.appendChild(b);
    });
  }

  function toggleCollapse(sid) {
    const win = document.getElementById(sid);
    if (win) win.classList.toggle('collapsed');
  }

  /* ---- Initialization & bindings ---- */
  function bindNav() {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', () => {
        const view = el.getAttribute('data-view');
        switchView(view, el);
      });
    });
  }

  function bindKillAllBtn() {
    const btn = document.getElementById('killAllBtn');
    if (btn) btn.addEventListener('click', clearAll);
  }

  function init() {
    renderApps();
    bindNav();
    bindKillAllBtn();
    log("System Ready. Waiting for input...");
  }

  /* expose some functions globally so inline handlers (if any) keep working */
  window.switchView = switchView;
  window.openApp = openApp;
  window.minimizeApp = minimizeApp;
  window.maximizeApp = maximizeApp;
  window.closeApp = closeApp;
  window.clearAll = clearAll;
  window.toggleCollapse = toggleCollapse;

  document.addEventListener('DOMContentLoaded', init);
})();
