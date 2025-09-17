import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script";
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RJ Healthcare Jammu - Expert Medical Care & Women's Health Services",
  description:
    "Leading healthcare provider in Jammu offering specialized gynecology, gastroenterology, cardiology, and comprehensive medical services with experienced doctors and modern facilities.",
  keywords:
    "healthcare Jammu, gynecology Jammu, medical services, women's health, pregnancy care, fertility treatment, gastroenterology, cardiology, medical clinic Jammu",
  authors: [{ name: "RJ Healthcare" }],
  openGraph: {
    title: "RJ Healthcare Jammu - Expert Medical Care",
    description: "Leading healthcare provider in Jammu with specialized medical services",
    url: "https://rjhealthcare.com",
    siteName: "RJ Healthcare",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RJ Healthcare Jammu",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RJ Healthcare Jammu - Expert Medical Care",
    description: "Leading healthcare provider in Jammu with specialized medical services",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
         {/* Razorpay SDK */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        <Toaster />
      </body>
    </html>
  )
}
