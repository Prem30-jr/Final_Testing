"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X, Bell, User, Settings, LogOut, CreditCard, Activity, HelpCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  isAuthenticated: boolean
  onAuthClick: () => void
  credits: number
}

export default function Header({ isAuthenticated, onAuthClick, credits }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    setIsProfileDropdownOpen(false)
    onAuthClick()
  }

  const menuItems = [
    { icon: User, label: "Profile", action: () => console.log("Profile") },
    { icon: CreditCard, label: "Payment Methods", action: () => console.log("Payment Methods") },
    { icon: Activity, label: "Transaction History", action: () => console.log("Transaction History") },
    { icon: Settings, label: "Settings", action: () => console.log("Settings") },
    { icon: Shield, label: "Security", action: () => console.log("Security") },
    { icon: HelpCircle, label: "Help & Support", action: () => console.log("Help") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <span className="text-sm font-bold text-white">OP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OFF_PAY
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Credits Display */}
                <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 px-3 py-1.5 rounded-full border border-green-200">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">₹{credits}</span>
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative p-2">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-xs">
                    3
                  </Badge>
                </Button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </Button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              JD
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">John Doe</p>
                            <p className="text-sm text-gray-500">john.doe@example.com</p>
                          </div>
                        </div>
                        {/* Credits in mobile dropdown */}
                        <div className="sm:hidden mt-3 flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 px-3 py-2 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Balance</span>
                          </div>
                          <span className="text-sm font-bold text-green-700">₹{credits}</span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {menuItems.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              item.action()
                              setIsProfileDropdownOpen(false)
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                          >
                            <item.icon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{item.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-red-50 transition-colors text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={onAuthClick} className="hidden sm:inline-flex">
                  Sign In
                </Button>
                <Button
                  onClick={onAuthClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Started
                </Button>
                <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <Menu className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
            <nav className="py-4 space-y-2">
              <a
                href="#"
                className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Contact
              </a>
              {!isAuthenticated && (
                <div className="px-4 pt-2 border-t border-gray-200">
                  <Button
                    onClick={onAuthClick}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
