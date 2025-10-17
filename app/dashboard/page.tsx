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

const SPY_MESSAGE = `You are Secret Agent X17.

I am an insignificant administrator working in Mission Control Headquarters.

I am contacting you secretly to ask for help with an unofficial and unapproved mission related to fighting climate change and building social resilience.

As you know, many of our top agents have recently been assigned to build "Climate Action Plans", and "CO₂ Reduction Plans". All previous agents have failed on this mission, despite following the instructions from Headquarters perfectly. Furthermore many agents appear to have been psychologically injured by this assignment and some have disappeared.

I have come to suspect that the instructions from Headquarters are incomplete and incorrect. This could only mean that Headquarters has been infiltrated by corrupt agents.

Your mission is two-fold. In the first place, I ask that you attempt to complete a simple, clear, realistic climate action plan using the best practices provided by Headquarters. I need to know if it is possible.

At the same time you will need to think broadly and critically about the assignment. Something is wrong. Something is missing. I don't have the knowledge or skills to identify the problem on my own, and that's why I am counting on you. We are all counting on you.

I don't have any more information. But I've arranged a small transfer from my personal expense account. Rumor has it that the missing notes of the previous corruption investigators can be purchased. This should be enough to buy them, if you can figure out how.

Thank you Agent. Good luck.`

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const [showSpyPopup, setShowSpyPopup] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [showButton, setShowButton] = useState(false)
  const [showSelfDestruct, setShowSelfDestruct] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [morseAudio, setMorseAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Preload typewriter audio on page load
  useEffect(() => {
    const audio = new Audio('/typewriter.mp3')
    audio.preload = 'auto'
    audio.loop = true // Loop in case message becomes longer
    audio.load()
    setMorseAudio(audio)
  }, [])

  // Start/stop morse code audio based on typing state
  useEffect(() => {
    if (showSpyPopup && morseAudio) {
      if (typedText.length < SPY_MESSAGE.length) {
        // Still typing - play audio if not already playing
        if (morseAudio.paused) {
          morseAudio.currentTime = 0
          morseAudio.play().catch(err => console.log('Typewriter audio play failed:', err))
        }
      } else if (typedText.length === SPY_MESSAGE.length) {
        // Typing complete - stop audio
        morseAudio.pause()
        morseAudio.currentTime = 0
      }
    }
  }, [showSpyPopup, typedText, morseAudio])

  // Typing animation effect
  useEffect(() => {
    if (showSpyPopup && typedText.length < SPY_MESSAGE.length) {
      const timeout = setTimeout(() => {
        setTypedText(SPY_MESSAGE.slice(0, typedText.length + 1))
      }, 2.5) // 2.5ms per character (4x faster than before)
      return () => clearTimeout(timeout)
    } else if (showSpyPopup && typedText.length === SPY_MESSAGE.length && !showButton) {
      setShowButton(true)
    }
  }, [showSpyPopup, typedText, showButton])

  // Self-destruct sequence handler
  const handleSelfDestruct = async () => {
    // Play nicey sound instantly
    const audio = new Audio('/nicey.mp3')
    audio.preload = 'auto'
    audio.play().catch(err => console.log('Audio play failed:', err))

    // Show completion message instantly
    setShowSelfDestruct(true)

    // Start fade out immediately
    setIsFadingOut(true)

    // Award 5 points after 1 second
    setTimeout(async () => {
      try {
        await fetch('/api/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ points: 5 }),
        })
        window.dispatchEvent(new Event('scoreUpdated'))
      } catch (error) {
        console.error('Failed to award points:', error)
      }
    }, 1000)

    // Close after 2 seconds total (2s fade)
    setTimeout(() => {
      setShowSpyPopup(false)
      setTypedText("")
      setShowButton(false)
      setShowSelfDestruct(false)
      setIsFadingOut(false)
    }, 2000)
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
          <div className="accordion-section mb-8 mx-auto max-w-4xl px-8">
            {/* Accordion Header */}
            <button
              onClick={() => {
                setIsAccordionOpen(!isAccordionOpen)
                if (!isAccordionOpen) {
                  // Scroll accordion to top of viewport when opening
                  setTimeout(() => {
                    document.querySelector('.accordion-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 100)
                }
              }}
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
                <p className="text-sm leading-relaxed">
                  If you complete all of these activities, you'll have a robust transition strategy. That means understanding your role in a world affected by climate change, and having a clear plan for what you intend to do about it.
                </p>
                <p className="text-sm leading-relaxed font-bold">
                  However, we recommend that at a minimum, before rushing into the CO₂ management section as most users do, you take a look at these three points:
                </p>
                <ul className="space-y-2 pl-4">
                  <li>
                    <span style={{ color: '#163E64' }}>• </span>
                    <Link 
                      href="/dashboard/transition-strategy/defining-objectives"
                      className="text-sm underline hover:opacity-70 transition-opacity"
                      style={{ color: '#163E64', textDecorationColor: '#FF5B35' }}
                    >
                      Think about what you're trying to accomplish
                    </Link>
                  </li>
                  <li>
                    <span style={{ color: '#163E64' }}>• </span>
                    <Link 
                      href="/dashboard/impact-strategy/point-1/theory-of-change"
                      className="text-sm underline hover:opacity-70 transition-opacity"
                      style={{ color: '#163E64', textDecorationColor: '#FF5B35' }}
                    >
                      Think about whether the actions you're planning are logically likely to produce the change you're trying to achieve
                    </Link>
                  </li>
                  <li>
                    <span style={{ color: '#163E64' }}>• </span>
                    <Link 
                      href="/dashboard/climate-risk"
                      className="text-sm underline hover:opacity-70 transition-opacity"
                      style={{ color: '#163E64', textDecorationColor: '#FF5B35' }}
                    >
                      Think about the nature of the problem
                    </Link>
                  </li>
                </ul>

                {/* Top Secret Folder Icon - moved to bottom */}
                <div className="flex justify-center mt-6">
                  <div className="flex flex-col items-center">
                    <p className="text-xs mb-1" style={{ color: '#0B1F32' }}>Top Secret</p>
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                        setShowSpyPopup(true)
                      }}
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
              backgroundColor: 'white',
              fontFamily: "'Courier New', Courier, monospace",
              opacity: isFadingOut ? 0 : 1,
              transition: 'opacity 2s ease-in-out'
            }}
          >
            {/* Close button - top right - smaller, thinner, grey */}
            <button
              onClick={() => {
                setShowSpyPopup(false)
                setTypedText("")
                setShowButton(false)
                setShowSelfDestruct(false)
                setIsFadingOut(false)
              }}
              className="absolute top-2 right-2 hover:opacity-70 transition-opacity"
              style={{ color: '#6C757D' }}
            >
              <span className="text-lg font-light">✕</span>
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
                style={{ color: '#0B1F32' }}
              >
                TRANSMISSION OF MISSION BRIEFING COMPLETE
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
