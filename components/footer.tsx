import Link from "next/link"
import { Facebook, Instagram, Youtube, MapPin, Clock, Phone, Mail, X } from "lucide-react"

export function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/grouporiental", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/group_oriental", label: "Instagram" },
    //{ icon: pinterest, href: "https://x.com/BioProGreen_MR", label: "Pinterest" },
    { icon: X, href: "https://x.com/BioProGreen_MR", label: "X" },
    { icon: Youtube, href: "https://www.youtube.com/@orientalgroupsarlau7063", label: "YouTube" },
  ]

  const footerLinks = [
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "/services" },
    { name: "Quality", href: "/quality" },
    { name: "Partners", href: "/partners" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]

  const paymentMethods = [
    "American Express",
    "Apple Pay",
    "Discover",
    "Google Pay",
    "Mastercard",
    "PayPal",
    "Shop Pay",
    "Visa",
  ]

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-white hover:text-orange-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">GROUPE ORIENTAL COMPANY</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>N°1 200 Lot El Massira, Safi Road, 40 100 Marrakech MOROCCO</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Office Phone hours: Monday - Friday</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>9:00 AM to 4:00 PM (Pacific Time)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Local pickup hours: Fridays Only 10 AM - 2 PM</span>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:contact@groupe-oriental.com" className="hover:text-orange-400">
                  contact@groupe-oriental.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>Tel1: +212 67 543 86 58</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>Tel2: +212 67 543 74 58</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>Fax: +212 524 457 961</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Links */}
            <div className="flex flex-wrap justify-center md:justify-start space-x-4 text-sm">
              {footerLinks.map((link, index) => (
                <span key={link.name}>
                  <Link href={link.href} className="hover:text-orange-400">
                    {link.name}
                  </Link>
                  {index < footerLinks.length - 1 && <span className="ml-4">|</span>}
                </span>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="flex space-x-2">
              {paymentMethods.map((method) => (
                <div
                  key={method}
                  className="w-8 h-5 bg-white rounded text-xs flex items-center justify-center text-gray-800 font-bold"
                >
                  {method.slice(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-gray-300 mt-4">© 2024 Oriental Group Company.</div>
        </div>
      </div>
    </footer>
  )
}
