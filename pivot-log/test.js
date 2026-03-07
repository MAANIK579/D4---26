async function test() {
    try {
        const res = await fetch('http://localhost:3000/explore?tab=beacons');
        const text = await res.text();

        // Extract Next.js error text
        const match = text.match(/<title>(.*?Error.*?)<\/title>/) || text.match(/<div[^>]*class="[^"]*error[^"]*"[^>]*>(.*?)<\/div>/i);
        console.log('Possible Error:', match ? match[1] : 'Not found in title/error classes');

        // Also dump the part that says Error
        const errIndex = text.indexOf('Error:');
        if (errIndex !== -1) {
            console.log('Snippet:', text.substring(errIndex - 50, errIndex + 200).replace(/<[^>]+>/g, ''));
        }
    } catch (e) {
        console.error(e);
    }
}
test();
