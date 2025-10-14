"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Sidebar from "@/components/Sidebar"
import Link from "next/link"

interface TimelineItem {
  label: string
  completed: boolean
  href: string
  activityId?: string
}

export default function TransitionStrategyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    { label: 'Think about what you\'re trying to accomplish', completed: false, href: '/dashboard/transition-strategy/defining-objectives', activityId: 'transition-strategy-defining-objectives' },
    { label: 'Transition Point 2', completed: false, href: '/dashboard/transition-strategy/point-2' },
    { label: 'Transition Point 3', completed: false, href: '/dashboard/transition-strategy/point-3' },
    { label: 'Transition Point 4', completed: false, href: '/dashboard/transition-strategy/point-4' },
    { label: 'Transition Point 5', completed: false, href: '/dashboard/transition-strategy/point-5' },
    { label: 'Transition Point 6', completed: false, href: '/dashboard/transition-strategy/point-6' },
    { label: 'Transition Point 7', completed: false, href: '/dashboard/transition-strategy/point-7' },
    { label: 'Transition Point 8', completed: false, href: '/dashboard/transition-strategy/point-8' },
  ])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Load completion statuses
  useEffect(() => {
    const loadCompletionStatuses = async () => {
      if (status === "authenticated") {
        try {
          // Fetch completion status for items with activityId
          const promises = timelineItems.map(async (item) => {
            if (item.activityId) {
              const response = await fetch(`/api/activities?activityId=${item.activityId}`)
              if (response.ok) {
                const { isCompleted } = await response.json()
                return { ...item, completed: isCompleted }
              }
            }
            return item
          })

          const updatedItems = await Promise.all(promises)
          setTimelineItems(updatedItems)
        } catch (error) {
          console.error("Failed to load completion statuses:", error)
        }
      }
    }

    loadCompletionStatuses()
  }, [status])

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
              Energy Transition
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
                Understand your role in a world affected by climate change
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
                Determine what you can do to speed up the energy transition
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
                Decide what you are willing to do
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
                {timelineItems.map((item, index) => (
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
                        backgroundColor: item.completed ? '#0B1F32' : 'white',
                        borderColor: '#0B1F32',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FF5B35'
                        e.currentTarget.style.borderColor = '#FF5B35'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = item.completed ? '#0B1F32' : 'white'
                        e.currentTarget.style.borderColor = '#0B1F32'
                      }}
                    >
                      {item.completed && (
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: 'white' }} />
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
