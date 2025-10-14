"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
    { id: 'sales', label: 'Improve sales / Increase business value', isEditable: false, stars: 0 },
    { id: 'esg', label: 'Win ESG points: (CDP, Ecovadis, etc.)', isEditable: false, stars: 0 },
    { id: 'reputation', label: 'Maintain our reputation and social license', isEditable: false, stars: 0 },
    { id: 'other1', label: 'Other (Type a new name here)', isEditable: true, stars: 0 },
    { id: 'other2', label: 'Other (Type a new name here)', isEditable: true, stars: 0 },
  ])
  
  const [stars, setStars] = useState<Star[]>([])
  const [draggedStarId, setDraggedStarId] = useState<number | null>(null)
  const [popAudio, setPopAudio] = useState<HTMLAudioElement | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Preload pop sound
  useEffect(() => {
    const audio = new Audio('/pop-sound.mp3')
    audio.preload = 'auto'
    audio.load()
    setPopAudio(audio)
  }, [])

  // Initialize 20 stars with random positions in the star box
  useEffect(() => {
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
  }, [])

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

      // Play pop sound
      if (popAudio) {
        popAudio.currentTime = 0
        popAudio.play().catch(err => console.log('Audio play failed:', err))
      }

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

  const freeStars = stars.filter(star => star.categoryId === null)
  const totalAssignedStars = categories.reduce((sum, cat) => sum + cat.stars, 0)

  return (
    <div className="flex min-h-[calc(100vh-92px)]">
      <Sidebar />
      
      <div className="flex-1 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Title */}
          <h1 className="text-2xl font-bold mb-1 text-center" style={{ color: '#163E64' }}>
            Think about your objectives
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-base mb-2 text-center font-semibold" style={{ color: '#163E64' }}>
            What are you trying to achieve with the time you spend working on climate change?
          </h2>

          {/* Activity Area */}
          <div className="flex gap-4 items-start">
            {/* Categories */}
            <div className="flex-1 space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 p-2 rounded border"
                  style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#163E64',
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
                        className="w-full px-2 py-1 text-sm focus:outline-none focus:ring-2 rounded"
                        style={{
                          color: '#0B1F32',
                          borderColor: '#163E64',
                        }}
                      />
                    ) : (
                      <div
                        className="px-2 py-1 text-sm"
                        style={{
                          color: '#0B1F32',
                        }}
                      >
                        {category.label}
                      </div>
                    )}
                  </div>

                  {/* Percentage - Positioned closer to text */}
                  <div className="w-10 text-right mr-2">
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
                  <div className="flex gap-2 flex-wrap justify-end flex-1">
                    {stars
                      .filter(star => star.categoryId === category.id)
                      .map((star) => (
                        <div
                          key={star.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, star.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center cursor-move"
                          style={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #ffffff',
                          }}
                        >
                          <span style={{ color: '#FF5B35', fontSize: '20px' }}>★</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Star Pool Box with Completion Button */}
            <div className="flex flex-col gap-3">
              <div
                className="w-80 h-96 border-2 rounded-lg relative bg-gray-50"
                style={{ borderColor: '#163E64' }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e)}
              >
                {/* Instructions at top of star box */}
                <div className="absolute top-0 left-0 right-0 p-3 text-center" style={{ pointerEvents: 'none' }}>
                  <p className="text-xs leading-tight" style={{ color: '#163E64' }}>
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

              {/* Mark as Complete Button */}
              <button
                onClick={() => setIsCompleted(!isCompleted)}
                className="w-80 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: '#163E64',
                  color: '#ffffff',
                }}
              >
                {isCompleted ? '✓ Completed' : 'Mark as complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
