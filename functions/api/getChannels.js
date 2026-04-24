export async function onRequest(context) {
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

        // Sports
        { name: 'One Sports', logo: 'https://static.wikia.nocookie.net/logopedia/images/7/73/One_Sports_%282020%29.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_onesports_hd/default/index.mpd', clearKey: { '53c3bf2eba574f639aa21f2d4409ff11': '3de28411cf08a64ea935b9578f6d0edd' }, group: 'Sports', access: 'PH' },
        { name: 'One Sports+', logo: 'https://static.wikia.nocookie.net/tvfanon6528/images/5/58/One_Sports%2B_%282020-.n.v.%29.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_onesportsplus_hd1/default/index.mpd', clearKey: { 'f00bd0122a8a4da1a49ea6c49f7098ad': 'a4079f3667ba4c2bcfdeb13e45a6e9c6' }, group: 'Sports', access: 'PH' },
        { name: 'PBA Rush', logo: 'https://upload.wikimedia.org/wikipedia/en/c/cd/PBA_Rush_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_pbarush_hd1/default/index.mpd', clearKey: { 'd7f1a9c36b2e4f8d9a441c5e7b2d8f60': 'fb83c86f600ab945e7e9afed8376eb1e' }, group: 'Sports', access: 'PH' },
        //{ name: 'Tap Sports', logo: 'https://upload.wikimedia.org/wikipedia/en/6/6e/TAP_Sports_channel_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/dr_tapsports/default/index.mpd', clearKey: { '5e7c1b9a2d8f4a6c9f30b1d6e2a8c744': '6178d9d177689eec5028e2dd608ae7b6' }, group: 'Sports', access: 'PH' },
        { name: 'Tap Sports', logo: 'https://upload.wikimedia.org/wikipedia/en/6/6e/TAP_Sports_channel_logo.png', manifestUri: 'https://amg19223-amg19223c2-amgplt0351.playout.now3.amagi.tv/playlist/amg19223-amg19223c2-amgplt0351/playlist.m3u8', group: 'Sports', access: 'PH' },
        { name: 'Varsity Channel', logo: 'https://static.wikia.nocookie.net/russel/images/2/2e/Varsity_Channel_Print_Logo_2021.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_uaap_cplay_sd/default/index.mpd', clearKey: { '95588338ee37423e99358a6d431324b9': '6e0f50a12f36599a55073868f814e81e' }, group: 'Sports', access: 'PH' },
        { name: 'BeIN Sports 1', logo: 'https://static.wikia.nocookie.net/logopedia/images/c/c4/BeINSports1.svg', manifestUri: 'https://netskrt.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/ghwcl6hv68/out/v1/83536910d8034e9b9895a20fbe1c1687/cenc.mpd', clearKey: { '335dad778109954503dcbb21dc92015f': '24bfd75d436cbf73168a2a2dccd40281' }, group: 'Sports' },  
        //{ name: 'BeIN Sports 2', logo: 'https://static.wikia.nocookie.net/logopedia/images/b/b1/Bein_sports2_2017.svg', manifestUri: 'https://netskrt.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/8m8cd46i1t/out/v1/83985c68e4174e90a58a1f2c024be4c9/cenc.mpd', clearKey: { '0b42be 2664d7e811d04f3e504e0924c5': 'ae24090123b8c72ac5404dc152847cb8' }, group: 'Sports' },  
        //{ name: 'BeIN Sports 3', logo: 'https://static.wikia.nocookie.net/logopedia/images/5/53/BeIN_Sports_3_2017_Rectangle.png', manifestUri: 'https://netskrt.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/q4u5nwaogz/out/v1/18de6d3e65934f3a8de4358e69eab86c/cenc.mpd', clearKey: { '7995c724a13748ed970840a8ab5bb9b3': '67bdaf1e2175b9ff682fcdf0e2354b1e' }, group: 'Sports' },  
        { name: 'Eurosport 1', logo: '/assets/eurosport1_logo.svg', manifestUri: 'https://v4-pan-n79-cdn-01.live.cdn.cgates.lt/live/dash/561802/index.mpd', clearKey: { '01a665d487aa4c1c898c9eb0ff1a21df': 'a0b9df5f92e6b218ddb6aa40a2cd996d' }, group: 'Sports' },  
        { name: 'Eurosport 2', logo: '/assets/eurosport2_logo.svg', manifestUri: 'https://v4-pan-n79-cdn-01.live.cdn.cgates.lt/live/dash/561705/index.mpd', clearKey: { '657707bbd1e240e08bd6969df27fef7c': '364e00581c1432f4175e4a2e8e0cd57e' }, group: 'Sports' },
        { name: 'F1TV 1', logo: '/assets/f1tv_logo.svg', manifestUri: 'https://netskrt.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/5fjow0mrvw/out/v1/f870533ee24b4f3bb98d2afe4b1e1bac/cenc.mpd', clearKey: { '505616380de706936e493fdd1c25d0b6': '5b313f49c63c682236eab3357400e216' }, group: 'Sports', access: 'EMEAANA' },
        { name: 'F1TV 2', logo: '/assets/f1tv_logo.svg', manifestUri: 'https://netskrt.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/duqbirmk0d/out/v1/40f53c7cbc95498db3afd081c377d776/cenc.mpd', clearKey: { '609d795905904705028ef54653019af7': '2c791eb611e57a7d7f203022bc1b9ba3' }, group: 'Sports', access: 'EMEAANA' },
        { name: 'FIFA+', logo: 'https://images.fubo.tv/channel-config-ui/station-logos/on-white/fifaplus-color.png', manifestUri: 'https://ca333c39.wurl.com/v1/sysdata_s_p_a_fifa_6/ohlscdn_us/latest/main/hls/playlist.m3u8', group: 'Sports', access: 'EMEAANA' },
        { name: 'NFL Network', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/National_Football_League_logo.svg/250px-National_Football_League_logo.svg.png', manifestUri: 'https://ac-009.live.p7s1video.net/e0e064c8/t_004/ran-nflnetwork-de-hd/cenc-default.mpd', clearKey: { 'b26a662a10074eb0756404c8e90e765a': '76e376bd25f92bed939435d982f92d3f' }, group: 'Sports' },    
        { name: 'NBA TV Philippines', logo: 'https://static.wikia.nocookie.net/logopedia/images/0/0c/NBA_TV_Philippines_White.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cgnl_nba/default/index.mpd', clearKey: { 'd1f8a0c97b3d4e529a6f2c4b8d7e1f90': '58ab331d14b66bf31aca4284e0a3e536' }, group: 'Sports', access: 'PH' },
        { name: 'NBA TV', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/NBA_TV.svg/250px-NBA_TV.svg.png', manifestUri: 'https://netskrt.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/2jbycgm3g3/out/v1/066dd9325648468c9ecdc8b272370931/cenc.mpd', clearKey: { '84077d18bcf234a42de3745be106a87f': 'aee3069c062ec8ee6bfdd32985f287ef' }, group: 'Sports', access: 'EMEAANA x PH' },
        { name: 'Premier Sports', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/PremierSports-ph.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_ps_hd1/default/index.mpd', clearKey: { 'b8b595299fdf41c1a3481fddeb0b55e4': 'cd2b4ad0eb286239a4a022e6ca5fd007' }, group: 'Sports', access: 'PH' },
        { name: 'Premier Sports 2', logo: 'https://static.wikia.nocookie.net/russel/images/9/9f/Premier_Sports_2_Logo_2022.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/premiersports2hd/default/index.mpd', clearKey: { '59454adb530b4e0784eae62735f9d850': '61100d0b8c4dd13e4eb8b4851ba192cc' }, group: 'Sports', access: 'PH' },
        { name: 'SPOTV', logo: 'https://www.spotv.net/static/images/onair_spotv.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_spotvhd/default/index.mpd', clearKey: { 'ec7ee27d83764e4b845c48cca31c8eef': '9c0e4191203fccb0fde34ee29999129e' }, group: 'Sports', access: 'PH' },
        { name: 'SPOTV2', logo: 'https://www.spotv.net/static/images/onair_spotv2.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/dr_spotv2hd/default/index.mpd', clearKey: { '7eea72d6075245a99ee3255603d58853': '6848ef60575579bf4d415db1032153ed' }, group: 'Sports', access: 'PH' },
        { name: 'TNT Sports 1', logo: 'https://static-wbd-cdn.wbd.com/s3_assets/wp-content/uploads/2024/01/TNT-Sports-Logo.png', manifestUri: 'https://netskrt.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/cllekigzzn/out/v1/bd3b0c314fff4bb1ab4693358f3cd2d3/cenc.mpd', clearKey: { '294b5761cefc22d0c6312939e13d8278': '52148f1042d238849f0a7813f1da8a7b' }, group: 'Sports', access: 'EMEAANA' },
        { name: 'TNT Sports 2', logo: 'https://static-wbd-cdn.wbd.com/s3_assets/wp-content/uploads/2024/01/TNT-Sports-Logo.png', manifestUri: 'https://netskrt.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/fb6jy4pxts/out/v1/f8fa17f087564f51aa4d5c700be43ec4/cenc.mpd', clearKey: { 'f288380ca4cef9ad3f27a92a08e9bb8b': '9f18d26291d9230833501f7f822f6875' }, group: 'Sports', access: 'EMEAANA' },
        { name: 'TNT Sports 3', logo: 'https://static-wbd-cdn.wbd.com/s3_assets/wp-content/uploads/2024/01/TNT-Sports-Logo.png', manifestUri: 'https://netskrt.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/5sxuux529k/out/v1/bb548a3626cd4708afbb94a58d71dce9/cenc.mpd', clearKey: { '1d96ab366bbe6451edf7407b58e2fa16': '0116201f4a63ac5bf5787d2c610c41a7' }, group: 'Sports', access: 'EMEAANA' },
        { name: 'TNT Sports 4', logo: 'https://static-wbd-cdn.wbd.com/s3_assets/wp-content/uploads/2024/01/TNT-Sports-Logo.png', manifestUri: 'https://netskrt.live.pv-cdn.net/OTTB/lhr-nitro/live/clients/dash/enc/pnu10tp36z/out/v1/912e9db56d75403b8a9ac0a719110f36/cenc.mpd', clearKey: { '192b1115da041585c77200128549efa1': '634e10efe4abbb14be400a3ccbac0258' }, group: 'Sports', access: 'EMEAANA' },
        { name: 'UFCTV', logo: 'https://static.wikia.nocookie.net/logopedia/images/8/8f/UFC_TV_Logo_2025.svg', manifestUri: 'https://amg19223-amg19223c6-amgplt0351.playout.now3.amagi.tv/playlist/amg19223-amg19223c6-amgplt0351/playlist.m3u8', group: 'Sports', access: 'PH' },

        // Kids
        //{ name: 'Animax', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Animaxlogo-20160701.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_animax_sd_new/default/index.mpd', clearKey: { '1e7b9d2c6a4f4d8c9f33b5c1a8d7e260': '67336c0c5b24fb4b8caac248dad3c55d' }, group: 'Kids', access: 'PH' },
        { name: 'Aniplus', logo: 'https://static.wikia.nocookie.net/logopedia/images/6/68/Aniplus_%28Current%29.svg', manifestUri: 'https://amg18481-amg18481c1-amgplt0352.playout.now3.amagi.tv/playlist/amg18481-amg18481c1-amgplt0352/playlist.m3u8', group: 'Kids', access: 'PH' },
        { name: 'Cartoon Channel PH', logo: 'https://static.wikia.nocookie.net/kmbpmock/images/2/27/CCPh_Mod_2025.png', manifestUri: 'https://live20.bozztv.com/giatv/giatv-cartoonchannelph/cartoonchannelph/chunks.m3u8', group: 'Fan-Made • Kids', access: 'PH' },
        { name: 'Cartoon Network', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cartoon_Network_2010_white_text.svg/1920px-Cartoon_Network_2010_white_text.svg.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cartoonnetworkhd/default/index.mpd', clearKey: { 'a2d1f552ff9541558b3296b5a932136b': 'cdd48fa884dc0c3a3f85aeebca13d444' }, group: 'Kids', access: 'PH' },
        { name: 'Cartoonito', logo: 'https://cartoonito.wbtvd.com/cartoonito-logo.png', manifestUri: 'https://udn-streamer1.cdn.3bbtv.com:8443/3bb/live/302/302.mpd', clearKey: { 'ad2371259d34404cb89d54a4dc88dcd3': '1ba155e345c4456ba891cbee9b3e1c4c' }, group: 'Kids', access: 'SEA' },
        { name: 'DreamWorks (Tagalized)', logo: 'https://dreamworkschannel.com/assets/images/logos/DreamWorks_Channel_Stacked.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_dreamworktag/default/index.mpd', clearKey: { '564b3b1c781043c19242c66e348699c5': 'd3ad27d7fe1f14fb1a2cd5688549fbab' }, group: 'Kids', access: 'PH' },
        { name: 'DreamWorks', logo: 'https://dreamworkschannel.com/assets/images/logos/DreamWorks_Channel_Stacked.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_dreamworks_hd1/default/index.mpd', clearKey: { '7b1e9c4d5a2f4d8c9f106d3a8b2c1e77': '8b2904224c6cee13d2d4e06c0a3b2887' }, group: 'Kids', access: 'PH' },
        { name: 'Moonbug', logo: 'https://a.storyblok.com/f/260537/512x256/3162ef8ee4/moonbug-logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_moonbug_kids_sd/default/index.mpd', clearKey: { '0bf00921bec94a65a124fba1ef52b1cd': '0f1488487cbe05e2badc3db53ae0f29f' }, group: 'Kids', access: 'PH' },
        //{ name: 'Nick Jr.', logo: 'https://static.wikia.nocookie.net/dreamlogos/images/2/28/Nick_Jr._%282023%2C_3D%29.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/dr_nickjr/default/index.mpd', clearKey: { 'bab5c11178b646749fbae87962bf5113': '0ac679aad3b9d619ac39ad634ec76bc8' }, group: 'Kids', access: 'PH' },
        { name: 'Nick Jr.', logo: 'https://static.wikia.nocookie.net/dreamlogos/images/2/28/Nick_Jr._%282023%2C_3D%29.png', manifestUri: 'https://udn-streamer1.cdn.3bbtv.com:8443/3bb/live/304/304.mpd', clearKey: { '641c3f0e676d49d18c2082e093380e69': 'e06f3a2e327643249c3831ab199c4015' }, group: 'Kids', access: 'SEA' },
        //{ name: 'Nickelodeon', logo: 'https://static.wikia.nocookie.net/nickelodeon/images/7/7e/2023_Nick_3D.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/dr_nickelodeon/default/index.mpd', clearKey: { '9ce58f37576b416381b6514a809bfd8b': 'f0fbb758cdeeaddfa3eae538856b4d72' }, group: 'Kids', access: 'PH' },
        { name: 'Nickelodeon', logo: 'https://static.wikia.nocookie.net/nickelodeon/images/7/7e/2023_Nick_3D.png', manifestUri: 'https://udn-streamer1.cdn.3bbtv.com:8443/3bb/live/303/303.mpd', clearKey: { '9130a6448a74430794d355b48b56a64c': 'c2f4d3288cdb43cf81e519ceb414dd6f' }, group: 'Kids', access: 'SEA' },

        // Infotainment
        { name: 'DepEd TV', logo: 'https://static.wikia.nocookie.net/russel/images/f/f3/DepEd_TV_Logo_2020.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/depedch_sd/default/index.mpd', clearKey: { '0f853706412b11edb8780242ac120002': '2157d6529d80a760f60a8b5350dbc4df' }, group: 'Infotainment', access: 'PH' },
        { name: 'Knowledge Channel', logo: '/assets/kc_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/kc/manifest.mpd', clearKey: { 'bd1f88dd3b254514bf7a113188c10dc2': 'ea86da60f0116f3b92a86acf45b8e071' }, group: 'Infotainment', access: 'PH' },
        //{ name: 'Knowledge Channel', logo: '/assets/kc_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/knowledge_channel/default/index.mpd', clearKey: { 'c7d2b1e94f8a4d6c8a106b3d1f9c2e55': '2052f6b844aa53144bb32f0e41295106' }, group: 'Infotainment', access: 'PH' },
        { name: 'Discovery Channel', logo: 'https://static-wbd-cdn.wbd.com/s3_assets/images/brands/2024-07/discovery-channel-logo-white.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/discovery/default/index.mpd', clearKey: { 'd9ac48f5131641a789328257e778ad3a': 'b6e67c37239901980c6e37e0607ceee6' }, group: 'Infotainment', access: 'PH' },
        //{ name: 'History', logo: 'https://res.cloudinary.com/aenetworks/image/upload/c_fill,w_230,h_264,g_auto/v1/logo_4_zds74r?_a=BAVAZGID0', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/dr_historyhd/default/index.mpd', clearKey: { 'e2a8c7d15b9f4d6a9c101f7e3b2d8a44': '397ca914a73b1e00bc94ed9eccf9c258' }, group: 'Infotainment', access: 'PH' },
   ];
    
   const filteredChannels = channels.filter(channel => {

        if (!channel.access) return true;
        
        switch (channel.access) {
            case 'PH': return isPH;
            case 'Non-PH': return !isPH;
            case 'US': return country === 'US';
            case 'SEA': return SEA_COUNTRIES.includes(country);
            case 'NA': return NA_COUNTRIES.includes(country);
            case 'EMEAA': return EMEAA_COUNTRIES.includes(country);
            case 'EMEAA x PH': return EMEAA_COUNTRIES.includes(country) && !isPH;
            case 'EMEAANA': return (EMEAA_COUNTRIES.includes(country) || NA_COUNTRIES.includes(country));   
            case 'EMEAANA x PH': return (EMEAA_COUNTRIES.includes(country) || NA_COUNTRIES.includes(country)) && !isPH;
            default: return true;
        }
    });

    const publicData = filteredChannels.map(channel => ({
        name: channel.name,
        logo: channel.logo,
        group: channel.group
    }));

    return new Response(JSON.stringify(publicData), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
