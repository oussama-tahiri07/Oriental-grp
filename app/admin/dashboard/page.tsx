"use client"

import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, ShoppingBag, TrendingUp, Settings, Package, MessageSquare, FileText } from "lucide-react"
import Link from "next/link"

interface AnalyticsData {
  userStats: {
    total_users: number
    new_users_30d: number
    new_users_7d: number
    admin_users: number
  }
  contentStats: {
    total_products: number
    featured_products: number
    total_blog_posts: number
    published_posts: number
    total_services: number
    total_partners: number
  }
  contactStats: {
    total_contacts: number
    contacts_30d: number
    unread_contacts: number
  }
  monthlyUsers: Array<{ month: string; users: number }>
  monthlyContacts: Array<{ month: string; contacts: number }>
  blogByCategory: Array<{ category: string; posts: number }>
}

const COLORS = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"]

function AdminDashboardContent() {
  const { user, logout } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
    useEffect(() => {
      fetchAnalytics()
    }, [])
  
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics")
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        } else {
          setError("Failed to fetch analytics data")
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setError("An error occurred while fetching analytics")
      } finally {
        setLoading(false)
      }
    }
  
    const formatMonth = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      })
    }
  
    const chartData =
      analytics?.monthlyUsers.map((item) => ({
        month: formatMonth(item.month),
        users: item.users,
        contacts: analytics.monthlyContacts.find((c) => c.month === item.month)?.contacts || 0,
      })) || []
  
    if (loading) {
      return <div className="flex justify-center items-center min-h-screen">Loading analytics...</div>
    }
  
    if (error) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchAnalytics}>Try Again</Button>
          </div>
        </div>
      )
    }
  
    if (!analytics) {
      return <div className="flex justify-center items-center min-h-screen">No analytics data available</div>
    }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}. Manage your Oriental Group business.</p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.userStats.total_users.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{analytics.userStats.new_users_30d} this month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.contentStats.published_posts}</div>
              <p className="text-xs text-muted-foreground">{analytics.contentStats.total_blog_posts} total posts</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.contactStats.total_contacts}</div>
              <p className="text-xs text-muted-foreground">{analytics.contactStats.unread_contacts} unread</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.contentStats.total_products}</div>
              <p className="text-xs text-muted-foreground">{analytics.contentStats.featured_products} featured</p>
            </CardContent>
          </Card>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">+400% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">+200% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$---</div>
              <p className="text-xs text-muted-foreground">+0% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>
        </div> */}

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage your argan oil products, inventory, and pricing.</p>
              <div className="space-y-2">
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/admin/products">
                    <Package className="mr-2 h-4 w-4" />
                    Manage Products
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/admin/services">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Services
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage customer accounts and user roles.</p>
              <div className="space-y-2">
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/admin/contacts">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Submissions
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/admin/orders">
                    <Package className="mr-2 h-4 w-4" />
                    Manage Orders
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage blog posts, articles, and website content.</p>
              <div className="space-y-2">
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/admin/blog">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Manage Blog Posts
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/admin/partners">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Partners
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Configure website settings and view analytics.</p>
              <div className="space-y-2">
                <Button asChild className="w-full justify-start bg-transparent" variant="outline">
                  <Link href="/admin/analytics">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start bg-orange-500 hover:bg-orange-600 text-white">
                  <Link href="/">View Website</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminDashboardContent />
    </AuthGuard>
  )
}
