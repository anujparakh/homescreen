import type { BackgroundSettings } from '@/types/settings'
import type { ImageData } from '@/types/background'
import { Toggle } from '@/components/primitives/Toggle'
import { Select } from '@/components/primitives/Select'

type BackgroundSettingsTabProps = {
  settings: BackgroundSettings
  onChange: (settings: BackgroundSettings) => void
  onSkipToNext?: () => void
  currentImage?: ImageData | null
}

export function BackgroundSettingsTab({
  settings,
  onChange,
  onSkipToNext,
  currentImage,
}: BackgroundSettingsTabProps) {
  const updateSetting = <K extends keyof BackgroundSettings>(
    key: K,
    value: BackgroundSettings[K]
  ) => {
    onChange({ ...settings, [key]: value })
  }

  const formatInterval = (ms: number): string => {
    const minutes = ms / 60000
    if (minutes < 60) return `${minutes}m`
    const hours = minutes / 60
    return `${hours}h`
  }

  return (
    <div class="space-y-4">
      {/* Enable Background */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Background Image</label>
        <Toggle
          checked={settings.enabled}
          onChange={checked => updateSetting('enabled', checked)}
          leftLabel="Off"
          rightLabel="On"
        />
      </div>

      {settings.enabled && (
        <>
          {/* Image Source */}
          <div class="px-4 py-2 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
            <label class="text-gray-200 font-medium">Image Source</label>
            <Select
              value={settings.source}
              onChange={value => updateSetting('source', value)}
              options={[
                { value: 'chromecast', label: 'Chromecast' },
                { value: 'sourced', label: 'Local' },
              ]}
              mode="pills"
            />
          </div>

          {/* Rotation Interval */}
          <div class="space-y-2 py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
            <label class="text-gray-200 font-medium">Rotation Interval</label>
            <Select
              value={settings.rotationInterval.toString()}
              onChange={value =>
                updateSetting('rotationInterval', parseInt(value))
              }
              options={[
                { value: '900000', label: formatInterval(900000) },
                { value: '1800000', label: formatInterval(1800000) },
                { value: '3600000', label: formatInterval(3600000) },
                { value: '7200000', label: formatInterval(7200000) },
                { value: '14400000', label: formatInterval(14400000) },
              ]}
              mode="pills"
            />
          </div>

          {/* Show Attribution */}
          <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
            <label class="text-gray-200 font-medium">Show Attribution</label>
            <Toggle
              checked={settings.showAttribution}
              onChange={checked => updateSetting('showAttribution', checked)}
              leftLabel="Off"
              rightLabel="On"
            />
          </div>

          {/* Action Buttons */}
          {settings.enabled && (
            <div class="space-y-3">
              {onSkipToNext && (
                <button
                  type="button"
                  onClick={onSkipToNext}
                  class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  Skip to Next Background
                </button>
              )}
              {currentImage && (
                <button
                  type="button"
                  onClick={() => window.open(currentImage.url, '_blank')}
                  class="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  Open Image
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
