import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aotxxkzjbbqnkuhatpjf.supabase.co';
const supabaseKey = 'sb_publishable_5wWb0dFUWwYiFY3Hal7uLg_9SXLAzSB';

export const supabase = createClient(supabaseUrl, supabaseKey);

