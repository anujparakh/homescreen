import { GearFineIcon } from '@phosphor-icons/react'
import { useState, useEffect, useRef } from 'preact/hooks'
import { WidgetGroup } from '@/components/widgets/WidgetGroup'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { BackgroundManager } from '@/components/BackgroundManager'
import { WelcomeModal } from '@/components/WelcomeModal'
import { TouchControls } from '@/components/TouchControls'
import { useSettings } from '@/hooks/useSettings'
import { useBackgroundRotation } from '@/hooks/useBackgroundRotation'
import { useAdaptiveColors } from '@/hooks/useAdaptiveColors'
import { useWelcomeModal } from '@/hooks/useWelcomeModal'
import { useWeather } from '@/hooks/useWeather'
import { cn } from '@/util/cn'
import { goFullScreen, DOUBLE_TAP_DELAY } from '@/util/common-utils'

export function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showTouchControls, setShowTouchControls] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const lastTapTimeRef = useRef(0)
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

      // Check for double tap
      const currentTime = Date.now()
      if (currentTime - lastTapTimeRef.current < DOUBLE_TAP_DELAY) {
        // Double tap - skip to next background
        e.preventDefault()
        backgroundRotation.skipToNext()
        lastTapTimeRef.current = 0
      } else {
        // Single tap - toggle controls
        lastTapTimeRef.current = currentTime
      }
      setShowTouchControls(prev => !prev)
    }

    document.addEventListener('touchend', handleTouchEnd)
    return () => document.removeEventListener('touchend', handleTouchEnd)
  }, [isTouchDevice, backgroundRotation])

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
          <TouchControls
            isVisible={showTouchControls}
            onSkipToNext={backgroundRotation.skipToNext}
          />
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

        <WelcomeModal
          isOpen={showWelcome}
          onClose={closeWelcome}
          isTouchDevice={isTouchDevice}
        />
      </div>
    </>
  )
}
