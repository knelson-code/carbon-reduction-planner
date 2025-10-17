"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Sidebar from "@/components/Sidebar"

interface ModuleCard {
  title: string
  description: string
  icon: string
  href: string
  color: string
  bgColor: string
}

const modules: ModuleCard[] = [
  {
    title: "Climate and Risk",
    description: "• Identify and understand risks\n• Improve your ability to make decisions, even in the face of uncertainty\n• Incorporate these insights into your processes in a simple and clear way",
    icon: "⚠️",
    href: "/dashboard/climate-risk",
    color: "#f59e0b",
    bgColor: "#fef3c7",
  },
  {
    title: "Energy Transition",
    description: "• Understand your role in a world affected by climate change\n• Determine what you can do to speed up the energy transition\n• Decide what you are willing to do",
    icon: "🚀",
    href: "/dashboard/transition-strategy",
    color: "#3b82f6",
    bgColor: "#dbeafe",
  },
  {
    title: "Systemic Focus",
    description: "• Build a clear vision of the specific change you are trying to produce\n• Identify sensitive intervention points in the political and economic system where you can have disproportionate impact\n• Define the actions that are most likely to produce that impact",
    icon: "💡",
    href: "/dashboard/impact-strategy",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
  },
  {
    title: "CO₂ Management",
    description: "• Measure emissions\n• Set reduction Targets\n• Create detailed reduction plan",
    icon: "🌱",
    href: "/dashboard/co2-management",
    color: "#10b981",
    bgColor: "#d1fae5",
  },
]

