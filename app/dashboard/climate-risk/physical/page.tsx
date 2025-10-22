"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Sidebar from "@/components/Sidebar"

interface RollData {
  [key: number]: number // dice value (2-12) -> count
}

export default function PhysicalRiskPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [regularRolls, setRegularRolls] = useState<RollData>({})
  const [loadedRolls, setLoadedRolls] = useState<RollData>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [completionAudio, setCompletionAudio] = useState<HTMLAudioElement | null>(null)
  const [rollAudio, setRollAudio] = useState<HTMLAudioElement | null>(null)
  const [confetti, setConfetti] = useState<Array<{id: number, color: string, delay: number, xOffset: number, angle: number, peakHeight: number, peakTime: number, finalRotateZ: number, finalRotateY: number}>>([])
  const [confettiOrigin, setConfettiOrigin] = useState<{x: number, y: number} | null>(null)

  const ACTIVITY_ID = "climate-risk-physical"

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/activities?activityId=${ACTIVITY_ID}`)
          if (response.ok) {
            const { isCompleted: savedCompleted, data: savedData } = await response.json()
            
            if (savedData) {
              if (savedData.regularRolls) setRegularRolls(savedData.regularRolls)
              if (savedData.loadedRolls) setLoadedRolls(savedData.loadedRolls)
            }
            
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

  // Preload audio
  useEffect(() => {
    const completeSound = new Audio('/nicey.mp3')
    completeSound.preload = 'auto'
    completeSound.volume = 1.0
    completeSound.load()
    setCompletionAudio(completeSound)

    const roll = new Audio('/sharp-pop.mp3')
    roll.preload = 'auto'
    roll.volume = 0.3
    roll.load()
    setRollAudio(roll)
  }, [])

  // Auto-save function
  const saveData = useCallback(async (completed: boolean = isCompleted) => {
    if (isSaving) return
    
    setIsSaving(true)
    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: ACTIVITY_ID,
          isCompleted: completed,
          data: {
            regularRolls,
            loadedRolls,
          },
        }),
      })
    } catch (error) {
      console.error("Failed to save activity data:", error)
    } finally {
      setIsSaving(false)
    }
  }, [regularRolls, loadedRolls, isCompleted, isSaving])

  // Auto-save when data changes
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        saveData()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [regularRolls, loadedRolls, isLoading, saveData])

  // Regular dice probability (standard two 6-sided dice)
  const rollRegularDice = () => {
    const die1 = Math.floor(Math.random() * 6) + 1
    const die2 = Math.floor(Math.random() * 6) + 1
    return die1 + die2
  }

  // Loaded dice - biased toward higher numbers
  const rollLoadedDice = () => {
    // Weighted dice: add +2 to one die 60% of the time
    const die1 = Math.floor(Math.random() * 6) + 1
    const die2 = Math.floor(Math.random() * 6) + 1
    const bonus = Math.random() < 0.6 ? 2 : 0
    return Math.min(die1 + die2 + bonus, 12) // Cap at 12
  }

  const handleRollRegular = (times: number) => {
    if (rollAudio) {
      rollAudio.currentTime = 0
      rollAudio.play().catch(err => console.log('Roll audio failed:', err))
    }

    const newRolls = { ...regularRolls }
    for (let i = 0; i < times; i++) {
      const result = rollRegularDice()
      newRolls[result] = (newRolls[result] || 0) + 1
    }
    setRegularRolls(newRolls)
  }

  const handleRollLoaded = (times: number) => {
    if (rollAudio) {
      rollAudio.currentTime = 0
      rollAudio.play().catch(err => console.log('Roll audio failed:', err))
    }

    const newRolls = { ...loadedRolls }
    for (let i = 0; i < times; i++) {
      const result = rollLoadedDice()
      newRolls[result] = (newRolls[result] || 0) + 1
    }
    setLoadedRolls(newRolls)
  }

  const handleReset = () => {
    setRegularRolls({})
    setLoadedRolls({})
  }

  const awardPoints = async () => {
    try {
      await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: 50 }),
      })
      window.dispatchEvent(new Event('scoreUpdated'))
    } catch (error) {
      console.error('Error awarding points:', error)
    }
  }

  const handleMarkComplete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const newCompletedState = !isCompleted
    setIsCompleted(newCompletedState)
    
    if (newCompletedState && completionAudio) {
      completionAudio.currentTime = 0
      completionAudio.play().catch(err => console.log('Completion audio play failed:', err))
      
      const button = e.currentTarget
      const rect = button.getBoundingClientRect()
      setConfettiOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top
      })
      
      const colors = ['#FF5B35', '#0B1F32', '#9CA3AF']
      const buttonWidth = rect.width * 1.5
      const newConfetti = Array.from({ length: 50 }, (_, i) => {
        const peakHeight = -(40 + Math.random() * 80)
        const peakTime = 0.4 + (Math.abs(peakHeight) / 120) * 0.6
        const baseAngle = -Math.PI / 2
        const angleVariation = (Math.random() - 0.5) * Math.PI * 1.2
        const angle = baseAngle + angleVariation
        
        return {
          id: Date.now() + i,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: 0,
          xOffset: (Math.random() - 0.5) * buttonWidth,
          angle,
          peakHeight,
          peakTime,
          finalRotateZ: 360 + Math.random() * 720,
          finalRotateY: 360 + Math.random() * 1080,
        }
      })
      setConfetti(newConfetti)
      
      const wasAlreadyCompleted = isCompleted
      if (!wasAlreadyCompleted) {
        setTimeout(() => {
          awardPoints()
        }, 1000)
      }
      
      setTimeout(() => {
        setConfetti([])
        setConfettiOrigin(null)
      }, 3000)
    }
    
    await saveData(newCompletedState)
  }

  // Calculate max count for scaling
  const regularMax = Math.max(...Object.values(regularRolls), 1)
  const loadedMax = Math.max(...Object.values(loadedRolls), 1)
  const globalMax = Math.max(regularMax, loadedMax, 20) // Minimum scale of 20

  // Get total counts
  const regularTotal = Object.values(regularRolls).reduce((sum, count) => sum + count, 0)
  const loadedTotal = Object.values(loadedRolls).reduce((sum, count) => sum + count, 0)

  // Calculate 1/100 year threshold (approximately 1% in the tail)
  // For regular dice, this is around roll 11-12 (extreme values)
  const extremeThreshold = 11

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
        <style jsx>{`
          @keyframes confettiBurst {
            0% {
              opacity: 1;
              transform: translate(0, -20px) rotateZ(0deg) rotateY(0deg);
            }
            20% {
              transform: translate(var(--tx-mid), var(--peak-y)) rotateZ(180deg) rotateY(360deg);
            }
            100% {
              opacity: 0;
              transform: translate(var(--tx), 500px) rotateZ(var(--final-rotate-z)) rotateY(var(--final-rotate-y));
            }
          }
          
          .confetti-piece {
            animation: confettiBurst 3s ease-in forwards;
          }
        `}</style>

        {/* Confetti Effect */}
        {confetti.length > 0 && confettiOrigin && confetti.map((piece) => {
          const distance = 100 + Math.random() * 150
          const tx = Math.cos(piece.angle) * distance + piece.xOffset
          const txMid = tx * 0.4
          
          return (
            <div
              key={piece.id}
              className="confetti-piece"
              style={{
                position: 'fixed',
                width: '10px',
                height: '10px',
                backgroundColor: piece.color,
                left: `${confettiOrigin.x + piece.xOffset}px`,
                top: `${confettiOrigin.y}px`,
                pointerEvents: 'none',
                zIndex: 9999,
                animationDuration: `${piece.peakTime * 2.5}s`,
                '--tx': `${tx}px`,
                '--tx-mid': `${txMid}px`,
                '--peak-y': `${piece.peakHeight}px`,
                '--final-rotate-z': `${piece.finalRotateZ}deg`,
                '--final-rotate-y': `${piece.finalRotateY}deg`,
              } as React.CSSProperties}
            />
          )
        })}

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
              Understanding Physical Risk Through Probability
            </h1>
            <div className="w-64" /> {/* Spacer for centering */}
          </div>
          
          {/* Subtitle */}
          <h2 className="text-base mb-4 text-center" style={{ color: '#0B1F32' }}>
            Roll the dice to see how climate change shifts risk distributions
          </h2>

          {/* Instructions */}
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#f5f5f5', borderColor: '#0B1F32' }}>
            <h3 className="font-semibold mb-2" style={{ color: '#0B1F32' }}>How This Works:</h3>
            <p className="text-sm mb-2" style={{ color: '#0B1F32' }}>
              Just like rolling dice creates a probability distribution, climate and weather follow statistical patterns. 
              The <strong>regular dice</strong> represent our current climate. The <strong>loaded dice</strong> represent 
              a warmer future climate where extreme events become more common.
            </p>
            <p className="text-sm" style={{ color: '#0B1F32' }}>
              Notice how the "1/100 year flood" threshold - an extreme event that rarely happens with regular dice - 
              becomes much more common when the dice are loaded (climate changes).
            </p>
          </div>

          {/* Control Panels */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Regular Dice */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#f5f5f5', borderColor: '#0B1F32' }}>
              <h3 className="font-semibold mb-3 text-center" style={{ color: '#0B1F32' }}>
                Regular Dice (Current Climate)
              </h3>
              <div className="flex gap-2 justify-center mb-2">
                <button
                  onClick={() => handleRollRegular(1)}
                  className="px-4 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#0B1F32', color: '#ffffff' }}
                >
                  Roll 1 Time
                </button>
                <button
                  onClick={() => handleRollRegular(100)}
                  className="px-4 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#0B1F32', color: '#ffffff' }}
                >
                  Roll 100 Times
                </button>
                <button
                  onClick={() => handleRollRegular(500)}
                  className="px-4 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#0B1F32', color: '#ffffff' }}
                >
                  Roll 500 Times
                </button>
              </div>
              <p className="text-xs text-center" style={{ color: '#6C757D' }}>
                Total rolls: {regularTotal}
              </p>
            </div>

            {/* Loaded Dice */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#f5f5f5', borderColor: '#0B1F32' }}>
              <h3 className="font-semibold mb-3 text-center" style={{ color: '#FF5B35' }}>
                Loaded Dice (Future Climate)
              </h3>
              <div className="flex gap-2 justify-center mb-2">
                <button
                  onClick={() => handleRollLoaded(1)}
                  className="px-4 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#FF5B35', color: '#ffffff' }}
                >
                  Roll 1 Time
                </button>
                <button
                  onClick={() => handleRollLoaded(100)}
                  className="px-4 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#FF5B35', color: '#ffffff' }}
                >
                  Roll 100 Times
                </button>
                <button
                  onClick={() => handleRollLoaded(500)}
                  className="px-4 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#FF5B35', color: '#ffffff' }}
                >
                  Roll 500 Times
                </button>
              </div>
              <p className="text-xs text-center" style={{ color: '#6C757D' }}>
                Total rolls: {loadedTotal}
              </p>
            </div>
          </div>

          {/* Distribution Visualizations */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Regular Dice Distribution */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#ffffff', borderColor: '#0B1F32' }}>
              <h4 className="font-semibold mb-3 text-center text-sm" style={{ color: '#0B1F32' }}>
                Current Climate Distribution
              </h4>
              <div className="h-64 flex items-end justify-around gap-1 px-2">
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) => {
                  const count = regularRolls[value] || 0
                  const percentage = regularTotal > 0 ? ((count / regularTotal) * 100).toFixed(1) : '0.0'
                  const heightPercent = (count / globalMax) * 100
                  const isExtreme = value >= extremeThreshold
                  
                  return (
                    <div key={value} className="flex-1 flex flex-col items-center justify-end">
                      <div className="text-xs mb-1" style={{ color: '#0B1F32', minHeight: '16px' }}>
                        {count > 0 ? `${percentage}%` : ''}
                      </div>
                      <div 
                        className="w-full flex flex-col justify-end items-center transition-all duration-300"
                        style={{ 
                          height: `${heightPercent}%`,
                          minHeight: count > 0 ? '20px' : '0px',
                          backgroundColor: isExtreme ? 'rgba(255, 91, 53, 0.3)' : '#0B1F32',
                          border: isExtreme ? '2px dashed #FF5B35' : 'none',
                        }}
                      >
                        <div className="text-xs font-bold" style={{ color: '#ffffff' }}>
                          {count > 0 ? count : ''}
                        </div>
                      </div>
                      <div className="text-xs mt-1 font-semibold" style={{ color: '#0B1F32' }}>
                        {value}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 text-xs text-center p-2 rounded" style={{ backgroundColor: 'rgba(255, 91, 53, 0.1)', color: '#0B1F32' }}>
                <strong style={{ color: '#FF5B35' }}>1/100 Year Flood Zone:</strong> Values 11-12 are rare extreme events (red shaded area)
              </div>
            </div>

            {/* Loaded Dice Distribution */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#ffffff', borderColor: '#FF5B35' }}>
              <h4 className="font-semibold mb-3 text-center text-sm" style={{ color: '#FF5B35' }}>
                Future Climate Distribution
              </h4>
              <div className="h-64 flex items-end justify-around gap-1 px-2">
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) => {
                  const count = loadedRolls[value] || 0
                  const percentage = loadedTotal > 0 ? ((count / loadedTotal) * 100).toFixed(1) : '0.0'
                  const heightPercent = (count / globalMax) * 100
                  const isExtreme = value >= extremeThreshold
                  
                  return (
                    <div key={value} className="flex-1 flex flex-col items-center justify-end">
                      <div className="text-xs mb-1" style={{ color: '#FF5B35', minHeight: '16px' }}>
                        {count > 0 ? `${percentage}%` : ''}
                      </div>
                      <div 
                        className="w-full flex flex-col justify-end items-center transition-all duration-300"
                        style={{ 
                          height: `${heightPercent}%`,
                          minHeight: count > 0 ? '20px' : '0px',
                          backgroundColor: isExtreme ? 'rgba(255, 0, 0, 0.5)' : '#FF5B35',
                          border: isExtreme ? '2px dashed #8B0000' : 'none',
                        }}
                      >
                        <div className="text-xs font-bold" style={{ color: '#ffffff' }}>
                          {count > 0 ? count : ''}
                        </div>
                      </div>
                      <div className="text-xs mt-1 font-semibold" style={{ color: '#FF5B35' }}>
                        {value}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 text-xs text-center p-2 rounded" style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', color: '#0B1F32' }}>
                <strong style={{ color: '#8B0000' }}>Same 1/100 Year Flood Zone:</strong> Now much more common! (dark red shaded area)
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#f5f5f5', borderColor: '#0B1F32' }}>
            <h3 className="font-semibold mb-2" style={{ color: '#0B1F32' }}>Key Insights:</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#0B1F32' }}>
              <li>• The distribution <strong>shifts to the right</strong> with loaded dice (future climate)</li>
              <li>• Events that were rare (11-12) become <strong>much more common</strong></li>
              <li>• The "1/100 year flood" isn't a 1/100 year event anymore - <strong>it happens more frequently</strong></li>
              <li>• This is exactly what's happening with climate change: <strong>extreme heat, floods, and storms are becoming more common</strong></li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center items-center">
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#6C757D', color: '#ffffff' }}
            >
              Reset All Rolls
            </button>
            
            <button
              onClick={handleMarkComplete}
              className="px-6 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#0B1F32', color: '#ffffff' }}
            >
              {isCompleted ? '✓ Activity Completed' : 'Mark this activity as complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
