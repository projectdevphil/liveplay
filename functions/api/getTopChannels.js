export async function onRequest(context) {
    try {
        const url = new URL(context.request.url);
        const channel = url.searchParams.get('channel');
        
        if (!channel) return new Response('Missing channel', { status: 400 });

        const id = context.env.TOP_CHANNELS_DO.idFromName('global_top_watch');
        const stub = context.env.TOP_CHANNELS_DO.get(id);

        const response = await stub.fetch(`http://do/increment?channel=${encodeURIComponent(channel)}`);
        
        return new Response(JSON.stringify({ success: response.ok }), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Durable Object Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
