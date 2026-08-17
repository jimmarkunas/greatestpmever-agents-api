import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import path from 'node:path';

dotenv.config();

if (!process.env.DATABASE_URL) {
  dotenv.config({
    path: path.resolve(__dirname, '../../../../config/.env'),
  });
}

let supabaseClient: SupabaseClient | undefined;

export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseApiKey = process.env.SUPABASE_API_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing required environment variable: SUPABASE_URL');
  }

  if (!supabaseApiKey) {
    throw new Error('Missing required environment variable: SUPABASE_API_KEY');
  }

  supabaseClient = createClient(supabaseUrl, supabaseApiKey);

  return supabaseClient;
}

export async function checkSupabaseDataApi(): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseApiKey = process.env.SUPABASE_API_KEY;

  getSupabaseClient();

  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      apikey: supabaseApiKey as string,
      Authorization: `Bearer ${supabaseApiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase Data API returned HTTP ${response.status}`);
  }
}
