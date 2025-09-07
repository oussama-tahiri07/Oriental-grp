import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag } from "lucide-react"

// This would typically come from a CMS or database
const getBlogPost = (slug: string) => {
  const posts = {
    "benefits-prickly-pear-seed-oil": {
      title: "The Benefits of Prickly Pear Seed Oil",
      content: `
        <h2>The Ultimate Natural Elixir for Your Beauty</h2>
        <p>Recognized as one of the most valuable vegetable oils in the world, Prickly Pear Seed Oil is a true natural treasure. Thanks to its rich nutrient content and exceptional cosmetic properties, it is becoming increasingly popular in the beauty industry.</p>
        
        <h3>What Makes Prickly Pear Seed Oil Special?</h3>
        <p>Prickly pear seed oil is extracted from the seeds of the Opuntia ficus-indica cactus, which grows in the arid regions of Morocco. This oil is incredibly rich in:</p>
        <ul>
          <li>Vitamin E (tocopherols) - up to 1000mg per liter</li>
          <li>Essential fatty acids, particularly linoleic acid</li>
          <li>Antioxidants that protect against free radicals</li>
          <li>Amino acids that nourish and repair the skin</li>
        </ul>
        
        <h3>Benefits for Your Skin</h3>
        <p>This precious oil offers numerous benefits:</p>
        <ul>
          <li><strong>Anti-aging properties:</strong> Reduces fine lines and wrinkles</li>
          <li><strong>Deep hydration:</strong> Penetrates deeply without leaving a greasy residue</li>
          <li><strong>Skin repair:</strong> Helps heal scars and blemishes</li>
          <li><strong>Brightening effect:</strong> Evens out skin tone and reduces dark spots</li>
        </ul>
        
        <h3>How to Use Prickly Pear Seed Oil</h3>
        <p>For best results, apply a few drops to clean skin in the evening. The oil absorbs quickly and works overnight to repair and rejuvenate your skin. It can also be mixed with your favorite moisturizer or used as a hair treatment for dry, damaged hair.</p>
        
        <p>At Oriental Group, we source our prickly pear seed oil directly from Moroccan cooperatives, ensuring the highest quality and supporting local communities.</p>
      `,
      image: "/placeholder-bldx0.png",
      date: "2024-01-15",
      category: "Products",
      author: "Oriental Group Team",
    },
  }

  return posts[slug as keyof typeof posts] || null
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Article */}
        <Card className="overflow-hidden">
          {/* Hero Image */}
          <div className="aspect-video overflow-hidden">
            <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <CardContent className="p-8">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                {post.category}
              </div>
              <div>By {post.author}</div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-serif">{post.title}</h1>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-serif prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-blue-900 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 font-serif">Interested in Our Products?</h3>
              <p className="text-lg mb-6">Discover our full range of premium Moroccan natural beauty products.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  View Products
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
