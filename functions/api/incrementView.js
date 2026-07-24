async function hashIP(ip) {
    const msgBuffer = new TextEncoder().encode(ip);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequest(context) {
    try {
        const url = new URL(context.request.url);
        const channelId = url.searchParams.get('channel') || url.searchParams.get('id');
        
        if (!channelId) return new Response('Missing channel ID', { status: 400 });

        const ip = context.request.headers.get('CF-Connecting-IP') || '127.0.0.1';
        const ipHash = await hashIP(ip);

        await context.env.DB.prepare(`
            CREATE TABLE IF NOT EXISTS channel_views (
                id TEXT,
                ip_hash TEXT,
                PRIMARY KEY (id, ip_hash)
            )
        `).run();

        const query = `
            INSERT OR IGNORE INTO channel_views (id, ip_hash) 
            VALUES (?1, ?2)
        `;
        
        await context.env.DB.prepare(query).bind(channelId, ipHash).run();
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("D1 Database Error:", error);
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
