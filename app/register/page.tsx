"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  
  const successAudioRef = useRef<HTMLAudioElement | null>(null)
  const errorAudioRef = useRef<HTMLAudioElement | null>(null)
  const eatingChipsAudioRef = useRef<HTMLAudioElement | null>(null)

  // Preload sounds on component mount for instant playback
  useEffect(() => {
    successAudioRef.current = new Audio('/finger-snap.mp3')
    successAudioRef.current.preload = 'auto'
    successAudioRef.current.load()
    
    errorAudioRef.current = new Audio('/cinematic-boom.mp3')
    errorAudioRef.current.preload = 'auto'
    errorAudioRef.current.load()
    // Force browser to fully load the audio by playing it at 0 volume
    errorAudioRef.current.volume = 0
    errorAudioRef.current.play().then(() => {
      errorAudioRef.current!.pause()
      errorAudioRef.current!.currentTime = 0
      errorAudioRef.current!.volume = 0.75 // Reduce volume by 25%
    }).catch(() => {
      // Silent fail - browser may block autoplay, but audio is still preloaded
      errorAudioRef.current!.volume = 0.75 // Reduce volume by 25%
    })
    
    eatingChipsAudioRef.current = new Audio('/oven-timer.mp3')
    eatingChipsAudioRef.current.volume = 0.525 // Reduce volume by 47.5%
    eatingChipsAudioRef.current.preload = 'auto'
    eatingChipsAudioRef.current.load()
  }, [])

  const playSuccessSound = () => {
    if (successAudioRef.current) {
      successAudioRef.current.currentTime = 0
      successAudioRef.current.play().catch(err => console.log('Error playing sound:', err))
    }
  }

  const playErrorSound = () => {
    if (errorAudioRef.current) {
      errorAudioRef.current.currentTime = 0
      errorAudioRef.current.play().catch(err => console.log('Error playing sound:', err))
    }
  }

  const playEatingChipsSound = () => {
    if (eatingChipsAudioRef.current) {
      eatingChipsAudioRef.current.currentTime = 0
      eatingChipsAudioRef.current.play().catch(err => console.log('Error playing sound:', err))
    }
  }

  const generateCredentialsPDF = (username: string, password: string) => {
    const content = `Climate Software

Username: ${username}
Password: ${password}

Created: ${new Date().toLocaleString()}

IMPORTANT: 
- Keep these credentials safe and secure
- If you lose these credentials, you will need to create a new account
- Usernames and passwords are case sensitive

This is a privacy-focused system. Since you used an anonymous username, no one, including us, can link your data to you or your company.
`
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Climate Software.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Play eating chips sound while account is being created
    playEatingChipsSound()
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      playErrorSound()
      return
    }
    
    setLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
        playErrorSound()
        setLoading(false)
        return
      }

      // Automatically sign in after registration
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Registration successful, but sign in failed. Please try logging in.")
        setLoading(false)
      } else {
        // Generate and download credentials file
        generateCredentialsPDF(username, password)
        setShowCredentialsModal(true)
      }
    } catch {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border" style={{ borderColor: '#d4dfe0' }}>
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#0B1F32' }}>Create Account</h2>
        
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
              placeholder="Anonymous username"
            />
            <p className="text-xs text-gray-500 mt-1">
              <span style={{ textDecoration: 'underline', textDecorationColor: '#FF5B35' }}>
                Please choose an anonymous user name that does not identify your company or your personal information
              </span>
              . Do not use your email. Case sensitive
            </p>
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
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">
              At least 6 characters. Case sensitive
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div className="rounded-md p-3 border" style={{ backgroundColor: '#f5f5f5', borderColor: '#d4dfe0' }}>
            <p className="text-xs" style={{ color: '#0B1F32' }}>
              <strong>Important:</strong> You are responsible for saving your user name and password. We do not provide password support. We recommend that you use your browser&apos;s password manager to save your login information.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-start">
              <input
                id="privacy"
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                required
                className="mt-1 mr-2"
              />
              <label htmlFor="privacy" className="text-sm text-gray-700">
                I have read and accept the{" "}
                <Link href="/privacy" target="_blank" className="text-orange-500 hover:text-orange-600 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                required
                className="mt-1 mr-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I have read and accept the{" "}
                <Link href="/terms" target="_blank" className="text-orange-500 hover:text-orange-600 underline">
                  Terms of Service
                </Link>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !acceptedPrivacy || !acceptedTerms}
            className="w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 font-semibold transition-colors disabled:bg-gray-400"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-500 hover:text-orange-600 font-semibold">
            Sign in
          </Link>
        </p>
      </div>

      {/* Credentials Download Modal */}
      {showCredentialsModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(243, 244, 246, 0.95)' }}>
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 border-2" style={{ borderColor: '#d4dfe0' }}>
            <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#0B1F32' }}>
              Registration completed correctly
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              For your convenience, your user name and login have been downloaded as a text file.
            </p>
            <p className="text-sm text-gray-700 mb-6">
              Please save this information securely. If you forget your user name or password, you will need to create a new account.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: '#d4dfe0' }}>
              <p className="text-sm text-gray-600">Click here to close this pop up message</p>
              <button
                onClick={() => {
                  setShowCredentialsModal(false)
                  router.push("/dashboard")
                  router.refresh()
                  playSuccessSound()
                }}
                className="text-3xl font-bold hover:opacity-80 transition-opacity"
                style={{ color: '#FF5B35', lineHeight: '1' }}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
