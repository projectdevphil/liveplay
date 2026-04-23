import { Redis } from '@upstash/redis/cloudflare';

export async function onRequest(context) {
    try {
        const redis = new Redis({
            url: context.env.UPSTASH_REDIS_REST_URL,
            token: context.env.UPSTASH_REDIS_REST_TOKEN,
        });

        const topChannels = await redis.zrange('global_top_watch', 0, 49, { rev: true });
        
        return new Response(JSON.stringify(topChannels), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 's-maxage=5, stale-while-revalidate=10' 
            }
        });
    } catch (error) {
        console.error("Redis Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
