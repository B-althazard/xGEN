/**
 * Icon Generator — Sharp-based
 * Run with: node scripts/generate-icons.js
 * Requires: sharp (npm install sharp)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SVG_PATH = path.join(__dirname, '../assets/icons/favicon.svg');
const OUT_DIR  = path.join(__dirname, '../assets/icons');

const SIZES = [48, 72, 96, 128, 144, 192, 512];

async function main() {
  if (!fs.existsSync(SVG_PATH)) {
    console.error(`SVG not found: ${SVG_PATH}`);
    process.exit(1);
  }

  console.log('Reading SVG...');
  const svgBuffer = fs.readFileSync(SVG_PATH);

  const svgMeta = await sharp(svgBuffer).metadata();
  console.log(`SVG dimensions: ${svgMeta.width}x${svgMeta.height}`);

  for (const size of SIZES) {
    const outPath = path.join(OUT_DIR, `icon-${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`✓ icon-${size}.png`);
  }

  console.log('\nGenerating maskable icons...');
  for (const size of [192, 512]) {
    const paddedSize = Math.round(size * 0.7);
    const outPath = path.join(OUT_DIR, `icon-maskable-${size}.png`);

    await sharp(svgBuffer)
      .resize(paddedSize, paddedSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outPath);
    console.log(`✓ icon-maskable-${size}.png`);
  }

  console.log('\nAll icons generated!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
