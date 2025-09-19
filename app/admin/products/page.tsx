"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Edit, Plus, Search, X, Save } from "lucide-react"
import Link from "next/link"
import { ImageUpload } from "@/components/image-upload"

interface Product {
  id: number
  title: string
  description: string
  image_path: string
  color_class: string
  is_featured: boolean
  display_order: number
}

interface ProductFormData {
  title: string
  description: string
  image_path: string
  color_class: string
  is_featured: boolean
  display_order: string
}

function ProductManagementContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    image_path: "",
    color_class: "text-green-600",
    is_featured: false,
    display_order: "0",
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId))
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_path: "",
      color_class: "text-green-600",
      is_featured: false,
      display_order: "0",
    })
    setEditingProduct(null)
    setShowAddForm(false)
    setError("")
    setSuccess("")
  }

  const handleEdit = (product: Product) => {
    setFormData({
      title: product.title,
      description: product.description,
      image_path: product.image_path,
      color_class: product.color_class,
      is_featured: product.is_featured,
      display_order: product.display_order.toString(),
    })
    setEditingProduct(product)
    setShowAddForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and description are required")
      return
    }

    try {
      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image_path: formData.image_path.trim() || "/placeholder.svg?height=200&width=200",
        color_class: formData.color_class,
        is_featured: formData.is_featured,
        display_order: Number.parseInt(formData.display_order) || 0,
      }

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const savedProduct = await response.json()

        if (editingProduct) {
          setProducts(products.map((p) => (p.id === editingProduct.id ? savedProduct : p)))
          setSuccess("Product updated successfully!")
        } else {
          setProducts([...products, savedProduct])
          setSuccess("Product added successfully!")
        }

        resetForm()
        fetchProducts() // Refresh the list
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save product")
      }
    } catch (error) {
      setError("An error occurred while saving the product")
      console.error("Error saving product:", error)
    }
  }

  const filteredProducts = products.filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Product Management</h1>
            <p className="text-gray-600 mt-2">Manage your argan oil products and inventory</p>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link href="/admin/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {(showAddForm || editingProduct) && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Product Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter product title"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <ImageUpload
                    value={formData.image_path}
                    onChange={(url) => setFormData({ ...formData, image_path: url })}
                    label="Product Image"
                    placeholder="/images/product.png"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="color_class">Color Class</Label>
                    <select
                      id="color_class"
                      value={formData.color_class}
                      onChange={(e) => setFormData({ ...formData, color_class: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="text-green-600">Green</option>
                      <option value="text-blue-600">Blue</option>
                      <option value="text-orange-600">Orange</option>
                      <option value="text-purple-600">Purple</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <Label htmlFor="is_featured">Featured Product</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    <Save className="h-4 w-4 mr-2" />
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>All Products ({filteredProducts.length})</CardTitle>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold">{product.title}</h3>
                        {product.is_featured && <Badge className="bg-orange-500">Featured</Badge>}
                      </div>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Order: {product.display_order}</span>
                        <span>Color: {product.color_class}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProductManagementPage() {
  return (
    <AuthGuard requiredRole="admin">
      <ProductManagementContent />
    </AuthGuard>
  )
}
