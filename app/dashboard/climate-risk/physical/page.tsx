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
  const [regularRollCount, setRegularRollCount] = useState(0)
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
              if (savedData.regularRollCount) setRegularRollCount(savedData.regularRollCount)
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
            regularRollCount,
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
  }, [regularRolls, loadedRolls, regularRollCount, isLoading, saveData])

  // Regular dice probability (standard two 6-sided dice)
  const rollRegularDice = () => {
    const die1 = Math.floor(Math.random() * 6) + 1
    const die2 = Math.floor(Math.random() * 6) + 1
    return die1 + die2
  }

  // Loaded dice - faces are 2,3,4,5,6,7 instead of 1,2,3,4,5,6
  const rollLoadedDice = () => {
    const die1 = Math.floor(Math.random() * 6) + 2 // 2-7
    const die2 = Math.floor(Math.random() * 6) + 2 // 2-7
    return die1 + die2 // Range: 4-14
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
    setRegularRollCount(regularRollCount + times)
  }

  const handleRollClimate = () => {
    if (regularRollCount === 0) return
    
    if (rollAudio) {
      rollAudio.currentTime = 0
      rollAudio.play().catch(err => console.log('Roll audio failed:', err))
    }

    // Roll climate dice to match regular dice count exactly
    const newRolls: RollData = {}
    for (let i = 0; i < regularRollCount; i++) {
      const result = rollLoadedDice()
      newRolls[result] = (newRolls[result] || 0) + 1
    }
    setLoadedRolls(newRolls)
  }

  const handleReset = () => {
    setRegularRolls({})
    setLoadedRolls({})
    setRegularRollCount(0)
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
              Understanding Climate and Probabilities
            </h1>
            <div className="w-64" /> {/* Spacer for centering */}
          </div>
          
          {/* Subtitle */}
          <h2 className="text-sm mb-2 text-center" style={{ color: '#0B1F32' }}>
            Roll the dice to see how climate change shifts risk distributions
          </h2>

          {/* Instructions */}
          <div className="mb-2 p-2 rounded-lg border" style={{ backgroundColor: '#f5f5f5', borderColor: '#0B1F32' }}>
            <p className="text-xs" style={{ color: '#0B1F32' }}>
              <strong>How it works:</strong> Roll the regular dice (current climate), then click to roll the climate dice the same number of times. 
              Notice how extreme events (11-12) become much more common with climate change.
            </p>
          </div>

          {/* Control Panel */}
          <div className="mb-2 p-2 rounded-lg border" style={{ backgroundColor: '#f5f5f5', borderColor: '#0B1F32' }}>
            <div className="flex gap-2 justify-center items-center flex-wrap">
              <button
                onClick={() => handleRollRegular(1)}
                className="px-3 py-1.5 rounded text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#0B1F32', color: '#ffffff' }}
              >
                Roll 1×
              </button>
              <button
                onClick={() => handleRollRegular(100)}
                className="px-3 py-1.5 rounded text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#0B1F32', color: '#ffffff' }}
              >
                Roll 100×
              </button>
              <button
                onClick={() => handleRollRegular(500)}
                className="px-3 py-1.5 rounded text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#0B1F32', color: '#ffffff' }}
              >
                Roll 500×
              </button>
              
              <div className="w-px h-8 bg-gray-300"></div>
              
              <button
                onClick={handleRollClimate}
                disabled={regularRollCount === 0}
                className="px-4 py-1.5 rounded text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: '#FF5B35', color: '#ffffff' }}
              >
                Now roll the climate dice the same number of times
              </button>
              
              <div className="w-px h-8 bg-gray-300"></div>
              
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#6C757D', color: '#ffffff' }}
              >
                Reset
              </button>
            </div>
            <div className="flex gap-8 justify-center mt-1 text-[10px]" style={{ color: '#6C757D' }}>
              <span>Regular: {regularTotal} rolls</span>
              <span>Climate: {loadedTotal} rolls</span>
            </div>
          </div>

          {/* Distribution Visualization */}
          <div className="mb-2">
            <div className="p-3 rounded-lg border" style={{ backgroundColor: '#ffffff', borderColor: '#0B1F32' }}>
              <h4 className="font-semibold mb-1 text-center text-xs" style={{ color: '#0B1F32' }}>
                Probability Distribution Comparison
              </h4>
              <div className="flex gap-4 justify-center mb-1 text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0B1F32' }}></div>
                  <span style={{ color: '#0B1F32' }}>Current Climate ({regularTotal} rolls)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FF5B35' }}></div>
                  <span style={{ color: '#FF5B35' }}>Future Climate ({loadedTotal} rolls)</span>
                </div>
              </div>
              <div className="relative h-48 flex items-end justify-around gap-1 px-4">
                {/* SVG overlay for smooth curves */}
                <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                  {/* Regular dice curve (blue) */}
                  {regularTotal > 0 && (() => {
                    const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
                    const numValues = values.length
                    const chartHeight = 170
                    const padding = 20
                    const leftPadding = 4 // px-4 on container
                    const rightPadding = 4
                    
                    const points = values.map((value, index) => {
                      const count = regularRolls[value] || 0
                      const height = globalMax > 0 ? (count / globalMax) * chartHeight : 0
                      // Calculate x position: left padding + (index / numValues) * content width + offset for left bar center
                      const xPercent = (leftPadding/100 + (index / numValues) * (1 - (leftPadding + rightPadding)/100) + (0.25/numValues) * (1 - (leftPadding + rightPadding)/100)) * 100
                      const yPercent = ((192 - padding - height) / 192) * 100
                      return `${xPercent},${yPercent}`
                    }).join(' ')
                    
                    return (
                      <polyline
                        points={points}
                        fill="none"
                        stroke="#0B1F32"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />
                    )
                  })()}
                  
                  {/* Loaded dice curve (orange) */}
                  {loadedTotal > 0 && (() => {
                    const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
                    const numValues = values.length
                    const chartHeight = 170
                    const padding = 20
                    const leftPadding = 4
                    const rightPadding = 4
                    
                    const points = values.map((value, index) => {
                      const count = loadedRolls[value] || 0
                      const height = globalMax > 0 ? (count / globalMax) * chartHeight : 0
                      // Calculate x position: left padding + (index / numValues) * content width + offset for right bar center
                      const xPercent = (leftPadding/100 + (index / numValues) * (1 - (leftPadding + rightPadding)/100) + (0.75/numValues) * (1 - (leftPadding + rightPadding)/100)) * 100
                      const yPercent = ((192 - padding - height) / 192) * 100
                      return `${xPercent},${yPercent}`
                    }).join(' ')
                    
                    return (
                      <polyline
                        points={points}
                        fill="none"
                        stroke="#FF5B35"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />
                    )
                  })()}
                </svg>
                
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((value) => {
                  const regularCount = regularRolls[value] || 0
                  const loadedCount = loadedRolls[value] || 0
                  const isExtreme = value >= extremeThreshold
                  
                  // Calculate bar heights (as pixels for better control)
                  const maxHeight = 170 // pixels (h-48 = 192px, leave room for labels)
                  const regularHeight = globalMax > 0 ? (regularCount / globalMax) * maxHeight : 0
                  const loadedHeight = globalMax > 0 ? (loadedCount / globalMax) * maxHeight : 0
                  
                  return (
                    <div key={value} className="flex-1 flex flex-col items-center justify-end" style={{ minWidth: '30px' }}>
                      {/* Transparent bars with top border line and percentages */}
                      <div className="w-full flex gap-0.5 items-end justify-center" style={{ height: '170px' }}>
                        {/* Regular dice bar (left, blue) */}
                        <div 
                          className="transition-all duration-300 flex-1 relative"
                          style={{ 
                            height: `${regularHeight}px`,
                            minHeight: regularCount > 0 ? '3px' : '0px',
                            backgroundColor: isExtreme ? 'rgba(11, 31, 50, 0.08)' : 'rgba(11, 31, 50, 0.15)',
                            borderRadius: '2px 2px 0 0',
                          }}
                        >
                          {regularCount > 0 && (
                            <>
                              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#0B1F32' }}></div>
                              {regularTotal > 0 && regularHeight > 15 && (
                                <div className="absolute bottom-1 left-0 right-0 text-center text-[8px] font-bold" style={{ color: '#0B1F32' }}>
                                  {Math.round((regularCount / regularTotal) * 100)}%
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        
                        {/* Loaded dice bar (right, orange) */}
                        <div 
                          className="transition-all duration-300 flex-1 relative"
                          style={{ 
                            height: `${loadedHeight}px`,
                            minHeight: loadedCount > 0 ? '3px' : '0px',
                            backgroundColor: isExtreme ? 'rgba(255, 91, 53, 0.08)' : 'rgba(255, 91, 53, 0.15)',
                            borderRadius: '2px 2px 0 0',
                          }}
                        >
                          {loadedCount > 0 && (
                            <>
                              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#FF5B35' }}></div>
                              {loadedTotal > 0 && loadedHeight > 15 && (
                                <div className="absolute bottom-1 left-0 right-0 text-center text-[8px] font-bold" style={{ color: '#FF5B35' }}>
                                  {Math.round((loadedCount / loadedTotal) * 100)}%
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* X-axis label */}
                      <div className="text-[10px] mt-1 font-semibold" style={{ color: '#0B1F32' }}>
                        {value}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-2 pt-1 border-t" style={{ borderColor: '#f5f5f5' }}>
                <div className="text-[10px] text-center p-1 rounded" style={{ backgroundColor: 'rgba(255, 91, 53, 0.1)', color: '#0B1F32' }}>
                  <strong style={{ color: '#FF5B35' }}>1/100 Year Flood Zone (11-12):</strong> Notice this rare event becomes much more common
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mt-2">
            <button
              onClick={handleMarkComplete}
              className="px-4 py-1.5 rounded text-xs font-semibold transition-opacity hover:opacity-90"
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
