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
const citySelect = document.getElementById('citySelect');
const districtSelect = document.getElementById('districtSelect');
const zoningSelect = document.getElementById('zoningSelect');
const searchButton = document.getElementById('searchButton');
const citySelectBtn = document.getElementById('citySelectBtn');
const cityModal = document.getElementById('cityModal');
const cityModalClose = document.getElementById('cityModalClose');
const cityGrid = document.getElementById('cityGrid');

// ===== MOBILE MENU FUNCTIONALITY =====
// Header functionality is now handled by header.html

// ===== CITY DISTRICT FUNCTIONALITY =====
function initializeCityDistrictSelection() {
    // Load cities and districts from Firebase
    loadCitiesAndDistrictsFromFirebase();
    
    citySelect.addEventListener('change', function() {
        const selectedCity = this.value;
        
        // Clear district select
        districtSelect.innerHTML = '<option value="">İlçe Seç</option>';
        
        if (selectedCity) {
            // Enable district select
            districtSelect.disabled = false;
            
            // Load districts for selected city from Firebase
            loadDistrictsForCity(selectedCity);
            
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

// Load cities and districts from Firebase
function loadCitiesAndDistrictsFromFirebase() {
    if (!database) {
        console.error('Database not initialized');
        return;
    }
    
    console.log('Loading cities and districts from Firebase...');
    
    // Load cities from properties
    database.ref('ilanlar').once('value')
        .then((snapshot) => {
            const propertiesData = snapshot.val();
            
            if (!propertiesData) {
                console.log('No properties found for city/district loading');
                return;
            }
            
            // Get unique cities
            const cities = [...new Set(
                Object.values(propertiesData)
                    .map(property => property.sehir)
                    .filter(Boolean)
            )].sort();
            
            console.log('Available cities:', cities);
            
            // Update city select options
            updateCitySelectOptions(cities);
            
            // Load imar durumu options
            loadImarDurumuOptions();
        })
        .catch((error) => {
            console.error('Error loading cities from Firebase:', error);
        });
}

// Update city select options
function updateCitySelectOptions(cities) {
    // Clear existing options except first one
    while (citySelect.children.length > 1) {
        citySelect.removeChild(citySelect.lastChild);
    }
    
    // Add new city options
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// Load districts for selected city
function loadDistrictsForCity(selectedCity) {
    if (!database) {
        console.error('Database not initialized');
        return;
    }
    
    console.log(`Loading districts for city: ${selectedCity}`);
    
    database.ref('ilanlar').once('value')
        .then((snapshot) => {
            const propertiesData = snapshot.val();
            
            if (!propertiesData) {
                console.log('No properties found for district loading');
                return;
            }
            
            // Get districts for selected city
            const districts = [...new Set(
                Object.values(propertiesData)
                    .filter(property => property.sehir === selectedCity)
                    .map(property => property.ilce)
                    .filter(Boolean)
            )].sort();
            
            console.log(`Districts for ${selectedCity}:`, districts);
            
            // Update district select options
            districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error loading districts from Firebase:', error);
        });
}

// Load imar durumu options from Firebase
function loadImarDurumuOptions() {
    if (!database) {
        console.error('Database not initialized');
        return;
    }
    
    console.log('Loading imar durumu options from Firebase...');
    
    database.ref('imar_durumu').once('value')
        .then((snapshot) => {
            const imarData = snapshot.val();
            
            if (!imarData) {
                console.log('No imar durumu data found');
                return;
            }
            
            // Get imar durumu names
            const imarOptions = Object.values(imarData)
                .map(item => item.name)
                .filter(Boolean)
                .sort();
            
            console.log('Available imar durumu options:', imarOptions);
            
            // Update zoning select options
            updateZoningSelectOptions(imarOptions);
        })
        .catch((error) => {
            console.error('Error loading imar durumu from Firebase:', error);
        });
}

// Update zoning select options
function updateZoningSelectOptions(imarOptions) {
    // Clear existing options except first one
    while (zoningSelect.children.length > 1) {
        zoningSelect.removeChild(zoningSelect.lastChild);
    }
    
    // Add new imar durumu options
    imarOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        zoningSelect.appendChild(optionElement);
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
        
        // Navigate to ilanlar.html with search parameters
        if (searchData.city.text || searchData.district.text || searchData.zoning.text) {
            const params = new URLSearchParams();
            
            if (searchData.city.text) {
                params.append('city', searchData.city.text);
            }
            if (searchData.district.text) {
                params.append('district', searchData.district.text);
            }
            if (searchData.zoning.text) {
                params.append('zoning', searchData.zoning.text);
            }
            
            const searchUrl = `ilanlar.html?${params.toString()}`;
            console.log('Navigating to:', searchUrl);
            window.location.href = searchUrl;
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
    
    // Header functionality is now handled by header.html
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
// Bu fonksiyon Firebase testimonials sistemi ile çakıştığı için kaldırıldı
// Yeni sistem loadTestimonialsFromFirebase() ve setupTestimonialSlider() fonksiyonlarını kullanıyor

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
    // Bu fonksiyon artık loadAboutDescription tarafından handle ediliyor
    // setupReadMoreButton fonksiyonu dinamik olarak "Devamını Oku" butonunu kuruyor
    console.log('About section fonksiyonları başlatıldı (Firebase entegrasyonu ile)');
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

// ===== CITY SELECTION MODAL =====
function initializeCitySelectionModal() {
    if (!citySelectBtn || !cityModal || !cityModalClose || !cityGrid) {
        console.error('City modal elements not found');
        return;
    }
    
    // Open modal when city select button is clicked
    citySelectBtn.addEventListener('click', function() {
        console.log('City select button clicked');
        openCityModal();
    });
    
    // Close modal when close button is clicked
    cityModalClose.addEventListener('click', function() {
        closeCityModal();
    });
    
    // Close modal when clicking outside
    cityModal.addEventListener('click', function(e) {
        if (e.target === cityModal) {
            closeCityModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cityModal.classList.contains('show')) {
            closeCityModal();
        }
    });
    
    console.log('City selection modal initialized');
}

// Open city modal and load cities
function openCityModal() {
    cityModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Load cities from Firebase
    loadCitiesForModal();
}

// Close city modal
function closeCityModal() {
    cityModal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
}

// Load cities from Firebase for modal
function loadCitiesForModal() {
    if (!database) {
        console.error('Database not initialized for city modal');
        cityGrid.innerHTML = '<div class="city-loading"><p>Firebase bağlantısı kurulamadı.</p></div>';
        return;
    }
    
    console.log('Loading cities for modal from Firebase...');
    
    // Show loading state
    cityGrid.innerHTML = '<div class="city-loading"><p>Şehirler yükleniyor...</p></div>';
    
    database.ref('ilanlar').once('value')
        .then((snapshot) => {
            const propertiesData = snapshot.val();
            
            if (!propertiesData) {
                cityGrid.innerHTML = '<div class="city-loading"><p>Henüz ilan bulunamadı.</p></div>';
                return;
            }
            
            // Get unique cities with property counts
            const cityCounts = {};
            Object.values(propertiesData).forEach(property => {
                if (property.sehir) {
                    cityCounts[property.sehir] = (cityCounts[property.sehir] || 0) + 1;
                }
            });
            
            // Convert to array and sort
            const cities = Object.keys(cityCounts)
                .map(city => ({
                    name: city,
                    count: cityCounts[city]
                }))
                .sort((a, b) => a.name.localeCompare(b.name, 'tr'));
            
            console.log('Available cities for modal:', cities);
            
            // Render cities in modal
            renderCitiesInModal(cities);
        })
        .catch((error) => {
            console.error('Error loading cities for modal:', error);
            cityGrid.innerHTML = '<div class="city-loading"><p>Şehirler yüklenirken hata oluştu.</p></div>';
        });
}

// Render cities in modal
function renderCitiesInModal(cities) {
    if (cities.length === 0) {
        cityGrid.innerHTML = '<div class="city-loading"><p>Henüz şehir bulunamadı.</p></div>';
        return;
    }
    
    cityGrid.innerHTML = '';
    
    cities.forEach(city => {
        const cityItem = document.createElement('div');
        cityItem.className = 'city-item';
        cityItem.innerHTML = `
            <h4>${city.name}</h4>
            <p>${city.count} ilan</p>
        `;
        
        // Add click handler
        cityItem.addEventListener('click', function() {
            selectCityFromModal(city.name);
        });
        
        cityGrid.appendChild(cityItem);
    });
    
    console.log(`Rendered ${cities.length} cities in modal`);
}

// Handle city selection from modal
function selectCityFromModal(cityName) {
    console.log(`City selected from modal: ${cityName}`);
    
    // Close modal
    closeCityModal();
    
    // Navigate to ilanlar.html with city filter
    const params = new URLSearchParams();
    params.append('city', cityName);
    
    const searchUrl = `ilanlar.html?${params.toString()}`;
    console.log('Navigating to:', searchUrl);
    window.location.href = searchUrl;
}

// ===== ABOUT DESCRIPTION LOADING =====
function loadAboutDescription() {
    if (!database) {
        console.error('Database not initialized for about description');
        return;
    }
    
    console.log('Loading about description from Firebase...');
    
    // Firebase'den hakkımızda açıklamasını oku
    database.ref('aciklama').once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            
            if (data && data.text) {
                // about-intro kısmını güncelle
                const aboutIntro = document.getElementById('aboutIntro');
                const readMoreBtn = document.getElementById('readMoreBtn');
                
                if (aboutIntro) {
                    // Metni paragraflara böl ve HTML formatında göster
                    const formattedText = formatAboutText(data.text);
                    aboutIntro.innerHTML = formattedText;
                    
                    // Eğer metin uzunsa "Devamını Oku" butonunu göster
                    if (data.text.length > 300) {
                        setupReadMoreButton(data.text);
                    } else {
                        // Kısa metinse butonu gizle
                        if (readMoreBtn) {
                            readMoreBtn.style.display = 'none';
                        }
                    }
                    
                    console.log('About description updated successfully');
                } else {
                    console.warn('About intro element not found');
                }
            } else {
                // Firebase'de veri yoksa varsayılan metni göster
                const aboutIntro = document.getElementById('aboutIntro');
                if (aboutIntro) {
                    aboutIntro.innerHTML = `
                        <p style="color: var(--text-secondary); font-style: italic;">
                            Hakkımızda bilgisi henüz eklenmemiş. Admin panelden ekleyebilirsiniz.
                        </p>
                    `;
                }
                console.log('No about description found in Firebase');
            }
        })
        .catch((error) => {
            console.error('Error loading about description:', error);
            // Hata durumunda varsayılan mesaj göster
            const aboutIntro = document.getElementById('aboutIntro');
            if (aboutIntro) {
                aboutIntro.innerHTML = `
                    <p style="color: var(--text-secondary); font-style: italic;">
                        Hakkımızda bilgisi yüklenirken hata oluştu.
                    </p>
                `;
            }
        });
}

// Metni paragraflara böl ve HTML formatında döndür
function formatAboutText(text) {
    if (!text || !text.trim()) {
        return '<p style="color: var(--text-secondary); font-style: italic;">Henüz açıklama metni girilmedi...</p>';
    }
    
    // Metni paragraflara böl (çift satır boşluğu ile)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    
    if (paragraphs.length === 0) {
        return '<p style="color: var(--text-secondary); font-style: italic;">Henüz açıklama metni girilmedi...</p>';
    }
    
    // Her paragrafı <p> etiketi ile sar
    const formattedParagraphs = paragraphs.map(paragraph => {
        // Tek satır boşluklarını <br> ile değiştir
        const formattedParagraph = paragraph.trim().replace(/\n/g, '<br>');
        return `<p>${formattedParagraph}</p>`;
    });
    
    return formattedParagraphs.join('');
}

// "Devamını Oku" butonunu kur
function setupReadMoreButton(fullText) {
    const aboutIntro = document.getElementById('aboutIntro');
    const readMoreBtn = document.getElementById('readMoreBtn');
    const btnText = readMoreBtn?.querySelector('.btn-text');
    
    if (!aboutIntro || !readMoreBtn || !btnText) return;
    
    // Metni kısalt (ilk 300 karakter)
    const shortText = fullText.substring(0, 300) + '...';
    const shortFormattedText = formatAboutText(shortText);
    
    // İlk yüklemede kısa metni göster
    aboutIntro.innerHTML = shortFormattedText;
    readMoreBtn.style.display = 'block';
    btnText.textContent = 'Devamını Oku';
    
    // Buton durumunu takip et
    let isExpanded = false;
    
    // Event listener'ı temizle (varsa)
    readMoreBtn.replaceWith(readMoreBtn.cloneNode(true));
    const newReadMoreBtn = document.getElementById('readMoreBtn');
    const newBtnText = newReadMoreBtn.querySelector('.btn-text');
    
    newReadMoreBtn.addEventListener('click', () => {
        if (isExpanded) {
            // Kısa metni göster
            aboutIntro.innerHTML = shortFormattedText;
            newBtnText.textContent = 'Devamını Oku';
            isExpanded = false;
        } else {
            // Tam metni göster
            const fullFormattedText = formatAboutText(fullText);
            aboutIntro.innerHTML = fullFormattedText;
            newBtnText.textContent = 'Daha Az Göster';
            isExpanded = true;
        }
        
        console.log(`About section ${isExpanded ? 'genişletildi' : 'kısaltıldı'}`);
    });
}

// ===== FAQ CONTENT LOADING =====
function loadFAQContent() {
    if (!database) {
        console.error('Database not initialized for FAQ content');
        return;
    }
    
    console.log('Loading FAQ content from Firebase...');
    
    // Firebase'den soru-cevap verilerini oku
    database.ref('soru_cevap').once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            
            if (data) {
                const soruCevaplar = Object.values(data);
                renderFAQContent(soruCevaplar);
            } else {
                renderEmptyFAQ();
            }
        })
        .catch((error) => {
            console.error('Error loading FAQ content:', error);
            renderEmptyFAQ();
        });
}

// FAQ içeriğini render et
function renderFAQContent(soruCevaplar) {
    const faqTabs = document.getElementById('faqTabs');
    const faqContent = document.getElementById('faqContent');
    
    if (!faqTabs || !faqContent) {
        console.error('FAQ elements not found');
        return;
    }
    
    // Kategorilere göre grupla
    const groupedByKategori = {};
    soruCevaplar.forEach(item => {
        if (!groupedByKategori[item.kategori]) {
            groupedByKategori[item.kategori] = [];
        }
        groupedByKategori[item.kategori].push(item);
    });
    
    // Kategori isimlerini Türkçe'ye çevir
    const kategoriNames = {
        'genel': 'Genel',
        'kurulum': 'Kurulum', 
        'destek': 'Destek'
    };
    
    // Tab'ları oluştur
    let tabsHTML = '';
    let contentHTML = '';
    let isFirst = true;
    
    Object.keys(groupedByKategori).forEach(kategori => {
        const items = groupedByKategori[kategori];
        const kategoriName = kategoriNames[kategori] || kategori.charAt(0).toUpperCase() + kategori.slice(1);
        
        // Tab butonu
        tabsHTML += `
            <button class="faq-tab ${isFirst ? 'active' : ''}" data-tab="${kategori}">
                ${kategoriName}
            </button>
        `;
        
        // Tab içeriği
        contentHTML += `
            <div class="faq-tab-content ${isFirst ? 'active' : ''}" id="${kategori}">
                <div class="faq-columns">
                    <div class="faq-column">
                        ${renderFAQItems(items.slice(0, Math.ceil(items.length / 2)))}
                    </div>
                    <div class="faq-column">
                        ${renderFAQItems(items.slice(Math.ceil(items.length / 2)))}
                    </div>
                </div>
            </div>
        `;
        
        isFirst = false;
    });
    
    faqTabs.innerHTML = tabsHTML;
    faqContent.innerHTML = contentHTML;
    
    // Tab event listener'larını ekle
    initializeFAQTabs();
    
    console.log('FAQ content rendered successfully');
}

// FAQ item'larını render et
function renderFAQItems(items) {
    return items.map(item => `
        <div class="faq-item">
            <button class="faq-question" aria-expanded="false">
                <span>${item.baslik}</span>
                <span class="faq-icon">▶</span>
            </button>
            <div class="faq-answer">
                <p>${item.cevap}</p>
            </div>
        </div>
    `).join('');
}

// Boş FAQ render et
function renderEmptyFAQ() {
    const faqTabs = document.getElementById('faqTabs');
    const faqContent = document.getElementById('faqContent');
    
    if (faqTabs && faqContent) {
        faqTabs.innerHTML = `
            <button class="faq-tab active" data-tab="genel">Genel</button>
        `;
        
        faqContent.innerHTML = `
            <div class="faq-tab-content active" id="genel">
                <div class="faq-columns">
                    <div class="faq-column">
                        <div style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                            <p>Henüz soru-cevap eklenmemiş.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// FAQ tab'larını başlat
function initializeFAQTabs() {
    const faqTabs = document.querySelectorAll('.faq-tab');
    const faqTabContents = document.querySelectorAll('.faq-tab-content');
    
    faqTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Tüm tab'ları deaktif et
            faqTabs.forEach(t => t.classList.remove('active'));
            faqTabContents.forEach(content => content.classList.remove('active'));
            
            // Seçilen tab'ı aktif et
            tab.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // FAQ item'larını başlat
    initializeFAQItems();
}

// FAQ item'larını başlat
function initializeFAQItems() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon');
            
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
                icon.style.transform = 'rotate(0deg)';
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(90deg)';
            }
        });
    });
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
    loadAboutDescription();
    loadFAQContent();
    
    // Initialize all other functionality
    initializeCityDistrictSelection();
    initializeSearchFunctionality();
    initializeCitySelectionModal();
    initializeSmoothScrolling();
    initializeHeaderScrollEffect();
    initializeFormValidation();
    initializeKeyboardAccessibility();
    optimizePerformance();
    initializeScrollAnimations();
    initializePropertiesInteraction();
    // initializeTestimonialsSlider(); // Bu fonksiyon Firebase testimonials ile çakışıyor, kaldırıldı
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

// Header functionality is now handled by header.html

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

    // ===== TESTIMONIALS FUNCTIONS =====
    let currentTestimonialSlide = 0;
    let testimonialsData = [];
    // Giriş kontrolü kaldırıldı - tüm kullanıcılar videoları izleyebilir

    // Testimonials'ları Firebase'den yükle
    function loadTestimonialsFromFirebase() {
        const slider = document.getElementById('testimonialsSlider');
        const navigation = document.getElementById('testimonialsNavigation');
        
        if (!slider) return;
        
        // Loading state
        slider.innerHTML = `
            <div class="testimonials-loading" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <div class="loading"></div>
                <p style="margin-top: 1rem;">Müşteri yorumları yükleniyor...</p>
            </div>
        `;
        
        database.ref('testimonials').once('value')
            .then((snapshot) => {
                console.log('Testimonials snapshot:', snapshot.val());
                testimonialsData = [];
                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();
                    console.log('Testimonial data:', data);
                    if (data) {
                        testimonialsData.push({
                            id: childSnapshot.key,
                            ...data
                        });
                    }
                });
                
                console.log('Filtered testimonials:', testimonialsData);
                
                if (testimonialsData.length === 0) {
                    slider.innerHTML = `
                        <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                            <p>Henüz müşteri yorumu bulunmuyor.</p>
                        </div>
                    `;
                    return;
                }
                
                // Tarihe göre sırala (en yeni önce)
                testimonialsData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                
                renderTestimonials();
                setupTestimonialSlider();
                
                // Navigation'ı göster
                const navigation = document.getElementById('testimonialsNavigation');
                if (navigation) {
                    navigation.style.display = 'flex';
                }
            })
            .catch((error) => {
                console.error('Testimonials yükleme hatası:', error);
                slider.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: var(--error-color);">
                        <p>Müşteri yorumları yüklenirken hata oluştu.</p>
                    </div>
                `;
            });
    }

    // Testimonials'ları render et
    function renderTestimonials() {
        const slider = document.getElementById('testimonialsSlider');
        if (!slider) return;
        
        console.log('Rendering testimonials:', testimonialsData);
        
        // CSS'te grid layout tanımlandı, inline style'a gerek yok
        
        // Navigasyonu göster
        const navigation = document.getElementById('testimonialsNavigation');
        if (navigation) {
            navigation.style.display = 'flex';
        }
        
        let html = '';
        testimonialsData.forEach((testimonial, index) => {
            console.log('Rendering testimonial:', testimonial);
            const customerPhoto = testimonial.photoUrl || 'images/e' + ((index % 7) + 1) + '.png';
            const logoImage = index < 5 ? 'images/emlak.png' : 'images/emlaksendelogo.png';
            
            html += `
                <div class="testimonial-card" data-testimonial="${index + 1}" data-video-url="${testimonial.videoUrl}">
                    <img src="${testimonial.photoUrl || 'images/people.png'}" alt="Customer Background" class="testimonial-bg-image">
                    <div class="card-logo">
                        <img src="${logoImage}" alt="EMLAKSENDE" class="testimonial-logo">
                    </div>
                    <div class="customer-photo" onclick="playTestimonialVideo('${testimonial.id}', '${testimonial.videoUrl}')">
                        <img src="${customerPhoto}" alt="${testimonial.customerName}" class="photo-bg">
                        <div class="photo-overlay"></div>
                        <div class="play-button">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon">
                                <path d="M8 5V19L19 12L8 5Z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="customer-info">
                        <h3 class="customer-name">${testimonial.customerName}</h3>
                        <p class="customer-job">${testimonial.customerJob}</p>
                    </div>
                </div>
            `;
        });
        
        console.log('Generated HTML:', html);
        slider.innerHTML = html;
        console.log('Slider innerHTML set, slider element:', slider);
        
        // Slider setup'ı çağır
        setupTestimonialSlider();
    }

    // Testimonial slider'ı kur
    function setupTestimonialSlider() {
        const navigation = document.getElementById('testimonialsNavigation');
        const sliderDots = document.getElementById('sliderDots');
        const sliderPrev = document.getElementById('sliderPrev');
        const sliderNext = document.getElementById('sliderNext');
        
        console.log('Setting up slider, navigation:', navigation, 'sliderDots:', sliderDots);
        
        if (!navigation || !sliderDots) {
            console.log('Navigation or sliderDots not found, returning');
            return;
        }
        
        // Navigation'ı göster
        navigation.style.display = 'flex';
        
        // Dots oluştur
        sliderDots.innerHTML = '';
        // Responsive slide count - desktop: 4, tablet: 2, mobile: 1
        const isMobile = window.innerWidth <= 767;
        const isTablet = window.innerWidth <= 1199 && window.innerWidth > 767;
        const testimonialsPerSlide = isMobile ? 1 : (isTablet ? 2 : 4);
        const totalSlides = Math.ceil(testimonialsData.length / testimonialsPerSlide);
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('data-slide', i);
            dot.setAttribute('aria-label', `Slayt ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            sliderDots.appendChild(dot);
        }
        
        // Navigation event listeners
        if (sliderPrev) {
            sliderPrev.addEventListener('click', () => {
                if (currentTestimonialSlide > 0) {
                    goToSlide(currentTestimonialSlide - 1);
                }
            });
        }
        
        if (sliderNext) {
            sliderNext.addEventListener('click', () => {
                if (currentTestimonialSlide < totalSlides - 1) {
                    goToSlide(currentTestimonialSlide + 1);
                }
            });
        }
        
        // İlk slaytı göster
        goToSlide(0);
    }


    // Belirli bir slayta git
    function goToSlide(slideIndex) {
        const slider = document.getElementById('testimonialsSlider');
        const dots = document.querySelectorAll('.slider-dots .dot');
        
        // Responsive slide count
        const isMobile = window.innerWidth <= 767;
        const isTablet = window.innerWidth <= 1199 && window.innerWidth > 767;
        const testimonialsPerSlide = isMobile ? 1 : (isTablet ? 2 : 4);
        const totalSlides = Math.ceil(testimonialsData.length / testimonialsPerSlide);
        
        console.log('goToSlide called with:', slideIndex, 'totalSlides:', totalSlides, 'slider:', slider);
        
        if (!slider || slideIndex < 0 || slideIndex >= totalSlides) {
            console.log('goToSlide early return - slider:', slider, 'slideIndex:', slideIndex, 'totalSlides:', totalSlides);
            return;
        }
        
        currentTestimonialSlide = slideIndex;
        
        // Dots güncelle
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
        
        // Slider pozisyonunu güncelle - düzeltilmiş hesaplama
        const cardWidth = isMobile ? 280 : (isTablet ? 300 : 280); // testimonial card width
        const gap = isMobile ? 16 : (isTablet ? 20 : 32); // responsive gap
        const slideWidth = (cardWidth + gap) * testimonialsPerSlide; // Her slaytta gösterilecek kart sayısına göre genişlik
        const transformValue = `translateX(-${slideIndex * slideWidth}px)`;
        console.log('Setting slider transform to:', transformValue, 'cardWidth:', cardWidth, 'gap:', gap, 'testimonialsPerSlide:', testimonialsPerSlide, 'slideWidth:', slideWidth);
        
        // Transform değerini zorla uygula
        slider.style.transform = transformValue;
        slider.style.webkitTransform = transformValue;
        slider.style.mozTransform = transformValue;
        slider.style.msTransform = transformValue;
        
        // Debug: Transform değerinin uygulanıp uygulanmadığını kontrol et
        setTimeout(() => {
            const computedStyle = window.getComputedStyle(slider);
            console.log('Applied transform:', computedStyle.transform);
        }, 100);
    }

    // Video oynatma fonksiyonu
    function playTestimonialVideo(testimonialId, videoUrl) {
        // Video modal'ı oluştur ve göster
        showVideoModal(videoUrl);
    }

    // Video modal'ı göster
    function showVideoModal(videoUrl) {
        // Mevcut modal'ı kaldır
        const existingModal = document.getElementById('videoModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Yeni modal oluştur
        const modal = document.createElement('div');
        modal.id = 'videoModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 2rem;
        `;
        
        modal.innerHTML = `
            <div style="position: relative; max-width: 90%; max-height: 90%; background: #000; border-radius: 8px; overflow: hidden;">
                <button id="closeVideoModal" style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; z-index: 10001; display: flex; align-items: center; justify-content: center;">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                    </svg>
                </button>
                <video controls autoplay style="width: 100%; height: auto; max-height: 80vh;">
                    <source src="${videoUrl}" type="video/mp4">
                    Tarayıcınız video oynatmayı desteklemiyor.
                </video>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Modal'ı kapatma event listener'ı
        const closeBtn = document.getElementById('closeVideoModal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Modal dışına tıklayınca kapatma
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // ESC tuşu ile kapatma
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    // Global fonksiyonları window'a ekle
    window.playTestimonialVideo = playTestimonialVideo;
    window.loadTestimonialsFromFirebase = loadTestimonialsFromFirebase;
    
    // Load properties when page loads
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded fired!');
        // Wait a bit for Firebase SDK to be fully loaded, then initialize
        setTimeout(() => {
            // Check if we're on index page
            const grid = document.getElementById('propertiesGrid');
            console.log('Properties grid found:', grid);
            if (grid) {
                console.log('Loading properties from Firebase...');
                loadPropertiesFromFirebase();
            } else {
                console.log('Properties grid not found - not on index page');
            }
            
            
            // Load testimonials if we're on the index page
            const testimonialsSlider = document.getElementById('testimonialsSlider');
            if (testimonialsSlider) {
                console.log('Loading testimonials from Firebase...');
                loadTestimonialsFromFirebase();
            }

            // Load SEO data for current page
            loadPageSEO();
        }, 500);
    });
    
} else {
    console.error('Firebase SDK not loaded');
}

// ===== SEO MANAGEMENT =====
function loadPageSEO() {
    if (!database) {
        console.error('Database not initialized');
        return;
    }

    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Loading SEO for page:', currentPage);

    // Convert filename to Firebase-safe key
    const safePageId = currentPage.replace(/\./g, '_DOT_').replace(/[#$\[\]]/g, '_');
    console.log('Firebase key:', safePageId);

    database.ref(`sayfalar/${safePageId}`).once('value')
        .then((snapshot) => {
            const seoData = snapshot.val();
            if (seoData) {
                console.log('SEO data loaded:', seoData);
                updatePageSEO(seoData);
            } else {
                console.log('No SEO data found for page:', currentPage);
            }
        })
        .catch((error) => {
            console.error('Error loading SEO data:', error);
        });
}

function updatePageSEO(seoData) {
    try {
        // Update page title
        if (seoData.seo_title) {
            const titleElement = document.getElementById('pageTitle');
            if (titleElement) {
                titleElement.textContent = seoData.seo_title;
                document.title = seoData.seo_title;
            }
        }

        // Update meta description
        if (seoData.seo_description) {
            const descElement = document.getElementById('pageDescription');
            if (descElement) {
                descElement.setAttribute('content', seoData.seo_description);
            }
        }

        // Update meta keywords
        if (seoData.seo_keywords) {
            const keywordsElement = document.getElementById('pageKeywords');
            if (keywordsElement) {
                keywordsElement.setAttribute('content', seoData.seo_keywords);
            }
        }

        // Note: URL slug is not updated to prevent page reload issues
        // The slug is stored in Firebase for SEO purposes but URL remains as index.html
        if (seoData.slug) {
            console.log('Page slug available:', seoData.slug, 'but URL remains:', window.location.pathname);
        }

        console.log('SEO data updated successfully');
    } catch (error) {
        console.error('Error updating SEO data:', error);
    }
}

