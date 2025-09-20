const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Resim optimizasyonu için konfigürasyon
const config = {
    inputDir: './images',
    outputDir: './images',
    formats: ['webp'],
    qualities: {
        webp: 80
    },
    sizes: {
        // Farklı boyutlar için resize seçenekleri
        small: 300,
        medium: 600,
        large: 1200
    }
};

// Optimize edilecek resimler
const imagesToOptimize = [
    'emlak.png',
    'emlakyat.png', 
    'emlakyat2.png',
    'emlakyesilyat.png',
    'emlak1.png',
    'hakkımızda.png',
    'arsa.png',
    'icon1.png',
    'icon2.png', 
    'icon3.png',
    'icon4.png'
];

async function optimizeImage(inputPath, outputPath, format, quality) {
    try {
        await sharp(inputPath)
            .webp({ quality: quality })
            .toFile(outputPath);
        
        const originalSize = fs.statSync(inputPath).size;
        const optimizedSize = fs.statSync(outputPath).size;
        const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        
        console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% tasarruf)`);
        return true;
    } catch (error) {
        console.error(`❌ Hata: ${inputPath}`, error.message);
        return false;
    }
}

async function createResponsiveImages(inputPath, baseName) {
    const results = [];
    
    for (const [sizeName, width] of Object.entries(config.sizes)) {
        const outputPath = path.join(config.outputDir, `${baseName}_${sizeName}.webp`);
        
        try {
            await sharp(inputPath)
                .resize(width, null, { 
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({ quality: config.qualities.webp })
                .toFile(outputPath);
            
            results.push({
                size: sizeName,
                width: width,
                path: outputPath
            });
            
            console.log(`📱 ${baseName}_${sizeName}.webp oluşturuldu (${width}px)`);
        } catch (error) {
            console.error(`❌ Responsive resim hatası: ${baseName}_${sizeName}`, error.message);
        }
    }
    
    return results;
}

async function main() {
    console.log('🚀 Resim optimizasyonu başlatılıyor...\n');
    
    let successCount = 0;
    let totalSavings = 0;
    
    for (const imageName of imagesToOptimize) {
        const inputPath = path.join(config.inputDir, imageName);
        
        if (!fs.existsSync(inputPath)) {
            console.log(`⚠️  Dosya bulunamadı: ${imageName}`);
            continue;
        }
        
        const baseName = path.parse(imageName).name;
        
        // WebP formatına dönüştür
        const webpPath = path.join(config.outputDir, `${baseName}.webp`);
        const success = await optimizeImage(inputPath, webpPath, 'webp', config.qualities.webp);
        
        if (success) {
            successCount++;
            
            // Responsive resimler oluştur (büyük resimler için)
            const stats = fs.statSync(inputPath);
            if (stats.size > 50000) { // 50KB'den büyük resimler için
                await createResponsiveImages(inputPath, baseName);
            }
        }
    }
    
    console.log(`\n🎉 Optimizasyon tamamlandı!`);
    console.log(`✅ ${successCount}/${imagesToOptimize.length} resim başarıyla optimize edildi`);
    console.log(`\n📋 Sonraki adımlar:`);
    console.log(`1. WebP dosyalarını sunucuya yükleyin`);
    console.log(`2. HTML dosyalarında <picture> elementlerini kontrol edin`);
    console.log(`3. PageSpeed testini tekrar çalıştırın`);
}

// Script'i çalıştır
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { optimizeImage, createResponsiveImages };
