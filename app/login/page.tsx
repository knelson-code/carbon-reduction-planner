"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Glass breaking sound for error scenarios (base64 audio)
  const GLASS_BREAK_BASE64 = "//OAxAAAAAAAAAAAAFhpbmcAAAAPAAAANgAAL+UAAAcHDg4YGB0dICAkJycrKzAwMzM6OkFBSVFRVFRYWGBgZGRoaGxwcHNzd3d7e4aGio+PkpKWlpqanp6ioqaqqrKytbW5ucHBycnN0dHU1NjY3Nzf3+Tk6Ovr7+/z8/f3////AAAAUExBTUUzLjEwMARuAAAAAAAAAAAVCCQCQCEAAeAAAC/ldcGNugAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/zEMQAAAAD/AAAAABtRpyN6ykmXd6z7ADJ"

  // Play error sound using Web Audio API
  const playErrorSound = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const binaryString = atob(GLASS_BREAK_BASE64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const audioBuffer = await audioContext.decodeAudioData(bytes.buffer)
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)
      source.start(0)
    } catch (error) {
      console.log('Error playing sound:', error)
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
        // Play error sound
        setTimeout(() => playErrorSound(), 0)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      setError("An error occurred. Please try again.")
      // Play error sound
      setTimeout(() => playErrorSound(), 0)
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
