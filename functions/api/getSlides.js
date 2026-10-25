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
            title: "<span style='font-size: 0.85rem; line-height: 1.2;'>Pinoy Big Brother Collab 3.0<br>All-Access Livestreams</span>",            description: "Watch <strong>All-Access Livestream</strong><br>from the <strong>Main, Dining, and<br>External Den</strong> areas for FREE.",
            image: "assets/poster/liveplay_x_pbb_poster.png",
            badge: "Watch Now | Reality",
            link: null,
            overlay: "show"
        },
        {
            title: "Pinoy Big Brother<br>Collab 3.0",
            description: "<strong>MON-FRI | 9:35PM<br>SAT | 6:15PM and SUN | 4:55PM</strong><br>PBB Episode Livestream",
            image: "https://img.iwanttfc.com/images/master/PBBCOLLAB3_HEROBG-TV_3840X2160_V1_20261023003858.jpg",
            badge: "PG | Reality",
            link: null,
            overlay: "show"
        },
        {
            title: "Mommy Guard",
            description: "<strong>MON-FRI | 2:30PM</strong><br>TV5, Kapamilya Channel, and A2Z",
            image: "https://occ-0-1763-64.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABQloEwMJZMyD2N-KV-EuRVhL__czkzSbYjJX1PA_-6Rm6OWzTVcGXhZzKt2baMSzpu12n9wurr7n327PL-w4Gqie90zs00G5fUAa.webp",
            badge: "PG | Comedy • Romance • Drama • Family",
            link: null,
            overlay: "show"
        },
        {
            title: "The Loyalty Game:<br>Level Up",
            description: "<strong>MON-FRI | 9:30PM</strong><br>Kapamilya Channel, TV5 and A2Z",
            image: "https://img.iwanttfc.com/images/theloyaltygamelevelup.herobg-tv.v2.JPG",
            badge: "PG | Suspense Thriller • Mystery • Drama",
            link: null,
            overlay: "show"
        },
        {
            title: "Someone, Someday",
            description: "<strong>MON-FRI | 8:45PM</strong><br>Kapamilya Channel, TV5 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/someonesomeday.herobg-tv.v2.JPG",
            badge: "PG | Romance • Mystery",
            link: null,
            overlay: "show"
        },
        {
            title: "Sigabo",
            description: "<strong>MON-FRI | 8PM</strong><br>Kapamilya Channel, TV5 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/sigabo.herobg-tv.JPG",
            badge: "SPG | Action • Comedy • Romance",
            link: null,
            overlay: "show"
        },
        {
            title: "It's Showtime",
            description: "<strong>MON-SAT | 12NN</strong><br>Kapamilya Channel, A2Z and<br>It's Showtime Livestream",
            image: "https://pql-static.abs-cbn.com/images/itsshowtime.herobg-tv.jpg",
            badge: "PG | Variety • Comedy",
            link: null,
            overlay: "show"
        },
        {
            title: "Rated Korina",
            description: "<strong>SUN 4PM</strong><br>Kapamilya Channel, TV5 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/ratedkorina.herobg-tv.jpg",
            badge: "PG | News Magazine • Lifestyle",
            link: null,
            overlay: "show"
        },
        {
            title: "Kapamilya<br>Deal or No Deal",
            description: "<strong>SAT | 7:30PM<br>SUN | 8:45PM</strong><br>Kapamilya Channel, TV5 and A2Z",
            image: "https://pql-static.abs-cbn.com/images/kapamilyadealornodeal.herobg-tv.JPG",
            badge: "PG | Gameshow",
            link: null,
            overlay: "show"
        },
        {
            title: "Studio Universal",
            description: "",
            image: "https://beam-images.warnermediacdn.com/BEAM_LWM_DELIVERABLES/f24a4ece-2f3d-4919-a934-700d1ef8f7a2/397ad388-776f-4ce0-8650-f8a9a6b2d833?host=wbd-images.prod-vod.h264.io&partner=beamcom&w=2000",
            badge: "Watch Now | Movies",
            link: "?channel=7e1a2b39-4c8d-4f0e-9a1b-6c5d2e3f4a33",
            overlay: "show"
        },
        {
            title: "NBA TV Philippines",
            description: "",
            image: "https://occ-0-1763-395.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABcFuldBLfH2n_0Wiqx4rnmEyjCmJQdy7hbdu7D3ymqfYkqrDcBbgJt9iNU5EbhBzPmU97xqDUYDip3ZSb1y2AFfJdalF4fmaqnP4.webp",
            badge: "Watch Now | Sports",
            link: "?channel=9c1b2a38-5d4e-4f0a-8b1c-6e3f7a8b9c55",
            overlay: "show"
        }
    ];

    return new Response(JSON.stringify(slidesData), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
