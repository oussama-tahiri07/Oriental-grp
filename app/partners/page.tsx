import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Users, GraduationCap, Heart } from "lucide-react"
import Link from "next/link"

export default function PartnersPage() {
  const partnerLogos = [
    {
      name: "Maroc Export",
      logo: "/placeholder.svg?height=80&width=120",
    },
    {
      name: "Cluster Menara",
      logo: "/placeholder.svg?height=80&width=120",
    },
    {
      name: "FIMABIO",
      logo: "/placeholder.svg?height=80&width=120",
    },
    {
      name: "OSMEX",
      logo: "/placeholder.svg?height=80&width=120",
    },
  ]

  const missionPoints = [
    {
      icon: GraduationCap,
      text: "Improve the education of the children",
    },
    {
      icon: Users,
      text: "Provide socioeconomical opportunities for women and their families",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-600 mb-16 font-serif">OUR PARTNERS</h1>

          {/* BAYTI Association Section */}
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                In order to be an active participant in sustainable development in Morocco, ORIENTAL GROUP co-workers
                have set up a charitable organization:{" "}
                <span className="font-semibold text-blue-600">BAYTI Association</span>. BAYTI Association works with
                local volunteers only, is completely independent of any political or religious affiliations, and is free
                of any commercial influence.
              </p>
            </div>

            {/* Main BAYTI Card */}
            <Card className="mb-12 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-8">
                  {/* BAYTI Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=192&width=192"
                        alt="BAYTI Association"
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                  </div>

                  {/* BAYTI Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6">BAYTI Association</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Financing</h3>
                        <p className="text-gray-700 leading-relaxed">
                          ORIENTAL GROUP offers BAYTI Association a percentage of its turnover for every kilo of oil
                          sold. Thus, every time you buy Morocco's argan oil from ORIENTAL GROUP, you are contributing
                          to BAYTI Association.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mission</h3>
                        <p className="text-gray-700 mb-4">
                          BAYTI Association mission is to support projects that aim to:
                        </p>
                        <div className="space-y-3">
                          {missionPoints.map((point, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <point.icon className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="text-gray-700">{point.text}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <p className="text-gray-700">
                            For More informations:{" "}
                            <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                              <Link href="#" className="flex items-center">
                                Click here
                                <ExternalLink className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partner Organizations */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">We are proud to belong to:</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                {partnerLogos.map((partner, index) => (
                  <div key={index} className="w-full max-w-[150px]">
                    <img
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      className="w-full h-20 object-contain hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 font-serif">Making a Difference Together</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Every purchase you make contributes to sustainable development in Morocco and supports local communities
            through our partnership with BAYTI Association.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/products">View Our Products</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
            >
              <Link href="/contact">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
