// ===== HEADER AND FOOTER INCLUDE SYSTEM =====
// Bu dosya, tüm HTML sayfalarında header ve footer'ı otomatik olarak yükler

document.addEventListener('DOMContentLoaded', function() {
    // Header'ı yükle
    loadHeader();
    
    // Footer'ı yükle
    loadFooter();
});

// Header yükleme fonksiyonu
async function loadHeader() {
    try {
        const response = await fetch('header.html');
        const headerHtml = await response.text();
        
        // Header container'ı bul veya oluştur
        let headerContainer = document.getElementById('header-container');
        if (!headerContainer) {
            headerContainer = document.createElement('div');
            headerContainer.id = 'header-container';
            document.body.insertBefore(headerContainer, document.body.firstChild);
        }
        
        headerContainer.innerHTML = headerHtml;
        
        // Header yüklendikten sonra mobile menu'yu initialize et
        initializeMobileMenu();
        
    } catch (error) {
        console.error('Header yüklenirken hata oluştu:', error);
    }
}

// Footer yükleme fonksiyonu
async function loadFooter() {
    try {
        const response = await fetch('footer.html');
        const footerHtml = await response.text();
        
        // Footer container'ı bul veya oluştur
        let footerContainer = document.getElementById('footer-container');
        if (!footerContainer) {
            footerContainer = document.createElement('div');
            footerContainer.id = 'footer-container';
            document.body.appendChild(footerContainer);
        }
        
        footerContainer.innerHTML = footerHtml;
        
    } catch (error) {
        console.error('Footer yüklenirken hata oluştu:', error);
    }
}

// Mobile menu initialization (header yüklendikten sonra çağrılır)
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            // Toggle show class on navigation menu
            navMenu.classList.toggle('show');
            
            // Update aria-expanded for accessibility
            const isExpanded = navMenu.classList.contains('show');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle Escape key to close mobile menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });
    }
}
