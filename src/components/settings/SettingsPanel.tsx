import { BackgroundSettingsTab } from '@/components/settings/BackgroundSettingsTab'
import { ClockSettingsTab } from '@/components/settings/ClockSettingsTab'
import { DateSettingsTab } from '@/components/settings/DateSettingsTab'
import { WeatherSettingsTab } from '@/components/settings/WeatherSettingsTab'
import { WidgetSettingsTab } from '@/components/settings/WidgetSettingsTab'
import type { ImageData } from '@/types/background'
import type { Settings } from '@/types/settings'
import { cn } from '@/util/cn'
import { Icon, LegoIcon } from '@phosphor-icons/react'
import { CalendarIcon } from '@phosphor-icons/react/dist/icons/Calendar'
import { ClockIcon } from '@phosphor-icons/react/dist/icons/Clock'
import { CloudIcon } from '@phosphor-icons/react/dist/icons/Cloud'
import { ImageIcon } from '@phosphor-icons/react/dist/icons/Image'
import { XIcon } from '@phosphor-icons/react/dist/icons/X'
import { useEffect, useRef, useState } from 'preact/hooks'

type SettingsPanelProps = {
  isOpen: boolean
  onClose: () => void
  settings: Settings
  onSettingsChange: (settings: Settings) => void
  onSkipToNext?: () => void
  currentImage?: ImageData | null
}

type TabId = 'clock' | 'date' | 'background' | 'weather' | 'widget'

type Tab = {
  id: TabId
  label: string
  icon: Icon
}

const tabs: Tab[] = [
  { id: 'background', label: 'Background', icon: ImageIcon },
  { id: 'widget', label: 'Widget', icon: LegoIcon },
  { id: 'clock', label: 'Clock', icon: ClockIcon },
  { id: 'date', label: 'Date', icon: CalendarIcon },
  { id: 'weather', label: 'Weather', icon: CloudIcon },
]

export function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onSkipToNext,
  currentImage,
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('background')
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
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={panelRef}
        class="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl min-h-[60vh] max-h-[90vh] md:max-h-[80vh] flex flex-col border border-slate-700"
      >
        {/* Header */}
        <div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700">
          <div className="flex flex-row w-auto items-center gap-2 sm:gap-4">
            <img
              src="/favicon.svg"
              className="ml-0 aspect-square h-8 sm:h-10 rounded-lg"
            />

            <h2 class="text-lg sm:text-xl font-semibold text-white">
              The Homescreen
            </h2>
          </div>
          <button
            onClick={onClose}
            class="p-1.5 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <XIcon size={20} weight="bold" />
          </button>
        </div>

        <div class="flex flex-1 overflow-hidden rounded-b-xl">
          {/* Tabs Sidebar */}
          <div class="w-16 sm:w-48 bg-slate-900 border-r border-slate-700">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  class={cn(
                    'w-full flex items-center justify-center sm:justify-start gap-3 px-2 sm:px-4 py-3 transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white border-r-2 border-indigo-400'
                      : 'text-gray-400 hover:bg-slate-800 hover:text-gray-300'
                  )}
                >
                  <Icon
                    size={20}
                    weight={activeTab === tab.id ? 'fill' : 'regular'}
                  />
                  <span class="text-sm font-medium hidden sm:inline">
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div class="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-800 rounded-b-xl">
            {activeTab === 'widget' && (
              <WidgetSettingsTab
                settings={settings.widget}
                onChange={widgetSettings =>
                  onSettingsChange({ ...settings, widget: widgetSettings })
                }
              />
            )}
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
            {activeTab === 'background' && (
              <BackgroundSettingsTab
                settings={settings.background}
                onChange={backgroundSettings =>
                  onSettingsChange({
                    ...settings,
                    background: backgroundSettings,
                  })
                }
                {...(onSkipToNext ? { onSkipToNext } : {})}
                currentImage={currentImage}
              />
            )}
            {activeTab === 'weather' && (
              <WeatherSettingsTab
                settings={settings.weather}
                onChange={weatherSettings =>
                  onSettingsChange({ ...settings, weather: weatherSettings })
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
