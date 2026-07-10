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

function hexToBase64Url(hex) {
    const match = hex.match(/.{1,2}/g);
    if (!match) return '';
    const bytes = new Uint8Array(match.map(byte => parseInt(byte, 16)));
    let binString = '';
    for (let i = 0; i < bytes.length; i++) {
        binString += String.fromCharCode(bytes[i]);
    }
    return btoa(binString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export async function onRequest(context) {
    const method = context.request.method;
    if (method !== "POST" && method !== "OPTIONS") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(context.request.url);
    const channelName = url.searchParams.get("channel");
    const expires = parseInt(url.searchParams.get("expires") || "0", 10);
    const token = url.searchParams.get("token");

    const allowedOrigin = "https://liveplayph.pages.dev";
    const secretKey = context.env.STREAM_SECRET || "fallback-secret-key-123";

    if (method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": allowedOrigin,
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });
    }

    const origin = context.request.headers.get("Origin");
    if (origin && origin !== allowedOrigin) {
        return new Response("Unauthorized Domain Access", { status: 403 });
    }

    if (!channelName || !expires || !token) {
        return new Response("Missing Security Parameters", { status: 400 });
    }

    if (Date.now() > expires) {
        return new Response("DRM Session Expired", { status: 403 });
    }

    const message = `${channelName}:${expires}`;
    const isValid = await verifySignature(message, token, secretKey);
    if (!isValid) {
        return new Response("Invalid DRM Token", { status: 403 });
    }

    const keysDb = {
        'TV5': { kid: '9c3e7a516d824f04a9175b8c2e3d7040', key: '524a9c2cec98272f71c347345a3fd12e' },
        'One Sports': { kid: '69f5a2318d744c609b125e3a7d8f2046', key: '182523c0bae912e17e916dd4283280e9' },
        'RPTV': { kid: 'b5d7a6219c434e188f026a3d7c5e9148', key: '28e1244057ff6feae879c1e985ded0fb' },
        'PTV4': { kid: 'f8c2a6915d744b309e186a3f7c2d8049', key: '1ad3243b38c60312caa6ba11f150c19c' },
        'IBC 13': { kid: 'f4a8d6216c954e709b187d3a5f2c8049', key: '34710df996a4089ee6f7e8deb7f46586' },
        'ABS-CBN News Channel': { kid: 'b6d6e536f8fa4d8b93627af0128cf00d', key: 'e73c8dcfdea374ae576ced342f6c73a2' },
        'DZMM Teleradyo': { kid: '47c093e0c9fd4f80839a0337da3dd876', key: '603248b858276f533a13e17f2f48c711' },
        'One News': { kid: 'd5c8a2914e734b609f127a3d6c5e8048', key: '11368a3b001407d65a85b4edb410ecdd' },
        'One PH': { kid: '5e9a3c718d464f20b9157a6c2e4d8031', key: '7bf8a7666a2d572fe111b5f829c99266' },
        'True TV': { kid: '8c4e9a516d724f30b2187a3c5e9d6041', key: 'e25c167573772b510ff8e5282560a349' },
        'Jeepney TV': { kid: 'dc9fec234a5841bb8d06e92042c741ec', key: '225676f32612dc803cb4d0f950d063d0' },
        'Kapatid Channel': { kid: '8f7a2c913d6b4e5a9f127c8d4e6a1b90', key: 'a73d3d1211fb23084c62572706f45397' },
        'TVN Premium': { kid: '3a7f9c615d824e40a9168c5b2d7f3049', key: '2bc91eced1660ecf88299a42e4c0cd91' },
        'Cinema One': { kid: '55eddd1e157e4c3b830866e4679e7032', key: '525030e984567ba8df0af80660952368' },
        'HBO': { kid: 'd7f3c8215a944e068b176c9d2a5f3048', key: '93c0a798243d6443864d1a7ff3e42c05' },
        'PBA Rush': { kid: '91a5e6327c844f09b2186d3a5e7c2041', key: '984beb3aeff3554c1a5acc04d6044e55' },
        'NBA TV Philippines': { kid: '2f7c9a615d834e40b2188a6d3c7f9042', key: '41d2ade5ff1798859420e925d5d2080d' },
        'Cartoon Network': { kid: '53c8e6914d724f309e186a3f7c2d8043', key: '1e17afbdfff786533796780f3f04aa67' },
        'DreamWorks (Tagalized)': { kid: '6f9c3a218d454b70a2187e5c3d6f9042', key: '337ca7b74b462dd1ba7441553614538a' },
        'Knowledge Channel': { kid: 'bd1f88dd3b254514bf7a113188c10dc2', key: 'ea86da60f0116f3b92a86acf45b8e071' },
        'MYX': { kid: 'f40a52a3ac9b4702bdd5b735d910fd2f', key: '35e4893c6e76546085941be3010932d4' },
        'ASAP XP Livestream': { kid: '6379f85c61d84b5db3be564bf59f4e13', key: 'd9a1f47f7a58f5a9598a452081155df4' },
        "It's Showtime Livestream": { kid: '3cdb78338a104ed594175a49532c823d', key: '9c7810c46873053be29d26bf6f753664' },
        'The Healing Eucharist Livestream': { kid: 'b84ec93eb33c48e58718e99cd4096c15', key: '9e3a9aee29cbd0375e02c55e0b7b5945' },
        'TV Patrol Livestream': { kid: 'a14583678b4d40b4a267c5845f673263', key: '98252f8318d84c55b10dd7a112622bd4' }
    };

    const targetKey = keysDb[channelName];
    if (!targetKey) {
        return new Response("Key not found in lookup system", { status: 404 });
    }

    const jwks = {
        keys: [
            {
                kty: "oct",
                kid: hexToBase64Url(targetKey.kid),
                k: hexToBase64Url(targetKey.key)
            }
        ],
        type: "temporary"
    };

    return new Response(JSON.stringify(jwks), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": allowedOrigin,
            "Cache-Control": "no-cache, no-store, must-revalidate"
        }
    });
}
