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
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: "#163E64" }}>
              Climate Risk
            </h1>
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
                Improve your ability to make decisions, even in the face of uncertainty
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
                Incorporate these insights into your processes in a simple and clear way
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
