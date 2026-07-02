document.addEventListener('DOMContentLoaded', async () => {
    
    const API_GET_CHANNELS = '/api/getChannels';
    const API_GET_DATA = '/api/getData';
    const API_GET_SLIDES = '/api/getSlides';
    const API_INCREMENT_VIEW = '/api/incrementView';
    const API_GET_TOP_CHANNELS = '/api/getTopChannels';

    const CHANNELS_PER_PAGE = 40;
    const POSTER_MOBILE = '/assets/poster/mobile_v5.png';
    const POSTER_DESKTOP = '/assets/poster/desktop_v5.png';

    const header = document.querySelector("header");
    const menuBtn = document.getElementById("menu-btn");
    const floatingMenu = document.getElementById("floating-menu");
    const searchContainer = document.getElementById("search-container");
    const searchToggle = document.getElementById("search-toggle");
    const searchInput = document.getElementById("search-input");
    
    let searchClear = document.getElementById("search-clear");
    if (searchClear) {
        searchClear.addEventListener("click", (e) => {
            e.stopPropagation();
            searchInput.value = "";
            searchInput.dispatchEvent(new Event('input'));
            searchInput.focus();
        });
    }
    
    const sliderContainer = document.getElementById('featured-slider');
    const sliderSkeleton = document.getElementById('slider-skeleton');

    const topWatchSection = document.getElementById('top-watch-channels');
    const topWatchList = document.querySelector('.top-watch-list');
    const topWatchSkeleton = document.getElementById('top-watch-skeleton');

    const channelListingsContainer = document.querySelector(".channel-list");
    const channelSkeleton = document.getElementById("channel-skeleton");
    const loadMoreContainer = document.getElementById("load-more-container");
    const loadMoreBtn = document.getElementById("load-more-btn");
    const channelHeader = document.getElementById("channel-list-header") || document.querySelector(".section-header h2");

    const playerView = document.getElementById('player-view');
    const videoElement = document.getElementById('video');
    const playerWrapper = document.getElementById('video-container');

    const minimizeBtn = document.getElementById('minimize-player-btn');
    const minimizedPlayer = document.getElementById('minimized-player');
    const exitBtn = document.getElementById('exit-player-btn');
    
    const mainPlayerName = document.getElementById('player-channel-name');
    const mainPlayerStatus = document.getElementById('player-channel-status');
    const mainPlayerIcon = document.getElementById('main-live-icon');
    
    const miniPlayerName = document.getElementById('minimized-player-name');
    const miniPlayerStatus = document.getElementById('minimized-player-status');
    const miniPlayerLogo = document.getElementById("minimized-player-logo");
    const miniPlayerIcon = document.querySelector(".live-sensor-mini");

    let player = null;
    let ui = null;
    let allStreams = [];
    let currentFilteredStreams = [];
    let currentlyDisplayedCount = 0;
    let currentActiveChannelSlug = null;
    const defaultPageTitle = document.title;
    const offlineChannels = new Set();

    // Mapping of Philippine Languages supported by Google Translate
    const langNames = {
        'en': 'English',
        'fil': 'Filipino (Tagalog)',
        'ceb': 'Cebuano',
        'ilo': 'Ilocano',
        'bcl': 'Bicolano (Bikol)',
        'hil': 'Hiligaynon',
        'pam': 'Kapampangan',
        'pag': 'Pangasinan',
        'war': 'Waray'
    };

    const fetchSlides = async () => {
        try {
            const response = await fetch(API_GET_SLIDES);
            if (!response.ok) throw new Error('Failed to load slides');
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const renderSlider = (slidesData) => {
        if (sliderSkeleton) sliderSkeleton.style.display = 'none';
        if (sliderContainer) sliderContainer.style.display = 'block';

        if (!slidesData || slidesData.length === 0 || !sliderContainer) return;

        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'slider';

        const navWrapper = document.createElement('div');
        navWrapper.className = 'slider-nav';

        slidesData.forEach((data, index) => {
            let slide;
            if (data.link) {
                slide = document.createElement('a');
                slide.href = data.link;

                let isChannelLink = false;
                try {
                    const url = new URL(data.link, window.location.origin);
                    if (url.searchParams.has('channel')) {
                        isChannelLink = true;
                    }
                } catch (err) {
                    console.error("Invalid URL format in slide data", err);
                }

                if (!isChannelLink) {
                    slide.target = "_blank";
                    slide.rel = "noopener noreferrer";
                }

                slide.addEventListener('click', (e) => {
                    if (isChannelLink) {
                        try {
                            const url = new URL(data.link, window.location.origin);
                            const channelSlug = url.searchParams.get('channel');
                            
                            if (channelSlug) {
                                e.preventDefault();
                                
                                const foundChannel = allStreams.find(s => createSlug(s.name) === channelSlug);
                                if (foundChannel) {
                                    openPlayer(foundChannel);
                                } else {
                                    window.location.href = data.link; 
                                }
                            }
                        } catch (err) {
                            console.error("Error parsing slide link", err);
                        }
                    }
                });

                slide.addEventListener('contextmenu', e => e.preventDefault());
                slide.addEventListener('dragstart', e => e.preventDefault());
            } else {
                slide = document.createElement('div');
            }

            slide.className = index === 0 ? 'slide active' : 'slide';
            slide.style.setProperty('--slide-bg', `url('${data.image}')`);

            const overlayStyle = (data.overlay === 'none') ? 'display: none;' : '';

            slide.innerHTML = `
                <div class="slide-wipe-wrapper">
                    <img src="${data.image}" alt="${data.title}" class="slide-bg">
                    <div class="slide-overlay" style="${overlayStyle}"></div>
                    <div class="slide-content">
                        <h2 class="slide-title">${data.title}</h2>
                        <p class="slide-description">${data.description}</p>
                        <div class="slide-badge visit-badge">${data.badge}</div>
                    </div>
                </div>
            `;
            sliderWrapper.appendChild(slide);

            const dot = document.createElement('button');
            dot.className = index === 0 ? 'dot active' : 'dot';
            navWrapper.appendChild(dot);
        });

        sliderContainer.appendChild(sliderWrapper);
        sliderContainer.appendChild(navWrapper);

        initSliderLogic(sliderWrapper, navWrapper);
    };

    const initSliderLogic = (slider, nav) => {
        const slides = slider.querySelectorAll(".slide");
        const dots = nav.querySelectorAll(".dot");
        if (slides.length === 0) return;

        const SLIDE_DURATION = 5000;
        slider.style.setProperty('--slide-timer', `${SLIDE_DURATION}ms`);

        let currentSlide = 0;
        let slideInterval = setInterval(nextSlide, SLIDE_DURATION);

        function goToSlide(n) { 
            const index = (n + slides.length) % slides.length;
            slides.forEach((s, i) => s.classList.toggle("active", i === index)); 
            dots.forEach((d, i) => d.classList.toggle("active", i === index)); 
            currentSlide = index;
        }

        function nextSlide() { goToSlide(currentSlide + 1); }

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                goToSlide(index);
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, SLIDE_DURATION);
            });
        });
    };

    const createSlug = (name) => {
        if (!name) return '';
        return name.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');        
    };
    
    const setResponsivePoster = () => {
        if (!videoElement) return;
        const isDesktop = window.innerWidth > 1024;
        videoElement.poster = isDesktop ? POSTER_DESKTOP : POSTER_MOBILE;
    };
    
    function updateOfflineState(isOffline) {
        const iconName = isOffline ? 'sensors_off' : 'sensors';
        const colorClass = 'status-offline';
        const textColor = isOffline ? 'red' : '#ffffff';
        const textStatus = isOffline ? ' OFFLINE' : ' LIVE';

        if (mainPlayerIcon) {
            mainPlayerIcon.textContent = iconName;
            if (isOffline) mainPlayerIcon.classList.add(colorClass);
            else mainPlayerIcon.classList.remove(colorClass);

            const liveIndicator = mainPlayerIcon.parentElement;
            if (liveIndicator && liveIndicator.classList.contains('live-indicator')) {
                liveIndicator.style.backgroundColor = 'transparent';
                liveIndicator.style.color = textColor;
                
                let textUpdated = false;
                for (let i = 0; i < liveIndicator.childNodes.length; i++) {
                    const node = liveIndicator.childNodes[i];
                    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
                        node.nodeValue = textStatus;
                        textUpdated = true;
                    }
                }
                if (!textUpdated) {
                    liveIndicator.appendChild(document.createTextNode(textStatus));
                }
            }
        }

        if (miniPlayerIcon) {
            miniPlayerIcon.textContent = iconName;
            if (isOffline) miniPlayerIcon.classList.add(colorClass);
            else miniPlayerIcon.classList.remove(colorClass);

            const miniIndicator = miniPlayerIcon.parentElement;
            if (miniIndicator && miniIndicator.classList.contains('live-indicator')) {
                miniIndicator.style.backgroundColor = 'transparent';
                miniIndicator.style.color = textColor;
                
                for (let i = 0; i < miniIndicator.childNodes.length; i++) {
                    const node = miniIndicator.childNodes[i];
                    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
                        node.nodeValue = textStatus;
                    }
                }
            }
        }

        if (currentActiveChannelSlug) {
            const listIcon = document.getElementById(`sensor-${currentActiveChannelSlug}`);
            if (listIcon) {
                listIcon.textContent = iconName;
                if (isOffline) listIcon.classList.add(colorClass);
                else listIcon.classList.remove(colorClass);
            }
        }
    }

    const renderMenu = () => {
        if (!floatingMenu) return;
        floatingMenu.innerHTML = `
        <ul>
            <li><a href="/home/speed"><span class="material-symbols-rounded notranslate" translate="no">speed</span> Speed Test</a></li>
            <li><a href="/home/about"><span class="material-symbols-rounded notranslate" translate="no">info</span> About Us</a></li>
            <li><a href="/home/faq"><span class="material-symbols-rounded notranslate" translate="no">quiz</span> FAQ</a></li>
            <li><a href="/home/privacy"><span class="material-symbols-rounded notranslate" translate="no">shield</span> Privacy Policy</a></li>
            <li><a href="/home/terms"><span class="material-symbols-rounded notranslate" translate="no">gavel</span> Terms of Service</a></li>
            <li><a href="/home/changelog"><span class="material-symbols-rounded notranslate" translate="no">list_alt</span> Changelog</a></li>
       </ul>`;
        
        const menuLinks = floatingMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('contextmenu', (e) => { e.preventDefault(); return false; });
            link.style.userSelect = 'none';              
        });
    };

    async function trackChannelView(channel) {
        try {
            const slug = createSlug(channel.name);
            fetch(`${API_INCREMENT_VIEW}?channel=${slug}`);
        } catch (e) {
            console.error("Tracking error", e);
        }
    }

    async function renderTopWatch() {
        if (!topWatchSection || !topWatchList) return;

        if (topWatchSkeleton && topWatchList.innerHTML === '') {
            topWatchSkeleton.style.display = 'flex';
            topWatchList.style.display = 'none';
        }

        try {
            const res = await fetch(API_GET_TOP_CHANNELS);
            const topSlugs = await res.json();

            if (topWatchSkeleton) topWatchSkeleton.style.display = 'none';
            
            if (!Array.isArray(topSlugs) || topSlugs.length === 0) {
                topWatchSection.style.display = 'none';
                return;
            }

            topWatchList.style.display = 'flex';
            topWatchList.innerHTML = '';

            let rankCounter = 1;

            for (const slug of topSlugs) {
                if (rankCounter > 10) break;

                const channel = allStreams.find(s => createSlug(s.name) === slug);
                
                if (channel) {
                    const item = document.createElement('div');
                    item.className = 'top-watch-item';
                    item.onclick = () => openPlayer(channel);
                    
                    const logo = channel.logo || '/assets/favicon.svg';
                    
                    item.innerHTML = `
                        <img src="/assets/ranks/${rankCounter}.svg" class="top-rank-number" alt="Rank ${rankCounter}">
                        <div class="top-watch-logo-container">
                            <img src="${logo}" class="top-watch-logo" alt="${channel.name}">
                        </div>
                    `;
                    topWatchList.appendChild(item);
                    rankCounter++;
                }
            }

            if (rankCounter === 1) {
                topWatchSection.style.display = 'none';
            }

        } catch (e) {
            console.error("Failed to load top channels:", e);
            if (topWatchSkeleton) topWatchSkeleton.style.display = 'none';
            topWatchSection.style.display = 'none';
        }
    }

    const initPlayer = async () => {
        shaka.polyfill.installAll();
        if (shaka.Player.isBrowserSupported()) {
            player = new shaka.Player(videoElement);
            try {
               ui = new shaka.ui.Overlay(player, playerWrapper, videoElement);
               ui.configure({ 
                  addSeekBar: true 
               }); 
            } catch (e) {
               console.warn(e);
               videoElement.controls = true;
            }

            player.addEventListener('error', (event) => {
                console.error(event.detail.code);
                
                if (currentActiveChannelSlug) {
                    offlineChannels.add(currentActiveChannelSlug);
                }
                
                updateOfflineState(true);
            });
            return true;
        } else {
            alert("Browser not supported");
            return false;
        }
    };

    const openPlayer = async (publicStreamInfo) => {
        trackChannelView(publicStreamInfo);

        if (currentActiveChannelSlug && !offlineChannels.has(currentActiveChannelSlug)) {
            const prevIcon = document.getElementById(`sensor-${currentActiveChannelSlug}`);
            if (prevIcon) {
                prevIcon.textContent = 'sensors';
                prevIcon.classList.remove('status-offline');
            }
        }

        currentActiveChannelSlug = createSlug(publicStreamInfo.name);

        if (playerView) {
            playerView.classList.add('active');
            document.body.classList.add('no-scroll');
            if (minimizedPlayer) minimizedPlayer.classList.remove('active');
        }

        updateOfflineState(offlineChannels.has(currentActiveChannelSlug));
        
        mainPlayerName.textContent = publicStreamInfo.name;
        const groupTitle = publicStreamInfo.group || "Live Stream";
        
        if (miniPlayerName) miniPlayerName.textContent = publicStreamInfo.name;
        if (miniPlayerStatus) miniPlayerStatus.textContent = groupTitle;
        
        if (miniPlayerLogo) {
            miniPlayerLogo.src = publicStreamInfo.logo || '/assets/favicon.svg';
            miniPlayerLogo.style.display = 'block';
        }

        if (mainPlayerStatus) {
            mainPlayerStatus.textContent = "Loading Stream...";
            mainPlayerStatus.style.color = "var(--theme-color)";
        }

        const newUrl = `${window.location.pathname}?channel=${currentActiveChannelSlug}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
        document.title = `${publicStreamInfo.name} - Liveplay`;

        if (!playerView || !playerView.classList.contains('active')) return;
        
        if (mainPlayerStatus) {
            mainPlayerStatus.textContent = "Loading Stream...";
            mainPlayerStatus.style.color = "var(--theme-color)";
        }

        videoElement.removeAttribute('src');
        videoElement.load();

        try {
            const res = await fetch(`${API_GET_DATA}?channel=${encodeURIComponent(publicStreamInfo.name)}`);
            
            if (res.status === 404 || res.status === 403) {
                window.location.href = '/404.html';
                return;
            }

            if (!res.ok) throw new Error("Channel data not found.");
            const secureData = await res.json();

            if (!player) {
                const success = await initPlayer();
                if (!success) return;
            }

            const config = { drm: { servers: {}, clearKeys: {} } };
            if (secureData.ClearKey && secureData.ClearKey.k1 && secureData.ClearKey.k2) {
                config.drm.clearKeys[secureData.ClearKey.k1] = secureData.ClearKey.k2;
            }
            player.configure(config);
            if (ui) ui.setEnabled(true);

            await player.load(secureData.manifestUri);
            videoElement.play().catch(() => console.log("Stream Auto-play blocked"));
            
            offlineChannels.delete(currentActiveChannelSlug);
            updateOfflineState(false);
            
            if (mainPlayerStatus) {
                mainPlayerStatus.textContent = groupTitle;
                mainPlayerStatus.style.color = "var(--theme-color)";
            }

        } catch (e) {
            console.error(e);
            offlineChannels.add(currentActiveChannelSlug);
            updateOfflineState(true);
            
            if (mainPlayerStatus) {
                mainPlayerStatus.textContent = groupTitle;
                mainPlayerStatus.style.color = "var(--theme-color)";
            }
        }
    };

    const minimizePlayer = () => {
        if (playerView && playerView.classList.contains('active')) {
            playerView.classList.remove('active');
            document.body.classList.remove('no-scroll');
            setTimeout(() => { if (minimizedPlayer) minimizedPlayer.classList.add('active'); }, 300);
        }
    };

    const restorePlayer = (e) => {
        if (e.target.closest('#exit-player-btn')) return;
        if (minimizedPlayer) minimizedPlayer.classList.remove('active');
        if (playerView) playerView.classList.add('active');
        document.body.classList.add('no-scroll');
    };

    const closePlayer = async () => {
        if (player) await player.unload();
        
        if (playerView) playerView.classList.remove('active');
        if (minimizedPlayer) minimizedPlayer.classList.remove('active');
        document.body.classList.remove('no-scroll');

        if (currentActiveChannelSlug) {
            const listIcon = document.getElementById(`sensor-${currentActiveChannelSlug}`);
            if (listIcon && !offlineChannels.has(currentActiveChannelSlug)) {
                listIcon.textContent = 'sensors';
                listIcon.classList.remove('status-offline');
            }
            currentActiveChannelSlug = null;
        }

        window.history.pushState({}, '', window.location.pathname);
        document.title = defaultPageTitle;
    };

    async function fetchChannels() {
        try {
            const response = await fetch(API_GET_CHANNELS);
            const channels = await response.json();
            return channels;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const renderChannels = (reset = false) => {
        if (!channelListingsContainer) return;
        if (reset) {
            channelListingsContainer.innerHTML = '';
            currentlyDisplayedCount = 0;
        }
        const slice = currentFilteredStreams.slice(currentlyDisplayedCount, currentlyDisplayedCount + CHANNELS_PER_PAGE);

        slice.forEach(stream => {
            const item = document.createElement('div');
            item.className = 'channel-list-item';
            const logo = stream.logo || '/assets/favicon.svg';
            const slug = createSlug(stream.name);
            
            if (stream.status === 'offline' || stream.active === false) {
                offlineChannels.add(slug);
            }

            const isOffline = offlineChannels.has(slug);
            const iconName = isOffline ? 'sensors_off' : 'sensors';
            const colorClass = isOffline ? 'status-offline' : '';

            item.innerHTML = `
                <div class="channel-info-left">
                    <div class="channel-logo-container">
                        <img src="${logo}" class="channel-logo" onerror="this.style.opacity=0">
                    </div>
                    <span class="channel-name">${stream.name}</span>
                </div>
                <div class="channel-info-right">
                    <span id="sensor-${slug}" class="material-symbols-rounded notranslate ${colorClass}" translate="no">${iconName}</span>
                </div>`;
            
            item.addEventListener('click', () => openPlayer(stream));
            channelListingsContainer.appendChild(item);
        });

        currentlyDisplayedCount += slice.length;
        if (loadMoreContainer) {
            if (currentlyDisplayedCount >= currentFilteredStreams.length) {
                loadMoreContainer.style.display = 'none';
            } else {
                loadMoreContainer.style.display = 'block';
            }
        }
    };

    function updateChannelSensor(slug, isOffline) {
        const listIcon = document.getElementById(`sensor-${slug}`);
        if (listIcon) {
            listIcon.textContent = isOffline ? 'sensors_off' : 'sensors';
            if (isOffline) {
                listIcon.classList.add('status-offline');
            } else {
                listIcon.classList.remove('status-offline');
            }
        }
        if (currentActiveChannelSlug === slug) {
            updateOfflineState(isOffline);
        }
    }

    async function startBackgroundStatusCheck() {
        if (allStreams.length === 0) return;
        const BATCH_SIZE = 10;
        const delay = (ms) => new Promise(res => setTimeout(res, ms));

        for (let i = 0; i < allStreams.length; i += BATCH_SIZE) {
            const batch = allStreams.slice(i, i + BATCH_SIZE);
            
            await Promise.all(batch.map(async (stream) => {
                const slug = createSlug(stream.name);
                
                try {
                    const res = await fetch(`${API_GET_DATA}?channel=${encodeURIComponent(stream.name)}`);
                    if (!res.ok) throw new Error("API Data failed");
                    
                    const secureData = await res.json();
                    if (!secureData.manifestUri) throw new Error("No MPD URI returned");

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 3000);

                    const mpdRes = await fetch(secureData.manifestUri, {
                        method: 'GET',
                        signal: controller.signal
                    }).catch(() => null);

                    clearTimeout(timeoutId);

                    if (mpdRes && !mpdRes.ok) {
                        throw new Error("MPD ping returned error status");
                    }

                    if (mpdRes && mpdRes.ok) {
                        controller.abort();
                    }

                    if (offlineChannels.has(slug)) {
                        offlineChannels.delete(slug);
                        updateChannelSensor(slug, false);
                    }
                    
                } catch (error) {
                    if (!offlineChannels.has(slug)) {
                        offlineChannels.add(slug);
                        updateChannelSensor(slug, true);
                    }
                }
            }));
            
            await delay(300);
        }

        setTimeout(startBackgroundStatusCheck, 120000);
    }

    /* --- GOOGLE TRANSLATE ENGINE INTEGRATION --- */

    const getActiveLanguage = () => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; googtrans=`);
        if (parts.length === 2) {
            const cookieVal = parts.pop().split(';').shift();
            const lang = cookieVal.split('/').pop();
            return lang || 'en';
        }
        return 'en';
    };

    const setLanguageCookie = (langCode) => {
        const domain = window.location.hostname;
        const baseDomain = domain.replace(/^www\./, '');
        if (langCode === 'en') {
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${baseDomain}`;
        } else {
            document.cookie = `googtrans=/en/${langCode}; path=/;`;
            document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
            document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${baseDomain}`;
        }
        window.location.reload();
    };

    const renderLanguageSelector = () => {
        const footerContent = document.querySelector('.footer-content');
        if (!footerContent) return;

        let selectorContainer = document.getElementById('custom-language-selector');
        if (!selectorContainer) {
            selectorContainer = document.createElement('div');
            selectorContainer.id = 'custom-language-selector';
            selectorContainer.className = 'language-selector-container';
            footerContent.insertBefore(selectorContainer, footerContent.firstChild);
        }

        const activeLang = getActiveLanguage();
        const activeName = langNames[activeLang] || 'English';

        selectorContainer.innerHTML = `
            <button id="lang-btn" class="lang-btn">
                <span class="material-symbols-rounded notranslate" translate="no">language</span>
                <span id="active-lang-text">${activeName}</span>
                <span class="material-symbols-rounded notranslate" translate="no" style="font-size: 1rem; margin-left: 4px;">arrow_drop_up</span>
            </button>
            <div id="lang-dropup" class="lang-dropup">
                ${Object.entries(langNames).map(([code, name]) => `
                    <button class="lang-option ${activeLang === code ? 'active' : ''}" data-lang="${code}">
                        ${name}
                    </button>
                `).join('')}
            </div>
        `;

        const langBtn = document.getElementById('lang-btn');
        const langDropup = document.getElementById('lang-dropup');

        if (langBtn && langDropup) {
            langBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                langDropup.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                langDropup.classList.remove('show');
            });

            const options = langDropup.querySelectorAll('.lang-option');
            options.forEach(opt => {
                opt.addEventListener('click', () => {
                    const selectedLang = opt.getAttribute('data-lang');
                    setLanguageCookie(selectedLang);
                });
            });
        }
    };

    const initGoogleTranslate = () => {
        if (!document.getElementById('google_translate_element')) {
            const translateDiv = document.createElement('div');
            translateDiv.id = 'google_translate_element';
            translateDiv.style.display = 'none';
            document.body.appendChild(translateDiv);
        }

        window.googleTranslateElementInit = function() {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'fil,ceb,ilo,bcl,hil,pam,pag,war',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
        };

        if (!document.querySelector('script[src*="translate.google.com"]')) {
            const gtScript = document.createElement('script');
            gtScript.type = 'text/javascript';
            gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.head.appendChild(gtScript);
        }
    };

    /* --- END GOOGLE TRANSLATE ENGINE INTEGRATION --- */

    setResponsivePoster();
    window.addEventListener('resize', setResponsivePoster);
    renderMenu();
    
    if (menuBtn) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (searchContainer && searchContainer.classList.contains("active")) {
                searchContainer.classList.remove("active");
                if (searchInput) searchInput.blur();
            }
            if (floatingMenu) floatingMenu.classList.toggle("active");
        });
    }

    if (searchToggle) {
        searchToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            if (floatingMenu) floatingMenu.classList.remove("active");
            
            if (searchContainer) {
                searchContainer.classList.toggle("active");
                if (searchContainer.classList.contains("active") && searchInput) {
                    searchInput.focus();
                }
            }
        });
    }

    document.addEventListener("click", (e) => {
        if (floatingMenu) floatingMenu.classList.remove("active");

        if (searchContainer && searchContainer.classList.contains("active") && !searchContainer.contains(e.target)) {
            searchContainer.classList.remove("active");
            if (searchInput) searchInput.blur();
        }
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            currentFilteredStreams = allStreams.filter(s => {
                const nameMatch = s.name.toLowerCase().includes(query);
                const groupMatch = s.group ? s.group.toLowerCase().includes(query) : false;
                return nameMatch || groupMatch;
            });

            if (channelHeader) {
                channelHeader.textContent = query === '' ? 
                    "All Channels" : `Search Results (${currentFilteredStreams.length})`;
            }
            renderChannels(true);
        });
    }

    if (minimizeBtn) minimizeBtn.addEventListener('click', minimizePlayer);
    if (minimizedPlayer) minimizedPlayer.addEventListener('click', restorePlayer);
    if (exitBtn) exitBtn.addEventListener('click', closePlayer);
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => renderChannels(false));

    window.addEventListener("scroll", () => {
        if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    });

    // 1. Fetch content APIs & Render DOM dynamically first
    const slidesData = await fetchSlides();
    renderSlider(slidesData);

    allStreams = await fetchChannels();
    currentFilteredStreams = [...allStreams];
    
    // 2. Safely hide skeletons and display contents immediately
    if (channelSkeleton) channelSkeleton.style.display = 'none';
    if (channelListingsContainer) channelListingsContainer.style.display = 'flex';
    
    renderChannels(true);
    renderTopWatch();
    startBackgroundStatusCheck();

    // 3. Post-load initialization for URL channel parameters
    const urlParams = new URLSearchParams(window.location.search);
    const channelSlug = urlParams.get('channel');
    let hasPlayedLink = false;

    if (channelSlug && allStreams.length > 0) {
        const foundChannel = allStreams.find(s => createSlug(s.name) === channelSlug);
        if (foundChannel) {
            openPlayer(foundChannel);
            hasPlayedLink = true;
        } else {
             window.location.href = '/404.html';
        }
    }

    if (!hasPlayedLink && window.innerWidth > 1024) {
        if (playerView) {
            playerView.classList.add('active');
            document.body.classList.add('no-scroll');
        }
        if (mainPlayerName) mainPlayerName.textContent = "Select a Channel";
        if (mainPlayerStatus) mainPlayerStatus.textContent = "";
        updateOfflineState(false);
        if (videoElement) videoElement.poster = POSTER_DESKTOP;
    }

    const headerLogo = document.querySelector('.header-left .logo');
    if (headerLogo) {
        headerLogo.addEventListener('contextmenu', e => e.preventDefault());
        headerLogo.addEventListener('dragstart', e => e.preventDefault());
        headerLogo.style.webkitTouchCallout = 'none';
        headerLogo.style.userSelect = 'none';
    }

    // 4. Progressive Enhancement: Load language elements last in the background
    try {
        renderLanguageSelector();
        initGoogleTranslate();
    } catch (translateError) {
        console.warn("Progressive translation load encountered a delay: ", translateError);
    }

});
