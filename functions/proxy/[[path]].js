export async function onRequest(context) {
    const url = new URL(context.request.url);

    const targetUrlStr = url.pathname.replace(/^\/proxy\//, '') + url.search;

    if (!targetUrlStr.startsWith('http://') && !targetUrlStr.startsWith('https://')) {
        return new Response("Usage: https://liveplayph.pages.dev/proxy/http://136.158.97.2:6610/...", { status: 400 });
    }

    if (context.request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
                'Access-Control-Allow-Headers': '*',
            },
        });
    }

    try {
        const modifiedHeaders = new Headers(context.request.headers);
        modifiedHeaders.delete('host');

        const response = await fetch(targetUrlStr, {
            method: context.request.method,
            headers: modifiedHeaders,
        });

        const responseHeaders = new Headers(response.headers);
        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
        responseHeaders.set('Access-Control-Allow-Headers', '*');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (err) {
        return new Response('Proxy Error: ' + err.message, { status: 500 });
    }
}
