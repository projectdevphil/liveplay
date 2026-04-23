export async function onRequest(context) {
    try {
        const query = `SELECT slug FROM views_leaderboard ORDER BY count DESC LIMIT 50`;
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
