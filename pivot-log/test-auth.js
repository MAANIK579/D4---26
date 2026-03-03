// We'll just use native fetch if Node 18+

async function testSupabase() {
    const supabaseUrl = "https://cptzresetannffwzlucn.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdHpyZXNldGFubmZmd3psdWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMzg2MTUsImV4cCI6MjA4NzkxNDYxNX0.FnZ2iAIH3BkrPGB_14M76BKyCWXLwyBViRvF2YlWNU4";

    console.log("Testing Supabase Token Endpoint...");
    try {
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: "test@example.com", password: "password123" })
        });

        console.log("Status:", response.status);
        console.log("Headers:", response.headers);
        const text = await response.text();
        console.log("Response Text (First 500 chars):\n", text.substring(0, 500));
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testSupabase();
