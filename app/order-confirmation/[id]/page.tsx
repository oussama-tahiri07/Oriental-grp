"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft, Mail, Phone } from "lucide-react"

interface Order {
  id: number
  user_name: string
  user_email: string
  user_phone: string
  shipping_address: string
  status: string
  created_at: string
  notes?: string
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`)
        if (!response.ok) {
          throw new Error("Order not found")
        }
        const orderData = await response.json()
        setOrder(orderData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your quote confirmation...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Quote Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The requested quote could not be found."}</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quote Request Submitted!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your interest in our products. We'll get back to you soon.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-orange-500" />
              Quote Request Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Quote ID</label>
                <p className="text-lg font-semibold">#{order.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-lg font-semibold capitalize text-orange-600">{order.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg">{order.user_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg">{order.user_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-lg">{order.user_phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date Submitted</label>
                <p className="text-lg">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Shipping Address</label>
              <p className="text-lg">{order.shipping_address}</p>
            </div>

            {order.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Additional Notes</label>
                <p className="text-lg">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-orange-500" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Review Your Request</h3>
                  <p className="text-gray-600">Our team will review your quote request and product requirements.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Prepare Your Quote</h3>
                  <p className="text-gray-600">We'll prepare a detailed quote with pricing and shipping information.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Contact You</h3>
                  <p className="text-gray-600">We'll contact you within 24-48 hours with your personalized quote.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push("/products")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
          <Button onClick={() => router.push("/contact")} className="bg-orange-500 hover:bg-orange-600">
            <Mail className="h-4 w-4 mr-2" />
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  )
}
