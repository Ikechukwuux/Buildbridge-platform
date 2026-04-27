const PAYSTACK_BASE = "https://api.paystack.co"

function getKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set")
  return key
}

export interface PaystackTransaction {
  id: number
  status: string
  reference: string
  amount: number
  currency: string
  metadata: Record<string, any>
  customer: { email: string }
  paid_at: string
  created_at: string
}

export interface VerifyResponse {
  status: boolean
  message: string
  data: PaystackTransaction
}

export async function verifyTransaction(reference: string): Promise<VerifyResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${getKey()}`,
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error(`Paystack verify failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}
