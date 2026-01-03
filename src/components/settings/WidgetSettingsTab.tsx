import type { WidgetSettings } from '@/types/settings'
import { Toggle } from '@/components/primitives/Toggle'
import { Select } from '@/components/primitives/Select'

type WidgetSettingsTabProps = {
  settings: WidgetSettings
  onChange: (settings: WidgetSettings) => void
}

export function WidgetSettingsTab({
  settings,
  onChange,
}: WidgetSettingsTabProps) {
  const updateSetting = <K extends keyof WidgetSettings>(
    key: K,
    value: WidgetSettings[K]
  ) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div class="space-y-4">
      {/* Widget Type */}
      <div class="space-y-2 py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Type</label>
        <Select
          value={settings.type}
          onChange={value => updateSetting('type', value)}
          options={[
            { value: 'clock', label: 'Clock' },
            { value: 'stopwatch', label: 'Stopwatch' },
            { value: 'none', label: 'None' },
          ]}
          mode="pills"
        />
      </div>

      {/* Size */}
      <div class="px-4 py-2 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-between">
        <label class="text-gray-200 font-medium">Size</label>
        <Select
          value={settings.size}
          onChange={value => updateSetting('size', value)}
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
          ]}
          mode="pills"
        />
      </div>

      {/* Alignment */}
      <div class="space-y-2 py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Alignment</label>
        <Select
          value={settings.alignment}
          onChange={value => updateSetting('alignment', value)}
          options={[
            { value: 'top-left', label: 'Top Left' },
            { value: 'top-right', label: 'Top Right' },
            { value: 'center', label: 'Center' },
            { value: 'bottom-left', label: 'Bottom Left' },
            { value: 'bottom-right', label: 'Bottom Right' },
          ]}
          mode="pills"
        />
      </div>

      {/* Background Blur */}
      <div class="flex items-center justify-between py-3 px-4 bg-slate-900 rounded-lg border border-slate-700">
        <label class="text-gray-200 font-medium">Background Blur</label>
        <Toggle
          checked={settings.backgroundBlur}
          onChange={checked => updateSetting('backgroundBlur', checked)}
          leftLabel="Off"
          rightLabel="On"
        />
      </div>
    </div>
  )
}
