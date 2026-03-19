import type { BackgroundSettings } from '@/types/settings'
import type { ImageData } from '@/types/background'
import { getGradientCSS } from '@/util/gradient'
import { hexToHue, hueToHex } from '@/util/colorUtils'
import { Toggle } from '@/components/primitives/Toggle'
import { Select } from '@/components/primitives/Select'

const HUE_TRACK =
  'linear-gradient(to right,' +
  [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360]
    .map(h => `hsl(${h},70%,40%)`)
    .join(',') +
  ')'

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
                { value: 'apple', label: 'Apple' },
                { value: 'solid-color', label: 'Color' },
                { value: 'uw', label: 'UW' },
              ]}
              mode="pills"
            />
          </div>

          {settings.source === 'solid-color' && (
            <div class="space-y-4 py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
              {/* Gradient type */}
              <div class="space-y-2">
                <label class="text-gray-200 font-medium block">Style</label>
                <Select
                  value={settings.solidColor.gradientType}
                  onChange={value =>
                    updateSetting('solidColor', {
                      ...settings.solidColor,
                      gradientType: value,
                    })
                  }
                  options={[
                    { value: 'linear-diagonal', label: 'Diagonal' },
                    { value: 'linear-vertical', label: 'Vertical' },
                    { value: 'linear-horizontal', label: 'Horizontal' },
                    { value: 'radial', label: 'Radial' },
                  ]}
                  mode="pills"
                />
              </div>

              {/* Hue sliders */}
              {(['A', 'B'] as const).map(key => {
                const colorKey = `color${key}` as 'colorA' | 'colorB'
                const hex = settings.solidColor[colorKey]
                return (
                  <div key={key} class="space-y-2">
                    <div class="flex items-center justify-between">
                      <label class="text-gray-400 text-sm">Color {key}</label>
                      <div
                        class="w-6 h-6 rounded border border-slate-500"
                        style={{ backgroundColor: hex }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="359"
                      value={hexToHue(hex)}
                      class="hue-slider w-full"
                      style={{ background: HUE_TRACK }}
                      onInput={e =>
                        updateSetting('solidColor', {
                          ...settings.solidColor,
                          [colorKey]: hueToHex(parseInt(e.currentTarget.value)),
                        })
                      }
                    />
                  </div>
                )
              })}

              {/* Live preview */}
              <div
                class="h-14 rounded-lg border border-slate-600"
                style={{ background: getGradientCSS(settings.solidColor) }}
              />
            </div>
          )}

          {settings.source !== 'solid-color' && settings.source !== 'uw' && (
            <>
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

              {/* Enable Animation */}
              <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
                <label class="text-gray-200 font-medium">Animation</label>
                <Toggle
                  checked={settings.enableAnimation}
                  onChange={checked => updateSetting('enableAnimation', checked)}
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
        </>
      )}
    </div>
  )
}
