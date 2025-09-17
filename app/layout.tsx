import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AppContact } from "@/components/app-contact"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Oriental Group - Premium Argan Oil & Natural Cosmetics from Morocco",
  description:
    "Leading exporter of premium argan oil, prickly pear seed oil, and natural cosmetics from Morocco. USDA and FDA approved products.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">
       
        <AuthProvider> 
          <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AppContact />
          </CartProvider>
        </AuthProvider>
        
      </body>
    </html>
  )
}
