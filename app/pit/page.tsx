'use client'

import { useRouter } from 'next/navigation'
import { Activity, Settings } from 'lucide-react'
import { useState } from 'react'

export default function PitCrewMenu() {
  const router = useRouter()
  const [selectedCar, setSelectedCar] = useState("")

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black rounded-2xl border border-zinc-800 p-8 shadow-xl">
        
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-600/20 p-4 rounded-xl">
              <Activity className="text-red-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold">
              Cars and Race Status
            </h2>
          </div>
          <label className="text-sm text-zinc-400 mb-2 block">
            Select Car
          </label>
          <select
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="w-full mb-4 bg-black border border-zinc-700 text-white p-2 rounded"
          >
            <option value="karch">Karcharius</option>
            <option value="sting">Sting</option>
          </select>
          <button
            disabled={!selectedCar}
            onClick={() => router.push(`/dashboard?car=${selectedCar}`)}
            className="w-full bg-red-600 hover:bg-red-600/90 disabled:opacity-50 py-3 rounded-lg font-semibold"
          >
            View Status Dashboard
          </button>
        </div>
        <div className="bg-black backdrop-blur rounded-2xl border border-zinc-800 p-8 shadow-xl">
          
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-600/20 p-4 rounded-xl">
              <Settings className="text-blue-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold">
              Car Configurations
            </h2>
          </div>
          <label className="text-sm text-zinc-400 mb-2 block">
            Select Car
          </label>
          <select
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="w-full mb-4 bg-black border border-zinc-700 text-white p-2 rounded"
          >
            <option value="karch">Karcharius</option>
            <option value="sting">Sting</option>
          </select>
          <button
            disabled={!selectedCar}
            onClick={() => router.push(`/config?car=${selectedCar}`)}
            className="w-full bg-blue-600 hover:bg-blue-600/90 disabled:opacity-50 py-3 rounded-lg font-semibold"
          >
            Edit Configuration
          </button>
        </div>
      </div>
    </div>
  )
}