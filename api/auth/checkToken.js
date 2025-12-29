import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) return res.status(400).json({ error: "Missing code" });

    const { data, error } = await supabase
        .from('tv_auth_codes')
        .select('access_token')
        .eq('code', code)
        .single();

    if (error || !data) return res.status(200).json({ status: 'pending' });

    if (data.access_token) {
        return res.status(200).json({ status: 'success', token: data.access_token });
    }

    res.status(200).json({ status: 'pending' });
}
