/**
 * Turkish Patches Renderer Controller
 */

let allPatches = [];
let currentCategory = 'all';
let searchQuery = '';

export function initTurkishPatchesUI() {
    const container = document.getElementById('turkish-patches-container');
    const searchInput = document.getElementById('patch-search-input');
    const catPills = document.getElementById('patch-category-pills');

    if (!container) return;

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            renderPatches();
        });
    }

    if (catPills) {
        catPills.addEventListener('click', (e) => {
            const pill = e.target.closest('.cat-pill');
            if (!pill) return;

            catPills.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            currentCategory = pill.dataset.cat || 'all';
            renderPatches();
        });
    }

    loadPatches();
}

export async function loadPatches() {
    try {
        if (window.electronAPI && window.electronAPI.getTurkishPatches) {
            allPatches = await window.electronAPI.getTurkishPatches();
        } else {
            allPatches = await window.electron.invoke('get-turkish-patches');
        }
        renderPatches();
    } catch (e) {
        console.error('Failed to load Turkish patches:', e);
    }
}

function renderPatches() {
    const container = document.getElementById('turkish-patches-container');
    if (!container) return;

    const filtered = allPatches.filter(patch => {
        const matchesCategory = currentCategory === 'all' || patch.category === currentCategory;
        const matchesSearch = !searchQuery || 
            patch.gameName.toLowerCase().includes(searchQuery) ||
            patch.description.toLowerCase().includes(searchQuery) ||
            patch.author.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
                No translation patches found matching your criteria.
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(patch => {
        let statusHtml = '';
        let buttonHtml = '';

        if (patch.isPatchInstalled) {
            statusHtml = `<span class="patch-status status-installed">✓ Patch Installed</span>`;
            buttonHtml = `<button class="btn-patch-action btn-patch-uninstall" data-id="${patch.id}" data-path="${patch.gamePath}">Uninstall</button>`;
        } else if (patch.isGameInstalled) {
            statusHtml = `<span class="patch-status status-game-found">🎮 Game Installed</span>`;
            buttonHtml = `<button class="btn-patch-action btn-patch-install" data-id="${patch.id}" data-path="${patch.gamePath}">Install Patch</button>`;
        } else {
            statusHtml = `<span class="patch-status status-not-installed">Game Not Found</span>`;
            buttonHtml = `<button class="btn-patch-action" style="opacity: 0.5; cursor: not-allowed;" disabled>No Game</button>`;
        }

        return `
            <div class="patch-card">
                <div>
                    <div class="patch-card-header">
                        <span class="patch-game-title">${patch.gameName}</span>
                        <span class="patch-author-badge">${patch.author}</span>
                    </div>
                    <p class="patch-desc">${patch.description}</p>
                </div>
                <div class="patch-footer">
                    ${statusHtml}
                    ${buttonHtml}
                </div>
            </div>
        `;
    }).join('');

    // Attach event handlers
    container.querySelectorAll('.btn-patch-install').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const patchId = e.currentTarget.dataset.id;
            const gamePath = e.currentTarget.dataset.path;
            
            e.currentTarget.disabled = true;
            e.currentTarget.innerText = 'Installing...';

            try {
                let res;
                if (window.electronAPI && window.electronAPI.installTurkishPatch) {
                    res = await window.electronAPI.installTurkishPatch({ gamePath, patchId });
                } else {
                    res = await window.electron.invoke('install-turkish-patch', { gamePath, patchId });
                }

                if (res && res.success) {
                    alert(res.message || 'Patch installed successfully!');
                    await loadPatches();
                } else {
                    alert('Error: ' + (res.error || 'Installation failed'));
                }
            } catch (err) {
                alert('An error occurred during installation: ' + err.message);
            }
        });
    });

    container.querySelectorAll('.btn-patch-uninstall').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const patchId = e.currentTarget.dataset.id;
            const gamePath = e.currentTarget.dataset.path;
            
            if (!confirm('Are you sure you want to uninstall this patch?')) return;

            try {
                let res;
                if (window.electronAPI && window.electronAPI.uninstallTurkishPatch) {
                    res = await window.electronAPI.uninstallTurkishPatch({ gamePath, patchId });
                } else {
                    res = await window.electron.invoke('uninstall-turkish-patch', { gamePath, patchId });
                }

                if (res && res.success) {
                    await loadPatches();
                }
            } catch (err) {
                alert('Error: ' + err.message);
            }
        });
    });
}
