import type { ChromecastImage, ImageData } from '@/types/background'

const LOCAL_JSON_PATH = '/chromecast-images.json'
const MAX_RETRY_ATTEMPTS = 5
const VALIDATION_TIMEOUT = 10000

export async function fetchChromecastImage(): Promise<ImageData> {
  const response = await fetch(LOCAL_JSON_PATH)
  if (!response.ok) {
    throw new Error(`Failed to fetch Chromecast images: ${response.status}`)
  }

  const images: ChromecastImage[] = await response.json()
  if (!images || images.length === 0) {
    throw new Error('No images available from Chromecast')
  }

  return await getRandomValidImage(images, 0)
}

async function getRandomValidImage(
  images: ChromecastImage[],
  attempt: number
): Promise<ImageData> {
  if (attempt >= MAX_RETRY_ATTEMPTS) {
    throw new Error('Max retry attempts reached for Chromecast images')
  }

  const randomIndex = Math.floor(Math.random() * images.length)
  const image = images[randomIndex]

  const bestUrl = getBestQualityUrl(image.url)

  const isValid = await validateImageUrl(bestUrl)
  if (!isValid) {
    return getRandomValidImage(images, attempt + 1)
  }

  return {
    url: bestUrl,
    photographer:
      image.photographer && image.photographer !== 'Unknown'
        ? image.photographer
        : null,
    location: image.location || undefined,
    attribution: 'Chromecast Backgrounds',
    source: 'chromecast',
  }
}

function getBestQualityUrl(url: string): string {
  if (url.includes('/s2560/')) {
    return url.replace('/s2560/', '/s3840/')
  }

  return url.replace(
    /s1280-w1280-h720-p-k-no-nd-mv|s1920-w1920-h1080/,
    's2560-w2560-h1440'
  )
}

async function validateImageUrl(url: string): Promise<boolean> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url

    setTimeout(() => resolve(false), VALIDATION_TIMEOUT)
  })
}
