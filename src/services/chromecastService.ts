import type { ChromecastImage, ImageData } from '@/types/background'
import imageData from './image-data.json'

const BASE_URL = 'https://background-images.anujparakh.dev/chromecast'
const MAX_RETRY_ATTEMPTS = 5
const VALIDATION_TIMEOUT = 10000

export async function fetchChromecastImage(): Promise<ImageData> {
  const images: ChromecastImage[] = imageData as ChromecastImage[]

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

  if (!image) {
    throw new Error('Failed to select a random image')
  }

  const imageUrl = `${BASE_URL}/${image.filename}`

  const isValid = await validateImageUrl(imageUrl)
  if (!isValid) {
    return getRandomValidImage(images, attempt + 1)
  }

  return {
    url: imageUrl,
    photographer:
      image.photographer && image.photographer !== 'Unknown'
        ? image.photographer
        : undefined,
    location:
      image.location && image.location.trim() !== ''
        ? image.location
        : undefined,
    attribution: 'Chromecast Backgrounds',
    source: 'chromecast',
  }
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
