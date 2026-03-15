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
            title: "<span style='font-size: 26px;'>Channel<br>Advisory</span>",
            ph_description: "Please tap the banner for more details.",
            image: "https://img.freepik.com/free-vector/vector-background-gradient-black-white-abstract-design_779267-2579.jpg",
            badge: "<span style='background-color: transparent !important;'> </span>",
            link: "https://phcorner.org/threads/liveplay-by-project-dev-updates.2477294/post-31236017",
            access: "PH",
            overlay: "show"
        },        
        {
            title: "The Alibi",
            ph_description: "<strong>MON-FRI | 8PM</strong><br>Kapamilya Channel and A2Z",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/thealibi.herobg-tv.JPG",
            badge: "Catch-Up TV • Drama",
            link: null,
            overlay: "show"
        },
        {
            title: "It's Showtime",
            ph_description: "<strong>MON-SAT | 12NN</strong><br>Kapamilya Channel, A2Z, GMA7<br>and Catch-Up Livestream",
            nonph_description: "<strong>on TFC and GMA Pinoy TV</strong>",
            image: "https://pql-static.abs-cbn.com/images/itsshowtime.herobg-tv.jpg?im_policy=landscapeHero_tv_fhd",
            badge: "Catch-Up TV • Variety",
            link: null,
            overlay: "show"
        },
        {
            title: "Never Say Die",
            ph_description: "<strong>MON-FRI | 8:55PM</strong><br>GMA7",
            nonph_description: "<strong>on GMA Pinoy TV</strong>",
            image: "https://pql-static.abs-cbn.com/images/neversaydie.herobg-tv.JPG",
            badge: "Catch-Up TV • Action",
            link: null,
            overlay: "show"
        },        
        {
            title: "The Secrets of Hotel 88",
            ph_description: "<strong>MON-FRI | 9:35PM</strong><br>GMA7",
            nonph_description: "<strong>on TFC and GMA Pinoy TV</strong>",
            image: "https://pql-static.abs-cbn.com/images/thesecretsofhotel88.herobg-tv.JPG",
            badge: "Catch-Up TV • Drama",
            link: null,
            overlay: "show"
        },
        //{
            //title: "Hating Kapatid",
            //ph_description: "Final Week<br><strong>MON-SAT | 2:30PM</strong><br>GMA7",
            //nonph_description: "<strong>on GMA Pinoy TV</strong>",
            //image: "https://pql-static.abs-cbn.com/images/hatingkapatid.herobg-tv.JPG",
            //badge: "Catch-Up TV • Drama",
            //link: null,
            //overlay: "show"
        //},
        {
            title: "House of Lies",
            ph_description: "<strong>MON-FRI | 3:20PM</strong><br>GMA7",
            nonph_description: "<strong>on GMA Pinoy TV</strong>",
            image: "https://pql-static.abs-cbn.com/images/houseoflies.herobg-tv.JPG",
            badge: "Catch-Up TV • Drama",
            link: null,
            overlay: "show"
        },
        {
            title: "Your Face Sounds Familiar",
            ph_description: "<strong>SAT-SUN | 7:15PM</strong><br>Kapamilya Channel, A2Z<br>and Catch-Up Livestream",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/yourfacesoundsfamiliar.herobg-tv.JPG",
            badge: "Catch-Up TV • Variety",
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
            title: "Formula 1",
            description: "on BeIN Sports 1, Sky Sports and Sky Sports F1",
            image: "https://cdn-6.motorsport.com/images/amp/2wB91X80/s1200/2025-drivers-hero-shot-3.webp",
            badge: "Catch-Up TV • Sports",
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
        //{
            //title: "Premier League",
            //description: "",
            //image: "https://www.peacocktv.com/dam/growth/assets/sportslandingpages/premier-league/23-24/week24/PREMIERLEAGUE.jpg",
            //badge: "Watch Now • Sports",
            //link: "/home?channel=premier-league",
            //overlay: "show"
        //},
        {
            title: "NFL Network",
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
