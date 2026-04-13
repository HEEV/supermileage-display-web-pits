'use client'
import { Trash2 } from "lucide-react"
import { Channel } from '@/types/carConfigTypes'

interface Props {
  channel: Channel
  index: number
  onUpdate: (index: number, field: keyof Channel, value: string) => void
  onDelete: (index: number) => void
}

const labelMap: Record<string, string> = {
  name: 'Name',
  unit: 'Unit',
  conversionFactor: 'Conversion Factor',
  inputType: 'Input Type',
  min: 'Min Limit',
  max: 'Max Limit'
};

const fields: (keyof Channel)[] = [
  'name',
  'unit',
  'conversionFactor',
  'inputType',
  'min',
  'max'
];

export default function ChannelCard({
  channel,
  index,
  onUpdate,
  onDelete
}: Props) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 relative">
      <div className="flex justify-between mb-3">
        <h4 className="text-xs font-bold text-cyan-400">
          CHANNEL {index + 1}
        </h4>
        <button onClick={() => onDelete(index)}>
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field as string}>
            <label className="text-xs text-zinc-400 mb-1 block">
              {labelMap[field as string]}
            </label>

            {field === 'inputType' ? (
              <select
                value={channel[field]}
                onChange={(e) => onUpdate(index, field, e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-white w-full p-2 rounded"
              >
                <option value="analog">analog</option>
                <option value="digital">digital</option>
              </select>
            ) : (
              <input
                value={channel[field]}
                onChange={(e) => onUpdate(index, field, e.target.value)}
                className="bg-zinc-800 border border-zinc-700 text-white w-full p-2 rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}