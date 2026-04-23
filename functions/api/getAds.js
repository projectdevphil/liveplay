export async function onRequest(context) {
    const { request } = context;
    
    const country = request.cf?.country || 'XX';
    const isPH = country === 'PH';
    
    const SEA_COUNTRIES = ['PH', 'SG', 'MY', 'ID', 'TH', 'VN', 'BN', 'KH', 'LA', 'MM', 'TL'];
    const NA_COUNTRIES = [
        'US', 'CA', 'MX', 'BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA', 
        'AG', 'BS', 'BB', 'CU', 'DM', 'DO', 'GD', 'HT', 'JM', 'KN', 
        'LC', 'VC', 'TT', 'PR', 'VI', 'BM', 'KY', 'TC', 'VG', 'AI', 'MS'
    ];
    const EMEAA_COUNTRIES = [
        'AL', 'AD', 'AM', 'AT', 'AZ', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'GE', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'KZ', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'TR', 'UA', 'GB', 'VA',
        'BH', 'IR', 'IQ', 'IL', 'JO', 'KW', 'LB', 'OM', 'PS', 'QA', 'SA', 'SY', 'AE', 'YE',
        'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CD', 'CG', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW',
        'AF', 'BD', 'BT', 'BN', 'KH', 'CN', 'HK', 'MO', 'IN', 'ID', 'JP', 'KP', 'KR', 'KG', 'LA', 'MY', 'MV', 'MN', 'MM', 'NP', 'PK', 'PH', 'SG', 'LK', 'TW', 'TJ', 'TH', 'TM', 'UZ', 'VN'
    ];

    const referer = request.headers.get('referer');
    const host = "liveplayphil.pages.dev";
    
    if (!referer || !referer.includes(host)) {
        return new Response(JSON.stringify({ error: "Access Denied" }), { 
            status: 403,
            headers: { "Content-Type": "application/json" }
        });
    }

    const adPlaylist = [
        {
            videoUrl: 'https://vs-prodamdfandango.akamaized.net/out/v1/9e21ac13e637402bb92e5a0b0103bfcf/24179244572d48768920647994272718/55cfc6748196457d965dfd98aa2d46b8/index.m3u8',
            linkUrl: 'https://www.netflix.com/ph-en/title/81427990?preventIntent=true'
        },
        {
            videoUrl: '/assets/ads/112820250004.mp4',
            linkUrl: 'https://dito.ph/',
            access: 'PH'
        },
        {
            videoUrl: 'https://vs-prodamdfandango.akamaized.net/out/v1/f743a3d65dfa458b986431035c6197ec/24179244572d48768920647994272718/55cfc6748196457d965dfd98aa2d46b8/index.m3u8',
            linkUrl: 'https://www.hbomax.com/shows/heated-rivalry/50cd4e99-04ee-427b-a3b4-da721ed05d9c',
        },
        {
            videoUrl: 'https://clips-media-cf.warnermediacdn.com/beam/clips/2025-12/2101736-1e96250519234647ab86cf9523069ecb/cmaf/master_cl_de.m3u8',
            linkUrl: 'https://www.hbomax.com/bundle/viu',
            access: 'PH'
        }
    ];

    const filteredAds = adPlaylist.filter(ad => {
        if (!ad.access) return true;
        
        switch (ad.access) {
            case 'PH': return isPH;
            case 'Non-PH': return !isPH;
            case 'US': return country === 'US';
            case 'SEA': return SEA_COUNTRIES.includes(country);
            case 'NA': return NA_COUNTRIES.includes(country);
            case 'EMEAA': return EMEAA_COUNTRIES.includes(country);
            case 'EMEAA x PH': return EMEAA_COUNTRIES.includes(country) && !isPH;
            case 'EMEAANA': return (EMEAA_COUNTRIES.includes(country) || NA_COUNTRIES.includes(country));   
            case 'EMEAANA x PH': return (EMEAA_COUNTRIES.includes(country) || NA_COUNTRIES.includes(country)) && !isPH;
            default: return true;
        }
    });

    return new Response(JSON.stringify(filteredAds), {
        status: 200,
        headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "no-store" 
        }
    });
}
