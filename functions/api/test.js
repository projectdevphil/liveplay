let garbageChunk = null;
const CHUNK_SIZE = 256 * 1024;

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    const hasVerify = url.searchParams.get('verify') === 'true';
    const isDirectVisit = request.headers.get('sec-fetch-dest') === 'document';
    const referer = request.headers.get('referer') || '';
    
    const isFromSite = referer.includes('liveplayph.pages.dev') || 
                       referer.includes('localhost') || 
                       referer.includes('127.0.0.1');
    
    if (!hasVerify || isDirectVisit || !isFromSite) {
        return new Response("Thank you, but nothing here", {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    if (!garbageChunk) {
        garbageChunk = new Uint8Array(CHUNK_SIZE);
        crypto.getRandomValues(garbageChunk);
    }

    const sizeParam = url.searchParams.get('size');
    let totalBytes = 100 * 1024 * 1024;
    if (sizeParam) {
        const parsed = parseInt(sizeParam, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 500) {
            totalBytes = parsed * 1024 * 1024;
        }
    }

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
