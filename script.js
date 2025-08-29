// ===== FIREBASE CONFIGURATION =====
const firebaseConfig = {
    apiKey: "AIzaSyBZ1_56GJ5tOhK5Eth6cXscv8jnM4bpdEI",
    authDomain: "emlaksende-8646a.firebaseapp.com",
    databaseURL: "https://emlaksende-8646a-default-rtdb.firebaseio.com/",
    projectId: "emlaksende-8646a",
    storageBucket: "emlaksende-8646a.firebasestorage.app",
    messagingSenderId: "861976091519",
    appId: "1:861976091519:web:a24b7811322e3fc97dd84a"
};

// Initialize Firebase
let database;
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log('Firebase initialized in script.js');
} else {
    console.error('Firebase SDK not loaded in script.js');
}

// ===== CITY AND DISTRICT DATA =====
const cityData = {
    istanbul: [
        'Kadıköy', 'Beşiktaş', 'Şişli', 'Bakırköy', 'Üsküdar', 
        'Beyoğlu', 'Fatih', 'Maltepe', 'Pendik', 'Kartal',
        'Başakşehir', 'Küçükçekmece', 'Büyükçekmece', 'Avcılar', 'Bahçelievler'
    ],
    ankara: [
        'Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Sincan',
        'Altındağ', 'Pursaklar', 'Etimesgut', 'Gölbaşı', 'Polatlı',
        'Çubuk', 'Beypazarı', 'Ayaş', 'Kalecik', 'Kızılcahamam'
    ],
    izmir: [
        'Konak', 'Karşıyaka', 'Bornova', 'Bayraklı', 'Buca',
        'Gaziemir', 'Balçova', 'Narlıdere', 'Çiğli', 'Aliağa',
        'Menemen', 'Torbalı', 'Ödemiş', 'Tire', 'Kemalpaşa'
    ],
    bursa: [
        'Osmangazi', 'Nilüfer', 'Yıldırım', 'Gürsu', 'Kestel',
        'Mudanya', 'Gemlik', 'İnegöl', 'Orhaneli', 'Büyükorhan',
        'Karacabey', 'Mustafakemalpaşa', 'Orhangazi', 'İznik', 'Yenişehir'
    ],
    antalya: [
        'Muratpaşa', 'Kepez', 'Konyaaltı', 'Aksu', 'Döşemealtı',
        'Alanya', 'Manavgat', 'Serik', 'Kumluca', 'Kaş',
        'Finike', 'Demre', 'Elmalı', 'Korkuteli', 'Akseki'
    ]
};

// ===== DOM ELEMENTS =====
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const citySelect = document.getElementById('citySelect');
const districtSelect = document.getElementById('districtSelect');
const zoningSelect = document.getElementById('zoningSelect');
const searchButton = document.getElementById('searchButton');

