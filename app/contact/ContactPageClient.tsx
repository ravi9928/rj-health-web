"use client"
import { EmergencyBanner } from "@/components/emergency-banner"
import { ContactInfo } from "@/components/contact-info"
import { ContactForm } from "@/components/contact-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ContactPageClient() {
  return (
    <main className="min-h-screen">
      <EmergencyBanner />
      <Header />
      <ContactForm />
      <ContactInfo />
      <Footer />
    </main>
  )
}
