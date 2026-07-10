async function generateSignature(message, secret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(message)
    );
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

async function verifySignature(message, signature, secret) {
    const expected = await generateSignature(message, secret);
    return signature === expected;
}

export async function onRequest(context) {
    const url = new URL(context.request.url);
    const channelName = url.searchParams.get("channel");
    const expires = parseInt(url.searchParams.get("expires") || "0", 10);
    const token = url.searchParams.get("token");

    const allowedOrigin = "https://liveplayph.pages.dev";
    const secretKey = context.env.STREAM_SECRET || "fallback-secret-key-123";

    const origin = context.request.headers.get("Origin");
    if (origin && origin !== allowedOrigin) {
        return new Response("Unauthorized Domain Access", { status: 403 });
    }

    if (!channelName || !expires || !token) {
        return new Response("Missing Security Parameters", { status: 400 });
    }

    if (Date.now() > expires) {
        return new Response("Stream Session Expired", { status: 403 });
    }

    const message = `${channelName}:${expires}`;
    const isValid = await verifySignature(message, token, secretKey);
    if (!isValid) {
        return new Response("Invalid Security Token", { status: 403 });
    }

    const channels = [
        { name: 'TV5', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/tv5_hd/default1/index.mpd' },
        { name: 'One Sports', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_onesports_hd/default/index.mpd' },
        { name: 'RPTV', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cnn_rptv_prod_hd/default/index.mpd' },
        { name: 'PTV4', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_ptv4_sd/default/index.mpd' },
        { name: 'IBC 13', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/ibc13_sd_new/default/index.mpd' },
        { name: 'ABS-CBN News Channel', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/anc-ph3/manifest.mpd' },
        { name: 'Bilyonaryo News Channel', manifestUri: 'https://amg19223-amg19223c11-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c11-amgplt0352/playlist.m3u8' },
        { name: 'DZMM Teleradyo', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-teleradyo-dash-abscbnono/index.mpd' },
        { name: 'One News', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/onenews_hd1/default/index.mpd' },
        { name: 'One PH', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/oneph_sd/default/index.mpd' },
        { name: 'True TV', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/truefm_tv/default/index.mpd' },
        { name: 'Jeepney TV', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/jeepneytv/manifest.mpd' },
        { name: 'Kapatid Channel', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/kapatid_hd/default/index.mpd' },
        { name: 'TVN Premium', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_tvnpre/default/index.mpd' },
        { name: 'Cinema One', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/c1ph/manifest.mpd' },
        { name: 'HBO', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_hbohd/default/index.mpd' },
        { name: 'PBA Rush', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_pbarush_hd1/default/index.mpd' },
        { name: 'NBA TV Philippines', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cgnl_nba/default/index.mpd' },
        { name: 'Cartoon Network', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cartoonnetworkhd/default/index.mpd' },
        { name: 'DreamWorks (Tagalized)', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_dreamworktag/default/index.mpd' },
        { name: 'Knowledge Channel', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/kc/manifest.mpd' },
        { name: 'MYX', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-myxnola-dash-abscbnono/index.mpd' },
        { name: 'New K-Pop', manifestUri: 'https://newidco-newkid-1-eu.xiaomi.wurl.tv/playlist.m3u8' },
        { name: 'ASAP XP Livestream', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/asap/manifest.mpd' },
        { name: "It's Showtime Livestream", manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/itsshowtime/manifest.mpd' },
        { name: 'The Healing Eucharist Livestream', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/healingeucharist3/manifest.mpd' },
        { name: 'TV Patrol Livestream', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/tvp-ph/manifest.mpd' }
    ];

    const foundChannel = channels.find(c => c.name === channelName);
    if (!foundChannel) {
        return new Response("Stream Route Not Configured", { status: 404 });
    }

    try {
        const fetchHeaders = new Headers(context.request.headers);
        fetchHeaders.delete("host");
        fetchHeaders.delete("referer");
        fetchHeaders.delete("origin");

        const response = await fetch(foundChannel.manifestUri, {
            headers: fetchHeaders,
            method: "GET"
        });

        if (!response.ok) {
            return new Response("Upstream Streaming Server Error", { status: response.status });
        }

        let manifestText = await response.text();
        const baseUrl = foundChannel.manifestUri.substring(0, foundChannel.manifestUri.lastIndexOf('/') + 1);

        if (foundChannel.manifestUri.includes('.mpd') && !manifestText.includes('<BaseURL>')) {
            manifestText = manifestText.replace('<MPD', `<MPD><BaseURL>${baseUrl}</BaseURL>`);
        } else if (foundChannel.manifestUri.includes('.m3u8')) {
            const lines = manifestText.split('\n');
            const rewritten = lines.map(line => {
                const trimmed = line.trim();
                if (trimmed.length === 0 || trimmed.startsWith('#')) return line;
                if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
                    return baseUrl + trimmed;
                }
                return line;
            });
            manifestText = rewritten.join('\n');
        }

        const proxyResponseHeaders = new Headers(response.headers);
        proxyResponseHeaders.set("Access-Control-Allow-Origin", allowedOrigin);
        proxyResponseHeaders.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        proxyResponseHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");

        return new Response(manifestText, {
            status: 200,
            headers: proxyResponseHeaders
        });

    } catch (err) {
        return new Response("Could not connect to streaming upstream", { status: 502 });
    }
}
