export interface ImageData {
  url: string
  photographer: string | undefined
  location: string | undefined
  attribution: string
  source: ImageSource
}

export interface ChromecastImage {
  filename: string
  original_url: string
  download_url: string
  photographer: string
  gplus: string
  location: string
  second_url: string
  old_filename: string
  code: string
}

export type ImageSource = 'chromecast' | 'sourced'

export type ImageResponse = {
  imageUrl: string
  source: ImageSource
  metadata?: Record<string, string>
}
