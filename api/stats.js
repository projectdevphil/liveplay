import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    const { action, page } = req.query;

    try {
        if (action === 'track' && page) {
            const validPages = ['home', 'tv'];
            if (!validPages.includes(page)) {
                return res.status(400).json({ error: 'Invalid page' });
            }

            const now = Date.now();
            const userId = req.headers['x-forwarded-for'] || `anon-${Math.random().toString(36).substring(7)}`;

            await kv.incr(`stats:total:${page}`);

            await kv.zadd(`stats:active_set:${page}`, { score: now, member: userId });

            const oneMinuteAgo = now - 60000;
            await kv.zremrangebyscore(`stats:active_set:${page}`, 0, oneMinuteAgo);

            return res.status(200).json({ success: true });
        }
        
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        await Promise.all([
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
            home: {
                total: hTotal,
                active: parseInt(activeHome) || 0
            },
            tv: {
                total: tTotal,
                active: parseInt(activeTv) || 0
            },
            grandTotal: hTotal + tTotal
        });

    } catch (error) {
        console.error('Stats API Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
