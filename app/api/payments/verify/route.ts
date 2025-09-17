import { type NextRequest, NextResponse } from "next/server"
import { verifyPaymentSignature, capturePayment } from "@/lib/razorpay-enhanced"
import { bookingFunctions, patientFunctions, couponFunctions } from "@/lib/firebase-functions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, paymentId, signature, bookingData } = body

    // Verify payment signature
    const isValidSignature = verifyPaymentSignature(
      orderId,
      paymentId,
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET || "dummy_webhook_secret_123456789",
    )

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Capture payment
    const capturedPayment = await capturePayment(paymentId, bookingData.amount * 100)

    // Create or get patient
    const patient = await patientFunctions.getOrCreate(bookingData.patientPhone, {
      name: bookingData.patientName,
      phone: bookingData.patientPhone,
      email: bookingData.patientEmail,
    })

    // Create booking
    const booking = await bookingFunctions.create({
      userId: patient.id,
      userName: bookingData.patientName,
      phone: bookingData.patientPhone,
      email: bookingData.patientEmail,
      doctorId: bookingData.doctorId,
      procedureId: bookingData.procedureId,
      date: bookingData.date,
      time: bookingData.time,
      amount: bookingData.amount,
      status: "paid",
      paymentId: capturedPayment.id,
      orderId: orderId,
      notes: bookingData.notes || "",
      isUrgent: bookingData.isUrgent || false,
      couponId: bookingData.couponId || null,
      couponDiscount: bookingData.couponDiscount || 0,
    })

    // Apply coupon if used
    if (bookingData.couponId) {
      await couponFunctions.apply(bookingData.couponId)
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      paymentId: capturedPayment.id,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
