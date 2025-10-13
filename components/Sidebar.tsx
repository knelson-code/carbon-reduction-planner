"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MenuItem {
  name: string
  href: string
  icon: string
  subItems?: { name: string; href: string }[]
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "🏠",
  },
  {
    name: "CO₂ Management",
    href: "/dashboard/co2-management",
    icon: "🌱",
    subItems: [
      { name: "Emissions Tracking", href: "/dashboard/co2-management/emissions" },
      { name: "Reduction Tactics", href: "/dashboard/co2-management/tactics" },
      { name: "Scope 1/2/3", href: "/dashboard/co2-management/scopes" },
    ],
  },
  {
    name: "Climate Risk",
    href: "/dashboard/climate-risk",
    icon: "⚠️",
    subItems: [
      { name: "Risk Assessment", href: "/dashboard/climate-risk/assessment" },
      { name: "Adaptation Planning", href: "/dashboard/climate-risk/adaptation" },
      { name: "Vulnerability Analysis", href: "/dashboard/climate-risk/vulnerability" },
    ],
  },
  {
    name: "Transition Strategy",
    href: "/dashboard/transition-strategy",
    icon: "🚀",
    subItems: [
      { name: "Pathway Planning", href: "/dashboard/transition-strategy/pathways" },
      { name: "Target Setting", href: "/dashboard/transition-strategy/targets" },
      { name: "Progress Tracking", href: "/dashboard/transition-strategy/progress" },
    ],
  },
  {
    name: "Impact Strategy",
    href: "/dashboard/impact-strategy",
    icon: "💡",
    subItems: [
      { name: "Impact Assessment", href: "/dashboard/impact-strategy/assessment" },
      { name: "Stakeholder Engagement", href: "/dashboard/impact-strategy/stakeholders" },
      { name: "Reporting", href: "/dashboard/impact-strategy/reporting" },
    ],
  },
]

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleItem = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-[92px] bottom-0 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out z-40"
        style={{
          width: isExpanded ? "240px" : "60px",
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false)
          setExpandedItems([])
        }}
      >
        <nav className="flex flex-col h-full py-4">
          {menuItems.map((item) => (
            <div key={item.name}>
              {/* Main Menu Item */}
              <div
                className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 border-l-4"
                    : "hover:bg-gray-50"
                }`}
                style={{
                  borderColor: isActive(item.href) ? "#163E64" : "transparent",
                }}
                onClick={() => {
                  if (item.subItems && isExpanded) {
                    toggleItem(item.name)
                  }
                }}
              >
                <Link
                  href={item.href}
                  className="flex items-center w-full"
                  onClick={(e) => {
                    if (item.subItems && isExpanded) {
                      e.preventDefault()
                    }
                  }}
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  {isExpanded && (
                    <span
                      className="ml-3 font-semibold text-sm whitespace-nowrap"
                      style={{ color: isActive(item.href) ? "#163E64" : "#6C757D" }}
                    >
                      {item.name}
                    </span>
                  )}
                  {isExpanded && item.subItems && (
                    <span className="ml-auto text-gray-400">
                      {expandedItems.includes(item.name) ? "▼" : "▶"}
                    </span>
                  )}
                </Link>
              </div>

              {/* Sub Items */}
              {isExpanded && item.subItems && expandedItems.includes(item.name) && (
                <div className="bg-gray-50">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={`flex items-center pl-12 pr-4 py-2 text-sm transition-colors ${
                        pathname === subItem.href
                          ? "text-blue-600 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Spacer to prevent content from going under sidebar */}
      <div className="w-[60px] flex-shrink-0" />
    </>
  )
}
