
        // Inicializa Ícones Lucide
        lucide.createIcons();

        const ARQUETIPOS = [
            { id: 'atlas', name: 'ATLAS', code: '⚙ ATLAS ╔╗╔', ascii: '(⌐■_■)', color: '#7ef9c4', icon: 'hexagon' },
            { id: 'nova', name: 'NOVA', code: '✧ NOVA █▄█', ascii: '(☆‿☆)', color: '#ffe986', icon: 'star' },
            { id: 'vitalis', name: 'VITALIS', code: '🔥 VITALIS ░█▀▄', ascii: '(ง •̀_•́)ง', color: '#ff6b6b', icon: 'flame' },
            { id: 'pulse', name: 'PULSE', code: '🎶 PULSE ₪₪₪', ascii: '(♥‿♥)', color: '#7dd3ff', icon: 'activity' },
            { id: 'artemis', name: 'ARTEMIS', code: '🏹 ARTEMIS >><<', ascii: '(⇣‿⇡)', color: '#ffd1a3', icon: 'crosshair' },
            { id: 'serena', name: 'SERENA', code: '♥ SERENA ★彡', ascii: '(˘︶˘)', color: '#ff9ad5', icon: 'leaf' },
            { id: 'kaos', name: 'KAOS', code: '⚡ KAOS ╬╬╬', ascii: '(ಠ_ಠ)', color: '#ffef5a', icon: 'zap' },
            { id: 'genus', name: 'GENUS', code: '🧩 GENUS ▓▓▓', ascii: '(•‿•)', color: '#c792ff', icon: 'puzzle' },
            { id: 'lumine', name: 'LUMINE', code: '🌅 LUMINE ✧✧✧', ascii: '(^‿^)', color: '#ffa95b', icon: 'sun' },
            { id: 'rhea', name: 'RHEA', code: '🌿 RHEA ⌘⌘⌘', ascii: '(❁‿❁)', color: '#8de48c', icon: 'sprout' },
            { id: 'solus', name: 'SOLUS', code: '🕯 SOLUS ░░░', ascii: '(・・ )', color: '#f4d4ff', icon: 'eye' },
            { id: 'aion', name: 'AION', code: '∞ AION ∞∞∞', ascii: '(∞‿∞)', color: '#9bf6ff', icon: 'infinity' }
        ];

        const state = { activeSessions: [], currentView: 'home' };

        function log(msg) {
            const term = document.getElementById('terminal');
            const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.innerHTML = `<span class="log-time">[${time}]</span> ${msg}`;
            term.prepend(entry);
        }

        function switchView(viewId, navEl) {
            document.querySelectorAll('.view').forEach(v => { v.classList.add('hidden'); v.style.animation = 'none'; v.offsetHeight; v.style.animation = null; });
            document.getElementById(`view-${viewId}`).classList.remove('hidden');
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            navEl.classList.add('active');
            state.currentView = viewId;
            document.getElementById('viewport').scrollTop = 0;
            log(`[SYS] Alterado para ${viewId.toUpperCase()}`);
        }

        function renderArchetypes() {
            const container = document.getElementById('archetypes-grid');
            ARQUETIPOS.forEach(arq => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.setProperty('--c', arq.color);
                card.innerHTML = `
                    <div class="orb"><div class="ascii">${arq.ascii}</div></div>
                    <div class="name" style="color: ${arq.color}; text-shadow: 0 0 10px ${arq.color}88">${arq.name}</div>
                    <div class="code">${arq.code}</div>
                    <div class="btnRow">
                        <button class="card-btn primary" onclick="openSession('${arq.id}')"><i data-lucide="terminal" style="width:14px"></i> INICIAR</button>
                    </div>
                `;
                container.appendChild(card);
            });
            lucide.createIcons();
        }

        function openSession(id) {
            const arq = ARQUETIPOS.find(a => a.id === id);
            const existing = state.activeSessions.find(s => s.id === id);
            
            if(existing) {
                existing.status = 'active';
                log(`[SYS] Processo restaurado: ${arq.name}`);
            } else {
                const sid = 'proc_' + Math.random().toString(36).substr(2, 9);
                state.activeSessions.push({ ...arq, sid, status: 'active', height: 450 });
                log(`[KOBLLUX] Arquétipo convocado: ${arq.name} (PID: ${sid})`);
            }
            renderStack();
            switchView('stack', document.querySelectorAll('.nav-item')[1]);
        }

        function renderStack() {
            const container = document.getElementById('stack-container');
            if (state.activeSessions.length === 0) {
                container.innerHTML = `<div style="text-align:center;opacity:0.3;padding:60px 20px;"><i data-lucide="ghost" style="width:40px;height:40px;margin-bottom:15px"></i><p style="font-family:'JetBrains Mono'">Sistema Vazio.</p></div>`;
                lucide.createIcons();
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
                win.style.borderColor = session.color;
                win.style.boxShadow = `0 10px 30px rgba(0,0,0,0.5), 0 0 15px ${session.color}33`;

                win.innerHTML = `
                    <div class="win-hdr">
                        <div class="win-title" style="color: ${session.color}"><i data-lucide="${session.icon}" style="width:14px"></i> ${session.name} :: CONSOLE</div>
                        <div class="win-controls">
                            <button onclick="minimizeApp('${session.sid}')" title="Minimizar"><i data-lucide="minus" style="width:12px"></i></button>
                            <button onclick="maximizeApp('${session.sid}')" title="Maximizar"><i data-lucide="maximize-2" style="width:12px"></i></button>
                            <button class="close" onclick="closeApp('${session.sid}')" title="Fechar"><i data-lucide="x" style="width:12px"></i></button>
                        </div>
                    </div>
                    <div class="win-content-mock">
                        <div class="orb" style="margin-bottom:20px; box-shadow:0 0 30px ${session.color}; --c:${session.color}">
                            <div class="ascii">${session.ascii}</div>
                        </div>
                        <h2 style="color:${session.color}; font-family:'Orbitron'; margin-bottom:10px;">SINTONIA ATIVA</h2>
                        <p style="font-family:'JetBrains Mono'; opacity:0.7; font-size:12px;">Frequência: ${session.code}</p>
                    </div>
                `;
                container.appendChild(win);
            });
            lucide.createIcons();
            renderDock();
        }

        function minimizeApp(sid) {
            const s = state.activeSessions.find(x => x.sid === sid);
            if (s) { s.status = 'minimized'; log(`[SYS] Minimizado: ${s.name}`); renderStack(); }
        }
        function maximizeApp(sid) {
            const s = state.activeSessions.find(x => x.sid === sid);
            if (s) { s.status = s.status === 'maximized' ? 'active' : 'maximized'; renderStack(); }
        }
        function closeApp(sid) {
            const s = state.activeSessions.find(x => x.sid === sid);
            if (s) { state.activeSessions = state.activeSessions.filter(x => x.sid !== sid); log(`[SYS] Processo Encerrado: ${s.name}`); renderStack(); }
        }
        function clearAll() { state.activeSessions = []; log("[SYS] KILL ALL executado."); renderStack(); }

        /* O CORE DO PEDIDO: DOCK RENDERIZANDO OS ORBS IDÊNTICOS */
        function renderDock() {
            const dock = document.getElementById('dock');
            dock.innerHTML = '';
            const minimized = state.activeSessions.filter(s => s.status === 'minimized');
            
            minimized.forEach(s => {
                const wrapper = document.createElement('div');
                wrapper.className = 'dock-orb-wrapper';
                wrapper.title = s.name;
                wrapper.onclick = () => { s.status = 'active'; renderStack(); };
                
                // Recriando a geometria exata do Orb do Arquétipo, mas em escala reduzida
                wrapper.innerHTML = `
                    <div class="orb" style="--c: ${s.color};">
                        <div class="ascii" style="color:#000;">${s.ascii}</div>
                    </div>
                    <div class="dock-orb-indicator" style="background:${s.color}"></div>
                `;
                dock.appendChild(wrapper);
            });
        }

        // Vault Logic
        function toggleVault(show) {
            const modal = document.getElementById('vaultModal');
            if(show) {
                modal.classList.add('active');
                document.getElementById('vaultPass').focus();
                log("[SEC] Tentativa de acesso ao Cofre Central.");
            } else {
                modal.classList.remove('active');
                document.getElementById('vaultPass').value = '';
            }
        }
        function unlockVault() {
            const val = document.getElementById('vaultPass').value;
            if(val) {
                log(`[SEC] Cofre desbloqueado com sucesso.`);
                toggleVault(false);
            } else {
                log(`[SEC] ERRO: Senha em branco.`);
            }
        }

        // Init
        window.onload = () => {
            log("[0x00] Sistema Geométrico Inicializado.");
            log("[0x06] Fusão Dual Monolith-AppLivs completa.");
            
            // Set Timeline based on hours
            const now = new Date();
            const h = now.getHours() + now.getMinutes() / 60;
            const pct = Math.max(0, Math.min(100, ((h - 6) / (23 - 6)) * 100));
            document.getElementById('time-bar').style.width = `${pct}%`;

            renderArchetypes();
            renderStack();
        };
    
