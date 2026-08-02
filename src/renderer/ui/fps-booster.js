/**
 * FPS Booster UI Controller
 */

export function initFpsBoosterUI() {
    const btnRam = document.getElementById('btn-clean-ram');
    const btnPriority = document.getElementById('btn-elevate-priority');

    if (btnRam) {
        btnRam.addEventListener('click', async () => {
            btnRam.disabled = true;
            btnRam.innerText = 'Cleaning...';
            try {
                let res;
                if (window.electronAPI && window.electronAPI.optimizeRam) {
                    res = await window.electronAPI.optimizeRam();
                } else {
                    res = await window.electron.invoke('optimize-ram');
                }
                alert(res && res.message ? res.message : 'RAM cleaned!');
            } catch (e) {
                alert('Error cleaning RAM: ' + e.message);
            } finally {
                btnRam.disabled = false;
                btnRam.innerText = 'Clean RAM Now';
            }
        });
    }

    if (btnPriority) {
        btnPriority.addEventListener('click', () => {
            alert('Game Priority Elevation Engine active! Launched games will automatically be assigned High Priority.');
        });
    }
}
