import { useState } from 'preact/hooks'
import { Gear } from '@phosphor-icons/react/dist/icons/Gear'
import { Clock } from './components/Clock'
import { SettingsPanel } from './components/SettingsPanel'
import { useSettings } from './hooks/useSettings'

export function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { settings, setSettings } = useSettings()

  return (
    <div
      class="min-h-screen bg-gray-900 flex p-8 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        class={`fixed top-4 right-4 p-2 text-gray-400 hover:text-white transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Open settings"
      >
        <Gear size={24} />
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
