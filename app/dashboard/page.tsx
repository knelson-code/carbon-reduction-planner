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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

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

          {/* Top Secret Icon - Bottom Left */}
          <div className="fixed bottom-8 z-10 flex flex-col items-center" style={{ left: 'calc(1rem + 16px)' }}>
            <p className="text-xs mb-1" style={{ color: '#0B1F32' }}>Secret Briefing</p>
            <svg width="48" height="48" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <path d="m15.965 59.47a.5.5 0 0 1 -.263-.926l5.545-3.418-7.408 4.274a.5.5 0 0 1 -.51-.859l.047-.028-1.093.63a.5.5 0 0 1 -.511-.86l3.7-2.26-3.982 2.3a.5.5 0 0 1 -.516-.855l17.57-11.06-17.269 9.973a.5.5 0 0 1 -.517-.855l19.77-12.546-16.553 9.557a.5.5 0 0 1 -.518-.854l17.21-10.928-12.415 7.167a.5.5 0 0 1 -.52-.855l14.106-9.005-9.565 5.521a.5.5 0 0 1 -.513-.857l3.046-1.895a.5.5 0 0 1 -.478-.877l2.617-1.628a.5.5 0 0 1 -.266-.915l11.956-8.046-6.847 3.952a.5.5 0 0 1 -.523-.851l4.171-2.724-.719.415a.5.5 0 0 1 -.531-.845l5.293-3.6-1.379.788a.5.5 0 0 1 -.537-.843l3.62-2.527a.494.494 0 0 1 -.595-.188.5.5 0 0 1 .109-.674l4.235-3.266a.5.5 0 0 1 -.476-.193.5.5 0 0 1 .053-.662l3.457-3.325a.5.5 0 0 1 .217-.609l1.089-.628a.5.5 0 0 1 .6.794l-1.708 1.642 2.555-1.474a.5.5 0 0 1 .555.828l-4.037 3.114 3.482-2.01a.5.5 0 0 1 .536.843l-3.555 2.49 3.025-1.747a.5.5 0 0 1 .531.846l-5.3 3.6 4.766-2.751a.5.5 0 0 1 .523.851l-4.177 2.727 3.654-2.109a.5.5 0 0 1 .529.848l-11.957 8.05 11.426-6.6a.5.5 0 0 1 .514.858l-.714.444.2-.115a.5.5 0 0 1 .513.857l-3.024 1.881 2.511-1.449a.5.5 0 0 1 .519.854l-14.1 9 13.581-7.835a.5.5 0 0 1 .517.855l-17.208 10.923 16.691-9.632a.5.5 0 0 1 .517.854l-19.777 12.551 19.26-11.119a.5.5 0 0 1 .516.856l-17.566 11.057 17.05-9.844a.5.5 0 0 1 .51.86l-3.689 2.251 3.179-1.834a.5.5 0 0 1 .509.859l-.422.258a.5.5 0 0 1 .425.9l-5.532 3.408 5.019-2.9a.5.5 0 0 1 .517.855l-11.479 7.28 10.963-6.329a.5.5 0 0 1 .519.853l-10.713 6.873 10.194-5.884a.5.5 0 0 1 .523.851l-10.029 6.543 9.506-5.487a.5.5 0 0 1 .517.855l-2.344 1.484 1.827-1.055a.5.5 0 0 1 .522.852l-4.735 3.084 4.213-2.432a.5.5 0 0 1 .532.846l-6.534 4.468 6-3.465a.5.5 0 0 1 .538.842l-5.106 3.586 4.57-2.637a.5.5 0 0 1 .549.833l-4.211 3.142 3.662-2.114a.5.5 0 0 1 .555.828l-2.361 1.825 1.806-1.042a.5.5 0 0 1 .57.817l-1.256 1.049.686-.4a.5.5 0 0 1 .654.728l-1.006 1.375.24-.137a.5.5 0 1 1 .5.865l-2.288 1.323a.5.5 0 0 1 -.654-.727l1.005-1.373-3.644 2.1a.5.5 0 0 1 -.57-.816l1.255-1.049-3.232 1.865a.5.5 0 0 1 -.555-.828l2.363-1.827-4.6 2.655a.5.5 0 0 1 -.548-.833l4.209-3.14-6.883 3.973a.5.5 0 0 1 -.538-.841l5.109-3.594-7.683 4.435a.5.5 0 0 1 -.532-.845l6.534-4.468-9.2 5.313a.5.5 0 0 1 -.522-.851l4.73-3.076-6.8 3.927a.5.5 0 0 1 -.518-.855l2.347-1.484-4.061 2.339a.5.5 0 0 1 -.523-.851l10.025-6.539-12.805 7.39a.5.5 0 0 1 -.519-.853l10.714-6.874-13.385 7.727a.5.5 0 0 1 -.518-.854l11.479-7.275-14.085 8.129a.5.5 0 0 1 -.25.07z" fill="#d4e6e7"/>
              <path d="m42.992 19.157a.5.5 0 0 1 -.322-.883l3.655-3.074-3.3 1.908a.5.5 0 0 1 -.568-.819l3.57-2.946-3.217 1.85a.5.5 0 0 1 -.568-.819l3.714-3.05-3.356 1.94a.5.5 0 0 1 -.546-.836l1.293-.949-.889.512a.5.5 0 0 1 -.559-.825l3.321-2.622-2.96 1.708a.5.5 0 0 1 -.552-.831l2.213-1.677-1.821 1.056a.5.5 0 0 1 -.575-.814l3.064-2.613-2.7 1.557a.5.5 0 0 1 -.579-.81l2.006-1.75-1.607.93a.5.5 0 0 1 -.635-.752l1.4-1.683-.971.56a.5.5 0 0 1 -.745-.5l.164-1.137a.5.5 0 0 1 -.29-.228.5.5 0 0 1 .183-.684l.47-.27a.5.5 0 0 1 .53.019.5.5 0 0 1 .215.486l-.135.937 2.496-1.448a.5.5 0 0 1 .634.752l-1.4 1.683 3.645-2.1a.5.5 0 0 1 .58.809l-2.003 1.743 2.967-1.713a.5.5 0 0 1 .575.814l-3.064 2.612 4.031-2.327a.5.5 0 0 1 .552.831l-2.216 1.68 2.028-1.17a.5.5 0 0 1 .559.825l-3.325 2.621 2.766-1.6a.5.5 0 0 1 .546.836l-1.294.951.748-.432a.5.5 0 0 1 .567.819l-3.711 3.048 3.144-1.81a.5.5 0 0 1 .568.818l-3.572 2.948 3-1.734a.5.5 0 0 1 .572.815l-3.65 3.081 3.082-1.779a.5.5 0 0 1 .576.812l-.788.677a.505.505 0 0 1 .61.218.5.5 0 0 1 -.182.683l-4.521 2.61a.5.5 0 0 1 -.576-.811l.762-.657-3.359 1.94a.491.491 0 0 1 -.25.064z" fill="#5590b7"/>
              <g fill="#262626"><path d="m12.529 59.286q16.447 0 32.9 0c4.731.4 7.048-.36 6.293-5.666-.013-16.464.025-32.948 0-49.38-2.54-5.884-10.922-3.052-16.04-3.693h-22.882c-1.966 0-4.418.1-4.528 2.693-.022 16.318.016 32.644 0 48.964-.217 1.427.463 3.007 2 3.156-.004 1.782-.072 3.788 2.257 3.926zm37.747-2.567c-.015.714-.032 1.76-.861 1.995-7.427.032-14.943-.023-22.4 0-4.452-.018-8.91.025-13.359 0-1.927-.133-1.962-1.772-1.939-3.262h31.146c2.008 0 4.726.08 4.865-2.644.081-11.569-.084-23.154.025-34.725a27.789 27.789 0 0 0 2.523-1.475c-.011 13.37.016 26.741 0 40.111zm-2.635-38.584a.372.372 0 0 1 -.062.04.185.185 0 0 1 .062-.04zm-1.97-16.683c6.252.413 4.362 6.643 4.6 10.961.447 2.469-.551 4.09-2.967 4.931-5.575-3.565-.18-11.444-3.752-15.944.707.017 1.414.023 2.119.052zm-35.845 51.986c-.32-16.547.023-33.225-.1-49.816-.248-1.4.623-2.5 2.072-2.17 9.547 0 19.078.033 28.629-.08 6.691.94-1.045 13.1 5.843 16.875-.015 11.663.028 23.336-.013 34.993-.246 2.6-7.539.809-9.692 1.309h-21.4c-1.373-.001-4.742.607-5.339-1.111z"/><path d="m15.276 22.194c.2 2.687 3.28 2.225 5.174 2.225h17.27c3.615-.008 3.034-3.909 3.005-6.443-.306-2.491.734-5.485-.638-7.676-1.211-1.222-4.1-.719-5.633-.719-5.36.028-10.722-.048-16.081 0-5.294.119-2.541 9.051-3.097 12.613zm1.449-10.275c.16-2.184 3.108-1.5 4.629-1.5h15.67c2.8-.277 2.293 2.913 2.251 4.806-.426 2.026 1.124 7.713-1.147 8.357-6.494-.039-12.994.063-19.485 0-3.367.247-1.571-9.191-1.918-11.663z"/><path d="m34.724 38.534c.336-2.066-.542-4.248-2.988-3.807 1.531-8.475-8.894-8.266-7.472.027-4.319.09-2.71 5.125-2.988 7.965 0 1.262-.337 3.116.737 4.038 2.989 1.189 6.631.249 9.839.487 4.466-.301 2.458-5.738 2.872-8.71zm-8.988-6.58a2.2 2.2 0 0 1 3.538-1.9c1.455 1.1.881 3.1.99 4.67-1.509 0-3.018-.006-4.528 0 .002-.924-.002-1.847 0-2.77zm7.54 10.539c-.16 1.355.52 3.356-.8 4.235-2.985-.539-7.359 1.266-9.562-1.072-.48-2.67-.051-5.508-.19-8.235-.11-1.043.32-2.433 1.6-2.148.208.409.972.353 1.279 0h4.717c.2.4.935.355 1.257.024 2.99.679 1.263 4.978 1.699 7.196z"/><path d="m29.151 38.763c-2.054-.713-4.908 1.408-3.519 3.573 2.325 3.264 7.779-1.8 3.519-3.573zm-1.721.666c.041-.03.023-.016 0 0zm1.046 3.192c.043-.021.03-.013 0 0zm.49-.449a.807.807 0 0 1 -.889.445 1.837 1.837 0 0 1 -.6-3.217c1.383-.258 2.301 1.715 1.489 2.772z"/><path d="m22.726 15.439c1.071-.275 12.91.777 10.549-.877-1.075.274-12.911-.778-10.549.877z"/><path d="m31.071 18.5c-2.043.361-5.29-.787-6.8.567-.047.373.4.443.661.443h6c.8.036 1.161-1.1.139-1.01z"/></g>
            </svg>
            <p className="text-xs mt-1" style={{ color: '#0B1F32' }}>Game Play Briefing</p>
          </div>

          {/* Getting Started Accordion Section */}
          <div className="mb-8 mt-14 mx-auto max-w-4xl px-8">
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
    </div>
  )
}
