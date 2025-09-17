"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"

interface Product {
  id: number
  title: string
  image_path: string
  sku: string
}

interface AddToCartButtonProps {
  product: Product
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      image_path: product.image_path,
      sku: product.sku,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <Button onClick={handleAddToCart} className={className} variant={isAdded ? "default" : "default"}>
      {isAdded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Added to Quote!
        </>
      ) : (
        <>
          <MessageSquare className="h-4 w-4 mr-2" />
          Request Quote
        </>
      )}
    </Button>
  )
}
