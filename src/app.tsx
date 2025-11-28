import { GearFineIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'preact/hooks'
import { Clock } from '@/components/widgets/Clock'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { BackgroundManager } from '@/components/BackgroundManager'
import { useSettings } from '@/hooks/useSettings'
import { useBackgroundRotation } from '@/hooks/useBackgroundRotation'
import { useAdaptiveColors } from '@/hooks/useAdaptiveColors'

export function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { settings, setSettings } = useSettings()
  const backgroundRotation = useBackgroundRotation(settings.background)

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
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err)
          })
        } else {
          document.exitFullscreen().catch(err => {
            console.error('Error attempting to exit fullscreen:', err)
          })
        }
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

  return (
    <>
      <BackgroundManager
        settings={settings.background}
        currentImage={backgroundRotation.currentImage}
        nextImage={backgroundRotation.nextImage}
        isTransitioning={backgroundRotation.isTransitioning}
      />

      <div class="min-h-screen flex p-8 relative">
        {/* Hover Zone - Top Right Quarter */}
        <div
          class="fixed top-0 right-0 w-1/2 h-1/2 z-40"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          class={`fixed top-4 right-4 p-2 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          } group z-50 hover:opacity-100`}
          aria-label="Open settings"
        >
          <GearFineIcon
            size={24}
            class={`transition-transform duration-500 group-hover:rotate-90 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}
          />
        </button>

        <Clock
          textColor={adaptiveColors.textColor}
          secondaryTextColor={adaptiveColors.secondaryTextColor}
        />

        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSettingsChange={setSettings}
          onSkipToNext={backgroundRotation.skipToNext}
        />
      </div>
    </>
  )
}
