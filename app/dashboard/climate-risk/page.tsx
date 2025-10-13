"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import Link from "next/link"

export default function ClimateRiskPage() {
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
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-l-4" style={{ borderColor: "#f59e0b" }}>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#f59e0b" }}>
              Understanding Climate Risk
            </h1>
            <p className="text-gray-600 text-lg">
              Navigate uncertainty and make better decisions
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/dashboard/climate-risk/identify"
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
                Identify and understand risks
              </h3>
            </Link>

            <Link
              href="/dashboard/climate-risk/decisions"
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
                Improve decision-making under uncertainty
              </h3>
            </Link>

            <Link
              href="/dashboard/climate-risk/integrate"
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
                Incorporate insights into processes
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
                <li>Identify and understand risks</li>
                <li>Improve your ability to make decisions, even in the face of uncertainty</li>
                <li>Incorporate these insights into your processes in a simple and clear way</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
