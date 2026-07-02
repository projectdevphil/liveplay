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

    const protectedElements = document.querySelectorAll('.back-button, .social-icon-links a, .developer-section a, img, .donate-container, .modal-qr-img');
    protectedElements.forEach(el => {
        el.addEventListener('contextmenu', (e) => { 
            e.preventDefault(); 
            return false; 
        });
    });

    const header = document.querySelector(".static-header");
    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("scrolled", window.scrollY > 10);
        });
    }

    const modal = document.getElementById('qrModal');
    const trigger = document.querySelector('.donate-container');
    
    if (modal && trigger) {
        const body = document.body;
        
        trigger.addEventListener('click', () => {
            modal.classList.add('active');
            body.classList.add('no-scroll');
        });

        modal.addEventListener('click', () => {
            modal.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    }
});
