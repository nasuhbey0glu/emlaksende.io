// Firebase Konfigürasyon Dosyası
// Bu dosya tüm HTML sayfalarında kullanılacak merkezi Firebase konfigürasyonunu içerir

// Firebase Web App Konfigürasyonu
const firebaseConfig = {
    apiKey: "AIzaSyBZ1_56GJ5tOhK5Eth6cXscv8jnM4bpdEI",
    authDomain: "emlaksende-8646a.firebaseapp.com",
    databaseURL: "https://emlaksende-8646a-default-rtdb.firebaseio.com/",
    projectId: "emlaksende-8646a",
    storageBucket: "emlaksende-8646a.firebasestorage.app",
    messagingSenderId: "861976091519",
    appId: "1:861976091519:web:a24b7811322e3fc97dd84a"
};

// Firebase'i başlatma fonksiyonu
function initializeFirebase() {
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK yüklenmedi');
        return null;
    }
    
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        return firebase;
    } catch (error) {
        console.error('Firebase başlatma hatası:', error);
        return null;
    }
}

// Database referansı alma fonksiyonu
function getFirebaseDatabase() {
    const app = initializeFirebase();
    if (app) {
        return app.database();
    }
    return null;
}

// Storage referansı alma fonksiyonu
function getFirebaseStorage() {
    const app = initializeFirebase();
    if (app) {
        return app.storage();
    }
    return null;
}

// Global olarak kullanılabilir hale getir
window.firebaseConfig = firebaseConfig;
window.initializeFirebase = initializeFirebase;
window.getFirebaseDatabase = getFirebaseDatabase;
window.getFirebaseStorage = getFirebaseStorage;
