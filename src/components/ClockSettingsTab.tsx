import type { ClockSettings } from '../types/settings'
import { Toggle } from './Toggle'

type ClockSettingsTabProps = {
  settings: ClockSettings
  onChange: (settings: ClockSettings) => void
}

export function ClockSettingsTab({
  settings,
  onChange,
}: ClockSettingsTabProps) {
  const updateSetting = <K extends keyof ClockSettings>(
    key: K,
    value: ClockSettings[K]
  ) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div class="space-y-4">
      {/* Show Clock */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Show Clock</label>
        <Toggle
          checked={settings.showClock}
          onChange={checked => updateSetting('showClock', checked)}
          leftLabel="Off"
          rightLabel="On"
        />
      </div>

      {/* 24 Hour Format */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">24-Hour Format</label>
        <Toggle
          checked={settings.use24HourFormat}
          onChange={checked => updateSetting('use24HourFormat', checked)}
          leftLabel="12h"
          rightLabel="24h"
        />
      </div>

      {/* Show Seconds */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Show Seconds</label>
        <Toggle
          checked={settings.showSeconds}
          onChange={checked => updateSetting('showSeconds', checked)}
          leftLabel="Off"
          rightLabel="On"
        />
      </div>

      {/* Show Date */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Show Date</label>
        <Toggle
          checked={settings.showDate}
          onChange={checked => updateSetting('showDate', checked)}
          leftLabel="Off"
          rightLabel="On"
        />
      </div>

      {/* Size */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Clock Size</label>
        <Toggle
          checked={settings.size === 'large'}
          onChange={checked =>
            updateSetting('size', checked ? 'large' : 'small')
          }
          leftLabel="Small"
          rightLabel="Large"
        />
      </div>

      {/* Alignment */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Alignment</label>
        <select
          value={settings.alignment}
          onChange={e =>
            updateSetting(
              'alignment',
              e.currentTarget.value as ClockSettings['alignment']
            )
          }
          class="bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          <option value="top-left">Top Left</option>
          <option value="top-right">Top Right</option>
          <option value="center">Center</option>
          <option value="bottom-left">Bottom Left</option>
          <option value="bottom-right">Bottom Right</option>
        </select>
      </div>
    </div>
  )
}
