import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { code, token } = req.body;

    const { data, error } = await supabase
        .from('tv_auth_codes')
        .update({ access_token: token })
        .eq('code', code)
        .select();

    if (error || data.length === 0) return res.status(400).json({ error: 'Invalid Code or Code Expired' });

    res.status(200).json({ success: true });
}
