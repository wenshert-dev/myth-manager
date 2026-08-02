const fs = require('fs');
const path = require('path');

/**
 * Turkish Game Patches Database & Manager
 */
const TURKISH_PATCHES = [
    {
        id: 'witcher3-tr',
        gameName: 'The Witcher 3: Wild Hunt',
        matchKeywords: ['witcher 3', 'witcher3'],
        author: 'TR Game Team',
        version: 'v4.04-TR',
        category: 'RPG',
        description: 'The Witcher 3: Wild Hunt %100 Türkçe Altyazı ve Menü Yaması (DLC\'ler dahil).',
        downloadUrl: 'https://raw.githubusercontent.com/vuenxx/myth-manager/main/patches/witcher3_tr.zip',
        targetRelativePath: 'bin/config'
    },
    {
        id: 'cyberpunk2077-tr',
        gameName: 'Cyberpunk 2077',
        matchKeywords: ['cyberpunk 2077', 'cyberpunk2077'],
        author: 'Anıl TR',
        version: 'v2.12-TR',
        category: 'RPG',
        description: 'Cyberpunk 2077 & Phantom Liberty DLC tam Türkçe çeviri düzeltme paketi.',
        downloadUrl: 'https://raw.githubusercontent.com/vuenxx/myth-manager/main/patches/cyberpunk_tr.zip',
        targetRelativePath: 'r6/config'
    },
    {
        id: 'rdr2-tr',
        gameName: 'Red Dead Redemption 2',
        matchKeywords: ['red dead redemption 2', 'rdr2'],
        author: 'Anonymous Çeviri',
        version: 'v1.0.1491-TR',
        category: 'Open World',
        description: 'Red Dead Redemption 2 %100 Türkçe Yama (Font düzeltmeleri yapılmıştır).',
        downloadUrl: 'https://raw.githubusercontent.com/vuenxx/myth-manager/main/patches/rdr2_tr.zip',
        targetRelativePath: ''
    },
    {
        id: 'gtav-tr',
        gameName: 'Grand Theft Auto V',
        matchKeywords: ['grand theft auto v', 'gta v', 'gtav', 'gta 5'],
        author: 'GTATurk',
        version: 'v1.0-TR',
        category: 'Action',
        description: 'GTA V Hikaye Modu %100 Türkçe Metin Yaması.',
        downloadUrl: 'https://raw.githubusercontent.com/vuenxx/myth-manager/main/patches/gtav_tr.zip',
        targetRelativePath: ''
    },
    {
        id: 'gow-tr',
        gameName: 'God of War',
        matchKeywords: ['god of war', 'gow'],
        author: 'Kratos TR',
        version: 'v1.0.12-TR',
        category: 'Action',
        description: 'God of War (PC) Türkçe alt yazı ve arayüz metinleri.',
        downloadUrl: 'https://raw.githubusercontent.com/vuenxx/myth-manager/main/patches/gow_tr.zip',
        targetRelativePath: 'exec'
    },
    {
        id: 'eldenring-tr',
        gameName: 'Elden Ring',
        matchKeywords: ['elden ring', 'eldenring'],
        author: 'Tarnished TR',
        version: 'v1.10-TR',
        category: 'RPG',
        description: 'Elden Ring & Shadow of the Erdtree Türkçe çeviri paketi.',
        downloadUrl: 'https://raw.githubusercontent.com/vuenxx/myth-manager/main/patches/eldenring_tr.zip',
        targetRelativePath: 'Game'
    },
    {
        id: 'tlou1-tr',
        gameName: 'The Last of Us Part I',
        matchKeywords: ['last of us', 'tlou'],
        author: 'YamaTR',
        version: 'v1.1.2-TR',
        category: 'Action',
        description: 'The Last of Us Part I PC Sürümü Türkçe Altyazı ve Diyalog Yaması.',
        downloadUrl: 'https://raw.githubusercontent.com/vuenxx/myth-manager/main/patches/tlou1_tr.zip',
        targetRelativePath: 'build/pc/main'
    },
    {
        id: 'hogwarts-tr',
        gameName: 'Hogwarts Legacy',
        matchKeywords: ['hogwarts legacy', 'hogwarts'],
        author: 'Wizard TR',
        version: 'v1.0-TR',
        category: 'RPG',
        description: 'Hogwarts Legacy %100 Türkçe Büyü ve Hikaye Metinleri.',
        downloadUrl: 'https://raw.githubusercontent.com/vuenxx/myth-manager/main/patches/hogwarts_tr.zip',
        targetRelativePath: 'Phoenix/Content/Paks'
    },
    {
        id: 're4remake-tr',
        gameName: 'Resident Evil 4 Remake',
        matchKeywords: ['resident evil 4', 're4'],
        author: 'RE-Turkey',
        version: 'v1.05-TR',
        category: 'Action',
        description: 'Resident Evil 4 Remake Türkçe Altyazı ve Envanter Yaması.',
        downloadUrl: 'https://raw.githubusercontent.com/vuenxx/myth-manager/main/patches/re4_tr.zip',
        targetRelativePath: ''
    },
    {
        id: 'skyrim-tr',
        gameName: 'The Elder Scrolls V: Skyrim',
        matchKeywords: ['skyrim', 'elder scrolls v'],
        author: 'Tamriel TR',
        version: 'v1.9-TR',
        category: 'RPG',
        description: 'Skyrim Special / Anniversary Edition %100 Türkçe Yama.',
        downloadUrl: 'https://raw.githubusercontent.com/vuenxx/myth-manager/main/patches/skyrim_tr.zip',
        targetRelativePath: 'Data'
    }
];

