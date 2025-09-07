"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, FileText, MessageSquare, Package, TrendingUp, Eye, UserCheck, Mail } from "lucide-react"
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid } from "recharts"
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

function AnalyticsContent() {
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into your Oriental Group website performance</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={fetchAnalytics} variant="outline">
              Refresh Data
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                User Growth & Contact Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  users: {
                    label: "New Users",
                    color: "hsl(var(--chart-1))",
                  },
                  contacts: {
                    label: "Contact Submissions",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} name="New Users" />
                  <Line
                    type="monotone"
                    dataKey="contacts"
                    stroke="var(--color-contacts)"
                    strokeWidth={2}
                    name="Contact Submissions"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Blog Posts by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Blog Posts by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  posts: {
                    label: "Posts",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <PieChart>
                  <Pie
                    data={analytics.blogByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, posts }) => `${category}: ${posts}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="posts"
                  >
                    {analytics.blogByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                </PieChart> 
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                User Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users:</span>
                <span className="font-semibold">{analytics.userStats.total_users}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New (30 days):</span>
                <span className="font-semibold text-green-600">+{analytics.userStats.new_users_30d}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New (7 days):</span>
                <span className="font-semibold text-blue-600">+{analytics.userStats.new_users_7d}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Admin Users:</span>
                <span className="font-semibold">{analytics.userStats.admin_users}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Content Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Products:</span>
                <span className="font-semibold">{analytics.contentStats.total_products}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Featured Products:</span>
                <span className="font-semibold text-orange-600">{analytics.contentStats.featured_products}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Blog Posts:</span>
                <span className="font-semibold">{analytics.contentStats.published_posts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Services:</span>
                <span className="font-semibold">{analytics.contentStats.total_services}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Partners:</span>
                <span className="font-semibold">{analytics.contentStats.total_partners}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Contacts:</span>
                <span className="font-semibold">{analytics.contactStats.total_contacts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">This Month:</span>
                <span className="font-semibold text-green-600">+{analytics.contactStats.contacts_30d}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unread:</span>
                <span className="font-semibold text-red-600">{analytics.contactStats.unread_contacts}</span>
              </div>
              <div className="pt-2">
                <Button asChild size="sm" className="w-full">
                  <Link href="/admin/contacts">
                    <Eye className="h-4 w-4 mr-2" />
                    View Contacts
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <AuthGuard requiredRole="admin">
      <AnalyticsContent />
    </AuthGuard>
  )
}
