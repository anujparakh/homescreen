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
import { cn } from '@/util/cn'

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

  // Size classes - responsive
  const timeSize = size === 'large' ? 'text-5xl sm:text-7xl md:text-8xl' : 'text-4xl sm:text-5xl'
  const ampmSize = size === 'large' ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl sm:text-2xl'
  const dateSize = size === 'large' ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg'

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
    <div class={cn('w-full flex flex-col gap-4', containerAlignment)}>
      <div class="backdrop-blur-xs bg-black/30 rounded-xl sm:rounded-2xl px-4 py-4 sm:px-8 sm:py-6 shadow-lg">
        {/* ------------ */}
        {/* Clock Widget */}
        {/* ------------ */}
        <div class="flex items-baseline gap-2 sm:gap-3">
          <div
            class={cn(timeSize, 'font-bold tracking-wider font-mono', textColor)}
          >
            {displayHours}:{minutes}
            {showSeconds ? `:${seconds}` : ''}
          </div>
          {!use24HourFormat && (
            <div class={cn(ampmSize, 'font-semibold', secondaryTextColor)}>
              {ampm}
            </div>
          )}
        </div>
        {/* ----------- */}
        {/* Date Widget */}
        {/* ----------- */}
        {showDate && (
          <div
            class={cn(dateSize, secondaryTextColor, 'mt-2 transition-colors duration-500')}
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
          <div class="mt-2 sm:mt-3 transition-colors duration-500">
            {/* Compact weather info row */}
            <div class={cn('flex items-center gap-2 sm:gap-3', secondaryTextColor)}>
              {/* Weather Icon */}
              {showCondition &&
                (() => {
                  const WeatherIcon = WEATHER_ICONS[weather.condition]
                  const iconSize = size === 'large' ? 28 : 20
                  return <WeatherIcon size={iconSize} class="sm:w-6 sm:h-6 md:w-8 md:h-8" weight="fill" />
                })()}

              {/* Temperature */}
              {showTemperature && (
                <span
                  class={cn(
                    size === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl',
                    'font-semibold'
                  )}
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
