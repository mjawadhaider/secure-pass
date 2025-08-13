const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Define the icon sizes from the markdown file
const iconSizes = [
  72, 96, 128, 144, 152, 192, 384, 512
];

// Create directory if it doesn't exist
const iconDir = path.join(process.cwd(), 'public', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Function to draw the lock icon with proper centering
function drawLockIcon(ctx, size) {
  // Calculate center point of the canvas
  const centerX = size / 2;
  const centerY = size / 2;

  // Scale based on icon size for consistent proportions
  const scale = size / 32;

  // Lock dimensions (relative to center)
  const lockWidth = 18 * scale;
  const lockHeight = 11 * scale;

  // Calculate shackle dimensions
  const shackleWidth = 10 * scale;
  const shackleHeight = 9 * scale;

  // Calculate total height of lock + shackle
  const totalHeight = lockHeight + shackleHeight;

  // Position lock to be centered both horizontally and vertically
  const lockX = centerX - (lockWidth / 2);
  const lockY = centerY - (totalHeight / 2) + shackleHeight; // Center the entire lock assembly

  // Position shackle above the lock
  const shackleX = centerX - (shackleWidth / 2);
  const shackleY = lockY - shackleHeight;

  // Draw styling
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Lock body (rounded rectangle)
  const radius = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(lockX + radius, lockY);
  ctx.lineTo(lockX + lockWidth - radius, lockY);
  ctx.arcTo(lockX + lockWidth, lockY, lockX + lockWidth, lockY + radius, radius);
  ctx.lineTo(lockX + lockWidth, lockY + lockHeight - radius);
  ctx.arcTo(lockX + lockWidth, lockY + lockHeight, lockX + lockWidth - radius, lockY + lockHeight, radius);
  ctx.lineTo(lockX + radius, lockY + lockHeight);
  ctx.arcTo(lockX, lockY + lockHeight, lockX, lockY + lockHeight - radius, radius);
  ctx.lineTo(lockX, lockY + radius);
  ctx.arcTo(lockX, lockY, lockX + radius, lockY, radius);
  ctx.stroke();

  // Lock shackle
  ctx.beginPath();
  ctx.moveTo(shackleX, lockY);
  ctx.lineTo(shackleX, shackleY + shackleHeight * 0.5);
  ctx.arcTo(shackleX, shackleY, shackleX + shackleWidth / 2, shackleY, shackleWidth / 2);
  ctx.arcTo(shackleX + shackleWidth, shackleY, shackleX + shackleWidth, shackleY + shackleHeight * 0.5, shackleWidth / 2);
  ctx.lineTo(shackleX + shackleWidth, lockY);
  ctx.stroke();

  // Lock keyhole (centered in the lock body)
  ctx.beginPath();
  ctx.arc(centerX, lockY + lockHeight / 2, scale, 0, Math.PI * 2);
  ctx.stroke();
}

// Generate icons for each size
iconSizes.forEach(size => {
  console.log(`Generating ${size}x${size} icon...`);

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Create gradient background (like in icon.js)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#6366f1');
  gradient.addColorStop(1, '#4f46e5');

  // Fill background
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.25); // Rounded corners
  ctx.fill();

  // Draw the lock icon
  drawLockIcon(ctx, size);

  // Save the file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconDir, `icon-${size}x${size}.png`), buffer);
});

// Generate special add-icon.png (192x192)
console.log('Generating add-icon.png (192x192)...');
const addIconCanvas = createCanvas(192, 192);
const addIconCtx = addIconCanvas.getContext('2d');

// Background
const addIconGradient = addIconCtx.createLinearGradient(0, 0, 192, 192);
addIconGradient.addColorStop(0, '#6366f1');
addIconGradient.addColorStop(1, '#4f46e5');
addIconCtx.fillStyle = addIconGradient;
addIconCtx.beginPath();
addIconCtx.roundRect(0, 0, 192, 192, 48);
addIconCtx.fill();

// Draw plus symbol (centered)
addIconCtx.strokeStyle = 'white';
addIconCtx.lineWidth = 12;
addIconCtx.beginPath();
addIconCtx.moveTo(192/2 - 32, 192/2);
addIconCtx.lineTo(192/2 + 32, 192/2);
addIconCtx.moveTo(192/2, 192/2 - 32);
addIconCtx.lineTo(192/2, 192/2 + 32);
addIconCtx.stroke();

// Save add icon
const addIconBuffer = addIconCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(iconDir, 'add-icon.png'), addIconBuffer);

// Generate favicon.ico (use 32x32 icon)
console.log('Generating favicon.ico...');
const faviconCanvas = createCanvas(32, 32);
const faviconCtx = faviconCanvas.getContext('2d');

// Background
const faviconGradient = faviconCtx.createLinearGradient(0, 0, 32, 32);
faviconGradient.addColorStop(0, '#6366f1');
faviconGradient.addColorStop(1, '#4f46e5');
faviconCtx.fillStyle = faviconGradient;
faviconCtx.beginPath();
faviconCtx.roundRect(0, 0, 32, 32, 8);
faviconCtx.fill();

// Draw lock icon
drawLockIcon(faviconCtx, 32);

// Save favicon
const faviconBuffer = faviconCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(iconDir, 'favicon.ico'), faviconBuffer);

console.log('All icons generated successfully!');