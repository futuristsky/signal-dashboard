import { createClient } from '@supabase/supabase-js';

// ─── PASTE YOUR SUPABASE CREDENTIALS HERE ────────────────────────────────────
const SUPABASE_URL = 'https://hkhbimsjhntymsivjtsk.supabase.co';        // e.g. https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraGJpbXNqaG50eW1zaXZqdHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MjY0MzYsImV4cCI6MjA4NzAwMjQzNn0.wGLFWvgPP3NsBl1bcEkX2yUFjOtPWMmLuQehSkrwwFk'; // starts with eyJ...
// ─────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── DATA HELPERS ─────────────────────────────────────────────────────────────

export async function loadAllData() {
  try {
    const [pipelineRes, hypothesesRes, insightsRes] = await Promise.all([
      supabase.from('pipeline').select('*'),
      supabase.from('hypotheses').select('*'),
      supabase.from('insights').select('*'),
    ]);

    return {
      pipeline:    (pipelineRes.data    || []).map(r => r.data),
      hypotheses:  (hypothesesRes.data  || []).map(r => r.data),
      insights:    (insightsRes.data    || []).map(r => r.data),
    };
  } catch (err) {
    console.error('Supabase load error:', err);
    return null;
  }
}

export async function saveLead(lead) {
  const { error } = await supabase
    .from('pipeline')
    .upsert({ id: lead.id, data: lead, updated_at: new Date().toISOString() });
  if (error) console.error('Save lead error:', error);
}

export async function saveHypothesis(h) {
  const { error } = await supabase
    .from('hypotheses')
    .upsert({ id: h.id, data: h, updated_at: new Date().toISOString() });
  if (error) console.error('Save hypothesis error:', error);
}

export async function saveInsight(ins) {
  const { error } = await supabase
    .from('insights')
    .upsert({ id: ins.id, data: ins, updated_at: new Date().toISOString() });
  if (error) console.error('Save insight error:', error);
}

export async function deleteLead(id) {
  await supabase.from('pipeline').delete().eq('id', id);
}
