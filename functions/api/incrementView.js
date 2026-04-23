export async function onRequest(context) {
    try {
        const url = new URL(context.request.url);
        const channel = url.searchParams.get('channel');
        
        if (!channel) return new Response('Missing channel', { status: 400 });

        const query = `
            INSERT INTO views_leaderboard (slug, count) 
            VALUES (?1, 1) 
            ON CONFLICT(slug) DO UPDATE SET count = count + 1
        `;
        
        await context.env.DB.prepare(query).bind(channel).run();
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("D1 Database Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
