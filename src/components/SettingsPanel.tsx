import { useState, useEffect, useRef } from 'preact/hooks'
import { X } from '@phosphor-icons/react/dist/icons/X'
import { Clock } from '@phosphor-icons/react/dist/icons/Clock'
import { Calendar } from '@phosphor-icons/react/dist/icons/Calendar'
import { Palette } from '@phosphor-icons/react/dist/icons/Palette'
import type { Settings } from '../types/settings'
import { ClockSettingsTab } from './ClockSettingsTab'
import { DateSettingsTab } from './DateSettingsTab'

type SettingsPanelProps = {
  isOpen: boolean
  onClose: () => void
  settings: Settings
  onSettingsChange: (settings: Settings) => void
}

type TabId = 'clock' | 'date' | 'appearance'

type Tab = {
  id: TabId
  label: string
  icon: typeof Clock
}

const tabs: Tab[] = [
  { id: 'clock', label: 'Clock', icon: Clock },
  { id: 'date', label: 'Date', icon: Calendar },
  { id: 'appearance', label: 'Appearance', icon: Palette },
]

export function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('clock')
  const panelRef = useRef<HTMLDivElement>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Handle click outside
  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={panelRef}
        class="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl min-h-[60vh] max-h-[80vh] flex flex-col border border-slate-700"
      >
        {/* Header */}
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 class="text-xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            class="p-1.5 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <div class="flex flex-1 overflow-hidden">
          {/* Tabs Sidebar */}
          <div class="w-48 bg-slate-900 border-r border-slate-700">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  class={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white border-r-2 border-indigo-400'
                      : 'text-gray-400 hover:bg-slate-800 hover:text-gray-300'
                  }`}
                >
                  <Icon
                    size={20}
                    weight={activeTab === tab.id ? 'fill' : 'regular'}
                  />
                  <span class="text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div class="flex-1 p-6 overflow-y-auto bg-slate-800">
            {activeTab === 'clock' && (
              <ClockSettingsTab
                settings={settings.clock}
                onChange={clockSettings =>
                  onSettingsChange({ ...settings, clock: clockSettings })
                }
              />
            )}
            {activeTab === 'date' && (
              <DateSettingsTab
                settings={settings.date}
                onChange={dateSettings =>
                  onSettingsChange({ ...settings, date: dateSettings })
                }
              />
            )}
            {activeTab === 'appearance' && (
              <div class="flex flex-col items-center justify-center h-full text-center">
                <Palette
                  size={48}
                  class="text-gray-600 mb-4"
                  weight="duotone"
                />
                <h3 class="text-lg font-medium text-gray-400 mb-2">
                  Appearance Settings
                </h3>
                <p class="text-sm text-gray-500">
                  Customize the look and feel of your homescreen
                </p>
                <p class="text-xs text-gray-600 mt-4">Coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
