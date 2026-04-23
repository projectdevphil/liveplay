export async function onRequest(context) {
    const request = context.request;
    const url = new URL(request.url);
    
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return await context.next();
    }

    const referer = request.headers.get("referer") || request.headers.get("referrer") || request.headers.get("origin");
    const host = url.host;
    
    if (!referer || !referer.includes(host)) {
        return new Response(JSON.stringify({ error: "Access Denied" }), {
            status: 403,
            headers: { "Content-Type": "application/json" }
        });
    }

    return await context.next();
}
