import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qfldfzjqufynrpnjsgex.supabase.co';
const supabaseKey = 'sb_publishable_c-tljO1Nskf685RK4nWiJg_bbj06fuh';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  try {
    const { data, error } = await supabase
      .from('poll_responses')
      .select('*')
      .order('created_date', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching feedback:', error.message);
      return;
    }

    console.log('Latest feedback submissions:');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
