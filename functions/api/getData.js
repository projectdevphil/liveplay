export async function onRequest(context) {
    const url = new URL(context.request.url);
    const channelName = url.searchParams.get("channel");

    if (!channelName) {
        return new Response(JSON.stringify({ error: "Not Found" }), { 
            status: 404, 
            headers: { "Content-Type": "application/json" } 
        });
    }

    const country = context.request.cf?.country || 'XX';
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

    const channels =[
        // General
        //{ name: 'Kapamilya Channel', logo: 'https://static.wikia.nocookie.net/logopedia/images/5/5d/ABS_KapCha_Vertical_White_MAR2026.svg', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-kapcha-dash-abscbnono/manifest.mpd', clearKey: { '292dee4236d04054910e9706ee22626b': 'b7c5d3220f6eb6e042a2bcb367b5c09b' }, group: 'General', access: 'PH' },
        { name: 'Kapamilya Channel', logo: 'https://static.wikia.nocookie.net/logopedia/images/5/5d/ABS_KapCha_Vertical_White_MAR2026.svg', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-77/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjUxOTc4MywiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.Iar8XDhlACFAcIrCJA-9JhYcsHL8-WY8hVXLFrB_ScE', group: 'General', access: 'PH' },
        { name: 'GMA7', logo: 'https://static.wikia.nocookie.net/logopedia/images/a/aa/GMA_Network_2024_logo.png', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-15/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ1MTA3NSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.Fn-2e1zktxEmSDAVTwPhcbLKZRP3pnH626Bf6JppcjU', group: 'General', access: 'PH' },
        { name: 'TV5', logo: 'https://static.wikia.nocookie.net/logopedia/images/8/8b/TV5_2026_HQ.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/tv5_hd/default1/index.mpd', clearKey: { '2615129ef2c846a9bbd43a641c7303ef': '07c7f996b1734ea288641a68e1cfdc4d' }, group: 'General', access: 'PH' },
        { name: 'ALLTV2', logo: 'https://static.wikia.nocookie.net/logopedia/images/8/87/ABS_ALLTV2_Vertical_White_MAR2026.svg', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-55/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ1MTA3NSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.Fn-2e1zktxEmSDAVTwPhcbLKZRP3pnH626Bf6JppcjU', group: 'General', access: 'PH' },
        //{ name: 'A2Z', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/A2Z_Channel_11_Logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_a2z/default/index.mpd', clearKey: { '3f6d8a2c1b7e4c9f8d52a7e1b0c6f93d': '4019f9269b9054a2b9e257b114ebbaf2' }, group: 'General', access: 'PH' },
        { name: 'A2Z', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/A2Z_Channel_11_Logo.png', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-9/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ4MzkyMSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.MeQn2ED5Hxb8k3WbD0IyaBXzbCoz-v-wb329Okl-f-w', group: 'General', access: 'PH' },
        { name: 'GTV', logo: 'https://static.wikia.nocookie.net/logopedia/images/f/ff/GTV_%28Philippines%29_2021-present.svg', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-34/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ1MTA3NSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.Fn-2e1zktxEmSDAVTwPhcbLKZRP3pnH626Bf6JppcjU', group: 'General', access: 'PH' },
        { name: 'RPTV', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/RPTV_%282024%29.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cnn_rptv_prod_hd/default/index.mpd', clearKey: { '1917f4caf2364e6d9b1507326a85ead6': 'a1340a251a5aa63a9b0ea5d9d7f67595' }, group: 'General', access: 'PH' },
        { name: 'PTV4', logo: 'https://static.wikia.nocookie.net/russel/images/e/ed/PTV_4_Logo_June_2017.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_ptv4_sd/default/index.mpd', clearKey: { '71a130a851b9484bb47141c8966fb4a3': 'ad1f003b4f0b31b75ea4593844435600' }, group: 'General', access: 'PH' },
        { name: 'IBC 13', logo: 'https://static.wikia.nocookie.net/tv5network/images/6/62/IBC.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/ibc13_sd_new/default/index.mpd', clearKey: { '16ecd238c0394592b8d3559c06b1faf5': '05b47ae3be1368912ebe28f87480fc84' }, group: 'General', access: 'PH' },
    
        // News
        { name: 'ABS-CBN News Channel', logo: 'https://img.mytfc.com/cmsroot/abscms/media/mytfctv/channels/anc/anc-logo.png?ext=.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/anc-ph3/manifest.mpd', clearKey: { 'b6d6e536f8fa4d8b93627af0128cf00d': 'e73c8dcfdea374ae576ced342f6c73a2' }, group: 'News', access: 'SEA' },
        //{ name: 'Bilyonaryo News Channel', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcxvjeBIthYiEaZHeVeYpDicIlOTdv3G6lzoal3VM2xVzWu_J7XxM657oz&s=10', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/bilyonaryoch/default/index.mpd', clearKey: { '227ffaf09bec4a889e0e0988704d52a2': 'b2d0dce5c486891997c1c92ddaca2cd2' }, group: 'News', access: 'PH' },
        { name: 'Bilyonaryo News Channel', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcxvjeBIthYiEaZHeVeYpDicIlOTdv3G6lzoal3VM2xVzWu_J7XxM657oz&s=10', manifestUri: 'https://amg19223-amg19223c11-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c11-amgplt0352/playlist.m3u8', group: 'News', access: 'PH' },
        { name: 'DZMM Teleradyo', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/DZMM_TeleRadyo.svg/500px-DZMM_TeleRadyo.svg.png', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-teleradyo-dash-abscbnono/index.mpd', clearKey: { '47c093e0c9fd4f80839a0337da3dd876': '603248b858276f533a13e17f2f48c711' }, group: 'News', access: 'PH' },
        { name: 'GMA News TV', logo: 'https://static.wikia.nocookie.net/logopedia/images/c/c7/GMA_News_TV_2024.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2099522/gnews3/manifest.mpd', clearKey: { 'd5d848730e4a4f9b962290039dd2b96b': 'c959dc12f1bff5a66d030117fb7e9855' }, group: 'News', access: 'EMEAANA x PH' },
        { name: 'One News', logo: 'https://static.wikia.nocookie.net/logopedia/images/1/1e/One_News_%282020%29.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/onenews_hd1/default/index.mpd', clearKey: { '2e6a9d7c1f4b4c8a8d33c7b1f0a5e924': '4c71e178d090332fbfe72e023b59f6d2' }, group: 'News', access: 'PH' },
        { name: 'One PH', logo: 'https://static.wikia.nocookie.net/logopedia/images/0/08/One_PH_%282020%29.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/oneph_sd/default/index.mpd', clearKey: { 'b1c7e9d24f8a4d6c9e337a2f1c5b8d60': '8ff2e524cc1e028f2a4d4925e860c796' }, group: 'News', access: 'PH' },
        { name: 'True TV', logo: 'https://static.wikia.nocookie.net/logopedia/images/a/a0/TRUETV_Logo_2024.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/truefm_tv/default/index.mpd', clearKey: { 'a4e2b9d61c754f3a8d109b6c2f1e7a55': '1d8d975f0bc2ed90eda138bd31f173f4' }, group: 'News', access: 'PH' },

        // Entertainment
        { name: 'Jeepney TV', logo: 'https://static.wikia.nocookie.net/logopedia/images/5/51/JTV2015.svg', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/jeepneytv/manifest.mpd', clearKey: { 'dc9fec234a5841bb8d06e92042c741ec': '225676f32612dc803cb4d0f950d063d0' }, group: 'Entertainment', access: 'PH' },
        { name: 'Kapatid Channel', logo: 'https://static.wikia.nocookie.net/russel/images/2/28/Kapatid_Channel_White_Logo_2025.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/kapatid_hd/default/index.mpd', clearKey: { '045d103180f64562b1db7c932741c3ba': 'c3380548b9075c767a6ae2006ef4bff8' }, group: 'General', access: 'PH' },
        { name: 'Kapatid Live', logo: 'https://static.wikia.nocookie.net/russel/images/7/7f/Kapatid_Live_White_Logo_2025.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/pphd_sdi1/default/index.mpd', clearKey: { 'dbf670bed2ea4905a114557e90e7ffb6': '616059bec8dfb27f3524b7e7c31b6cff' }, group: 'General', access: 'PH' },
        { name: 'TVN Premium', logo: 'https://static.wikia.nocookie.net/logopedia/images/2/2f/TvN_Logo.svg', type: 'mpegdash', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_tvnpre/default/index.mpd', clearKey: { 'e1bde543e8a140b38d3f84ace746553e': 'b712c4ec307300043333a6899a402c10' }, group: 'Entertainment', access: 'PH' },

        // Movies
        { name: 'Cinema One', logo: 'https://static.wikia.nocookie.net/russel/images/9/94/Cinema_One_Logo_2020.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/c1ph/manifest.mpd', clearKey: { '55eddd1e157e4c3b830866e4679e7032': '525030e984567ba8df0af80660952368' }, group: 'Movies', access: 'PH' },
        { name: 'Cinemo!', logo: 'https://static.wikia.nocookie.net/abscbn/images/4/4b/CineMo%21.png', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-73/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ4MzkyMSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.MeQn2ED5Hxb8k3WbD0IyaBXzbCoz-v-wb329Okl-f-w', group: 'Movies', access: 'PH' },
        //{ name: 'Cinemo! Global', logo: 'https://static.wikia.nocookie.net/abscbn/images/4/4b/CineMo%21.png', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-cinemo-dash-abscbnono/index.mpd', clearKey: { 'aa8aebe35ccc4541b7ce6292efcb1bfb': 'f06b6031a3604cc6708c14d83f1a1b27' }, group: 'Movies', access: 'EMEAANA x PH' },
        { name: 'PBO', logo: 'https://static.wikia.nocookie.net/tvfanon6528/images/5/53/PBO_%282020-.n.v.%29.png', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-3/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ4MzkyMSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.MeQn2ED5Hxb8k3WbD0IyaBXzbCoz-v-wb329Okl-f-w', group: 'Movies', access: 'PH' },
        { name: 'Viva Cinema', logo: 'https://vivacinema.com.ph/storage/images/2838023a778dfaecdc212708f721b788/logo.png', manifestUri: 'https://converse.nathcreqtives.com/api/proxy/ch-converge-1782315771869-4/index.m3u8?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcm9qZWN0ZGV2cGhpbCIsImlhdCI6MTc4MjQ4MzkyMSwiZXhwIjoxNzg4NDk5MDc1LCJhY2NvdW50RXhwaXJlZCI6ZmFsc2UsImFjY291bnRFeHBpcmVzQXQiOjE3ODg0OTkwNzUsImFsbG93ZWRPcmlnaW5zIjpbImh0dHBzOi8vbGl2ZXBsYXlwaC5wYWdlcy5kZXYiXX0.MeQn2ED5Hxb8k3WbD0IyaBXzbCoz-v-wb329Okl-f-w', group: 'Movies', access: 'PH' },
        { name: 'HBO', logo: 'https://images.now-tv.com/shares/channelPreview/img/en_hk/color/ch115_170_122', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_hbohd/default/index.mpd', clearKey: { 'c2b7a1e95d4f4c3a8e617f9d0a2b6c18': '27fca1ab042998b0c2f058b0764d7ed4' }, group: 'Movies', access: 'PH' },

        // Sports
        { name: 'One Sports', logo: 'https://static.wikia.nocookie.net/logopedia/images/7/73/One_Sports_%282020%29.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_onesports_hd/default/index.mpd', clearKey: { '53c3bf2eba574f639aa21f2d4409ff11': '3de28411cf08a64ea935b9578f6d0edd' }, group: 'Sports', access: 'PH' },
        { name: 'PBA Rush', logo: 'https://upload.wikimedia.org/wikipedia/en/c/cd/PBA_Rush_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_pbarush_hd1/default/index.mpd', clearKey: { 'd7f1a9c36b2e4f8d9a441c5e7b2d8f60': 'fb83c86f600ab945e7e9afed8376eb1e' }, group: 'Sports', access: 'PH' },
        { name: 'NBA TV Philippines', logo: 'https://static.wikia.nocookie.net/logopedia/images/0/0c/NBA_TV_Philippines_White.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cgnl_nba/default/index.mpd', clearKey: { 'd1f8a0c97b3d4e529a6f2c4b8d7e1f90': '58ab331d14b66bf31aca4284e0a3e536' }, group: 'Sports', access: 'PH' },

        // Kids
        { name: 'Cartoon Channel PH', logo: 'https://static.wikia.nocookie.net/kmbpmock/images/2/27/CCPh_Mod_2025.png', manifestUri: 'https://live20.bozztv.com/giatv/giatv-cartoonchannelph/cartoonchannelph/chunks.m3u8', group: 'Fan-Made • Kids', access: 'PH' },
        { name: 'Cartoon Network', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cartoon_Network_2010_white_text.svg/1920px-Cartoon_Network_2010_white_text.svg.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cartoonnetworkhd/default/index.mpd', clearKey: { 'a2d1f552ff9541558b3296b5a932136b': 'cdd48fa884dc0c3a3f85aeebca13d444' }, group: 'Kids', access: 'PH' },
        { name: 'DreamWorks (Tagalized)', logo: 'https://dreamworkschannel.com/assets/images/logos/DreamWorks_Channel_Stacked.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_dreamworktag/default/index.mpd', clearKey: { '564b3b1c781043c19242c66e348699c5': 'd3ad27d7fe1f14fb1a2cd5688549fbab' }, group: 'Kids', access: 'PH' },

        // Infotainment
        { name: 'Knowledge Channel', logo: '/assets/kc_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/kc/manifest.mpd', clearKey: { 'bd1f88dd3b254514bf7a113188c10dc2': 'ea86da60f0116f3b92a86acf45b8e071' }, group: 'Infotainment', access: 'PH' },
        //{ name: 'Knowledge Channel', logo: '/assets/kc_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/knowledge_channel/default/index.mpd', clearKey: { 'c7d2b1e94f8a4d6c8a106b3d1f9c2e55': '2052f6b844aa53144bb32f0e41295106' }, group: 'Infotainment', access: 'PH' },

        // Music
        { name: 'MYX', logo: 'https://assets-myxglobal.abs-cbn.com/wp-content/uploads/2022/07/MYX_New_Logo_Web1.png', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-myxnola-dash-abscbnono/index.mpd', clearKey: { 'f40a52a3ac9b4702bdd5b735d910fd2f': '35e4893c6e76546085941be3010932d4' }, group: 'Music', access: 'PH' },
        { name: 'New K-Pop', logo: '/assets/new_k-pop_logo.png', manifestUri: 'https://newidco-newkid-1-eu.xiaomi.wurl.tv/playlist.m3u8', group: 'Music', access: 'SEA' }, 

        // Livestream
        { name: 'ASAP Catch-Up Livestream', logo: 'https://pql-static.abs-cbn.com/images/live/ASAP_LIVETITLETREATMENT_2025_V2.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/asap/manifest.mpd', clearKey: { '6379f85c61d84b5db3be564bf59f4e13': 'd9a1f47f7a58f5a9598a452081155df4' }, group: 'Livestream', access: 'PH' },
        { name: "It's Showtime Catch-Up Livestream", logo: 'https://pql-static.abs-cbn.com/images/itsshowtime.title.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/itsshowtime/manifest.mpd', clearKey: { '3cdb78338a104ed594175a49532c823d': '9c7810c46873053be29d26bf6f753664' }, group: 'Livestream', access: 'PH' },
        { name: 'The Healing Eucharist Catch-Up Livestream', logo: 'https://pql-static.abs-cbn.com/images/live/THE_TITLETREATMENT_2025_v1.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/healingeucharist3/manifest.mpd', clearKey: { 'b84ec93eb33c48e58718e99cd4096c15': '9e3a9aee29cbd0375e02c55e0b7b5945' }, group: 'Livestream', access: 'PH' },
        { name: 'TV Patrol Catch-Up Livestream', logo: 'https://pql-static.abs-cbn.com/images/live/TVPPH_TITLETREATMENT_2025_v1.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/tvp-ph/manifest.mpd', clearKey: { 'a14583678b4d40b4a267c5845f673263': '98252f8318d84c55b10dd7a112622bd4' }, group: 'Livestream', access: 'PH' }
   ];

    const foundChannel = channels.find(c => c.name === channelName);
    
    if (foundChannel) {
        let isAllowed = true;
        
        if (foundChannel.access) {
            const access = foundChannel.access;

            if (access === 'PH' && !isPH) isAllowed = false;
            else if (access === 'Non-PH' && isPH) isAllowed = false;
            else if (access === 'US' && country !== 'US') isAllowed = false;
            else if (access === 'SEA' && !SEA_COUNTRIES.includes(country)) isAllowed = false;
            else if (access === 'NA' && !NA_COUNTRIES.includes(country)) isAllowed = false;
            else if (access === 'EMEAA' && !EMEAA_COUNTRIES.includes(country)) isAllowed = false;
            else if (access === 'EMEAA x PH' && (!EMEAA_COUNTRIES.includes(country) || isPH)) isAllowed = false;
            else if (access === 'EMEAANA' && (!EMEAA_COUNTRIES.includes(country) && !NA_COUNTRIES.includes(country))) isAllowed = false;
            else if (access === 'EMEAANA x PH' && ((!EMEAA_COUNTRIES.includes(country) && !NA_COUNTRIES.includes(country)) || isPH)) isAllowed = false;
        }

        if (!isAllowed) {
            return new Response(JSON.stringify({ error: "Channel Not Available in your Region" }), {
                status: 403,
                headers: { "Content-Type": "application/json" }
            });
        }

        let type = 'mpd';
        if (foundChannel.manifestUri.includes('.m3u8')) {
            type = 'm3u8';
        }

        const keyId = (foundChannel.clearKey && Object.keys(foundChannel.clearKey)[0]) || '';
        const key = (foundChannel.clearKey && Object.values(foundChannel.clearKey)[0]) || '';

        return new Response(JSON.stringify({
            manifestUri: foundChannel.manifestUri,
            ClearKey: {
                k1: keyId,
                k2: key
            },
            type: type
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } else {
        return new Response(JSON.stringify({ error: "Channel Not Found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        });
    }
}
