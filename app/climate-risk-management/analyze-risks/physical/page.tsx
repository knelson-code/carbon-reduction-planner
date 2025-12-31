"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Sidebar from "@/components/Sidebar"

export default function PhysicalRiskPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const ACTIVITY_ID = "climate-risk-physical"

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Load saved completion status
  useEffect(() => {
    const loadData = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/activities?activityId=${ACTIVITY_ID}`)
          if (response.ok) {
            const { isCompleted: savedCompleted } = await response.json()
            setIsCompleted(savedCompleted)
          }
        } catch (error) {
          console.error("Failed to load activity data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadData()
  }, [status])

  const handleMarkComplete = async () => {
    const newCompletedState = !isCompleted
    setIsCompleted(newCompletedState)
    
    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: ACTIVITY_ID,
          isCompleted: newCompletedState,
        }),
      })

      if (newCompletedState) {
        // Award 50 points
        await fetch('/api/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ points: 50 }),
        })

        window.dispatchEvent(new Event('scoreUpdated'))

        // Play completion sound
        const audio = new Audio('/completion-sound.mp3')
        audio.volume = 0.24
        audio.play().catch(err => console.log('Audio play failed:', err))
      }
    } catch (error) {
      console.error("Failed to save:", error)
    }
  }

  if (status === "loading" || isLoading) {
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
      
      <div className="flex-1 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {/* Title with Back link */}
          <div className="flex items-center justify-between mb-1">
            <Link 
              href="/dashboard/climate-risk"
              className="text-sm font-light hover:opacity-80 transition-opacity"
              style={{ color: '#FF5B35' }}
            >
              ← Back to Climate and Risk Overview
            </Link>
            <h1 className="text-2xl font-bold flex-1 text-center" style={{ color: '#0B1F32' }}>
              Understanding Climate and Probabilities
            </h1>
            <Link 
              href="/dashboard/climate-risk"
              className="text-sm font-light hover:opacity-80 transition-opacity"
              style={{ color: '#FF5B35' }}
            >
              Continue to next activity in this section →
            </Link>
          </div>
          
          {/* Subtitle */}
          <h2 className="text-base mb-4 text-center" style={{ color: '#0B1F32' }}>
            Learn about how climate change shifts probability distributions
          </h2>

          {/* Main Content Area */}
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center" style={{ color: '#0B1F32' }}>
              <p className="text-lg mb-8">Content coming soon...</p>
              
              {/* Mark as Complete Button */}
              <button
                onClick={handleMarkComplete}
                className="px-6 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: '#0B1F32',
                  color: '#ffffff',
                }}
              >
                {isCompleted ? '✓ Activity Completed' : 'Mark this activity as complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