// ===== MOBILE MENU FUNCTIONALITY =====
function initializeMobileMenu() {
    mobileToggle.addEventListener('click', function() {
        // Toggle active class on mobile toggle button
        mobileToggle.classList.toggle('active');
        
        // Toggle active class on navigation menu
        navMenu.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        const isExpanded = navMenu.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = mobileToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== CITY DISTRICT FUNCTIONALITY =====
function initializeCityDistrictSelection() {
    citySelect.addEventListener('change', function() {
        const selectedCity = this.value;
        
        // Clear district select
        districtSelect.innerHTML = '<option value="">İlçe Seç</option>';
        
        if (selectedCity && cityData[selectedCity]) {
            // Enable district select
            districtSelect.disabled = false;
            
            // Populate district options
            cityData[selectedCity].forEach(district => {
                const option = document.createElement('option');
                option.value = district.toLowerCase().replace(/\s+/g, '-').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u');
                option.textContent = district;
                districtSelect.appendChild(option);
            });
            
            console.log('Şehir seçildi:', selectedCity);
        } else {
            // Disable district select if no city selected
            districtSelect.disabled = true;
            console.log('Şehir seçimi temizlendi');
        }
    });

    // Log district selection
    districtSelect.addEventListener('change', function() {
        if (this.value) {
            console.log('İlçe seçildi:', this.value);
        } else {
            console.log('İlçe seçimi temizlendi');
        }
    });

    // Log zoning selection
    zoningSelect.addEventListener('change', function() {
        if (this.value) {
            console.log('İmar durumu seçildi:', this.value);
        } else {
            console.log('İmar durumu seçimi temizlendi');
        }
    });
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearchFunctionality() {
    searchButton.addEventListener('click', function() {
        // Get selected values
        const selectedCity = citySelect.value;
        const selectedDistrict = districtSelect.value;
        const selectedZoning = zoningSelect.value;
        
        // Get selected text values
        const selectedCityText = citySelect.options[citySelect.selectedIndex].text;
        const selectedDistrictText = districtSelect.options[districtSelect.selectedIndex].text;
        const selectedZoningText = zoningSelect.options[zoningSelect.selectedIndex].text;
        
        // Prepare search data
        const searchData = {
            city: {
                value: selectedCity,
                text: selectedCityText !== 'Şehir Seç' ? selectedCityText : ''
            },
            district: {
                value: selectedDistrict,
                text: selectedDistrictText !== 'İlçe Seç' ? selectedDistrictText : ''
            },
            zoning: {
                value: selectedZoning,
                text: selectedZoningText !== 'İmar Durumu Seç' ? selectedZoningText : ''
            }
        };
        
        // Log search data
        console.log('=== DETAYLI ARAMA ===');
        console.log('Arama Verileri:', searchData);
        console.log('Şehir:', searchData.city.text || 'Seçilmedi');
        console.log('İlçe:', searchData.district.text || 'Seçilmedi');
        console.log('İmar Durumu:', searchData.zoning.text || 'Seçilmedi');
        console.log('====================');
        
        // Show user feedback (you can replace this with actual search functionality)
        if (searchData.city.text || searchData.district.text || searchData.zoning.text) {
            alert(`Arama başlatılıyor...\n\nŞehir: ${searchData.city.text || 'Tümü'}\nİlçe: ${searchData.district.text || 'Tümü'}\nİmar Durumu: ${searchData.zoning.text || 'Tümü'}`);
        } else {
            alert('Lütfen en az bir arama kriteri seçiniz.');
        }
    });
}

// ===== SMOOTH SCROLLING FOR INTERNAL LINKS =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== HEADER SCROLL EFFECT =====
function initializeHeaderScrollEffect() {
    const header = document.getElementById('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 0) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    }, false);
}

// ===== FORM VALIDATION =====
function initializeFormValidation() {
    const selects = [citySelect, districtSelect, zoningSelect];
    
    selects.forEach(select => {
        select.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ef4444';
        });
        
        select.addEventListener('change', function() {
            this.style.borderColor = '#e5e7eb';
        });
    });
}

// ===== KEYBOARD ACCESSIBILITY =====
function initializeKeyboardAccessibility() {
    // Handle Enter key on search button
    searchButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    // Handle Escape key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.focus();
        }
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizePerformance() {
    // Lazy loading for background image
    const heroBackground = document.querySelector('.hero-background');
    
    // Preload critical images
    const criticalImages = ['images/emlaksendelogo.png', 'images/background.jpg'];
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Debounce scroll events
    let scrollTimeout;
    function handleScroll() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            initializeHeaderScrollEffect();
        }, 10);
    }
}

// ===== PROCESS SECTION ANIMATIONS =====
function initializeProcessAnimations() {
    const processSection = document.getElementById('processSection');
    const processSteps = document.querySelectorAll('.process-step');
    
    if (!processSection || processSteps.length === 0) return;
    
    // Intersection Observer for process section
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger step animations
                processSteps.forEach((step, index) => {
                    setTimeout(() => {
                        step.classList.add('animate');
                    }, index * 200); // Stagger animation
                });
                
                // Unobserve after animation triggered
                processObserver.unobserve(entry.target);
                
                console.log('Process section animasyonları başlatıldı');
            }
        });
    }, {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: '0px 0px -100px 0px' // Start animation slightly before section comes into view
    });
    
    processObserver.observe(processSection);
}

