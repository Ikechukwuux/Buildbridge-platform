import fs from 'fs';
import path from 'path';

// read .env
const envPath = path.resolve(process.cwd(), '.env');
const envStr = fs.readFileSync(envPath, 'utf8');

let SUPABASE_URL = '';
let SUPABASE_SERVICE_ROLE_KEY = '';

envStr.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) SUPABASE_SERVICE_ROLE_KEY = line.split('=')[1].trim();
});

const phone = '2348108183372';
const email = `${phone}@buildbridge.app`;
const password = `buildbridge-${phone}`;

async function run() {
    console.log("Checking User:", email);
    
    // 1. Try to fetch all users (if small DB)
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
        headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY
        }
    });
    const usersData = await res.json();
    
    let existingUser = (usersData.users || []).find((u) => u.email === email);
    
    if (existingUser) {
        console.log("User already exists:", existingUser.id, "email_confirmed_at:", existingUser.email_confirmed_at);
        
        // Force confirm
        if (!existingUser.email_confirmed_at) {
            console.log("FORCE CONFIRMING USER...");
            const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${existingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                    'apikey': SUPABASE_SERVICE_ROLE_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email_confirm: true })
            });
            console.log("Update res:", await updateRes.json());
        }
    } else {
        console.log("User does not exist, creating.");
        const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                email_confirm: true,
                user_metadata: {
                    full_name: "Tradesperson",
                    phone,
                    phone_verified: true
                }
            })
        });
        console.log("Create Res:", await createRes.json());
    }
    
    // 2. Try SignInWithPassword Using ANON KEY
    let NEXT_PUBLIC_SUPABASE_ANON_KEY = '';
    envStr.split('\n').forEach(line => {
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) NEXT_PUBLIC_SUPABASE_ANON_KEY = line.split('=')[1].trim();
    });
    
    console.log("Attempting sign in:");
    const signInRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'apikey': NEXT_PUBLIC_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    
    const signInData = await signInRes.json();
    console.log("SignIn Res:", signInData);
}

run();
