const fs = require('fs');
const path = require('path');

/**
 * Smart Mod Compatibility & DLL Conflict Analyzer
 */

const KNOWN_HOOK_DLLS = [
    { name: 'dxgi.dll', description: 'ReShade / OptiScaler / Special K Hook DLL' },
    { name: 'd3d11.dll', description: 'DirectX 11 Graphics Wrapper / Injector' },
    { name: 'd3d12.dll', description: 'DirectX 12 Graphics Wrapper / Streamline Hook' },
    { name: 'version.dll', description: 'ASI Loader / OptiPatcher / DLSS Enabler Hook' },
    { name: 'xinput1_3.dll', description: 'Input Wrapper / Mod Loader' },
    { name: 'nvngx.dll', description: 'NVIDIA DLSS / FSR Replacement Proxy DLL' },
    { name: 'winmm.dll', description: 'Windows Multimedia / Legacy Mod Injector' }
];

/**
 * Scans game directory for active hook DLLs and detects potential conflicts
 */
function analyzeGameDirectory(gamePath) {
    if (!gamePath || !fs.existsSync(gamePath)) {
        return { success: false, error: 'Game path does not exist.' };
    }

    try {
        const foundDlls = [];
        const warnings = [];

        // Scan game root and subdirectories
        const files = fs.readdirSync(gamePath);
        for (const file of files) {
            const lowerFile = file.toLowerCase();
            const matchedKnown = KNOWN_HOOK_DLLS.find(k => k.name === lowerFile);
            if (matchedKnown) {
                foundDlls.push({
                    file,
                    path: path.join(gamePath, file),
                    description: matchedKnown.description
                });
            }
        }

        // Conflict check: Multiple hook DLLs attempting to wrap DirectX simultaneously
        if (foundDlls.some(d => d.file === 'dxgi.dll') && foundDlls.some(d => d.file === 'version.dll')) {
            warnings.push({
                type: 'potential_conflict',
                title: 'Multiple DLL Hooks Detected',
                message: 'Both dxgi.dll and version.dll were found in game directory. This may cause launch crashes unless configured with a wrapper bridge.'
            });
        }

        if (foundDlls.length === 0) {
            warnings.push({
                type: 'clean',
                title: 'Clean Directory',
                message: 'No conflicting mod DLL hooks detected. Game directory is clean.'
            });
        }

        return {
            success: true,
            gamePath,
            foundDlls,
            warnings,
            hasConflicts: warnings.some(w => w.type === 'potential_conflict')
        };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Safely renames or removes conflicting DLL file to backup extension
 */
function resolveDllConflict(dllPath) {
    if (!dllPath || !fs.existsSync(dllPath)) {
        return { success: false, error: 'DLL path does not exist.' };
    }

    try {
        const backupPath = dllPath + '.disabled_bak';
        fs.renameSync(dllPath, backupPath);
        return {
            success: true,
            message: `Conflicting DLL "${path.basename(dllPath)}" has been safely disabled (.disabled_bak).`
        };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

module.exports = {
    analyzeGameDirectory,
    resolveDllConflict
};
