"use client"

import { useState } from "react"
import { MessageCircle, Bot, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Chatbot from "./chatbot"

export function AppContact() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  const handleWhatsAppClick = () => {
    const phoneNumber = "+212675438658"
    const message = "Hello, I'm interested in your products."
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setIsExpanded(false)
  }

  const handleChatbotClick = () => {
    setIsChatbotOpen(true)
    setIsExpanded(false)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false)
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        {isExpanded && (
          <div className="mb-2 space-y-2">
            <Button
              onClick={handleWhatsAppClick}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg w-full flex items-center justify-start"
              size="sm"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="ml-2">WhatsApp</span>
            </Button>
            <Button
              onClick={handleChatbotClick}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg w-full flex items-center justify-start"
              size="sm"
            >
              <Bot className="h-5 w-5" />
              <span className="ml-2">Chatbot</span>
            </Button>
          </div>
        )}

        <Button
          onClick={toggleExpanded}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 shadow-lg"
          size="sm"
        >
          {isExpanded ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          <span className="ml-2 hidden sm:inline">{isExpanded ? "Close" : "Contact us"}</span>
        </Button>
      </div>

      <Chatbot isOpen={isChatbotOpen} onClose={handleCloseChatbot} />
    </>
  )
}
