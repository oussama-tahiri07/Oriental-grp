"use client"

import { useAuth } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, ShoppingBag, Heart, Settings } from "lucide-react"
import { useState, useEffect } from "react"

interface UserStats {
  orderCount: number
  recentOrders: Array<{
    id: number
    status: string
    created_at: string
    items_count: number
  }>
}

function DashboardContent() {
  const { user, logout } = useAuth()
  const [userStats, setUserStats] = useState<UserStats>({ orderCount: 0, recentOrders: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      fetchUserStats()
    }
  }, [user])

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/api/user/stats?email=${encodeURIComponent(user?.email || "")}`)
      if (response.ok) {
        const data = await response.json()
        setUserStats(data)
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mt-2">Manage your account and explore our premium products.</p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Complete</div>
              <p className="text-xs text-muted-foreground">Your profile is set up</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : userStats.orderCount}</div>
              <p className="text-xs text-muted-foreground">Total orders placed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Saved products</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ready</div>
              <p className="text-xs text-muted-foreground">Account configured</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Explore Our Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Discover our premium collection of Moroccan argan oil and natural beauty products.
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <a href="/products">Browse Products</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Role:</strong> {user?.role}
                </p>
                <p>
                  <strong>Member since:</strong>{" "}
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {userStats.recentOrders.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userStats.recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-600">
                          {order.items_count} item{order.items_count !== 1 ? "s" : ""} •{" "}
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "quoted"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard requiredRole="user">
      <DashboardContent />
    </AuthGuard>
  )
}
