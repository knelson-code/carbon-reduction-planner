"use client"

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6" style={{ color: '#112d2f' }}>
          CO₂ Reduction Planner
        </h1>
        <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed" style={{ color: '#5a6c6f' }}>
          Plan, track, and achieve your organization&apos;s carbon reduction goals with comprehensive emissions management and tactical planning.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <Link 
            href="/register"
            className="px-8 py-4 rounded-lg font-bold text-lg transition-colors"
            style={{ backgroundColor: '#FF5B35', color: '#ffffff' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E54A24'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF5B35'}
          >
            Get Started Free
          </Link>
          <Link 
            href="/login"
            className="px-8 py-4 rounded-lg font-bold text-lg transition-colors"
            style={{ backgroundColor: '#112d2f', color: '#ffffff' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0d2325'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#112d2f'}
          >
            Sign In
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-lg border" style={{ borderColor: '#d4dfe0' }}>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#112d2f' }}>Track Emissions</h3>
            <p className="leading-relaxed" style={{ color: '#5a6c6f' }}>
              Organize emissions by Scope 1, 2, and 3 categories with detailed baseline tracking
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg border" style={{ borderColor: '#d4dfe0' }}>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#112d2f' }}>Plan Reductions</h3>
            <p className="leading-relaxed" style={{ color: '#5a6c6f' }}>
              Create reduction tactics with timelines, costs, and implementation strategies
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg border" style={{ borderColor: '#d4dfe0' }}>
            <h3 className="text-xl font-bold mb-3" style={{ color: '#112d2f' }}>Visualize Progress</h3>
            <p className="leading-relaxed" style={{ color: '#5a6c6f' }}>
              See projected emissions vs. targets with interactive charts and forecasts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
