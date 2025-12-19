import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Contact Details */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">Email: info@example.com</p>
            <p className="text-gray-400">Phone: +880 123 456 7890</p>
            <p className="text-gray-400">Address: 123 Main St, Dhaka, Bangladesh</p>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400">
                <Facebook size={28} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400">
                <Twitter size={28} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400">
                <Instagram size={28} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-lime-400">
                <Linkedin size={28} />
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Working Hours</h3>
            <p className="text-gray-400">Mon - Fri: 9:00 AM - 7:00 PM</p>
            <p className="text-gray-400">Sat - Sun: Closed</p>
          </div>

          {/* Copyright Information */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">© 2025 Chef Bazar</h3>
            <p className="text-gray-400">All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
