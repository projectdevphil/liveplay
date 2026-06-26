export async function onRequest(context) {
    const request = context.request;
    const url = new URL(request.url);
    
    const referer = request.headers.get("referer") || request.headers.get("referrer");
    const host = url.host;
    
    if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
        if (!referer || !referer.includes(host)) {
            return new Response(JSON.stringify({ error: "Access Denied" }), {
                status: 403,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    const country = request.cf?.country || 'XX';
    const isPH = country === 'PH';
    
    const SEA_COUNTRIES =['PH', 'SG', 'MY', 'ID', 'TH', 'VN', 'BN', 'KH', 'LA', 'MM', 'TL'];
    const NA_COUNTRIES =[
        'US', 'CA', 'MX', 'BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA', 
        'AG', 'BS', 'BB', 'CU', 'DM', 'DO', 'GD', 'HT', 'JM', 'KN', 
        'LC', 'VC', 'TT', 'PR', 'VI', 'BM', 'KY', 'TC', 'VG', 'AI', 'MS'
    ];
    
    const EMEAA_COUNTRIES =[
        // Europe
        'AL', 'AD', 'AM', 'AT', 'AZ', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'GE', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'KZ', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'TR', 'UA', 'GB', 'VA',
        // Middle East
        'BH', 'IR', 'IQ', 'IL', 'JO', 'KW', 'LB', 'OM', 'PS', 'QA', 'SA', 'SY', 'AE', 'YE',
        // Africa
        'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CD', 'CG', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW',
        // Asia
        'AF', 'BD', 'BT', 'BN', 'KH', 'CN', 'HK', 'MO', 'IN', 'ID', 'JP', 'KP', 'KR', 'KG', 'LA', 'MY', 'MV', 'MN', 'MM', 'NP', 'PK', 'PH', 'SG', 'LK', 'TW', 'TJ', 'TH', 'TM', 'UZ', 'VN'
    ];
    
    const slidesData =[       
        {
            title: "Sigabo",
            ph_description: "<strong>MON-FRI | 8PM</strong><br>Kapamilya Channel, ALLTV2, TV5 and A2Z",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/sigabo.herobg-tv.JPG",
            badge: "Catch-Up TV • Action • Comedy",
            link: null,
            overlay: "show"
        },
        {
            title: "A Secret In Prague",
            ph_description: "<strong>MON-FRI | 8:45PM</strong><br>TV5, Kapatid Channel and Kapatid Live",
            image: "https://occ-0-1763-64.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABTuVENSyEUOuDVRxYnNlcJLf4RsXfFkjeVbdQ7H5jPIdaJNyLZGp0hMnwGwR-I_czHCPAILpduVsochC91V8w7vzBp79AyGZpXhpzpfMdA.webp",
            badge: "Catch-Up TV • Action • Romance",
            link: null,
            access: "PH",
            overlay: "show"
        },
       {
            title: "Blood Vs. Duty",
            ph_description: "<strong>MON-FRI | 8:45PM</strong><br>Kapamilya Channel, ALLTV2 and A2Z",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/bloodvsduty.herobg-tv.JPG",
            badge: "Catch-Up TV • Action",
            link: null,
            overlay: "show"
        },
        {
            title: "The Alibi",
            ph_description: "<strong>MON-FRI | 9:30PM</strong><br>Kapamilya Channel, ALLTV2 and A2Z",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/thealibi.herobg-tv.JPG",
            badge: "Catch-Up TV • Drama",
            link: null,
            overlay: "show"
        },
        {
            title: "It's Showtime",
            ph_description: "<strong>MON-SAT | 12NN</strong><br>Kapamilya Channel, ALLTV2, A2Z,<br>GMA7 and Catch-Up Livestream",
            nonph_description: "<strong>on TFC and GMA Pinoy TV</strong>",
            image: "https://pql-static.abs-cbn.com/images/itsshowtime.herobg-tv.jpg?im_policy=landscapeHero_tv_fhd",
            badge: "Catch-Up TV • Variety",
            link: null,
            overlay: "show"
        },
        {
            title: "Rated Korina",
            ph_description: "<strong>SUN | 3:30PM</strong><br>Kapamilya Channel, ALLTV2 and A2Z",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/ratedkorina.herobg-tv.jpg",
            badge: "Catch-Up TV • Lifestyle",
            link: null,
            overlay: "show"
        },
        {
            title: "Kapamilya<br>Deal or No Deal",
            ph_description: "<strong>SAT-SUN | 7:30PM</strong><br>Kapamilya Channel, ALLTV2 and A2Z",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/kapamilyadealornodeal.herobg-tv.JPG",
            badge: "Catch-Up TV • Gameshow",
            link: null,
            overlay: "show"
        },
        {
            title: "New K-Pop",
            description: "",
            image: "https://i8.amplience.net/i/naras/ATEEZ-k-pop-summer-tours-2024",
            badge: "Watch Now • Music",
            link: "/?channel=new-k-pop",
            access: "SEA",
            overlay: "show"
        },
        {
            title: "NBA TV Philippines",
            description: "",
            image: "https://occ-0-1763-395.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABcFuldBLfH2n_0Wiqx4rnmEyjCmJQdy7hbdu7D3ymqfYkqrDcBbgJt9iNU5EbhBzPmU97xqDUYDip3ZSb1y2AFfJdalF4fmaqnP4.webp",
            badge: "Watch Now • Sports",
            link: "/?channel=nba-tv-philippines",
            access: "PH",
            overlay: "show"
        },
        {
            title: "NBA TV",
            description: "",
            image: "https://occ-0-1763-395.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABcFuldBLfH2n_0Wiqx4rnmEyjCmJQdy7hbdu7D3ymqfYkqrDcBbgJt9iNU5EbhBzPmU97xqDUYDip3ZSb1y2AFfJdalF4fmaqnP4.webp",
            badge: "Watch Now • Sports",
            link: "/?channel=nba-tv",
            access: "EMEAANA x PH",
            overlay: "show"
        },
        {
            title: "NFL Network",
            description: "",
            image: "https://images.t-online.de/2025/08/CKDB6tmOYvGL/0x0:3150x1772/fit-in/__WIDTH__x0/minneapolis-mn-december-08-minnesota-vikings-wide-receiver-justin-jefferson-18-catches-a-52-yard-pass-for-a-touchdown-during-the-third-quarter-of-a-nfl-american-football-herren-usa-game-between-the-minnesota-vikings-and-atlanta-falcons-on-december-8-2024-at-u-s-bank-stadium-in-minneapolis-mn-photo-by-nick-wosika-icon-sportswire-nfl-dec-08-falcons-at-vikings-editorial-use-only-icon20241208097.jpg",
            badge: "Watch Now • Sports",
            link: "/?channel=nfl-network",
            overlay: "show"
        }
    ];

    const filteredSlides = slidesData.filter(slide => {
        if (!slide.access) return true;
        if (slide.access === 'PH' && isPH) return true;
        if (slide.access === 'Non-PH' && !isPH) return true;
        if (slide.access === 'US' && country === 'US') return true;
        if (slide.access === 'SEA' && SEA_COUNTRIES.includes(country)) return true;
        if (slide.access === 'EMEAA' && EMEAA_COUNTRIES.includes(country)) return true; 
        if (slide.access === 'EMEAA x PH' && EMEAA_COUNTRIES.includes(country) && !isPH) return true;
        if (slide.access === 'EMEAANA' && (EMEAA_COUNTRIES.includes(country) || NA_COUNTRIES.includes(country))) return true;
        if (slide.access === 'EMEAANA x PH' && (EMEAA_COUNTRIES.includes(country) || NA_COUNTRIES.includes(country)) && !isPH) return true;
        
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

    return new Response(JSON.stringify(filteredSlides), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
