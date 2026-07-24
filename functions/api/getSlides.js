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
            badge: "SPG | Action • Comedy • Romance",
            link: null,
            overlay: "show"
        },
        {
            title: "Someone, Someday",
            description: "<strong>MON-FRI | 8:45PM</strong><br>Kapamilya Channel, ALLTV2, TV5 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/someonesomeday.herobg-tv.v2.JPG",
            badge: "PG | Romance • Mystery",
            link: null,
            overlay: "show"
        },
        {
            title: "A Secret In Prague",
            description: "<strong>MON-FRI | 9:30PM</strong><br>TV5, Kapamilya Channel, ALLTV2, and A2Z",
            image: "/assets/poster/slides/a_secret_in_prague_slide.png",
            badge: "PG | Action • Romance",
            link: null,
            overlay: "show"
        },
        {
            title: "It's Showtime",
            description: "<strong>MON-SAT | 12NN</strong><br>Kapamilya Channel, ALLTV2, A2Z,<br>GMA7 and It's Showtime Livestream",
            image: "https://pql-static.abs-cbn.com/images/itsshowtime.herobg-tv.jpg?im_policy=landscapeHero_tv_fhd",
            badge: "PG | Variety • Comedy",
            link: null,
            overlay: "show"
        },
        {
            title: "My Bespren Emman",
            description: "<strong>MON-SAT | 2:30PM</strong><br>TV5, Kapamilya Channel, ALLTV2, and A2Z",
            image: "/assets/poster/slides/my_bespren_emman_slide.png",
            badge: "PG | Inspirational • Family • Drama",
            link: null,
            overlay: "show"
        },        
        {
            title: "Rated Korina",
            description: "<strong>SUN | 3:30PM</strong><br>Kapamilya Channel, ALLTV2 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/ratedkorina.herobg-tv.jpg",
            badge: "PG | News Magazine • Lifestyle",
            link: null,
            overlay: "show"
        },
        {
            title: "Kapamilya<br>Deal or No Deal",
            description: "<strong>SAT-SUN | 7:30PM</strong><br>Kapamilya Channel, ALLTV2, TV5 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/kapamilyadealornodeal.herobg-tv.JPG",
            badge: "PG | Gameshow",
            link: null,
            overlay: "show"
        },
        {
            title: "Everybody, Sing!",
            description: "<strong>SAT-SUN | 8:30PM</strong><br>Kapamilya Channel, ALLTV2, TV5 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/everybodysing.herobg-tv.v3.JPG",
            badge: "PG | Gameshow",
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
