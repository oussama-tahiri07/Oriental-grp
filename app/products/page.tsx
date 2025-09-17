"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { CartButton } from "@/components/cart/cart-button"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/cart/add-to-cart-button"

interface Product {
  id: number
  title: string
  description: string
  image_path: string
  color_class: string
  sku: string
  is_featured: boolean
  display_order: number
  in_stock: boolean
  stock_quantity: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading products: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-slate-700 to-slate-500 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: "url('/placeholder.svg?height=400&width=1200')",
          }}
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">OUR PRODUCTS</h1>
          <div className="mt-6">
            <CartDrawer open={showCart} onOpenChange={setShowCart}>
              <CartButton onClick={() => setShowCart(true)} />
            </CartDrawer>
          </div>
        </div>
      </section>

      {/* Products List */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-sm h-full"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Product Image */}
                  <div className="w-32 h-32 flex-shrink-0 mx-auto mb-6 relative">
                    {product.is_featured && (
                      <Badge className="absolute -top-2 -right-2 z-10 bg-orange-500">Featured</Badge>
                    )}
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-100">
                      <img
                        src={product.image_path || "/placeholder.svg?height=128&width=128&query=organic product"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/organic-products-display.png"
                        }}
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 text-center">
                    <h3 className={`text-lg font-semibold mb-2 ${product.color_class || "text-green-600"}`}>
                      {product.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm mb-4">{product.description}</p>

                    <div className="mb-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-blue-800 text-sm font-medium">Custom Quote Available</p>
                        <p className="text-blue-600 text-xs">Contact us for personalized pricing</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <AddToCartButton product={product} className="w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 font-serif">Premium Organic Products</h2>
          <p className="text-xl mb-8">
            Shop our collection of authentic Moroccan organic products with secure checkout and worldwide shipping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CartDrawer open={showCart} onOpenChange={setShowCart}>
              <CartButton onClick={() => setShowCart(true)} />
            </CartDrawer>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Bulk Orders
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
