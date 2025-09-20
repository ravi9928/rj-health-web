"use client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EmergencyBanner } from "@/components/emergency-banner";
import { DoctorsListing } from "@/components/doctors-listing";

export default function DoctorsPageClient() {

  return (
    <main className="min-h-screen">
      <EmergencyBanner />
      <Header />
      <DoctorsListing required="all" />
      <Footer />
    </main>
  );
}
