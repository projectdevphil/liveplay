export async function onRequest(context) {
    const url = new URL(context.request.url);
    const channelQuery = url.searchParams.get("channel");

    if (!channelQuery) {
        return new Response(JSON.stringify({ error: "Not Found" }), { 
            status: 404, 
            headers: { "Content-Type": "application/json" } 
        });
    }

    const channels = [
        // General 
        { id: 'e4d18f92-3c8a-4b71-920f-5a6b7c8d9e01', name: 'Kapamilya Channel', logo: '/assets/logos/abs_kapcha_logo.svg', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-kapcha-dash-abscbnono/manifest.mpd', clearKey: { '292dee4236d04054910e9706ee22626b': 'b7c5d3220f6eb6e042a2bcb367b5c09b' }, group: 'General' },
        //{ id: 'e4d18f92-3c8a-4b71-920f-5a6b7c8d9e01', name: 'Kapamilya Channel', logo: '/assets/logos/abs_kapcha_logo.svg', manifestUri: 'https://streams.comclark.com/pknhd/kapamilya_hd/playlist.m3u8', group: 'General' },
        //{ id: '8f3a19b2-7c4d-4e2a-9f1b-5e6d7c8a9b01', name: 'ALLTV2', logo: '/assets/logos/abs_alltv2_logo.svg', manifestUri: 'https://streams.comclark.com/pknsd/alltv/playlist.m3u8', group: 'General' },
        { id: '3e7a12b4-9c5d-4f1e-8a2b-6c7d8e9f0a12', name: 'TV5', logo: '/assets/logos/tv5_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/tv5_hd/default1/index.mpd', clearKey: { '9c3e7a516d824f04a9175b8c2e3d7040': '524a9c2cec98272f71c347345a3fd12e' }, group: 'General' },
        { id: '9d2b8a13-4c7e-4f0a-8b1c-3d5e7f9a1b23', name: 'One Sports', logo: '/assets/logos/one_sports_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_onesports_hd/default/index.mpd', clearKey: { '69f5a2318d744c609b125e3a7d8f2046': '182523c0bae912e17e916dd4283280e9' }, group: 'Sports' },
        //{ id: '1a4c9e2b-8d3f-4a0e-9b7c-5d6e1f2a3b44', name: 'GMA', logo: '/assets/logos/gma_logo.png', manifestUri: 'https://streams.comclark.com/pknsd/gma_7/playlist.m3u8', group: 'General' },
        { id: '6f8b2c14-5d9a-4e3b-7c0d-1e2f4a5b6c75', name: 'RPTV', logo: '/assets/logos/rptv_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cnn_rptv_prod_hd/default/index.mpd', clearKey: { 'b5d7a6219c434e188f026a3d7c5e9148': '28e1244057ff6feae879c1e985ded0fb' }, group: 'General' },
        { id: '2d7e9a15-8c3b-4f0e-9a1c-4b5d6e7f8a96', name: 'A2Z', logo: '/assets/logos/a2z_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_a2z/default/index.mpd', clearKey: { 'f3a8c9126e544d809b312c7f5a8e6140': '43f5361983896b47ff01b4f77c5dbf3f' }, group: 'General' },
        //{ id: '2d7e9a15-8c3b-4f0e-9a1c-4b5d6e7f8a96', name: 'A2Z', logo: '/assets/logos/a2z_logo.png', manifestUri: 'https://streams.comclark.com/pknsd/a2z/playlist.m3u8', group: 'General' },
        //{ id: '5c1f8b26-4d9e-3a7c-0b1d-2e3f4a5b6c87', name: 'GTV', logo: '/assets/logos/gtv_logo.svg', manifestUri: 'https://streams.comclark.com/pknsd/gtv/playlist.m3u8', group: 'General' },
        { id: '0b3d7a18-2e4f-4a9c-8b1d-3e5f7a9b0c18', name: 'PTV', logo: '/assets/logos/ptv_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_ptv4_sd/default/index.mpd', clearKey: { 'f8c2a6915d744b309e186a3f7c2d8049': '1ad3243b38c60312caa6ba11f150c19c' }, group: 'General' },
        //{ id: '0b3d7a18-2e4f-4a9c-8b1d-3e5f7a9b0c18', name: 'PTV', logo: '/assets/logos/ptv_logo.svg', manifestUri: 'https://streams.comclark.com/pknsd/ptv/playlist.m3u8', group: 'General' },
        { id: '4e9a2b17-6c3d-4e5f-0b1a-8c2d3e4f5a69', name: 'IBC', logo: '/assets/logos/ibc_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/ibc13_sd_new/default/index.mpd', clearKey: { 'f4a8d6216c954e709b187d3a5f2c8049': '34710df996a4089ee6f7e8deb7f46586' }, group: 'General' },
        //{ id: '4e9a2b17-6c3d-4e5f-0b1a-8c2d3e4f5a69', name: 'IBC', logo: '/assets/logos/ibc_logo.png', manifestUri: 'https://streams.comclark.com/pknsd/ibc_13/playlist.m3u8', group: 'General' },
    
        // News
        { id: '7f1b8a29-3c4d-4e0f-9a2b-5c6d7e8f9a00', name: 'ABS-CBN News Channel', logo: '/assets/logos/anc_logo.svg', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/anc-ph3/manifest.mpd', clearKey: { 'b6d6e536f8fa4d8b93627af0128cf00d': 'e73c8dcfdea374ae576ced342f6c73a2' }, group: 'News' },
        //{ id: '2a9c4d18-7e3f-4a0b-8c1d-6e5f2a3b4c11', name: 'Bilyonaryo News Channel', logo: '/assets/logos/bnc_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/bilyonaryoch/default/index.mpd', clearKey: { '2e7f9c518a424d30b2165c3e7a9d6041': '8c8c0ef924c982bc1dd92348e024cd4c' }, group: 'News' },
        { id: '2a9c4d18-7e3f-4a0b-8c1d-6e5f2a3b4c11', name: 'Bilyonaryo News Channel', logo: '/assets/logos/bnc_logo.png', manifestUri: 'https://amg19223-amg19223c11-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c11-amgplt0352/playlist.m3u8', group: 'News' },
        { id: '8b3d1e27-5c9a-4f0e-8b1c-3d4e7f9a0b22', name: 'DZMM Teleradyo', logo: '/assets/logos/dzmm_teleradyo_logo.png', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-teleradyo-dash-abscbnono/index.mpd', clearKey: { '47c093e0c9fd4f80839a0337da3dd876': '603248b858276f533a13e17f2f48c711' }, group: 'News' },
        //{ id: '3f7a9b14-8c2d-4e0a-9f1b-5e6d2c8a7b33', name: 'DZRH TV', logo: '/assets/logos/dzrh_tv_logo.svg', manifestUri: 'https://streams.comclark.com/pknsd/dzrh/playlist.m3u8', group: 'News' },
        { id: '1c4e8b29-6d3f-4a0e-9a1b-7c5d2e8f9a44', name: 'One News', logo: '/assets/logos/one_news_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/onenews_hd1/default/index.mpd', clearKey: { 'd5c8a2914e734b609f127a3d6c5e8048': '11368a3b001407d65a85b4edb410ecdd' }, group: 'News' },
        { id: '9a2b7c15-4d8e-4f0a-8c1b-3d5e6f2a7b55', name: 'One PH', logo: '/assets/logos/one_ph_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/oneph_sd/default/index.mpd', clearKey: { '5e9a3c718d464f20b9157a6c2e4d8031': '7bf8a7666a2d572fe111b5f829c99266' }, group: 'News' },

        // Entertainment
        { id: '5d8e1a29-3c7f-4b0e-9a1c-2e4f8a9b0c66', name: 'Jeepney TV', logo: '/assets/logos/jeepney_tv_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/jeepneytv/manifest.mpd', clearKey: { 'dc9fec234a5841bb8d06e92042c741ec': '225676f32612dc803cb4d0f950d063d0' }, group: 'Entertainment' },
        { id: '0e2f9a18-6c3d-4f0b-8a1c-5d7e3a9b2c77', name: 'Kapatid Channel', logo: '/assets/logos/kapatid_ch_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/kapatid_hd/default/index.mpd', clearKey: { '8f7a2c913d6b4e5a9f127c8d4e6a1b90': 'a73d3d1211fb23084c62572706f45397' }, group: 'General' },
        { id: '6b1c8e29-4d3f-4a0e-9f1b-2e5d7a8b9c88', name: 'TVN Premium', logo: '/assets/logos/tvn_logo.svg', type: 'mpegdash', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_tvnpre/default/index.mpd', clearKey: { '3a7f9c615d824e40a9168c5b2d7f3049': '2bc91eced1660ecf88299a42e4c0cd91' }, group: 'Entertainment' },

        // Movies
        { id: '4d7a1b28-9c3e-4f0b-8a1c-6e5f2a9b0c99', name: 'Cinema One', logo: '/assets/logos/cinema_one_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/c1ph/manifest.mpd', clearKey: { '55eddd1e157e4c3b830866e4679e7032': '525030e984567ba8df0af80660952368' }, group: 'Movies' },
        //{ id: '8a2b9c14-7d3f-4e0a-9f1b-3e5d6a8b7c00', name: 'Cinemo!', logo: '/assets/logos/cinemo_logo.png', manifestUri: 'https://streams.comclark.com/pknsd/cinemo/playlist.m3u8', group: 'Movies' },
        { id: '8a2b9c14-7d3f-4e0a-9f1b-3e5d6a8b7c00', name: 'Cinemo!', logo: '/assets/logos/cinemo_logo.png', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-cinemo-dash-abscbnono/index.mpd', clearKey: { 'aa8aebe35ccc4541b7ce6292efcb1bfb': 'f06b6031a3604cc6708c14d83f1a1b27' }, group: 'Movies' },
        //{ id: '1f8e2a39-5c4d-4b0e-9a1c-7d2e3f8a9b11', name: 'PBO', logo: '/assets/logos/pbo_logo.svg', manifestUri: 'https://streams.comclark.com/pknsd/pbo/playlist.m3u8', group: 'Movies' },
        //{ id: '3c7a9b28-1d4e-4f0a-8b1c-5e2d6f8a9b22', name: 'Viva Cinema', logo: '/assets/logos/viva_cinema_logo.svg', manifestUri: 'https://streams.comclark.com/pknsd/viva/playlist.m3u8', group: 'Movies' },
        { id: '7e1a2b39-4c8d-4f0e-9a1b-6c5d2e3f4a33', name: 'Studio Universal', logo: '/assets/logos/studio_universal_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_studio_universal_hd/default/index.mpd', clearKey: { 'f8391e9130634854b4614f02ec028ea7': '9b9640f873cf906b91dd03c02612d5ce' }, group: 'Movies' },

        // Sports
        { id: '2d8e9a14-6c3f-4b0e-8a1c-7e5f3a2b1c44', name: 'PBA Rush', logo: '/assets/logos/pba_rush_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_pbarush_hd1/default/index.mpd', clearKey: { '91a5e6327c844f09b2186d3a5e7c2041': '984beb3aeff3554c1a5acc04d6044e55' }, group: 'Sports' },
        { id: '9c1b2a38-5d4e-4f0a-8b1c-6e3f7a8b9c55', name: 'NBA TV Philippines', logo: '/assets/logos/nba_tv_ph_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cgnl_nba/default/index.mpd', clearKey: { '2f7c9a615d834e40b2188a6d3c7f9042': '41d2ade5ff1798859420e925d5d2080d' }, group: 'Sports' },

        // Kids
        { id: '4a7b8c29-1e3f-4d0a-9c1b-5d2e6f3a8b66', name: 'Cartoon Network', logo: '/assets/logos/cartoon_net_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cartoonnetworkhd/default/index.mpd', clearKey: { '53c8e6914d724f30a9168b5e2c7d1043': '1e17afbdfff786533796780f3f04aa67' }, group: 'Kids' },
        { id: '6e3f2a18-9c4d-4b0e-8a1c-7d5e2f3a4b77', name: 'DreamWorks (Tagalized)', logo: '/assets/logos/dreamworks_logo.svg', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/cg_dreamworktag/default/index.mpd', clearKey: { '6f9c3a218d454b70a2187e5c3d6f9042': '337ca7b74b462dd1ba7441553614538a' }, group: 'Kids' },

        // Infotainment
        { id: '1b8c9d27-3e4f-4a0e-9a1c-6d2e5f3a7b88', name: 'Knowledge Channel', logo: '/assets/logos/knowledge_ch_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/kc/manifest.mpd', clearKey: { 'bd1f88dd3b254514bf7a113188c10dc2': 'ea86da60f0116f3b92a86acf45b8e071' }, group: 'Infotainment' },
        //{ id: '1b8c9d27-3e4f-4a0e-9a1c-6d2e5f3a7b88', name: 'Knowledge Channel', logo: '/assets/knowledge_ch_logo.png', manifestUri: 'https://ucdn.mediaquest.com.ph/bpk-tv/knowledge_channel/default/index.mpd', clearKey: { '84d2f6917b354c08a9163e5d8f2a7049': '192c69ef479dd7e3fccc908d6c5dbb3a' }, group: 'Infotainment' },

        // Music
        { id: '5a3f8b19-2c4d-4e0f-8b1c-7e6d2f3a9b99', name: 'MYX', logo: '/assets/logos/myx_logo.svg', manifestUri: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-myxnola-dash-abscbnono/index.mpd', clearKey: { 'f40a52a3ac9b4702bdd5b735d910fd2f': '35e4893c6e76546085941be3010932d4' }, group: 'Music' },

        // Livestream
        { id: '3e1f8a29-4c7d-4b0e-9a1c-6d2e5f3a8b11', name: 'ASAP XP Livestream', logo: '/assets/logos/asap_xp_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/asap/manifest.mpd', clearKey: { '6379f85c61d84b5db3be564bf59f4e13': 'd9a1f47f7a58f5a9598a452081155df4' }, group: 'Livestream' },
        { id: '7d2e9a18-5c3f-4a0e-8b1c-6e3f2a4b8c22', name: "It's Showtime Livestream", logo: '/assets/logos/its_showtime_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/itsshowtime/manifest.mpd', clearKey: { '3cdb78338a104ed594175a49532c823d': '9c7810c46873053be29d26bf6f753664' }, group: 'Livestream' },
        { id: '9e3f2a18-4c7d-4b0e-8a1c-6d5e2f3a1b44', name: 'TV Patrol Livestream', logo: '/assets/logos/tv_patrol_logo.png', manifestUri: 'https://abslive.akamaized.net/dash/live/2027618/tvp-ph/manifest.mpd', clearKey: { 'a14583678b4d40b4a267c5845f673263': '98252f8318d84c55b10dd7a112622bd4' }, group: 'Livestream' }
    ];

    const createSlug = (name) => name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');

    const foundChannel = channels.find(c => 
        c.id === channelQuery || 
        c.name === channelQuery || 
        createSlug(c.name) === channelQuery
    );

    if (foundChannel) {
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
