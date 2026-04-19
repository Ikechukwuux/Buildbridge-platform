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

async function run() {
    // try to fetch from public.users to see if it exists
    const resUsers = await fetch(`${SUPABASE_URL}/rest/v1/users?select=id`, {
        headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY
        }
    });
    console.log("public.users status:", resUsers.status);
    if (resUsers.ok) console.log("public.users data:", (await resUsers.json()).slice(0, 2));
    
    const resProfiles = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=*`, {
        headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY
        }
    });
    console.log("public.profiles status:", resProfiles.status);
    if (resProfiles.ok) {
        const body = await resProfiles.json();
        console.log("profiles entries count:", body.length);
        if (body.length > 0) console.log(body[0]);
    } else {
        console.log("profiles error:", await resProfiles.text());
    }
}

run();
