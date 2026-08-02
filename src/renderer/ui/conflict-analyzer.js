/**
 * Mod & DLL Conflict Analyzer UI Controller
 */

export function initConflictAnalyzerUI() {
    const gameSelect = document.getElementById('analyzer-game-select');
    const btnScan = document.getElementById('btn-scan-conflicts');
    const resultsContainer = document.getElementById('conflict-results-container');

    if (!gameSelect || !btnScan || !resultsContainer) return;

    populateAnalyzerGames();

    btnScan.addEventListener('click', async () => {
        const gamePath = gameSelect.value;
        if (!gamePath) {
            alert('Please select a game to scan!');
            return;
        }

        btnScan.disabled = true;
        btnScan.innerText = 'Scanning...';
        resultsContainer.innerHTML = '<p style="color: var(--text-secondary);">Scanning game directory for conflicting DLL hooks...</p>';

        try {
            let res;
            if (window.electronAPI && window.electronAPI.analyzeModConflicts) {
                res = await window.electronAPI.analyzeModConflicts(gamePath);
            } else {
                res = await window.electron.invoke('analyze-mod-conflicts', gamePath);
            }

            if (!res || !res.success) {
                resultsContainer.innerHTML = `<p style="color: #f87171;">Scan Error: ${res ? res.error : 'Unknown error'}</p>`;
                return;
            }

            renderScanResults(res);
        } catch (e) {
            resultsContainer.innerHTML = `<p style="color: #f87171;">Scan failed: ${e.message}</p>`;
        } finally {
            btnScan.disabled = false;
            btnScan.innerText = 'Scan Conflicts';
        }
    });
}

async function populateAnalyzerGames() {
    const gameSelect = document.getElementById('analyzer-game-select');
    if (!gameSelect) return;

    try {
        let games = [];
        if (window.electronAPI && window.electronAPI.getGames) {
            games = await window.electronAPI.getGames();
        } else {
            games = await window.electron.invoke('get-games');
        }

        gameSelect.innerHTML = '<option value="">Select Target Game...</option>' + 
            games.map(g => `<option value="${g.path}">${g.name || g.title}</option>`).join('');
    } catch (e) {
        console.error('Failed to populate games in conflict analyzer:', e);
    }
}

function renderScanResults(data) {
    const container = document.getElementById('conflict-results-container');
    if (!container) return;

    let html = '';

    if (data.foundDlls && data.foundDlls.length > 0) {
        html += `
            <div style="background: rgba(22, 17, 43, 0.75); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px; padding: 18px; margin-bottom: 16px;">
                <h4 style="color: var(--text-primary); margin-bottom: 10px;">Detected Hook DLL Files (${data.foundDlls.length})</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${data.foundDlls.map(dll => `
                        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(15, 12, 33, 0.6); padding: 10px 14px; border-radius: 8px;">
                            <div>
                                <span style="font-weight: 700; color: #c084fc;">${dll.file}</span>
                                <span style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 10px;">${dll.description}</span>
                            </div>
                            <button class="btn-resolve-dll" data-path="${dll.path}" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer;">Disable DLL</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if (data.warnings && data.warnings.length > 0) {
        html += data.warnings.map(w => `
            <div style="background: ${w.type === 'potential_conflict' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'}; border: 1px solid ${w.type === 'potential_conflict' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}; border-radius: 12px; padding: 16px;">
                <h4 style="color: ${w.type === 'potential_conflict' ? '#f87171' : '#4ade80'};">${w.title}</h4>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 4px;">${w.message}</p>
            </div>
        `).join('');
    }

    container.innerHTML = html;

    // Attach disable handlers
    container.querySelectorAll('.btn-resolve-dll').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const dllPath = e.target.dataset.path;
            if (!confirm('Disable this DLL file to resolve conflict?')) return;

            let res;
            if (window.electronAPI && window.electronAPI.resolveModConflict) {
                res = await window.electronAPI.resolveModConflict(dllPath);
            } else {
                res = await window.electron.invoke('resolve-mod-conflict', dllPath);
            }

            if (res && res.success) {
                alert(res.message);
                const gameSelect = document.getElementById('analyzer-game-select');
                if (gameSelect && gameSelect.value) {
                    document.getElementById('btn-scan-conflicts').click();
                }
            } else {
                alert('Error: ' + (res ? res.error : 'Failed to disable DLL'));
            }
        });
    });
}
