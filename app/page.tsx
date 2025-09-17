import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { FeaturedDoctors } from "@/components/featured-doctors"
import { Services } from "@/components/services"
import { WhyChooseUs } from "@/components/why-choose-us"
import { Testimonials } from "@/components/testimonials"
import { ContactInfo } from "@/components/contact-info"
import { Footer } from "@/components/footer"
import { EmergencyBanner } from "@/components/emergency-banner"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <EmergencyBanner />
      <Header />
      <Hero />
      <FeaturedDoctors />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <ContactInfo />
      <Footer />
    </main>
  )
}
