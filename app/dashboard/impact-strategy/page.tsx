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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/dashboard/impact-strategy/vision"
              className="p-8 rounded-lg border transition-all duration-150"
              style={{
                backgroundColor: '#f5f5f5',
                borderColor: '#163E64',
                borderWidth: '1px',
                boxShadow: '0 2px 8px rgba(255, 91, 53, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0B1F32'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 91, 53, 0.35)'
                const heading = e.currentTarget.querySelector('h3')
                if (heading) (heading as HTMLElement).style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 91, 53, 0.25)'
                const heading = e.currentTarget.querySelector('h3')
                if (heading) (heading as HTMLElement).style.color = '#163E64'
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: '#163E64' }}>
                Build a clear vision of the specific change you are trying to produce
              </h3>
            </Link>

            <Link
              href="/dashboard/impact-strategy/intervention"
              className="p-8 rounded-lg border transition-all duration-150"
              style={{
                backgroundColor: '#f5f5f5',
                borderColor: '#163E64',
                borderWidth: '1px',
                boxShadow: '0 2px 8px rgba(255, 91, 53, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0B1F32'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 91, 53, 0.35)'
                const heading = e.currentTarget.querySelector('h3')
                if (heading) (heading as HTMLElement).style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 91, 53, 0.25)'
                const heading = e.currentTarget.querySelector('h3')
                if (heading) (heading as HTMLElement).style.color = '#163E64'
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: '#163E64' }}>
                Identify sensitive intervention points in the political and economic system where you can have disproportionate impact
              </h3>
            </Link>

            <Link
              href="/dashboard/impact-strategy/actions"
              className="p-8 rounded-lg border transition-all duration-150"
              style={{
                backgroundColor: '#f5f5f5',
                borderColor: '#163E64',
                borderWidth: '1px',
                boxShadow: '0 2px 8px rgba(255, 91, 53, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0B1F32'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 91, 53, 0.35)'
                const heading = e.currentTarget.querySelector('h3')
                if (heading) (heading as HTMLElement).style.color = '#ffffff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 91, 53, 0.25)'
                const heading = e.currentTarget.querySelector('h3')
                if (heading) (heading as HTMLElement).style.color = '#163E64'
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: '#163E64' }}>
                Define the actions that are most likely to produce that impact
              </h3>
            </Link>
          </div>

          {/* Progress Timeline */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-8 overflow-x-auto">
            <div className="flex items-start justify-between relative min-w-max">
              {/* Horizontal line */}
              <div 
                className="absolute top-5 left-0 right-0 h-0.5"
                style={{ backgroundColor: '#163E64', zIndex: 0 }}
              />
              
              {/* Timeline items */}
              <div className="flex justify-between w-full relative z-10 gap-4">
                {[
                  { label: 'Systems Point 1', completed: false },
                  { label: 'Systems Point 2', completed: false },
                  { label: 'Systems Point 3', completed: false },
                  { label: 'Systems Point 4', completed: false },
                  { label: 'Systems Point 5', completed: false },
                  { label: 'Systems Point 6', completed: false },
                  { label: 'Systems Point 7', completed: false },
                  { label: 'Systems Point 8', completed: false },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-shrink-0" style={{ minWidth: '80px', maxWidth: '100px' }}>
                    {/* Circle */}
                    <button
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors hover:opacity-70"
                      style={{
                        backgroundColor: item.completed ? '#163E64' : 'white',
                        borderColor: '#163E64',
                      }}
                    >
                      {item.completed && (
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'white' }} />
                      )}
                    </button>
                    {/* Label */}
                    <p 
                      className="text-xs text-center mt-2"
                      style={{ color: '#163E64' }}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
