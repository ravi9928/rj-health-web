"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookingModal } from "@/components/booking-modal"
import {
  Search,
  Filter,
  Clock,
  DollarSign,
  Calendar,
  Heart,
  Stethoscope,
  Baby,
  Eye,
  Bone,
  Activity,
  Microscope,
  Shield,
  Star,
} from "lucide-react"

const procedures = [
  {
    id: 1,
    name: "Laparoscopic Surgery",
    category: "Gynecology",
    description:
      "Minimally invasive surgical technique for gynecological conditions with faster recovery and minimal scarring.",
    duration: "1-3 hours",
    price: "₹25,000 - ₹50,000",
    icon: Heart,
    color: "bg-pink-100 text-pink-600",
    features: ["Minimal scarring", "Faster recovery", "Less pain", "Same-day discharge possible"],
    preparation: [
      "Fasting 8-12 hours before surgery",
      "Pre-operative blood tests",
      "Anesthesia consultation",
      "Remove jewelry and makeup",
    ],
    aftercare: ["Rest for 24-48 hours", "Avoid heavy lifting", "Follow-up in 1 week", "Watch for signs of infection"],
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 2,
    name: "Endoscopy",
    category: "Gastroenterology",
    description: "Diagnostic procedure to examine the digestive tract using a flexible tube with a camera.",
    duration: "30-60 minutes",
    price: "₹3,000 - ₹8,000",
    icon: Stethoscope,
    color: "bg-blue-100 text-blue-600",
    features: ["Real-time visualization", "Biopsy capability", "Therapeutic interventions", "Minimal discomfort"],
    preparation: [
      "Fasting 8-12 hours",
      "Stop certain medications",
      "Arrange transportation",
      "Wear comfortable clothes",
    ],
    aftercare: [
      "Rest until sedation wears off",
      "Start with clear liquids",
      "Avoid alcohol for 24 hours",
      "Report unusual symptoms",
    ],
    rating: 4.8,
    reviews: 89,
  },
  {
    id: 3,
    name: "Vaccination Program",
    category: "Pediatrics",
    description: "Comprehensive immunization program for children following national vaccination schedule.",
    duration: "15-30 minutes",
    price: "₹500 - ₹2,000",
    icon: Baby,
    color: "bg-green-100 text-green-600",
    features: [
      "WHO approved vaccines",
      "Age-appropriate schedule",
      "Digital vaccination record",
      "Minimal side effects",
    ],
    preparation: [
      "Bring vaccination card",
      "Child should be healthy",
      "Light meal before visit",
      "Comfortable clothing",
    ],
    aftercare: [
      "Monitor for fever",
      "Apply cold compress if swelling",
      "Give plenty of fluids",
      "Schedule next appointment",
    ],
    rating: 4.9,
    reviews: 234,
  },
  {
    id: 4,
    name: "Cataract Surgery",
    category: "Ophthalmology",
    description: "Advanced phacoemulsification technique to remove cataracts and restore clear vision.",
    duration: "20-30 minutes",
    price: "₹15,000 - ₹35,000",
    icon: Eye,
    color: "bg-purple-100 text-purple-600",
    features: ["Micro-incision technique", "Premium IOL options", "Same-day procedure", "Quick recovery"],
    preparation: ["Eye examination", "Biometry measurements", "Stop blood thinners", "Arrange transportation"],
    aftercare: ["Use prescribed eye drops", "Wear eye shield at night", "Avoid rubbing eyes", "Follow-up appointments"],
    rating: 4.8,
    reviews: 67,
  },
  {
    id: 5,
    name: "Joint Replacement",
    category: "Orthopedics",
    description: "Advanced joint replacement surgery for knee and hip joints using latest prosthetic technology.",
    duration: "2-4 hours",
    price: "₹1,50,000 - ₹3,00,000",
    icon: Bone,
    color: "bg-orange-100 text-orange-600",
    features: [
      "Computer-assisted surgery",
      "High-quality implants",
      "Minimally invasive approach",
      "Physiotherapy support",
    ],
    preparation: [
      "Complete medical evaluation",
      "Blood tests and X-rays",
      "Dental clearance",
      "Pre-operative counseling",
    ],
    aftercare: ["Hospital stay 3-5 days", "Physiotherapy program", "Regular follow-ups", "Activity modifications"],
    rating: 4.7,
    reviews: 45,
  },
  {
    id: 6,
    name: "Cardiac Catheterization",
    category: "Cardiology",
    description: "Diagnostic and therapeutic procedure to examine heart function and treat blockages.",
    duration: "1-2 hours",
    price: "₹25,000 - ₹75,000",
    icon: Activity,
    color: "bg-red-100 text-red-600",
    features: ["Real-time heart imaging", "Angioplasty capability", "Stent placement", "Minimal invasive"],
    preparation: ["Fasting 6-8 hours", "Blood tests", "ECG and chest X-ray", "Medication review"],
    aftercare: ["Bed rest 4-6 hours", "Monitor puncture site", "Drink plenty of fluids", "Cardiac rehabilitation"],
    rating: 4.8,
    reviews: 78,
  },
  {
    id: 7,
    name: "MRI Scan",
    category: "Diagnostics",
    description: "High-resolution magnetic resonance imaging for detailed internal body structure visualization.",
    duration: "30-90 minutes",
    price: "₹4,000 - ₹12,000",
    icon: Microscope,
    color: "bg-teal-100 text-teal-600",
    features: ["3T MRI technology", "No radiation exposure", "Detailed soft tissue imaging", "Multiple body parts"],
    preparation: ["Remove metal objects", "Inform about implants", "Comfortable clothing", "May require contrast"],
    aftercare: [
      "No special restrictions",
      "Drink water if contrast used",
      "Results in 24-48 hours",
      "Discuss with doctor",
    ],
    rating: 4.6,
    reviews: 123,
  },
  {
    id: 8,
    name: "Prenatal Care Package",
    category: "Gynecology",
    description: "Comprehensive pregnancy care package including regular check-ups, tests, and delivery.",
    duration: "9 months",
    price: "₹15,000 - ₹35,000",
    icon: Heart,
    color: "bg-pink-100 text-pink-600",
    features: ["Regular check-ups", "Ultrasound scans", "Blood tests", "Delivery care"],
    preparation: ["Confirm pregnancy", "Medical history review", "Lifestyle counseling", "Nutritional guidance"],
    aftercare: ["Postnatal check-ups", "Breastfeeding support", "Baby care guidance", "Family planning counseling"],
    rating: 4.9,
    reviews: 189,
  },
]