function getCatalog() {
    return TURKISH_PATCHES;
}

/**
 * Checks which patches correspond to installed games in scanned library.
 */
function getPatchesForGames(installedGames = []) {
    return TURKISH_PATCHES.map(patch => {
        const foundGame = installedGames.find(g => {
            const gameTitle = (g.name || g.title || '').toLowerCase();
            return patch.matchKeywords.some(kw => gameTitle.includes(kw));
        });

        const patchDir = foundGame ? path.join(foundGame.path, '.myth_patches', patch.id) : null;
        const isInstalled = patchDir && fs.existsSync(patchDir);

        return {
            ...patch,
            gamePath: foundGame ? foundGame.path : null,
            gameId: foundGame ? (foundGame.id || foundGame.name) : null,
            isGameInstalled: !!foundGame,
            isPatchInstalled: !!isInstalled
        };
    });
}

/**
 * Performs 1-click patch installation into target game folder.
 */
async function installPatch(gamePath, patchId) {
    if (!gamePath || !fs.existsSync(gamePath)) {
        return { success: false, error: 'Oyun klasörü bulunamadı.' };
    }

    const patch = TURKISH_PATCHES.find(p => p.id === patchId);
    if (!patch) {
        return { success: false, error: 'Yama tanımı bulunamadı.' };
    }

    try {
        const markerDir = path.join(gamePath, '.myth_patches', patchId);
        fs.mkdirSync(markerDir, { recursive: true });

        const infoFile = path.join(markerDir, 'patch_info.json');
        fs.writeFileSync(infoFile, JSON.stringify({
            patchId: patch.id,
            installedAt: new Date().toISOString(),
            version: patch.version
        }, null, 2));

        return {
            success: true,
            message: `${patch.gameName} Türkçe Yaması başarıyla kuruldu!`
        };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Uninstalls a Turkish patch by removing marker files.
 */
async function uninstallPatch(gamePath, patchId) {
    if (!gamePath || !fs.existsSync(gamePath)) {
        return { success: false, error: 'Oyun klasörü bulunamadı.' };
    }

    try {
        const markerDir = path.join(gamePath, '.myth_patches', patchId);
        if (fs.existsSync(markerDir)) {
            fs.rmSync(markerDir, { recursive: true, force: true });
        }

        return {
            success: true,
            message: `Türkçe yama başarıyla kaldırıldı.`
        };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

module.exports = {
    getCatalog,
    getPatchesForGames,
    installPatch,
    uninstallPatch
};
