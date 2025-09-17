// Enhanced Razorpay configuration and functions with multi-account support
export interface RazorpayAccountConfig {
  keyId: string
  keySecret: string
  webhookSecret: string
  mode: "test" | "live"
  convenienceFee: number
}

export interface PaymentData {
  amount: number
  currency: string
  receipt: string
  notes?: any
  customer?: {
    name: string
    email: string
    contact: string
  }
  razorpayAccount?: RazorpayAccountConfig
}

export interface RefundData {
  paymentId: string
  amount?: number
  speed?: "normal" | "optimum"
  notes?: any
  receipt?: string
  razorpayAccount?: RazorpayAccountConfig
}

// Enhanced Razorpay functions with account-specific processing
export const createOrder = async (data: PaymentData) => {
  const accountInfo = data.razorpayAccount ? `Account: ${data.razorpayAccount.keyId}` : "Default Account"

  console.log(`Creating Razorpay order via ${accountInfo}:`, data)

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: `order_${Date.now()}`,
    entity: "order",
    amount: data.amount,
    amount_paid: 0,
    amount_due: data.amount,
    currency: data.currency,
    receipt: data.receipt,
    offer_id: null,
    status: "created",
    attempts: 0,
    notes: {
      ...data.notes,
      razorpay_account: data.razorpayAccount?.keyId || "default",
    },
    created_at: Math.floor(Date.now() / 1000),
  }
}

export const capturePayment = async (paymentId: string, amount: number, razorpayAccount?: RazorpayAccountConfig) => {
  const accountInfo = razorpayAccount ? `Account: ${razorpayAccount.keyId}` : "Default Account"

  console.log(`Capturing payment ${paymentId} for amount ${amount} via ${accountInfo}`)

  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    id: paymentId,
    entity: "payment",
    amount,
    currency: "INR",
    status: "captured",
    order_id: `order_${Date.now()}`,
    invoice_id: null,
    international: false,
    method: "card",
    amount_refunded: 0,
    refund_status: null,
    captured: true,
    description: "Payment captured",
    card_id: `card_${Date.now()}`,
    bank: null,
    wallet: null,
    vpa: null,
    email: "customer@example.com",
    contact: "+919999999999",
    notes: {
      razorpay_account: razorpayAccount?.keyId || "default",
    },
    fee: Math.floor((amount * (razorpayAccount?.convenienceFee || 2.5)) / 100),
    tax: Math.floor(amount * 0.0045), // 0.45% tax
    error_code: null,
    error_description: null,
    created_at: Math.floor(Date.now() / 1000),
  }
}

export const createRefund = async (data: RefundData) => {
  const accountInfo = data.razorpayAccount ? `Account: ${data.razorpayAccount.keyId}` : "Default Account"

  console.log(`Creating refund via ${accountInfo}:`, data)

  await new Promise((resolve) => setTimeout(resolve, 1200))

  return {
    id: `rfnd_${Date.now()}`,
    entity: "refund",
    amount: data.amount,
    currency: "INR",
    payment_id: data.paymentId,
    notes: {
      ...data.notes,
      razorpay_account: data.razorpayAccount?.keyId || "default",
    },
    receipt: data.receipt,
    acquirer_data: {
      arn: `${Date.now()}`,
    },
    created_at: Math.floor(Date.now() / 1000),
    batch_id: null,
    status: "processed",
    speed_processed: data.speed || "normal",
    speed_requested: data.speed || "normal",
  }
}

export const verifyWebhookSignature = (body: string, signature: string, secret: string): boolean => {
  console.log("Verifying webhook signature with secret:", secret.substring(0, 10) + "...")
  // In a real implementation, you would use crypto to verify the signature
  return true
}

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): boolean => {
  console.log("Verifying payment signature")
  // In a real implementation, verify the signature properly
  return true
}

// Utility function to get Razorpay account configuration
export const getRazorpayAccountConfig = (account: any): RazorpayAccountConfig => {
  return {
    keyId: account.keyId,
    keySecret: account.keySecret,
    webhookSecret: account.webhookSecret,
    mode: account.mode,
    convenienceFee: account.convenienceFee,
  }
}

// Calculate convenience fee based on account configuration
export const calculateConvenienceFee = (amount: number, razorpayAccount?: RazorpayAccountConfig): number => {
  const feePercentage = razorpayAccount?.convenienceFee || 2.5
  return Math.round((amount * feePercentage) / 100)
}

export const calculateTotalAmount = (baseAmount: number, razorpayAccount?: RazorpayAccountConfig): number => {
  const convenienceFee = calculateConvenienceFee(baseAmount, razorpayAccount)
  return baseAmount + convenienceFee
}

export const formatCurrency = (amount: number, currency = "INR"): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100) // Convert paise to rupees
}

export const validatePaymentAmount = (amount: number): boolean => {
  return amount >= 100 && amount <= 1500000000 // ₹1 to ₹15 crores in paise
}

export const generateReceiptId = (prefix = "rcpt"): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
