/**
 * Custom Mod & Patch Drag-and-Drop Installer Controller
 */

export function initCustomModInstallerUI() {
    const dropzone = document.getElementById('custom-mod-dropzone');
    const fileInput = document.getElementById('custom-mod-file-input');
    const gameSelect = document.getElementById('custom-mod-game-select');

    if (!dropzone) return;

    populateGameSelect();

    // Click to select file
    dropzone.addEventListener('click', (e) => {
        if (e.target.closest('#custom-mod-game-select')) return;
        if (fileInput) fileInput.click();
    });

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                handleFileInstall(file.path || file.name);
            }
        });
    }

    // Drag and Drop Events
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');

        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFileInstall(file.path);
        }
    });

    if (gameSelect) {
        gameSelect.addEventListener('change', () => {
            loadInstalledCustomMods();
        });
    }
}

async function populateGameSelect() {
    const gameSelect = document.getElementById('custom-mod-game-select');
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
        console.error('Failed to populate games in mod installer:', e);
    }
}

async function handleFileInstall(filePath) {
    const gameSelect = document.getElementById('custom-mod-game-select');
    const targetGamePath = gameSelect ? gameSelect.value : '';

    if (!targetGamePath) {
        alert('Please select a target game before installing mod file!');
        return;
    }

    if (!filePath) {
        alert('No valid file selected.');
        return;
    }

    try {
        let res;
        if (window.electronAPI && window.electronAPI.installCustomModFile) {
            res = await window.electronAPI.installCustomModFile({ gamePath: targetGamePath, filePath });
        } else {
            res = await window.electron.invoke('install-custom-mod-file', { gamePath: targetGamePath, filePath });
        }

        if (res && res.success) {
            alert(res.message || 'Custom mod installed successfully!');
            loadInstalledCustomMods();
        } else {
            alert('Installation Error: ' + (res.error || 'Unknown error'));
        }
    } catch (err) {
        alert('Error loading mod: ' + err.message);
    }
}

async function loadInstalledCustomMods() {
    const gameSelect = document.getElementById('custom-mod-game-select');
    const container = document.getElementById('installed-custom-mods-list');
    if (!gameSelect || !container) return;

    const gamePath = gameSelect.value;
    if (!gamePath) {
        container.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">Please select a game to view installed custom mods.</p>';
        return;
    }

    try {
        let mods = [];
        if (window.electronAPI && window.electronAPI.getCustomMods) {
            mods = await window.electronAPI.getCustomMods(gamePath);
        } else {
            mods = await window.electron.invoke('get-custom-mods', gamePath);
        }

        if (mods.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">No custom mods installed for this game.</p>';
            return;
        }

        container.innerHTML = mods.map(mod => `
            <div style="background: rgba(22, 17, 43, 0.6); border: 1px solid rgba(168, 85, 247, 0.2); padding: 14px 18px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="font-weight: 700; color: var(--text-primary);">${mod.fileName}</span>
                    <span style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 10px;">(${new Date(mod.installedAt).toLocaleDateString('en-US')})</span>
                </div>
                <div>
                    <button class="btn-uninstall-mod" data-id="${mod.id}" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer;">Delete</button>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.btn-uninstall-mod').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const modId = e.target.dataset.id;
                if (!confirm('Are you sure you want to delete this custom mod?')) return;

                if (window.electronAPI && window.electronAPI.uninstallCustomMod) {
                    await window.electronAPI.uninstallCustomMod({ gamePath, modId });
                } else {
                    await window.electron.invoke('uninstall-custom-mod', { gamePath, modId });
                }
                loadInstalledCustomMods();
            });
        });
    } catch (e) {
        console.error('Failed to load custom mods:', e);
    }
}
