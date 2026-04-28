import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
    console.log("verify-bank request:", body);
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { bank_code, account_number } = body;

  if (!bank_code || !account_number) {
    return NextResponse.json(
      { success: false, message: 'Missing bank_code or account_number' },
      { status: 400 }
    );
  }

  const apiToken = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  console.log("verify-bank API call:", { bank_code, account_number, supabaseUrl: supabaseUrl?.slice(0, 20) });

  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/verify?bank_code=${bank_code}&account_number=${account_number}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
        },
      }
    );

    console.log("nubapi status:", response.status);
    
    const contentType = response.headers.get('content-type') || '';
    console.log("nubapi content-type:", contentType);

    if (!contentType.includes('json')) {
      const text = await response.text();
      console.log("non-json response:", text.slice(0, 200));
      return NextResponse.json(
        { success: false, message: 'Invalid API response', details: text.slice(0, 100) },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("nubapi response:", data);
    
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("nubapi fetch error:", err);
    return NextResponse.json(
      { success: false, message: err.message || 'Fetch error' },
      { status: 500 }
    );
  }
}