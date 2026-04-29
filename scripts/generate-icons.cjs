const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const publicDir = path.join(__dirname, '..', 'public');

// Create a simple icon with blue background and white fuel pump symbol
async function generateIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="128" fill="#3b82f6"/>
      <g transform="translate(128, 128)">
        <rect x="40" y="80" width="120" height="160" rx="8" fill="white"/>
        <path d="M160 140 L200 140 L200 180 L220 180 L220 200 L200 200 L200 240 L160 240" stroke="white" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="60" y="100" width="80" height="40" rx="4" fill="#3b82f6"/>
        <rect x="20" y="240" width="160" height="16" rx="4" fill="white"/>
        <text x="100" y="130" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">$</text>
      </g>
    </svg>
  `;

  const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
  
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(outputPath);
  
  console.log(`Generated ${outputPath}`);
}

async function main() {
  for (const size of sizes) {
    await generateIcon(size);
  }
  console.log('All icons generated successfully!');
}

main().catch(console.error);
