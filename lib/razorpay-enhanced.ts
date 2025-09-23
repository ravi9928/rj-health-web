// /lib/razorpay-enhanced.ts
import Razorpay from "razorpay";

export interface RazorpayAccountConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  mode: "live";
  convenienceFee: number;
}

export interface PaymentData {
  amount: number; // in rupees (frontend always sends rupees)
  currency: string;
  receipt: string;
  notes?: any;
  customer?: {
    name: string;
    email: string;
    contact: string;
  };
  razorpayAccount?: RazorpayAccountConfig;
}

export interface RefundData {
  paymentId: string;
  amount?: number;
  speed?: "normal" | "optimum";
  notes?: any;
  receipt?: string;
  razorpayAccount?: RazorpayAccountConfig;
}

// ✅ Utility: create Razorpay client
const getRazorpayClient = (account?: RazorpayAccountConfig) => {
  return new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET!,
  });
};
// ✅ Create Razorpay Order (amount in rupees → convert to paise here)
export const createOrder = async (data: PaymentData) => {
  const razorpay = getRazorpayClient(data.razorpayAccount);
  const amountPaise = Math.round(data.amount * 100); // ✅ single source of truth

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: data.currency || "INR",
    receipt: data.receipt,
    notes: data.notes || {},
  });
  console.log("Creating Razorpay order:", order);
  return order;
};

export const capturePayment = async (
  paymentId: string,
  amount: number,
  acct?: RazorpayAccountConfig
) => {
  const razorpay = getRazorpayClient(acct);
  const amountPaise = Math.round(amount * 100); // ✅ was missing *100
  return razorpay.payments.capture(paymentId, amountPaise, "INR");
};

export const createRefund = async (data: RefundData) => {
  const razorpay = getRazorpayClient(data.razorpayAccount);
  return razorpay.payments.refund(data.paymentId, {
    amount: data.amount ? Math.round(data.amount * 100) : undefined, // ✅
    speed: data.speed,
    notes: data.notes,
    receipt: data.receipt,
  });
};

// ✅ Verify webhook signature
export const verifyWebhookSignature = (
  body: string,
  signature: string,
  secret: string
): boolean => {
  const crypto = require("crypto");
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return expected === signature;
};

// ✅ Verify payment signature
export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean => {
  const crypto = require("crypto");
  const body = orderId + "|" + paymentId;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expected === signature;
};

// ✅ Utils
export const calculateConvenienceFee = (
  amount: number,
  razorpayAccount?: RazorpayAccountConfig
): number => {
  const feePercentage = razorpayAccount?.convenienceFee || 2.5;
  return Math.round((amount * feePercentage) / 100);
};

export const calculateTotalAmount = (
  baseAmount: number,
  razorpayAccount?: RazorpayAccountConfig
): number => {
  const convenienceFee = calculateConvenienceFee(baseAmount, razorpayAccount);
  return baseAmount + convenienceFee;
};

export const formatCurrency = (
  amountPaise: number,
  currency = "INR"
): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amountPaise / 100); // Convert paise to rupees
};

export const validatePaymentAmount = (amountPaise: number): boolean => {
  return amountPaise >= 100 && amountPaise <= 1500000000; // ₹1 to ₹15 crores
};

export const generateReceiptId = (prefix = "rcpt"): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
