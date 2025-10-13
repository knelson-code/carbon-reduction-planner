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
    title: "Understanding Climate Risk",
    description: "• Identify and understand risks\n• Improve your ability to make decisions, even in the face of uncertainty\n• Incorporate these insights into your processes in a simple and clear way",
    icon: "⚠️",
    href: "/dashboard/climate-risk",
    color: "#f59e0b",
    bgColor: "#fef3c7",
  },
  {
    title: "Energy Transition Strategy",
    description: "• Understand your role in a world affected by climate change\n• Determine what you can do to speed up the energy transition\n• Decide what you are willing to do",
    icon: "🚀",
    href: "/dashboard/transition-strategy",
    color: "#3b82f6",
    bgColor: "#dbeafe",
  },
  {
    title: "Systemic Impact",
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
                  className="text-xs leading-relaxed transition-colors duration-150 whitespace-pre-line"
                  style={{ color: hoveredCard === module.title ? '#ffffff' : '#163E64' }}
                >
                  {module.description}
                </p>
              </Link>
            ))}
          </div>

          {/* Getting Started Section */}
          <div className="flex gap-6 items-start">
            {/* Orange Triangle */}
            <div 
              className="flex-shrink-0 flex items-center justify-center p-8"
              style={{
                width: '200px',
                height: '200px',
                clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
                border: '3px solid #FF5B35',
                position: 'relative'
              }}
            >
              <span 
                className="font-bold text-center"
                style={{ 
                  color: '#FF5B35',
                  fontSize: '16px',
                  position: 'absolute',
                  left: '30px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '120px'
                }}
              >
                Some stuff you should know...
              </span>
            </div>

            {/* Blue Rectangle */}
            <div 
              className="flex-1 p-8 rounded-lg"
              style={{
                border: '2px solid #163E64',
                backgroundColor: 'transparent'
              }}
            >
              <p className="font-semibold mb-4" style={{ color: '#163E64', fontSize: '18px' }}>
                Before you get started, you should at a minimum
              </p>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/dashboard/impact-strategy/defining-objectives"
                    className="text-base hover:underline transition-colors"
                    style={{ color: '#163E64' }}
                  >
                    • Think about what you're trying to accomplish
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/dashboard/impact-strategy/theory-of-change"
                    className="text-base hover:underline transition-colors"
                    style={{ color: '#163E64' }}
                  >
                    • Think about whether the actions you're attempting are logically likely to produce the change you're trying to achieve
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
