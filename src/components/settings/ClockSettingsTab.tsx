import type { ClockSettings } from '@/types/settings'
import { Toggle } from '@/components/primitives/Toggle'

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
        <label class="text-gray-200 font-medium">Time Format</label>
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
    </div>
  )
}
