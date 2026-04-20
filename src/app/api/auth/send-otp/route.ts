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
    const { phone } = body
    
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
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

    // Send OTP via Twilio Verify
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: formattedPhone, channel: "sms" })

    console.log("Twilio verification sent:", verification.sid)
    
    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully",
      formattedPhone
    })
    
  } catch (error: any) {
    console.error("Twilio OTP send error:", {
      message: error.message,
      code: error.code,
    })
    
    // Handle specific Twilio errors
    if (error.code === 60200) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format." },
        { status: 400 }
      )
    }
    
    if (error.code === 60203) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Please wait a while before trying again." },
        { status: 429 }
      )
    }
    
    if (error.code === 20404) {
      return NextResponse.json(
        { success: false, error: "Verification not found. Please request a new OTP." },
        { status: 404 }
      )
    }
    
    // Geo Permissions / Fraud Guard blocked prefix
    if (error.code === 60410) {
      return NextResponse.json(
        { success: false, error: "SMS delivery to this region is temporarily unavailable. Please try again later or contact support." },
        { status: 403 }
      )
    }
    
    // Trial account restrictions
    if (error.code === 21211 || error.code === 21408 || error.code === 21610) {
      return NextResponse.json(
        { success: false, error: "This phone number cannot receive SMS. Please try a different number." },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: `Failed to send OTP. Please try again.` },
      { status: 500 }
    )
  }
}
