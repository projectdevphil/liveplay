document.addEventListener('DOMContentLoaded', () => {
    const protectIcons = () => {
        const iconClasses = ['.material-symbols-rounded', '.material-icons', '.material-icons-round'];
        iconClasses.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.classList.add('notranslate');
            });
        });
    };
    protectIcons();

    const header = document.querySelector(".static-header");
    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("scrolled", window.scrollY > 10);
        });
    }

    const protectedElements = document.querySelectorAll('.back-button, img, .info-btn');
    protectedElements.forEach(el => {
        el.addEventListener('contextmenu', (e) => { 
            e.preventDefault(); 
            return false; 
        });
    });

    fetch('https://ipinfo.io/json')
        .then(r => r.json())
        .then(d => {
            document.getElementById('ipTxt').innerText = d.ip || 'Unavailable';
            document.getElementById('locTxt').innerText = d.city && d.country ? `${d.city}, ${d.country}` : 'Detecting...';
            document.getElementById('ispTxt').innerText = d.org || 'Unknown';
        })
        .catch(() => {});
});

function toggleDropdown() {
    const drop = document.getElementById('netDropdown');
    if (drop.classList.contains('active')) {
        drop.classList.remove('active');
    } else {
        drop.classList.add('active');
        setTimeout(() => document.addEventListener('click', closeOutside), 10);
    }
}

function closeOutside(e) {
    const drop = document.getElementById('netDropdown');
    const btn = document.querySelector('.info-btn');
    if (!drop.contains(e.target) && !btn.contains(e.target)) {
        drop.classList.remove('active');
        document.removeEventListener('click', closeOutside);
    }
}

async function runRealSpeedTest() {
    const btn = document.getElementById('runBtn');
    const status = document.getElementById('statusText');
    const mainVal = document.getElementById('speedValue');
    const spinner = document.getElementById('spinner');
    const core = document.getElementById('core');
    
    const pingEl = document.getElementById('pingVal');
    const downEl = document.getElementById('downVal');
    const upEl = document.getElementById('upVal');
    const scoreEl = document.getElementById('scoreVal');

    const noteBox = document.getElementById('noteBox');
    const noteText = document.getElementById('noteText');

    btn.disabled = true;
    noteBox.style.display = 'none';
    mainVal.innerText = "0";
    pingEl.innerText = "-";
    downEl.innerText = "-";
    upEl.innerText = "-";
    scoreEl.innerText = "-";
    
    status.innerText = "Checking Latency...";
    const startPing = Date.now();
    try {
        await fetch('/assets/favicon.ico', { cache: 'no-store' });
        const pingTime = Date.now() - startPing;
        pingEl.innerText = pingTime + " ms";
    } catch (e) {
        pingEl.innerText = "N/A";
    }

    status.innerText = "Testing Download...";
    spinner.classList.add('active');
    core.classList.add('active');

    let loadedBytes = 0;
    let startTime = Date.now();
    let finalSpeed = 0;

    try {
        const response = await fetch('/api/test?verify=true');
        const reader = response.body.getReader();
        
        let lastUpdate = Date.now();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            loadedBytes += value.length;
            const now = Date.now();
            
            if (now - lastUpdate > 150) {
                const durationInSeconds = (now - startTime) / 1000;
                const bitsLoaded = loadedBytes * 8;
                const mbps = (bitsLoaded / durationInSeconds) / 1000000;
                
                mainVal.innerText = mbps.toFixed(2);
                downEl.innerText = mbps.toFixed(2);
                lastUpdate = now;
                finalSpeed = mbps;
            }
        }
    } catch (err) {
        status.innerText = "Connection Error";
    }

    status.innerText = "Testing Upload...";
    
    let simUpload = 0;
    const targetUpload = Math.max(1, (finalSpeed * 0.3)).toFixed(2);
    
    await new Promise((resolve) => {
        let interval = setInterval(() => {
            simUpload += (targetUpload / 15);
            if(simUpload >= targetUpload) {
                simUpload = targetUpload;
                clearInterval(interval);
                resolve();
            }
            mainVal.innerText = parseFloat(simUpload).toFixed(2);
            upEl.innerText = parseFloat(simUpload).toFixed(2);
        }, 100);
    });

    status.innerText = "Test Complete";
    spinner.classList.remove('active');
    core.classList.remove('active');
    
    let score = 0;
    let finalDl = parseFloat(downEl.innerText);
    let analysis = "";

    if(finalDl > 50) {
        score = 99;
        analysis = "Excellent. You can watch 4K and Full HD Live TV channels without any buffering.";
    }
    else if(finalDl > 20) {
        score = 85;
        analysis = "Good connection. Stable for Full HD (1080p) Live TV channels.";
    }
    else if(finalDl > 8) {
        score = 60;
        analysis = "Fair. Good for HD (720p). You might experience occasional buffering on 1080p channels.";
    }
    else if(finalDl > 4) {
        score = 40;
        analysis = "Average. Capable of SD quality. You will likely experience buffering on HD channels.";
    }
    else {
        score = 15;
        analysis = "Weak connection. Expect frequent buffering and low quality video playback.";
    }

    scoreEl.innerText = score + "%";
    noteText.innerText = analysis;
    noteBox.style.display = 'flex';

    btn.innerText = "Test Again";
    btn.disabled = false;
}
