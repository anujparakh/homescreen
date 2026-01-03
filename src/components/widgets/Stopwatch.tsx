import { useState, useEffect } from 'preact/hooks'
import { cn } from '@/util/cn'
import {
  PlayIcon,
  PauseIcon,
  ArrowCounterClockwiseIcon,
} from '@phosphor-icons/react'

interface StopwatchProps {
  textColor: string
  size: 'small' | 'medium' | 'large'
}

export function Stopwatch({ textColor, size }: StopwatchProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0) // in milliseconds
  const [startTime, setStartTime] = useState(0)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime)
    }, 10)

    return () => clearInterval(interval)
  }, [isRunning, startTime])

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false)
    } else {
      setStartTime(Date.now() - elapsedTime)
      setIsRunning(true)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setElapsedTime(0)
    setStartTime(0)
  }

  // Handle keyboard shortcuts (space to start/pause, r to reset)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        handleStartStop()
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        handleReset()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isRunning, elapsedTime])

  // Format time
  const totalSeconds = Math.floor(elapsedTime / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const milliseconds = Math.floor((elapsedTime % 1000) / 10)

  const timeSize =
    size === 'large'
      ? 'text-6xl sm:text-8xl md:text-9xl'
      : size === 'medium'
        ? 'text-5xl sm:text-7xl md:text-8xl'
        : 'text-4xl sm:text-5xl md:text-6xl'
  const buttonSize =
    size === 'large'
      ? 'text-lg sm:text-xl'
      : size === 'medium'
        ? 'text-base sm:text-lg'
        : 'text-sm sm:text-base'

  return (
    <div>
      {/* Time Display */}
      <div
        class={cn(timeSize, 'font-bold tracking-wider font-mono', textColor)}
      >
        {hours > 0 && `${hours.toString().padStart(2, '0')}:`}
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}.
        <span class="text-opacity-70">
          {milliseconds.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Control Buttons */}
      <div class="flex gap-2 sm:gap-3 mt-4">
        <button
          onClick={handleStartStop}
          class={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors',
            buttonSize,
            isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          )}
        >
          {isRunning ? (
            <>
              <PauseIcon size={20} weight="fill" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <PlayIcon size={20} weight="fill" />
              <span>Start</span>
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          class={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors bg-gray-600 hover:bg-gray-700 text-white',
            buttonSize
          )}
        >
          <ArrowCounterClockwiseIcon size={20} weight="bold" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}
