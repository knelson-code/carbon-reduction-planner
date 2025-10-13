"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import Link from "next/link"

export default function TransitionStrategyPage() {
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
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-l-4" style={{ borderColor: "#3b82f6" }}>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#3b82f6" }}>
              Energy Transition Strategy
            </h1>
            <p className="text-gray-600 text-lg">
              Navigate your role in accelerating the energy transition
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/dashboard/transition-strategy/role"
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
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 91, 53, 0.25)'
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: '#163E64' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#163E64'}
              >
                Understand your role
              </h3>
            </Link>

            <Link
              href="/dashboard/transition-strategy/speed"
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
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 91, 53, 0.25)'
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: '#163E64' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#163E64'}
              >
                Speed up the energy transition
              </h3>
            </Link>

            <Link
              href="/dashboard/transition-strategy/decide"
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
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 91, 53, 0.25)'
              }}
            >
              <h3 className="text-xl font-bold mb-3" style={{ color: '#163E64' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#163E64'}
              >
                Decide what you're willing to do
              </h3>
            </Link>
          </div>

          {/* Overview Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#163E64" }}>
              Module Overview
            </h2>
            <div className="text-gray-700">
              <ul className="list-disc list-outside space-y-2 ml-6 text-xs leading-relaxed">
                <li>Understand your role in a world affected by climate change</li>
                <li>Determine what you can do to speed up the energy transition</li>
                <li>Decide what you are willing to do</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
