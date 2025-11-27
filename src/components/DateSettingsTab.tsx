import type { DateSettings } from '../types/settings'
import { Toggle } from './Toggle'

type DateSettingsTabProps = {
  settings: DateSettings
  onChange: (settings: DateSettings) => void
}

export function DateSettingsTab({
  settings,
  onChange,
}: DateSettingsTabProps) {
  const updateSetting = <K extends keyof DateSettings>(
    key: K,
    value: DateSettings[K]
  ) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div class="space-y-4">
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

      {/* Show Day of Week */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Show Day of Week</label>
        <Toggle
          checked={settings.showDayOfWeek}
          onChange={checked => updateSetting('showDayOfWeek', checked)}
          leftLabel="Off"
          rightLabel="On"
        />
      </div>

      {/* Show Month and Day */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Show Month & Day</label>
        <Toggle
          checked={settings.showMonthAndDay}
          onChange={checked => updateSetting('showMonthAndDay', checked)}
          leftLabel="Off"
          rightLabel="On"
        />
      </div>

      {/* Short Month Name */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Month Format</label>
        <Toggle
          checked={settings.shortMonthName}
          onChange={checked => updateSetting('shortMonthName', checked)}
          leftLabel="Long"
          rightLabel="Short"
        />
      </div>

      {/* Show Year */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Show Year</label>
        <Toggle
          checked={settings.showYear}
          onChange={checked => updateSetting('showYear', checked)}
          leftLabel="Off"
          rightLabel="On"
        />
      </div>
    </div>
  )
}
