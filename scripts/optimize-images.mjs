import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_ROOT = path.resolve(__dirname, '..');
const MEDIA_DIR = path.resolve(FRONTEND_ROOT, '../old data/media');
const ASSETS_DIR = path.resolve(FRONTEND_ROOT, 'public/assets');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function extractNumber(name) {
  const match = name.match(/\d+/);
  return match ? parseInt(match[0], 10) : 999999;
}

function getFileHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function run() {
  console.log('--- Invent Fine Art Image Optimization Pipeline ---');
  console.log(`Source media (read-only): ${MEDIA_DIR}`);
  console.log(`Target assets: ${ASSETS_DIR}\n`);

  if (!fs.existsSync(MEDIA_DIR)) {
    console.error(`ERROR: Media directory does not exist: ${MEDIA_DIR}`);
    process.exit(1);
  }

  const stats = [];
  const warnings = [];
  const seenHashes = new Map();

  // 1. BRAND
  {
    const brandSrc = path.join(MEDIA_DIR, 'branding/logo.png');
    const brandDestDir = path.join(ASSETS_DIR, 'brand');
    ensureDir(brandDestDir);

    let found = 0;
    let written = 0;
    let failed = 0;

    if (fs.existsSync(brandSrc)) {
      found++;
      try {
        fs.copyFileSync(brandSrc, path.join(brandDestDir, 'logo.png'));
        written++;

        // Generate favicon PNGs from logo
        const favicon32 = path.resolve(FRONTEND_ROOT, 'public/favicon-32x32.png');
        const faviconPng = path.resolve(FRONTEND_ROOT, 'public/favicon.png');
        await sharp(brandSrc).resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(favicon32);
        await sharp(brandSrc).resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(faviconPng);
        written += 2;
      } catch (err) {
        failed++;
        console.error('Error processing brand logo:', err);
      }
    }
    stats.push({ section: 'Brand / Logo', found, written, failed });
  }

  // 2. HERO SLIDERS
  {
    const heroSrcDir = path.join(MEDIA_DIR, 'slider');
    const heroDestDir = path.join(ASSETS_DIR, 'hero');
    ensureDir(heroDestDir);

    const bannerFiles = ['banner-1.jpg', 'banner-2.jpg', 'banner-5.jpg', 'banner-6.jpg', 'banner3.jpg'];
    let found = 0;
    let written = 0;
    let failed = 0;

    for (const file of bannerFiles) {
      const srcPath = path.join(heroSrcDir, file);
      if (!fs.existsSync(srcPath)) continue;
      found++;
      try {
        const canonicalBase = file.startsWith('banner3') ? 'banner-3' : path.parse(file).name;
        
        // 1920px wide
        await sharp(srcPath)
          .resize({ width: 1920, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(heroDestDir, `${canonicalBase}.webp`));
        written++;

        // 960px mobile variant
        await sharp(srcPath)
          .resize({ width: 960, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(heroDestDir, `${canonicalBase}-960.webp`));
        written++;

        // Also alias banner3.webp if canonical was banner-3
        if (canonicalBase === 'banner-3') {
          await sharp(srcPath)
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(heroDestDir, `banner3.webp`));
          written++;
        }

        // Generate Open Graph image (1200x630) from banner-1.jpg
        if (file === 'banner-1.jpg') {
          const ogPath = path.resolve(FRONTEND_ROOT, 'public/og-image.jpg');
          await sharp(srcPath)
            .resize(1200, 630, { fit: 'cover', position: 'center' })
            .jpeg({ quality: 85 })
            .toFile(ogPath);
        }
      } catch (err) {
        failed++;
        console.error(`Error processing hero banner ${file}:`, err);
      }
    }
    stats.push({ section: 'Hero / Sliders', found, written, failed });
  }

  // 3. SERVICES
  {
    const servicesSrcDir = path.join(MEDIA_DIR, 'services');
    const servicesDestDir = path.join(ASSETS_DIR, 'services');
    ensureDir(servicesDestDir);

    const serviceFiles = ['19.jpg', '14.jpg', '11.jpg', '7.jpg', '5.jpg', '2.jpg', 'ser.jpg'];
    let found = 0;
    let written = 0;
    let failed = 0;

    for (const file of serviceFiles) {
      const srcPath = path.join(servicesSrcDir, file);
      if (!fs.existsSync(srcPath)) continue;
      found++;
      try {
        const base = path.parse(file).name;
        await sharp(srcPath)
          .resize({ width: 1400, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(servicesDestDir, `${base}.webp`));
        written++;
      } catch (err) {
        failed++;
        console.error(`Error processing service image ${file}:`, err);
      }
    }
    stats.push({ section: 'Services', found, written, failed });
  }

  // 4. INTRO / HOMEPAGE SHOWCASE
  {
    const introSrcDir = path.join(MEDIA_DIR, 'homepage');
    const introDestDir = path.join(ASSETS_DIR, 'intro');
    ensureDir(introDestDir);

    const introFiles = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '7.jpg'];
    let found = 0;
    let written = 0;
    let failed = 0;

    for (const file of introFiles) {
      const srcPath = path.join(introSrcDir, file);
      if (!fs.existsSync(srcPath)) continue;
      found++;
      try {
        const base = path.parse(file).name;
        await sharp(srcPath)
          .resize({ width: 1400, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(introDestDir, `${base}.webp`));
        written++;
      } catch (err) {
        failed++;
        console.error(`Error processing intro image ${file}:`, err);
      }
    }
    stats.push({ section: 'Intro Showcase', found, written, failed });
  }

  // 5. ABOUT
  {
    const aboutSrcDir = path.join(MEDIA_DIR, 'about');
    const aboutDestDir = path.join(ASSETS_DIR, 'about');
    ensureDir(aboutDestDir);

    const aboutFile = 'about_us.jpg';
    let found = 0;
    let written = 0;
    let failed = 0;

    const srcPath = path.join(aboutSrcDir, aboutFile);
    if (fs.existsSync(srcPath)) {
      found++;
      try {
        await sharp(srcPath)
          .resize({ width: 1400, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(aboutDestDir, 'about_us.webp'));
        written++;
      } catch (err) {
        failed++;
        console.error(`Error processing about image ${aboutFile}:`, err);
      }
    }
    stats.push({ section: 'About Us', found, written, failed });
  }

  // 6. CLIENTS
  {
    const clientsSrcDir = path.join(MEDIA_DIR, 'clients');
    const clientsDestDir = path.join(ASSETS_DIR, 'clients');
    ensureDir(clientsDestDir);

    let found = 0;
    let written = 0;
    let failed = 0;

    const files = fs.readdirSync(clientsSrcDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
    files.sort((a, b) => extractNumber(a) - extractNumber(b));

    for (const file of files) {
      const srcPath = path.join(clientsSrcDir, file);
      found++;
      try {
        const base = path.parse(file).name;
        await sharp(srcPath)
          .resize({ width: 400, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(path.join(clientsDestDir, `${base}.webp`));
        written++;
      } catch (err) {
        failed++;
        console.error(`Error processing client logo ${file}:`, err);
      }
    }
    stats.push({ section: 'Client Logos', found, written, failed });
  }

  // 7. GALLERY
  {
    const gallerySrcDir = path.join(MEDIA_DIR, 'gallery');
    const galleryDestDir = path.join(ASSETS_DIR, 'gallery');
    ensureDir(galleryDestDir);

    const categoryMappings = [
      { src: 'sculptures', dest: 'sculptures', prefix: 'sculptures', label: 'Sculptures' },
      { src: 'wall_murals', dest: 'murals', prefix: 'murals', label: 'Wall Murals' },
      { src: 'water_fountains', dest: 'fountains', prefix: 'fountains', label: 'Water Fountains' },
      { src: 'grc_products', dest: 'grc', prefix: 'grc', label: 'GRC Products' },
      { src: 'planters', dest: 'planters', prefix: 'planters', label: 'Planters' },
      { src: 'other_products', dest: 'other', prefix: 'other', label: 'Other' },
    ];

    for (const cat of categoryMappings) {
      const catSrcDir = path.join(gallerySrcDir, cat.src);
      const catDestDir = path.join(galleryDestDir, cat.dest);
      ensureDir(catDestDir);

      let found = 0;
      let written = 0;
      let failed = 0;

      if (fs.existsSync(catSrcDir)) {
        const rawFiles = fs.readdirSync(catSrcDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
        rawFiles.sort((a, b) => extractNumber(a) - extractNumber(b));

        for (let i = 0; i < rawFiles.length; i++) {
          const file = rawFiles[i];
          const srcPath = path.join(catSrcDir, file);
          found++;

          try {
            const meta = await sharp(srcPath).metadata();
            if (meta.width && meta.width < 600) {
              warnings.push(`Image width < 600px: ${cat.src}/${file} (${meta.width}x${meta.height})`);
            }

            // Check duplicate file hashes
            const hash = getFileHash(srcPath);
            if (seenHashes.has(hash)) {
              warnings.push(`Duplicate image content detected: ${cat.src}/${file} matches ${seenHashes.get(hash)}`);
            } else {
              seenHashes.set(hash, `${cat.src}/${file}`);
            }

            const n = i + 1;
            const seqStr = String(n).padStart(3, '0');
            const fullFilename = `${cat.prefix}-${seqStr}.webp`;
            const thumbFilename = `${cat.prefix}-${seqStr}-thumb.webp`;

            // Full (1600px wide, q80)
            await sharp(srcPath)
              .resize({ width: 1600, withoutEnlargement: true })
              .webp({ quality: 80 })
              .toFile(path.join(catDestDir, fullFilename));
            written++;

            // Thumb (600px wide, q75)
            await sharp(srcPath)
              .resize({ width: 600, withoutEnlargement: true })
              .webp({ quality: 75 })
              .toFile(path.join(catDestDir, thumbFilename));
            written++;
          } catch (err) {
            failed++;
            console.error(`Error processing ${cat.src}/${file}:`, err);
          }
        }
      }
      stats.push({ section: `Gallery: ${cat.label}`, found, written, failed });
    }

    // Category Covers (if present)
    const coversSrcDir = path.join(gallerySrcDir, 'category_covers');
    if (fs.existsSync(coversSrcDir)) {
      const coversDestDir = path.join(galleryDestDir, 'covers');
      ensureDir(coversDestDir);
      const coverFiles = fs.readdirSync(coversSrcDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
      let found = 0;
      let written = 0;
      let failed = 0;
      for (const file of coverFiles) {
        const srcPath = path.join(coversSrcDir, file);
        found++;
        try {
          const base = path.parse(file).name;
          await sharp(srcPath)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(coversDestDir, `${base}.webp`));
          written++;
        } catch {
          failed++;
        }
      }
      stats.push({ section: 'Gallery Covers', found, written, failed });
    }
  }

  // Print Summary Table
  console.log('\n======================================================');
  console.log('           IMAGE OPTIMIZATION SUMMARY TABLE           ');
  console.log('======================================================');
  console.log('| Section / Category            | Found | Written | Failed |');
  console.log('|-------------------------------|-------|---------|--------|');
  for (const s of stats) {
    const sec = s.section.padEnd(29, ' ');
    const fnd = String(s.found).padStart(5, ' ');
    const wrt = String(s.written).padStart(7, ' ');
    const fld = String(s.failed).padStart(6, ' ');
    console.log(`| ${sec} | ${fnd} | ${wrt} | ${fld} |`);
  }
  console.log('======================================================\n');

  if (warnings.length > 0) {
    console.log(`Logged Warnings (${warnings.length}):`);
    for (const w of warnings) {
      console.log(`  - ${w}`);
    }
    console.log('');
  } else {
    console.log('No image warnings detected.');
  }

  console.log('Image optimization finished successfully.');
}

run().catch((err) => {
  console.error('Fatal error in image optimization:', err);
  process.exit(1);
});