const SPY_MESSAGE = `MISSION BRIEFING

You will be successful when the materials you produce amount to a climate action plan that is clear, realistic and valuable.`

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const [showSpyPopup, setShowSpyPopup] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [showButton, setShowButton] = useState(false)
  const [showSelfDestruct, setShowSelfDestruct] = useState(false)
  const [isFading, setIsFading] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, vx: number, vy: number}>>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Typing animation effect
  useEffect(() => {
    if (showSpyPopup && typedText.length < SPY_MESSAGE.length) {
      const timeout = setTimeout(() => {
        setTypedText(SPY_MESSAGE.slice(0, typedText.length + 1))
      }, 10) // 10ms per character for very fast typing
      return () => clearTimeout(timeout)
    } else if (showSpyPopup && typedText.length === SPY_MESSAGE.length && !showButton) {
      setShowButton(true)
    }
  }, [showSpyPopup, typedText, showButton])

  // Self-destruct sequence handler
  const handleSelfDestruct = async () => {
    // Play nicey sound
    const audio = new Audio('/nicey.mp3')
    audio.preload = 'auto'
    audio.play().catch(err => console.log('Audio play failed:', err))

    // Show self-destruct warning
    setShowSelfDestruct(true)

    // Award 500 points after 1 second
    setTimeout(async () => {
      try {
        await fetch('/api/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ points: 500 }),
        })
        window.dispatchEvent(new Event('scoreUpdated'))
      } catch (error) {
        console.error('Failed to award points:', error)
      }
    }, 1000)

    // Start fade to dark blue after 3 seconds
    setTimeout(() => {
      setIsFading(true)
    }, 3000)

    // Explode and close after 5 seconds total
    setTimeout(() => {
      setShowSpyPopup(false)
      setTypedText("")
      setShowButton(false)
      setShowSelfDestruct(false)
      setIsFading(false)
    }, 5000)
  }

  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-[calc(100vh-92px)]">
      <Sidebar />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Explanatory Text */}
          <div className="mb-6">
            <p className="text-sm leading-relaxed" style={{ color: '#0B1F32' }}>
              This software will help you to build a robust climate action plan. If you already know exactly what you need to build, you can simply navigate to the corresponding activity in the following four sections. However, in our experience, simply trying to complete the tasks by jumping directly to the final steps leads to paper-thin materials that have little or no systemic relevance. Therefore you may consider using the additional information shown below these boxes in order to start exploring the full range of tools in game-play mode, which encourages you to go on a journey of more robust reflection and development.
            </p>
          </div>

          {/* Module Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {modules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="p-8 rounded-lg border transition-all duration-150"
                style={{
                  backgroundColor: hoveredCard === module.title ? '#0B1F32' : '#f5f5f5',
                  borderColor: '#163E64',
                  borderWidth: '1px',
                  boxShadow: hoveredCard === module.title 
                    ? '0 4px 12px rgba(255, 91, 53, 0.35)' 
                    : '0 2px 8px rgba(255, 91, 53, 0.25)',
                }}
                onMouseEnter={() => setHoveredCard(module.title)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <h3
                  className="text-xl font-bold mb-3 transition-colors duration-150"
                  style={{ color: hoveredCard === module.title ? '#ffffff' : '#163E64' }}
                >
                  {module.title}
                </h3>
                <p
                  className="hidden md:block text-xs leading-relaxed transition-colors duration-150 whitespace-pre-line"
                  style={{ color: hoveredCard === module.title ? '#ffffff' : '#163E64' }}
                >
                  {module.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Getting Started Accordion Section */}
          <div className="mb-8 mx-auto max-w-4xl px-8">
            {/* Accordion Header */}
            <button
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full flex items-center gap-3 pb-2"
              style={{
                borderBottom: '1px solid #163E64',
              }}
            >
              <span 
                className="flex-1 text-left font-semibold"
                style={{ color: '#163E64', fontSize: '18px' }}
              >
                So there's some stuff you should know...
              </span>
              {/* Orange Triangle Indicator */}
              <div
                className="transition-transform duration-200"
                style={{
                  transform: isAccordionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '10px solid #FF5B35',
                  }}
                />
              </div>
            </button>

            {/* Accordion Content */}
            {isAccordionOpen && (
              <div className="mt-4 space-y-3" style={{ color: '#163E64' }}>
                {/* Top Secret Folder Icon */}
                <div className="flex justify-center mb-6">
                  <div className="flex flex-col items-center">
                    <p className="text-xs mb-1" style={{ color: '#0B1F32' }}>Top Secret</p>
                    <button
                      onClick={() => setShowSpyPopup(true)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src="/folder-icon.svg" 
                        alt="Top Secret Folder" 
                        width="48" 
                        height="48"
                      />
                    </button>
                  </div>
                </div>

                <p className="text-sm leading-relaxed">
                  If you complete all of these activities, you'll have a robust transition strategy. That means understanding your role in a world affected by climate change, and having a clear plan for what you intend to do about it.
                </p>
                <p className="text-sm leading-relaxed">
                  This software is completely modular. You can jump in anywhere you like. However, we recommend that before getting started, you take a look at these three points:
                </p>
                <ul className="space-y-2 pl-4">
                  <li>
                    <span style={{ color: '#163E64' }}>• </span>
                    <Link 
                      href="/dashboard/transition-strategy/defining-objectives"
                      className="text-sm underline hover:opacity-70 transition-opacity"
                      style={{ color: '#163E64' }}
                    >
                      Think about what you're trying to accomplish
                    </Link>
                  </li>
                  <li>
                    <span style={{ color: '#163E64' }}>• </span>
                    <Link 
                      href="/dashboard/impact-strategy/point-1/theory-of-change"
                      className="text-sm underline hover:opacity-70 transition-opacity"
                      style={{ color: '#163E64' }}
                    >
                      Think about whether the actions you're planning are logically likely to produce the change you're trying to achieve
                    </Link>
                  </li>
                  <li>
                    <span style={{ color: '#163E64' }}>• </span>
                    <Link 
                      href="/dashboard/climate-risk"
                      className="text-sm underline hover:opacity-70 transition-opacity"
                      style={{ color: '#163E64' }}
                    >
                      Think about the nature of the problem
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spy Mission Popup */}
      {showSpyPopup && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
        >
          <div 
            className="relative max-w-2xl w-full p-8 rounded-lg"
            style={{
              backgroundColor: isFading ? '#0B1F32' : 'white',
              transition: 'background-color 2s ease-in-out',
              fontFamily: "'Courier New', Courier, monospace"
            }}
          >
            {/* Close button - top right */}
            <button
              onClick={() => {
                setShowSpyPopup(false)
                setTypedText("")
                setShowButton(false)
                setShowSelfDestruct(false)
                setIsFading(false)
              }}
              className="absolute top-2 right-2 hover:opacity-70 transition-opacity"
              style={{ color: '#0B1F32' }}
            >
              <span className="text-2xl font-bold">✕</span>
              <span className="block text-xs">Close</span>
            </button>

            <p 
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: '#0B1F32' }}
            >
              {typedText}
            </p>
            
            {showButton && !showSelfDestruct && (
              <button
                onClick={handleSelfDestruct}
                className="mt-6 px-6 py-2 rounded transition-opacity"
                style={{ backgroundColor: '#0B1F32', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Click here when you've finished reading
              </button>
            )}

            {showSelfDestruct && (
              <p 
                className="mt-6 text-lg font-bold"
                style={{ color: '#FF5B35' }}
              >
                THIS MESSAGE WILL SELF DESTRUCT IN 5 SECONDS
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
