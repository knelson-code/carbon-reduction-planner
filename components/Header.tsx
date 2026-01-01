"use client"

/*
 * ⚠️ CRITICAL: TWO SEPARATE APPLICATIONS SHARE THIS HEADER ⚠️
 * 
 * This header serves TWO COMPLETELY ISOLATED APPLICATIONS:
 * 
 * 1. CLIMATE RISK MANAGEMENT APP (CLIENT-READY, PRODUCTION)
 *    - URL: https://risk-software.newdayclimate.com/climate-risk-management
 *    - Must be completely self-contained
 *    - NO links to /dashboard, /store, or /organizations
 *    - Hides points, store, organizations dropdown
 * 
 * 2. MAGNUM OPUS APP (INCOMPLETE, LONG-TERM PROJECT)
 *    - URL: https://risk-software.newdayclimate.com/dashboard (and /store, /organizations)
 *    - Not accessible from Climate Risk Management App
 *    - Shows full navigation including points/store
 * 
 * When making changes: ALWAYS check pathname.startsWith('/climate-risk-management')
 * to ensure proper isolation!
 */

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  
  // Check if we're in climate risk subdomain or if callbackUrl indicates we should be
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setCallbackUrl(params.get('callbackUrl'))
    }
  }, [pathname])
  
  const isClimateRiskManagement = pathname.startsWith("/climate-risk-management") || 
    (callbackUrl?.startsWith("/climate-risk-management") ?? false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [score, setScore] = useState(0)
  const [displayScore, setDisplayScore] = useState(0)
  const windAudioRef = useRef<HTMLAudioElement | null>(null)

  // Preload wind sound for sign out
  useEffect(() => {
    windAudioRef.current = new Audio('/wind-sound.mp3')
    windAudioRef.current.preload = 'auto'
    windAudioRef.current.load()
    // Force browser to fully load the audio by playing it at 0 volume
    windAudioRef.current.volume = 0
    windAudioRef.current.play().then(() => {
      windAudioRef.current!.pause()
      windAudioRef.current!.currentTime = 0
      windAudioRef.current!.volume = 1
    }).catch(() => {
      // Silent fail - browser may block autoplay, but audio is still preloaded
      windAudioRef.current!.volume = 1
    })
  }, [])

  // Fetch user score
  useEffect(() => {
    const fetchScore = async (isInitialLoad = false) => {
      if (session) {
        try {
          const response = await fetch('/api/score')
          if (response.ok) {
            const data = await response.json()
            setScore(data.score)
            // Only set displayScore on initial load, not on updates
            if (isInitialLoad) {
              setDisplayScore(data.score)
            }
          }
        } catch (error) {
          console.error('Error fetching score:', error)
        }
      }
    }

    // Initial load - set both score and displayScore
    fetchScore(true)

    // Listen for score updates from activity pages
    const handleScoreUpdate = () => {
      // On updates, only fetch score (not displayScore) to trigger animation
      fetchScore(false)
    }

    window.addEventListener('scoreUpdated', handleScoreUpdate)
    return () => window.removeEventListener('scoreUpdated', handleScoreUpdate)
  }, [session])

  // Animate score counting up when score changes (20 points per second - reaches 50 in 2.5s)
  useEffect(() => {
    if (displayScore < score) {
      const pointsToAdd = score - displayScore
      const incrementsPerSecond = 20
      const stepDuration = 1000 / incrementsPerSecond // 50ms per point

      const interval = setInterval(() => {
        setDisplayScore(prev => {
          const next = prev + 1
          if (next >= score) {
            clearInterval(interval)
            return score
          }
          return next
        })
      }, stepDuration)

      return () => clearInterval(interval)
    }
  }, [score, displayScore])

  const handleSignOut = async () => {
    // Play wind sound
    if (windAudioRef.current) {
      windAudioRef.current.currentTime = 0
      windAudioRef.current.play().catch(err => console.log('Error playing sound:', err))
    }
    await signOut({ redirect: false })
    router.push("/login")
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="border-b relative" style={{ backgroundColor: '#0B1F32', borderColor: '#0B1F32' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[92px]">
            {/* Logo */}
            <Link href={isClimateRiskManagement ? "/climate-risk-management" : (session ? "/climate-risk-management" : "/")} className="flex items-center space-x-3 hover:opacity-80 transition-opacity z-50">
              <Image 
                src="/logo_ND_white.svg" 
                alt="New Day Climate" 
                width={69} 
                height={69}
                className="w-[69px] h-[69px]"
              />
              {!isHomePage && (
                <span className="text-2xl font-bold hidden sm:block" style={{ color: '#ffffff' }}>
                  Climate Management Platform
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {session ? (
                <>
                  <Link 
                    href="/climate-risk-management" 
                    className="text-lg font-semibold transition-colors"
                    style={{ color: '#ffffff' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                  >
                    {isClimateRiskManagement ? "Dashboard" : "Climate Risk Management"}
                  </Link>
                  {!isClimateRiskManagement && (
                    <>
                      <Link 
                        href="/store" 
                        className="text-lg font-semibold transition-colors"
                        style={{ color: '#ffffff' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                      >
                        Use Points
                      </Link>
                      <div className="text-lg font-semibold" style={{ color: '#ffffff', minWidth: '150px' }}>
                        Your Points: {Math.round(displayScore)}
                      </div>
                    </>
                  )}
                  <div className="flex items-center space-x-4">
                    <span className="text-base font-medium" style={{ color: '#ffffff' }}>
                      {session.user?.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="px-7 py-2.5 text-white text-lg rounded-lg font-semibold transition-colors"
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
                        href={isClimateRiskManagement ? "/login?callbackUrl=/climate-risk-management" : "/login"}
                        className="text-lg font-semibold transition-colors"
                        style={{ color: '#ffffff' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                      >
                        Login
                      </Link>
                      <Link 
                        href={isClimateRiskManagement ? "/register?callbackUrl=/climate-risk-management" : "/register"}
                        className="px-7 py-2.5 text-lg rounded-lg font-semibold transition-colors"
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

            {/* Mobile Hamburger Button - Only show if there are items to display */}
            {(session || !isHomePage) && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden z-50 p-2"
                aria-label="Toggle menu"
              >
              {mobileMenuOpen ? (
                // X icon when menu is open
                <svg className="w-8 h-8" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon when menu is closed
                <svg className="w-8 h-8" fill="none" stroke="#ffffff" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'rgba(11, 31, 50, 0.95)' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav className="flex flex-col items-center justify-center h-full space-y-8 px-8">
            {session ? (
              <>
                <Link 
                  href="/climate-risk-management"
                  className="text-3xl font-bold transition-colors"
                  style={{ color: '#ffffff' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {isClimateRiskManagement ? "Dashboard" : "Climate Risk Management"}
                </Link>
                {!isClimateRiskManagement && (
                  <Link 
                    href="/store"
                    className="text-3xl font-bold transition-colors"
                    style={{ color: '#ffffff' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Use Points
                  </Link>
                )}
                <div className="text-xl font-medium" style={{ color: '#ffffff' }}>
                  {session.user?.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-10 py-4 text-white text-2xl rounded-lg font-bold transition-colors"
                  style={{ backgroundColor: '#FF5B35' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {!isHomePage && (
                  <>
                    <Link 
                      href={isClimateRiskManagement ? "/login?callbackUrl=/climate-risk-management" : "/login"}
                      className="text-3xl font-bold transition-colors"
                      style={{ color: '#ffffff' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href={isClimateRiskManagement ? "/register?callbackUrl=/climate-risk-management" : "/register"}
                      className="px-10 py-4 text-2xl rounded-lg font-bold transition-colors"
                      style={{ backgroundColor: '#FF5B35', color: '#ffffff' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </>
  )
}
