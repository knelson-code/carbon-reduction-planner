"use client"

import { useState, useEffect, useRef } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const errorAudioRef = useRef<HTMLAudioElement | null>(null)

  // Preload error sound on component mount for instant playback
  useEffect(() => {
    errorAudioRef.current = new Audio('/wood-effect.mp3')
    errorAudioRef.current.preload = 'auto'
    errorAudioRef.current.load()
    
    // Force browser to fully load the audio by playing it at 0 volume
    errorAudioRef.current.volume = 0
    errorAudioRef.current.play().then(() => {
      errorAudioRef.current!.pause()
      errorAudioRef.current!.currentTime = 0
      errorAudioRef.current!.volume = 1
    }).catch(() => {
      // Silent fail - browser may block autoplay, but audio is still preloaded
      errorAudioRef.current!.volume = 1
    })
  }, [])

  const playErrorSound = () => {
    if (errorAudioRef.current) {
      errorAudioRef.current.currentTime = 0
      errorAudioRef.current.play().catch(err => console.log('Error playing sound:', err))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid username or password")
        playErrorSound()
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("An error occurred. Please try again.")
      playErrorSound()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border" style={{ borderColor: '#d4dfe0' }}>
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#0B1F32' }}>Sign In</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#4a5568' }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#374151')}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4a5568'}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm" style={{ color: '#5a6c6f' }}>
          Don&apos;t have an account?{" "}
          <Link 
            href="/register" 
            className="font-semibold transition-colors"
            style={{ color: '#FF5B35' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#E54A24'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#FF5B35'}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
