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
    <header className="border-b" style={{ backgroundColor: '#f0f0f0', borderColor: '#d4dfe0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo_ND_normal.svg" 
              alt="New Day Climate" 
              width={48} 
              height={48}
              className="w-12 h-12"
            />
            <span className="text-xl font-bold hidden sm:block" style={{ color: '#0B1F32' }}>
              CO₂ Reduction Planner
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="font-semibold transition-colors"
                  style={{ color: '#0B1F32' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0B1F32'}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/organizations" 
                  className="font-semibold transition-colors"
                  style={{ color: '#0B1F32' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0B1F32'}
                >
                  Organizations
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium" style={{ color: '#5a6c6f' }}>
                    {session.user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-white rounded-full font-bold transition-colors"
                    style={{ backgroundColor: '#ef4444' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="font-semibold transition-colors"
                  style={{ color: '#0B1F32' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#0B1F32'}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-6 py-2 rounded-lg font-semibold transition-colors"
                  style={{ backgroundColor: '#FF5B35', color: '#ffffff' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E54A24'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF5B35'}
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
