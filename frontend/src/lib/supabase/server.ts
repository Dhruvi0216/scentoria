import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database-generated';

// Using standard supabase-js client for straightforward API route usage
export function createClient() {
    return createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin tasks like scraping
    );
}
