import { getExploreFeed } from './src/app/actions/mentorship.ts';

async function test() {
    const feed = await getExploreFeed();
    const beacons = feed.activeBeacons;
    console.log(beacons);

    // Check if any beacon has a missing field that logcard expects
    const b = beacons[0];
    console.log('domain:', b.domain); // needed for LogCard
    console.log('created_at:', b.created_at);
    console.log('user_id:', b.user_id);
    console.log('users:', b.users);
}

test();
