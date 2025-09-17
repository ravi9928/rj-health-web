import { NextRequest, NextResponse } from "next/server"
import { verifyWebhookSignature } from "@/lib/razorpay-enhanced"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Get webhook secret from environment variable
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature, webhookSecret)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    // Handle different webhook events
    switch (event.event) {
      case "payment.captured":
        console.log("Payment captured:", event.payload.payment.entity)
        // Update booking status in database
        break

      case "payment.failed":
        console.log("Payment failed:", event.payload.payment.entity)
        // Update booking status in database
        break

      case "refund.processed":
        console.log("Refund processed:", event.payload.refund.entity)
        // Update refund status in database
        break

      case "refund.failed":
        console.log("Refund failed:", event.payload.refund.entity)
        // Update refund status in database
        break

      default:
        console.log("Unhandled webhook event:", event.event)
    }

    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
