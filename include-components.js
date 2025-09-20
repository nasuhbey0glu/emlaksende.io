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
        
        // Arama fonksiyonlarını initialize et
        initializeSearchFunctions();
        
    } catch (error) {
        console.error('Header yüklenirken hata oluştu:', error);
    }
}

// Footer yükleme fonksiyonu
async function loadFooter() {
    console.log('Footer yükleme başlatıldı...');
    try {
        const response = await fetch('footer.html');
        console.log('Footer fetch response:', response);
        const footerHtml = await response.text();
        console.log('Footer HTML yüklendi, uzunluk:', footerHtml.length);
        
        // Footer container'ı bul veya oluştur
        let footerContainer = document.getElementById('footer-container');
        console.log('Footer container bulundu:', footerContainer);
        if (!footerContainer) {
            footerContainer = document.createElement('div');
            footerContainer.id = 'footer-container';
            document.body.appendChild(footerContainer);
            console.log('Footer container oluşturuldu');
        }
        
        footerContainer.innerHTML = footerHtml;
        console.log('Footer HTML eklendi');
        
        // Footer HTML'inin içeriğini kontrol et
        console.log('Footer container innerHTML uzunluğu:', footerContainer.innerHTML.length);
        console.log('Footer container innerHTML başlangıcı:', footerContainer.innerHTML.substring(0, 200));
        console.log('Footer container innerHTML sonu:', footerContainer.innerHTML.substring(footerContainer.innerHTML.length - 200));
        
        // Footer-bottom arama
        const footerBottomIndex = footerContainer.innerHTML.indexOf('footer-bottom');
        console.log('Footer-bottom index:', footerBottomIndex);
        if (footerBottomIndex !== -1) {
            console.log('Footer-bottom bulundu, konum:', footerBottomIndex);
            console.log('Footer-bottom çevresindeki metin:', footerContainer.innerHTML.substring(footerBottomIndex - 50, footerBottomIndex + 100));
        } else {
            console.log('Footer-bottom bulunamadı!');
        }
        
        // Footer HTML'inin tam uzunluğunu kontrol et
        console.log('Footer HTML uzunluğu:', footerHtml.length);
        console.log('Footer container innerHTML uzunluğu:', footerContainer.innerHTML.length);
        console.log('Fark:', footerHtml.length - footerContainer.innerHTML.length);
        
        // Footer HTML'inin sonunu kontrol et
        console.log('Footer HTML sonu:', footerHtml.substring(footerHtml.length - 200));
        console.log('Footer container innerHTML sonu:', footerContainer.innerHTML.substring(footerContainer.innerHTML.length - 200));
        
        // Footer HTML'inin kesilme noktasını bul
        const cutPoint = footerContainer.innerHTML.length;
        console.log('Kesilme noktası:', cutPoint);
        console.log('Kesilme noktası çevresindeki metin:', footerHtml.substring(cutPoint - 100, cutPoint + 100));
        
        // Footer HTML'inin tam uzunluğunu kontrol et
        console.log('Footer HTML gerçek uzunluk:', footerHtml.length);
        console.log('Footer HTML son 200 karakter:', footerHtml.substring(footerHtml.length - 200));
        
        // Footer-bottom kısmını kontrol et
        const footerBottom = footerContainer.querySelector('.footer-bottom');
        console.log('Footer-bottom elementi:', footerBottom);
        if (footerBottom) {
            console.log('Footer-bottom bulundu, display:', window.getComputedStyle(footerBottom).display);
        } else {
            console.log('Footer-bottom bulunamadı!');
            // Tüm div'leri kontrol et
            const allDivs = footerContainer.querySelectorAll('div');
            console.log('Toplam div sayısı:', allDivs.length);
            allDivs.forEach((div, index) => {
                if (div.className.includes('footer')) {
                    console.log(`Div ${index}:`, div.className, div);
                }
            });
        }
        
    } catch (error) {
        console.error('Footer yüklenirken hata oluştu:', error);
        console.error('Hata detayı:', error.message);
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

// Arama fonksiyonlarını initialize et
function initializeSearchFunctions() {
    // Arama fonksiyonalitesi - Global scope'ta tanımla
    window.performSearch = function(searchTerm) {
        console.log('Performing search for:', searchTerm);
        // Arama terimini URL parametresi olarak ilanlarcopy.html sayfasına gönder
        const searchUrl = `ilanlarcopy.html?search=${encodeURIComponent(searchTerm)}`;
        console.log('Redirecting to:', searchUrl);
        window.location.href = searchUrl;
    };
    
    // Inline event handler fonksiyonları - Global scope'ta tanımla
    window.handleSearchKeypress = function(event, input) {
        console.log('Key pressed:', event.key);
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchTerm = input.value.trim();
            console.log('Enter pressed, search term:', searchTerm);
            if (searchTerm) {
                window.performSearch(searchTerm);
            }
        }
    };
    
    window.handleSearchClick = function(icon) {
        console.log('Search icon clicked');
        const input = icon.parentElement.querySelector('.search-input');
        if (input) {
            const searchTerm = input.value.trim();
            console.log('Icon clicked, search term:', searchTerm);
            if (searchTerm) {
                window.performSearch(searchTerm);
            }
        }
    };
    
    console.log('Search functions initialized');
}
