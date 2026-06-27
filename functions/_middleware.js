export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return await next();
  }

  const clientCountry = request.headers.get("CF-IPCountry");
  const asnOrg = (request.cf?.asOrganization || "").toLowerCase();

  if (clientCountry !== "PH") {
    return new Response(getBlockedHTML(), {
      status: 403,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }

  const vpnNetworks = [
    "digitalocean", "m247", "amazon", "google", "linode", "vultr", 
    "contabo", "gcore", "ovh", "choopa", "leaseweb", "servers", 
    "zenlayer", "datacamp", "sharktech", "microsoft", "cloudflare",
    "cogent", "pccw", "akamai", "fastly", "biznet", "equinix", "he.net",
    "hurricane electric", "host", "hosting", "datacenter", "server", "cloud", "xyz"
  ];

  const isVpnHost = vpnNetworks.some(net => asnOrg.includes(net));

  if (isVpnHost) {
    return new Response(getBlockedHTML(), {
      status: 403,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }

  return await next();
}

function getBlockedHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Access Restricted - Liveplay</title>
    <meta name="theme-color" content="#000000">
    <link rel="icon" type="image/png" href="/assets/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <link rel="shortcut icon" href="/assets/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Liveplay" />
    <link rel="manifest" href="/assets/site.webmanifest" />
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap');
        
        :root {
            --theme-color: #ffffff; 
            --background-color: #000000;
            --text-color: #ffffff;
            --text-secondary: #888888;
        }
        
        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Onest', sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            text-align: center;
            flex-direction: column;
            padding: 30px;
            -webkit-tap-highlight-color: transparent;
            -webkit-user-select: none;
            user-select: none;
        }
        
        .container {
            max-width: 600px;
            width: 100%;
        }
        
        .logo {
            font-weight: 800;
            font-size: 2rem;
            margin-bottom: 60px;
            display: block;
            text-transform: lowercase;
            letter-spacing: -0.5px;
        }

        h1 {
            font-size: clamp(2.2rem, 9vw, 5rem);
            margin: 0;
            margin-bottom: 30px;
            font-weight: 800;
            color: var(--theme-color);
            line-height: 1.1;
            letter-spacing: -0.04em;
            white-space: nowrap;
        }

        p {
            color: var(--text-secondary);
            margin-bottom: 0;
            font-size: 0.9rem;
            line-height: 1.6;
            font-weight: 400;
            padding: 0 10px;
        }

        @media (max-width: 768px) {
            .logo { margin-bottom: 40px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">liveplay</div>
        <h1>Oops! Sorry po!</h1>
        <p>
            Liveplay is a free Live TV Streaming platform that's only available in the Philippines.
            <br><br>
            Unfortunately, we're not currently available in your area.
        </p>
    </div>
</body>
</html>
  `;
}
