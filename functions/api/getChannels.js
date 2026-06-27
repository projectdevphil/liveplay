export async function onRequest(context) {
    const channels =[
        // General
        //{ name: 'Kapamilya Channel', logo: '/assets/logos/abs_kapcha_logo.svg', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-kapcha-dash-abscbnono/manifest.mpd', clearKey: { '292dee4236d04054910e9706ee22626b': 'b7c5d3220f6eb6e042a2bcb367b5c09b' }, group: 'General' },
        { name: 'Kapamilya Channel', logo: '/assets/logos/abs_kapcha_logo.svg', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-77/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjUxOTc4MywiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.Iar8XDhlACFAcIrCJA-9JhYcsHL8-WY8hVXLFrB_ScE', group: 'General' },
        { name: 'GMA7', logo: '/assets/logos/gma_logo.png', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-15/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ1MTA3NSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.Fn-2e1zktxEmSDAVTwPhcbLKZRP3pnH626Bf6JppcjU', group: 'General' },
        { name: 'TV5', logo: '/assets/logos/tv5_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/tv5_hd/default1/index.mpd', clearKey: { '2615129ef2c846a9bbd43a641c7303ef': '07c7f996b1734ea288641a68e1cfdc4d' }, group: 'General' },
        { name: 'ALLTV2', logo: '/assets/logos/abs_alltv2_logo.svg', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-55/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ1MTA3NSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.Fn-2e1zktxEmSDAVTwPhcbLKZRP3pnH626Bf6JppcjU', group: 'General' },
        //{ name: 'A2Z', logo: '/assets/logos/a2z_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_a2z/default/index.mpd', clearKey: { '3f6d8a2c1b7e4c9f8d52a7e1b0c6f93d': '4019f9269b9054a2b9e257b114ebbaf2' }, group: 'General' },
        { name: 'A2Z', logo: '/assets/logos/a2z_logo.png', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-9/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ4MzkyMSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.MeQn2ED5Hxb8k3WbD0IyaBXzbCoz-v-wb329Okl-f-w', group: 'General' },
        { name: 'GTV', logo: '/assets/logos/gtv_logo.svg', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-34/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ1MTA3NSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.Fn-2e1zktxEmSDAVTwPhcbLKZRP3pnH626Bf6JppcjU', group: 'General' },
        { name: 'RPTV', logo: '/assets/logos/rptv_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cnn_rptv_prod_hd/default/index.mpd', group: 'General' },
        { name: 'PTV4', logo: '/assets/logos/ptv_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_ptv4_sd/default/index.mpd', group: 'General' },
        { name: 'IBC 13', logo: '/assets/logos/ibc_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/ibc13_sd_new/default/index.mpd', group: 'General' },
    
        // News
        { name: 'ABS-CBN News Channel', logo: '/assets/logos/anc_logo.svg', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/anc-ph3/manifest.mpd', group: 'News' },
        //{ name: 'Bilyonaryo News Channel', logo: '/assets/logos/bnc_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/bilyonaryoch/default/index.mpd', clearKey: { '227ffaf09bec4a889e0e0988704d52a2': 'b2d0dce5c486891997c1c92ddaca2cd2' }, group: 'News' },
        { name: 'Bilyonaryo News Channel', logo: '/assets/logos/bnc_logo.png', manifestUri: 'https://amg19223-amg19223c11-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c11-amgplt0352/playlist.m3u8', group: 'News' },
        { name: 'DZMM Teleradyo', logo: '/assets/logos/dzmm_teleradyo_logo.png', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-teleradyo-dash-abscbnono/index.mpd', group: 'News' },
        { name: 'One News', logo: '/assets/logos/one_news_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/onenews_hd1/default/index.mpd', group: 'News' },
        { name: 'One PH', logo: '/assets/logos/one_ph_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/oneph_sd/default/index.mpd', group: 'News' },
        { name: 'True TV', logo: '/assets/logos/true_tv_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/truefm_tv/default/index.mpd', group: 'News' },

        // Entertainment
        { name: 'Jeepney TV', logo: '/assets/logos/jeepney_tv_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/jeepneytv/manifest.mpd', group: 'Entertainment' },
        { name: 'Kapatid Channel', logo: '/assets/logos/kapatid_ch_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/kapatid_hd/default/index.mpd', group: 'General' },
        { name: 'TVN Premium', logo: '/assets/logos/tvn_logo.svg', type: 'mpegdash', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_tvnpre/default/index.mpd', group: 'Entertainment' },

        // Movies
        { name: 'Cinema One', logo: '/assets/logos/cinema_one_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/c1ph/manifest.mpd', group: 'Movies' },
        { name: 'Cinemo!', logo: '/assets/logos/cinemo_logo.png', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-73/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ4MzkyMSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.MeQn2ED5Hxb8k3WbD0IyaBXzbCoz-v-wb329Okl-f-w', group: 'Movies' },
        //{ name: 'Cinemo! Global', logo: '/assets/logos/cinemo_logo.png', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-cinemo-dash-abscbnono/index.mpd', clearKey: { 'aa8aebe35ccc4541b7ce6292efcb1bfb': 'f06b6031a3604cc6708c14d83f1a1b27' }, group: 'Movies' },
        { name: 'PBO', logo: '/assets/logos/pbo_logo.svg', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-3/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ4MzkyMSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.MeQn2ED5Hxb8k3WbD0IyaBXzbCoz-v-wb329Okl-f-w', group: 'Movies' },
        { name: 'Viva Cinema', logo: '/assets/logos/viva_cinema_logo.png', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-4/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ4MzkyMSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.MeQn2ED5Hxb8k3WbD0IyaBXzbCoz-v-wb329Okl-f-w', group: 'Movies' },
        { name: 'HBO', logo: '/assets/logos/hbo_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_hbohd/default/index.mpd', group: 'Movies' },

        // Sports
        { name: 'One Sports', logo: '/assets/logos/one_sports_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_onesports_hd/default/index.mpd', group: 'Sports' },
        { name: 'PBA Rush', logo: '/assets/logos/pba_rush_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_pbarush_hd1/default/index.mpd', group: 'Sports' },
        { name: 'NBA TV Philippines', logo: '/assets/logos/nba_tv_ph_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cgnl_nba/default/index.mpd', group: 'Sports' },

        // Kids
        { name: 'Cartoon Channel PH', logo: '/assets/logos/cartoon_ch_ph_logo.png', manifestUri: 'https://live20.bozztv.com/giatv/giatv-cartoonchannelph/cartoonchannelph/chunks.m3u8', group: 'Fan-Made • Kids' },
        { name: 'Cartoon Network', logo: '/assets/logos/cartoon_net_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cartoonnetworkhd/default/index.mpd', group: 'Kids' },
        { name: 'DreamWorks (Tagalized)', logo: '/assets/logos/dreamworks_ch_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_dreamworktag/default/index.mpd', group: 'Kids' },

        // Infotainment
        { name: 'Knowledge Channel', logo: '/assets/logos/knowledge_ch_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/kc/manifest.mpd', group: 'Infotainment' },
        //{ name: 'Knowledge Channel', logo: '/assets/knowledge_ch_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/knowledge_channel/default/index.mpd', clearKey: { 'c7d2b1e94f8a4d6c8a106b3d1f9c2e55': '2052f6b844aa53144bb32f0e41295106' }, group: 'Infotainment' },

        // Music
        { name: 'MYX', logo: '/assets/logos/myx_logo.svg', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-myxnola-dash-abscbnono/index.mpd', group: 'Music' },
        { name: 'New K-Pop', logo: '/assets/logos/new_kpop_logo.png', manifestUri: 'https://newidco-newkid-1-eu.xiaomi.wurl.tv/playlist.m3u8', group: 'Music' }, 

        // Livestream
        { name: 'ASAP XP Catch-Up Livestream', logo: '/assets/logos/asap_xp_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/asap/manifest.mpd', group: 'Livestream' },
        { name: "It's Showtime Catch-Up Livestream", logo: '/assets/logos/its_showtime_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/itsshowtime/manifest.mpd', group: 'Livestream' },
        { name: 'The Healing Eucharist Catch-Up Livestream', logo: '/assets/logos/the_healing_eucharist_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/healingeucharist3/manifest.mpd', group: 'Livestream' },
        { name: 'TV Patrol Catch-Up Livestream', logo: '/assets/logos/tv_patrol_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/tvp-ph/manifest.mpd', group: 'Livestream' }
    ];

    const publicData = channels.map(channel => ({
        name: channel.name,
        logo: channel.logo,
        group: channel.group
    }));

    return new Response(JSON.stringify(publicData), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
