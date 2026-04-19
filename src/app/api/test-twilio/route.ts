import { NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

export async function GET(req: NextRequest) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

  const response = {
    envLoaded: {
      accountSid: !!accountSid,
      authToken: !!authToken,
      verifyServiceSid: !!verifyServiceSid,
      accountSidPreview: accountSid ? `${accountSid.substring(0, 8)}...` : null,
      verifyServiceSidPreview: verifyServiceSid ? `${verifyServiceSid.substring(0, 8)}...` : null,
    },
    twilioTest: null as any,
    error: null as string | null
  }

  if (!accountSid || !authToken || !verifyServiceSid) {
    response.error = "Missing Twilio credentials in environment variables"
    return NextResponse.json(response, { status: 500 })
  }

  try {
    // Test Twilio client initialization
    const client = twilio(accountSid, authToken)
    
    // Try to fetch verify service details (lightweight operation)
    const service = await client.verify.v2.services(verifyServiceSid).fetch()
    
    response.twilioTest = {
      success: true,
      serviceSid: service.sid,
      friendlyName: service.friendlyName,
      // status: service.status, // Property might not exist in types
      codeLength: service.codeLength,
      lookupEnabled: service.lookupEnabled,
      // Other properties might not exist in the type definition
      // but we can access them dynamically
      dateCreated: service.dateCreated,
      dateUpdated: service.dateUpdated,
    }
  } catch (error: any) {
    console.error("Twilio test error:", error)
    response.twilioTest = {
      success: false,
      error: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo
    }
    response.error = `Twilio API error: ${error.message}`
  }

  return NextResponse.json(response)
}