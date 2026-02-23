
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

        function log(msg) {
            const term = document.getElementById('terminal');
            const time = new Date().toLocaleTimeString();
            const entry = document.createElement('div');
            entry.textContent = `[${time}] ${msg}`;
            term.prepend(entry);
        }

        function switchView(viewId, el) {
            document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
            document.getElementById(`view-${viewId}`).classList.remove('hidden');
            
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            el.classList.add('active');
            state.currentView = viewId;
            log(`View switched to: ${viewId.toUpperCase()}`);
        }

        function renderApps() {
            const container = document.getElementById('apps-container');
            container.innerHTML = '';
            APPS.forEach(app => {
                const item = document.createElement('div');
                item.className = 'app-item';
                item.innerHTML = `
                    <i class="fa-solid ${app.icon}"></i>
                    <span>${app.name}</span>
                `;
                item.onclick = () => openApp(app);
                container.appendChild(item);
            });
        }

        function openApp(app) {
            const sid = 'session_' + Math.random().toString(36).substr(2, 9);
            const session = { ...app, sid, status: 'active', height: 500 };
            state.activeSessions.push(session);
            
            renderStack();
            switchView('stack', document.querySelectorAll('.nav-item')[1]);
            log(`Started Process: ${app.name}`);
        }

        function renderStack() {
            const container = document.getElementById('stack-container');
            if (state.activeSessions.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; opacity: 0.3; padding: 40px;">
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
                    <div class="win-hdr" onclick="toggleCollapse('${session.sid}')">
                        <div class="win-title">
                            <i class="fa-solid ${session.icon}"></i>
                            ${session.name}
                        </div>
                        <div class="win-controls" onclick="event.stopPropagation()">
                            <button onclick="minimizeApp('${session.sid}')"><i class="fa-solid fa-minus"></i></button>
                            <button onclick="maximizeApp('${session.sid}')"><i class="fa-solid fa-expand"></i></button>
                            <button class="close" onclick="closeApp('${session.sid}')"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                    <iframe class="win-frame" src="${session.url}"></iframe>
                `;
                container.appendChild(win);
            });
            renderDock();
        }

        function minimizeApp(sid) {
            const s = state.activeSessions.find(x => x.sid === sid);
            if (s) s.status = 'minimized';
            renderStack();
            log(`Process minimized: ${s.name}`);
        }

        function maximizeApp(sid) {
            const s = state.activeSessions.find(x => x.sid === sid);
            if (s) s.status = (s.status === 'maximized') ? 'active' : 'maximized';
            renderStack();
        }

        function closeApp(sid) {
            state.activeSessions = state.activeSessions.filter(x => x.sid !== sid);
            renderStack();
            log(`Process terminated: ${sid}`);
        }

        function clearAll() {
            state.activeSessions = [];
            renderStack();
            log(`Kernel Clean: All processes killed.`);
        }

        function renderDock() {
            const dock = document.getElementById('dock');
            dock.innerHTML = '';
            const minimized = state.activeSessions.filter(s => s.status === 'minimized');
            
            minimized.forEach(s => {
                const b = document.createElement('div');
                b.className = 'dock-bubble';
                b.innerHTML = `<i class="fa-solid ${s.icon}"></i>`;
                b.onclick = () => {
                    s.status = 'active';
                    renderStack();
                };
                dock.appendChild(b);
            });
        }

        function toggleCollapse(sid) {
            const win = document.getElementById(sid);
            if (win) win.classList.toggle('collapsed');
        }

        // Init
        window.onload = () => {
            renderApps();
            log("System Ready. Waiting for input...");
        };
    
