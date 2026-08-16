const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imgDir = path.join(__dirname, '../public/ornek-calismalar/images');
const thumbDir = path.join(__dirname, '../public/ornek-calismalar/thumbnails');

if (!fs.existsSync(thumbDir)) {
  fs.mkdirSync(thumbDir, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(imgDir);
  console.log(`Optimizing ${files.length} images...`);

  for (const file of files) {
    if (!/\.(jpeg|jpg|png)$/i.test(file)) continue;

    const inputPath = path.join(imgDir, file);
    const stat = fs.statSync(inputPath);
    const originalSizeMB = (stat.size / (1024 * 1024)).toFixed(2);

    // 1. Optimize original full-res image (max 1200px width, quality 80)
    const tempPath = inputPath + '.tmp';
    await sharp(inputPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true })
      .toFile(tempPath);

    fs.renameSync(tempPath, inputPath);

    const newStat = fs.statSync(inputPath);
    const newSizeKB = (newStat.size / 1024).toFixed(0);

    // 2. Generate small thumbnail (max 500px width, quality 75)
    const thumbPath = path.join(thumbDir, file);
    await sharp(inputPath)
      .resize({ width: 500, withoutEnlargement: true })
      .jpeg({ quality: 75, progressive: true })
      .toFile(thumbPath);

    const thumbStat = fs.statSync(thumbPath);
    const thumbSizeKB = (thumbStat.size / 1024).toFixed(0);

    console.log(`✓ ${file}: ${originalSizeMB} MB -> Full: ${newSizeKB} KB, Thumb: ${thumbSizeKB} KB`);
  }
  console.log('Image optimization complete!');
}

optimizeImages().catch(err => {
  console.error('Optimization error:', err);
});
