"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EmergencyBanner } from "@/components/emergency-banner"
import { DoctorsListing } from "@/components/doctors-listing"

const doctors = [
  {
    id: 1,
    name: "Dr. Samita Bhat",
    slug: "dr-samita-bhat",
    specialization: "Gynecologist & Obstetrician",
    experience: "15+ years",
    rating: 4.9,
    reviews: 234,
    firstTimePrice: 800,
    recurringPrice: 600,
    image: "/placeholder.svg?height=300&width=300",
    qualifications: ["MBBS", "MD Gynecology"],
    availability: "Mon-Sat 9AM-6PM",
    languages: ["English", "Hindi", "Dogri"],
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    slug: "dr-rajesh-kumar",
    specialization: "Gastroenterologist",
    experience: "12+ years",
    rating: 4.8,
    reviews: 189,
    firstTimePrice: 900,
    recurringPrice: 700,
    image: "/placeholder.svg?height=300&width=300",
    qualifications: ["MBBS", "MD Medicine", "DM Gastroenterology"],
    availability: "Mon-Fri 10AM-5PM",
    languages: ["English", "Hindi"],
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    slug: "dr-priya-sharma",
    specialization: "Dermatologist",
    experience: "10+ years",
    rating: 4.7,
    reviews: 156,
    firstTimePrice: 700,
    recurringPrice: 500,
    image: "/placeholder.svg?height=300&width=300",
    qualifications: ["MBBS", "MD Dermatology"],
    availability: "Tue-Sun 11AM-7PM",
    languages: ["English", "Hindi", "Punjabi"],
  },
  {
    id: 4,
    name: "Dr. Amit Singh",
    slug: "dr-amit-singh",
    specialization: "Cardiologist",
    experience: "18+ years",
    rating: 4.9,
    reviews: 312,
    firstTimePrice: 1000,
    recurringPrice: 800,
    image: "/placeholder.svg?height=300&width=300",
    qualifications: ["MBBS", "MD Medicine", "DM Cardiology"],
    availability: "Mon-Sat 8AM-4PM",
    languages: ["English", "Hindi"],
  },
  {
    id: 5,
    name: "Dr. Neha Gupta",
    slug: "dr-neha-gupta",
    specialization: "Pediatrician",
    experience: "8+ years",
    rating: 4.8,
    reviews: 198,
    firstTimePrice: 600,
    recurringPrice: 450,
    image: "/placeholder.svg?height=300&width=300",
    qualifications: ["MBBS", "MD Pediatrics"],
    availability: "Mon-Sat 10AM-6PM",
    languages: ["English", "Hindi", "Dogri"],
  },
  {
    id: 6,
    name: "Dr. Vikram Malhotra",
    slug: "dr-vikram-malhotra",
    specialization: "Orthopedic Surgeon",
    experience: "14+ years",
    rating: 4.7,
    reviews: 167,
    firstTimePrice: 850,
    recurringPrice: 650,
    image: "/placeholder.svg?height=300&width=300",
    qualifications: ["MBBS", "MS Orthopedics"],
    availability: "Mon-Fri 9AM-5PM",
    languages: ["English", "Hindi", "Punjabi"],
  },
]

const specializations = [
  "All Specializations",
  "Gynecologist & Obstetrician",
  "Gastroenterologist",
  "Dermatologist",
  "Cardiologist",
  "Pediatrician",
  "Orthopedic Surgeon",
]

export default function DoctorsPageClient() {
  return (
    <main className="min-h-screen">
      <EmergencyBanner />
      <Header />
      <DoctorsListing doctors={doctors} specializations={specializations} />
      <Footer />
    </main>
  )
}
