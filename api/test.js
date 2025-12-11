const https = require('https');

export default async function handler(req, res) {
    const FAST_TOKEN = 'YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm'; 
    const API_URL = `https://api.fast.com/netflix/speedtest/v2?https=true&token=${FAST_TOKEN}&urlCount=5`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const servers = await new Promise((resolve, reject) => {
            https.get(API_URL, (resp) => {
                let data = '';
                resp.on('data', (chunk) => data += chunk);
                resp.on('end', () => resolve(JSON.parse(data).targets));
                resp.on('error', reject);
            });
        });

        if (!servers || servers.length === 0) {
            res.write(`data: ${JSON.stringify({ error: 'No servers found' })}\n\n`);
            return res.end();
        }

        const downloadUrl = servers[0].url;
        let totalBytes = 0;
        let startTime = Date.now();

        const request = https.get(downloadUrl, (stream) => {
            stream.on('data', (chunk) => {
                totalBytes += chunk.length;
                const currentTime = Date.now();
                const duration = (currentTime - startTime) / 1000;

                if (duration > 0.2) {
                    const mbps = ((totalBytes * 8) / duration) / 1000000;
                    res.write(`data: ${JSON.stringify({ speed: mbps.toFixed(2), progress: 'running' })}\n\n`);
                    if (res.flush) res.flush(); 
                }
            });

            stream.on('end', () => {
                const duration = (Date.now() - startTime) / 1000;
                const mbps = ((totalBytes * 8) / duration) / 1000000;
                res.write(`data: ${JSON.stringify({ speed: mbps.toFixed(2), progress: 'done' })}\n\n`);
                res.end();
            });
        });

        setTimeout(() => {
            try { request.destroy(); } catch(e){}
            res.end();
        }, 9000);

    } catch (error) {
        res.write(`data: ${JSON.stringify({ error: 'Connection Failed' })}\n\n`);
        res.end();
    }
}
