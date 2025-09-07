import { Card, CardContent } from "@/components/ui/card"
import { Heart, Lightbulb, Shield, Settings, Leaf, CheckCircle } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Responsibility",
      description: "We treat our clients with respect and professionalism.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "The inventiveness of Oriental Group allows us to meet our clients' needs. Everyone works and is committed to client satisfaction and the success of the company.",
    },
    {
      icon: Shield,
      title: "Authenticity",
      description: "We are committed to providing a product of Moroccan origin, with sincerity and dedication.",
    },
  ]

  const commitments = [
    {
      icon: Settings,
      title: "Vertical Integration",
      description:
        "Oriental Group successfully ensures the remarkable quality of its products through the vertical integration of its productions.",
    },
    {
      icon: Leaf,
      title: "Organic Daily",
      description:
        "Oriental Group aims to meet market needs, which is why we are committed to sustainable and organic farming, respecting standards.",
    },
    {
      icon: CheckCircle,
      title: "Compliance with Standards",
      description: "All our products are certified according to current international standards.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-amber-800 to-amber-600 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{
            backgroundImage: "url('/placeholder.svg?height=500&width=1200')",
          }}
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-4">WHO ARE WE ?</h1>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-serif">OUR VALUES</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-blue-100 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitments Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800 font-serif">Our Commitments</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {commitments.map((commitment, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <commitment.icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">{commitment.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{commitment.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-serif">
            Learn More About Oriental Group
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* History */}
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-white">History</h3>
                <p className="text-gray-300 leading-relaxed">
                  ORIENTAL GROUP, a leader in the export of argan oil and natural cosmetics from Morocco.
                </p>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-white">Our Certifications</h3>
                <p className="text-gray-300 leading-relaxed">
                  To offer you our organic products, Oriental Group relies on three certifying bodies: CCPB®, USDA®, and
                  FDA®
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 font-serif">Ready to Work With Us?</h2>
          <p className="text-xl mb-8">
            Discover our premium organic products and learn about our wholesale opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View Our Products
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
