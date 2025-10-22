"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Sidebar from "@/components/Sidebar"

interface DraggableItem {
  id: string
  text: string
  category: 'transition' | 'legal' | 'physical' | 'systemic'
  type: 'example' | 'response'
}

interface SlotAssignment {
  [slotId: string]: string | null
}

export default function CategorizationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [slotAssignments, setSlotAssignments] = useState<SlotAssignment>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [completionAudio, setCompletionAudio] = useState<HTMLAudioElement | null>(null)
  const [popAudio, setPopAudio] = useState<HTMLAudioElement | null>(null)
  const [errorAudio, setErrorAudio] = useState<HTMLAudioElement | null>(null)
  const [particles, setParticles] = useState<Array<{id: number, angle: number, distance: number, x: number, y: number}>>([])
  const [confetti, setConfetti] = useState<Array<{id: number, color: string, xOffset: number, angle: number, peakHeight: number, peakTime: number, finalRotateZ: number, finalRotateY: number}>>([])
  const [confettiOrigin, setConfettiOrigin] = useState<{x: number, y: number} | null>(null)
  const [showTryAgain, setShowTryAgain] = useState(false)
  const [buttonShake, setButtonShake] = useState(false)

  const ACTIVITY_ID = "climate-risk-categorization"

  const riskItems: DraggableItem[] = [
    { id: 'r1', text: 'Carbon pricing', category: 'transition', type: 'example' },
    { id: 'r2', text: 'Slow adoption of green technology', category: 'transition', type: 'example' },
    { id: 'r3', text: 'New reporting mandates', category: 'legal', type: 'example' },
    { id: 'r4', text: 'Scope 3 requirements', category: 'legal', type: 'example' },
    { id: 'r5', text: 'Heat affecting employees', category: 'physical', type: 'example' },
    { id: 'r6', text: 'Heat damage to equipment', category: 'physical', type: 'example' },
    { id: 'r7', text: 'Widespread financial instability', category: 'systemic', type: 'example' },
    { id: 'r8', text: 'Public sector customers become insolvent', category: 'systemic', type: 'example' }
  ]

  const responseItems: DraggableItem[] = [
    { id: 'res1', text: 'Create detailed transition strategy', category: 'transition', type: 'response' },
    { id: 'res2', text: 'Prepare proactively for compliance', category: 'legal', type: 'response' },
    { id: 'res3', text: 'Develop mitigation plan', category: 'physical', type: 'response' },
    { id: 'res4', text: 'Learn to manage uncertainty', category: 'systemic', type: 'response' }
  ]

  const allItems = [...riskItems, ...responseItems]

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    const loadData = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/activities?activityId=${ACTIVITY_ID}`)
          if (response.ok) {
            const { isCompleted: savedCompleted, data: savedData } = await response.json()
            if (savedData?.slotAssignments) {
              setSlotAssignments(savedData.slotAssignments)
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

  useEffect(() => {
    const completeSound = new Audio('/nicey.mp3')
    completeSound.preload = 'auto'
    completeSound.volume = 1.0
    completeSound.load()
    setCompletionAudio(completeSound)

    const pop = new Audio('/sharp-pop.mp3')
    pop.preload = 'auto'
    pop.volume = 0.56
    pop.load()
    setPopAudio(pop)

    const error = new Audio('/error-sound.mp3')
    error.preload = 'auto'
    error.volume = 0.6
    error.load()
    setErrorAudio(error)
  }, [])

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
          data: { slotAssignments },
        }),
      })
    } catch (error) {
      console.error("Failed to save activity data:", error)
    } finally {
      setIsSaving(false)
    }
  }, [slotAssignments, isCompleted, isSaving])

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => saveData(), 1000)
      return () => clearTimeout(timer)
    }
  }, [slotAssignments, isLoading, saveData])

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItemId(itemId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, slotId: string, expectedCategory: string, expectedType: string) => {
    e.preventDefault()
    if (!draggedItemId) return

    const item = allItems.find(i => i.id === draggedItemId)
    if (!item) return

    if (item.category === expectedCategory && item.type === expectedType) {
      if (popAudio) {
        popAudio.currentTime = 0
        popAudio.play().catch(err => console.log('Pop audio failed:', err))
      }

      // Particle burst effect
      const rect = e.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        angle: Math.random() * Math.PI * 2,
        distance: 20 + Math.random() * 30,
        x: centerX,
        y: centerY,
      }))
      setParticles(newParticles)
      
      setTimeout(() => setParticles([]), 600)

      setSlotAssignments(prev => ({ ...prev, [slotId]: draggedItemId }))
    }
    setDraggedItemId(null)
  }

  const checkIfAllCorrect = () => {
    // Check if all 12 slots are filled correctly
    const totalSlots = 12
    const filledSlots = Object.values(slotAssignments).filter(v => v !== null).length
    
    if (filledSlots !== totalSlots) return false
    
    // Verify each placement is correct
    for (const [slotId, itemId] of Object.entries(slotAssignments)) {
      if (!itemId) return false
      
      const item = allItems.find(i => i.id === itemId)
      if (!item) return false
      
      // Extract category and type from slot ID
      const [category, type] = slotId.split('-').slice(0, 2)
      const slotType = type === 'ex' ? 'example' : 'response'
      
      // Check if item matches slot
      if (item.category !== category || item.type !== slotType) {
        return false
      }
    }
    
    return true
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
    // If already completed, allow uncompleting
    if (isCompleted) {
      setIsCompleted(false)
      await saveData(false)
      return
    }
    
    // Check if all answers are correct
    const allCorrect = checkIfAllCorrect()
    
    if (allCorrect) {
      // Correct! Celebrate
      setIsCompleted(true)
      
      if (completionAudio) {
        completionAudio.currentTime = 0
        completionAudio.play().catch(err => console.log('Completion audio failed:', err))
      }
      
      const button = e.currentTarget
      const rect = button.getBoundingClientRect()
      setConfettiOrigin({ x: rect.left + rect.width / 2, y: rect.top })
      
      const colors = ['#FF5B35', '#0B1F32', '#9CA3AF']
      const newConfetti = Array.from({ length: 50 }, (_, i) => {
        const peakHeight = -(40 + Math.random() * 80)
        const peakTime = 0.4 + (Math.abs(peakHeight) / 120) * 0.6
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2
        
        return {
          id: Date.now() + i,
          color: colors[Math.floor(Math.random() * colors.length)],
          xOffset: (Math.random() - 0.5) * rect.width * 1.5,
          angle,
          peakHeight,
          peakTime,
          finalRotateZ: 360 + Math.random() * 720,
          finalRotateY: 360 + Math.random() * 1080,
        }
      })
      setConfetti(newConfetti)
      
      setTimeout(() => awardPoints(), 1000)
      
      setTimeout(() => {
        setConfetti([])
        setConfettiOrigin(null)
      }, 3000)
      
      await saveData(true)
    } else {
      // Incorrect - play error sound and shake button
      if (errorAudio) {
        errorAudio.currentTime = 0
        errorAudio.play().catch(err => console.log('Error audio failed:', err))
      }
      
      setButtonShake(true)
      setShowTryAgain(true)
      
      setTimeout(() => {
        setButtonShake(false)
      }, 500)
      
      setTimeout(() => {
        setShowTryAgain(false)
      }, 2000)
    }
  }

  const isItemPlaced = (itemId: string) => {
    return Object.values(slotAssignments).includes(itemId)
  }

  const getItemInSlot = (slotId: string) => {
    const itemId = slotAssignments[slotId]
    return itemId ? allItems.find(item => item.id === itemId) : null
  }

  const handleReset = () => {
    setSlotAssignments({})
    setIsCompleted(false)
    saveData(false)
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!session) return null

  const placedCount = Object.values(slotAssignments).filter(v => v !== null).length

  const categoryColors = {
    transition: '#0B1F32',
    legal: '#FF5B35',
    physical: '#6C757D',
    systemic: '#0B1F32'
  }

  return (
    <div className="flex min-h-[calc(100vh-92px)]">
      <Sidebar />
      
      <div className="flex-1 bg-white relative">
        <style jsx>{`
          @keyframes particleBurst {
            0% {
              opacity: 1;
              transform: translate(0, 0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(var(--tx), var(--ty)) scale(0);
            }
          }
          
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
              transform: translate(var(--tx), 600px) rotateZ(var(--final-rotate-z)) rotateY(var(--final-rotate-y));
            }
          }
          
          .particle {
            animation: particleBurst 0.6s ease-out forwards;
          }
          
          .confetti-piece {
            animation: confettiBurst 3.5s ease-in forwards;
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          .shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>

        {/* Particles */}
        {particles.map((particle) => {
          const tx = Math.cos(particle.angle) * particle.distance
          const ty = Math.sin(particle.angle) * particle.distance
          return (
            <div
              key={particle.id}
              className="particle"
              style={{
                position: 'fixed',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                backgroundColor: '#FF5B35',
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                pointerEvents: 'none',
                zIndex: 9999,
                '--tx': `${tx}px`,
                '--ty': `${ty}px`,
              } as React.CSSProperties}
            />
          )
        })}

        {/* Confetti */}
        {confetti.length > 0 && confettiOrigin && confetti.map((piece) => {
          const distance = 150 + Math.random() * 200
          const tx = Math.cos(piece.angle) * distance + piece.xOffset
          const txMid = tx * 0.5
          
          return (
            <div
              key={piece.id}
              className="confetti-piece"
              style={{
                position: 'fixed',
                width: '12px',
                height: '12px',
                backgroundColor: piece.color,
                left: `${confettiOrigin.x + piece.xOffset}px`,
                top: `${confettiOrigin.y}px`,
                pointerEvents: 'none',
                zIndex: 9999,
                animationDuration: `${piece.peakTime * 3}s`,
                '--tx': `${tx}px`,
                '--tx-mid': `${txMid}px`,
                '--peak-y': `${piece.peakHeight}px`,
                '--final-rotate-z': `${piece.finalRotateZ}deg`,
                '--final-rotate-y': `${piece.finalRotateY}deg`,
              } as React.CSSProperties}
            />
          )
        })}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <Link 
              href="/dashboard/climate-risk"
              className="text-sm font-light hover:opacity-80 transition-opacity"
              style={{ color: '#FF5B35' }}
            >
              ← Back to Climate and Risk Overview
            </Link>
            <h1 className="text-2xl font-bold flex-1 text-center" style={{ color: '#0B1F32' }}>
              Climate Risk Categorization Exercise
            </h1>
            <div className="w-64" />
          </div>
          
          <h2 className="text-sm mb-2 text-center" style={{ color: '#0B1F32' }}>
            Drag examples and responses to their correct risk categories
          </h2>

          <div className="mb-2 text-center">
            <span className="text-xs" style={{ color: '#6C757D' }}>
              Progress: {placedCount} / 12 items placed
            </span>
          </div>

          {/* Main Game Area */}
          <div className="flex gap-3 mb-3">
            {/* Categories Panel */}
            <div className="flex-1 grid grid-cols-4 gap-2">
              {[
                { key: 'transition', label: 'Transition Risk', color: categoryColors.transition },
                { key: 'legal', label: 'Legal & Reputational Risk', color: categoryColors.legal },
                { key: 'physical', label: 'Physical Risk', color: categoryColors.physical },
                { key: 'systemic', label: 'Systemic Risk', color: categoryColors.systemic }
              ].map(({ key, label, color }) => (
                <div key={key} className="rounded-lg p-2" style={{ backgroundColor: '#f5f5f5', border: `2px solid ${color}` }}>
                  <h3 className="text-center font-semibold mb-2 text-xs" style={{ color }}>
                    {label}
                  </h3>
                  <div className="space-y-1.5">
                    <div>
                      <div className="text-[10px] font-semibold mb-0.5" style={{ color }}>Examples:</div>
                      {[1, 2].map(num => {
                        const slotId = `${key}-ex-${num}`
                        const item = getItemInSlot(slotId)
                        return (
                          <div
                            key={slotId}
                            className="h-10 rounded border-2 border-dashed p-1 flex items-center justify-center text-xs transition-all mb-1"
                            style={{ borderColor: color }}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, slotId, key, 'example')}
                          >
                            {item ? (
                              <div className="text-center text-white px-1.5 py-0.5 rounded leading-tight" style={{ backgroundColor: color, fontSize: '9px' }}>
                                {item.text}
                              </div>
                            ) : (
                              <span className="text-[10px]" style={{ color: '#9CA3AF' }}>Drop here</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold mb-0.5" style={{ color }}>Response:</div>
                      {(() => {
                        const slotId = `${key}-res`
                        const item = getItemInSlot(slotId)
                        return (
                          <div
                            className="h-10 rounded border-2 border-dashed p-1 flex items-center justify-center text-xs transition-all"
                            style={{ borderColor: color }}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, slotId, key, 'response')}
                          >
                            {item ? (
                              <div className="text-center text-white px-1.5 py-0.5 rounded leading-tight" style={{ backgroundColor: color, fontSize: '9px' }}>
                                {item.text}
                              </div>
                            ) : (
                              <span className="text-[10px]" style={{ color: '#9CA3AF' }}>Drop here</span>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Draggable Items Panel - Scrollable */}
            <div className="w-56 rounded-lg p-3" style={{ backgroundColor: '#f5f5f5', maxHeight: '420px', overflowY: 'auto' }}>
              <div className="space-y-3">
                <div>
                  <h4 className="text-[10px] font-semibold mb-1.5" style={{ color: '#6C757D' }}>Risk Examples</h4>
                  <div className="space-y-1.5">
                    {riskItems.filter(item => !isItemPlaced(item.id)).map(item => (
                      <div
                        key={item.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        className="bg-white border-2 rounded p-1.5 cursor-move text-[10px] hover:shadow-md transition-all select-none"
                        style={{ borderColor: '#0B1F32', color: '#0B1F32' }}
                      >
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-semibold mb-1.5" style={{ color: '#6C757D' }}>Response Approaches</h4>
                  <div className="space-y-1.5">
                    {responseItems.filter(item => !isItemPlaced(item.id)).map(item => (
                      <div
                        key={item.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        className="bg-white border-2 rounded p-1.5 cursor-move text-[10px] hover:shadow-md transition-all select-none"
                        style={{ borderColor: '#0B1F32', color: '#0B1F32' }}
                      >
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#6C757D', color: '#ffffff' }}
            >
              Reset Exercise
            </button>
            
            <button
              onClick={handleMarkComplete}
              className={`px-6 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90 ${buttonShake ? 'shake' : ''}`}
              style={{ backgroundColor: '#0B1F32', color: '#ffffff' }}
            >
              {isCompleted ? '✓ Activity Completed' : showTryAgain ? 'Try again!' : 'Mark this activity as complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
