import { useState, useEffect } from 'preact/hooks'
import { useSettings } from '../hooks/useSettings'

export function Clock() {
  const { settings } = useSettings()
  const { showClock, use24HourFormat, showSeconds, size, alignment } =
    settings.clock
  const { showDate, showDayOfWeek, showMonthAndDay, shortMonthName, showYear } =
    settings.date

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
      <div class="flex items-baseline gap-3">
        <div
          class={`${timeSize} font-bold text-white tracking-wider font-mono`}
        >
          {displayHours}:{minutes}
          {showSeconds ? `:${seconds}` : ''}
        </div>
        {!use24HourFormat && (
          <div class={`${ampmSize} font-semibold text-gray-400`}>{ampm}</div>
        )}
      </div>
      {showDate && (
        <div class={`${dateSize} text-gray-400`}>
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
    </div>
  )
}