// ===== PROPERTIES SECTION ANIMATIONS =====
function initializePropertiesAnimations() {
    const propertiesSection = document.getElementById('propertiesSection');
    const propertyCards = document.querySelectorAll('.property-card');
    
    if (!propertiesSection || propertyCards.length === 0) return;
    
    // Intersection Observer for properties section
    const propertiesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger card animations
                propertyCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, index * 100); // Stagger animation (faster than process steps)
                });
                
                // Unobserve after animation triggered
                propertiesObserver.unobserve(entry.target);
                
                console.log('Properties section animasyonları başlatıldı');
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of section is visible
        rootMargin: '0px 0px -50px 0px' // Start animation earlier
    });
    
    propertiesObserver.observe(propertiesSection);
}

// ===== PROPERTIES INTERACTION =====
function initializePropertiesInteraction() {
    // Property card click handlers
    const propertyCards = document.querySelectorAll('.property-card');
    const propertyBtns = document.querySelectorAll('.property-btn');
    
    propertyCards.forEach((card, index) => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on button
            if (e.target.closest('.property-btn')) return;
            
            const propertyNumber = index + 1;
            console.log(`Property Card ${propertyNumber} tıklandı`);
            
            // Here you can add navigation to property detail page
            // window.location.href = `/property/${propertyNumber}`;
        });
    });
    
    propertyBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            
            const propertyNumber = index + 1;
            console.log(`İncele butonu tıklandı - Property ${propertyNumber}`);
            
            // Here you can add property inspection functionality
            // showPropertyModal(propertyNumber);
        });
    });
    
    // Header buttons
    const btnSecondary = document.querySelector('.btn-secondary');
    const btnPrimary = document.querySelector('.btn-primary');
    
    if (btnSecondary) {
        btnSecondary.addEventListener('click', function() {
            console.log('Tüm İlanları Gör butonu tıklandı');
            // Navigate to all properties page
        });
    }
    
    if (btnPrimary) {
        btnPrimary.addEventListener('click', function() {
            console.log('Şehir Seçin butonu tıklandı');
            // Show city selection modal or dropdown
        });
    }
}

// ===== TESTIMONIALS SECTION ANIMATIONS =====
function initializeTestimonialsAnimations() {
    const testimonialsSection = document.getElementById('testimonialsSection');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (!testimonialsSection || testimonialCards.length === 0) return;
    
    // Intersection Observer for testimonials section
    const testimonialsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger card animations
                testimonialCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate');
                    }, index * 150); // Stagger animation
                });
                
                // Unobserve after animation triggered
                testimonialsObserver.unobserve(entry.target);
                
                console.log('Testimonials section animasyonları başlatıldı');
            }
        });
    }, {
        threshold: 0.2, // Trigger when 20% of section is visible
        rootMargin: '0px 0px -50px 0px'
    });
    
    testimonialsObserver.observe(testimonialsSection);
}

