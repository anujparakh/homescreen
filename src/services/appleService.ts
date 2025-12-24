import type { ImageData, ImageResponse } from '@/types/background'

export async function fetchAppleVideo(): Promise<ImageData> {
  const response = await fetch(
    'https://backgrounds.anujparakh.dev/apple?type=json'
  )
  const data: ImageResponse = await response.json()

  return {
    url: data.imageUrl,
    source: data.source,
    attribution: data.metadata?.['attribution'] || 'Apple',
    photographer: data.metadata?.['photographer'],
    location: data.metadata?.['location'],
    isVideo: true,
  }
}
