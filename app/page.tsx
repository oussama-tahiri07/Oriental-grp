"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const carouselSlides = [
    {
      title: "100% Virgin Argan Oil",
      subtitle: "Fresh from Morocco",
      description: "Premium quality for hair, skin, and cooking. USDA and FDA approved.",
      image: "/home-page-1.jpg?height=600&width=1200",
    },
    {
      title: "Natural Moroccan Beauty",
      subtitle: "Authentic & Organic",
      description: "Discover the secrets of Moroccan women's beauty rituals with our pure natural products.",
      image: "/home-page-2-1.jpg?height=600&width=1200",
    },
    {
      title: "Sustainable & Ethical",
      subtitle: "Supporting Local Communities",
      description: "Every purchase supports BAYTI Association and sustainable development in Morocco.",
      image: "/home-page3-1.jpg?height=600&width=1200",
    },
  ]

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })

    // Auto-play functionality - advance every 4 seconds
    const interval = setInterval(() => {
      api.scrollNext()
    }, 4000)

    return () => clearInterval(interval)
  }, [api])

  const products = [
    {
      title: "Certified Virgin Argan Oil",
      description:
        "This oil works at 100% of natural and everyone is very popular worldwide & very rare oil in the world.",
      image: "/home-page-1.jpg?height=200&width=200",
    },
    {
      title: "Pure & Certified Organic Virgin and deodorized Argan Oil",
      description:
        "For centuries the women of Morocco have been obtained benefits for their youthful faces and lush...",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Pure prickly pear seed oil",
      description:
        "Prickly pear seed oil is a powerful anti-wrinkle and firming the skin remarkable. The Berber women used the prickly pear oil...",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Organic virgin and toasted argan oil",
      description: "Process of obtaining: First cold pressed Nutritional value: Argan toasted...",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Moroccan Black soap",
      description:
        "Moroccan black soap is a dark creamy texture which is used to remove toxins from the body and prepare the skin for exfoliation...",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Ghassoul",
      description:
        "100% natural. Harvested from preserved places, from their pollution, their dried naturally in the sun, then sieved and...",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const features = [
    {
      title: "About us ?",
      description:
        "Oriental Group offers a branding service for this customers planning to penetrate their local markets, using their own...",
      buttonText: "Read More",
      href: "/about",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Bottling private label argan oil",
      description:
        "We have many varieties of bottles and containers at our disposal, of course the client may supply their own...",
      buttonText: "Read More",
      href: "/services",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Our Products",
      description: "Oriental Group is an argan oil and natural cosmetics from Morocco. We are the leading argan oil...",
      buttonText: "Read More",
      href: "/products",
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="relative">
        <Carousel
          className="w-full"
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {carouselSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[600px] flex items-center justify-center text-white">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url('${slide.image}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold font-serif mb-4">{slide.title}</h1>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-orange-400">{slide.subtitle}</h2>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">{slide.description}</p>
                    <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Link href="/products">
                        Explore Products
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-900">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{feature.description}</p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href={feature.href}>
                      {feature.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-serif">OUR PRODUCTS</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={index} className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 text-green-400">{product.title}</h3>
                      <p className="text-gray-300 text-sm line-clamp-3">{product.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">PARTNERS</h2>

          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-600 mb-8">
              In order to be an active participant in sustainable development in Morocco, ORIENTAL GROUP co-workers have
              set up a charitable organization: BAYTI Association.
            </p>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src="/placeholder.svg?height=128&width=128"
                    alt="BAYTI Association"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-600 mb-4">
                    BAYTI Association works with local volunteers only, is completely independent of any political or
                    religious affiliations, and is free of any commercial influence.
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>Financing:</strong> ORIENTAL GROUP offers BAYTI Association a percentage of its turnover for
                    every kilo of oil sold. Thus, every time you buy Morocco's argan oil from ORIENTAL GROUP, you are
                    contributing to BAYTI Association.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center justify-items-center">
              <img src="/placeholder.svg?height=80&width=120" alt="Maroc Export" className="h-12 object-contain" />
              <img src="/placeholder.svg?height=80&width=120" alt="Cluster Menara" className="h-12 object-contain" />
              <img src="/placeholder.svg?height=80&width=120" alt="FIMABIO" className="h-12 object-contain" />
              <img src="/placeholder.svg?height=80&width=120" alt="OSMEX" className="h-12 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">The Benefits of Prickly Pear Seed Oil</h2>
            <p className="text-xl mb-4">The ultimate natural elixir for your beauty</p>
            <p className="text-lg mb-8 max-w-3xl mx-auto">
              Recognized as one of the most valuable vegetable oils in the world, Prickly Pear Seed Oil is a true
              natural treasure. Thanks to its rich nutrient content and exceptional cosmetic properties, it is
              becoming...
            </p>
            <Button asChild variant="outline" className="text-teal-600 border-white hover:bg-white bg-transparent">
              <Link href="/blog">Read More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
