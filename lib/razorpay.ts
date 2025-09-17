export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
}

export const loadRazorpay = (): Promise<any> => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => {
      resolve((window as any).Razorpay)
    }
    document.body.appendChild(script)
  })
}

export const createRazorpayOrder = async (orderData: {
  amount: number
  currency: string
  receipt: string
  notes?: any
}) => {
  // Simulate API call to create Razorpay order
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: `order_${Date.now()}`,
    entity: "order",
    amount: orderData.amount,
    amount_paid: 0,
    amount_due: orderData.amount,
    currency: orderData.currency,
    receipt: orderData.receipt,
    status: "created",
    created_at: Math.floor(Date.now() / 1000),
  }
}

export const verifyPayment = async (paymentData: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}) => {
  // Simulate payment verification
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    success: true,
    payment_id: paymentData.razorpay_payment_id,
    order_id: paymentData.razorpay_order_id,
  }
}
