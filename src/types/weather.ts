export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'snowy'
  | 'stormy'
  | 'foggy'

export type WeatherData = {
  temperature: number
  feelsLike: number
  high: number
  low: number
  condition: WeatherCondition
  conditionText: string
  location: string
  lastUpdated: Date
}

export type GeolocationCoords = {
  latitude: number
  longitude: number
}
