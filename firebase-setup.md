# Firebase Realtime Database & Storage Konfigürasyonu

Bu dosya, admin.html'deki Firebase konfigürasyonunu güncellemek için gerekli adımları içerir.

## 📋 Adımlar:

### 1. Firebase Console'a Git
- https://console.firebase.google.com/ adresine git
- `emlaksende-8646a` projesini seç

### 2. Web App Ekle
- Project Overview > Settings (⚙️) > Project settings
- "Your apps" bölümünde "Add app" butonuna tıkla
- Web ikon (</>) seçin
- App nickname: `emlaksende-admin` 
- Firebase Hosting'i şimdilik setup etme

### 3. Konfigürasyon Değerlerini Al
Firebase size şu şekilde bir kod verecek:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBrb7QG-XXXXX-XXXXX",
  authDomain: "emlaksende-8646a.firebaseapp.com",
  databaseURL: "https://emlaksende-8646a-default-rtdb.firebaseio.com/",
  projectId: "emlaksende-8646a",
  storageBucket: "emlaksende-8646a.appspot.com",
  messagingSenderId: "105679454012646704283",
  appId: "1:105679454012646704283:web:abcd1234efgh5678"
};
```

### 4. admin.html'i Güncelle
Bu değerleri admin.html dosyasındaki firebaseConfig objesi içine kopyala:

```javascript
// admin.html içinde (satır ~918-926)
const firebaseConfig = {
    apiKey: "BURAYA_API_KEY", 
    authDomain: "emlaksende-8646a.firebaseapp.com",
    databaseURL: "https://emlaksende-8646a-default-rtdb.firebaseio.com/",
    projectId: "emlaksende-8646a", 
    storageBucket: "emlaksende-8646a.appspot.com",
    messagingSenderId: "105679454012646704283",
    appId: "BURAYA_APP_ID"
};
```

### 5. Firebase Storage Kurallarını Ayarla
Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Ana resimler için izin ver
    match /main-images/{allPaths=**} {
      allow read: if true;
      allow write: if true; // Admin auth ekledikten sonra değiştirin
    }
    
    // Diğer dosyalar için genel erişim
    match /{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### 6. Realtime Database Kuralları
Firebase Console > Realtime Database > Rules:

```json
{
  "rules": {
    "ilanlar": {
      ".read": true,
      ".write": true
    },
    "projeler": {
      ".read": true,
      ".write": true
    },
    "imar_durumu": {
      ".read": true,
      ".write": true
    },
    "tapu_durumu": {
      ".read": true,
      ".write": true
    },
    "gabari": {
      ".read": true,
      ".write": true
    },
    "kaks": {
      ".read": true,
      ".write": true
    },
    "cevre_kategorisi": {
      ".read": true,
      ".write": true
    },
    "cevre_kategorileri": {
      ".read": true,
      ".write": true
    },
    "cevreler": {
      ".read": true,
      ".write": true
    },
    "site-settings": {
      ".read": true,
      ".write": true
    },
    "site_ayarlari": {
      ".read": true,
      ".write": true
    }
  }
}
```

## ⚠️ Güvenlik Notu:
Şu anda herkes okuma/yazma erişimine sahip. Daha sonra Firebase Authentication ekleyerek sadece admin kullanıcılarının dosya yükleyebilmesini sağlayacağız.

## 🧪 Test İçin:
1. admin.html'i açın
2. Ana Sayfa Yönetimi > Ana Resim'e git  
3. Bir resim dosyası seçin veya sürükleyip bırakın
4. Yükleme progress bar'ını gözlemleyin
5. Firebase Console > Storage'da dosyanın yüklendiğini kontrol edin
6. Realtime Database > site-settings/main-image node'unda verinin kaydedildiğini kontrol edin

## 📁 Storage Yapısı:
```
emlaksende-8646a.appspot.com/
├── main-images/
│   ├── ana-resim-1703123456789.jpg
│   ├── ana-resim-1703123567890.png
│   └── ...
└── [diğer klasörler]
```

## 🗄️ Realtime Database Yapısı:
```json
{
  "site-settings": {
    "main-image": {
      "url": "https://firebasestorage.googleapis.com/...",
      "fileName": "main-images/ana-resim-1703123456789.jpg",
      "uploadedAt": 1703123456789,
      "isActive": true
    }
  },
  "cevre_kategorisi": {
    "-OY3dKpC9iBiRRRZb9hO": {
      "createdAt": 1755645828346,
      "name": "Ulaşım"
    },
    "-OY8aNa4okURgvBLW-Uw": {
      "createdAt": 1755728939568,
      "name": "Eğitim Kurumları"
    }
  }
}
```

## 🔧 Sorun Giderme:

### Ana Resim Yüklenmiyor Hatası:
1. Firebase Console > Realtime Database > Rules'a git
2. Yukarıdaki kuralları tam olarak kopyala
3. "Publish" butonuna tıkla
4. Sayfayı yenile ve tekrar dene

### Test Verisi Ekleme:
Firebase Console > Realtime Database'de manuel olarak test verisi ekleyebilirsiniz:

```json
{
  "site-settings": {
    "main-image": {
      "url": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop",
      "fileName": "test-image.jpg",
      "uploadedAt": 1703123456789,
      "isActive": true
    }
  }
}
```
