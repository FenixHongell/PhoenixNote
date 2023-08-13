import {createClient, SupabaseClient} from "@supabase/supabase-js";

const PROJECT_URL:string = "https://hyinjrwhtzhwwdgxnpmd.supabase.co";
const ANON_KEY:string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5aW5qcndodHpod3dkZ3hucG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEzMDg0NDcsImV4cCI6MjAwNjg4NDQ0N30.j3mxJVVKupeaxIDduzjpNg9hbro5UhxjTIdO7ndyxu4";

const supabase:SupabaseClient = createClient(PROJECT_URL, ANON_KEY);

export default supabase;