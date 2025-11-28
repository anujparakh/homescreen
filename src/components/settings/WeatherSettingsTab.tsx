import type { WeatherSettings } from '@/types/settings'
import { Toggle } from '@/components/primitives/Toggle'
import { Select } from '@/components/primitives/Select'

type WeatherSettingsTabProps = {
  settings: WeatherSettings
  onChange: (settings: WeatherSettings) => void
}

export function WeatherSettingsTab({
  settings,
  onChange,
}: WeatherSettingsTabProps) {
  const updateSetting = <K extends keyof WeatherSettings>(
    key: K,
    value: WeatherSettings[K]
  ) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div class="space-y-4">
      {/* Show Weather */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Show Weather</label>
        <Toggle
          checked={settings.showWeather}
          onChange={checked => updateSetting('showWeather', checked)}
          leftLabel="Off"
          rightLabel="On"
        />
      </div>

      {/* Location Mode */}
      <div class="px-4 py-2 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
        <label class="text-gray-200 font-medium">Location</label>
        <Select
          value={settings.locationMode}
          onChange={value => updateSetting('locationMode', value)}
          options={[
            { value: 'auto', label: 'Auto' },
            { value: 'manual', label: 'Manual' },
          ]}
          mode="pills"
        />
      </div>

      {/* Manual Location Input */}
      {settings.locationMode === 'manual' && (
        <div class="py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
          <label class="text-gray-200 font-medium block mb-2">City Name</label>
          <input
            type="text"
            value={settings.manualLocation}
            onChange={e =>
              updateSetting(
                'manualLocation',
                (e.target as HTMLInputElement).value
              )
            }
            placeholder="e.g., Austin, TX"
            class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Refresh Interval */}
      <div class="space-y-2 py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Refresh Interval</label>
        <Select
          value={settings.refreshInterval.toString()}
          onChange={value => updateSetting('refreshInterval', parseInt(value))}
          options={[
            { value: '300000', label: '5 m' },
            { value: '600000', label: '10 m' },
            { value: '1800000', label: '30 m' },
            { value: '3600000', label: '60 m' },
          ]}
          mode="pills"
        />
      </div>

      {/* Display Options Section */}
      <div class="py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <h3 class="text-gray-200 font-medium mb-3">Display Options</h3>
        <div class="space-y-3">
          {/* Temperature Unit */}
          <div class="flex items-center justify-between">
            <label class="text-gray-300 text-sm">Temperature Unit</label>
            <Toggle
              checked={settings.unit === 'celsius'}
              onChange={checked =>
                updateSetting('unit', checked ? 'celsius' : 'fahrenheit')
              }
              leftLabel="°F"
              rightLabel="°C"
            />
          </div>

          {/* Show Temperature */}
          <div class="flex items-center justify-between">
            <label class="text-gray-300 text-sm">Show Temperature</label>
            <Toggle
              checked={settings.showTemperature}
              onChange={checked => updateSetting('showTemperature', checked)}
              leftLabel="Off"
              rightLabel="On"
            />
          </div>

          {/* Show Condition */}
          <div class="flex items-center justify-between">
            <label class="text-gray-300 text-sm">Show Condition</label>
            <Toggle
              checked={settings.showCondition}
              onChange={checked => updateSetting('showCondition', checked)}
              leftLabel="Off"
              rightLabel="On"
            />
          </div>

          {/* Show High/Low */}
          <div class="flex items-center justify-between">
            <label class="text-gray-300 text-sm">Show High/Low</label>
            <Toggle
              checked={settings.showHighLow}
              onChange={checked => updateSetting('showHighLow', checked)}
              leftLabel="Off"
              rightLabel="On"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
