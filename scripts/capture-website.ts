import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

async function captureWebsite() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  
  // Listen for console logs
  page.on('console', msg => {
    console.log('Browser Console:', msg.text())
  })

  // Listen for errors
  page.on('error', err => {
    console.error('Page Error:', err.message || 'Unknown error')
  })

  page.on('pageerror', err => {
    console.error('Page Error:', String(err))
  })
  
  // Set viewport size
  await page.setViewport({ width: 1920, height: 1080 })

  console.log('Navigating to http://localhost:3000...')
  
  try {
    // Navigate to the website
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    })

    console.log('Page loaded successfully!')

    // Wait a bit for any client-side rendering
    await new Promise(resolve => setTimeout(resolve, 5000))

    console.log('Taking screenshots...')

    // Capture full page screenshot
    const screenshotPath = path.join(process.cwd(), 'screenshots', 'homepage-full.png')
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    })
    console.log(`Full page screenshot saved: ${screenshotPath}`)

    // Capture viewport screenshot
    const viewportPath = path.join(process.cwd(), 'screenshots', 'homepage-viewport.png')
    await page.screenshot({
      path: viewportPath,
    })
    console.log(`Viewport screenshot saved: ${viewportPath}`)

    // Get page content
    const content = await page.content()
    const contentPath = path.join(process.cwd(), 'screenshots', 'page-content.html')
    fs.writeFileSync(contentPath, content)
    console.log(`Page HTML saved: ${contentPath}`)

    // Get page title
    const title = await page.title()
    console.log(`Page title: ${title}`)

    // Extract key information
    const pageData = await page.evaluate(() => {
      return {
        heroTitle: document.querySelector('h1')?.textContent || 'Not found',
        sections: Array.from(document.querySelectorAll('h2')).map(h => h.textContent || ''),
        buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent || ''),
        links: Array.from(document.querySelectorAll('a')).length,
      }
    })

    console.log('\n=== Page Analysis ===')
    console.log('Hero Title:', pageData.heroTitle)
    console.log('Sections:', pageData.sections)
    console.log('Buttons:', pageData.buttons)
    console.log('Total Links:', pageData.links)

    // Save page data
    const dataPath = path.join(process.cwd(), 'screenshots', 'page-data.json')
    fs.writeFileSync(dataPath, JSON.stringify(pageData, null, 2))
    console.log(`Page data saved: ${dataPath}`)

    await browser.close()

    return {
      success: true,
      screenshotPath,
      viewportPath,
      contentPath,
      dataPath,
      pageData,
    }
  } catch (error) {
    console.error('Error capturing website:', error)
    await browser.close()
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(process.cwd(), 'screenshots')
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true })
}

captureWebsite()
  .then(result => {
    console.log('\n=== Result ===')
    console.log(JSON.stringify(result, null, 2))
  })
  .catch(console.error)