// ===== TESTIMONIALS SLIDER =====
function initializeTestimonialsSlider() {
    const slider = document.getElementById('testimonialsSlider');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dots = document.querySelectorAll('.dot');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (!slider || !prevBtn || !nextBtn || dots.length === 0) return;
    
    let currentSlide = 0;
    let cardsPerView = 5; // Default desktop
    let autoplayInterval;
    let isTransitioning = false;
    
    // Determine cards per view based on screen size
    function updateCardsPerView() {
        const width = window.innerWidth;
        if (width < 768) {
            cardsPerView = 1; // Mobile
        } else if (width < 1200) {
            cardsPerView = 3; // Tablet
        } else {
            cardsPerView = 5; // Desktop
        }
        
        // Update card widths
        cards.forEach(card => {
            if (width < 768) {
                card.style.width = '100%';
            } else if (width < 1200) {
                card.style.width = 'calc(33.333% - 16px)';
            } else {
                card.style.width = 'calc(20% - 19.2px)';
            }
        });
    }
    
    // Calculate maximum slides
    function getMaxSlides() {
        return Math.max(0, cards.length - cardsPerView);
    }
    
    // Update slider position
    function updateSlider() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        const maxSlides = getMaxSlides();
        currentSlide = Math.max(0, Math.min(currentSlide, maxSlides));
        
        const slideWidth = 100 / cardsPerView;
        const translateX = -(currentSlide * slideWidth);
        
        slider.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update arrow states
        prevBtn.style.opacity = currentSlide === 0 ? '0.6' : '1';
        nextBtn.style.opacity = currentSlide === maxSlides ? '0.6' : '1';
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    // Next slide
    function nextSlide() {
        const maxSlides = getMaxSlides();
        if (currentSlide < maxSlides) {
            currentSlide++;
            updateSlider();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        const maxSlides = getMaxSlides();
        currentSlide = Math.max(0, Math.min(slideIndex, maxSlides));
        updateSlider();
    }
    
    // Autoplay functionality
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            const maxSlides = getMaxSlides();
            if (currentSlide >= maxSlides) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateSlider();
        }, 4000); // 4 seconds
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
        setTimeout(startAutoplay, 8000); // Restart autoplay after 8 seconds
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoplay();
        setTimeout(startAutoplay, 8000);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoplay();
            setTimeout(startAutoplay, 8000);
        });
    });
    
    // Touch/Swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            stopAutoplay();
            setTimeout(startAutoplay, 8000);
        }
    }
    
    // Pause autoplay on hover
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        updateCardsPerView();
        updateSlider();
    });
    
    // Initialize
    updateCardsPerView();
    updateSlider();
    startAutoplay();
    
    console.log('Testimonials slider başlatıldı');
}

// ===== FAQ FUNCTIONALITY =====
function initializeFAQ() {
    const searchToggle = document.getElementById('faqSearchToggle');
    const searchContainer = document.getElementById('faqSearchContainer');
    const searchInput = document.getElementById('faqSearchInput');
    const tabs = document.querySelectorAll('.faq-tab');
    const tabContents = document.querySelectorAll('.faq-tab-content');
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Search functionality
    if (searchToggle && searchContainer) {
        searchToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            searchContainer.classList.toggle('active');
            if (searchContainer.classList.contains('active')) {
                setTimeout(() => {
                    if (searchInput) {
                        searchInput.focus();
                    }
                }, 100);
            }
            console.log('FAQ arama butonu tıklandı - mobil ve desktop uyumlu');
        });
        
        // Touch events for mobile compatibility
        searchToggle.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            searchContainer.classList.toggle('active');
            if (searchContainer.classList.contains('active')) {
                setTimeout(() => {
                    if (searchInput) {
                        searchInput.focus();
                    }
                }, 100);
            }
        });
    }
    
    // Search input functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const questionText = item.querySelector('.faq-question span').textContent.toLowerCase();
                const answerText = item.querySelector('.faq-answer p').textContent.toLowerCase();
                
                if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = searchTerm ? 'none' : 'block';
                }
            });
        });
    }
    
    // Tab functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            console.log(`FAQ tab değiştirildi: ${targetTab}`);
        });
    });
    
    // Accordion functionality
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon');
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('.faq-icon');
                    
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.classList.remove('active');
                    if (otherIcon) otherIcon.textContent = '▶';
                }
            });
            
            // Toggle current FAQ item
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
                if (icon) icon.textContent = '▶';
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
                if (icon) icon.textContent = '▶';
            }
            
            console.log('FAQ accordion toggled');
        });
    });
    
    console.log('FAQ fonksiyonları başlatıldı');
}

// ===== ABOUT SECTION FUNCTIONALITY =====
function initializeAboutSection() {
    const readMoreBtn = document.getElementById('readMoreBtn');
    const fullText = document.getElementById('aboutFullText');
    const btnText = readMoreBtn?.querySelector('.btn-text');
    
    if (!readMoreBtn || !fullText || !btnText) return;
    
    readMoreBtn.addEventListener('click', () => {
        const isExpanded = fullText.classList.contains('expanded');
        
        if (isExpanded) {
            fullText.classList.remove('expanded');
            readMoreBtn.classList.remove('expanded');
            btnText.textContent = 'Devamını Oku';
        } else {
            fullText.classList.add('expanded');
            readMoreBtn.classList.add('expanded');
            btnText.textContent = 'Daha Az Göster';
        }
        
        console.log(`About section ${isExpanded ? 'kapatıldı' : 'genişletildi'}`);
    });
    
    console.log('About section fonksiyonları başlatıldı');
}

