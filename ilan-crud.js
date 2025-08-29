// ===== İLAN CRUD FUNCTIONS =====

// Şehir-İlçe-Mahalle verileri
const locationData = {
    istanbul: {
        kadikoy: ['Fenerbahçe', 'Göztepe', 'Caddebostan', 'Bostancı', 'Kozyatağı'],
        besiktas: ['Levent', 'Etiler', 'Bebek', 'Ortaköy', 'Arnavutköy'],
        sisli: ['Nişantaşı', 'Mecidiyeköy', 'Gayrettepe', 'Levent', 'Maslak'],
        bakirkoy: ['Yeşilköy', 'Florya', 'Ataköy', 'Şirinevler', 'Bahçelievler'],
        uskudar: ['Çengelköy', 'Beylerbeyi', 'Kuzguncuk', 'Salacak', 'Selimiye']
    },
    ankara: {
        cankaya: ['Bahçelievler', 'Çukurambar', 'Söğütözü', 'Kızılay', 'Çayyolu'],
        kecioren: ['Etimesgut', 'Önverimlilik', 'Kuşcağız', 'Esertepe', 'Kalaba'],
        yenimahalle: ['Demetevler', 'Ergazi', 'Ostim', 'Batıkent', 'Çamlıdere'],
        mamak: ['Ümitköy', 'Akdere', 'Tuzluçayır', 'Durukan', 'Kusunlar'],
        sincan: ['Yenikent', 'Eryaman', 'Elvankent', 'Fatih', 'Kazan']
    },
    izmir: {
        konak: ['Alsancak', 'Pasaport', 'Kemeraltı', 'Basmane', 'Güzelyalı'],
        karsiyaka: ['Mavişehir', 'Çiğli', 'Bostanlı', 'Bayraklı', 'Menemen'],
        bornova: ['Erzene', 'Kayalar', 'Çamdibi', 'Işıkkent', 'Evka'],
        bayrakli: ['Adalet', 'Alparslan', 'Mansuroğlu', 'Çiğli', 'Işıkkent'],
        buca: ['Kozağaç', 'Çamlık', 'Üçyol', 'İnönü', 'Kuruçeşme']
    },
    bursa: {
        osmangazi: ['Hanlar', 'Demirtaş', 'Soğanlı', 'Panayır', 'Çirpan'],
        nilufer: ['Özlüce', 'Görükle', 'Çamlık', 'Ihsaniye', 'Korupark'],
        yildirim: ['Geçit', 'Millet', 'Yıldırım', 'İhsaniye', 'Akpınar'],
        gursu: ['Gürsu', 'Çalı', 'Duaçınarı', 'Balat', 'Güney'],
        kestel: ['Kestel', 'Akçakoca', 'Balat', 'Güney', 'Duaçınarı']
    },
    antalya: {
        muratpasa: ['Lara', 'Konyaaltı', 'Meltem', 'Fener', 'Güzeloba'],
        kepez: ['Varsak', 'Emek', 'Sütçüler', 'Gündoğmuş', 'Çamlık'],
        konyaalti: ['Hurma', 'Antalya', 'Uncalı', 'Altınkum', 'Çakırlar'],
        aksu: ['Aksu', 'Düden', 'Kadriye', 'Belek', 'Çolaklı'],
        dosemealti: ['Bıyıklı', 'Nebiler', 'Yukselen', 'Cayyolu', 'Döşemaltı']
    }
};

let editingIlanId = null;

// Form görünürlük fonksiyonları
function showAddIlanForm() {
    const form = document.getElementById('ilanForm');
    const title = document.getElementById('ilanFormTitle');
    
    if (form && title) {
        title.textContent = 'Yeni İlan Ekle';
        form.style.display = 'block';
        editingIlanId = null;
        clearIlanForm();
        loadIlanFormData();
        
        // İlk alana odaklan
        const baslikInput = document.getElementById('ilanBaslikInput');
        if (baslikInput) baslikInput.focus();
    }
}

function hideIlanForm() {
    const form = document.getElementById('ilanForm');
    if (form) {
        form.style.display = 'none';
        editingIlanId = null;
    }
}

