import type { WeatherData, WeatherCondition } from '@/types/weather'

const WEATHER_CODE_TO_CONDITION: Record<number, WeatherCondition> = {
  0: 'clear',
  1: 'clear',
  2: 'partly-cloudy',
  3: 'cloudy',
  45: 'foggy',
  48: 'foggy',
  51: 'rainy',
  53: 'rainy',
  55: 'rainy',
  56: 'rainy',
  57: 'rainy',
  61: 'rainy',
  63: 'rainy',
  65: 'rainy',
  66: 'rainy',
  67: 'rainy',
  71: 'snowy',
  73: 'snowy',
  75: 'snowy',
  77: 'snowy',
  80: 'rainy',
  81: 'rainy',
  82: 'rainy',
  85: 'snowy',
  86: 'snowy',
  95: 'stormy',
  96: 'stormy',
  99: 'stormy',
}

const WEATHER_CODE_TO_TEXT: Record<number, string> = {
  0: 'Clear',
  1: 'Mostly Clear',
  2: 'Partly Cloudy',
  3: 'Cloudy',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Heavy Drizzle',
  56: 'Light Freezing Drizzle',
  57: 'Freezing Drizzle',
  61: 'Light Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  66: 'Light Freezing Rain',
  67: 'Freezing Rain',
  71: 'Light Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Light Showers',
  81: 'Showers',
  82: 'Heavy Showers',
  85: 'Light Snow Showers',
  86: 'Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with Hail',
  99: 'Heavy Thunderstorm',
}

function mapWeatherCode(code: number): WeatherCondition {
  return WEATHER_CODE_TO_CONDITION[code] || 'cloudy'
}

function getWeatherText(code: number): string {
  return WEATHER_CODE_TO_TEXT[code] || 'Cloudy'
}

export async function fetchWeatherByCoords(
  latitude: number,
  longitude: number,
  unit: 'celsius' | 'fahrenheit'
): Promise<WeatherData> {
  const tempUnit = unit === 'fahrenheit' ? 'fahrenheit' : 'celsius'
  const url = new URL('https://api.open-meteo.com/v1/forecast')

  url.searchParams.set('latitude', latitude.toString())
  url.searchParams.set('longitude', longitude.toString())
  url.searchParams.set('current', 'temperature_2m,apparent_temperature,weather_code')
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min')
  url.searchParams.set('temperature_unit', tempUnit)
  url.searchParams.set('timezone', 'auto')

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }

  const data = await response.json()

  const weatherCode = data.current.weather_code
  const condition = mapWeatherCode(weatherCode)
  const conditionText = getWeatherText(weatherCode)

  return {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    high: Math.round(data.daily.temperature_2m_max[0]),
    low: Math.round(data.daily.temperature_2m_min[0]),
    condition,
    conditionText,
    location: '',
    lastUpdated: new Date(),
  }
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
    url.searchParams.set('latitude', latitude.toString())
    url.searchParams.set('longitude', longitude.toString())
    url.searchParams.set('count', '1')

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error('Geocoding failed')
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const result = data.results[0]
      return result.name || 'Unknown'
    }

    return 'Unknown'
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return 'Unknown'
  }
}
