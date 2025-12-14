const https = require('https');

export default async function handler(req, res) {
    const hasVerify = req.query.verify === 'true';
    const isDirectVisit = req.headers['sec-fetch-dest'] === 'document';
    const referer = req.headers.referer || '';
    const isFromSite = referer.includes('liveplay.vercel.app') || referer.includes('localhost') || referer.includes('litestream-iptv.vercel.app');
    
    if (!hasVerify || isDirectVisit || !isFromSite) {
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send("Thank you, but nothing here");
        return;
    }

    const FAST_TOKEN = 'YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm'; 
    const API_URL = `https://api.fast.com/netflix/speedtest/v2?https=true&token=${FAST_TOKEN}&urlCount=5`;

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');

    try {
        const servers = await new Promise((resolve, reject) => {
            https.get(API_URL, (resp) => {
                let data = '';
                resp.on('data', (chunk) => data += chunk);
                resp.on('end', () => resolve(JSON.parse(data).targets));
                resp.on('error', reject);
            });
        });

        if (!servers || servers.length === 0) return res.status(500).end();

        const downloadUrl = servers[0].url;

        https.get(downloadUrl, (stream) => {
            stream.pipe(res);
        });

    } catch (error) {
        res.status(500).end();
    }
}
