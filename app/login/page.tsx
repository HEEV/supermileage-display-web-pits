'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { extractAuthToken, setAuthToken } from '@/lib/auth'

const AUTH_LOGIN_URL = '/api/auth/login'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!username || !password) {
      setError('Enter both username and password.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(AUTH_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const rawBody = await response.text()
      let parsedBody: unknown = rawBody

      try {
        parsedBody = JSON.parse(rawBody)
      } catch {
        // fall back to the raw response body
      }

      if (!response.ok) {
        const message =
          typeof parsedBody === 'object' && parsedBody !== null && 'message' in parsedBody
            ? String((parsedBody as { message?: unknown }).message ?? '')
            : ''
        throw new Error(message || 'Login failed. Check your credentials and try again.')
      }

      const token = extractAuthToken(parsedBody)
      if (!token) {
        throw new Error('Login succeeded, but no JWT was returned.')
      }

      setAuthToken(token)
      router.push('/pit')
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-4 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 shadow-2xl backdrop-blur"
      >
        <h2 className="mb-2 text-center text-2xl font-bold text-white">
          Pit Crew Login
        </h2>
        <div className="space-y-5">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
        {error ? (
          <p className="mt-4 rounded border border-red-900/60 bg-red-950/50 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}
        <div className="mt-8 space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-blue-600 py-2 font-semibold transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex w-full items-center justify-center gap-2 rounded border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Public Dashboard
          </button>
        </div>
      </form>
    </div>
  )
}