// ============================================================
// Shared Supabase client
// ============================================================
// Put your project URL + anon key here (Supabase dashboard ->
// Project Settings -> API). Both the mods loader and the account
// system import the client from this one file.
// ============================================================

const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
