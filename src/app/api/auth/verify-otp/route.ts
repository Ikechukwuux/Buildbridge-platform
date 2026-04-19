import { NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

export async function POST(req: NextRequest) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

  if (!accountSid || !authToken || !verifyServiceSid) {
    console.error("Missing Twilio credentials. Check your .env file.")
    return NextResponse.json(
      { success: false, error: "Server configuration error. Missing Twilio credentials." },
      { status: 500 }
    )
  }

  const client = twilio(accountSid, authToken)
  
  try {
    const body = await req.json()
    const { phone, code } = body
    
    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: "Phone number and verification code are required." },
        { status: 400 }
      )
    }

    // Format phone number: ensure it starts with +234
    let formattedPhone = phone.trim()
    if (formattedPhone.startsWith("0") && formattedPhone.length === 11) {
      formattedPhone = "+234" + formattedPhone.slice(1)
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+234" + formattedPhone
    }

    // Verify OTP via Twilio Verify
    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: formattedPhone, code })

    if (verificationCheck.status === "approved") {
      return NextResponse.json({ 
        success: true, 
        message: "Phone number verified successfully"
      })
    } else {
      return NextResponse.json(
        { success: false, error: "That code didn't match. Please try again." },
        { status: 400 }
      )
    }
    
  } catch (error: any) {
    console.error("Twilio OTP verification error:", {
      message: error.message,
      code: error.code,
    })
    
    // Handle specific Twilio errors
    if (error.code === 60202) {
      return NextResponse.json(
        { success: false, error: "That code didn't match. Please try again." },
        { status: 400 }
      )
    }
    
    if (error.code === 20404) {
      return NextResponse.json(
        { success: false, error: "This code has expired. Please request a new one." },
        { status: 404 }
      )
    }
    
    if (error.code === 60203) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Please wait 1 hour before trying again." },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to verify code. Please try again." },
      { status: 500 }
    )
  }
}