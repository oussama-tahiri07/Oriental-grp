export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}

// Authentication utilities
export const authUtils = {
  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("currentUser")
    const token = localStorage.getItem("authToken")

    // If no token, clear user data
    if (!token) {
      localStorage.removeItem("currentUser")
      return null
    }

    return userStr ? JSON.parse(userStr) : null
  },

  // Set current user and token in localStorage
  setCurrentUser: (user: User | null, token?: string) => {
    if (typeof window === "undefined") return
    if (user && token) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      localStorage.setItem("authToken", token)
    } else {
      localStorage.removeItem("currentUser")
      localStorage.removeItem("authToken")
    }
  },

  login: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { user: null, error: data.error || "Login failed" }
      }

      // Convert database user format to frontend format
      const user: User = {
        id: data.user.id.toString(),
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        createdAt: data.user.created_at,
      }

      authUtils.setCurrentUser(user, data.token)
      return { user, error: null }
    } catch (error) {
      console.error("Login error:", error)
      return { user: null, error: "Network error. Please try again." }
    }
  },

  signup: async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ user: User | null; error: string | null }> => {
    try {
      // Client-side validation
      if (password.length < 6) {
        return { user: null, error: "Password must be at least 6 characters" }
      }

      if (!email.includes("@")) {
        return { user: null, error: "Please enter a valid email address" }
      }

      if (name.length < 2) {
        return { user: null, error: "Name must be at least 2 characters" }
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { user: null, error: data.error || "Signup failed" }
      }

      // Convert database user format to frontend format
      const user: User = {
        id: data.user.id.toString(),
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        createdAt: data.user.created_at,
      }

      authUtils.setCurrentUser(user, data.token)
      return { user, error: null }
    } catch (error) {
      console.error("Signup error:", error)
      return { user: null, error: "Network error. Please try again." }
    }
  },

  // Logout function
  logout: () => {
    authUtils.setCurrentUser(null)
  },

  // Get redirect path based on user role
  getRedirectPath: (user: User): string => {
    switch (user.role) {
      case "admin":
        return "/admin/dashboard"
      case "user":
      default:
        return "/dashboard"
    }
  },

  getAuthToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("authToken")
  },
}
