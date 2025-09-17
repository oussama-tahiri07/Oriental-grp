"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Mail, Phone, Reply, DollarSign, Package } from "lucide-react"
import Link from "next/link"

interface Order {
  id: number
  user_name: string
  user_email: string
  user_phone: string
  shipping_address: string
  status: string
  quote_amount?: number
  quote_notes?: string
  quoted_at?: string
  created_at: string
  items: Array<{
    id: number
    product_id: number
    quantity: number
    product_title?: string
  }>
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "quote_pending":
        return <Badge variant="secondary">Quote Pending</Badge>
      case "quoted":
        return <Badge className="bg-green-500">Quoted</Badge>
      case "approved":
        return <Badge className="bg-blue-500">Approved</Badge>
      case "completed":
        return <Badge className="bg-purple-500">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading orders...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Order & Quote Management</h1>
            <p className="text-gray-600 mt-2">Manage customer quote requests and orders</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">Back to Dashboard</Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Quote Request #{order.id} - {order.user_name}
                      {getStatusBadge(order.status)}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""} requested
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                      <Reply className="h-4 w-4 mr-1" />
                      {order.status === "quoted" ? "Update Quote" : "Send Quote"}
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{order.user_email}</span>
                    </div>
                    {order.user_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{order.user_phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Shipping Address:</h4>
                    <p className="text-sm text-gray-700">{order.shipping_address}</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Requested Items:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm text-blue-700">
                          • {item.quantity}x Product ID {item.product_id}
                          {item.product_title && ` - ${item.product_title}`}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Show quote details if quoted */}
                  {order.quote_amount && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">Quote Sent</span>
                        <Badge className="bg-green-600 ml-auto">${order.quote_amount}</Badge>
                      </div>
                      {order.quote_notes && <p className="text-sm text-green-700 mb-2">{order.quote_notes}</p>}
                      <p className="text-xs text-green-600">
                        Quoted on {order.quoted_at ? new Date(order.quoted_at).toLocaleString() : "Unknown"}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Submitted on {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
