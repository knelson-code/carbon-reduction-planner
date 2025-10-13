"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  
  const modules = [
    {
      title: "Climate Risk",
      description: "Understand risks and improve decision-making under uncertainty",
      href: "/dashboard/climate-risk"
    },
    {
      title: "Transition Strategy",
      description: "Understand your role and speed up the energy transition",
      href: "/dashboard/transition-strategy"
    },
    {
      title: "Impact Strategy",
      description: "Identify leverage points for systemic political and economic change",
      href: "/dashboard/impact-strategy"
    },
    {
      title: "CO₂ Management",
      description: "Track emissions across Scope 1/2/3 and plan reduction tactics",
      href: "/dashboard/co2-management"
    }
  ];
  
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
          {modules.map((module) => {
            const CardContent = (
              <>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#0B1F32' }}>
                  {module.title}
                </h3>
                <p className="leading-relaxed text-sm" style={{ color: '#0B1F32' }}>
                  {module.description}
                </p>
              </>
            );

            if (session) {
              return (
                <Link
                  key={module.title}
                  href={module.href}
                  className="p-6 rounded-lg border transition-all duration-200 hover:shadow-lg"
                  style={{ 
                    backgroundColor: 'transparent', 
                    borderColor: 'rgba(11, 31, 50, 0.15)' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#163E64'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 91, 53, 0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(11, 31, 50, 0.15)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {CardContent}
                </Link>
              );
            }

            return (
              <div 
                key={module.title}
                className="p-6 rounded-lg border" 
                style={{ 
                  backgroundColor: 'transparent', 
                  borderColor: 'rgba(11, 31, 50, 0.15)' 
                }}
              >
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
