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
              Climate Risk Management
            </h1>
            <p className="text-gray-600 text-lg">
              Assess and prepare for climate-related risks
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/dashboard/climate-risk/assessment"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4"
              style={{ borderColor: "#f59e0b" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#163E64" }}>
                Risk Assessment
              </h3>
              <p className="text-gray-600 mb-4">
                Identify and evaluate climate risks to your organization's operations and value chain.
              </p>
              <span className="text-sm font-semibold" style={{ color: "#f59e0b" }}>
                Get Started →
              </span>
            </Link>

            <Link
              href="/dashboard/climate-risk/adaptation"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4"
              style={{ borderColor: "#f59e0b" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#163E64" }}>
                Adaptation Planning
              </h3>
              <p className="text-gray-600 mb-4">
                Develop strategies to adapt to physical and transition risks.
              </p>
              <span className="text-sm font-semibold" style={{ color: "#f59e0b" }}>
                Get Started →
              </span>
            </Link>

            <Link
              href="/dashboard/climate-risk/vulnerability"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border-l-4"
              style={{ borderColor: "#f59e0b" }}
            >
              <h3 className="text-xl font-bold mb-2" style={{ color: "#163E64" }}>
                Vulnerability Analysis
              </h3>
              <p className="text-gray-600 mb-4">
                Analyze exposure to climate hazards across different scenarios and timeframes.
              </p>
              <span className="text-sm font-semibold" style={{ color: "#f59e0b" }}>
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
                The Climate Risk module helps you navigate uncertainty and make better decisions:
              </p>
              <ul className="list-disc list-outside space-y-2 ml-6 text-sm">
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
