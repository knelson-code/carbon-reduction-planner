"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import Link from "next/link"

export default function CO2ManagementPage() {
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
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-l-4" style={{ borderColor: "#10b981" }}>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#10b981" }}>
              CO₂ Management
            </h1>
            <p className="text-gray-600 text-lg">
              Track, measure, and reduce your carbon emissions
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/dashboard/co2-management/emissions"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4"
              style={{ borderColor: "#10b981" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#163E64" }}>
                Emissions Tracking
              </h3>
              <p className="text-gray-600 mb-4">
                Monitor and record your organization's carbon emissions across all sources.
              </p>
              <span className="text-sm font-semibold" style={{ color: "#10b981" }}>
                Get Started →
              </span>
            </Link>

            <Link
              href="/dashboard/co2-management/tactics"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4"
              style={{ borderColor: "#10b981" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#163E64" }}>
                Reduction Tactics
              </h3>
              <p className="text-gray-600 mb-4">
                Plan and implement specific actions to reduce emissions with timelines and costs.
              </p>
              <span className="text-sm font-semibold" style={{ color: "#10b981" }}>
                Get Started →
              </span>
            </Link>

            <Link
              href="/dashboard/co2-management/scopes"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4"
              style={{ borderColor: "#10b981" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#163E64" }}>
                Scope 1/2/3
              </h3>
              <p className="text-gray-600 mb-4">
                Organize emissions by direct, indirect energy, and value chain categories.
              </p>
              <span className="text-sm font-semibold" style={{ color: "#10b981" }}>
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
                The CO₂ Management module helps you understand, track, and reduce your organization's carbon footprint. 
                This comprehensive tool covers all aspects of emissions management:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Scope 1:</strong> Direct emissions from owned or controlled sources</li>
                <li><strong>Scope 2:</strong> Indirect emissions from purchased electricity, steam, heating, and cooling</li>
                <li><strong>Scope 3:</strong> All other indirect emissions in your value chain</li>
              </ul>
              <p>
                Plan specific reduction tactics with detailed timelines, cost projections, and expected impact. 
                Track progress over time and adjust your strategy as needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
