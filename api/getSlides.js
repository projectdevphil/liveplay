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
        //{
            //title: "",
            //description: "",
            //image: "/assets/poster/m7_champion_rora.png",
            //badge: "Watch Replay • Events • E-Games",
            //link: "https://m.youtube.com/watch?v=I-6flm9RfFg",
            //overlay: "none"
        //},
        {
            title: "<span style='font-size: 25px;'>Formula 1</span>",
            description: "<span style='font-size: 7px; color: white; background: red; border-radius: 1.5px; padding: 3px;'>LIVE</span><br>BeIN Sports 1, Sky Sports and Sky Sports F1",
            image: "https://cdn-6.motorsport.com/images/amp/2wB91X80/s1200/2025-drivers-hero-shot-3.webp",
            badge: "Catch-Up TV • Sports",
            link: null,
            overlay: "show"
        },
        {
            title: "FPJ's Batang Quiapo",
            ph_description: "The Last 2 Weeks<br><strong>MON-FRI | 8PM</strong><br>Kapamilya Channel and A2Z",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/batangquiapo.herobg-tv.v3.jpg?im_policy=landscapeHero_tv_hd",
            badge: "Catch-Up TV • Action",
            link: null,
            overlay: "show"
        },
        {
            title: "ROJA",
            ph_description: "The Last 2 Weeks<br><strong>MON-FRI | 8:45PM</strong><br>Kapamilya Channel and A2Z",
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
        //{
            //title: "PBB Celebrity<br>Collab Edition 2.0",
            //ph_description: "<strong>MON-FRI | 9:40PM<br>SAT-SUN | 6:15PM</strong><br>GMA7 and PBB Catch-Up Livestream",
            //nonph_description: "<strong>MON-FRI | 9:40PM PHT<br>SAT | 6:15PM PHT<br>SUN | 10:05PM PHT</strong><br>PBB Catch-Up Livestream",
            //image: "https://pql-static.abs-cbn.com/images/pbbcelebritycollab.herobg-tv.V4.JPG?im_policy=landscapeHero_tv_hd",
            //badge: "Catch-Up TV • Reality",
            //link: null,
            //overlay: "show"
        //},
        {
            title: "It's Showtime",
            ph_description: "<strong>MON-SAT | 12NN</strong><br>Kapamilya Channel, A2Z, GMA7 and<br>It's Showtime Catch-Up Livestream",
            nonph_description: "<strong>on TFC and GMA Pinoy TV</strong>",
            image: "https://pql-static.abs-cbn.com/images/itsshowtime.herobg-tv.jpg?im_policy=landscapeHero_tv_fhd",
            badge: "Catch-Up TV • Variety",
            link: null,
            overlay: "show"
        },
        {
            title: "<span style='font-size: 24px;'>NBA TV Philippines</span>",
            description: "",
            image: "https://occ-0-1763-395.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABcFuldBLfH2n_0Wiqx4rnmEyjCmJQdy7hbdu7D3ymqfYkqrDcBbgJt9iNU5EbhBzPmU97xqDUYDip3ZSb1y2AFfJdalF4fmaqnP4.webp",
            badge: "Watch Now • Sports",
            link: "/home?channel=nba-tv-philippines",
            access: "PH",
            overlay: "show"
        },
        {
            title: "<span style='font-size: 26px;'>NBA TV</span>",
            description: "",
            image: "https://occ-0-1763-395.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABcFuldBLfH2n_0Wiqx4rnmEyjCmJQdy7hbdu7D3ymqfYkqrDcBbgJt9iNU5EbhBzPmU97xqDUYDip3ZSb1y2AFfJdalF4fmaqnP4.webp",
            badge: "Watch Now • Sports",
            link: "/home?channel=nba-tv",
            access: "Non-PH",
            overlay: "show"
        },
        //{
            //title: "Premier League",
            //description: "",
            //image: "https://www.peacocktv.com/dam/growth/assets/sportslandingpages/premier-league/23-24/week24/PREMIERLEAGUE.jpg",
            //badge: "Watch Now • Sports",
            //link: "/home?channel=premier-league",
            //overlay: "show"
        //},
        {
            title: "<span style='font-size: 23px;'>NFL Network</span>",
            description: "",
            image: "https://images.t-online.de/2025/08/CKDB6tmOYvGL/0x0:3150x1772/fit-in/__WIDTH__x0/minneapolis-mn-december-08-minnesota-vikings-wide-receiver-justin-jefferson-18-catches-a-52-yard-pass-for-a-touchdown-during-the-third-quarter-of-a-nfl-american-football-herren-usa-game-between-the-minnesota-vikings-and-atlanta-falcons-on-december-8-2024-at-u-s-bank-stadium-in-minneapolis-mn-photo-by-nick-wosika-icon-sportswire-nfl-dec-08-falcons-at-vikings-editorial-use-only-icon20241208097.jpg",
            badge: "Watch Now • Sports",
            link: "/home?channel=nfl-network",
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
