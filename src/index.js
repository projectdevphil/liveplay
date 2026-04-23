export class LeaderboardDO {
    constructor(state, env) {
        this.state = state;
    }

    async fetch(request) {
        const url = new URL(request.url);

        if (url.pathname === '/increment') {
            const channel = url.searchParams.get('channel');
            if (!channel) return new Response('Missing channel', { status: 400 });

            let views = (await this.state.storage.get(`channel:${channel}`)) || 0;
            views++;
            await this.state.storage.put(`channel:${channel}`, views);

            return new Response(JSON.stringify({ success: true }));
        }

        if (url.pathname === '/top') {
            const entries = await this.state.storage.list({ prefix: 'channel:' });
            const channels = [];
            
            for (const [key, value] of entries) {
                channels.push({ 
                    slug: key.replace('channel:', ''), 
                    views: value 
                });
            }

            channels.sort((a, b) => b.views - a.views);

            const top50 = channels.slice(0, 50).map(c => c.slug);

            return new Response(JSON.stringify(top50));
        }

        return new Response('Not found', { status: 404 });
    }
}

export default {
    async fetch(request, env) {
        return new Response("Durable Object Worker is running.");
    }
}
