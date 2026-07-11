// ============================================================
// Shared Supabase client
// ============================================================
// Put your project URL + anon key here (Supabase dashboard ->
// Project Settings -> API). Both the mods loader and the account
// system import the client from this one file.
// ============================================================

const SUPABASE_URL = "https://xyxyjkngfkuaqxzpbyme.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5eHlqa25nZmt1YXF4enBieW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MDgyMzgsImV4cCI6MjA5OTE4NDIzOH0.jCvs1w9IDp8cRppddVj1Jun2_vS57jayGsClb8aDTGo";


import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
