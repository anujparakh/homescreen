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

export type Settings = {
  clock: ClockSettings
}