// ===== FOOTER FUNCTIONALITY =====
function initializeFooterFunctionality() {
    const newsletterBtn = document.getElementById('newsletterBtn');
    const newsletterEmail = document.getElementById('newsletterEmail');
    
    if (!newsletterBtn || !newsletterEmail) return;
    
    // Newsletter subscription
    newsletterBtn.addEventListener('click', () => {
        const email = newsletterEmail.value.trim();
        
        if (!email) {
            alert('Lütfen e-posta adresinizi girin.');
            newsletterEmail.focus();
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Lütfen geçerli bir e-posta adresi girin.');
            newsletterEmail.focus();
            return;
        }
        
        // Simulate newsletter subscription
        console.log(`Newsletter subscription: ${email}`);
        alert('Başarıyla abone oldunuz! Teşekkürler.');
        newsletterEmail.value = '';
    });
    
    // Enter key support for newsletter input
    newsletterEmail.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            newsletterBtn.click();
        }
    });
    
    // WhatsApp button
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            const phoneNumber = '905324444203'; // WhatsApp number
            const message = 'Merhaba, Emlaksende hakkında bilgi almak istiyorum.';
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Social media links
    const socialIcons = document.querySelectorAll('.social-icon, .social-icons a');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = icon.getAttribute('aria-label') || 'Social Media';
            console.log(`${platform} bağlantısına tıklandı`);
            // In real implementation, you would redirect to actual social media pages
        });
    });
    
    // Footer links tracking
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.textContent.trim();
            console.log(`Footer link tıklandı: ${linkText}`);
            // In real implementation, you would handle navigation
        });
    });
    
    console.log('Footer fonksiyonları başlatıldı');
}

// ===== SCROLL-TRIGGERED ANIMATIONS =====
function initializeScrollAnimations() {
    // Check if browser supports Intersection Observer
    if ('IntersectionObserver' in window) {
        initializeProcessAnimations();
        initializePropertiesAnimations();
        initializeTestimonialsAnimations();
    } else {
        // Fallback for older browsers - immediately show all animations
        const processSteps = document.querySelectorAll('.process-step');
        const propertyCards = document.querySelectorAll('.property-card');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        processSteps.forEach(step => {
            step.classList.add('animate');
        });
        
        propertyCards.forEach(card => {
            card.classList.add('animate');
        });
        
        testimonialCards.forEach(card => {
            card.classList.add('animate');
        });
        
        console.log('Intersection Observer desteklenmiyor, animasyonlar direkt gösteriliyor');
    }
}

// ===== DYNAMIC HERO BACKGROUND =====
function loadDynamicHeroBackground() {
    console.log('Firebase\'den ana resim yükleniyor...');
    
    const heroElement = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (!heroElement || !heroBackground) {
        console.error('Hero elementleri bulunamadı');
        return;
    }

    // Firebase'den ana resim verisini çek
    const mainImageRef = database.ref('site-settings/main-image');
    
    console.log('Firebase referansı oluşturuldu:', mainImageRef.toString());
    
    mainImageRef.once('value')
        .then((snapshot) => {
            console.log('Firebase\'den veri alındı:', snapshot.val());
            const data = snapshot.val();
            
            if (data && data.url && data.isActive) {
                console.log('Ana resim Firebase\'den alındı:', data.url);
                
                // Yeni resmi önceden yükle
                const img = new Image();
                img.onload = function() {
                    // Resim yüklendikten sonra background'ı güncelle
                    heroBackground.style.backgroundImage = `url('${data.url}')`;
                    
                    // Yumuşak geçiş efekti
                    heroBackground.style.opacity = '0';
                    setTimeout(() => {
                        heroBackground.style.opacity = '1';
                    }, 100);
                    
                    console.log('Ana resim başarıyla güncellendi');
                };
                
                img.onerror = function() {
                    console.error('Ana resim yüklenemedi, varsayılan resim kullanılıyor');
                    loadDefaultHeroBackground();
                };
                
                img.src = data.url;
                
            } else {
                console.log('Aktif ana resim bulunamadı, varsayılan resim kullanılıyor');
                console.log('Mevcut veri:', data);
                loadDefaultHeroBackground();
            }
        })
        .catch((error) => {
            console.error('Firebase\'den ana resim alınırken hata:', error);
            console.error('Hata detayları:', {
                code: error.code,
                message: error.message,
                stack: error.stack
            });
            loadDefaultHeroBackground();
        });
}

