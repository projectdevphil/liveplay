(function() {
    function initCookies() {
        if (localStorage.getItem('cookie_consent')) {
            return;
        }

        document.body.classList.add('no-scroll');

        const overlay = document.createElement('div');
        overlay.id = 'cookie-consent-overlay';
        overlay.className = 'cookie-overlay';
        overlay.style.display = 'none';

        overlay.innerHTML = `
            <div id="cookie-consent-banner" class="cookie-banner">
                <div class="cookie-content">
                    <span class="material-symbols-rounded cookie-icon">cookie</span>
                    <h3>Cookie Settings</h3>
                    <p>We use cookies to improve your user experience, analyze site performance, and personalize details. Choose your preferences before entering our home page.</p>
                    
                    <div id="cookie-options" class="cookie-options" style="display: none;">
                        <div class="cookie-option-item">
                            <label class="switch-container">
                                <input type="checkbox" id="cookie-essential" checked disabled>
                                <span class="switch-slider"></span>
                            </label>
                            <div class="cookie-option-info">
                                <h4>Essential Cookies</h4>
                                <p>Required for basic system features. Cannot be switched off.</p>
                            </div>
                        </div>
                        <div class="cookie-option-item">
                            <label class="switch-container">
                                <input type="checkbox" id="cookie-analytics" checked>
                                <span class="switch-slider"></span>
                            </label>
                            <div class="cookie-option-info">
                                <h4>Analytics & Performance</h4>
                                <p>Anonymously counts views and evaluates user activities to balance system traffic.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cookie-buttons">
                    <button id="cookie-btn-customize" class="cookie-btn btn-secondary">Customize Settings</button>
                    <button id="cookie-btn-reject" class="cookie-btn btn-danger">Reject All</button>
                    <button id="cookie-btn-accept" class="cookie-btn btn-primary">Accept All</button>
                    <button id="cookie-btn-save" class="cookie-btn btn-primary" style="display: none;">Save Preferences</button>
                    <button id="cookie-btn-details" class="cookie-btn btn-secondary" style="display: none;">Read More</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const btnAccept = overlay.querySelector('#cookie-btn-accept');
        const btnReject = overlay.querySelector('#cookie-btn-reject');
        const btnCustomize = overlay.querySelector('#cookie-btn-customize');
        const btnSave = overlay.querySelector('#cookie-btn-save');
        const btnDetails = overlay.querySelector('#cookie-btn-details');
        const cookieOptions = overlay.querySelector('#cookie-options');
        const analyticsCheckbox = overlay.querySelector('#cookie-analytics');

        const handleCookieConsent = (consentData) => {
            localStorage.setItem('cookie_consent', JSON.stringify(consentData));
            
            document.body.classList.remove('no-scroll');
            
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
            }, 400);
        };

        overlay.style.display = 'flex';
        overlay.offsetHeight;
        overlay.classList.add('active');

        if (btnAccept) {
            btnAccept.addEventListener('click', () => {
                handleCookieConsent({ essential: true, analytics: true });
            });
        }

        if (btnReject) {
            btnReject.addEventListener('click', () => {
                handleCookieConsent({ essential: true, analytics: false });
            });
        }

        if (btnCustomize) {
            btnCustomize.addEventListener('click', () => {
                if (cookieOptions) cookieOptions.style.display = 'flex';
                if (btnCustomize) btnCustomize.style.display = 'none';
                if (btnReject) btnReject.style.display = 'none';
                if (btnAccept) btnAccept.style.display = 'none';
                if (btnSave) btnSave.style.display = 'block';
                if (btnDetails) btnDetails.style.display = 'block';
            });
        }

        if (btnSave) {
            btnSave.addEventListener('click', () => {
                const analyticsAccepted = analyticsCheckbox ? analyticsCheckbox.checked : false;
                handleCookieConsent({ essential: true, analytics: analyticsAccepted });
            });
        }

        if (btnDetails) {
            btnDetails.addEventListener('click', () => {
                window.location.href = '/home/cookies';
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookies);
    } else {
        initCookies();
    }
})();