const categories = [
  "All Categories",
  "Gynecology",
  "Gastroenterology",
  "Pediatrics",
  "Ophthalmology",
  "Orthopedics",
  "Cardiology",
  "Diagnostics",
]

export function ProceduresListing() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedProcedure, setSelectedProcedure] = useState<(typeof procedures)[0] | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const filteredProcedures = procedures.filter((procedure) => {
    const matchesSearch =
      procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || procedure.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleBookProcedure = (procedure: (typeof procedures)[0]) => {
    setSelectedProcedure(procedure)
    setIsBookingOpen(true)
  }

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Shield className="h-4 w-4 mr-2" />
              Medical Procedures & Services
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Advanced Medical <span className="text-gradient-teal">Procedures</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive range of medical procedures and services using state-of-the-art technology and latest
              medical techniques for optimal patient outcomes.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search procedures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Showing {filteredProcedures.length} of {procedures.length} procedures
                </span>
              </div>
            </div>
          </div>

          {/* Procedures Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProcedures.map((procedure) => {
              const IconComponent = procedure.icon
              return (
                <Card
                  key={procedure.id}
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg overflow-hidden bg-white"
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-3 rounded-xl ${procedure.color} group-hover:scale-110 transition-transform duration-200`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{procedure.rating}</span>
                          <span className="text-xs text-gray-500">({procedure.reviews})</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                            {procedure.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs bg-teal-50 text-teal-700">
                            {procedure.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{procedure.description}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{procedure.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-teal-600 font-semibold">
                            <DollarSign className="h-4 w-4" />
                            <span>{procedure.price}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-700">Key Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {procedure.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                {feature}
                              </Badge>
                            ))}
                            {procedure.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                +{procedure.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t space-y-3">
                      <Button
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                        onClick={() => handleBookProcedure(procedure)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Consultation
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
                      >
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredProcedures.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Shield className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No procedures found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or browse all procedures.</p>
              </div>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All Categories")
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedProcedure={selectedProcedure}
      />
    </>
  )
}
