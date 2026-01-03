import { Redis } from '@upstash/redis';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL,
      token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN,
    });

    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const page = url.searchParams.get('page');

    if (action === 'track' && page) {
        if (page !== 'home' && page !== 'tv') {
            return new Response('Invalid page', { status: 400 });
        }

        const now = Date.now();
        const userId = 'user-' + Math.random().toString(36).substring(7);

        await Promise.all([
            redis.incr(`stats:total:${page}`),
            redis.zadd(`stats:active_set:${page}`, { score: now, member: userId }),
            redis.zremrangebyscore(`stats:active_set:${page}`, 0, now - 60000)
        ]);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' }
        });
    }
    
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    await Promise.allSettled([
        redis.zremrangebyscore('stats:active_set:home', 0, oneMinuteAgo),
        redis.zremrangebyscore('stats:active_set:tv', 0, oneMinuteAgo)
    ]);

    const [totalHome, activeHome, totalTv, activeTv] = await Promise.all([
        redis.get('stats:total:home'),
        redis.zcard('stats:active_set:home'),
        redis.get('stats:total:tv'),
        redis.zcard('stats:active_set:tv')
    ]);

    const hTotal = Number(totalHome) || 0;
    const tTotal = Number(totalTv) || 0;

    const data = {
        home: { total: hTotal, active: Number(activeHome) || 0 },
        tv: { total: tTotal, active: Number(activeTv) || 0 },
        grandTotal: hTotal + tTotal
    };

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 
            'content-type': 'application/json',
            'cache-control': 'no-store, max-age=0' 
        }
    });

  } catch (error) {
    console.error("Stats API Error:", error);
    return new Response(JSON.stringify({
        home: { total: 0, active: 0 },
        tv: { total: 0, active: 0 },
        grandTotal: 0
    }), { 
        status: 200, 
        headers: { 'content-type': 'application/json' } 
    });
  }
}
