"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Navigation,
  MessageCircle,
  Car,
  Wifi,
  Coffee,
  ShipWheelIcon as Wheelchair,
} from "lucide-react"

export function ContactInfo() {
  const handleGetDirections = () => {
    window.open("https://maps.google.com/?q=RJ+Healthcare+Gandhi+Nagar+Jammu", "_blank")
  }

  const handleCall = (number: string) => {
    window.open(`tel:${number}`)
  }

  const handleWhatsApp = () => {
    window.open("https://wa.me/919876543210?text=Hello, I would like to book an appointment at RJ Healthcare", "_blank")
  }

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MapPin className="h-4 w-4 mr-2" />
            Visit Our Clinic
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Conveniently Located in <span className="text-gradient-teal">Jammu</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Located in the heart of Jammu with easy access, ample parking, and modern facilities. We're here to serve
            you with the best healthcare services in a comfortable environment.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-teal-100 p-4 rounded-xl">
                      <MapPin className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Our Address</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        RJ Healthcare Center
                        <br />
                        Gandhi Nagar, Near City Hospital
                        <br />
                        Jammu, Jammu & Kashmir 180004
                        <br />
                        India
                      </p>
                      <Button
                        variant="outline"
                        className="border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
                        onClick={handleGetDirections}
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        Get Directions
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-8">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-4 rounded-xl">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Numbers</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600 font-medium">Reception:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCall("+91-191-2345678")}
                              className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                            >
                              +91-191-2345678
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <span className="text-red-600 font-medium">Emergency:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCall("+91-9876543210")}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100"
                            >
                              +91-9876543210
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="text-blue-600 font-medium">Appointments:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCall("+91-9876543211")}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                            >
                              +91-9876543211
                            </Button>
                          </div>
                        </div>
                        <Button
                          className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full"
                          onClick={handleWhatsApp}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp Us
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-8">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-4 rounded-xl">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Operating Hours</h3>
                        <div className="space-y-3 text-gray-600">
                          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Monday - Friday:</span>
                            <span className="font-bold text-gray-900">8:00 AM - 8:00 PM</span>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Saturday:</span>
                            <span className="font-bold text-gray-900">8:00 AM - 6:00 PM</span>
                          </div>
                          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Sunday:</span>
                            <span className="font-bold text-gray-900">9:00 AM - 2:00 PM</span>
                          </div>
                          <div className="flex justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                            <span className="text-red-600 font-bold">Emergency:</span>
                            <span className="text-red-600 font-bold">24/7 Available</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-8">
                    <div className="flex items-start space-x-4">
                      <div className="bg-orange-100 p-4 rounded-xl">
                        <Mail className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Email Contacts</h3>
                        <div className="space-y-2 text-gray-600">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span>General Inquiries:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEmail("info@rjhealthcare.com")}
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-sm"
                            >
                              info@rjhealthcare.com
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span>Appointments:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEmail("appointments@rjhealthcare.com")}
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-sm"
                            >
                              appointments@rjhealthcare.com
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span>Emergency:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEmail("emergency@rjhealthcare.com")}
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 text-sm"
                            >
                              emergency@rjhealthcare.com
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map & Facilities */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-96 bg-gray-200 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3367.123456789!2d74.8567890!3d32.7266000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDQzJzM2LjAiTiA3NMKwNTEnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RJ Healthcare Location"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-3">Easy to Find</h3>
                <p className="text-gray-600 mb-4">
                  Located on the main road with clear signage and easy access from all parts of Jammu. Public transport
                  and taxi services are readily available.
                </p>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={handleGetDirections}>
                  <Navigation className="mr-2 h-4 w-4" />
                  Open in Google Maps
                </Button>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4">Our Facilities</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg">
                    <Car className="h-5 w-5 text-teal-600" />
                    <span className="text-sm font-medium text-gray-900">Free Parking</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Wifi className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Free WiFi</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                    <Coffee className="h-5 w-5 text-amber-600" />
                    <span className="text-sm font-medium text-gray-900">Cafeteria</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Wheelchair className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Wheelchair Access</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
