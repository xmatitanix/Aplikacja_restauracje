#!/usr/bin/env node
/**
 * Generates placeholder assets for SETLOG
 * Run: node generate-assets.js
 * Requires: npm install canvas
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

function generateIcon(size, filename, style = 'full') {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#F5F4F1';
  ctx.fillRect(0, 0, size, size);

  // Black square border
  const margin = size * 0.08;
  ctx.strokeStyle = '#1A1A1A';
  ctx.lineWidth = size * 0.025;
  ctx.strokeRect(margin, margin, size - margin * 2, size - margin * 2);

  // "SL" text — monogram
  ctx.fillStyle = '#1A1A1A';
  ctx.font = `900 ${size * 0.32}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SL', size / 2, size / 2 - size * 0.06);

  // Thin line below text
  ctx.strokeStyle = '#1A1A1A';
  ctx.lineWidth = size * 0.012;
  const lineY = size / 2 + size * 0.14;
  ctx.beginPath();
  ctx.moveTo(size * 0.25, lineY);
  ctx.lineTo(size * 0.75, lineY);
  ctx.stroke();

  // Small "SET LOG" text
  ctx.fillStyle = '#7C7C7C';
  ctx.font = `600 ${size * 0.07}px sans-serif`;
  ctx.letterSpacing = '2px';
  ctx.fillText('SETLOG', size / 2, size / 2 + size * 0.26);

  const buffer = canvas.toBuffer('image/png');
  const filepath = path.join(ASSETS_DIR, filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`✓ Created: ${filename} (${size}x${size})`);
}

function generateSplash() {
  const w = 1284;
  const h = 2778;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#F5F4F1';
  ctx.fillRect(0, 0, w, h);

  // Wordmark
  ctx.fillStyle = '#1A1A1A';
  ctx.font = `900 ${w * 0.18}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SETLOG', w / 2, h / 2 - h * 0.04);

  // Tagline
  ctx.fillStyle = '#B8B6B0';
  ctx.font = `400 ${w * 0.045}px sans-serif`;
  ctx.fillText('音楽評価プラットフォーム', w / 2, h / 2 + h * 0.04);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(ASSETS_DIR, 'splash.png'), buffer);
  console.log('✓ Created: splash.png');
}

generateIcon(1024, 'icon.png');
generateIcon(1024, 'adaptive-icon.png');
generateIcon(48, 'favicon.png');
generateSplash();

console.log('\nAll assets generated! Run: npx expo start');
