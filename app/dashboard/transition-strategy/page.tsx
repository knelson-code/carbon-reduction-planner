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
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl" style={{ backgroundColor: "#dbeafe" }}>
                🚀
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: "#3b82f6" }}>
                  Transition Strategy
                </h1>
                <p className="text-gray-600 text-lg">
                  Chart your path to net-zero emissions
                </p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/dashboard/transition-strategy/pathways"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4"
              style={{ borderColor: "#3b82f6" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#163E64" }}>
                Pathway Planning
              </h3>
              <p className="text-gray-600 mb-4">
                Design long-term decarbonization pathways aligned with climate science and business goals.
              </p>
              <span className="text-sm font-semibold" style={{ color: "#3b82f6" }}>
                Get Started →
              </span>
            </Link>

            <Link
              href="/dashboard/transition-strategy/targets"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4"
              style={{ borderColor: "#3b82f6" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#163E64" }}>
                Target Setting
              </h3>
              <p className="text-gray-600 mb-4">
                Set ambitious, science-based targets that drive meaningful change.
              </p>
              <span className="text-sm font-semibold" style={{ color: "#3b82f6" }}>
                Get Started →
              </span>
            </Link>

            <Link
              href="/dashboard/transition-strategy/progress"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4"
              style={{ borderColor: "#3b82f6" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#163E64" }}>
                Progress Tracking
              </h3>
              <p className="text-gray-600 mb-4">
                Monitor progress against targets and adjust strategy as you learn.
              </p>
              <span className="text-sm font-semibold" style={{ color: "#3b82f6" }}>
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
                The Transition Strategy module helps you develop a comprehensive roadmap for decarbonization. 
                This is where short-term actions meet long-term vision:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Science-Based Targets:</strong> Set goals aligned with climate science (1.5°C or 2°C pathways)</li>
                <li><strong>Decarbonization Pathways:</strong> Map out how you'll achieve net-zero emissions over time</li>
                <li><strong>Technology Roadmap:</strong> Identify and plan for emerging low-carbon technologies</li>
                <li><strong>Investment Planning:</strong> Prioritize capital allocation for maximum climate impact</li>
                <li><strong>Stakeholder Alignment:</strong> Ensure strategy is integrated across the organization</li>
              </ul>
              <p>
                Your transition strategy should be ambitious yet achievable, grounded in your CO₂ Management data, 
                informed by your Climate Risk analysis, and measured through Impact Strategy metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
