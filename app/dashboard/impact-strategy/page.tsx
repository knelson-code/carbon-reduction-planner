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
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl" style={{ backgroundColor: "#ede9fe" }}>
                💡
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: "#8b5cf6" }}>
                  Impact Strategy
                </h1>
                <p className="text-gray-600 text-lg">
                  Measure and communicate your climate impact
                </p>
              </div>
            </div>
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
                The Impact Strategy module focuses on measuring, communicating, and maximizing the positive outcomes 
                of your climate work. Beyond just reducing emissions, this is about creating value:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Outcome Measurement:</strong> Track real-world environmental, social, and economic impacts</li>
                <li><strong>Stakeholder Value:</strong> Demonstrate how climate action creates value for all stakeholders</li>
                <li><strong>Strategic Communication:</strong> Tell your climate story effectively to different audiences</li>
                <li><strong>Transparency & Trust:</strong> Build credibility through honest, data-driven reporting</li>
                <li><strong>Continuous Improvement:</strong> Learn from impact data to refine strategy over time</li>
              </ul>
              <p>
                This module integrates data from CO₂ Management, Climate Risk, and Transition Strategy to create 
                a comprehensive view of your climate performance and positioning. Use these insights to drive 
                internal culture change, attract investment, and build customer loyalty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
