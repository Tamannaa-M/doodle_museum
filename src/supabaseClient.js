import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rddclunbklydhdkznhyp.supabase.co'
const supabaseKey = 'sb_publishable_09KPE7Te2lrCVoLb4mz2Hg_9cBv69rY'

export const supabase = createClient(supabaseUrl, supabaseKey)