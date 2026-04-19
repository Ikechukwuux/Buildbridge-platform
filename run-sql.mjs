import fs from 'fs';

const TOKEN = 'sbp_1df92d95f8d7fbd1cef389881f7d6dcdab4eb997';
const REF = 'yahrksbwvvusfamufoaq'; // from .env

async function query(sql) {
    console.log("Executing SQL:", sql.substring(0, 50) + "...");
    const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sql })
    });
    console.log("Status:", res.status);
    if (!res.ok) {
        console.error("Error:", await res.text());
    } else {
        const data = await res.json();
        console.log("Success:", JSON.stringify(data).substring(0, 100));
    }
}

async function run() {
    // 1. Drop old tables
    await query(`
        DROP TABLE IF EXISTS public.needs CASCADE;
        DROP TABLE IF EXISTS public.profiles CASCADE;
        DROP TABLE IF EXISTS public.users CASCADE;
    `);

    // 2. Read migration file
    const migration = fs.readFileSync('supabase_migration.sql', 'utf8');
    await query(migration);
}

run();