function loadDefaultHeroBackground() {
    console.log('Varsayılan ana resim yükleniyor...');
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        heroBackground.style.backgroundImage = "url('images/background.jpg')";
        heroBackground.style.opacity = '1';
    }
}

// Real-time güncelleme için listener ekle
function initializeHeroBackgroundListener() {
    const mainImageRef = database.ref('site-settings/main-image');
    
    mainImageRef.on('value', (snapshot) => {
        const data = snapshot.val();
        
        if (data && data.url && data.isActive) {
            console.log('Ana resim real-time güncellendi:', data.url);
            
            const heroBackground = document.querySelector('.hero-background');
            if (heroBackground) {
                // Geçiş efekti ile güncelle
                heroBackground.style.transition = 'opacity 0.5s ease';
                heroBackground.style.opacity = '0.7';
                
                setTimeout(() => {
                    heroBackground.style.backgroundImage = `url('${data.url}')`;
                    heroBackground.style.opacity = '1';
                }, 250);
            }
        }
    });
}

// Firebase bağlantısını test et
function testFirebaseConnection() {
    console.log('Firebase bağlantısı test ediliyor...');
    
    // Basit bir test verisi yaz
    const testRef = database.ref('test-connection');
    testRef.set({
        timestamp: Date.now(),
        message: 'Firebase bağlantısı çalışıyor'
    })
    .then(() => {
        console.log('✅ Firebase yazma testi başarılı');
        
        // Test verisini oku
        return testRef.once('value');
    })
    .then((snapshot) => {
        console.log('✅ Firebase okuma testi başarılı:', snapshot.val());
        
        // Test verisini sil
        return testRef.remove();
    })
    .then(() => {
        console.log('✅ Firebase silme testi başarılı');
    })
    .catch((error) => {
        console.error('❌ Firebase test hatası:', error);
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('EMLAKSENDE - Landing sayfası yüklendi');
    
    // Firebase bağlantısını test et
    testFirebaseConnection();
    
    // Initialize Firebase functionality first
    loadDynamicHeroBackground();
    initializeHeroBackgroundListener();
    
    // Initialize all other functionality
    initializeMobileMenu();
    initializeCityDistrictSelection();
    initializeSearchFunctionality();
    initializeSmoothScrolling();
    initializeHeaderScrollEffect();
    initializeFormValidation();
    initializeKeyboardAccessibility();
    optimizePerformance();
    initializeScrollAnimations();
    initializePropertiesInteraction();
    initializeTestimonialsSlider();
    initializeFAQ();
    initializeAboutSection();
    initializeFooterFunctionality();
    
    console.log('Tüm JavaScript fonksiyonları başarıyla yüklendi');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Hatası:', e.error);
});

// ===== ANALYTICS & TRACKING (Optional) =====
function trackUserInteraction(action, category, label) {
    console.log(`Tracking: ${category} - ${action} - ${label}`);
    // Here you can integrate with Google Analytics or other tracking services
}

// Track search interactions
if (searchButton) {
    searchButton.addEventListener('click', () => {
        trackUserInteraction('click', 'search', 'detailed_search_button');
    });
}

// Track menu interactions
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        trackUserInteraction('click', 'navigation', 'mobile_menu_toggle');
    });
}

// ===== FIREBASE INTEGRATION ===== //

