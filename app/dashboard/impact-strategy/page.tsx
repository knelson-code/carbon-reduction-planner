"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import Link from "next/link"

export default function ImpactStrategyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#163E64" }}>
              Systemic Focus
            </h1>
            <h2 className="text-lg" style={{ color: "#163E64" }}>
              In this section you can learn to:
            </h2>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 mx-4">
            <div
              className="p-6 rounded-lg border flex items-center justify-center text-center"
              style={{
                backgroundColor: '#0B1F32',
                borderColor: '#163E64',
                borderWidth: '1px',
              }}
            >
              <h3 className="text-base font-semibold" style={{ color: '#ffffff' }}>
                Build a clear vision of the specific change you are trying to produce
              </h3>
            </div>

            <div
              className="p-6 rounded-lg border flex items-center justify-center text-center"
              style={{
                backgroundColor: '#0B1F32',
                borderColor: '#163E64',
                borderWidth: '1px',
              }}
            >
              <h3 className="text-base font-semibold" style={{ color: '#ffffff' }}>
                Identify sensitive intervention points in the political and economic system where you can have disproportionate impact
              </h3>
            </div>

            <div
              className="p-6 rounded-lg border flex items-center justify-center text-center"
              style={{
                backgroundColor: '#0B1F32',
                borderColor: '#163E64',
                borderWidth: '1px',
              }}
            >
              <h3 className="text-base font-semibold" style={{ color: '#ffffff' }}>
                Define the actions that are most likely to produce that impact
              </h3>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="mt-12 mx-4 bg-white rounded-lg shadow-md p-8">
            <div className="overflow-x-auto">
              <div className="flex items-start justify-between relative min-w-max">
              {/* Horizontal line */}
              <div 
                className="absolute top-5 left-0 right-0 h-0.5"
                style={{ backgroundColor: '#163E64', zIndex: 0 }}
              />
              
              {/* Timeline items */}
              <div className="flex justify-between w-full relative z-10 gap-4">
                {[
                  { label: 'Theory of Change', completed: false, href: '/dashboard/impact-strategy/point-1/theory-of-change' },
                  { label: 'Systems Point 2', completed: false, href: '/dashboard/impact-strategy/point-2' },
                  { label: 'Systems Point 3', completed: false, href: '/dashboard/impact-strategy/point-3' },
                  { label: 'Systems Point 4', completed: false, href: '/dashboard/impact-strategy/point-4' },
                  { label: 'Systems Point 5', completed: false, href: '/dashboard/impact-strategy/point-5' },
                  { label: 'Systems Point 6', completed: false, href: '/dashboard/impact-strategy/point-6' },
                  { label: 'Systems Point 7', completed: false, href: '/dashboard/impact-strategy/point-7' },
                  { label: 'Systems Point 8', completed: false, href: '/dashboard/impact-strategy/point-8' },
                ].map((item, index) => (
                  <Link 
                    key={index} 
                    href={item.href}
                    className="flex flex-col items-center flex-shrink-0 group cursor-pointer" 
                    style={{ minWidth: '80px', maxWidth: '100px' }}
                  >
                    {/* Circle */}
                    <div
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                      style={{
                        backgroundColor: item.completed ? '#163E64' : 'white',
                        borderColor: '#163E64',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FF5B35'
                        e.currentTarget.style.borderColor = '#FF5B35'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = item.completed ? '#163E64' : 'white'
                        e.currentTarget.style.borderColor = '#163E64'
                      }}
                    >
                      {item.completed && (
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'white' }} />
                      )}
                    </div>
                    {/* Label */}
                    <p 
                      className="text-xs text-center mt-2 transition-colors duration-200"
                      style={{ color: '#163E64' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#FF5B35'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#163E64'}
                    >
                      {item.label}
                    </p>
                  </Link>
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
