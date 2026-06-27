export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    const hasVerify = url.searchParams.get('verify') === 'true';
    const isDirectVisit = request.headers.get('sec-fetch-dest') === 'document';
    const referer = request.headers.get('referer') || '';
    const isFromSite = referer.includes('liveplayph.pages.dev');
    
    if (!hasVerify || isDirectVisit || !isFromSite) {
        return new Response("Thank you, but nothing here", {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    const FAST_TOKEN = 'YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm'; 
    const API_URL = `https://api.fast.com/netflix/speedtest/v2?https=true&token=${FAST_TOKEN}&urlCount=5`;

    try {
        const apiResponse = await fetch(API_URL);
        const data = await apiResponse.json();
        const servers = data.targets;

        if (!servers || servers.length === 0) {
            return new Response(null, { status: 500 });
        }

        const downloadUrl = servers[0].url;

        const streamResponse = await fetch(downloadUrl);

        return new Response(streamResponse.body, {
            status: 200,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Cache-Control': 'no-cache'
            }
        });

    } catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
