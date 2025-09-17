"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EmergencyBanner } from "@/components/emergency-banner"
import { ProceduresListing } from "@/components/procedures-listing"

const procedures = [
  {
    id: 1,
    name: "Laparoscopy",
    slug: "laparoscopy",
    category: "Gynecology",
    description: "Minimally invasive surgical procedure for diagnosing and treating gynecological conditions.",
    duration: "60-90 minutes",
    price: 25000,
    image: "/placeholder.svg?height=200&width=300",
    doctor: "Dr. Samita Bhat",
    preparation: "Fasting required 8 hours before procedure",
    recovery: "1-2 days hospital stay",
  },
  {
    id: 2,
    name: "Endoscopy",
    slug: "endoscopy",
    category: "Gastroenterology",
    description: "Diagnostic procedure to examine the digestive tract using a flexible tube with camera.",
    duration: "30-45 minutes",
    price: 8000,
    image: "/placeholder.svg?height=200&width=300",
    doctor: "Dr. Rajesh Kumar",
    preparation: "Fasting required 12 hours before procedure",
    recovery: "Same day discharge",
  },
  {
    id: 3,
    name: "Colonoscopy",
    slug: "colonoscopy",
    category: "Gastroenterology",
    description: "Examination of the large intestine to detect abnormalities and screen for cancer.",
    duration: "45-60 minutes",
    price: 12000,
    image: "/placeholder.svg?height=200&width=300",
    doctor: "Dr. Rajesh Kumar",
    preparation: "Bowel preparation required 24 hours before",
    recovery: "Same day discharge",
  },
  {
    id: 4,
    name: "Echocardiogram",
    slug: "echocardiogram",
    category: "Cardiology",
    description: "Ultrasound test to evaluate heart structure and function.",
    duration: "30-45 minutes",
    price: 3500,
    image: "/placeholder.svg?height=200&width=300",
    doctor: "Dr. Amit Singh",
    preparation: "No special preparation required",
    recovery: "Immediate results",
  },
  {
    id: 5,
    name: "Cataract Surgery",
    slug: "cataract-surgery",
    category: "Ophthalmology",
    description: "Surgical removal of clouded lens and replacement with artificial lens.",
    duration: "20-30 minutes",
    price: 35000,
    image: "/placeholder.svg?height=200&width=300",
    doctor: "Dr. Priya Sharma",
    preparation: "Eye drops required before surgery",
    recovery: "1-2 weeks recovery period",
  },
  {
    id: 6,
    name: "Joint Replacement",
    slug: "joint-replacement",
    category: "Orthopedics",
    description: "Surgical replacement of damaged joint with artificial joint.",
    duration: "2-3 hours",
    price: 150000,
    image: "/placeholder.svg?height=200&width=300",
    doctor: "Dr. Vikram Malhotra",
    preparation: "Pre-operative assessment required",
    recovery: "4-6 weeks recovery period",
  },
  {
    id: 7,
    name: "Skin Biopsy",
    slug: "skin-biopsy",
    category: "Dermatology",
    description: "Removal of small skin sample for laboratory examination.",
    duration: "15-30 minutes",
    price: 2500,
    image: "/placeholder.svg?height=200&width=300",
    doctor: "Dr. Priya Sharma",
    preparation: "No special preparation required",
    recovery: "7-10 days healing time",
  },
  {
    id: 8,
    name: "Vaccination",
    slug: "vaccination",
    category: "Pediatrics",
    description: "Immunization against various diseases for children and adults.",
    duration: "10-15 minutes",
    price: 500,
    image: "/placeholder.svg?height=200&width=300",
    doctor: "Dr. Neha Gupta",
    preparation: "No special preparation required",
    recovery: "Immediate",
  },
]

const categories = [
  "All Categories",
  "Gynecology",
  "Gastroenterology",
  "Cardiology",
  "Ophthalmology",
  "Orthopedics",
  "Dermatology",
  "Pediatrics",
]

export default function ProceduresClientPage() {
  return (
    <main className="min-h-screen">
      <EmergencyBanner />
      <Header />
      <ProceduresListing procedures={procedures} categories={categories} />
      <Footer />
    </main>
  )
}
