import type { GeolocationCoords } from '@/types/weather'
import type { WeatherSettings } from '@/types/settings'

const AUSTIN_COORDS: GeolocationCoords = {
  latitude: 30.2672,
  longitude: -97.7431,
}

export async function getCurrentPosition(): Promise<GeolocationCoords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      error => {
        reject(error)
      },
      {
        timeout: 10000,
        maximumAge: 600000,
      }
    )
  })
}

export async function geocodeCity(
  cityName: string
): Promise<GeolocationCoords> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', cityName)
  url.searchParams.set('count', '1')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`)
  }

  const data = await response.json()

  if (!data.results || data.results.length === 0) {
    throw new Error(`Location not found: ${cityName}`)
  }

  const result = data.results[0]
  return {
    latitude: result.latitude,
    longitude: result.longitude,
  }
}

export async function getLocationFromSettings(
  settings: WeatherSettings
): Promise<GeolocationCoords> {
  if (settings.locationMode === 'manual' && settings.manualLocation.trim()) {
    try {
      return await geocodeCity(settings.manualLocation)
    } catch (error) {
      console.error('Failed to geocode manual location:', error)
      return AUSTIN_COORDS
    }
  }

  try {
    return await getCurrentPosition()
  } catch (error) {
    console.error('Failed to get current position:', error)
    return AUSTIN_COORDS
  }
}
