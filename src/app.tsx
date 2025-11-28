import {
  GearFineIcon,
  ArrowsOutIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react'
import { useState, useEffect } from 'preact/hooks'
import { WidgetGroup } from '@/components/widgets/WidgetGroup'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { BackgroundManager } from '@/components/BackgroundManager'
import { WelcomeModal } from '@/components/WelcomeModal'
import { useSettings } from '@/hooks/useSettings'
import { useBackgroundRotation } from '@/hooks/useBackgroundRotation'
import { useAdaptiveColors } from '@/hooks/useAdaptiveColors'
import { useWelcomeModal } from '@/hooks/useWelcomeModal'
import { useWeather } from '@/hooks/useWeather'
import { goFullScreen } from '@/util/common-utils'
import { cn } from '@/util/cn'

export function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showTouchControls, setShowTouchControls] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const { settings, setSettings } = useSettings()
  const backgroundRotation = useBackgroundRotation(settings.background)
  const { showWelcome, closeWelcome } = useWelcomeModal()
  const weatherData = useWeather(settings.weather)

  // Use the clock's alignment position for analyzing the image
  const clockPosition = settings.clock.alignment
  const adaptiveColors = useAdaptiveColors(
    backgroundRotation.currentImage,
    clockPosition
  )

  // Settings button is always in top-right, so analyze that region
  const { isDark } = useAdaptiveColors(
    backgroundRotation.currentImage,
    'top-right'
  )

  // Detect touch device on mount
  useEffect(() => {
    const hasTouchScreen =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error - msMaxTouchPoints is IE specific
      navigator.msMaxTouchPoints > 0
    setIsTouchDevice(hasTouchScreen)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    let lastSpaceTime = 0
    const DOUBLE_PRESS_DELAY = 300

    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle fullscreen with 'f' key
      if (e.key === 'f' || e.key === 'F') {
        goFullScreen(document)
      }

      // Open settings with ',' key
      if (e.key === ',') {
        if (isSettingsOpen) setIsSettingsOpen(false)
        else setIsSettingsOpen(true)
      }

      // Skip to next background with double-space
      if (e.key === ' ') {
        const currentTime = Date.now()
        if (currentTime - lastSpaceTime < DOUBLE_PRESS_DELAY) {
          e.preventDefault()
          backgroundRotation.skipToNext()
          lastSpaceTime = 0
        } else {
          lastSpaceTime = currentTime
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [backgroundRotation])

  // Handle tap to toggle touch controls
  useEffect(() => {
    if (!isTouchDevice) return

    const handleTouchEnd = (e: TouchEvent) => {
      // Ignore taps on buttons
      const target = e.target as HTMLElement
      if (target.closest('button')) return

      setShowTouchControls(prev => !prev)
    }

    document.addEventListener('touchend', handleTouchEnd)
    return () => document.removeEventListener('touchend', handleTouchEnd)
  }, [isTouchDevice])

  console.log(isHovered)

  return (
    <>
      <BackgroundManager
        settings={settings.background}
        currentImage={backgroundRotation.currentImage}
        nextImage={backgroundRotation.nextImage}
        isTransitioning={backgroundRotation.isTransitioning}
        isPreloading={backgroundRotation.isPreloading}
      />

      <div class="min-h-screen flex p-4 sm:p-8 relative">
        {/* Hover Zone - Top Right Quarter */}
        <div
          class="fixed top-0 right-0 w-1/2 h-1/2 z-40"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          class={cn(
            'fixed top-3 right-3 sm:top-4 sm:right-4 p-4 transition-all duration-300',
            'group z-50 hover:opacity-100 rounded-2xl bg-black/20 backdrop-blur-md opacity-0',
            isTouchDevice && showTouchControls && 'opacity-100',
            !isTouchDevice && isHovered && 'opacity-100'
          )}
          aria-label="Open settings"
        >
          <GearFineIcon
            size={32}
            class={cn('animate-[spin_6s_linear_infinite] ', 'text-slate-300')}
          />
        </button>

        {/* Touch Controls - Bottom Center */}
        {isTouchDevice && (
          <div
            class={cn(
              'fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 transition-all z-50',
              showTouchControls
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            )}
          >
            <div class="flex gap-3 px-4 py-3 rounded-2xl bg-black/40 backdrop-blur-md">
              <button
                onClick={() => goFullScreen(document)}
                class="p-3 rounded-xl bg-white/10 hover:bg-white/20"
                aria-label="Toggle fullscreen"
              >
                <ArrowsOutIcon size={32} class="text-emerald-300" />
              </button>
              <button
                onClick={() => backgroundRotation.skipToNext()}
                class="p-3 rounded-xl bg-white/10 hover:bg-white/20"
                aria-label="Next background"
              >
                <ArrowRightIcon size={32} class="text-sky-300" />
              </button>
            </div>
          </div>
        )}

        <WidgetGroup
          textColor={adaptiveColors.textColor}
          secondaryTextColor={adaptiveColors.secondaryTextColor}
          weather={weatherData.weather}
        />

        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSettingsChange={setSettings}
          onSkipToNext={backgroundRotation.skipToNext}
          currentImage={backgroundRotation.currentImage}
        />

        <WelcomeModal isOpen={showWelcome} onClose={closeWelcome} />
      </div>
    </>
  )
}
