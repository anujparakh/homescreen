export type ClockSettings = {
  showClock: boolean
  use24HourFormat: boolean
  showSeconds: boolean
  size: 'small' | 'large'
  alignment:
    | 'bottom-left'
    | 'bottom-right'
    | 'top-left'
    | 'top-right'
    | 'center'
}

export type DateSettings = {
  showDate: boolean
  showDayOfWeek: boolean
  showMonthAndDay: boolean
  shortMonthName: boolean
  showYear: boolean
}

export type BackgroundSettings = {
  enabled: boolean
  source: 'chromecast' | 'sourced' | 'apple'
  rotationInterval: number
  showAttribution: boolean
  enableAnimation: boolean
}

export type WeatherSettings = {
  showWeather: boolean
  unit: 'celsius' | 'fahrenheit'
  locationMode: 'auto' | 'manual'
  manualLocation: string
  refreshInterval: number
  showTemperature: boolean
  showCondition: boolean
  showHighLow: boolean
}

export type Settings = {
  clock: ClockSettings
  date: DateSettings
  background: BackgroundSettings
  weather: WeatherSettings
}
