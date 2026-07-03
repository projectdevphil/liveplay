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
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="icon" type="image/png" href="/assets/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <link rel="shortcut icon" href="/assets/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Liveplay" />
    <link rel="manifest" href="/assets/site.webmanifest" />
    <link rel="stylesheet" href="/css/status.css" />
</head>
<body>
    <div class="container">
        <div class="logo">liveplay</div>
        <h1 class="error-title">Oops! Sorry po!</h1>
        <p class="small-text no-margin">
            Liveplay is a free live TV streaming platform available exclusively in the Philippines.
        <br><br>
            Unfortunately, our service is not available in your region.
        </p>
    </div>
</body>
</html>
  `;
}
