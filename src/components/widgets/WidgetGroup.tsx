import { useState, useEffect, useRef } from 'preact/hooks'
import { useSettings } from '@/hooks/useSettings'
import type { WeatherData, WeatherCondition } from '@/types/weather'
import type { WidgetSettings } from '@/types/settings'
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
import { Stopwatch } from './Stopwatch'

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
  const { settings, setSettings } = useSettings()
  const { type, size, alignment, backgroundBlur } = settings.widget
  const { showClock, use24HourFormat, showSeconds } = settings.clock
  const { showDate, showDayOfWeek, showMonthAndDay, shortMonthName, showYear } =
    settings.date
  const { showWeather, unit, showTemperature, showCondition, showHighLow } =
    settings.weather

  const [time, setTime] = useState(new Date())
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null)
  const widgetRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Drag handlers for touch devices
  const handleTouchStart = (e: TouchEvent) => {
    if (!containerRef.current || !widgetRef.current) return

    // Don't start dragging if touching a button or interactive element
    const target = e.target as HTMLElement
    if (target.closest('button') || target.tagName === 'BUTTON') {
      return
    }

    const touch = e.touches[0]
    if (!touch) return

    setIsDragging(true)
    setDragPosition({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return
    const touch = e.touches[0]
    if (!touch) return

    e.preventDefault()
    setDragPosition({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = () => {
    if (!isDragging || !dragPosition || !containerRef.current) return

    // Calculate closest alignment position
    const container = containerRef.current.getBoundingClientRect()
    const x = dragPosition.x - container.left
    const y = dragPosition.y - container.top

    // Determine which third of the screen we're in
    const horizontalThird = x / container.width
    const verticalThird = y / container.height

    let newAlignment: WidgetSettings['alignment'] = 'center'

    // Determine alignment based on position
    if (verticalThird < 0.33) {
      // Top third
      if (horizontalThird < 0.33) {
        newAlignment = 'top-left'
      } else if (horizontalThird > 0.67) {
        newAlignment = 'top-right'
      } else {
        newAlignment = 'top-left' // Default to top-left for top-center
      }
    } else if (verticalThird > 0.67) {
      // Bottom third
      if (horizontalThird < 0.33) {
        newAlignment = 'bottom-left'
      } else if (horizontalThird > 0.67) {
        newAlignment = 'bottom-right'
      } else {
        newAlignment = 'bottom-left' // Default to bottom-left for bottom-center
      }
    } else {
      // Middle third - center
      newAlignment = 'center'
    }

    // Update settings with new alignment
    setSettings(prev => ({
      ...prev,
      widget: { ...prev.widget, alignment: newAlignment }
    }))

    setIsDragging(false)
    setDragPosition(null)
  }

  if (type === 'none') {
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
  const timeSize =
    size === 'large'
      ? 'text-6xl sm:text-8xl md:text-9xl'
      : size === 'medium'
        ? 'text-5xl sm:text-7xl md:text-8xl'
        : 'text-4xl sm:text-5xl md:text-6xl'
  const ampmSize =
    size === 'large'
      ? 'text-3xl sm:text-4xl md:text-5xl'
      : size === 'medium'
        ? 'text-2xl sm:text-3xl md:text-4xl'
        : 'text-xl sm:text-2xl md:text-3xl'
  const dateSize =
    size === 'large'
      ? 'text-xl sm:text-2xl md:text-3xl'
      : size === 'medium'
        ? 'text-lg sm:text-xl md:text-2xl'
        : 'text-base sm:text-lg md:text-xl'

  // Alignment classes
  const alignmentClasses = {
    'bottom-left': 'items-start justify-end',
    'bottom-right': 'items-end justify-end',
    'top-left': 'items-start justify-start',
    'top-right': 'items-end justify-start',
    center: 'items-center justify-center',
  }

  const containerAlignment = alignmentClasses[alignment]

  // Calculate widget position when dragging
  const getWidgetStyle = () => {
    if (!isDragging || !dragPosition) {
      return {}
    }

    return {
      position: 'fixed' as const,
      left: `${dragPosition.x}px`,
      top: `${dragPosition.y}px`,
      transform: 'translate(-50%, -50%)',
      transition: 'none',
      zIndex: 100,
    }
  }

  return (
    <div
      ref={containerRef}
      class={cn('w-full flex flex-col gap-4', !isDragging && containerAlignment)}
    >
      <div
        ref={widgetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ ...getWidgetStyle(), touchAction: 'none' }}
        class={cn(
          'rounded-xl sm:rounded-2xl px-4 py-4 sm:px-8 sm:py-6 ',
          backgroundBlur && 'backdrop-blur-xs bg-black/30 shadow-lg',
          isDragging && 'opacity-80 scale-105 transition-transform'
        )}
      >
        {/* ------------ */}
        {/* Clock Widget */}
        {/* ------------ */}
        {type === 'clock' && showClock && (
          <div class="flex items-baseline gap-2 sm:gap-3">
            <div
              class={cn(
                timeSize,
                'font-bold tracking-wider font-mono',
                textColor
              )}
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
        )}
        {/* ---------------- */}
        {/* Stopwatch Widget */}
        {/* ---------------- */}
        {type === 'stopwatch' && (
          <Stopwatch textColor={textColor} size={size} />
        )}
        {/* ----------- */}
        {/* Date Widget */}
        {/* ----------- */}
        {showDate && (
          <div
            class={cn(
              dateSize,
              secondaryTextColor,
              'mt-2 transition-colors duration-500'
            )}
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
            <div
              class={cn('flex items-center gap-2 sm:gap-3', secondaryTextColor)}
            >
              {/* Weather Icon */}
              {showCondition &&
                (() => {
                  const WeatherIcon = WEATHER_ICONS[weather.condition]
                  const iconSize =
                    size === 'large' ? 32 : size === 'medium' ? 28 : 24
                  return (
                    <WeatherIcon
                      size={iconSize}
                      class="sm:w-6 sm:h-6 md:w-8 md:h-8"
                      weight="fill"
                    />
                  )
                })()}

              {/* Temperature */}
              {showTemperature && (
                <span
                  class={cn(
                    size === 'large'
                      ? 'text-3xl sm:text-4xl'
                      : size === 'medium'
                        ? 'text-2xl sm:text-3xl'
                        : 'text-xl sm:text-2xl',
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
