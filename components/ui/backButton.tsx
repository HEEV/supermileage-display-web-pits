'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
    onClick={() => router.push('/')}
    className="bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-800 p-4 shadow-xl">
    <ArrowLeft className="w-4 h-4" />
  </button>
  )
}