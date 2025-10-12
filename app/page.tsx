"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  
  return (
    <div className="flex items-center justify-center bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-5xl font-bold mb-6" style={{ color: '#0B1F32' }}>
          CO₂ Reduction Planner
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: '#5a6c6f' }}>
          Plan, track, and achieve your organization&apos;s carbon reduction goals with comprehensive emissions management and tactical planning.
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

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="p-8 rounded-lg border" style={{ backgroundColor: 'transparent', borderColor: 'rgba(11, 31, 50, 0.15)' }}>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#0B1F32' }}>Track Emissions</h3>
            <p className="leading-relaxed" style={{ color: '#0B1F32' }}>
              Organize emissions by Scope 1, 2, and 3 categories with detailed baseline tracking
            </p>
          </div>
          
          <div className="p-8 rounded-lg border" style={{ backgroundColor: 'transparent', borderColor: 'rgba(11, 31, 50, 0.15)' }}>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#0B1F32' }}>Plan Reductions</h3>
            <p className="leading-relaxed" style={{ color: '#0B1F32' }}>
              Create reduction tactics with timelines, costs, and implementation strategies
            </p>
          </div>
          
          <div className="p-8 rounded-lg border" style={{ backgroundColor: 'transparent', borderColor: 'rgba(11, 31, 50, 0.15)' }}>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#0B1F32' }}>Visualize Progress</h3>
            <p className="leading-relaxed" style={{ color: '#0B1F32' }}>
              See projected emissions vs. targets with interactive charts and forecasts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
