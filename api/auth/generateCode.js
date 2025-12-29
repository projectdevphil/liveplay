import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Environment Variables");
        return res.status(500).json({ error: "Server Configuration Error: Missing Env Vars" });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const code = Math.floor(10000 + Math.random() * 90000).toString();

        const { error } = await supabase
            .from('tv_auth_codes')
            .insert([{ code: code }]);

        if (error) {
            console.error("Supabase Error:", error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({ code });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
