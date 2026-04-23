import { Redis } from '@upstash/redis/cloudflare';

export async function onRequest(context) {
    try {
        const url = new URL(context.request.url);
        const channel = url.searchParams.get('channel');
        
        if (!channel) return new Response('Missing channel', { status: 400 });

        const redis = new Redis({
            url: context.env.UPSTASH_REDIS_REST_URL,
            token: context.env.UPSTASH_REDIS_REST_TOKEN,
        });

        await redis.zincrby('global_top_watch', 1, channel);
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Redis Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
