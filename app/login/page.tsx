'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (username && password) {
      router.push('/pit')
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-xl w-96 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Pit Crew Login
        </h2>
        <div className="space-y-5">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 text-sm text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Public Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}