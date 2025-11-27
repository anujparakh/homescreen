type ToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  leftLabel?: string
  rightLabel?: string
}

export function Toggle({
  checked,
  onChange,
  leftLabel,
  rightLabel,
}: ToggleProps) {
  return (
    <div class="flex items-center gap-3">
      {leftLabel && (
        <span
          class={`text-sm font-medium transition-colors ${
            !checked ? 'text-white' : 'text-gray-500'
          }`}
        >
          {leftLabel}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
          checked ? 'bg-indigo-600' : 'bg-gray-600'
        }`}
      >
        <span
          class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {rightLabel && (
        <span
          class={`text-sm font-medium transition-colors ${
            checked ? 'text-white' : 'text-gray-500'
          }`}
        >
          {rightLabel}
        </span>
      )}
    </div>
  )
}
