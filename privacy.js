class PrivacyProtection {
    constructor() {
        this.setupOverlay();
        this.setupEventListeners();
        this.updateWatermark();
    }

    setupOverlay() {
        // Voeg overlay en watermark toe
        const overlay = document.createElement('div');
        overlay.className = 'privacy-overlay';
        document.body.appendChild(overlay);

        const watermark = document.createElement('div');
        watermark.className = 'watermark';
        document.body.appendChild(watermark);

        const notice = document.createElement('div');
        notice.className = 'privacy-notice';
        notice.textContent = 'Deze pagina bevat privacygevoelige informatie. Screenshots zijn niet toegestaan.';
        document.body.appendChild(notice);
    }

    updateWatermark() {
        const watermark = document.querySelector('.watermark');
        const timestamp = new Date().toLocaleString('nl-NL');
        const username = localStorage.getItem('username') || 'Gebruiker';
        watermark.textContent = `${username} - ${timestamp}`;

        // Update watermark elke minuut
        setInterval(() => {
            const newTimestamp = new Date().toLocaleString('nl-NL');
            watermark.textContent = `${username} - ${newTimestamp}`;
        }, 60000);
    }

    setupEventListeners() {
        // Voorkom standaard toetsenbord shortcuts
        document.addEventListener('keydown', (e) => {
            if (
                (e.ctrlKey && (e.key === 'p' || e.key === 'P')) || // Print
                (e.ctrlKey && e.key === 's') || // Save
                e.key === 'PrintScreen' || // Screenshot
                (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I')) // Inspect
            ) {
                e.preventDefault();
                alert('Deze actie is niet toegestaan vanwege privacyredenen.');
                return false;
            }
        });

        // Voorkom rechtermuisklik
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }
} 