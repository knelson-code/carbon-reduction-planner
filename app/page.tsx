"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  
  return (
    <div className="flex items-center justify-center bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-5xl font-bold mb-6" style={{ color: '#0B1F32' }}>
          Climate Management Platform
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: '#5a6c6f' }}>
          Comprehensive climate strategy tools for emissions management, risk assessment, transition planning, and impact measurement.
        </p>
        
        {session ? (
          <div className="mb-12">
            <p className="text-2xl font-semibold" style={{ color: '#0B1F32' }}>
              You are currently logged in
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/register"
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              style={{ 
                backgroundColor: '#f5f5f5', 
                color: '#FF5B35',
                boxShadow: '0 2px 8px rgba(255, 91, 53, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FF5B35'
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 91, 53, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.color = '#FF5B35'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 91, 53, 0.15)'
              }}
            >
              Get Started
            </Link>
            <Link 
              href="/login"
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              style={{ 
                backgroundColor: '#f5f5f5', 
                color: '#0B1F32',
                boxShadow: '0 2px 8px rgba(11, 31, 50, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0B1F32'
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(11, 31, 50, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
                e.currentTarget.style.color = '#0B1F32'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(11, 31, 50, 0.15)'
              }}
            >
              Sign In
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'transparent', borderColor: 'rgba(11, 31, 50, 0.15)' }}>
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#0B1F32' }}>CO₂ Management</h3>
            <p className="leading-relaxed text-sm" style={{ color: '#0B1F32' }}>
              Track emissions across Scope 1/2/3 and plan reduction tactics
            </p>
          </div>
          
          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'transparent', borderColor: 'rgba(11, 31, 50, 0.15)' }}>
            <div className="text-3xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#0B1F32' }}>Climate Risk</h3>
            <p className="leading-relaxed text-sm" style={{ color: '#0B1F32' }}>
              Assess physical and transition risks to your operations
            </p>
          </div>
          
          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'transparent', borderColor: 'rgba(11, 31, 50, 0.15)' }}>
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#0B1F32' }}>Transition Strategy</h3>
            <p className="leading-relaxed text-sm" style={{ color: '#0B1F32' }}>
              Design pathways to net-zero with science-based targets
            </p>
          </div>

          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'transparent', borderColor: 'rgba(11, 31, 50, 0.15)' }}>
            <div className="text-3xl mb-3">💡</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#0B1F32' }}>Impact Strategy</h3>
            <p className="leading-relaxed text-sm" style={{ color: '#0B1F32' }}>
              Measure outcomes and communicate your climate leadership
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
