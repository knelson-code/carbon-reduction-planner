"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import Sidebar from "@/components/Sidebar"

interface ModuleCard {
  title: string
  description: string
  icon: string
  href: string
  color: string
  bgColor: string
}

const modules: ModuleCard[] = [
  {
    title: "CO₂ Management",
    description: "Track emissions, manage Scope 1/2/3 categories, and plan reduction tactics with timelines and costs.",
    icon: "🌱",
    href: "/dashboard/co2-management",
    color: "#10b981",
    bgColor: "#d1fae5",
  },
  {
    title: "Climate Risk Management",
    description: "Assess climate-related risks, plan adaptation strategies, and analyze vulnerabilities.",
    icon: "⚠️",
    href: "/dashboard/climate-risk",
    color: "#f59e0b",
    bgColor: "#fef3c7",
  },
  {
    title: "Transition Strategy",
    description: "Design decarbonization pathways, set science-based targets, and track progress toward net-zero.",
    icon: "🚀",
    href: "/dashboard/transition-strategy",
    color: "#3b82f6",
    bgColor: "#dbeafe",
  },
  {
    title: "Impact Strategy",
    description: "Measure impact, engage stakeholders, and report on climate action outcomes.",
    icon: "💡",
    href: "/dashboard/impact-strategy",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
  },
]

export default function DashboardPage() {
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
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#163E64" }}>
              Welcome, {session.user?.name || session.user?.email}!
            </h1>
            <p className="text-gray-600 text-lg">
              Your Climate Management Platform
            </p>
          </div>

          {/* Module Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#163E64" }}>
              Select a Module
            </h2>
            <p className="text-gray-600 mb-6">
              Choose from our integrated climate management modules to begin working on your climate strategy.
            </p>
          </div>

          {/* Module Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4"
                style={{ borderColor: module.color }}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
                        style={{ backgroundColor: module.bgColor }}
                      >
                        {module.icon}
                      </div>
                      <h3
                        className="text-2xl font-bold group-hover:opacity-80 transition-opacity"
                        style={{ color: module.color }}
                      >
                        {module.title}
                      </h3>
                    </div>
                    <svg
                      className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Info Section */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6 border-l-4" style={{ borderColor: "#163E64" }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: "#163E64" }}>
              📊 Integrated Platform
            </h3>
            <p className="text-gray-700">
              All modules share data and insights. Your work in one module automatically informs and supports the others, 
              creating a comprehensive climate management system.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
