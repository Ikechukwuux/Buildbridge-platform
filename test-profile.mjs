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

import { createClient } from "@supabase/supabase-js";

async function run() {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
    
    // get user 2348108183372@buildbridge.app
    console.log("Fetching user...");
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    const user = userData.users.find(u => u.email === '2348108183372@buildbridge.app');
    
    if (!user) {
        console.log("No user found.");
        return;
    }
    console.log("User ID:", user.id);
    
    // Check if profile exists
    const { data: profile, error: profileGetError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
    console.log("Profile data:", profile);
    console.log("Profile fetch error:", profileGetError);
    
    if (!profile) {
        console.log("Attempting insert...");
        const { data: insertProfile, error: insertError } = await supabaseAdmin
            .from('profiles')
            .insert({
                user_id: user.id,
                trade_category: 'tailor',
                location_state: 'lagos'
            })
            .select();
        
        console.log("Insert data:", insertProfile);
        console.log("Insert error:", insertError);
    }
}

run();
