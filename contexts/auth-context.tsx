"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, type AuthState, authUtils } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>
  signup: (name: string, email: string, password: string) => Promise<{ user: User | null; error: string | null }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  })

  // Initialize auth state on mount
  useEffect(() => {
    const user = authUtils.getCurrentUser()
    setAuthState({
      user,
      isLoading: false,
    })
  }, [])

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const result = await authUtils.login(email, password)

    setAuthState({
      user: result.user,
      isLoading: false,
    })

    return result
  }

  const signup = async (name: string, email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const result = await authUtils.signup(name, email, password)

    setAuthState({
      user: result.user,
      isLoading: false,
    })

    return result
  }

  const logout = () => {
    authUtils.logout()
    setAuthState({
      user: null,
      isLoading: false,
    })
  }

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
