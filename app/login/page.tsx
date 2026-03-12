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
      // Fake authentication for now
      router.push('/pit')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 text-white">
      <div className="bg-slate-900 p-10 rounded-2xl w-96 border border-slate-800 shadow-xl">

        <h2 className="text-3xl font-bold text-center mb-10">
        Pit Crew Login
        </h2>
        <div className="space-y-6">
        
        <div className="space-y-2">
            <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
        </div>

        <div className="space-y-2">
            <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
        </div>

        </div>
        <button
        onClick={handleLogin}
        className="w-full mt-10 bg-red-600 hover:bg-red-700 py-3 rounded-md font-semibold transition-colors"
        >
        Login
        </button>
        <button
        onClick={() => router.push("/")}
        className="w-full mt-8 px-4 py-3 rounded-md bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 font-medium text-slate-300 hover:text-white"
        >
        <ArrowLeft className="w-4 h-4" />
        Return to Public Dashboard
        </button>

        </div>
    </div>
  )
}