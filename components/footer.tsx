import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Clock, Heart, Award, Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-teal-600 text-white p-3 rounded-xl">
                <span className="font-bold text-xl">RJ</span>
              </div>
              <div>
                <h3 className="font-bold text-2xl">RJ Healthcare</h3>
                <p className="text-teal-400 text-sm font-medium">Women's Health Specialists</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Providing exceptional healthcare services in Jammu with state-of-the-art facilities, experienced doctors,
              and compassionate care for women and families for over 15 years.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Award className="h-4 w-4 text-teal-400" />
                <span className="text-gray-400">ISO 9001:2015 Certified</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-teal-600 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-teal-600 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-teal-600 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-teal-600 transition-colors duration-200">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-teal-400">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-teal-600 rounded-full mr-3"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/doctors"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-teal-600 rounded-full mr-3"></span>
                  Our Doctors
                </Link>
              </li>
              <li>
                <Link
                  href="/procedures"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-teal-600 rounded-full mr-3"></span>
                  Medical Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-teal-600 rounded-full mr-3"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/book-appointment"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <span className="w-2 h-2 bg-teal-600 rounded-full mr-3"></span>
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Medical Services */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-teal-400">Medical Specialties</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <Heart className="h-4 w-4 mr-3 text-teal-600" />
                  Gynecology & Obstetrics
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <Heart className="h-4 w-4 mr-3 text-teal-600" />
                  Gastroenterology
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <Heart className="h-4 w-4 mr-3 text-teal-600" />
                  Pediatrics
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <Heart className="h-4 w-4 mr-3 text-teal-600" />
                  Cardiology
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <Shield className="h-4 w-4 mr-3 text-teal-600" />
                  Emergency Care
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-teal-400">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-teal-600 flex-shrink-0 mt-1" />
                <div className="text-gray-400 text-sm leading-relaxed">
                  RJ Healthcare Center
                  <br />
                  Gandhi Nagar, Jammu
                  <br />
                  J&K - 180004, India
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-teal-600 flex-shrink-0" />
                <div>
                  <a
                    href="tel:+919876543210"
                    className="text-gray-400 hover:text-white transition-colors text-sm block"
                  >
                    +91-9876543210 (Emergency)
                  </a>
                  <a href="tel:+911912345678" className="text-gray-400 hover:text-white transition-colors text-sm">
                    +91-191-2345678 (Reception)
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-teal-600 flex-shrink-0" />
                <a
                  href="mailto:info@rjhealthcare.com"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  info@rjhealthcare.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-teal-600 flex-shrink-0 mt-1" />
                <div className="text-gray-400 text-sm leading-relaxed">
                  Mon-Fri: 8AM-8PM
                  <br />
                  Sat: 8AM-6PM
                  <br />
                  Sun: 9AM-2PM
                  <br />
                  <span className="text-red-400 font-medium">Emergency: 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 RJ Healthcare. All rights reserved. | Designed with care for better health.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
