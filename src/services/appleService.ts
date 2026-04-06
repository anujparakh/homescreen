import type { ImageData, ImageResponse } from '@/types/background'

export async function fetchAppleVideo(filename?: string): Promise<ImageData> {
  const url = filename
    ? `https://backgrounds.anujparakh.dev/apple?type=json&filename=${encodeURIComponent(filename)}`
    : 'https://backgrounds.anujparakh.dev/apple?type=json'
  const response = await fetch(url)
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

export type AppleVideoEntry = {
  filename: string
  imageUrl: string
}

export async function fetchAppleVideoList(): Promise<AppleVideoEntry[]> {
  const response = await fetch('https://backgrounds.anujparakh.dev/apple/list')
  const data = await response.json() as Array<Record<string, string>>
  return data
    .filter(item => item['filename'] && item['imageUrl'])
    .map(item => ({ filename: item['filename']!, imageUrl: item['imageUrl']! }))
}
