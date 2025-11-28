export interface ImageData {
  url: string
  photographer: string | undefined
  location: string | undefined
  attribution: string
  source: 'chromecast' | 'sourced'
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