// Use existing Firebase configuration from top of file
if (typeof firebase !== 'undefined' && typeof database !== 'undefined') {
    
    // Load properties from Firebase
    function loadPropertiesFromFirebase() {
        const propertiesGrid = document.getElementById('propertiesGrid');
        const loadingPlaceholder = document.getElementById('loadingPlaceholder');
        
        if (!propertiesGrid || !loadingPlaceholder) {
            console.error('Properties grid or loading placeholder not found');
            return;
        }
        
        if (!database) {
            console.error('Database not initialized in loadPropertiesFromFirebase');
            loadingPlaceholder.innerHTML = '<p>Firebase bağlantısı kurulamadı.</p>';
            return;
        }
        
        console.log('Loading properties from Firebase...');
        
        // Get latest 6 properties ordered by createdAt
        database.ref('ilanlar').orderByChild('createdAt').limitToLast(6).once('value')
            .then((snapshot) => {
                loadingPlaceholder.style.display = 'none';
                
                if (!snapshot.exists()) {
                    propertiesGrid.innerHTML = '<p>Henüz ilan bulunamadı.</p>';
                    return;
                }
                
                const properties = [];
                snapshot.forEach((childSnapshot) => {
                    const propertyData = childSnapshot.val();
                    propertyData.id = childSnapshot.key;
                    properties.unshift(propertyData); // Reverse to get latest first
                });
                
                console.log('Loaded properties:', properties);
                
                // Debug: Log photos structure for each property
                properties.forEach((property, index) => {
                    console.log(`Property ${index + 1} photos:`, property.photos);
                    if (property.photos) {
                        console.log(`Photos type:`, typeof property.photos);
                        console.log(`Is array:`, Array.isArray(property.photos));
                        if (typeof property.photos === 'object' && !Array.isArray(property.photos)) {
                            console.log(`Photos keys:`, Object.keys(property.photos));
                            console.log(`Photos values:`, Object.values(property.photos));
                        }
                    }
                });
                
                renderProperties(properties);
            })
            .catch((error) => {
                console.error('Error loading properties:', error);
                loadingPlaceholder.innerHTML = '<p>İlanlar yüklenirken bir hata oluştu.</p>';
            });
    }
    
    // Render properties to DOM
    function renderProperties(properties) {
        const propertiesGrid = document.getElementById('propertiesGrid');
        
        if (!propertiesGrid) {
            console.error('Properties grid not found!');
            return;
        }
        
        console.log('Rendering properties to grid:', properties.length);
        propertiesGrid.innerHTML = '';
        
        properties.forEach((property, index) => {
            const propertyCard = createPropertyCard(property, index + 1);
            console.log('Created property card:', propertyCard);
            propertiesGrid.appendChild(propertyCard);
        });
        
        console.log('Properties rendered. Grid children count:', propertiesGrid.children.length);
        
        // Debug: Check what's actually in the DOM
        console.log('Grid HTML content length:', propertiesGrid.innerHTML.length);
        const images = propertiesGrid.querySelectorAll('img');
        console.log('Total images found in grid:', images.length);
        images.forEach((img, i) => {
            console.log(`Image ${i} src:`, img.src);
            console.log(`Image ${i} loaded:`, img.complete);
            console.log(`Image ${i} visible:`, img.offsetWidth > 0 && img.offsetHeight > 0);
        });
    }
    
    // Create property card element
    function createPropertyCard(property, index) {
        if (!property) return null;

        console.log(`Creating property card for:`, property);

        // Create property wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'property-wrapper';
        
        // Get primary photo
        let photoUrl = 'images/asa.png'; // Default fallback
        
        console.log(`Processing photos for property ${property.id}:`, property.photos);
        
        if (property.photos) {
            // Handle both array and object formats
            let photosArray = [];
            
            if (Array.isArray(property.photos)) {
                photosArray = property.photos;
                console.log('Photos is array:', photosArray);
            } else if (typeof property.photos === 'object') {
                // Convert object to array (handles numeric indices like 0, 1, 2...)
                photosArray = Object.values(property.photos).filter(photo => photo && typeof photo === 'object');
                console.log('Photos converted from object to array:', photosArray);
                
                // Additional check: if object has numeric keys like "0", "1", "2"
                const keys = Object.keys(property.photos);
                if (keys.every(key => !isNaN(key))) {
                    console.log('Detected numeric keys, treating as indexed object');
                }
            }
            
            // Find primary photo or use first one
            const primaryPhoto = photosArray.find(photo => photo && photo.isPrimary);
            const firstPhoto = photosArray[0];
            
            console.log('Primary photo:', primaryPhoto);
            console.log('First photo:', firstPhoto);
            
            const selectedPhoto = primaryPhoto || firstPhoto;
            
            if (selectedPhoto && selectedPhoto.url) {
                photoUrl = selectedPhoto.url;
                console.log('Selected photo URL:', photoUrl);
            } else {
                console.log('No valid photo found, using fallback');
            }
        } else {
            console.log('No photos property found');
        }
        
        console.log('Final photoUrl for property card:', photoUrl);
        
        // Format date
        const createdDate = property.createdAt ? new Date(property.createdAt) : new Date();
        const formattedDate = createdDate.toLocaleDateString('tr-TR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
        
        // Determine status
        const status = property.status === 'aktif' ? 'available' : 
                      property.status === 'satildi' ? 'sold' : 'reserved';
        const statusText = property.status === 'aktif' ? 'Müsait' : 
                          property.status === 'satildi' ? 'Satıldı' : 'Rezerve';
        
        // Format price
        const formattedPrice = new Intl.NumberFormat('tr-TR').format(property.toplamFiyat);
        
        // Format location
        const location = `${property.sehir ? property.sehir.charAt(0).toUpperCase() + property.sehir.slice(1) : ''}, ${property.ilce ? property.ilce.charAt(0).toUpperCase() + property.ilce.slice(1) : ''}`;
        
        // Format area
        const formattedArea = `${property.metrekare ? property.metrekare.toLocaleString('tr-TR') : '0'} m²`;
        
        // HARDCORE APPROACH: Manual DOM creation
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';
        propertyCard.setAttribute('data-property', index);
        
        const propertyImage = document.createElement('div');
        propertyImage.className = 'property-image';
        
        const img = document.createElement('img');
        img.src = photoUrl;
        img.alt = 'Property Photo';
        img.className = 'property-asa-logo';
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block;';
        
        const badges = document.createElement('div');
        badges.className = 'property-badges';
        badges.innerHTML = `
            <span class="property-date">${formattedDate}</span>
            <span class="property-status ${status}">${statusText}</span>
        `;
        
        const area = document.createElement('div');
        area.className = 'property-area';
        area.textContent = formattedArea;
        
        propertyImage.appendChild(img);
        propertyImage.appendChild(badges);
        propertyImage.appendChild(area);
        
        const propertyContent = document.createElement('div');
        propertyContent.className = 'property-content';
        propertyContent.innerHTML = `
            <div class="property-info">
                <div class="property-location">${location}</div>
                <div class="property-price">${formattedPrice}₺</div>
            </div>
            <button class="property-btn" onclick="goToPropertyDetail('${property.id}')">
                <span>İncele</span>
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5S5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14Z"/>
                </svg>
            </button>
        `;
        
        // Assemble card
        propertyCard.appendChild(propertyImage);
        
        // Assemble wrapper
        wrapper.appendChild(propertyCard);
        wrapper.appendChild(propertyContent);
        
        console.log('MANUAL DOM CREATION - IMG SRC:', img.src);
        
        return wrapper;
    }
    
    // Navigate to property detail page
    function goToPropertyDetail(propertyId) {
        window.open(`detay.html?id=${propertyId}`, '_blank');
    }
    
    // Make function global for onclick handlers
    window.goToPropertyDetail = goToPropertyDetail;
    
    // Load properties when page loads
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded fired!');
        // Wait a bit for Firebase SDK to be fully loaded, then initialize
        setTimeout(() => {
            // Only load properties if we're on the index page
            const grid = document.getElementById('propertiesGrid');
            console.log('Properties grid found:', grid);
            if (grid) {
                console.log('Loading properties from Firebase...');
                loadPropertiesFromFirebase();
            } else {
                console.log('Properties grid not found - not on index page');
            }
        }, 500);
    });
    
} else {
    console.error('Firebase SDK not loaded');
}
