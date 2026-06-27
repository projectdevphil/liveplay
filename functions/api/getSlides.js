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

    const slidesData =[       
        {
            title: "Sigabo",
            description: "<strong>MON-FRI | 8PM</strong><br>Kapamilya Channel, ALLTV2, TV5 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/sigabo.herobg-tv.JPG",
            badge: "Catch-Up TV • Action • Comedy",
            link: null,
            overlay: "show"
        },
        {
            title: "A Secret In Prague",
            description: "<strong>MON-FRI | 8:45PM</strong><br>TV5 and Kapatid Channel",
            image: "https://occ-0-1763-64.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABTuVENSyEUOuDVRxYnNlcJLf4RsXfFkjeVbdQ7H5jPIdaJNyLZGp0hMnwGwR-I_czHCPAILpduVsochC91V8w7vzBp79AyGZpXhpzpfMdA.webp",
            badge: "Catch-Up TV • Action • Romance",
            link: null,
            overlay: "show"
        },
       {
            title: "Blood Vs. Duty",
            description: "<strong>MON-FRI | 8:45PM</strong><br>Kapamilya Channel, ALLTV2 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/bloodvsduty.herobg-tv.JPG",
            badge: "Catch-Up TV • Action",
            link: null,
            overlay: "show"
        },
        {
            title: "The Alibi",
            description: "<strong>MON-FRI | 9:30PM</strong><br>Kapamilya Channel, ALLTV2 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/thealibi.herobg-tv.JPG",
            badge: "Catch-Up TV • Drama",
            link: null,
            overlay: "show"
        },
        {
            title: "It's Showtime",
            description: "<strong>MON-SAT | 12NN</strong><br>Kapamilya Channel, ALLTV2, A2Z,<br>GMA7 and Catch-Up Livestream",
            image: "https://pql-static.abs-cbn.com/images/itsshowtime.herobg-tv.jpg?im_policy=landscapeHero_tv_fhd",
            badge: "Catch-Up TV • Variety",
            link: null,
            overlay: "show"
        },
        {
            title: "Rated Korina",
            description: "<strong>SUN | 3:30PM</strong><br>Kapamilya Channel, ALLTV2 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/ratedkorina.herobg-tv.jpg",
            badge: "Catch-Up TV • Lifestyle",
            link: null,
            overlay: "show"
        },
        {
            title: "Kapamilya<br>Deal or No Deal",
            description: "<strong>SAT-SUN | 7:30PM</strong><br>Kapamilya Channel, ALLTV2 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/kapamilyadealornodeal.herobg-tv.JPG",
            badge: "Catch-Up TV • Gameshow",
            link: null,
            overlay: "show"
        },
        {
            title: "Everybody, Sing!",
            description: "<strong>SAT-SUN | 8:30PM</strong><br>Kapamilya Channel, ALLTV2 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/everybodysing.herobg-tv.v3.JPG",
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
            overlay: "show"
        },
        {
            title: "NBA TV Philippines",
            description: "",
            image: "https://occ-0-1763-395.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABcFuldBLfH2n_0Wiqx4rnmEyjCmJQdy7hbdu7D3ymqfYkqrDcBbgJt9iNU5EbhBzPmU97xqDUYDip3ZSb1y2AFfJdalF4fmaqnP4.webp",
            badge: "Watch Now • Sports",
            link: "/?channel=nba-tv-philippines",
            overlay: "show"
        }
    ];

    return new Response(JSON.stringify(slidesData), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
