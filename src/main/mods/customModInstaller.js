const fs = require('fs');
const path = require('path');

/**
 * Custom Drag-and-Drop Mod & File Installer
 */

function getCustomModsManifest(gamePath) {
    const manifestPath = path.join(gamePath, '.myth_custom_mods.json');
    if (fs.existsSync(manifestPath)) {
        try {
            return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        } catch (e) {
            return [];
        }
    }
    return [];
}

function saveCustomModsManifest(gamePath, modsList) {
    const manifestPath = path.join(gamePath, '.myth_custom_mods.json');
    fs.writeFileSync(manifestPath, JSON.stringify(modsList, null, 2), 'utf8');
}

async function installCustomModFile(gamePath, filePath) {
    if (!gamePath || !fs.existsSync(gamePath)) {
        return { success: false, error: 'Target game path does not exist.' };
    }
    if (!filePath || !fs.existsSync(filePath)) {
        return { success: false, error: 'Source mod file does not exist.' };
    }

    const fileName = path.basename(filePath);
    const ext = path.extname(fileName).toLowerCase();
    const mods = getCustomModsManifest(gamePath);

    const modEntry = {
        id: 'mod_' + Date.now(),
        fileName,
        installedAt: new Date().toISOString(),
        enabled: true,
        type: ext === '.dll' || ext === '.asi' ? 'plugin' : 'archive'
    };

    try {
        const targetPath = path.join(gamePath, fileName);
        fs.copyFileSync(filePath, targetPath);

        mods.push(modEntry);
        saveCustomModsManifest(gamePath, mods);

        return {
            success: true,
            message: `Mod "${fileName}" successfully installed to game directory!`,
            mod: modEntry
        };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function toggleCustomMod(gamePath, modId, enabled) {
    const mods = getCustomModsManifest(gamePath);
    const mod = mods.find(m => m.id === modId);
    if (!mod) return { success: false, error: 'Mod not found.' };

    mod.enabled = enabled;
    saveCustomModsManifest(gamePath, mods);
    return { success: true, enabled };
}

async function uninstallCustomMod(gamePath, modId) {
    let mods = getCustomModsManifest(gamePath);
    const modIndex = mods.findIndex(m => m.id === modId);
    if (modIndex === -1) return { success: false, error: 'Mod not found.' };

    const mod = mods[modIndex];
    try {
        const targetPath = path.join(gamePath, mod.fileName);
        if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
        }
        mods.splice(modIndex, 1);
        saveCustomModsManifest(gamePath, mods);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

module.exports = {
    getCustomModsManifest,
    installCustomModFile,
    toggleCustomMod,
    uninstallCustomMod
};
