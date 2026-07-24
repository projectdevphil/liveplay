export async function onRequest(context) {
    try {
        await context.env.DB.prepare(`
            CREATE TABLE IF NOT EXISTS channel_views (
                id TEXT,
                ip_hash TEXT,
                PRIMARY KEY (id, ip_hash)
            )
        `).run();

        const query = `
            SELECT id FROM channel_views 
            GROUP BY id 
            ORDER BY COUNT(ip_hash) DESC 
            LIMIT 50
        `;
        const { results } = await context.env.DB.prepare(query).all();

        const topChannels = results.map(row => row.id);
        
        return new Response(JSON.stringify(topChannels), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 's-maxage=5, stale-while-revalidate=10' 
            }
        });
    } catch (error) {
        console.error("D1 Database Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
