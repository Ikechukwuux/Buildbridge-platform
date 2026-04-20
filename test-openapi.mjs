import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envStr = fs.readFileSync(envPath, 'utf8');

let SUPABASE_URL = '';
let SUPABASE_SERVICE_ROLE_KEY = '';

envStr.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) SUPABASE_SERVICE_ROLE_KEY = line.split('=')[1].trim();
});

async function run() {
    console.log("URL:", SUPABASE_URL);
    // Let's ask postgrest for the openapi spec to tell us the schema of profiles!
    const res = await fetch(`${SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_SERVICE_ROLE_KEY}`);
    const spec = await res.json();
    const profileDef = spec.definitions?.profiles;
    console.log("Profiles Definition:", profileDef);
}

run();
