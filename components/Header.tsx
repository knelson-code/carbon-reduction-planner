"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <header className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/newday-logo.svg" 
              alt="New Day Climate" 
              width={48} 
              height={48}
              className="w-12 h-12"
            />
            <span className="text-xl font-semibold text-gray-900 hidden sm:block">
              CO₂ Reduction Planner
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/organizations" 
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Organizations
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {session.user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 font-semibold transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 font-bold transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
