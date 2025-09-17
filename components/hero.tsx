"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Shield, Star, Heart, Users, Award, ArrowRight } from "lucide-react"
import { BookingModal } from "@/components/booking-modal"

export function Hero() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <>
      <section className="relative bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-20 lg:py-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-20 h-20 bg-teal-200 rounded-full opacity-20 animate-float"></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 bg-emerald-200 rounded-full opacity-20 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-20 w-12 h-12 bg-teal-300 rounded-full opacity-20 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Heart className="h-4 w-4 mr-2" />
                  Trusted Women's Healthcare Since 2009
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your Health is Our
                  <span className="text-gradient-teal block">Priority</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Experience world-class healthcare in Jammu with our team of expert gynecologists, state-of-the-art
                  facilities, and personalized care for women at every stage of life.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 group"
                  onClick={() => setIsBookingOpen(true)}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 bg-transparent"
                  onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Our Services
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                <div className="text-center group">
                  <div className="bg-white p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                    <div className="bg-teal-100 p-3 rounded-full w-fit mx-auto mb-3">
                      <Clock className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600 font-medium">Emergency Care</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-white p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                    <div className="bg-emerald-100 p-3 rounded-full w-fit mx-auto mb-3">
                      <Award className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">15+</div>
                    <div className="text-sm text-gray-600 font-medium">Years Experience</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-white p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                    <div className="bg-yellow-100 p-3 rounded-full w-fit mx-auto mb-3">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">4.9</div>
                    <div className="text-sm text-gray-600 font-medium">Patient Rating</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-white p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                    <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-3">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600 font-medium">Happy Patients</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="/placeholder.svg?height=600&width=500"
                    alt="RJ Healthcare - Modern Medical Facility"
                    className="rounded-2xl w-full h-96 object-cover"
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-teal-600 text-white p-6 rounded-2xl shadow-xl z-20 animate-float">
                <div className="text-center">
                  <div className="text-3xl font-bold">98%</div>
                  <div className="text-sm opacity-90">Success Rate</div>
                </div>
              </div>

              <div
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">ISO Certified</div>
                    <div className="text-sm text-gray-600">Quality Healthcare</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}