// Form verilerini yükle
function loadIlanFormData() {
    loadKaksOptions();
    loadGabariOptions();
    loadTapuOptions();
    loadImarOptions();
}

// Selectbox verilerini yükle
function loadKaksOptions() {
    const select = document.getElementById('ilanKaksSelect');
    if (!select) return;

    select.innerHTML = '<option value="">KAKS Seçin</option>';
    
    database.ref('kaks').once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach(key => {
                    const item = data[key];
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = item.value;
                    select.appendChild(option);
                });
            }
        })
        .catch((error) => {
            console.error('KAKS verileri yüklenirken hata:', error);
        });
}

function loadGabariOptions() {
    const select = document.getElementById('ilanGabariSelect');
    if (!select) return;

    select.innerHTML = '<option value="">Gabari Seçin</option>';
    
    database.ref('gabari').once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach(key => {
                    const item = data[key];
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = item.value;
                    select.appendChild(option);
                });
            }
        })
        .catch((error) => {
            console.error('Gabari verileri yüklenirken hata:', error);
        });
}

function loadTapuOptions() {
    const select = document.getElementById('ilanTapuSelect');
    if (!select) return;

    select.innerHTML = '<option value="">Tapu Durumu Seçin</option>';
    
    database.ref('tapu_durumu').once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach(key => {
                    const item = data[key];
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = item.name;
                    select.appendChild(option);
                });
            }
        })
        .catch((error) => {
            console.error('Tapu durumu verileri yüklenirken hata:', error);
        });
}

function loadImarOptions() {
    const select = document.getElementById('ilanImarSelect');
    if (!select) return;

    select.innerHTML = '<option value="">İmar Durumu Seçin</option>';
    
    database.ref('imar_durumu').once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach(key => {
                    const item = data[key];
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = item.name;
                    select.appendChild(option);
                });
            }
        })
        .catch((error) => {
            console.error('İmar durumu verileri yüklenirken hata:', error);
        });
}

// Şehir değiştiğinde ilçeleri yükle
function loadIlceler() {
    const sehirSelect = document.getElementById('ilanSehirSelect');
    const ilceSelect = document.getElementById('ilanIlceSelect');
    const mahalleSelect = document.getElementById('ilanMahalleSelect');
    
    if (!sehirSelect || !ilceSelect || !mahalleSelect) return;
    
    const selectedSehir = sehirSelect.value;
    
    // İlçe ve mahalle seçimlerini sıfırla
    ilceSelect.innerHTML = '<option value="">İlçe Seçin</option>';
    mahalleSelect.innerHTML = '<option value="">Mahalle Seçin</option>';
    mahalleSelect.disabled = true;
    
    if (selectedSehir && locationData[selectedSehir]) {
        ilceSelect.disabled = false;
        
        Object.keys(locationData[selectedSehir]).forEach(ilce => {
            const option = document.createElement('option');
            option.value = ilce;
            option.textContent = ilce.charAt(0).toUpperCase() + ilce.slice(1);
            ilceSelect.appendChild(option);
        });
    } else {
        ilceSelect.disabled = true;
    }
}

// İlçe değiştiğinde mahalleleri yükle
function loadMahalleler() {
    const sehirSelect = document.getElementById('ilanSehirSelect');
    const ilceSelect = document.getElementById('ilanIlceSelect');
    const mahalleSelect = document.getElementById('ilanMahalleSelect');
    
    if (!sehirSelect || !ilceSelect || !mahalleSelect) return;
    
    const selectedSehir = sehirSelect.value;
    const selectedIlce = ilceSelect.value;
    
    mahalleSelect.innerHTML = '<option value="">Mahalle Seçin</option>';
    
    if (selectedSehir && selectedIlce && locationData[selectedSehir] && locationData[selectedSehir][selectedIlce]) {
        mahalleSelect.disabled = false;
        
        locationData[selectedSehir][selectedIlce].forEach(mahalle => {
            const option = document.createElement('option');
            option.value = mahalle;
            option.textContent = mahalle;
            mahalleSelect.appendChild(option);
        });
    } else {
        mahalleSelect.disabled = true;
    }
}

