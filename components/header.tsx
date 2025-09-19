"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, MapPin, Clock } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <>
      {/* Top Bar */}
      <div className="bg-teal-600 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Emergency: +91-9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Gandhi Nagar, Jammu</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Mon-Sat: 8AM-8PM | Sun: 9AM-2PM</span>
              </div>
            </div>
            <div className="text-teal-100">24/7 Emergency Services Available</div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-3 rounded-xl shadow-lg">
                <span className="font-bold text-xl">RJ</span>
              </div>
              <div>
                <h1 className="font-bold text-2xl text-gray-900">RJ Healthcare</h1>
                <p className="text-sm text-teal-600 font-medium">Women's Health Specialists</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
                Home
              </Link>
              <Link
                href="/doctors"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Our Doctors
              </Link>
              <Link
                href="/bookings"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                My Bookings
              </Link>
              <Link
                href="/procedures"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
              >
                Contact
              </Link>
            </nav>

            {/* CTA & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-teal-600" />
                <span className="font-medium">+91-191-2345678</span>
              </div>

              <Button
                onClick={() => setIsBookingOpen(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Book Appointment
              </Button>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden py-4 border-t bg-gray-50 rounded-b-lg">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-teal-600 font-medium px-4 py-2 rounded-lg hover:bg-white transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/doctors"
                  className="text-gray-700 hover:text-teal-600 font-medium px-4 py-2 rounded-lg hover:bg-white transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Our Doctors
                </Link>
                <Link
                  href="/procedures"
                  className="text-gray-700 hover:text-teal-600 font-medium px-4 py-2 rounded-lg hover:bg-white transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-teal-600 font-medium px-4 py-2 rounded-lg hover:bg-white transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="px-4 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <Phone className="h-4 w-4 text-teal-600" />
                    <span>+91-191-2345678</span>
                  </div>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}
