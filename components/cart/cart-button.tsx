"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"

export function CartButton({ onClick }: { onClick: () => void }) {
  const { state } = useCart()

  return (
    <Button variant="outline" size="sm" onClick={onClick} className="relative bg-transparent">
      <ShoppingCart className="h-4 w-4" />
      {state.itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {state.itemCount}
        </Badge>
      )}
      <span className="ml-2 hidden sm:inline">Cart ({state.itemCount})</span>
    </Button>
  )
}
