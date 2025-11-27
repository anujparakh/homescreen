import type { ImageData } from '@/types/background'

const SOURCED_IMAGES = [
  '/backgrounds/sourced-1.jpg',
  '/backgrounds/sourced-2.jpg',
  '/backgrounds/sourced-3.jpg',
  '/backgrounds/sourced-4.jpg',
  '/backgrounds/sourced-5.jpg',
]

const CACHE_KEY = 'homescreen-sourced-index'

export function getNextSourcedImage(): ImageData {
  const currentIndex = getCurrentIndex()
  const imageUrl = SOURCED_IMAGES[currentIndex]

  const nextIndex = (currentIndex + 1) % SOURCED_IMAGES.length
  saveCurrentIndex(nextIndex)

  return {
    url: imageUrl,
    attribution: 'Local Images',
    source: 'sourced',
  }
}

function getCurrentIndex(): number {
  try {
    const stored = localStorage.getItem(CACHE_KEY)
    if (stored) {
      const index = parseInt(stored, 10)
      if (!isNaN(index) && index >= 0 && index < SOURCED_IMAGES.length) {
        return index
      }
    }
  } catch (error) {
    console.error('Failed to read sourced index from localStorage:', error)
  }
  return 0
}

function saveCurrentIndex(index: number): void {
  try {
    localStorage.setItem(CACHE_KEY, index.toString())
  } catch (error) {
    console.error('Failed to save sourced index to localStorage:', error)
  }
}
