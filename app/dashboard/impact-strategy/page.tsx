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
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-l-4" style={{ borderColor: "#8b5cf6" }}>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#8b5cf6" }}>
              Aiming for Systemic Impact
            </h1>
            <p className="text-gray-600 text-lg">
              Focus on changes that transform systems
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/dashboard/impact-strategy/assessment"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4"
              style={{ borderColor: "#8b5cf6" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#163E64" }}>
                Impact Assessment
              </h3>
              <p className="text-gray-600 mb-4">
                Quantify the real-world outcomes of your climate actions and investments.
              </p>
              <span className="text-sm font-semibold" style={{ color: "#8b5cf6" }}>
                Get Started →
              </span>
            </Link>

            <Link
              href="/dashboard/impact-strategy/stakeholders"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4"
              style={{ borderColor: "#8b5cf6" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#163E64" }}>
                Stakeholder Engagement
              </h3>
              <p className="text-gray-600 mb-4">
                Build support and collaboration across employees, customers, investors, and communities.
              </p>
              <span className="text-sm font-semibold" style={{ color: "#8b5cf6" }}>
                Get Started →
              </span>
            </Link>

            <Link
              href="/dashboard/impact-strategy/reporting"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4"
              style={{ borderColor: "#8b5cf6" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#163E64" }}>
                Reporting
              </h3>
              <p className="text-gray-600 mb-4">
                Create compelling reports and communications that demonstrate your climate leadership.
              </p>
              <span className="text-sm font-semibold" style={{ color: "#8b5cf6" }}>
                Get Started →
              </span>
            </Link>
          </div>

          {/* Overview Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#163E64" }}>
              Module Overview
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                The Aiming for Systemic Impact module helps you focus your efforts on changes that transform systems, 
                not just make incremental improvements:
              </p>
              <ul className="list-disc list-outside space-y-2 ml-6 text-sm">
                <li>Build a clear vision of the specific change you are trying to produce</li>
                <li>Identify sensitive intervention points in the political and economic system where you can have disproportionate impact</li>
                <li>Define the actions that are most likely to produce that impact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
