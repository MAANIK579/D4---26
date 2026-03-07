require('dotenv').config({ path: '.env.local' });
const { getExploreFeed } = require('./src/app/actions/mentorship.ts');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
    console.log('Fetching explore feed...');
    try {
        const feed = await getExploreFeed();
        console.log('Feed Beacons Count:', feed.activeBeacons.length);
        console.log('Beacons:', feed.activeBeacons);
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
