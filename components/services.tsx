"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Baby,
  Stethoscope,
  Eye,
  Bone,
  Brain,
  Activity,
  Microscope,
  ArrowRight,
  Calendar,
  Clock,
  Star,
} from "lucide-react"
import { BookingModal } from "@/components/booking-modal"

const services = [
  {
    id: 1,
    name: "Gynecology & Obstetrics",
    description:
      "Comprehensive women's health services including pregnancy care, fertility treatments, and gynecological procedures with personalized attention.",
    icon: Heart,
    features: [
      "Prenatal Care",
      "High-Risk Pregnancy",
      "Laparoscopic Surgery",
      "Infertility Treatment",
      "PCOS Management",
      "Menopause Care",
    ],
    color: "bg-pink-100 text-pink-600",
    gradient: "from-pink-50 to-rose-50",
    price: "₹800 onwards",
    duration: "30-45 mins",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Gastroenterology",
    description:
      "Advanced digestive system care with state-of-the-art endoscopy facilities and comprehensive treatment options.",
    icon: Stethoscope,
    features: ["Endoscopy", "Colonoscopy", "Liver Diseases", "IBD Treatment", "Acid Reflux", "Gallbladder Care"],
    color: "bg-blue-100 text-blue-600",
    gradient: "from-blue-50 to-cyan-50",
    price: "₹900 onwards",
    duration: "45-60 mins",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Pediatrics",
    description:
      "Complete child healthcare from newborn care to adolescent medicine with specialized pediatric expertise and family-centered approach.",
    icon: Baby,
    features: [
      "Newborn Care",
      "Vaccination",
      "Growth Monitoring",
      "Pediatric Surgery",
      "Child Development",
      "Nutrition Counseling",
    ],
    color: "bg-green-100 text-green-600",
    gradient: "from-green-50 to-emerald-50",
    price: "₹700 onwards",
    duration: "30 mins",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Ophthalmology",
    description:
      "Comprehensive eye care services including routine check-ups, advanced surgery, and vision correction with latest technology.",
    icon: Eye,
    features: [
      "Cataract Surgery",
      "Retinal Care",
      "Glaucoma Treatment",
      "LASIK",
      "Diabetic Eye Care",
      "Pediatric Eye Care",
    ],
    color: "bg-purple-100 text-purple-600",
    gradient: "from-purple-50 to-violet-50",
    price: "₹600 onwards",
    duration: "30-45 mins",
    rating: 4.7,
  },
  {
    id: 5,
    name: "Orthopedics",
    description:
      "Expert bone and joint care with advanced surgical and non-surgical treatment options for all age groups.",
    icon: Bone,
    features: [
      "Joint Replacement",
      "Sports Medicine",
      "Fracture Care",
      "Arthroscopy",
      "Spine Surgery",
      "Physiotherapy",
    ],
    color: "bg-orange-100 text-orange-600",
    gradient: "from-orange-50 to-amber-50",
    price: "₹800 onwards",
    duration: "45 mins",
    rating: 4.8,
  },
  {
    id: 6,
    name: "Neurology",
    description:
      "Specialized care for neurological conditions with advanced diagnostic capabilities and comprehensive treatment plans.",
    icon: Brain,
    features: [
      "Stroke Care",
      "Epilepsy Treatment",
      "Headache Management",
      "Neurological Surgery",
      "Memory Disorders",
      "Movement Disorders",
    ],
    color: "bg-indigo-100 text-indigo-600",
    gradient: "from-indigo-50 to-blue-50",
    price: "₹1000 onwards",
    duration: "60 mins",
    rating: 4.9,
  },
  {
    id: 7,
    name: "Cardiology",
    description:
      "Comprehensive heart care with advanced cardiac diagnostics, interventional procedures, and preventive cardiology.",
    icon: Activity,
    features: [
      "ECG",
      "Echocardiography",
      "Cardiac Catheterization",
      "Pacemaker",
      "Heart Surgery",
      "Cardiac Rehabilitation",
    ],
    color: "bg-red-100 text-red-600",
    gradient: "from-red-50 to-pink-50",
    price: "₹900 onwards",
    duration: "45-60 mins",
    rating: 4.8,
  },
  {
    id: 8,
    name: "Diagnostics",
    description:
      "State-of-the-art diagnostic services with latest imaging and laboratory technologies for accurate and timely results.",
    icon: Microscope,
    features: ["MRI", "CT Scan", "Ultrasound", "Laboratory Tests", "X-Ray", "Pathology"],
    color: "bg-teal-100 text-teal-600",
    gradient: "from-teal-50 to-cyan-50",
    price: "₹500 onwards",
    duration: "15-30 mins",
    rating: 4.7,
  },
]

export function Services() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  return (
    <>
      <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Heart className="h-4 w-4 mr-2" />
              Comprehensive Healthcare Services
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Medical <span className="text-gradient-teal">Specialties</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a comprehensive range of medical services with state-of-the-art facilities, experienced
              healthcare professionals, and personalized care for every patient.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <Card
                  key={service.id}
                  className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-gradient-to-br ${service.gradient}`}
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-3 rounded-xl ${service.color} group-hover:scale-110 transition-transform duration-200`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{service.rating}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{service.duration}</span>
                          </div>
                          <div className="font-semibold text-teal-600">{service.price}</div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-700">Key Services:</p>
                          <div className="flex flex-wrap gap-1">
                            {service.features.slice(0, 3).map((feature, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-white/70 text-gray-700 hover:bg-white"
                              >
                                {feature}
                              </Badge>
                            ))}
                            {service.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                +{service.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/50">
                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white group-hover:shadow-lg transition-all duration-200"
                        onClick={() => setIsBookingOpen(true)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Consultation
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-xl bg-transparent"
            >
              View All Services & Procedures
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  )
}
