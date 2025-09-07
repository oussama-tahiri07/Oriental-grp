"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}

const CHATBOT_RESPONSES = {
  greeting: [
    "Hello! Welcome to Oriental Group. How can I help you today?",
    "Hi there! I'm here to help you learn about our premium argan oil products and services.",
    "Welcome! I can answer questions about our products, services, or company. What would you like to know?",
  ],
  products: [
    "We offer premium Moroccan products including 100% pure argan oil, prickly pear seed oil, ghassoul clay, and black soap. All our products are certified organic and USDA/FDA approved.",
    "Our main products are: Virgin Argan Oil (pure & deodorized), Toasted Argan Oil, Prickly Pear Seed Oil, Moroccan Ghassoul Clay, and Black Soap with lavender or eucalyptus.",
  ],
  services: [
    "We provide comprehensive private label services including bottling, custom labeling, casing, stickers, multilingual labels, and complete branding solutions. Minimum orders vary by service.",
    "Our services include: Private label bottling, custom label design, packaging solutions, multilingual labeling, and complete branding services for your business needs.",
  ],
  quality: [
    "All our products are certified organic with CCPB®, USDA®, and FDA® certifications. We ensure quality through vertical integration and strict quality control processes.",
    "Quality is our priority! We're certified by international standards and use environmentally conscious methods with skilled workers overseeing every detail.",
  ],
  contact: [
    "You can reach us at +212 67 543 86 58 or contact@groupe-oriental.com. Our office is located at Lot El Massira, Safi Road, 40100 Marrakech, Morocco.",
    "Contact us: Phone: +212 67 543 86 58, Email: contact@groupe-oriental.com. Office hours: Monday-Friday 9:00 AM to 4:00 PM (Pacific Time).",
  ],
  partnership: [
    "We partner with BAYTI Association to support sustainable development in Morocco, focusing on education and socioeconomic opportunities for women and families.",
    "Through our partnership with BAYTI Association, a percentage of every sale goes toward improving education and providing opportunities for Moroccan communities.",
  ],
  default: [
    "I'd be happy to help! You can ask me about our products, services, quality standards, contact information, or partnerships.",
    "I can provide information about our argan oil products, private label services, certifications, or how to contact us. What interests you most?",
    "Feel free to ask about our premium Moroccan products, manufacturing services, quality certifications, or company partnerships!",
  ],
}

const getRandomResponse = (responses: string[]) => {
  return responses[Math.floor(Math.random() * responses.length)]
}

const getBotResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase()

  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return getRandomResponse(CHATBOT_RESPONSES.greeting)
  }

  if (
    message.includes("product") ||
    message.includes("argan") ||
    message.includes("oil") ||
    message.includes("ghassoul") ||
    message.includes("soap")
  ) {
    return getRandomResponse(CHATBOT_RESPONSES.products)
  }

  if (
    message.includes("service") ||
    message.includes("label") ||
    message.includes("bottling") ||
    message.includes("packaging")
  ) {
    return getRandomResponse(CHATBOT_RESPONSES.services)
  }

  if (
    message.includes("quality") ||
    message.includes("certified") ||
    message.includes("organic") ||
    message.includes("usda") ||
    message.includes("fda")
  ) {
    return getRandomResponse(CHATBOT_RESPONSES.quality)
  }

  if (
    message.includes("contact") ||
    message.includes("phone") ||
    message.includes("email") ||
    message.includes("address")
  ) {
    return getRandomResponse(CHATBOT_RESPONSES.contact)
  }

  if (
    message.includes("partner") ||
    message.includes("bayti") ||
    message.includes("association") ||
    message.includes("sustainable")
  ) {
    return getRandomResponse(CHATBOT_RESPONSES.partnership)
  }

  if (message.includes("price") || message.includes("cost") || message.includes("quote")) {
    return "For pricing information and quotes, please contact us directly at +212 67 543 86 58 or contact@groupe-oriental.com. Our team will provide you with detailed pricing based on your specific needs."
  }

  if (message.includes("shipping") || message.includes("delivery")) {
    return "We ship worldwide! Shipping options and costs depend on your location and order size. Please contact us for specific shipping information to your area."
  }

  return getRandomResponse(CHATBOT_RESPONSES.default)
}

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to Oriental Group. I'm here to help you learn about our premium Moroccan argan oil products and services. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(inputValue),
          isBot: true,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <Card className="w-80 h-96 shadow-2xl border-2 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-sm font-semibold">Oriental Group Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-blue-800 h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-blue-100 mt-1">Ask me about our products & services</p>
        </CardHeader>

        <CardContent className="p-0 h-64 flex flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}>
                  {message.isBot && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-2 rounded-lg text-sm ${
                      message.isBot ? "bg-gray-100 text-gray-800" : "bg-blue-600 text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                  {!message.isBot && (
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="bg-gray-100 text-gray-800 p-2 rounded-lg text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our products..."
                className="flex-1 text-sm"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