// Otomatik fiyat hesaplama
function calculateTotalPrice() {
    const metrekareInput = document.getElementById('ilanMetrekareInput');
    const metrekareFiyatInput = document.getElementById('ilanMetrekareFiyatInput');
    const toplamFiyatInput = document.getElementById('ilanToplamFiyatInput');
    
    if (!metrekareInput || !metrekareFiyatInput || !toplamFiyatInput) return;
    
    const metrekare = parseFloat(metrekareInput.value) || 0;
    const metrekareFiyat = parseFloat(metrekareFiyatInput.value) || 0;
    
    if (metrekare > 0 && metrekareFiyat > 0) {
        const toplamFiyat = metrekare * metrekareFiyat;
        toplamFiyatInput.value = toplamFiyat.toLocaleString('tr-TR') + ' ₺';
    } else {
        toplamFiyatInput.value = '';
    }
}

// Form temizleme
function clearIlanForm() {
    const inputs = [
        'ilanBaslikInput', 'ilanNoInput', 'ilanMetrekareInput', 
        'ilanMetrekareFiyatInput', 'ilanToplamFiyatInput', 
        'ilanAdaNoInput', 'ilanParselNoInput'
    ];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) input.value = '';
    });
    
    const selects = [
        'ilanProjeSelect', 'ilanKaksSelect', 'ilanGabariSelect',
        'ilanTapuSelect', 'ilanImarSelect', 'ilanSehirSelect',
        'ilanIlceSelect', 'ilanMahalleSelect'
    ];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) select.value = '';
    });
    
    // İlçe ve mahalle selectlerini deaktif et
    const ilceSelect = document.getElementById('ilanIlceSelect');
    const mahalleSelect = document.getElementById('ilanMahalleSelect');
    if (ilceSelect) ilceSelect.disabled = true;
    if (mahalleSelect) mahalleSelect.disabled = true;
}

// İlan kaydetme
function saveIlan() {
    const baslik = document.getElementById('ilanBaslikInput').value.trim();
    const ilanNo = document.getElementById('ilanNoInput').value.trim();
    const metrekare = document.getElementById('ilanMetrekareInput').value.trim();
    const metrekareFiyat = document.getElementById('ilanMetrekareFiyatInput').value.trim();
    const adaNo = document.getElementById('ilanAdaNoInput').value.trim();
    const parselNo = document.getElementById('ilanParselNoInput').value.trim();
    
    // Validasyon
    if (!baslik) {
        showGenericAlert('ilanAlert', 'İlan başlığı boş olamaz.', 'error');
        return;
    }
    
    if (!ilanNo) {
        showGenericAlert('ilanAlert', 'İlan numarası boş olamaz.', 'error');
        return;
    }
    
    if (!metrekare || isNaN(parseFloat(metrekare))) {
        showGenericAlert('ilanAlert', 'Geçerli bir metrekare değeri girin.', 'error');
        return;
    }
    
    if (!metrekareFiyat || isNaN(parseFloat(metrekareFiyat))) {
        showGenericAlert('ilanAlert', 'Geçerli bir metrekare fiyatı girin.', 'error');
        return;
    }
    
    // Selectbox değerleri
    const kaksId = document.getElementById('ilanKaksSelect').value;
    const gabariId = document.getElementById('ilanGabariSelect').value;
    const tapuId = document.getElementById('ilanTapuSelect').value;
    const imarId = document.getElementById('ilanImarSelect').value;
    const sehir = document.getElementById('ilanSehirSelect').value;
    const ilce = document.getElementById('ilanIlceSelect').value;
    const mahalle = document.getElementById('ilanMahalleSelect').value;
    
    if (!kaksId || !gabariId || !tapuId || !imarId || !sehir || !ilce || !mahalle) {
        showGenericAlert('ilanAlert', 'Lütfen tüm zorunlu alanları doldurun.', 'error');
        return;
    }
    
    // İlan verisi oluştur
    const ilanData = {
        baslik: baslik,
        ilanNo: ilanNo,
        proje: document.getElementById('ilanProjeSelect').value || null,
        metrekare: parseFloat(metrekare),
        metrekareFiyat: parseFloat(metrekareFiyat),
        toplamFiyat: parseFloat(metrekare) * parseFloat(metrekareFiyat),
        adaNo: adaNo,
        parselNo: parselNo,
        kaksId: kaksId,
        gabariId: gabariId,
        tapuId: tapuId,
        imarId: imarId,
        sehir: sehir,
        ilce: ilce,
        mahalle: mahalle,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
    };
    
    // Firebase'e kaydet
    const ilanRef = database.ref('ilanlar');
    
    if (editingIlanId) {
        // Güncelleme
        ilanRef.child(editingIlanId).set(ilanData)
            .then(() => {
                showGenericAlert('ilanAlert', 'İlan başarıyla güncellendi.', 'success');
                hideIlanForm();
                loadIlanList();
            })
            .catch((error) => {
                showGenericAlert('ilanAlert', 'Güncelleme sırasında hata oluştu.', 'error');
            });
    } else {
        // Yeni ekleme
        ilanRef.push(ilanData)
            .then(() => {
                showGenericAlert('ilanAlert', 'İlan başarıyla eklendi.', 'success');
                hideIlanForm();
                loadIlanList();
            })
            .catch((error) => {
                showGenericAlert('ilanAlert', 'Ekleme sırasında hata oluştu.', 'error');
            });
    }
}

