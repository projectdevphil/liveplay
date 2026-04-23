export async function onRequest(context) {
    try {
        const id = context.env.TOP_CHANNELS_DO.idFromName('global_top_watch');
        const stub = context.env.TOP_CHANNELS_DO.get(id);

        const response = await stub.fetch('http://do/top');
        const topChannels = await response.json();
        
        return new Response(JSON.stringify(topChannels), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 's-maxage=5, stale-while-revalidate=10' 
            }
        });
    } catch (error) {
        console.error("Durable Object Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
