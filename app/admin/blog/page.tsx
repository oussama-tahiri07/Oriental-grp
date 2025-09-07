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
import { Trash2, Edit, Plus, Search, X, Save, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  image_path: string
  category_id: number
  author_id: number
  published_date: string
  is_published: boolean
  created_at: string
  category_name: string
  author_name: string
}

interface BlogCategory {
  id: number
  name: string
  slug: string
}

interface BlogFormData {
  slug: string
  title: string
  excerpt: string
  content: string
  image_path: string
  category_id: string
  published_date: string
  is_published: boolean
}

function BlogManagementContent() {
  const { user } = useAuth()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState<BlogFormData>({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    image_path: "",
    category_id: "",
    published_date: new Date().toISOString().split("T")[0],
    is_published: false,
  })

  useEffect(() => {
    fetchBlogPosts()
    fetchCategories()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch("/api/admin/blog")
      if (response.ok) {
        const data = await response.json()
        setBlogPosts(data)
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/blog-categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const deleteBlogPost = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setBlogPosts(blogPosts.filter((post) => post.slug !== slug))
        setSuccess("Blog post deleted successfully!")
      }
    } catch (error) {
      console.error("Error deleting blog post:", error)
      setError("Failed to delete blog post")
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      image_path: "",
      category_id: "",
      published_date: new Date().toISOString().split("T")[0],
      is_published: false,
    })
    setEditingPost(null)
    setShowAddForm(false)
    setError("")
    setSuccess("")
  }

  const handleEdit = (post: BlogPost) => {
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image_path: post.image_path,
      category_id: post.category_id?.toString() || "",
      published_date: post.published_date ? new Date(post.published_date).toISOString().split("T")[0] : "",
      is_published: post.is_published,
    })
    setEditingPost(post)
    setShowAddForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required")
      return
    }

    try {
      const slug = formData.slug || generateSlug(formData.title)
      const blogData = {
        slug,
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        image_path: formData.image_path.trim() || "/placeholder.svg?height=400&width=600",
        category_id: formData.category_id ? Number.parseInt(formData.category_id) : null,
        author_id: user?.id || 1,
        published_date: formData.published_date || null,
        is_published: formData.is_published,
      }

      const url = editingPost ? `/api/blog/${editingPost.slug}` : "/api/blog"
      const method = editingPost ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      })

      if (response.ok) {
        const savedPost = await response.json()

        if (editingPost) {
          setSuccess("Blog post updated successfully!")
        } else {
          setSuccess("Blog post created successfully!")
        }

        resetForm()
        fetchBlogPosts() // Refresh the list
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save blog post")
      }
    } catch (error) {
      setError("An error occurred while saving the blog post")
      console.error("Error saving blog post:", error)
    }
  }

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Blog Management</h1>
            <p className="text-gray-600 mt-2">Manage your blog posts and articles</p>
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

        {(showAddForm || editingPost) && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{editingPost ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value
                        setFormData({
                          ...formData,
                          title,
                          slug: !editingPost ? generateSlug(title) : formData.slug,
                        })
                      }}
                      placeholder="Enter blog post title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="blog-post-slug"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description of the blog post"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your blog post content here..."
                    rows={10}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="image_path">Image Path</Label>
                    <Input
                      id="image_path"
                      value={formData.image_path}
                      onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
                      placeholder="/images/blog-post.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category_id">Category</Label>
                    <select
                      id="category_id"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="published_date">Published Date</Label>
                    <Input
                      id="published_date"
                      type="date"
                      value={formData.published_date}
                      onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <Label htmlFor="is_published">Published</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    <Save className="h-4 w-4 mr-2" />
                    {editingPost ? "Update Post" : "Create Post"}
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
              <CardTitle>All Blog Posts ({filteredPosts.length})</CardTitle>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {filteredPosts.map((post) => (
                <div key={post.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <div className="flex gap-2">
                          {post.is_published ? (
                            <Badge className="bg-green-500">
                              <Eye className="h-3 w-3 mr-1" />
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Draft
                            </Badge>
                          )}
                          {post.category_name && <Badge variant="outline">{post.category_name}</Badge>}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>By: {post.author_name}</span>
                        <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                        {post.published_date && (
                          <span>Published: {new Date(post.published_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteBlogPost(post.slug)}>
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

export default function BlogManagementPage() {
  return (
    <AuthGuard requiredRole="admin">
      <BlogManagementContent />
    </AuthGuard>
  )
}
