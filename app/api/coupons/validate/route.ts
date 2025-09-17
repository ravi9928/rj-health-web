import { type NextRequest, NextResponse } from "next/server"
import { couponFunctions } from "@/lib/firebase-functions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, amount, doctorId, procedureId } = body

    if (!code || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await couponFunctions.validate(code, amount, doctorId, procedureId)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Coupon validation error:", error)
    return NextResponse.json({ error: error.message || "Coupon validation failed" }, { status: 400 })
  }
}
