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
              Transition Strategy
            </h1>
            <p className="text-gray-600 text-lg">
              Chart your path to net-zero emissions
            </p>
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
                The Transition Strategy module helps you navigate your role in a changing world:
              </p>
              <ul className="list-disc list-outside space-y-2 ml-6 text-sm">
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
