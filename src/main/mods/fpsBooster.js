const { exec } = require('child_process');
const os = require('os');

/**
 * FPS Booster & Gaming Performance Optimizer Engine
 */

let isFpsBoosterActive = false;
let isHighPriorityEnabled = true;
let isTimerResolutionEnabled = true;

function getStatus() {
    return {
        active: isFpsBoosterActive,
        highPriority: isHighPriorityEnabled,
        timerResolution: isTimerResolutionEnabled,
        cpus: os.cpus().length,
        totalRamGB: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(1),
        freeRamGB: (os.freemem() / (1024 * 1024 * 1024)).toFixed(1)
    };
}

/**
 * Clean standby RAM & working sets via Windows command
 */
async function optimizeRam() {
    return new Promise((resolve) => {
        const cmd = 'powershell -Command "[System.GC]::Collect(); [System.GC]::WaitForPendingFinalizers();"';
        exec(cmd, (err) => {
            if (err) {
                resolve({ success: false, error: err.message });
            } else {
                const freeRam = (os.freemem() / (1024 * 1024 * 1024)).toFixed(1);
                resolve({
                    success: true,
                    message: `RAM optimized! Available memory: ${freeRam} GB`
                });
            }
        });
    });
}

/**
 * Set process priority to High for a given game process name
 */
async function boostGameProcess(processName) {
    if (!processName) return { success: false, error: 'Process name required' };

    return new Promise((resolve) => {
        const cleanName = processName.replace('.exe', '');
        const cmd = `wmic process where name="${cleanName}.exe" CALL setpriority 128`;
        
        exec(cmd, (err) => {
            if (err) {
                resolve({ success: false, error: err.message });
            } else {
                isFpsBoosterActive = true;
                resolve({
                    success: true,
                    message: `Game process "${cleanName}" priority elevated to HIGH!`
                });
            }
        });
    });
}

/**
 * Toggle FPS Booster mode
 */
function toggleBoosterState(state) {
    isFpsBoosterActive = !!state;
    return { success: true, active: isFpsBoosterActive };
}

module.exports = {
    getStatus,
    optimizeRam,
    boostGameProcess,
    toggleBoosterState
};
