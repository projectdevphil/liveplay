let garbageChunk = null;
const CHUNK_SIZE = 2 * 1024 * 1024;

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    const referer = request.headers.get('referer') || '';
    const isFromSite = referer.includes('liveplayph.pages.dev') || 
                       referer.includes('localhost') || 
                       referer.includes('127.0.0.1');
    
    if (!isFromSite) {
        return new Response("Unauthorized", { status: 403 });
    }

    if (url.searchParams.get('ping') === 'true') {
        return new Response("pong", {
            status: 200,
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' }
        });
    }

    if (request.method === 'POST') {
        try {
            await request.body?.pipeTo(new WritableStream());
            return new Response("OK", { status: 200 });
        } catch (e) {
            return new Response("Upload Error", { status: 500 });
        }
    }

    if (!garbageChunk) {
        garbageChunk = new Uint8Array(CHUNK_SIZE);
        crypto.getRandomValues(garbageChunk);
    }

    const totalBytes = 50 * 1024 * 1024;
    let bytesSent = 0;

    const stream = new ReadableStream({
        pull(controller) {
            if (bytesSent >= totalBytes) {
                controller.close();
                return;
            }
            const remaining = totalBytes - bytesSent;
            if (remaining >= CHUNK_SIZE) {
                controller.enqueue(garbageChunk);
                bytesSent += CHUNK_SIZE;
            } else {
                controller.enqueue(garbageChunk.subarray(0, remaining));
                bytesSent += remaining;
            }
        }
    });

    return new Response(stream, {
        status: 200,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': totalBytes.toString(),
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    });
}
