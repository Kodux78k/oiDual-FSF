
        // Data structure for the 12 Archetypes
        const ARQUETIPOS = [
            { id: 'atlas', name: 'ATLAS', code: '⚙ ATLAS ╔╗╔', ascii: '(⌐■_■)', color: '#7ef9c4', icon: 'fa-cube' },
            { id: 'nova', name: 'NOVA', code: '✧ NOVA █▄█', ascii: '(☆‿☆)', color: '#ffe986', icon: 'fa-star' },
            { id: 'vitalis', name: 'VITALIS', code: '🔥 VITALIS ░█▀▄', ascii: '(ง •̀_•́)ง', color: '#ff6b6b', icon: 'fa-fire' },
            { id: 'pulse', name: 'PULSE', code: '🎶 PULSE ₪₪₪', ascii: '(♥‿♥)', color: '#7dd3ff', icon: 'fa-wave-square' },
            { id: 'artemis', name: 'ARTEMIS', code: '🏹 ARTEMIS >><<', ascii: '(⇣‿⇡)', color: '#ffd1a3', icon: 'fa-location-crosshairs' },
            { id: 'serena', name: 'SERENA', code: '♥ SERENA ★彡', ascii: '(˘︶˘)', color: '#ff9ad5', icon: 'fa-leaf' },
            { id: 'kaos', name: 'KAOS', code: '⚡ KAOS ╬╬╬', ascii: '(ಠ_ಠ)', color: '#ffef5a', icon: 'fa-bolt' },
            { id: 'genus', name: 'GENUS', code: '🧩 GENUS ▓▓▓', ascii: '(•‿•)', color: '#c792ff', icon: 'fa-puzzle-piece' },
            { id: 'lumine', name: 'LUMINE', code: '🌅 LUMINE ✧✧✧', ascii: '(^‿^)', color: '#ffa95b', icon: 'fa-sun' },
            { id: 'rhea', name: 'RHEA', code: '🌿 RHEA ⌘⌘⌘', ascii: '(❁‿❁)', color: '#8de48c', icon: 'fa-seedling' },
            { id: 'solus', name: 'SOLUS', code: '🕯 SOLUS ░░░', ascii: '(・・ )', color: '#f4d4ff', icon: 'fa-eye' },
            { id: 'aion', name: 'AION', code: '∞ AION ∞∞∞', ascii: '(∞‿∞)', color: '#9bf6ff', icon: 'fa-infinity' }
        ];

        // State Management
        const state = {
            activeSessions: [],
            currentView: 'home'
        };

        // Core Functions
        function log(msg, isSystem = false) {
            const term = document.getElementById('terminal');
            const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            
            const sysTag = isSystem ? `<span class="log-sys">[SYS]</span>` : '';
            entry.innerHTML = `<span class="log-time">[${time}]</span> ${sysTag}${msg}`;
            
            term.prepend(entry);
        }

        function switchView(viewId, navEl) {
            // Hide all views
            document.querySelectorAll('.view').forEach(v => {
                v.classList.add('hidden');
                v.style.animation = 'none'; // Reset animation
                v.offsetHeight; /* trigger reflow */
                v.style.animation = null; 
            });
            
            // Show target
            document.getElementById(`view-${viewId}`).classList.remove('hidden');
            
            // Update Nav
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            navEl.classList.add('active');
            state.currentView = viewId;
            
            log(`Viewport alternado para: ${viewId.toUpperCase()}`);
            
            // Scroll to top
            document.getElementById('viewport').scrollTop = 0;
        }

        // Render Home Grid
        function renderArchetypes() {
            const container = document.getElementById('archetypes-grid');
            container.innerHTML = '';
            
            ARQUETIPOS.forEach(arq => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.setProperty('--c', arq.color);
                
                card.innerHTML = `
                    <div class="orb"><div class="ascii">${arq.ascii}</div></div>
                    <div class="name" style="color: ${arq.color}; text-shadow: 0 0 10px ${arq.color}88">${arq.name}</div>
                    <div class="code">${arq.code}</div>
                    <div class="btnRow">
                        <button class="card-btn" onclick="copyAction(event, '${arq.code}', this)"><i class="fa-regular fa-clipboard"></i> Copiar</button>
                        <button class="card-btn" onclick="shareAction(event, '${arq.code}', this)"><i class="fa-solid fa-share-nodes"></i> Share</button>
                        <button class="card-btn primary" onclick="openSession(event, '${arq.id}')"><i class="fa-solid fa-terminal"></i> Abrir</button>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        // Interaction Functions
        function copyAction(e, text, btn) {
            e.stopPropagation();
            
            const performCopy = (str) => {
                let textArea = document.createElement("textarea");
                textArea.value = str;
                textArea.style.position = "fixed";
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    log(`Código copiado: ${text}`, true);
                    btn.innerHTML = `<i class="fa-solid fa-check"></i> Copiado`;
                    btn.style.borderColor = "var(--success)";
                    btn.style.color = "var(--success)";
                    setTimeout(() => {
                        btn.innerHTML = `<i class="fa-regular fa-clipboard"></i> Copiar`;
                        btn.style.borderColor = "";
                        btn.style.color = "";
                    }, 1500);
                } catch (err) {
                    log(`Falha ao copiar código: ${err}`);
                }
                document.body.removeChild(textArea);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => {
                    log(`Código copiado via API moderna: ${text}`, true);
                    btn.innerHTML = `<i class="fa-solid fa-check"></i> Copiado`;
                    setTimeout(() => btn.innerHTML = `<i class="fa-regular fa-clipboard"></i> Copiar`, 1500);
                }).catch(() => performCopy(text));
            } else {
                performCopy(text);
            }
        }

        function shareAction(e, text, btn) {
            e.stopPropagation();
            if(navigator.share) {
                navigator.share({
                    title: 'Monólito KOBLLUX',
                    text: text
                }).then(() => log(`Shared: ${text}`));
            } else {
                copyAction(e, text, btn); // Fallback to copy
            }
        }

        // Session Management (Stack)
        function openSession(e, id) {
            e.stopPropagation();
            const arq = ARQUETIPOS.find(a => a.id === id);
            
            // Check if already open
            const existing = state.activeSessions.find(s => s.id === id);
            if(existing) {
                existing.status = 'active';
                renderStack();
                switchView('stack', document.querySelectorAll('.nav-item')[1]);
                log(`Sessão restaurada: ${arq.name}`, true);
                return;
            }

            const sid = 'proc_' + Math.random().toString(36).substr(2, 9);
            const session = { ...arq, sid, status: 'active', height: 450 };
            state.activeSessions.push(session);
            
            log(`Iniciando processo [${arq.name}] - PID: ${sid}`, true);
            renderStack();
            switchView('stack', document.querySelectorAll('.nav-item')[1]);
        }

        function renderStack() {
            const container = document.getElementById('stack-container');
            
            if (state.activeSessions.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; opacity: 0.3; padding: 60px 20px;">
                        <i class="fa-solid fa-ghost" style="font-size: 40px; margin-bottom: 15px;"></i>
                        <p style="font-size: 13px; font-family: 'JetBrains Mono', monospace;">Nenhum processo ativo no monólito.</p>
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
                win.style.borderColor = session.color;
                win.style.boxShadow = `0 10px 30px rgba(0,0,0,0.5), 0 0 15px ${session.color}33`;

                win.innerHTML = `
                    <div class="win-hdr" onclick="toggleCollapse('${session.sid}')">
                        <div class="win-title" style="color: ${session.color}">
                            <i class="fa-solid ${session.icon}"></i>
                            ${session.name} :: TERMINAL
                        </div>
                        <div class="win-controls" onclick="event.stopPropagation()">
                            <button onclick="minimizeApp('${session.sid}')" title="Minimizar"><i class="fa-solid fa-minus"></i></button>
                            <button onclick="maximizeApp('${session.sid}')" title="Maximizar"><i class="fa-solid fa-expand"></i></button>
                            <button class="close" onclick="closeApp('${session.sid}')" title="Encerrar"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                    <div class="win-content-mock">
                        <div class="orb" style="margin-bottom: 20px; box-shadow: 0 0 30px ${session.color}; background: radial-gradient(circle, ${session.color} 0%, #000 80%)">
                            <div class="ascii" style="color: #fff">${session.ascii}</div>
                        </div>
                        <h2 style="color: ${session.color}; font-family: 'Orbitron', sans-serif; margin-bottom: 10px;">CONEXÃO ESTABELECIDA</h2>
                        <p style="font-family: 'JetBrains Mono', monospace; opacity: 0.7; font-size: 12px; margin-bottom: 20px;">
                            Assinatura Genética: <span style="color:#fff">${session.code}</span><br>
                            Status: <span style="color: var(--success)">Sincronizado</span>
                        </p>
                        <div style="width: 80%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                             <div style="width: 100%; height: 100%; background: ${session.color}; animation: load 2s infinite ease-in-out;"></div>
                        </div>
                    </div>
                `;
                container.appendChild(win);
            });
            renderDock();
        }

        // Window Controls
        function minimizeApp(sid) {
            const s = state.activeSessions.find(x => x.sid === sid);
            if (s) {
                s.status = 'minimized';
                log(`Processo minimizado: ${s.name}`, true);
                renderStack();
            }
        }

        function maximizeApp(sid) {
            const s = state.activeSessions.find(x => x.sid === sid);
            if (s) {
                s.status = (s.status === 'maximized') ? 'active' : 'maximized';
                renderStack();
            }
        }

        function closeApp(sid) {
            const s = state.activeSessions.find(x => x.sid === sid);
            if (s) {
                state.activeSessions = state.activeSessions.filter(x => x.sid !== sid);
                log(`Sinal SIGKILL enviado. Processo encerrado: ${s.name}`, true);
                renderStack();
            }
        }

        function clearAll() {
            if(state.activeSessions.length > 0) {
                state.activeSessions = [];
                log(`Limpeza Geral: Todos os processos foram aniquilados.`, true);
                renderStack();
            }
        }

        function toggleCollapse(sid) {
            const win = document.getElementById(sid);
            if (win && !win.classList.contains('maximized')) {
                win.classList.toggle('collapsed');
            }
        }

        // Render Dock (Minimized Items)
        function renderDock() {
            const dock = document.getElementById('dock');
            dock.innerHTML = '';
            const minimized = state.activeSessions.filter(s => s.status === 'minimized');
            
            minimized.forEach(s => {
                const b = document.createElement('div');
                b.className = 'dock-bubble';
                b.innerHTML = `<i class="fa-solid ${s.icon}"></i>`;
                b.style.color = s.color;
                b.title = `Restaurar ${s.name}`;
                b.onclick = () => {
                    s.status = 'active';
                    log(`Processo restaurado: ${s.name}`, true);
                    renderStack();
                };
                dock.appendChild(b);
            });
        }

        // Initialization
        window.onload = () => {
            log("Inicializando Kernel Monolith...", true);
            log("Protocolo Dual Trinity V5 acionado.", true);
            log("Módulos KOBLLUX carregados com sucesso.");
            renderArchetypes();
            renderStack();
            
            // CSS Animation specific to the mockup loading bar
            const style = document.createElement('style');
            style.innerHTML = `@keyframes load { 0% { transform: translateX(-100%); } 50% { transform: translateX(0); } 100% { transform: translateX(100%); } }`;
            document.head.appendChild(style);
        };
    
