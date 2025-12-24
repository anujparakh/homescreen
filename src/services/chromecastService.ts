import type { ImageData, ImageResponse } from '@/types/background'

export async function fetchChromecastImage(): Promise<ImageData> {
  const response = await fetch(
    'https://backgrounds.anujparakh.dev/chromecast?type=json'
  )
  const data: ImageResponse = await response.json()

  return {
    url: data.imageUrl,
    source: data.source,
    attribution: data.metadata?.['attribution'] || 'Chromecast Background',
    photographer: data.metadata?.['photographer'],
    location: data.metadata?.['location'],
  }
}
