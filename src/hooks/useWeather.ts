import { useState, useEffect, useCallback } from 'preact/hooks'
import type { WeatherData } from '@/types/weather'
import type { WeatherSettings } from '@/types/settings'
import { fetchWeatherByCoords, reverseGeocode } from '@/services/weatherService'
import { getLocationFromSettings } from '@/services/geolocationService'

const CACHE_KEY = 'homescreen-weather-cache'

interface CachedWeather {
  data: WeatherData
  timestamp: number
}

function loadCachedWeather(): WeatherData | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const { data, timestamp }: CachedWeather = JSON.parse(cached)
    const age = Date.now() - timestamp

    if (age < 3600000) {
      return {
        ...data,
        lastUpdated: new Date(data.lastUpdated),
      }
    }

    return null
  } catch (error) {
    console.error('Failed to load cached weather:', error)
    return null
  }
}

function saveCachedWeather(data: WeatherData): void {
  try {
    const cached: CachedWeather = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached))
  } catch (error) {
    console.error('Failed to save cached weather:', error)
  }
}

export function useWeather(settings: WeatherSettings) {
  const [weather, setWeather] = useState<WeatherData | null>(() =>
    loadCachedWeather()
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = useCallback(async () => {
    if (!settings.showWeather) return

    setIsLoading(true)
    setError(null)

    try {
      const coords = await getLocationFromSettings(settings)
      const weatherData = await fetchWeatherByCoords(
        coords.latitude,
        coords.longitude,
        settings.unit
      )

      const location = await reverseGeocode(coords.latitude, coords.longitude)
      weatherData.location = location

      setWeather(weatherData)
      saveCachedWeather(weatherData)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather'
      setError(message)
      console.error('Weather fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [settings])

  useEffect(() => {
    fetchWeather()
  }, [fetchWeather])

  useEffect(() => {
    if (!settings.showWeather || settings.refreshInterval <= 0) return

    const interval = setInterval(() => {
      fetchWeather()
    }, settings.refreshInterval)

    return () => clearInterval(interval)
  }, [settings.showWeather, settings.refreshInterval, fetchWeather])

  return {
    weather,
    isLoading,
    error,
    refresh: fetchWeather,
  }
}
