import { useState, useEffect } from 'preact/hooks'
import { useSettings } from '@/hooks/useSettings'
import type { WeatherData, WeatherCondition } from '@/types/weather'
import {
  SunIcon,
  CloudSunIcon,
  CloudIcon,
  CloudRainIcon,
  CloudSnowIcon,
  LightningIcon,
  CloudFogIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

interface WidgetGroupProps {
  textColor: string
  secondaryTextColor: string
  weather?: WeatherData | null
}

const WEATHER_ICONS: Record<WeatherCondition, Icon> = {
  clear: SunIcon,
  'partly-cloudy': CloudSunIcon,
  cloudy: CloudIcon,
  rainy: CloudRainIcon,
  snowy: CloudSnowIcon,
  stormy: LightningIcon,
  foggy: CloudFogIcon,
}

export function WidgetGroup({
  textColor,
  secondaryTextColor,
  weather,
}: WidgetGroupProps) {
  const { settings } = useSettings()
  const { showClock, use24HourFormat, showSeconds, size, alignment } =
    settings.clock
  const { showDate, showDayOfWeek, showMonthAndDay, shortMonthName, showYear } =
    settings.date
  const { showWeather, unit, showTemperature, showCondition, showHighLow } =
    settings.weather

  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!showClock) {
    return null
  }

  const hours24 = time.getHours()
  const hours12 = hours24 % 12 || 12
  const displayHours = use24HourFormat
    ? hours24.toString().padStart(2, '0')
    : hours12.toString()
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')
  const ampm = hours24 >= 12 ? 'PM' : 'AM'

  // Size classes
  const timeSize = size === 'large' ? 'text-8xl' : 'text-5xl'
  const ampmSize = size === 'large' ? 'text-4xl' : 'text-2xl'
  const dateSize = size === 'large' ? 'text-2xl' : 'text-lg'

  // Alignment classes
  const alignmentClasses = {
    'bottom-left': 'items-start justify-end',
    'bottom-right': 'items-end justify-end',
    'top-left': 'items-start justify-start',
    'top-right': 'items-end justify-start',
    center: 'items-center justify-center',
  }

  const containerAlignment = alignmentClasses[alignment]

  return (
    <div class={`w-full flex flex-col gap-4 ${containerAlignment}`}>
      <div class="backdrop-blur-xs bg-black/30 rounded-2xl px-8 py-6 shadow-lg">
        {/* ------------ */}
        {/* Clock Widget */}
        {/* ------------ */}
        <div class="flex items-baseline gap-3">
          <div
            class={`${timeSize} font-bold ${textColor} tracking-wider font-mono`}
          >
            {displayHours}:{minutes}
            {showSeconds ? `:${seconds}` : ''}
          </div>
          {!use24HourFormat && (
            <div class={`${ampmSize} font-semibold ${secondaryTextColor}`}>
              {ampm}
            </div>
          )}
        </div>
        {/* ----------- */}
        {/* Date Widget */}
        {/* ----------- */}
        {showDate && (
          <div
            class={`${dateSize} ${secondaryTextColor} mt-2 transition-colors duration-500`}
          >
            {time.toLocaleDateString('en-US', {
              ...(showDayOfWeek && { weekday: 'long' }),
              ...(showYear && { year: 'numeric' }),
              ...(showMonthAndDay && {
                month: shortMonthName ? 'short' : 'long',
                day: 'numeric',
              }),
            })}
          </div>
        )}
        {/* -------------- */}
        {/* Weather Widget */}
        {/* -------------- */}
        {showWeather && weather && (
          <div class={`mt-3 transition-colors duration-500`}>
            {/* Compact weather info row */}
            <div class={`flex items-center gap-3 ${secondaryTextColor}`}>
              {/* Weather Icon */}
              {showCondition &&
                (() => {
                  const WeatherIcon = WEATHER_ICONS[weather.condition]
                  const iconSize = size === 'large' ? 32 : 24
                  return <WeatherIcon size={iconSize} weight="fill" />
                })()}

              {/* Temperature */}
              {showTemperature && (
                <span
                  class={`${size === 'large' ? 'text-3xl' : 'text-2xl'} font-semibold`}
                >
                  {weather.temperature}°{unit === 'fahrenheit' ? 'F' : 'C'}
                </span>
              )}

              {/* Condition Text */}
              {/* Commented to make this cleaner */}
              {/* {showCondition && (
                <span class={`${dateSize} opacity-90`}>
                  {weather.conditionText}
                </span>
              )} */}

              {/* High/Low */}
              {showHighLow && (
                <span class={`${dateSize} opacity-80`}>
                  {weather.high}° / {weather.low}°
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
