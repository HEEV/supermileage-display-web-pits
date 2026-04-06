'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  onClick?: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/pit');
    }
  };

  return (
    <button
    onClick={handleClick}
    className="bg-zinc-800 backdrop-blur rounded-2xl border border-slate-800 p-4 shadow-xl">
    <ArrowLeft className="w-4 h-4" />
  </button>
  )
}
