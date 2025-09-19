"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  required?: boolean
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  placeholder = "Upload an image or enter image path",
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        onChange(result.url)
      } else {
        setError(result.error || "Upload failed")
      }
    } catch (err) {
      setError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const clearImage = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Image Preview */}
      {value && (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
            <Image
              src={value || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => setError("Failed to load image")}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={clearImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Drag and drop an image here, or click to select</p>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Choose File"}
          </Button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>

      {/* Manual Path Input */}
      <div>
        <Label htmlFor="manual-path" className="text-sm text-gray-600">
          Or enter image path manually:
        </Label>
        <Input
          id="manual-path"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1"
        />
      </div>

      <p className="text-xs text-gray-500">Supported formats: JPEG, PNG, WebP, GIF. Maximum size: 5MB.</p>
    </div>
  )
}
