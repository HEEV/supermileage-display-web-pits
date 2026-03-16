'use client'

import { usePathname, useRouter } from "next/navigation"
import { LogIn, LogOut } from "lucide-react"

export default function HeaderButtons() {
  const pathname = usePathname()
  const router = useRouter()

  const isPublic = pathname === "/"

  if (pathname === "/login") return null

  return (
    <>
      {/* Public landing page */}
      {isPublic && (
        <button
          onClick={() => router.push("/login")}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <LogIn className="w-4 h-4 mr-2"/>
          Login as Pit Crew
        </button>
      )}

      {/* Login page OR private pages */}
      {(!isPublic) && (
        <button
          onClick={() => router.push("/")}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4 mr-2"/>
          Logout
        </button>
      )}
    </>
  )
}