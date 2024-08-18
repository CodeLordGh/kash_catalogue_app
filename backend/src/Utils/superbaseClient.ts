// src/utils/supabaseClient.ts
import { createClient } from'@supabase/supabase-js';
import env from "dotenv"

if (process.env.NODE_ENV !== 'production') {
  env.config();
}

export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );
  