// İlan listesi yükleme
function loadIlanList() {
    const ilanList = document.getElementById('ilanList');
    if (!ilanList) return;

    ilanList.innerHTML = `
        <div style="text-align: center; color: var(--text-secondary); padding: 2rem;">
            <div class="loading"></div>
            <p style="margin-top: 1rem;">İlanlar yükleniyor...</p>
        </div>
    `;

    database.ref('ilanlar').once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                let html = '';
                Object.keys(data).forEach(key => {
                    const ilan = data[key];
                    html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; margin-bottom: 1rem; background: var(--main-bg); border-radius: 8px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
                            <div style="flex: 1;">
                                <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary); font-size: 1.1rem;">${ilan.baslik}</h4>
                                <div style="display: flex; gap: 1rem; margin-bottom: 0.5rem;">
                                    <span style="background: var(--primary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.8rem;">İlan No: ${ilan.ilanNo}</span>
                                    <span style="background: var(--success-color); color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.8rem;">${ilan.metrekare} m²</span>
                                    <span style="background: var(--warning-color); color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.8rem;">${ilan.toplamFiyat.toLocaleString('tr-TR')} ₺</span>
                                </div>
                                <div style="font-size: 0.9rem; color: var(--text-secondary);">
                                    📍 ${ilan.sehir.charAt(0).toUpperCase() + ilan.sehir.slice(1)}, ${ilan.ilce.charAt(0).toUpperCase() + ilan.ilce.slice(1)}, ${ilan.mahalle}
                                </div>
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-secondary" onclick="editIlan('${key}')" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                    </svg>
                                    Düzenle
                                </button>
                                <button class="btn-delete" onclick="deleteIlan('${key}', '${ilan.baslik}')" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd"/>
                                        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h.01a1 1 0 100-2H10zm3 0a1 1 0 000 2h.01a1 1 0 100-2H13z" clip-rule="evenodd"/>
                                    </svg>
                                    Sil
                                </button>
                            </div>
                        </div>
                    `;
                });
                ilanList.innerHTML = html;
            } else {
                ilanList.innerHTML = `
                    <div style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                        <p>Henüz hiç ilan eklenmemiş.</p>
                    </div>
                `;
            }
        })
        .catch((error) => {
            ilanList.innerHTML = `
                <div style="text-align: center; color: var(--danger-color); padding: 2rem;">
                    <p>İlanlar yüklenirken hata oluştu.</p>
                </div>
            `;
        });
}

// İlan düzenleme (placeholder)
function editIlan(id) {
    showGenericAlert('ilanAlert', 'İlan düzenleme özelliği yakında eklenecek.', 'warning');
}

// İlan silme
function deleteIlan(id, baslik) {
    if (confirm(`"${baslik}" ilanını silmek istediğinizden emin misiniz?`)) {
        database.ref('ilanlar').child(id).remove()
            .then(() => {
                showGenericAlert('ilanAlert', 'İlan başarıyla silindi.', 'success');
                loadIlanList();
            })
            .catch((error) => {
                showGenericAlert('ilanAlert', 'Silme sırasında hata oluştu.', 'error');
            });
    }
}
