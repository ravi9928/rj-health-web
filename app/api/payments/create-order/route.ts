import { type NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/lib/razorpay-enhanced"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, doctorId, procedureId, patientData, couponId, isUrgent } = body

    // Validate required fields
    if (!amount || !doctorId || !procedureId || !patientData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create Razorpay order
    const order = await createOrder({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `booking_${Date.now()}`,
      customer: {
        name: patientData.name,
        email: patientData.email,
        contact: patientData.phone,
      },
      notes: {
        doctorId,
        procedureId,
        patientName: patientData.name,
        patientEmail: patientData.email,
        patientPhone: patientData.phone,
        couponId: couponId || null,
        isUrgent: isUrgent || false,
      },
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
