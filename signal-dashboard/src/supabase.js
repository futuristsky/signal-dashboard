// ─── PASTE YOUR SUPABASE CREDENTIALS HERE ────────────────────────────────────
const SUPABASE_URL = 'https://hkhbimsjhntymsivjtsk.supabase.co';         // e.g. https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhraGJpbXNqaG50eW1zaXZqdHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MjY0MzYsImV4cCI6MjA4NzAwMjQzNn0.wGLFWvgPP3NsBl1bcEkX2yUFjOtPWMmLuQehSkrwwFk'; // starts with eyJ...
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

// Check if real credentials have been provided
export const SUPABASE_CONFIGURED =
  SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
  SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' &&
  SUPABASE_URL.startsWith('https://');

// Only create client if credentials are real — never crash on placeholder values
export const supabase = SUPABASE_CONFIGURED
  ? (() => { try { return createClient(SUPABASE_URL, SUPABASE_ANON_KEY); } catch(e) { return null; } })()
  : null;

// ─── DATA HELPERS (all fail-safe) ────────────────────────────────────────────

export async function loadAllData() {
  if (!supabase) return null;
  try {
    const [pipelineRes, hypothesesRes, insightsRes] = await Promise.all([
      supabase.from('pipeline').select('*'),
      supabase.from('hypotheses').select('*'),
      supabase.from('insights').select('*'),
    ]);
    return {
      pipeline:   (pipelineRes.data   || []).map(r => r.data).filter(Boolean),
      hypotheses: (hypothesesRes.data || []).map(r => r.data).filter(Boolean),
      insights:   (insightsRes.data   || []).map(r => r.data).filter(Boolean),
    };
  } catch (err) {
    console.error('Supabase load error:', err);
    return null;
  }
}

export async function saveLead(lead) {
  if (!supabase) return;
  try {
    await supabase.from('pipeline').upsert({ id: lead.id, data: lead, updated_at: new Date().toISOString() });
  } catch (e) { console.error('Save lead error:', e); }
}

export async function saveHypothesis(h) {
  if (!supabase) return;
  try {
    await supabase.from('hypotheses').upsert({ id: h.id, data: h, updated_at: new Date().toISOString() });
  } catch (e) { console.error('Save hypothesis error:', e); }
}

export async function saveInsight(ins) {
  if (!supabase) return;
  try {
    await supabase.from('insights').upsert({ id: ins.id, data: ins, updated_at: new Date().toISOString() });
  } catch (e) { console.error('Save insight error:', e); }
}

export async function deleteLead(id) {
  if (!supabase) return;
  try {
    await supabase.from('pipeline').delete().eq('id', id);
  } catch (e) { console.error('Delete lead error:', e); }
}
