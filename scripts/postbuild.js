import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const savingsDir = path.join(distDir, 'savings');
const srcHtml = path.join(distDir, 'index.html');
const destHtml = path.join(savingsDir, 'index.html');

if (fs.existsSync(srcHtml)) {
  fs.mkdirSync(savingsDir, { recursive: true });
  fs.copyFileSync(srcHtml, destHtml);
  console.log('✓ Created dist/savings/index.html for static GitHub Pages support');
}
