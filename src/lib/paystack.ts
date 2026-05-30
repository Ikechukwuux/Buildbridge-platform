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

export interface CreateRecipientResponse {
  status: boolean
  message: string
  data: { recipient_code: string; id: number }
}

export async function createTransferRecipient(params: {
  name: string
  account_number: string
  bank_code: string
}): Promise<CreateRecipientResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transferrecipient`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "nuban", currency: "NGN", ...params }),
  })
  if (!res.ok) throw new Error(`Paystack create recipient failed: ${res.status}`)
  return res.json()
}

export interface InitiateTransferResponse {
  status: boolean
  message: string
  data: { transfer_code: string; status: string }
}

export async function initiateTransfer(params: {
  amount: number
  recipient: string
  reason: string
  reference: string
}): Promise<InitiateTransferResponse> {
  const res = await fetch(`${PAYSTACK_BASE}/transfer`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ source: "balance", currency: "NGN", ...params }),
  })
  if (!res.ok) throw new Error(`Paystack initiate transfer failed: ${res.status}`)
  return res.json()
}
