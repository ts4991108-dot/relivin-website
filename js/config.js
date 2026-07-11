// The Supabase anon key is safe to expose in client-side code — it is
// designed for this and access is controlled entirely by Row Level Security
// policies (see supabase/migrations/20260702210000_create_waitlist.sql).
window.RELIVIN_CONFIG = {
  supabaseUrl: 'https://rilfpeeoelklhhxsmdmk.supabase.co',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpbGZwZWVvZWxrbGhoeHNtZG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MjUxMTYsImV4cCI6MjA5ODUwMTExNn0.c8uKYbpBI5myWolRVrzaq59KshDrdSIuxSKp9EblpZg',
};
