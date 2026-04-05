'use client'
interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'input' | 'select' | 'number'
  options?: { label: string; value: string }[]
}

export default function FormField({
  label,
  value,
  onChange,
  type = 'input',
  options = []
}: Props) {
  return (
    <div>
      <label className="text-xs text-zinc-400 mb-1 block">
        {label}
      </label>

      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white w-full p-2 rounded"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white w-full p-2 rounded"
        />
      )}
    </div>
  )
}