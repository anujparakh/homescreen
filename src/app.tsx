import { GearFineIcon } from '@phosphor-icons/react'
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

export function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
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

  // Handle double-tap for mobile
  useEffect(() => {
    let lastTapTime = 0
    const DOUBLE_TAP_DELAY = 300

    const handleTouchEnd = (e: TouchEvent) => {
      const currentTime = Date.now()
      if (currentTime - lastTapTime < DOUBLE_TAP_DELAY) {
        e.preventDefault()
        backgroundRotation.skipToNext()
        lastTapTime = 0
      } else {
        lastTapTime = currentTime
      }
    }

    document.addEventListener('touchend', handleTouchEnd)
    return () => document.removeEventListener('touchend', handleTouchEnd)
  }, [backgroundRotation])

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
          class={`fixed top-3 right-3 sm:top-4 sm:right-4 p-2 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          } group z-50 hover:opacity-100 md:opacity-0 opacity-70`}
          aria-label="Open settings"
        >
          <GearFineIcon
            size={24}
            class={`transition-transform duration-500 group-hover:rotate-90 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}
          />
        </button>

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
