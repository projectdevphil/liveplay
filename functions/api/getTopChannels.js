export async function onRequest(context) {
    try {
        await context.env.DB.prepare(`
            CREATE TABLE IF NOT EXISTS ip_views (
                slug TEXT,
                ip_hash TEXT,
                PRIMARY KEY (slug, ip_hash)
            )
        `).run();

        const query = `
            SELECT slug FROM ip_views 
            GROUP BY slug 
            ORDER BY COUNT(ip_hash) DESC 
            LIMIT 50
        `;
        const { results } = await context.env.DB.prepare(query).all();

        const topChannels = results.map(row => row.slug);
        
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
