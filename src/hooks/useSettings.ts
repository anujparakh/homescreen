import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import type { Settings } from '@/types/settings'

export const STORAGE_KEY = 'homescreen-settings'

export const DEFAULT_SETTINGS: Settings = {
  clock: {
    showClock: true,
    use24HourFormat: false,
    showSeconds: false,
    size: 'small',
    alignment: 'center',
  },
  date: {
    showDate: true,
    showDayOfWeek: true,
    showMonthAndDay: true,
    shortMonthName: true,
    showYear: false,
  },
  background: {
    enabled: true,
    source: 'chromecast',
    rotationInterval: 1800000,
    showAttribution: true,
    enableAnimation: false,
  },
  weather: {
    showWeather: true,
    unit: 'fahrenheit',
    locationMode: 'auto',
    manualLocation: 'Austin, TX',
    refreshInterval: 600000,
    showTemperature: true,
    showCondition: true,
    showHighLow: true,
  },
}

export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<Settings>
      return {
        clock: { ...DEFAULT_SETTINGS.clock, ...parsed.clock },
        date: { ...DEFAULT_SETTINGS.date, ...parsed.date },
        background: { ...DEFAULT_SETTINGS.background, ...parsed.background },
        weather: { ...DEFAULT_SETTINGS.weather, ...parsed.weather },
      }
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error)
  }
  return DEFAULT_SETTINGS
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error)
  }
}

export type SettingsContextValue = {
  settings: Settings
  setSettings: (newSettings: Settings | ((prev: Settings) => Settings)) => void
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
)

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
