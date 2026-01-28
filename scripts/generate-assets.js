import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE_LOGO = 'public/logo.png';
const OUTPUT_DIR = 'public/icons';

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generate() {
    console.log('🚀 Generating Smart Feni Assets...');

    try {
        // Generate PWA Icons
        await sharp(SOURCE_LOGO).resize(192, 192).toFile(`${OUTPUT_DIR}/pwa-192x192.png`);
        await sharp(SOURCE_LOGO).resize(512, 512).toFile(`${OUTPUT_DIR}/pwa-512x512.png`);
        await sharp(SOURCE_LOGO).resize(64, 64).toFile('public/favicon.ico');
        
        console.log('✅ All assets generated from logo.png!');
    } catch (error) {
        console.error('❌ Error generating assets:', error);
        process.exit(1);
    }
}

generate();
