import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateCode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

export default async function handler(req, res) {
    try {
        const code = generateCode();

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
