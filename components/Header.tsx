"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <header className="border-b" style={{ backgroundColor: '#0B1F32', borderColor: '#0B1F32' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[92px]">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo_ND_white.svg" 
              alt="New Day Climate" 
              width={69} 
              height={69}
              className="w-[69px] h-[69px]"
            />
            {!isHomePage && (
              <span className="text-2xl font-bold hidden sm:block" style={{ color: '#ffffff' }}>
                CO₂ Reduction Planner
              </span>
            )}
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-sm sm:text-base lg:text-lg font-semibold transition-colors"
                  style={{ color: '#ffffff' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/organizations" 
                  className="text-sm sm:text-base lg:text-lg font-semibold transition-colors"
                  style={{ color: '#ffffff' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                >
                  Organizations
                </Link>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="text-sm sm:text-base font-medium hidden md:block" style={{ color: '#ffffff' }}>
                    {session.user?.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 sm:px-5 sm:py-2.5 lg:px-7 text-white text-sm sm:text-base lg:text-lg rounded-lg font-semibold transition-colors whitespace-nowrap"
                    style={{ backgroundColor: '#FF5B35' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E54A24'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF5B35'}
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                {!isHomePage && (
                  <>
                    <Link 
                      href="/login" 
                      className="text-sm sm:text-base lg:text-lg font-semibold transition-colors"
                      style={{ color: '#ffffff' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/register" 
                      className="px-4 py-2 sm:px-5 sm:py-2.5 lg:px-7 text-sm sm:text-base lg:text-lg rounded-lg font-semibold transition-colors whitespace-nowrap"
                      style={{ backgroundColor: '#FF5B35', color: '#ffffff' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E54A24'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF5B35'}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
