export default function handler(req, res) {
    const referer = req.headers.referer || req.headers.referrer;
    const host = req.headers.host;
    
    if (!referer || !referer.includes(host)) {
        return res.status(403).json({ error: "Access Denied" });
    }

    const country = req.headers['x-vercel-ip-country'] || 'XX';
    const isPH = country === 'PH';

    const SEA_COUNTRIES = ['PH', 'SG', 'MY', 'ID', 'TH', 'VN', 'BN', 'KH', 'LA', 'MM', 'TL'];

    const slidesData = [
        {
            title: "Coming Soon",
            description: "New name, same interface.<br><strong>litestream</strong> rebrands to <strong>liveplay</strong>.",
            image: "/assets/poster/rebranding_poster.png",
            badge: "Coming this Christmas",
            link: null,
        },
        {
            title: "SEA Games:<br>Thailand 2025",
            ph_description: "<strong>Catch-Up TV</strong>: TV5, RPTV, and One Sports<br><strong>Livestream</strong>: Pilipinas Live Channels",
            image: "/assets/poster/seagames_thailand_2025_poster.png",
            badge: "Watch Now • Event • Sports",
            link: null,
            access: 'PH'
        },
        {
            title: "FPJ's Batang Quiapo",
            ph_description: "<strong>MON-FRI | 8PM</strong><br>Kapamilya Channel, A2Z and TV5",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/batangquiapo.herobg-tv.v3.jpg?im_policy=landscapeHero_tv_hd",
            badge: "Catch-Up TV • Action",
            link: null
        },
        {
            title: "ROJA",
            ph_description: "<strong>MON-FRI | 8:45PM</strong><br>Kapamilya Channel, A2Z and TV5",
            nonph_description: "<strong>on TFC </strong>",
            image: "https://occ-0-1763-395.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABQ2QL_Xl927R68dyQNd7mIavq3jzl6TXs2baGhbYVxfZNeMUOlnLsPelcmT2_iKWf0qLeFKMXQd4Dsx57QeHuuO2TS4iIKn3EFKO.webp",
            badge: "Catch-Up TV • Action",
            link: null
        },
        {
            title: "PBB Celebrity Collab<br>Edition 2.0",
            ph_description: "<strong>MON-FRI | 9:40PM<br>SAT | 6:15PM<br>SUN | 10:05PM</strong><br>GMA7 and PBB Catch-Up Episode",
            nonph_description: "<strong>MON-FRI | 9:40PM PHT<br>SAT | 6:15PM PHT<br>SUN | 10:05PM PHT</strong><br>PBB Catch-Up Episode",
            image: "https://pql-static.abs-cbn.com/images/pbbcelebritycollab.herobg-tv.V4.JPG?im_policy=landscapeHero_tv_hd",
            badge: "Catch-Up TV • Reality",
            link: null
        },
        {
            title: "It's Showtime",
            ph_description: "<strong>MON-SAT | 12NN</strong><br>Kapamilya Channel, A2Z and GMA7",
            nonph_description: "<strong>on TFC and GMA Pinoy TV</strong>",
            image: "https://pql-static.abs-cbn.com/images/itsshowtime.herobg-tv.jpg?im_policy=landscapeHero_tv_fhd",
            badge: "Catch-Up TV • Variety",
            link: null
        },
        {
            title: "NBA TV Philippines",
            description: "",
            image: "https://occ-0-1763-395.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABcFuldBLfH2n_0Wiqx4rnmEyjCmJQdy7hbdu7D3ymqfYkqrDcBbgJt9iNU5EbhBzPmU97xqDUYDip3ZSb1y2AFfJdalF4fmaqnP4.webp",
            badge: "Watch Now • Sports",
            link: "/home?channel=nba-tv-philippines",
            access: "PH"
        },
        {
            title: "NBA TV",
            description: "",
            image: "https://occ-0-1763-395.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABcFuldBLfH2n_0Wiqx4rnmEyjCmJQdy7hbdu7D3ymqfYkqrDcBbgJt9iNU5EbhBzPmU97xqDUYDip3ZSb1y2AFfJdalF4fmaqnP4.webp",
            badge: "Watch Now • Sports",
            link: "/home?channel=nba-tv",
            access: "Non-PH"
        }
    ];

    const filteredSlides = slidesData.filter(slide => {
        if (!slide.access) return true;
        if (slide.access === 'PH' && isPH) return true;
        if (slide.access === 'Non-PH' && !isPH) return true;
        if (slide.access === 'US' && country === 'US') return true;
        if (slide.access === 'SEA' && SEA_COUNTRIES.includes(country)) return true;
        return false;
    }).map(slide => {
        let finalDescription = slide.description;
        
        if (isPH && slide.ph_description) {
            finalDescription = slide.ph_description;
        } else if (!isPH && slide.nonph_description) {
            finalDescription = slide.nonph_description;
        }

        return {
            ...slide,
            description: finalDescription,
            ph_description: undefined,
            nonph_description: undefined, 
            access: undefined
        };
    });

    res.status(200).json(filteredSlides);
}
