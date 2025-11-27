export interface ImageData {
  url: string
  photographer?: string | null
  location?: string
  attribution: string
  source: 'chromecast' | 'sourced'
}

export interface ChromecastImage {
  url: string
  name: string
  photographer: string
  gplus: string
  location: string
  second_url: string
}
