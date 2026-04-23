export class TopChannelsDO {
    constructor(state, env) {
        this.state = state;
        this.counts = null;
        
        this.state.blockConcurrencyWhile(async () => {
            const storedData = await this.state.storage.list();
            this.counts = new Map(storedData);
        });
    }

    async fetch(request) {
        const url = new URL(request.url);
        
        if (url.pathname === '/increment') {
            const channel = url.searchParams.get('channel');
            if (!channel) return new Response('Missing channel', { status: 400 });

            let count = this.counts.get(channel) || 0;
            count++;
            this.counts.set(channel, count);
            
            this.state.storage.put(channel, count);
            
            return new Response(JSON.stringify({ success: true }), { 
                status: 200, 
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (url.pathname === '/top') {
            const sorted = Array.from(this.counts.entries())
                                .sort((a, b) => b[1] - a[1]);
            
            const top50 = sorted.slice(0, 50).map(entry => entry[0]);

            return new Response(JSON.stringify(top50), { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response('Not Found', { status: 404 });
    }
}
