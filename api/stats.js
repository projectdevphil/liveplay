import { createClient } from '@vercel/kv';

export default async function handler(req, res) {
    const { action, page } = req.query;

    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        console.warn("Database not connected. Returning dummy stats.");
        return res.status(200).json({ 
            home: { total: 0, active: 0 }, 
            tv: { total: 0, active: 0 }, 
            grandTotal: 0 
        });
    }

    const kv = createClient({ url, token });

    try {
        if (action === 'track' && page) {
            if (page !== 'home' && page !== 'tv') return res.status(400).json({ error: 'Invalid page' });

            const now = Date.now();
            const userId = req.headers['x-forwarded-for'] || `user-${Math.random()}`;

            await Promise.all([
                kv.incr(`stats:total:${page}`),
                kv.zadd(`stats:active_set:${page}`, { score: now, member: userId }),
                kv.zremrangebyscore(`stats:active_set:${page}`, 0, now - 60000)
            ]);

            return res.status(200).json({ success: true });
        }

        const now = Date.now();
        const oneMinuteAgo = now - 60000;

        await Promise.allSettled([
            kv.zremrangebyscore('stats:active_set:home', 0, oneMinuteAgo),
            kv.zremrangebyscore('stats:active_set:tv', 0, oneMinuteAgo)
        ]);

        const [totalHome, activeHome, totalTv, activeTv] = await Promise.all([
            kv.get('stats:total:home'),
            kv.zcard('stats:active_set:home'),
            kv.get('stats:total:tv'),
            kv.zcard('stats:active_set:tv')
        ]);

        const hTotal = parseInt(totalHome) || 0;
        const tTotal = parseInt(totalTv) || 0;

        return res.status(200).json({
            home: { total: hTotal, active: parseInt(activeHome) || 0 },
            tv: { total: tTotal, active: parseInt(activeTv) || 0 },
            grandTotal: hTotal + tTotal
        });

    } catch (error) {
        console.error("Redis Error:", error);
        return res.status(200).json({ 
            home: { total: 0, active: 0 }, 
            tv: { total: 0, active: 0 }, 
            grandTotal: 0 
        });
    }
}
