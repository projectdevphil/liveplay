function parseTime(timeStr) {
    const match = timeStr.toLowerCase().match(/(\d{1,2}):(\d{2})\s*(am|pm)/);
    if (!match) return 0;
    let[_, hours, minutes, period] = match;
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
}

function parseDays(dayStr) {
    const dayMap = { 'SUN': 0, 'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4, 'FRI': 5, 'SAT': 6 };
    let days = new Set();
    
    const parts = dayStr.toUpperCase().split(',');
    for (let part of parts) {
        part = part.trim();
        if (part.includes('-')) {
            const[startDay, endDay] = part.split('-').map(d => d.trim());
            let start = dayMap[startDay];
            let end = dayMap[endDay];
            if (start !== undefined && end !== undefined) {
                let curr = start;
                while (true) {
                    days.add(curr);
                    if (curr === end) break;
                    curr = (curr + 1) % 7;
                }
            }
        } else if (dayMap[part] !== undefined) {
            days.add(dayMap[part]);
        }
    }
    return Array.from(days);
}

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
        'AL', 'AD', 'AM', 'AT', 'AZ', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'GE', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'KZ', 'XK', 'LV', 'LI', 'LT', 'LU', 'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'TR', 'UA', 'GB', 'VA',
        'BH', 'IR', 'IQ', 'IL', 'JO', 'KW', 'LB', 'OM', 'PS', 'QA', 'SA', 'SY', 'AE', 'YE',
        'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CD', 'CG', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'CI', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW',
        'AF', 'BD', 'BT', 'BN', 'KH', 'CN', 'HK', 'MO', 'IN', 'ID', 'JP', 'KP', 'KR', 'KG', 'LA', 'MY', 'MV', 'MN', 'MM', 'NP', 'PK', 'PH', 'SG', 'LK', 'TW', 'TJ', 'TH', 'TM', 'UZ', 'VN'
    ];

    const manilaTimeString = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    const manilaDate = new Date(manilaTimeString);
    const currentDay = manilaDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const currentMinutes = manilaDate.getHours() * 60 + manilaDate.getMinutes();
    
    const slidesData =[       
        {
            title: "The Secret In Prague",
            ph_description: "<strong>MON-FRI | 8PM</strong><br>TV5",
            image: "https://occ-0-1763-64.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABTuVENSyEUOuDVRxYnNlcJLf4RsXfFkjeVbdQ7H5jPIdaJNyLZGp0hMnwGwR-I_czHCPAILpduVsochC91V8w7vzBp79AyGZpXhpzpfMdA.webp",
            badge: "Catch-Up TV • Romance",
            link: null, 
            live_link: "/?channel=tv5", 
            overlay: "show",
            schedule: { days: "SAT", start: "4:49pm", end: "8:45pm" }
        },
        {
            title: "Blood Vs. Duty",
            ph_description: "<strong>MON-FRI | 8PM</strong><br>Kapamilya Channel and A2Z",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/bloodvsduty.herobg-tv.JPG",
            badge: "Catch-Up TV • Action",
            link: null, 
            live_link: "/?channel=kapamilya-channel", 
            overlay: "show",
            schedule: { days: "MON-FRI", start: "8:00pm", end: "8:45pm" }
        },        
        {
            title: "The Alibi",
            ph_description: "<strong>MON-FRI | 8:45PM</strong><br>Kapamilya Channel and A2Z",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/thealibi.herobg-tv.JPG",
            badge: "Catch-Up TV • Drama",
            link: null,
            live_link: "/?channel=kapamilya-channel", 
            overlay: "show",
            schedule: { days: "MON-FRI", start: "8:45pm", end: "9:30pm" } 
        },
        {
            title: "Love Scout",
            ph_description: "<strong>MON-FRI | 9:30PM</strong><br>Kapamilya Channel and A2Z",
            image: "https://pql-static.abs-cbn.com/images/lovescouttag.herobg-tv.JPG",
            badge: "Catch-Up TV • Romance",
            link: null,
            live_link: "/?channel=kapamilya-channel", 
            access: "PH",
            overlay: "show",
            schedule: { days: "MON-FRI", start: "9:30pm", end: "10:15pm" }
        },
        {
            title: "It's Showtime",
            ph_description: "<strong>MON-SAT | 12NN</strong><br>Kapamilya Channel, A2Z <br>and Catch-Up Livestream",
            nonph_description: "<strong>on TFC and GMA Pinoy TV</strong>",
            image: "https://pql-static.abs-cbn.com/images/itsshowtime.herobg-tv.jpg?im_policy=landscapeHero_tv_fhd",
            badge: "Catch-Up TV • Variety",
            link: null,
            live_link: "/?channel=kapamilya-channel", 
            overlay: "show",
            schedule: { days: "MON-SAT", start: "12:00pm", end: "2:30pm" }
        },
        {
            title: "Rated Korina",
            ph_description: "<strong>SUN | 6:30PM</strong><br>Kapamilya Channel and A2Z",
            nonph_description: "<strong>on TFC</strong>",
            image: "https://pql-static.abs-cbn.com/images/ratedkorina.herobg-tv.jpg",
            badge: "Catch-Up TV • Lifestyle",
            link: null,
            live_link: "/?channel=kapamilya-channel", 
            overlay: "show",
            schedule: { days: "SUN", start: "6:30pm", end: "7:30pm" } 
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
    }).map(originalSlide => {
        const slide = { ...originalSlide };

        if (isPH && slide.schedule) {
            const activeDays = parseDays(slide.schedule.days);
            const startMins = parseTime(slide.schedule.start);
            const endMins = parseTime(slide.schedule.end);
            
            if (activeDays.includes(currentDay) && currentMinutes >= startMins && currentMinutes < endMins) {
                if (slide.ph_description) {
                    slide.ph_description = slide.ph_description.replace(/<strong>.*?<\/strong>/, "<strong>NOW AIRING</strong>");
                }
                if (slide.badge) {
                    slide.badge = slide.badge.replace("Catch-Up TV", "Watch Now");
                }
                if (slide.live_link) {
                    slide.link = slide.live_link;
                }
            }
        }

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
            access: undefined,
            schedule: undefined, 
            live_link: undefined 
        };
    });

    return new Response(JSON.stringify(filteredSlides), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
