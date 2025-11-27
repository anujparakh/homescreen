type SelectOption<T extends string> = {
  value: T
  label: string
}

type SelectProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: SelectOption<T>[]
  mode?: 'pills' | 'dropdown'
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  mode = 'pills',
}: SelectProps<T>) {
  if (mode === 'pills') {
    return (
      <div class="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            class={`px-4 py-2 rounded-xl font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
              value === option.value
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    )
  }

  return (
    <select
      value={value}
      onChange={e => onChange(e.currentTarget.value as T)}
      class="bg-slate-700 text-white border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
