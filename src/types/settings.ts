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
  source: 'chromecast' | 'sourced'
  rotationInterval: number
  showAttribution: boolean
}

export type Settings = {
  clock: ClockSettings
  date: DateSettings
  background: BackgroundSettings
}
