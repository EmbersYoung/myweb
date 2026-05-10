import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 生成 192x192 图标
  await page.setViewport({ width: 192, height: 192 });
  const svgPath = path.join(process.cwd(), 'public', 'icon.svg');
  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  await page.setContent(`
    <html>
      <head><style>body { margin: 0; }</style></head>
      <body>${svgContent}</body>
    </html>
  `);
  const screenshot192 = await page.screenshot({
    type: 'png',
    omitBackground: true,
  });
  fs.writeFileSync(path.join(process.cwd(), 'public', 'icon-192.png'), screenshot192);
  console.log('✓ Generated icon-192.png');

  // 生成 512x512 图标
  await page.setViewport({ width: 512, height: 512 });
  const screenshot512 = await page.screenshot({
    type: 'png',
    omitBackground: true,
  });
  fs.writeFileSync(path.join(process.cwd(), 'public', 'icon-512.png'), screenshot512);
  console.log('✓ Generated icon-512.png');

  await browser.close();
}

generateIcons().catch(console.error);