"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import Sidebar from "@/components/Sidebar"

interface Category {
  id: string
  label: string
  isEditable: boolean
  stars: number
}

interface Star {
  id: number
  x: number
  y: number
  categoryId: string | null
}

export default function DefiningObjectivesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [categories, setCategories] = useState<Category[]>([
    { id: 'risks', label: 'Be prepared for climate risks', isEditable: false, stars: 0 },
    { id: 'planet', label: 'Save the planet', isEditable: false, stars: 0 },
    { id: 'justice', label: 'Fight for climate justice', isEditable: false, stars: 0 },
    { id: 'legal', label: 'Legal compliance', isEditable: false, stars: 0 },
    { id: 'money', label: 'Save money / increasing efficiency', isEditable: false, stars: 0 },
    { id: 'sales', label: 'Improve sales / business value / access to funding', isEditable: false, stars: 0 },
    { id: 'esg', label: 'Win ESG points: (CDP, Ecovadis, etc.)', isEditable: false, stars: 0 },
    { id: 'reputation', label: 'Maintain our reputation and social license', isEditable: false, stars: 0 },
    { id: 'other1', label: 'Other (Type a new name here)', isEditable: true, stars: 0 },
    { id: 'other2', label: 'Other (Type a new name here)', isEditable: true, stars: 0 },
  ])
  
  const [stars, setStars] = useState<Star[]>([])
  const [draggedStarId, setDraggedStarId] = useState<number | null>(null)
  const [popAudio, setPopAudio] = useState<HTMLAudioElement | null>(null)
  const [completionAudio, setCompletionAudio] = useState<HTMLAudioElement | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, angle: number}>>([])
  const [confetti, setConfetti] = useState<Array<{id: number, color: string, delay: number, angle: number}>>([])
  const [confettiOrigin, setConfettiOrigin] = useState<{x: number, y: number} | null>(null)

  const ACTIVITY_ID = "transition-strategy-defining-objectives"

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
              // Restore categories (including custom labels and star counts)
              if (savedData.categories) {
                setCategories(savedData.categories)
              }
              
              // Restore star positions
              if (savedData.stars) {
                setStars(savedData.stars)
              }
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

  // Preload pop sound and completion sound
  useEffect(() => {
    const popSound = new Audio('/sharp-pop.mp3')
    popSound.preload = 'auto'
    popSound.volume = 0.7 // 70% volume
    popSound.load()
    setPopAudio(popSound)

    const completeSound = new Audio('/completion-sound.mp3')
    completeSound.preload = 'auto'
    completeSound.volume = 0.3 // 30% volume
    completeSound.load()
    setCompletionAudio(completeSound)
  }, [])

  // Initialize 20 stars with random positions in the star box (only if no saved data)
  useEffect(() => {
    if (!isLoading && stars.length === 0) {
      const initialStars: Star[] = []
      for (let i = 0; i < 20; i++) {
        initialStars.push({
          id: i,
          x: Math.random() * 240 + 10, // Random x within box, with padding
          y: Math.random() * 200 + 100, // Random y, starting below instructions
          categoryId: null
        })
      }
      setStars(initialStars)
    }
  }, [isLoading, stars.length])

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
            categories,
            stars,
          },
        }),
      })
    } catch (error) {
      console.error("Failed to save activity data:", error)
    } finally {
      setIsSaving(false)
    }
  }, [categories, stars, isCompleted, isSaving])

  // Auto-save when data changes (debounced)
  useEffect(() => {
    if (!isLoading && stars.length > 0) {
      const timer = setTimeout(() => {
        saveData()
      }, 1000) // Save 1 second after last change

      return () => clearTimeout(timer)
    }
  }, [categories, stars, isLoading, saveData])

  const handleDragStart = (e: React.DragEvent, starId: number) => {
    setDraggedStarId(starId)
  }

  const handleDrag = (e: React.DragEvent) => {
    if (e.clientX === 0 && e.clientY === 0) return // Ignore end of drag
    // Stars can be dragged anywhere - no restrictions
  }

  const handleDrop = (e: React.DragEvent, categoryId?: string) => {
    e.preventDefault()
    
    if (draggedStarId === null) return

    if (categoryId) {
      // Dropped on a category - star sticks there
      const draggedStar = stars.find(s => s.id === draggedStarId)
      const previousCategoryId = draggedStar?.categoryId

      // Play pop sound and create particle effect
      if (popAudio) {
        popAudio.currentTime = 0
        popAudio.play().catch(err => console.log('Audio play failed:', err))
      }
      
      // Create orange particle burst effect
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        angle: (Math.PI * 2 * i) / 8
      }))
      setParticles(newParticles)
      
      // Remove particles after animation
      setTimeout(() => {
        setParticles([])
      }, 500)

      setStars(prev => prev.map(star => 
        star.id === draggedStarId 
          ? { ...star, categoryId, x: 0, y: 0 } 
          : star
      ))
      
      setCategories(prev => prev.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, stars: cat.stars + 1 }
        }
        if (cat.id === previousCategoryId) {
          return { ...cat, stars: Math.max(0, cat.stars - 1) }
        }
        return cat
      }))
    } else {
      // Dropped back in star box - return to box
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      setStars(prev => prev.map(star => {
        if (star.id === draggedStarId) {
          // Remove from category if it was in one
          if (star.categoryId) {
            setCategories(prev => prev.map(cat =>
              cat.id === star.categoryId
                ? { ...cat, stars: Math.max(0, cat.stars - 1) }
                : cat
            ))
          }
          return { ...star, categoryId: null, x, y }
        }
        return star
      }))
    }
    
    setDraggedStarId(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleLabelEdit = (id: string, newLabel: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, label: newLabel } : cat
    ))
  }

  const handleMarkComplete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const newCompletedState = !isCompleted
    setIsCompleted(newCompletedState)
    
    // Play completion sound and create confetti when marking as complete
    if (newCompletedState && completionAudio) {
      completionAudio.currentTime = 0
      completionAudio.play().catch(err => console.log('Completion audio play failed:', err))
      
      // Get button position for confetti origin
      const button = e.currentTarget
      const rect = button.getBoundingClientRect()
      setConfettiOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      })
      
      // Create confetti burst
      const colors = ['#FF5B35', '#0B1F32', '#9CA3AF']
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: Date.now() + i,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.1,
        angle: (Math.random() * Math.PI * 2)
      }))
      setConfetti(newConfetti)
      
      // Remove confetti after animation
      setTimeout(() => {
        setConfetti([])
        setConfettiOrigin(null)
      }, 3000)
    }
    
    await saveData(newCompletedState)
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

  const freeStars = stars.filter(star => star.categoryId === null)
  const totalAssignedStars = categories.reduce((sum, cat) => sum + cat.stars, 0)

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
              transform: translate(var(--tx), var(--ty)) scale(0.3);
            }
          }
          
          @keyframes confettiFall {
            0% {
              opacity: 1;
              transform: translate(0, 0) rotateZ(0deg) rotateY(0deg);
            }
            100% {
              opacity: 0;
              transform: translate(var(--tx), 400px) rotateZ(720deg) rotateY(1080deg);
            }
          }
          
          .particle {
            animation: particleBurst 0.5s ease-out forwards;
          }
          
          .confetti-piece {
            animation: confettiFall 3s ease-in forwards;
          }
        `}</style>

        {/* Orange Particle Effects */}
        {particles.map((particle) => {
          const distance = 40
          const tx = Math.cos(particle.angle) * distance
          const ty = Math.sin(particle.angle) * distance
          
          return (
            <div
              key={particle.id}
              className="particle"
              style={{
                position: 'fixed',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#FF5B35',
                left: '50%',
                top: '50%',
                pointerEvents: 'none',
                zIndex: 9999,
                '--tx': `${tx}px`,
                '--ty': `${ty}px`,
              } as React.CSSProperties}
            />
          )
        })}

        {/* Confetti Effect */}
        {confetti.length > 0 && confettiOrigin && confetti.map((piece) => {
          const distance = 150 + Math.random() * 100
          const tx = Math.cos(piece.angle) * distance * (Math.random() * 0.5 + 0.5)
          
          return (
            <div
              key={piece.id}
              className="confetti-piece"
              style={{
                position: 'fixed',
                width: '10px',
                height: '10px',
                backgroundColor: piece.color,
                left: `${confettiOrigin.x}px`,
                top: `${confettiOrigin.y}px`,
                pointerEvents: 'none',
                zIndex: 9999,
                animationDelay: `${piece.delay}s`,
                '--tx': `${tx}px`,
              } as React.CSSProperties}
            />
          )
        })}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Title */}
          <h1 className="text-2xl font-bold mb-1 text-center" style={{ color: '#0B1F32' }}>
            Think about your objectives
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-base mb-2 text-center" style={{ color: '#0B1F32' }}>
            What are you trying to achieve with your work on climate change?
          </h2>

          {/* Activity Area */}
          <div className="flex gap-4 items-start">
            {/* Categories */}
            <div className="flex-1 space-y-1.5">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-2 p-1.5 rounded border relative"
                  style={{
                    backgroundColor: '#f5f5f5',
                    borderColor: '#0B1F32',
                  }}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, category.id)}
                >
                  {/* Category Label */}
                  <div className="flex-1">
                    {category.isEditable ? (
                      <input
                        type="text"
                        value={category.label}
                        onChange={(e) => handleLabelEdit(category.id, e.target.value)}
                        className="w-full px-2 py-0.5 text-sm focus:outline-none focus:ring-2 rounded"
                        style={{
                          color: '#0B1F32',
                          borderColor: '#0B1F32',
                        }}
                      />
                    ) : (
                      <div
                        className="px-2 py-0.5 text-sm"
                        style={{
                          color: '#0B1F32',
                        }}
                      >
                        {category.label}
                      </div>
                    )}
                  </div>

                  {/* Percentage - Positioned closer to text */}
                  <div className="w-10 text-right mr-1">
                    {category.stars > 0 && totalAssignedStars > 0 && (
                      <div
                        className="text-sm font-semibold"
                        style={{
                          color: '#FF5B35',
                        }}
                      >
                        {Math.round((category.stars / totalAssignedStars) * 100)}%
                      </div>
                    )}
                  </div>

                  {/* Stars for this category */}
                  <div className="flex gap-1.5 flex-wrap justify-end flex-1">
                    {stars
                      .filter(star => star.categoryId === category.id)
                      .map((star) => (
                        <div
                          key={star.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, star.id)}
                          className="w-7 h-7 rounded-full flex items-center justify-center cursor-move relative"
                          style={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #ffffff',
                          }}
                        >
                          <span style={{ color: '#FF5B35', fontSize: '18px' }}>★</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Star Pool Box with Completion Button */}
            <div className="flex flex-col gap-3 items-center">
              <div
                className="w-80 h-96 border-2 rounded-lg relative bg-gray-50"
                style={{ borderColor: '#0B1F32' }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e)}
              >
                {/* Instructions at top of star box */}
                <div className="absolute top-0 left-0 right-0 p-3 text-center rounded-t-lg" style={{ pointerEvents: 'none', borderBottom: '1px solid #0B1F32' }}>
                  <p className="text-xs leading-tight" style={{ color: '#0B1F32' }}>
                    <strong>Instructions:</strong> Drag stars from the box on the right to prioritize your objectives. 
                    The more stars you assign to an objective, the higher priority it is for your organization.
                  </p>
                </div>

                {freeStars.map((star) => (
                  <div
                    key={star.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, star.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-move absolute"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #ffffff',
                      left: `${star.x}px`,
                      top: `${star.y}px`,
                    }}
                  >
                    <span style={{ color: '#FF5B35', fontSize: '20px' }}>★</span>
                  </div>
                ))}
              </div>

              {/* Mark as Complete Button - Narrower and centered */}
              <button
                onClick={handleMarkComplete}
                className="px-6 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90 relative"
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
