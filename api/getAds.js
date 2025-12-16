export default function handler(req, res) {
    const referer = req.headers.referer || req.headers.referrer;
    const host = req.headers.host;
    
    if (!referer || !referer.includes(host)) {
        return res.status(403).json({ error: "Access Denied" });
    }

    const country = req.headers['x-vercel-ip-country'] || 'XX';
    const isPH = country === 'PH';
    const SEA_COUNTRIES = ['PH', 'SG', 'MY', 'ID', 'TH', 'VN', 'BN', 'KH', 'LA', 'MM', 'TL'];

    const adPlaylist = [
        {
            //videoUrl: '/assets/ads/112620250001.mp4',
            videoUrl: 'https://vs-prodamdfandango.akamaized.net/out/v1/9e21ac13e637402bb92e5a0b0103bfcf/24179244572d48768920647994272718/55cfc6748196457d965dfd98aa2d46b8/index.m3u8',
            linkUrl: 'https://www.netflix.com/ph-en/title/81427990?preventIntent=true'
        },
        {
            videoUrl: '/assets/ads/112720250002.mp4',
            linkUrl: 'https://www.netflix.com/ph-en/title/81427990?preventIntent=true'
        },
        {
            videoUrl: '/assets/ads/112720250003.mp4',
            linkUrl: 'https://www.netflix.com/ph-en/title/81427990?preventIntent=true'
        },
        {
            videoUrl: '/assets/ads/112820250004.mp4',
            linkUrl: 'https://dito.ph/',
            access: 'PH'
        },
        //{
            //videoUrl: '/assets/ads/120220250005.mp4',
            //linkUrl: '/home/updates'
        //},
        {
            //videoUrl: '/assets/ads/120620250006.mp4',
            videoUrl: 'https://vs-prodamdfandango.akamaized.net/out/v1/f743a3d65dfa458b986431035c6197ec/24179244572d48768920647994272718/55cfc6748196457d965dfd98aa2d46b8/index.m3u8',
            linkUrl: 'https://www.hbomax.com/shows/heated-rivalry/50cd4e99-04ee-427b-a3b4-da721ed05d9c',
            access: 'PH'
        },
        {
            //videoUrl: '/assets/ads/120720250007.mp4',
            videoUrl: 'https://clips-media-cf.warnermediacdn.com/beam/clips/2025-12/2101736-1e96250519234647ab86cf9523069ecb/cmaf/master_cl_de.m3u8',
            linkUrl: 'https://www.hbomax.com/bundle/viu',
            access: 'PH'
        }
    ];

    const filteredAds = adPlaylist.filter(ad => {
        if (!ad.access) return true;
        
        switch (ad.access) {
            case 'PH':
                return isPH;
            case 'Non-PH':
                return !isPH;
            case 'US':
                return country === 'US';
            case 'SEA':
                return SEA_COUNTRIES.includes(country);
            default:
                return true;
        }
    });

    res.status(200).json(filteredAds);
}
