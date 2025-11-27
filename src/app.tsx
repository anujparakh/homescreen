import { GearFineIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'preact/hooks'
import { Clock } from './components/Clock'
import { SettingsPanel } from './components/SettingsPanel'
import { useSettings } from './hooks/useSettings'

export function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { settings, setSettings } = useSettings()

  // Handle fullscreen toggle with 'f' key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
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
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div class="min-h-screen bg-gray-900 flex p-8 relative">
      {/* Hover Zone - Top Right Quarter */}
      <div
        class="fixed top-0 right-0 w-1/2 h-1/2 z-40"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        class={`fixed top-4 right-4 p-2 text-gray-400 hover:text-white transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } group z-50 hover:opacity-100`}
        aria-label="Open settings"
      >
        <GearFineIcon
          size={24}
          class="transition-transform duration-500 group-hover:rotate-90"
        />
      </button>

      <Clock />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  )
}
