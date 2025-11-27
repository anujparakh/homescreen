import type { DateSettings } from '@/types/settings'
import { Toggle } from '@/components/primitives/Toggle'
import { Select } from '@/components/primitives/Select'

type DateSettingsTabProps = {
  settings: DateSettings
  onChange: (settings: DateSettings) => void
}

export function DateSettingsTab({ settings, onChange }: DateSettingsTabProps) {
  const updateSetting = <K extends keyof DateSettings>(
    key: K,
    value: DateSettings[K]
  ) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div class="space-y-4">
      {/* Date */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Show Date</label>
        <Toggle
          checked={settings.showDate}
          onChange={checked => updateSetting('showDate', checked)}
          leftLabel="Off"
          rightLabel="On"
        />
      </div>

      {/* Day of Week */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Day of Week</label>
        <Toggle
          checked={settings.showDayOfWeek}
          onChange={checked => updateSetting('showDayOfWeek', checked)}
          leftLabel="Off"
          rightLabel="On"
        />
      </div>

      {/* Month and Day */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Month & Day</label>
        <Toggle
          checked={settings.showMonthAndDay}
          onChange={checked => updateSetting('showMonthAndDay', checked)}
          leftLabel="Off"
          rightLabel="On"
        />
      </div>

      {/* Short Month Name */}
      <div class="px-4 py-2 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
        <label class="text-gray-200 font-medium">Month Format</label>
        <Select
          value={settings.shortMonthName ? 'short' : 'long'}
          onChange={value => updateSetting('shortMonthName', value === 'short')}
          options={[
            { value: 'long', label: 'Long' },
            { value: 'short', label: 'Short' },
          ]}
          mode="pills"
        />
      </div>

      {/* Year */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Year</label>
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
