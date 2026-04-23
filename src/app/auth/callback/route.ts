import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Read from cookie first, then fallback to searchParams, then default
  const nextCookie = request.cookies.get('auth_next')?.value
  const next = nextCookie ?? searchParams.get('next') ?? '/dashboard'
  
  const flowCookie = request.cookies.get('auth_flow')?.value
  const flow = flowCookie ?? searchParams.get('flow')

  // Helper to create redirect with cleared auth cookies
  const createRedirect = (url: string) => {
    const response = NextResponse.redirect(url)
    // Clear auth cookies to prevent stale state
    response.cookies.set('auth_flow', '', { path: '/', maxAge: 0 })
    response.cookies.set('auth_next', '', { path: '/', maxAge: 0 })
    response.cookies.set('discovery_data', '', { path: '/', maxAge: 0 })
    return response
  }

  console.log('Auth callback received:', { code, next, flow, origin, fullUrl: request.url, fromCookie: !!flowCookie })

  if (code) {
    try {
      const supabase = await createClient()
      if (!supabase) throw new Error("Supabase client is not available")

      console.log('Exchanging code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        console.log('Auth callback successful, session data:', data)
        
        // Get the user after session exchange
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          console.error('Failed to get user after OAuth:', userError)
          return NextResponse.redirect(`${origin}/login?authError=` + encodeURIComponent(userError?.message || 'Authentication failed'))
        }
        
        console.log('OAuth user:', user.id, user.email)
        
        // Check if user has a profile in the database
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, created_at')
          .eq('user_id', user.id)
          .maybeSingle()

        if (!profile) {
          // Sync to public.users table if it's a new OAuth user
          await supabase.from('users').upsert({
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
            phone: user.phone || `+234${user.id.replace(/[^0-9]/g, '').slice(0, 10)}`,
            email: user.email
          })
        }
        
        if (profileError) {
          console.error('Error checking profile:', profileError)
          // Continue anyway, assume no profile
        }
        
        const hasProfile = !!profile
        
        console.log('User profile check:', { 
          hasProfile, 
          flow, 
          profileId: profile?.id,
          profileCreated: profile?.created_at,
          userId: user.id 
        })
        
        // Handle based on flow and profile existence
        if (flow === 'login') {
          // Login flow: user must have profile
          if (!hasProfile) {
             // Let them login anyway to allow DB trigger time or let dashboard handle them.
             // Usually, users created via OAuth will have a profile created by trigger.
             console.log('Login flow but no profile found immediately. Proceeding to dashboard.')
          }
          // Has profile - redirect to next (dashboard)
          const redirectUrl = `${origin}${next}`
          console.log('Login flow - has profile, redirecting to:', redirectUrl)
          return createRedirect(redirectUrl)
        } 
        else if (flow === 'signup') {
          // Signup flow
          if (hasProfile) {
            // Already has profile - redirect to dashboard with message
            const redirectUrl = `${origin}/dashboard?message=already_signed_up`
            console.log('Signup flow - already has profile, redirecting to:', redirectUrl)
            return createRedirect(redirectUrl)
          }
          // New user - create profile from onboarding data stored in localStorage, then redirect to dashboard
          const redirectUrl = `${origin}/dashboard?new_user=true`
          console.log('Signup flow - new user, redirecting to dashboard:', redirectUrl)
          
          // Create a basic profile for the user so they're set up
          const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Artisan'
          const { data: newProfile, error: profileCreateError } = await supabase
            .from('profiles')
            .upsert({
              user_id: user.id,
              full_name: fullName,
            }, { onConflict: 'user_id' })
            .select()
            .single()
          
          if (profileCreateError) {
            console.error('Failed to create profile during signup callback:', profileCreateError)
            // Continue anyway - profile can be created later
          } else {
            console.log('Profile created/updated for new user:', user.id)
            
            // Handle discovery data from onboarding
            const discoveryCookie = request.cookies.get('discovery_data')?.value
            if (discoveryCookie && newProfile) {
              try {
                const discoveryData = JSON.parse(decodeURIComponent(discoveryCookie));
                const deadlineDate = new Date();
                let days = 30;
                if (discoveryData.timeline) {
                  days = parseInt(discoveryData.timeline, 10);
                  if (isNaN(days)) days = 30;
                }
                deadlineDate.setDate(deadlineDate.getDate() + days);

                const rawCost = String(discoveryData.cost || '0');
                const itemCost = parseInt(rawCost.replace(/[^0-9]/g, ""), 10) || 0;

                await supabase.from('needs').insert({
                  profile_id: newProfile.id,
                  item_name: discoveryData.itemName,
                  item_cost: itemCost,
                  story: discoveryData.story || "",
                  impact_statement: discoveryData.impact || "",
                  status: 'active',
                  deadline: deadlineDate.toISOString().split('T')[0],
                  photo_url: discoveryData.photoUrl || "/images/placeholders/need-default.png"
                });
                console.log('Successfully created need from discovery data');
              } catch (err) {
                console.error("Failed to parse or insert discovery data", err);
              }
            }
          }
          
          return createRedirect(redirectUrl)
        }
        else if (flow === 'high-velocity') {
          // High-velocity flow: always go back to signup to finish personalization if needed
          // The HighVelocityAuth component will handle the redirect to dashboard once profile is saved
          const redirectUrl = `${origin}/signup`
          console.log('High-velocity flow - redirecting to personalization:', redirectUrl)
          return createRedirect(redirectUrl)
        }
        else {
          // No flow specified (backward compatibility) - use old behavior
          const redirectUrl = `${origin}${next}?resumedAuth=true`
          console.log('No flow specified, redirecting to:', redirectUrl)
          return createRedirect(redirectUrl)
        }
      } else {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(`${origin}/login?authError=` + encodeURIComponent(error.message))
      }
    } catch (error: any) {
      console.error("Auth callback unexpected error:", error)
      return NextResponse.redirect(`${origin}/login?authError=` + encodeURIComponent(error.message || 'Unknown error'))
    }
  }

  // If no code, redirect to login
  console.log('No code in callback URL, redirecting to login')
  return NextResponse.redirect(`${origin}/login?authError=missing_code`)
}
