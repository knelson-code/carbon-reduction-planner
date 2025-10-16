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
    icon: "Home",
  },
  {
    name: "Risk",
    href: "/dashboard/climate-risk",
    icon: "Risk",
    subItems: [
      { name: "Identify and understand risks", href: "/dashboard/climate-risk/identify" },
      { name: "Improve decision-making under uncertainty", href: "/dashboard/climate-risk/decisions" },
      { name: "Incorporate insights into processes", href: "/dashboard/climate-risk/integrate" },
    ],
  },
  {
    name: "Transition",
    href: "/dashboard/transition-strategy",
    icon: "Transition",
    subItems: [
      { name: "Understand your role", href: "/dashboard/transition-strategy/role" },
      { name: "Speed up the energy transition", href: "/dashboard/transition-strategy/speed" },
      { name: "Decide what you're willing to do", href: "/dashboard/transition-strategy/decide" },
    ],
  },
  {
    name: "Systems",
    href: "/dashboard/impact-strategy",
    icon: "Systems",
    subItems: [
      { name: "Build a clear vision", href: "/dashboard/impact-strategy/vision" },
      { name: "Identify intervention points", href: "/dashboard/impact-strategy/intervention" },
      { name: "Define impactful actions", href: "/dashboard/impact-strategy/actions" },
    ],
  },
  {
    name: "CO₂",
    href: "/dashboard/co2-management",
    icon: "CO₂",
    subItems: [
      { name: "Measure emissions", href: "/dashboard/co2-management/measure" },
      { name: "Set reduction Targets", href: "/dashboard/co2-management/targets" },
      { name: "Create detailed reduction plan", href: "/dashboard/co2-management/plan" },
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
        className="fixed left-0 top-[92px] bottom-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40"
        style={{
          width: isExpanded ? "240px" : "24px",
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
                className={`flex items-center transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 border-l-4"
                    : "hover:bg-gray-50"
                }`}
                style={{
                  borderColor: isActive(item.href) ? "#163E64" : "transparent",
                  paddingLeft: isExpanded ? "16px" : "4px",
                  paddingRight: isExpanded ? "16px" : "4px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                }}
              >
                <Link
                  href={item.href}
                  className="flex items-center flex-1 cursor-pointer"
                >
                  {!isExpanded && (
                    <div className="flex items-center justify-center w-full">
                      <span
                        className="text-xs font-semibold tracking-wide"
                        style={{
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          color: isActive(item.href) ? "#163E64" : "#4B5563",
                          WebkitFontSmoothing: "antialiased",
                          MozOsxFontSmoothing: "grayscale",
                          textRendering: "optimizeLegibility",
                        }}
                      >
                        {item.icon}
                      </span>
                    </div>
                  )}
                  {isExpanded && (
                    <span
                      className="font-semibold text-sm whitespace-nowrap"
                      style={{ color: isActive(item.href) ? "#163E64" : "#6C757D" }}
                    >
                      {item.name}
                    </span>
                  )}
                </Link>
                {isExpanded && item.subItems && (
                  <button
                    className="ml-auto px-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleItem(item.name)
                    }}
                  >
                    {expandedItems.includes(item.name) ? "▼" : "▶"}
                  </button>
                )}
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
      <div className="w-[24px] flex-shrink-0" />
    </>
  )
}
