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
    
    // Try to insert into public.users
    console.log("Inserting into public.users...");
    const { data: userInsert, error: userInsertError } = await supabaseAdmin
        .from('users')
        .insert({ id: user.id })
        .select();
    console.log("public.users insert:", userInsertError);
    
    console.log("Attempting insert into profiles...");
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

run();
