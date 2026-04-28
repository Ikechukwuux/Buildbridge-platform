Deno.serve(async (req) => {
  const url = new URL(req.url);
  const bank_code = url.searchParams.get("bank_code");
  const account_number = url.searchParams.get("account_number");

  if (!bank_code || !account_number) {
    return new Response(JSON.stringify({
      success: false,
      message: "Missing bank_code or account_number"
    }), {
      headers: { "Content-Type": "application/json" },
      status: 400
    });
  }

  const nubapiToken = Deno.env.get("NUB_API_TOKEN");
  if (!nubapiToken) {
    return new Response(JSON.stringify({
      success: false,
      message: "NUB_API_TOKEN not configured"
    }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }

  try {
    const response = await fetch(
      `https://nubapi.com/api/verify?bank_code=${bank_code}&account_number=${account_number}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${nubapiToken}`
        }
      }
    );

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
});