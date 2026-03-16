'use client'

import { useRouter } from 'next/navigation'
import { Activity, Settings } from 'lucide-react'

export default function PitCrewMenu() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white px-8 py-12">
      {/* Card Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dashboard Card */}
        <div className="bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-800 p-8 shadow-xl">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-red-600/20 p-4 rounded-xl">
              <Activity className="text-red-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold">
              Cars and Race Status
            </h2>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-red-600 hover:bg-red-700 transition-colors py-3 rounded-lg font-semibold"
          >
            View Status Dashboard
          </button>
        </div>

        {/* Config Card */}
        <div className="bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-800 p-8 shadow-xl">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-600/20 p-4 rounded-xl">
              <Settings className="text-blue-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold">
              Car Configurations
            </h2>
          </div>

          <button
            onClick={() => router.push('/config')}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-3 rounded-lg font-semibold"
          >
            Edit Configuration
          </button>
        </div>

      </div>
    </div>
  )
}
