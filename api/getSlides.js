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
            image: "/assets/poster/m7_champion_rora.png",
            badge: "Events • Games",
            link: null,
            overlay: "none"
        },
        {
            title: "FPJ's Batang Quiapo",
            ph_description: "<strong>MON-FRI | 8PM</strong><br>Kapamilya Channel, A2Z and ALLTV2",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/batangquiapo.herobg-tv.v3.jpg?im_policy=landscapeHero_tv_hd",
            badge: "Catch-Up TV • Action",
            link: null,
            overlay: "show"
        },
        {
            title: "ROJA",
            ph_description: "<strong>MON-FRI | 8:45PM</strong><br>Kapamilya Channel, A2Z and ALLTV2",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/roja.herobg-tv.v2.JPG",
            badge: "Catch-Up TV • Action",
            link: null,
            overlay: "show"
        },
        {
            title: "Hating Kapatid",
            ph_description: "<strong>MON-SAT | 2:30PM</strong><br>GMA7",
            nonph_description: "<strong>on GMA Pinoy TV</strong>",
            image: "https://pql-static.abs-cbn.com/images/hatingkapatid.herobg-tv.JPG",
            badge: "Catch-Up TV • Drama",
            link: null,
            overlay: "show"
        },
        {
            title: "PBB Celebrity<br>Collab Edition 2.0",
            ph_description: "<strong>MON-FRI | 9:40PM<br>SAT-SUN | 6:15PM</strong><br>GMA7 and PBB Catch-Up Livestream",
            nonph_description: "<strong>MON-FRI | 9:40PM PHT<br>SAT | 6:15PM PHT<br>SUN | 10:05PM PHT</strong><br>PBB Catch-Up Livestream",
            image: "https://pql-static.abs-cbn.com/images/pbbcelebritycollab.herobg-tv.V4.JPG?im_policy=landscapeHero_tv_hd",
            badge: "Catch-Up TV • Reality",
            link: null,
            overlay: "show"
        },
        {
            title: "It's Showtime",
            ph_description: "<strong>MON-SAT | 12NN</strong><br>Kapamilya Channel, A2Z, ALLTV2 and GMA7",
            nonph_description: "<strong>on TFC and GMA Pinoy TV</strong>",
            image: "https://pql-static.abs-cbn.com/images/itsshowtime.herobg-tv.jpg?im_policy=landscapeHero_tv_fhd",
            badge: "Catch-Up TV • Variety",
            link: null,
            overlay: "show"
        },
        {
            title: "NBA TV Philippines",
            description: "",
            image: "https://occ-0-1763-395.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABcFuldBLfH2n_0Wiqx4rnmEyjCmJQdy7hbdu7D3ymqfYkqrDcBbgJt9iNU5EbhBzPmU97xqDUYDip3ZSb1y2AFfJdalF4fmaqnP4.webp",
            badge: "Watch Now • Sports",
            link: "/home?channel=nba-tv-philippines",
            access: "PH",
            overlay: "show"
        },
        {
            title: "NBA TV",
            description: "",
            image: "https://occ-0-1763-395.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABcFuldBLfH2n_0Wiqx4rnmEyjCmJQdy7hbdu7D3ymqfYkqrDcBbgJt9iNU5EbhBzPmU97xqDUYDip3ZSb1y2AFfJdalF4fmaqnP4.webp",
            badge: "Watch Now • Sports",
            link: "/home?channel=nba-tv",
            access: "Non-PH",
            overlay: "show"
        },
        {
            title: "Premier League",
            description: "",
            image: "https://www.peacocktv.com/dam/growth/assets/sportslandingpages/premier-league/23-24/week24/PREMIERLEAGUE.jpg",
            badge: "Watch Now • Sports",
            link: "/home?channel=premier-league",
            overlay: "show"
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
