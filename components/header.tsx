"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "/services" },
    { name: "Quality", href: "/quality" },
    { name: "Partners", href: "/partners" },
    { name: "blog", href: "/blog" },
    { name: "Contact us", href: "/contact" },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-32 h-15 relative">
                <img src="/logo.webp" alt="logo" className="w-full h-full object-contain"/>
                {/* Mountain logo recreation 
                <svg viewBox="0 0 200 50" className="w-full h-full">
                  
                  <path d="M20 35 L30 15 L40 25 L50 10 L60 30 L70 35 Z" fill="#2563eb" />
                  <path d="M25 35 L35 20 L45 30 L55 15 L65 35 Z" fill="#f97316" />
                  <text x="80" y="20" className="fill-blue-600 text-sm font-bold">
                    ORIENTAL
                  </text>
                  <text x="80" y="35" className="fill-orange-500 text-sm font-bold">
                    GROUP
                  </text>
                </svg>*/}
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4 ">
            {isLoading ? (
              // Show loading placeholder during auth initialization
              <div className="flex items-center space-x-3">
                <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : user ? (
              // Authenticated user menu
              <div className="flex items-center space-x-3">
                <Link
                  href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="text-gray-700 hover:text-red-500">
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              // Non-authenticated user buttons
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-500">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Language Selector 
            <div className="flex items-center space-x-1 ml-4">
              <span className="text-sm text-gray-600">🇬🇧</span>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </div>*/}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-orange-500 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t pt-3 mt-3">
                {isLoading ? (
                  <div className="px-3 py-2">
                    <div className="w-24 h-6 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    <Link
                      href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                      className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 px-3 py-2 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-500 px-3 py-2 text-base font-medium w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block text-gray-700 hover:text-orange-500 px-3 py-2 text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 text-base font-medium rounded-md mx-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
