import { useState, useEffect, useCallback, useRef } from "react";
import { loadAllData, saveLead, saveHypothesis, saveInsight } from "./supabase";

// ─── STORAGE ─────────────────────────────────────────────────────────────────

const defaultData = {
  pipeline: [
    {
      id: "L001",
      // Org Info
      leadName: "Sarah Chen",
      company: "Bloom Studio",
      website: "bloomstudio.co",
      sector: "Commercial",
      subSegment: "Creative Agency",
      orgSize: "8",
      priorityScore: 4,
      // Contact
      contactTitle: "Founder & Creative Director",
      email: "sarah@bloomstudio.co",
      phone: "",
      linkedin: "",
      sourceOfContact: "LinkedIn",
      // Outreach
      initialContactDate: "2026-02-10",
      contactMethod: "LinkedIn",
      followUpDate: "2026-02-14",
      lastTouch: "2026-02-10",
      responseStatus: "Meeting scheduled",
      // Discovery
      problemIdentified: "Manual client reporting consuming 12+ hrs/week",
      urgency: 4,
      currentSolution: "Google Sheets + manual exports",
      budgetOwner: "Yes",
      buyingTimeline: "Q2 2026",
      painQuote: "We spend 12 hours a week just on client reporting. It's killing us.",
      objections: "Worried about onboarding time",
      suggestedFeatures: "Auto-report from project management tool",
      referralProvided: "No",
      // Experiment
      hypothesisTested: "H001",
      valuePropTested: "Auto-generate client reports from live data",
      pricingTested: "$499/mo",
      demoVersion: "v1.2",
      experimentResult: "Weak signal",
      confidenceScore: 3,
      // Opportunity
      dealSize: 18000,
      probability: 35,
      nextAction: "Schedule discovery call",
      nextActionDate: "2026-02-18",
      owner: "Founder",
      stage: "Discovery",
      // Notes
      callNotes: "First LinkedIn DM sent Feb 10. Sarah replied within 2 hours — very engaged. She runs a team of 8 creatives managing ~20 client accounts. Biggest pain: weekly reporting is fully manual. They export from ClickUp, paste into Google Slides, and send. She said verbatim: \"We spend 12 hours a week just on client reporting. It's killing us.\" Budget is there — she's already paying $800/mo for ClickUp + Figma + other tools. She's the decision maker. Want to do a demo by end of Feb. Concern: will her team actually adopt it?",
      transcription: "",
      tags: ["reporting", "agency", "manual-ops"],
      touchLog: [
        { date: "2026-02-10", time: "10:00", type: "LinkedIn", duration: "", notes: "First DM sent. She replied within 2 hours — very engaged." },
        { date: "2026-02-14", time: "14:30", type: "Call", duration: "25 min", notes: "Intro call. Confirmed pain around reporting. Wants a demo." },
      ],
    },
    {
      id: "L002",
      leadName: "Mia Torres",
      company: "Verdant Ops",
      website: "verdantops.com",
      sector: "Commercial",
      subSegment: "Sustainability Startup",
      orgSize: "22",
      priorityScore: 5,
      contactTitle: "COO",
      email: "mia@verdantops.com",
      phone: "571-330-8821",
      linkedin: "linkedin.com/in/miatorres",
      sourceOfContact: "Referral",
      initialContactDate: "2026-02-08",
      contactMethod: "Intro",
      followUpDate: "2026-02-15",
      lastTouch: "2026-02-08",
      responseStatus: "Discovery complete",
      problemIdentified: "No single source of truth for operational data across teams",
      urgency: 5,
      currentSolution: "Notion + Airtable patchwork",
      budgetOwner: "Yes",
      buyingTimeline: "Q1 2026",
      painQuote: "Reporting is a black hole. No one trusts the numbers.",
      objections: "Need security audit before contract",
      suggestedFeatures: "Role-based dashboards, data audit trail",
      referralProvided: "Yes",
      hypothesisTested: "H001",
      valuePropTested: "Single ops dashboard replacing tool sprawl",
      pricingTested: "$2,500/mo",
      demoVersion: "v1.3",
      experimentResult: "Confirmed",
      confidenceScore: 5,
      dealSize: 36000,
      probability: 65,
      nextAction: "",
      nextActionDate: "",
      owner: "Founder",
      stage: "Proposal",
      callNotes: "Warm intro from Marcus Webb. Mia is the COO — extremely sharp. Has tried to solve this 3 times with different tools. Currently using Notion for docs, Airtable for tracking, Slack for comms — nothing talks to each other. She presented the pain as an org-wide trust problem: 'Reporting is a black hole. No one trusts the numbers.' High urgency because they're in fundraise prep (Series A, targeting summer). She wants a pilot by March. Security is a real blocker — they have ESG data they're sensitive about. Got a referral to two more sustainability ops leads.",
      transcription: "TRANSCRIPT — Discovery Call, Feb 8\n\nMe: Tell me about how you currently track operational performance.\n\nMia: Honestly? We don't. Not well. We have like five different tools and none of them talk to each other. I'm manually pulling reports every week for our board and it takes me half a day.\n\nMe: What does that cost you?\n\nMia: Time, obviously. But the bigger issue is trust. When I send numbers to our CEO, she asks where they came from. When she asks questions I can't answer in real time, it looks bad. Reporting is a black hole. No one trusts the numbers.\n\nMe: What would it look like if this was solved?\n\nMia: One dashboard. I open it, everything is there, it's live, I can drill down by team or project. No exports. No Slack messages asking for updates.\n\nMe: Have you tried other tools?\n\nMia: Three times. We've tried Monday, ClickUp ops view, and a custom Notion build. All failed for different reasons — adoption, flexibility, or just too complex to maintain.",
      tags: ["ops", "fundraising", "series-a", "sustainability"],
      touchLog: [
        { date: "2026-02-08", time: "09:15", type: "Intro", duration: "10 min", notes: "Warm intro from Marcus Webb. Scheduled discovery call." },
        { date: "2026-02-08", time: "15:00", type: "Call", duration: "45 min", notes: "Full discovery call. Deep pain around ops data trust. Wants pilot by March." },
        { date: "2026-02-12", time: "11:00", type: "Email", duration: "", notes: "Sent follow-up with pilot proposal draft. She read it same day." },
      ],
    },
    {
      id: "L003",
      leadName: "Priya Nair",
      company: "Lumen Health",
      website: "lumenhealth.io",
      sector: "Commercial",
      subSegment: "Health Tech",
      orgSize: "45",
      priorityScore: 3,
      contactTitle: "VP of Operations",
      email: "priya.nair@lumenhealth.io",
      phone: "",
      linkedin: "",
      sourceOfContact: "Conference",
      initialContactDate: "2026-01-30",
      contactMethod: "Event",
      followUpDate: "2026-02-05",
      lastTouch: "2026-01-30",
      responseStatus: "Opportunity active",
      problemIdentified: "Compliance documentation delays slowing product releases",
      urgency: 3,
      currentSolution: "Internal legal + manual doc assembly",
      budgetOwner: "No",
      buyingTimeline: "Q3 2026",
      painQuote: "Compliance docs take forever and we always miss something.",
      objections: "Budget not owned by ops — need to loop in legal and CFO",
      suggestedFeatures: "Compliance checklist automation, version control for regulatory docs",
      referralProvided: "No",
      hypothesisTested: "H002",
      valuePropTested: "AI-assisted compliance doc generation",
      pricingTested: "$1,200/mo",
      demoVersion: "v1.1",
      experimentResult: "Weak signal",
      confidenceScore: 2,
      dealSize: 60000,
      probability: 20,
      nextAction: "Loop in CFO + legal intro call",
      nextActionDate: "2026-02-20",
      owner: "Founder",
      stage: "Pilot",
      callNotes: "Met at HealthTech Summit in DC. Priya runs ops for 45-person health tech company. Their compliance process is entirely manual — they have a Word doc checklist that gets emailed around. Last compliance cycle they missed a submission window and it delayed a product release by 6 weeks. Pain is real but she is NOT the budget owner. Need CFO and legal in the room. Long sales cycle likely. Interesting opportunity if we can get multi-stakeholder buy-in.",
      transcription: "",
      tags: ["compliance", "health-tech", "multi-stakeholder"],
      touchLog: [
        { date: "2026-01-30", time: "17:00", type: "Event", duration: "20 min", notes: "Met at HealthTech Summit in DC. Exchanged cards, scheduled follow-up." },
        { date: "2026-02-05", time: "10:00", type: "Call", duration: "30 min", notes: "Intro discovery call. Pain confirmed but she's not the budget owner." },
      ],
    },
  ],
  hypotheses: [
    {
      id: "H001",
      statement: "Ops teams at agencies pay to eliminate weekly reporting overhead",
      segment: "Creative Agencies",
      problem: "Manual reporting consuming 10+ hrs/week",
      valueProp: "Auto-generate client reports from live data",
      experimentType: "Discovery Interview",
      testDate: "2026-02-01",
      evidenceCollected: "2 of 3 leads confirmed pain. Mia confirmed at highest level.",
      supporting: 2,
      contradicting: 0,
      result: "Weak signal",
      decision: "Iterate",
      status: "Testing",
      notes: "Need to test at 5+ leads before doubling down on this segment.",
    },
    {
      id: "H002",
      statement: "Health tech companies will pay for compliance automation",
      segment: "Health Tech",
      problem: "Compliance documentation errors + delays",
      valueProp: "AI-assisted compliance doc generation",
      experimentType: "Demo",
      testDate: "2026-02-10",
      evidenceCollected: "1 lead interested but budget gating is major blocker",
      supporting: 1,
      contradicting: 1,
      result: "Rejected",
      decision: "Pivot",
      status: "Testing",
      notes: "Multi-stakeholder sales cycle is expensive for early stage. Revisit at scale.",
    },
  ],
  insights: [
    {
      id: "I001",
      painTheme: "Reporting Overhead",
      quote: "We spend 12 hours a week just on client reporting.",
      segment: "Creative Agencies",
      frequency: 2,
      intensity: "High",
      exampleLeads: "L001, L002",
      revenuePotential: 54000,
      priority: "High",
      linkedHypothesis: "H001",
    },
    {
      id: "I002",
      painTheme: "Compliance Complexity",
      quote: "Compliance docs take forever and we always miss something.",
      segment: "Health Tech",
      frequency: 1,
      intensity: "Medium",
      exampleLeads: "L003",
      revenuePotential: 60000,
      priority: "Medium",
      linkedHypothesis: "H002",
    },
  ],
};

// localStorage used as fast local cache; Supabase is source of truth
function getCached() {
  try {
    const raw = localStorage.getItem("signal_cache_v3");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function setCache(data) {
  try {
    localStorage.setItem("signal_cache_v3", JSON.stringify(data));
  } catch (e) {}
}

// ─── UTILS ───────────────────────────────────────────────────────────────────
const today = new Date().toISOString().split("T")[0];

function daysDiff(dateStr) {
  if (!dateStr) return 999;
  return Math.floor((new Date() - new Date(dateStr)) / 86400000);
}

function healthScore(lead) {
  let score = 100;
  if (!lead.nextActionDate) score -= 35;
  if (daysDiff(lead.lastTouch) > 14) score -= 25;
  if (lead.urgency < 3) score -= 15;
  if (!lead.painQuote) score -= 15;
  if (!lead.budgetOwner || lead.budgetOwner === "No") score -= 10;
  return Math.max(0, score);
}

function healthLabel(score) {
  if (score >= 75) return { label: "Healthy", color: "#7eb59c" };
  if (score >= 45) return { label: "At Risk", color: "#c9a96e" };
  return { label: "Critical", color: "#c97070" };
}

function isPipelineLeak(lead) { return !lead.nextActionDate; }
function isStale(lead) { return daysDiff(lead.lastTouch) >= 14; }

function detectPatterns(pipeline) {
  const themes = {};
  pipeline.forEach((l) => {
    const key = l.subSegment || l.sector;
    themes[key] = (themes[key] || []).concat(l);
  });
  return Object.entries(themes)
    .filter(([, leads]) => leads.length >= 2)
    .map(([seg, leads]) => ({ segment: seg, count: leads.length, leads }));
}

// ─── PALETTE & CSS ───────────────────────────────────────────────────────────
const p = {
  cream: "#faf7f4", blush: "#f2e4dc", champagne: "#e8d8c4", mauve: "#c4a7a0",
  mauvedark: "#9d7c78", gold: "#c9a96e", golddark: "#a8854a",
  text: "#3a2e2b", textLight: "#7a6460", white: "#ffffff",
  border: "#e0d0c8", danger: "#c97070", warn: "#c9a96e", success: "#7eb59c",
  sidebar: "#2e2420", sidebarAccent: "#3d2f2a",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:${p.cream};color:${p.text};line-height:1.5;}
.dash{display:flex;height:100vh;overflow:hidden;}

/* SIDEBAR */
.sidebar{width:216px;min-width:216px;background:${p.sidebar};display:flex;flex-direction:column;padding:0;}
.logo{padding:28px 22px 22px;border-bottom:1px solid ${p.sidebarAccent};}
.logo-name{font-family:'Playfair Display',serif;font-size:19px;color:${p.champagne};letter-spacing:0.02em;}
.logo-sub{font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:${p.mauve};margin-top:3px;}
.nav-sect{padding:18px 0 4px;}
.nav-sect-label{font-size:8.5px;letter-spacing:0.22em;text-transform:uppercase;color:${p.mauve};padding:0 22px 8px;opacity:0.7;}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 22px;cursor:pointer;font-size:12.5px;font-weight:400;color:${p.champagne};transition:all 0.15s;border-left:2px solid transparent;opacity:0.65;}
.nav-item:hover{background:${p.sidebarAccent};opacity:1;}
.nav-item.active{border-left-color:${p.gold};background:${p.sidebarAccent};opacity:1;font-weight:500;}
.nav-icon{font-size:13px;width:16px;text-align:center;}
.sidebar-footer{margin-top:auto;padding:16px 22px;border-top:1px solid ${p.sidebarAccent};}
.sidebar-alert{font-size:10px;color:#e8a0a0;margin-bottom:6px;}
.sidebar-signal{font-size:10px;color:#a0c8b8;margin-bottom:4px;}
.sidebar-sync{font-size:9px;color:${p.mauve};opacity:0.55;margin-top:8px;}

/* MAIN */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.topbar{background:${p.white};border-bottom:1px solid ${p.border};padding:0 28px;height:58px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
.topbar-left{display:flex;align-items:center;gap:12px;}
.back-btn{cursor:pointer;font-size:12px;color:${p.textLight};display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:6px;border:1px solid ${p.border};transition:all 0.15s;background:none;}
.back-btn:hover{border-color:${p.mauve};color:${p.text};}
.topbar-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:600;color:${p.text};}
.topbar-date{font-size:11px;color:${p.textLight};}

/* KPI BAR */
.kpi-bar{background:${p.white};border-bottom:1px solid ${p.border};padding:14px 28px;display:flex;gap:16px;flex-shrink:0;flex-wrap:wrap;}
.kpi-card{flex:1;min-width:110px;background:${p.cream};border:1px solid ${p.border};border-radius:10px;padding:12px 16px;position:relative;overflow:hidden;}
.kpi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${p.gold},${p.mauve});}
.kpi-lbl{font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:${p.textLight};margin-bottom:5px;}
.kpi-val{font-family:'Playfair Display',serif;font-size:24px;font-weight:600;color:${p.text};}
.kpi-sub{font-size:10px;color:${p.textLight};margin-top:1px;}

/* CONTENT */
.content{flex:1;overflow-y:auto;padding:24px 28px 40px;}
.content::-webkit-scrollbar{width:4px;}
.content::-webkit-scrollbar-thumb{background:${p.champagne};border-radius:4px;}

/* ALERTS */
.alerts{display:flex;flex-direction:column;gap:7px;margin-bottom:20px;}
.alert{display:flex;align-items:flex-start;gap:9px;padding:9px 14px;border-radius:8px;font-size:11.5px;font-weight:500;border:1px solid;line-height:1.4;}
.alert-danger{background:#fdf0f0;border-color:${p.danger};color:#8b3030;}
.alert-warn{background:#fdf8ed;border-color:${p.warn};color:#7a5820;}
.alert-pattern{background:#f0f5f2;border-color:${p.success};color:#2d6653;}

/* SECTION */
.section-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
.section-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:600;}
.controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}

/* BUTTONS */
.btn{font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;padding:8px 15px;border-radius:8px;border:none;cursor:pointer;transition:all 0.15s;white-space:nowrap;}
.btn-primary{background:${p.gold};color:#fff;}
.btn-primary:hover{background:${p.golddark};}
.btn-ghost{background:transparent;color:${p.textLight};border:1px solid ${p.border};}
.btn-ghost:hover{border-color:${p.mauve};color:${p.text};}
.btn-sm{padding:5px 11px;font-size:11px;}

/* INPUTS */
.search-input,.filter-select{font-family:'DM Sans',sans-serif;font-size:12.5px;border:1px solid ${p.border};border-radius:8px;padding:7px 12px;background:${p.white};color:${p.text};outline:none;}
.search-input{width:210px;}
.filter-select{width:160px;}
.search-input:focus,.filter-select:focus{border-color:${p.gold};}

/* TABLE */
.table-wrap{background:${p.white};border-radius:14px;border:1px solid ${p.border};overflow:hidden;}
table{width:100%;border-collapse:collapse;font-size:12.5px;}
thead tr{background:${p.blush};}
th{padding:11px 13px;text-align:left;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:${p.textLight};font-weight:600;border-bottom:1px solid ${p.border};white-space:nowrap;}
td{padding:11px 13px;border-bottom:1px solid #f5eeea;vertical-align:middle;}
tr:last-child td{border-bottom:none;}
tr:hover td{background:#fdf9f7;}
.lead-link{cursor:pointer;font-weight:600;color:${p.mauvedark};text-decoration:underline;text-decoration-color:transparent;text-underline-offset:2px;transition:all 0.15s;}
.lead-link:hover{text-decoration-color:${p.mauvedark};color:${p.text};}

/* PILLS */
.stage-pill{display:inline-block;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:500;letter-spacing:0.04em;}
.s-Discovery{background:#f0edf9;color:#6b56b0;}
.s-Validation{background:#e8f0fc;color:#3461b0;}
.s-Proposal{background:#fdf3e0;color:#9a6a1e;}
.s-Negotiation{background:#fff0e8;color:#a05020;}
.s-Pilot{background:#e8f4ef;color:#2d7a5e;}
.s-Closed.Won,.s-Closed-Won{background:#e4f2eb;color:#1d6b45;}
.s-Closed.Lost,.s-Closed-Lost{background:#fde8e8;color:#8b3030;}
.s-Outreach{background:#f5f0fa;color:#7050a0;}
.s-Target{background:#f5f5f5;color:#606060;}

.result-pill{display:inline-block;padding:2px 8px;border-radius:12px;font-size:10px;}
.r-Confirmed{background:#e4f2eb;color:#1d6b45;}
.r-Weak.signal{background:#fdf3e0;color:#9a6a1e;}
.r-Rejected{background:#fde8e8;color:#8b3030;}

.decision-pill{display:inline-block;padding:2px 8px;border-radius:12px;font-size:10px;}
.d-Iterate{background:#e8f0fc;color:#3461b0;}
.d-Pivot{background:#fde8e8;color:#8b3030;}
.d-Double-down{background:#e4f2eb;color:#1d6b45;}

/* HEALTH */
.health-dot{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:500;}
.dot{width:7px;height:7px;border-radius:50%;display:inline-block;flex-shrink:0;}

/* URGENCY */
.urgency-bar{display:flex;gap:2px;}
.u-dot{width:8px;height:8px;border-radius:2px;}

/* EDITABLE */
.editable{cursor:pointer;border-radius:4px;padding:2px 4px;min-width:20px;display:inline-block;}
.editable:hover{background:${p.blush};}
.cell-input,.cell-select{font-family:'DM Sans',sans-serif;font-size:12.5px;border:1px solid ${p.gold};border-radius:4px;padding:3px 6px;background:${p.white};color:${p.text};outline:none;width:100%;}

/* NOTES PARSER */
.parser{background:linear-gradient(135deg,${p.blush},${p.champagne});border:1px solid ${p.border};border-radius:14px;padding:20px;margin-bottom:24px;}
.parser textarea,.parser input{font-family:'DM Sans',sans-serif;font-size:12.5px;border:1px solid ${p.border};border-radius:8px;padding:10px 12px;background:${p.white};color:${p.text};outline:none;width:100%;resize:vertical;}
.parser textarea:focus,.parser input:focus{border-color:${p.gold};}
.parsed-result{margin-top:10px;background:${p.white};border-radius:8px;padding:12px;font-size:12px;border:1px solid ${p.border};line-height:1.8;}

/* MODAL */
.backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.28);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px);}
.modal{background:${p.white};border-radius:18px;padding:28px;width:620px;max-height:85vh;overflow-y:auto;border:1px solid ${p.border};box-shadow:0 20px 60px rgba(58,46,43,0.15);}
.modal::-webkit-scrollbar{width:4px;}
.modal::-webkit-scrollbar-thumb{background:${p.champagne};border-radius:4px;}
.modal-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:600;margin-bottom:20px;}
.form-group{display:flex;flex-direction:column;gap:5px;margin-bottom:14px;}
.form-label{font-size:9.5px;letter-spacing:0.1em;text-transform:uppercase;color:${p.textLight};font-weight:600;}
.form-input,.form-select,.form-textarea{font-family:'DM Sans',sans-serif;font-size:12.5px;border:1px solid ${p.border};border-radius:8px;padding:9px 12px;background:${p.cream};color:${p.text};outline:none;width:100%;}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:${p.gold};background:${p.white};}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;}
.modal-footer{display:flex;gap:10px;justify-content:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid ${p.border};}
.section-divider{font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:${p.mauve};margin:18px 0 12px;padding-bottom:8px;border-bottom:1px solid ${p.border};font-weight:600;}

/* PROFILE PAGE */
.profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;}
.profile-card{background:${p.white};border:1px solid ${p.border};border-radius:14px;padding:20px;}
.profile-card.wide{grid-column:span 2;}
.profile-card-title{font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:${p.textLight};font-weight:600;margin-bottom:14px;display:flex;align-items:center;gap:6px;}
.profile-field{display:flex;flex-direction:column;gap:2px;margin-bottom:12px;}
.profile-field-label{font-size:10px;color:${p.textLight};text-transform:uppercase;letter-spacing:0.08em;}
.profile-field-value{font-size:13px;color:${p.text};}
.profile-field-value.empty{color:${p.textLight};font-style:italic;}
.notes-area{font-family:'DM Sans',sans-serif;font-size:13px;border:1px solid ${p.border};border-radius:10px;padding:14px;background:${p.cream};color:${p.text};width:100%;min-height:160px;resize:vertical;line-height:1.7;outline:none;}
.notes-area:focus{border-color:${p.gold};background:${p.white};}
.tag{display:inline-block;padding:2px 10px;border-radius:20px;font-size:10px;background:${p.blush};color:${p.mauvedark};border:1px solid ${p.border};margin:2px;}
.tag-input{font-family:'DM Sans',sans-serif;font-size:12px;border:1px solid ${p.border};border-radius:6px;padding:4px 10px;background:${p.cream};color:${p.text};outline:none;width:120px;}
.tag-input:focus{border-color:${p.gold};}
.profile-hero{background:linear-gradient(135deg,${p.sidebar} 0%,${p.sidebarAccent} 100%);border-radius:14px;padding:28px;color:${p.champagne};margin-bottom:20px;display:flex;align-items:flex-start;justify-content:space-between;gap:20px;}
.hero-name{font-family:'Playfair Display',serif;font-size:26px;font-weight:600;color:${p.champagne};}
.hero-title{font-size:13px;color:${p.mauve};margin-top:3px;}
.hero-company{font-size:15px;color:${p.champagne};margin-top:6px;font-weight:500;}
.hero-badges{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}
.hero-badge{padding:4px 12px;border-radius:20px;font-size:10px;font-weight:500;letter-spacing:0.06em;background:rgba(255,255,255,0.1);color:${p.champagne};border:1px solid rgba(255,255,255,0.2);}
.hero-right{text-align:right;min-width:180px;}
.hero-deal{font-family:'Playfair Display',serif;font-size:32px;color:${p.gold};}
.hero-deal-label{font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${p.mauve};}
.hero-health{margin-top:10px;}

/* METRICS */
.metrics-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px;margin-bottom:28px;}
.metric-card{background:${p.white};border:1px solid ${p.border};border-radius:14px;padding:20px;}
.metric-card .lbl{font-size:9.5px;text-transform:uppercase;letter-spacing:0.12em;color:${p.textLight};margin-bottom:7px;font-weight:600;}
.metric-card .val{font-family:'Playfair Display',serif;font-size:32px;font-weight:600;color:${p.text};}
.metric-card .sub{font-size:11px;color:${p.textLight};margin-top:3px;}

/* TABS (profile) */
.tabs{display:flex;gap:2px;border-bottom:1px solid ${p.border};margin-bottom:20px;}
.tab{padding:9px 16px;font-size:12.5px;cursor:pointer;color:${p.textLight};border-bottom:2px solid transparent;transition:all 0.15s;margin-bottom:-1px;}
.tab.active{color:${p.mauvedark};border-bottom-color:${p.gold};font-weight:500;}
.tab:hover{color:${p.text};}

/* EXPERIMENT TRACKER specific */
.exp-strength{font-size:10.5px;font-weight:500;}
.counter-ctrl{display:flex;align-items:center;gap:6px;}
.counter-btn{border:1px solid;background:none;border-radius:4px;cursor:pointer;font-size:11px;padding:1px 7px;transition:all 0.15s;}

/* FOOTER */
.page-footer{margin-top:40px;padding-top:20px;border-top:1px solid ${p.border};display:flex;justify-content:space-between;align-items:center;}
.next-exp{font-family:'Playfair Display',serif;font-style:italic;font-size:12px;color:${p.textLight};}

/* CONVERSATIONS / TIMELINE */
.range-tabs{display:flex;gap:4px;margin-bottom:24px;}
.range-tab{padding:7px 18px;border-radius:20px;font-size:12px;cursor:pointer;border:1px solid ${p.border};background:${p.white};color:${p.textLight};transition:all 0.15s;font-weight:500;}
.range-tab.active{background:${p.gold};border-color:${p.gold};color:#fff;}
.range-tab:hover:not(.active){border-color:${p.mauve};color:${p.text};}
.convo-summary-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px;}
.convo-sum-card{background:${p.white};border:1px solid ${p.border};border-radius:10px;padding:14px 16px;position:relative;overflow:hidden;}
.convo-sum-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${p.gold},${p.mauve});}
.convo-sum-lbl{font-size:9px;text-transform:uppercase;letter-spacing:0.12em;color:${p.textLight};margin-bottom:5px;font-weight:600;}
.convo-sum-val{font-family:'Playfair Display',serif;font-size:26px;font-weight:600;color:${p.text};}
.convo-sum-sub{font-size:10px;color:${p.textLight};margin-top:2px;}
.touch-card{background:${p.white};border:1px solid ${p.border};border-radius:12px;padding:15px 18px;display:flex;gap:14px;align-items:flex-start;transition:all 0.15s;margin-bottom:8px;}
.touch-card:hover{border-color:${p.champagne};box-shadow:0 2px 12px rgba(58,46,43,0.06);}
.touch-time-col{min-width:68px;text-align:right;flex-shrink:0;padding-top:1px;}
.touch-time{font-family:'Playfair Display',serif;font-size:14px;font-weight:600;color:${p.text};}
.touch-date-str{font-size:9.5px;color:${p.textLight};}
.touch-divider{width:1px;background:${p.border};align-self:stretch;flex-shrink:0;}
.touch-type-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;margin-top:4px;}
.touch-body{flex:1;}
.touch-lead-name{font-weight:600;font-size:13px;color:${p.mauvedark};cursor:pointer;transition:color 0.15s;}
.touch-lead-name:hover{color:${p.text};}
.touch-company{font-size:11px;color:${p.textLight};margin-top:1px;}
.touch-notes{font-size:12px;color:${p.text};margin-top:6px;line-height:1.55;}
.touch-meta{display:flex;gap:8px;margin-top:7px;flex-wrap:wrap;align-items:center;}
.touch-badge{font-size:10px;padding:2px 9px;border-radius:10px;background:${p.blush};color:${p.mauvedark};border:1px solid ${p.border};}
.timeline-group-label{font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:${p.textLight};font-weight:600;margin:22px 0 12px;display:flex;align-items:center;gap:10px;}
.timeline-group-label::after{content:'';flex:1;height:1px;background:${p.border};}
.log-touch-form{background:linear-gradient(135deg,${p.blush},${p.champagne});border:1px solid ${p.border};border-radius:14px;padding:18px 20px;margin-bottom:24px;}
.log-touch-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:10px;margin-bottom:10px;}
.empty-state{text-align:center;padding:60px 20px;}
.empty-icon{font-size:32px;opacity:0.3;margin-bottom:10px;}
.empty-msg{font-family:'Playfair Display',serif;font-size:15px;color:${p.textLight};}
.empty-sub{font-size:12px;color:${p.textLight};margin-top:4px;opacity:0.7;}

/* ── MOBILE ──────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .dash{flex-direction:column;height:100dvh;}
  .sidebar{display:none;}
  .main{flex:1;min-height:0;padding-bottom:64px;}
  .mobile-nav{display:flex;position:fixed;bottom:0;left:0;right:0;z-index:100;background:#2e2420;border-top:1px solid #3d2f2a;height:64px;align-items:stretch;}
  .mobile-nav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;color:#c4a7a0;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;font-weight:500;transition:all 0.15s;border:none;background:none;padding:8px 4px;}
  .mobile-nav-item.active{color:#c9a96e;}
  .mobile-nav-item .m-icon{font-size:20px;line-height:1;}
  .topbar{padding:0 16px;height:52px;}
  .topbar-title{font-size:16px;}
  .topbar-date{display:none;}
  .kpi-bar{padding:10px 14px;gap:10px;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
  .kpi-bar::-webkit-scrollbar{display:none;}
  .kpi-card{min-width:120px;flex-shrink:0;padding:10px 12px;}
  .kpi-val{font-size:20px;}
  .kpi-lbl{font-size:8px;}
  .kpi-sub{font-size:9px;}
  .content{padding:14px 12px 20px;}
  .desktop-only{display:none !important;}
  .mobile-cards{display:flex;flex-direction:column;gap:10px;}
  .mobile-card{background:#fff;border:1px solid #e0d0c8;border-radius:14px;padding:16px;cursor:pointer;transition:background 0.1s;-webkit-tap-highlight-color:transparent;}
  .mobile-card:active{background:#f2e4dc;}
  .mobile-card-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;}
  .mobile-card-name{font-weight:600;font-size:15px;color:#9d7c78;}
  .mobile-card-company{font-size:12px;color:#7a6460;margin-top:1px;}
  .mobile-card-quote{font-size:12px;color:#3a2e2b;font-style:italic;margin:8px 0;line-height:1.45;border-left:2px solid #c9a96e;padding-left:8px;}
  .mobile-card-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;align-items:center;}
  .mobile-card-leak{font-size:10px;color:#c97070;font-weight:700;margin-top:6px;}
  .alerts{gap:6px;margin-bottom:14px;}
  .alert{font-size:11px;padding:8px 12px;}
  .parser{padding:14px;}
  .parser textarea{min-height:80px;}
  .section-hdr{flex-direction:column;align-items:flex-start;gap:10px;margin-bottom:12px;}
  .controls{width:100%;}
  .search-input{width:100%;}
  .filter-select{width:100%;}
  .metrics-grid{grid-template-columns:1fr 1fr;gap:10px;}
  .metric-card{padding:14px;}
  .metric-card .val{font-size:26px;}
  .convo-summary-bar{grid-template-columns:1fr 1fr;gap:10px;}
  .range-tabs{overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px;}
  .range-tab{white-space:nowrap;flex-shrink:0;}
  .touch-card{padding:12px 14px;gap:10px;}
  .touch-time-col{min-width:52px;}
  .profile-hero{flex-direction:column;gap:12px;padding:20px;}
  .hero-name{font-size:20px;}
  .hero-deal{font-size:24px;}
  .hero-right{text-align:left;min-width:unset;}
  .profile-grid{grid-template-columns:1fr;}
  .profile-card.wide{grid-column:span 1;}
  .log-touch-form{padding:14px;}
  .log-touch-grid{grid-template-columns:1fr 1fr;gap:8px;}
  .form-row{grid-template-columns:1fr;}
  .form-row-3{grid-template-columns:1fr 1fr;gap:8px;}
  .backdrop{align-items:flex-end;}
  .modal{width:100%;border-radius:20px 20px 0 0;max-height:90vh;padding:22px 20px;}
  .tabs{overflow-x:auto;flex-wrap:nowrap;padding-bottom:2px;}
  .tab{white-space:nowrap;flex-shrink:0;padding:8px 14px;font-size:12px;}
  .hyp-table-wrap{display:none;}
  .hyp-mobile{display:flex;flex-direction:column;gap:10px;}
  .hyp-card{background:#fff;border:1px solid #e0d0c8;border-radius:14px;padding:16px;}
  .hyp-card-id{font-size:10px;font-weight:700;color:#9d7c78;margin-bottom:4px;}
  .hyp-card-statement{font-size:13px;font-weight:500;margin-bottom:10px;line-height:1.4;}
  .hyp-card-row{display:flex;justify-content:space-between;align-items:center;margin-top:10px;}
  .insights-table-wrap{display:none;}
  .insights-mobile{display:flex;flex-direction:column;gap:10px;}
  .insight-card{background:#fff;border:1px solid #e0d0c8;border-radius:14px;padding:16px;}
  .insight-card-theme{font-size:14px;font-weight:600;margin-bottom:4px;}
  .insight-card-quote{font-size:12px;color:#7a6460;font-style:italic;margin-bottom:10px;line-height:1.4;}
  .page-footer{flex-direction:column;gap:10px;align-items:flex-start;}
  .next-exp{font-size:11px;}
  .table-wrap{border-radius:10px;overflow-x:auto;}
  table{min-width:600px;}
}
@media (min-width:769px) {
  .mobile-nav{display:none;}
  .mobile-cards{display:none;}
  .hyp-mobile{display:none;}
  .insights-mobile{display:none;}
}
`;

// ─── TOUCH TYPE COLORS ────────────────────────────────────────────────────────
const TOUCH_COLORS = {
  "Call": "#7eb59c",
  "Email": "#c9a96e",
  "LinkedIn": "#6b8fc9",
  "Meeting": "#c4a7a0",
  "Event": "#9b7ec8",
  "Intro": "#c97070",
  "Demo": "#4aab8a",
  "Follow-up": "#e0a060",
  "Other": "#aaaaaa",
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function UrgencyBar({ value }) {
  return (
    <div className="urgency-bar">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="u-dot" style={{
          background: i <= value
            ? i >= 4 ? p.danger : i >= 3 ? p.warn : p.success
            : p.border
        }} />
      ))}
    </div>
  );
}

function StagePill({ stage }) {
  const cls = "stage-pill s-" + (stage || "").replace(/\s+/g, "-");
  return <span className={cls}>{stage}</span>;
}

function HealthBadge({ score }) {
  const hl = healthLabel(score);
  return (
    <span className="health-dot">
      <span className="dot" style={{ background: hl.color }} />
      <span style={{ color: hl.color, fontWeight: 500 }}>{hl.label} {score}</span>
    </span>
  );
}

function EditableCell({ value, onChange, type = "text", options, style }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? "");
  useEffect(() => setVal(value ?? ""), [value]);
  const commit = () => { setEditing(false); if (String(val) !== String(value)) onChange(val); };
  if (!editing) return (
    <span className="editable" style={style} onClick={() => setEditing(true)}>
      {value || <span style={{ color: p.textLight, fontStyle: "italic" }}>—</span>}
    </span>
  );
  if (type === "select") return (
    <select className="cell-select" value={val} onChange={e => setVal(e.target.value)} onBlur={commit} autoFocus>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  return (
    <input className="cell-input" type={type} value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={commit} onKeyDown={e => e.key === "Enter" && commit()} autoFocus />
  );
}

// ─── LEAD PROFILE ────────────────────────────────────────────────────────────

function LeadProfile({ lead, data, setData, onBack }) {
  const [tab, setTab] = useState("overview");
  const [localNotes, setLocalNotes] = useState(lead.callNotes || "");
  const [localTranscript, setLocalTranscript] = useState(lead.transcription || "");
  const [tagInput, setTagInput] = useState("");

  function update(field, value) {
    setData(d => ({
      ...d,
      pipeline: d.pipeline.map(l => l.id === lead.id ? { ...l, [field]: value } : l)
    }));
  }

  function saveNotes() { update("callNotes", localNotes); }
  function saveTranscript() { update("transcription", localTranscript); }

  function addTag(e) {
    if (e.key === "Enter" && tagInput.trim()) {
      const tags = [...(lead.tags || []), tagInput.trim().toLowerCase()];
      update("tags", tags);
      setTagInput("");
    }
  }

  function removeTag(t) {
    update("tags", (lead.tags || []).filter(x => x !== t));
  }

  const score = healthScore(lead);
  const hl = healthLabel(score);
  const linkedH = data.hypotheses.find(h => h.id === lead.hypothesisTested);

  const PF = ({ label, field, type = "text", options }) => (
    <div className="profile-field">
      <div className="profile-field-label">{label}</div>
      <div className="profile-field-value" style={!lead[field] ? { color: p.textLight, fontStyle: "italic" } : {}}>
        <EditableCell value={lead[field] || ""} onChange={v => update(field, v)} type={type} options={options} />
      </div>
    </div>
  );

  return (
    <div>
      {/* HERO */}
      <div className="profile-hero">
        <div>
          <div className="hero-name">{lead.leadName}</div>
          <div className="hero-title">{lead.contactTitle || "—"}</div>
          <div className="hero-company">{lead.company} {lead.website ? <span style={{ fontSize: 12, opacity: 0.6 }}>· {lead.website}</span> : ""}</div>
          <div className="hero-badges">
            <span className="hero-badge">{lead.sector}</span>
            <span className="hero-badge">{lead.subSegment}</span>
            <span className="hero-badge">Source: {lead.sourceOfContact}</span>
            {lead.budgetOwner === "Yes" && <span className="hero-badge" style={{ background: "rgba(126,181,156,0.2)", borderColor: "rgba(126,181,156,0.4)" }}>✓ Budget Owner</span>}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
            {(lead.tags || []).map(t => <span key={t} className="tag" style={{ background: "rgba(255,255,255,0.08)", color: p.mauve, borderColor: "rgba(255,255,255,0.15)", cursor: "pointer" }} onClick={() => removeTag(t)}>{t} ×</span>)}
            <input className="tag-input" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: p.champagne }} placeholder="+ tag" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} />
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-deal-label">Deal Potential</div>
          <div className="hero-deal">${(lead.dealSize || 0).toLocaleString()}</div>
          <div style={{ fontSize: 11, color: p.mauve, marginTop: 2 }}>{lead.probability}% probability</div>
          <div className="hero-health" style={{ marginTop: 12 }}>
            <span className="health-dot">
              <span className="dot" style={{ background: hl.color }} />
              <span style={{ color: hl.color, fontWeight: 600, fontSize: 12 }}>{hl.label} · {score}/100</span>
            </span>
          </div>
          <div style={{ marginTop: 8 }}>
            <StagePill stage={lead.stage} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        {["overview", "discovery", "experiment", "notes", "transcription", "history"].map(t => (
          <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-card-title">📋 Organization Info</div>
            <PF label="Organization Name" field="company" />
            <PF label="Website" field="website" />
            <PF label="Sector" field="sector" type="select" options={["Commercial","Gov","Municipality","Nonprofit","Health Tech"]} />
            <PF label="Sub-Segment" field="subSegment" />
            <PF label="Org Size (employees)" field="orgSize" />
            <PF label="Priority Score (1–5)" field="priorityScore" type="number" />
          </div>
          <div className="profile-card">
            <div className="profile-card-title">👤 Contact Details</div>
            <PF label="Contact Name" field="leadName" />
            <PF label="Title" field="contactTitle" />
            <PF label="Email" field="email" type="email" />
            <PF label="Phone" field="phone" />
            <PF label="LinkedIn URL" field="linkedin" />
            <PF label="Source of Contact" field="sourceOfContact" type="select" options={["LinkedIn","Referral","Conference","Website","Cold List","Event","Intro"]} />
          </div>
          <div className="profile-card">
            <div className="profile-card-title">📅 Outreach Execution</div>
            <PF label="Initial Contact Date" field="initialContactDate" type="date" />
            <PF label="Contact Method" field="contactMethod" type="select" options={["Email","LinkedIn","Intro","Call","Event","Referral"]} />
            <PF label="Follow-Up Date" field="followUpDate" type="date" />
            <PF label="Last Touch Date" field="lastTouch" type="date" />
            <PF label="Response Status" field="responseStatus" type="select" options={["No response","Engaged","Meeting scheduled","Discovery complete","Opportunity active","Closed-lost","Closed-won"]} />
          </div>
          <div className="profile-card">
            <div className="profile-card-title">💼 Opportunity Health</div>
            <PF label="Deal Size Estimate ($)" field="dealSize" type="number" />
            <PF label="Probability (%)" field="probability" type="number" />
            <PF label="Stage" field="stage" type="select" options={["Target identified","Outreach started","Discovery","Validation","Proposal","Negotiation","Pilot","Closed Won","Closed Lost"]} />
            <PF label="Pipeline Stage" field="stage" type="select" options={["Target identified","Outreach started","Discovery","Validation","Proposal","Negotiation","Pilot","Closed Won","Closed Lost"]} />
            <PF label="Next Action" field="nextAction" />
            <PF label="Next Action Date" field="nextActionDate" type="date" />
            <PF label="Owner" field="owner" />
          </div>
        </div>
      )}

      {/* DISCOVERY TAB */}
      {tab === "discovery" && (
        <div className="profile-grid">
          <div className="profile-card wide">
            <div className="profile-card-title">🔍 Customer Discovery Learning</div>
            <div className="form-row">
              <div><PF label="Problem They Identified" field="problemIdentified" /></div>
              <div><PF label="Current Solution" field="currentSolution" /></div>
            </div>
            <div className="form-row-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><PF label="Urgency Level (1–5)" field="urgency" type="number" /></div>
              <div><PF label="Budget Owner Identified?" field="budgetOwner" type="select" options={["Yes","No","Unknown"]} /></div>
              <div><PF label="Buying Timeline" field="buyingTimeline" /></div>
            </div>
            <div className="profile-field">
              <div className="profile-field-label">Key Pain Quote (verbatim)</div>
              <div style={{ background: p.blush, borderLeft: `3px solid ${p.gold}`, padding: "10px 14px", borderRadius: "0 8px 8px 0", fontStyle: "italic", fontSize: 13, color: p.text, margin: "4px 0" }}>
                <EditableCell value={lead.painQuote || ""} onChange={v => update("painQuote", v)} />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: 12 }}>
              <div><PF label="Objections" field="objections" /></div>
              <div><PF label="Suggested Features" field="suggestedFeatures" /></div>
            </div>
            <div style={{ marginTop: 4 }}>
              <PF label="Referral Provided?" field="referralProvided" type="select" options={["Yes","No"]} />
            </div>
          </div>
        </div>
      )}

      {/* EXPERIMENT TAB */}
      {tab === "experiment" && (
        <div className="profile-grid">
          <div className="profile-card wide">
            <div className="profile-card-title">🧪 Experiment Tracking</div>
            <div className="form-row">
              <div>
                <div className="profile-field-label" style={{ marginBottom: 6 }}>Linked Hypothesis</div>
                <select className="form-select" style={{ marginBottom: 12 }} value={lead.hypothesisTested || ""} onChange={e => update("hypothesisTested", e.target.value)}>
                  <option value="">None</option>
                  {data.hypotheses.map(h => <option key={h.id} value={h.id}>{h.id}: {h.statement.slice(0, 50)}…</option>)}
                </select>
                {linkedH && (
                  <div style={{ background: p.cream, borderRadius: 8, padding: 10, fontSize: 12, border: `1px solid ${p.border}` }}>
                    <strong>{linkedH.id}</strong> — {linkedH.statement}
                    <div style={{ marginTop: 4, color: p.textLight }}>Segment: {linkedH.segment} · Status: {linkedH.status}</div>
                  </div>
                )}
              </div>
              <div>
                <PF label="Value Proposition Tested" field="valuePropTested" />
                <PF label="Pricing Tested" field="pricingTested" />
                <PF label="Demo Version Used" field="demoVersion" />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: 8 }}>
              <div><PF label="Experiment Result" field="experimentResult" type="select" options={["Confirmed","Weak signal","Rejected"]} /></div>
              <div><PF label="Confidence Score (1–5)" field="confidenceScore" type="number" /></div>
            </div>
          </div>
        </div>
      )}

      {/* NOTES TAB */}
      {tab === "notes" && (
        <div>
          <div className="profile-card" style={{ background: p.white, border: `1px solid ${p.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
            <div className="profile-card-title">📝 Call Notes & Context</div>
            <div style={{ fontSize: 11, color: p.textLight, marginBottom: 10 }}>Paste raw notes, summaries, or anything from your conversation. Click Save when done.</div>
            <textarea
              className="notes-area"
              value={localNotes}
              onChange={e => setLocalNotes(e.target.value)}
              placeholder="Paste your call notes, follow-up context, observations, anything about this lead…"
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button className="btn btn-primary btn-sm" onClick={saveNotes}>Save Notes</button>
            </div>
          </div>
        </div>
      )}

      {/* TRANSCRIPTION TAB */}
      {tab === "transcription" && (
        <div>
          <div className="profile-card" style={{ background: p.white, border: `1px solid ${p.border}`, borderRadius: 14, padding: 20 }}>
            <div className="profile-card-title">🎙 Full Transcription</div>
            <div style={{ fontSize: 11, color: p.textLight, marginBottom: 10 }}>Paste the full transcript from your call recording or AI transcription tool.</div>
            <textarea
              className="notes-area"
              style={{ minHeight: 300, fontFamily: "monospace", fontSize: 12 }}
              value={localTranscript}
              onChange={e => setLocalTranscript(e.target.value)}
              placeholder="TRANSCRIPT — [Date]\n\nPaste full call transcript here…"
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button className="btn btn-primary btn-sm" onClick={saveTranscript}>Save Transcript</button>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {tab === "history" && (
        <ProfileHistory lead={lead} setData={setData} />
      )}
    </div>
  );
}

function ProfileHistory({ lead, setData }) {
  const [form, setForm] = useState({ date: today, time: "", type: "Call", duration: "", notes: "" });
  const touches = [...(lead.touchLog || [])].sort((a, b) => {
    const da = new Date(a.date + (a.time ? "T" + a.time : ""));
    const db = new Date(b.date + (b.time ? "T" + b.time : ""));
    return db - da;
  });

  function addTouch() {
    if (!form.date) return;
    const touch = { date: form.date, time: form.time, type: form.type, duration: form.duration, notes: form.notes };
    setData(d => ({
      ...d,
      pipeline: d.pipeline.map(l => l.id === lead.id
        ? { ...l, touchLog: [...(l.touchLog || []), touch], lastTouch: form.date }
        : l
      )
    }));
    setForm(f => ({ ...f, notes: "", time: "", duration: "" }));
  }

  function deleteTouch(idx) {
    const newLog = (lead.touchLog || []).filter((_, i) => i !== idx);
    setData(d => ({
      ...d,
      pipeline: d.pipeline.map(l => l.id === lead.id ? { ...l, touchLog: newLog } : l)
    }));
  }

  const totalMin = touches.reduce((a, t) => {
    const m = parseInt((t.duration || "").replace(/[^\d]/g, ""));
    return a + (isNaN(m) ? 0 : m);
  }, 0);

  return (
    <div>
      {/* Quick stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Total Touchpoints", val: touches.length },
          { label: "First Contact", val: touches.length ? new Date(touches[touches.length-1].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" },
          { label: "Last Contact", val: touches.length ? new Date(touches[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" },
          { label: "Time Invested", val: totalMin > 0 ? `${totalMin} min` : "—" },
        ].map(s => (
          <div key={s.label} style={{ background: p.white, border: `1px solid ${p.border}`, borderRadius: 10, padding: "12px 16px", minWidth: 130 }}>
            <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: p.textLight, marginBottom: 4, fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Log form */}
      <div className="log-touch-form" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Log a Touchpoint</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Time</label>
            <input className="form-input" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {Object.keys(TOUCH_COLORS).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Duration</label>
            <input className="form-input" placeholder="30 min" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="form-label">Notes</label>
            <input className="form-input" placeholder="Key takeaway, outcome, next step…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <button className="btn btn-primary btn-sm" style={{ whiteSpace: "nowrap" }} onClick={addTouch}>+ Log</button>
        </div>
      </div>

      {/* Timeline */}
      {touches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◌</div>
          <div className="empty-msg">No touchpoints logged yet</div>
          <div className="empty-sub">Every call, email, and DM with {lead.leadName} goes here.</div>
        </div>
      ) : touches.map((t, i) => (
        <div key={i} className="touch-card" style={{ position: "relative" }}>
          <div className="touch-time-col">
            {t.time && <div className="touch-time">{t.time}</div>}
            <div className="touch-date-str">{new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}</div>
          </div>
          <div className="touch-divider" />
          <div className="touch-type-dot" style={{ background: TOUCH_COLORS[t.type] || p.mauve }} />
          <div className="touch-body">
            <div className="touch-meta" style={{ marginTop: 0, marginBottom: 5 }}>
              <span className="touch-badge" style={{ background: (TOUCH_COLORS[t.type] || p.mauve) + "22", color: TOUCH_COLORS[t.type] || p.mauvedark, borderColor: (TOUCH_COLORS[t.type] || p.mauve) + "44" }}>{t.type}</span>
              {t.duration && <span className="touch-badge">⏱ {t.duration}</span>}
            </div>
            {t.notes && <div className="touch-notes">{t.notes}</div>}
          </div>
          <button onClick={() => deleteTouch((lead.touchLog||[]).findIndex((x,xi) => x.date === t.date && x.notes === t.notes && xi === (lead.touchLog||[]).length - 1 - i))}
            style={{ position: "absolute", top: 10, right: 12, background: "none", border: "none", cursor: "pointer", color: p.textLight, fontSize: 12, opacity: 0.4 }}
            title="Delete">×</button>
        </div>
      ))}
    </div>
  );
}

// ─── PIPELINE VIEW ────────────────────────────────────────────────────────────
function PipelineView({ data, setData, onOpenLead }) {
  const [search, setSearch] = useState("");
  const [segFilter, setSegFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [parsed, setParsed] = useState(null);

  const segs = ["All", ...new Set(data.pipeline.map(l => l.subSegment || l.sector))];
  const stages = ["All", "Target identified", "Outreach started", "Discovery", "Validation", "Proposal", "Negotiation", "Pilot", "Closed Won", "Closed Lost"];

  const filtered = data.pipeline.filter(l => {
    const q = search.toLowerCase();
    const match = l.leadName.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || (l.painQuote || "").toLowerCase().includes(q);
    const seg = segFilter === "All" || l.subSegment === segFilter || l.sector === segFilter;
    const st = stageFilter === "All" || l.stage === stageFilter;
    return match && seg && st;
  });

  const leaks = data.pipeline.filter(isPipelineLeak);
  const stale = data.pipeline.filter(isStale);
  const patterns = detectPatterns(data.pipeline);

  function updateLead(id, field, value) {
    setData(d => ({ ...d, pipeline: d.pipeline.map(l => l.id === id ? { ...l, [field]: value } : l) }));
  }

  function addLead(form) {
    const id = "L" + String(data.pipeline.length + 1).padStart(3, "0");
    setData(d => ({ ...d, pipeline: [...d.pipeline, { ...form, id, lastTouch: today, tags: [] }] }));
    setShowModal(false);
  }

  function parseNotes() {
    const raw = notes.toLowerCase();
    const urgency = raw.includes("urgent") || raw.includes("critical") ? 5 : raw.includes("soon") || raw.includes("this week") ? 4 : 3;
    const sector = raw.includes("agency") ? "Creative Agencies" : raw.includes("health") ? "Health Tech" : raw.includes("gov") || raw.includes("municipality") ? "Gov" : "Commercial";
    const quoteMatch = notes.match(/[""]([^""]+)[""]/);
    const painQuote = quoteMatch ? quoteMatch[1] : notes.slice(0, 100) + "…";
    const nameMatch = notes.match(/(?:met with|call with|spoke to|talked to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    const compMatch = notes.match(/(?:at|from|@)\s+([A-Z][A-Za-z\s]+?)(?:\.|,|\n|$)/);
    setParsed({ urgency, sector, painQuote, leadName: nameMatch ? nameMatch[1] : "", company: compMatch ? compMatch[1].trim() : "" });
  }

  return (
    <div>
      {/* ALERTS */}
      {(leaks.length > 0 || stale.length > 0 || patterns.length > 0) && (
        <div className="alerts">
          {leaks.map(l => (
            <div key={l.id} className="alert alert-danger">
              🚨 <div><strong>PIPELINE LEAK</strong> — <span className="lead-link" onClick={() => onOpenLead(l.id)}>{l.leadName}</span> ({l.company}) has no Next Action Date set.</div>
            </div>
          ))}
          {stale.map(l => (
            <div key={l.id} className="alert alert-warn">
              ⚠️ <div><strong>STALE</strong> — <span className="lead-link" onClick={() => onOpenLead(l.id)}>{l.leadName}</span> not contacted in {daysDiff(l.lastTouch)} days. Stage: {l.stage}</div>
            </div>
          ))}
          {patterns.map(pat => (
            <div key={pat.segment} className="alert alert-pattern">
              🔍 <div><strong>PATTERN DETECTED:</strong> {pat.count} leads in <em>{pat.segment}</em> share similar pain. Consider strengthening your core hypothesis for this segment.</div>
            </div>
          ))}
        </div>
      )}

      {/* NOTES PARSER */}
      <div className="parser">
        <div className="section-hdr" style={{ marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600 }}>✦ Paste Call Notes</div>
            <div style={{ fontSize: 11, color: p.textLight, marginTop: 2 }}>Auto-extract lead name, company, pain, urgency & segment</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={parseNotes}>Parse & Extract</button>
        </div>
        <textarea
          placeholder={'Paste raw call notes here…\n\n"Met with Sarah at Bloom Studio. Super urgent — she said \'reporting takes 12 hours a week.\' Needs a demo by Friday."'}
          value={notes} onChange={e => setNotes(e.target.value)}
          rows={4}
        />
        {parsed && (
          <div className="parsed-result">
            <strong>Extracted:</strong> {parsed.leadName && <><em>Name:</em> {parsed.leadName} · </>}<em>Company:</em> {parsed.company || "—"} · <em>Urgency:</em> {parsed.urgency}/5 · <em>Sector:</em> {parsed.sector}<br />
            <em>Pain:</em> "{parsed.painQuote}"
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={() => { setShowModal({ prefill: parsed }); setParsed(null); setNotes(""); }}>Add to Pipeline →</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setParsed(null)}>Dismiss</button>
            </div>
          </div>
        )}
      </div>

      {/* TABLE CONTROLS */}
      <div className="section-hdr">
        <div className="section-title">Pipeline Tracker</div>
        <div className="controls">
          <input className="search-input" placeholder="Search leads, pain, company…" value={search} onChange={e => setSearch(e.target.value)} />
          <select className="filter-select" value={segFilter} onChange={e => setSegFilter(e.target.value)}>
            {segs.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="filter-select" value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
            {stages.map(s => <option key={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => setShowModal({})}>+ Add Lead</button>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="mobile-cards">
        {filtered.map(l => {
          const score = healthScore(l);
          const hl = healthLabel(score);
          const leak = isPipelineLeak(l);
          return (
            <div key={l.id} className="mobile-card" onClick={() => onOpenLead(l.id)}
              style={{ borderLeft: `3px solid ${leak ? p.danger : hl.color}` }}>
              <div className="mobile-card-top">
                <div>
                  <div className="mobile-card-name">{l.leadName}</div>
                  <div className="mobile-card-company">{l.company} · {l.subSegment}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <StagePill stage={l.stage} />
                  <div style={{ fontSize:11, color:p.textLight, marginTop:4 }}>${(l.dealSize||0).toLocaleString()}</div>
                </div>
              </div>
              {l.painQuote && <div className="mobile-card-quote">"{l.painQuote.slice(0,100)}{l.painQuote.length>100?"…":""}"</div>}
              <div className="mobile-card-meta">
                <UrgencyBar value={l.urgency} />
                <span style={{ fontSize:10, color: l.budgetOwner==="Yes" ? p.success : p.textLight }}>
                  {l.budgetOwner==="Yes" ? "✓ Budget" : "Budget?"}
                </span>
                {l.nextActionDate && <span style={{ fontSize:10, color:p.textLight }}>Next: {l.nextActionDate}</span>}
              </div>
              {leak && <div className="mobile-card-leak">⚡ PIPELINE LEAK — no next action date</div>}
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE */}
      <div className="table-wrap desktop-only">
        <table>
          <thead>
            <tr>
              <th>Lead</th><th>Company</th><th>Sub-Segment</th><th>Stage</th>
              <th>Urgency</th><th>Pain Quote</th><th>Budget Owner</th>
              <th>Timeline</th><th>Revenue</th><th>Last Touch</th>
              <th>Next Action</th><th>Health</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => {
              const score = healthScore(l);
              const hl = healthLabel(score);
              const leak = isPipelineLeak(l);
              const st = isStale(l);
              return (
                <tr key={l.id} style={{ background: leak ? "#fff8f5" : st ? "#fffbf5" : undefined }}>
                  <td>
                    <span className="lead-link" onClick={() => onOpenLead(l.id)}>{l.leadName}</span>
                    {(l.tags || []).length > 0 && <div style={{ marginTop: 3 }}>{l.tags.slice(0, 2).map(t => <span key={t} className="tag" style={{ fontSize: 9 }}>{t}</span>)}</div>}
                  </td>
                  <td style={{ fontWeight: 500 }}>{l.company}</td>
                  <td style={{ fontSize: 11.5, color: p.textLight }}>{l.subSegment}</td>
                  <td><StagePill stage={l.stage} /></td>
                  <td><UrgencyBar value={l.urgency} /></td>
                  <td style={{ maxWidth: 180, fontSize: 11.5, color: p.textLight, fontStyle: "italic" }}>
                    {l.painQuote ? `"${l.painQuote.slice(0, 60)}${l.painQuote.length > 60 ? "…" : ""}"` : "—"}
                  </td>
                  <td>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: l.budgetOwner === "Yes" ? "#e4f2eb" : "#fde8e8", color: l.budgetOwner === "Yes" ? "#1d6b45" : "#8b3030" }}>
                      {l.budgetOwner || "Unknown"}
                    </span>
                  </td>
                  <td style={{ fontSize: 11.5 }}>{l.buyingTimeline || "—"}</td>
                  <td>${(l.dealSize || 0).toLocaleString()}</td>
                  <td>
                    <EditableCell value={l.lastTouch} type="date" onChange={v => updateLead(l.id, "lastTouch", v)} />
                    {st && <div style={{ fontSize: 9, color: p.warn, fontWeight: 600, marginTop: 2 }}>{daysDiff(l.lastTouch)}d ago</div>}
                  </td>
                  <td>
                    <EditableCell value={l.nextActionDate} type="date" onChange={v => updateLead(l.id, "nextActionDate", v)} />
                    {leak && <div style={{ fontSize: 9, color: p.danger, fontWeight: 700 }}>⚡ LEAK</div>}
                  </td>
                  <td>
                    <span className="health-dot">
                      <span className="dot" style={{ background: hl.color }} />
                      <span style={{ color: hl.color, fontWeight: 500, fontSize: 11 }}>{score}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PIPELINE TOTAL */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, gap: 20, fontSize: 12, color: p.textLight }}>
        <span><strong style={{ color: p.text }}>{filtered.length}</strong> leads shown</span>
        <span>Total pipeline: <strong style={{ color: p.text }}>${filtered.reduce((a,l) => a + (l.dealSize||0), 0).toLocaleString()}</strong></span>
      </div>

      {showModal !== false && (
        <AddLeadModal prefill={showModal?.prefill} hypotheses={data.hypotheses} onAdd={addLead} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

function AddLeadModal({ prefill = {}, hypotheses, onAdd, onClose }) {
  const [form, setForm] = useState({
    leadName: prefill.leadName || "", company: prefill.company || "", website: "",
    sector: prefill.sector || "Commercial", subSegment: prefill.sector || "",
    orgSize: "", priorityScore: 3,
    contactTitle: "", email: "", phone: "", linkedin: "", sourceOfContact: "LinkedIn",
    initialContactDate: today, contactMethod: "LinkedIn", followUpDate: "", lastTouch: today,
    responseStatus: "No response",
    problemIdentified: "", urgency: prefill.urgency || 3, currentSolution: "",
    budgetOwner: "Unknown", buyingTimeline: "", painQuote: prefill.painQuote || "",
    objections: "", suggestedFeatures: "", referralProvided: "No",
    hypothesisTested: "", valuePropTested: "", pricingTested: "", demoVersion: "",
    experimentResult: "Weak signal", confidenceScore: 3,
    dealSize: "", probability: 20, nextAction: "", nextActionDate: "", owner: "Founder",
    stage: "Outreach started", callNotes: "", transcription: "",
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const [tab, setTab] = useState("org");

  return (
    <div className="backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add New Lead</div>
        <div className="tabs" style={{ marginBottom: 16 }}>
          {["org","contact","discovery","experiment","opportunity"].map(t => (
            <div key={t} className={`tab ${tab===t?"active":""}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </div>
          ))}
        </div>

        {tab === "org" && (
          <>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Lead Name</label><input className="form-input" value={form.leadName} onChange={set("leadName")} /></div>
              <div className="form-group"><label className="form-label">Company</label><input className="form-input" value={form.company} onChange={set("company")} /></div>
            </div>
            <div className="form-group"><label className="form-label">Website</label><input className="form-input" value={form.website} onChange={set("website")} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Sector</label>
                <select className="form-select" value={form.sector} onChange={set("sector")}>{["Commercial","Gov","Municipality","Nonprofit","Health Tech"].map(s=><option key={s}>{s}</option>)}</select>
              </div>
              <div className="form-group"><label className="form-label">Sub-Segment</label><input className="form-input" value={form.subSegment} onChange={set("subSegment")} placeholder="e.g. Creative Agency" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Org Size</label><input className="form-input" value={form.orgSize} onChange={set("orgSize")} placeholder="employees or budget" /></div>
              <div className="form-group"><label className="form-label">Priority Score (1–5)</label><input className="form-input" type="number" min={1} max={5} value={form.priorityScore} onChange={set("priorityScore")} /></div>
            </div>
          </>
        )}

        {tab === "contact" && (
          <>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.contactTitle} onChange={set("contactTitle")} /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={set("email")} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={set("phone")} /></div>
              <div className="form-group"><label className="form-label">LinkedIn URL</label><input className="form-input" value={form.linkedin} onChange={set("linkedin")} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Source of Contact</label>
                <select className="form-select" value={form.sourceOfContact} onChange={set("sourceOfContact")}>{["LinkedIn","Referral","Conference","Website","Cold List","Event","Intro"].map(s=><option key={s}>{s}</option>)}</select>
              </div>
              <div className="form-group"><label className="form-label">Contact Method</label>
                <select className="form-select" value={form.contactMethod} onChange={set("contactMethod")}>{["Email","LinkedIn","Intro","Call","Event"].map(s=><option key={s}>{s}</option>)}</select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Initial Contact Date</label><input className="form-input" type="date" value={form.initialContactDate} onChange={set("initialContactDate")} /></div>
              <div className="form-group"><label className="form-label">Response Status</label>
                <select className="form-select" value={form.responseStatus} onChange={set("responseStatus")}>{["No response","Engaged","Meeting scheduled","Discovery complete","Opportunity active","Closed-lost","Closed-won"].map(s=><option key={s}>{s}</option>)}</select>
              </div>
            </div>
          </>
        )}

        {tab === "discovery" && (
          <>
            <div className="form-group"><label className="form-label">Problem They Identified</label><textarea className="form-textarea" rows={2} value={form.problemIdentified} onChange={set("problemIdentified")} /></div>
            <div className="form-group"><label className="form-label">Key Pain Quote (verbatim)</label><textarea className="form-textarea" rows={2} value={form.painQuote} onChange={set("painQuote")} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Current Solution</label><input className="form-input" value={form.currentSolution} onChange={set("currentSolution")} /></div>
              <div className="form-group"><label className="form-label">Urgency (1–5)</label><input className="form-input" type="number" min={1} max={5} value={form.urgency} onChange={set("urgency")} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Budget Owner?</label>
                <select className="form-select" value={form.budgetOwner} onChange={set("budgetOwner")}>{["Yes","No","Unknown"].map(s=><option key={s}>{s}</option>)}</select>
              </div>
              <div className="form-group"><label className="form-label">Buying Timeline</label><input className="form-input" value={form.buyingTimeline} onChange={set("buyingTimeline")} placeholder="Q2 2026" /></div>
            </div>
            <div className="form-group"><label className="form-label">Objections</label><input className="form-input" value={form.objections} onChange={set("objections")} /></div>
            <div className="form-group"><label className="form-label">Suggested Features</label><input className="form-input" value={form.suggestedFeatures} onChange={set("suggestedFeatures")} /></div>
            <div className="form-group"><label className="form-label">Referral Provided?</label>
              <select className="form-select" value={form.referralProvided} onChange={set("referralProvided")}><option>Yes</option><option>No</option></select>
            </div>
          </>
        )}

        {tab === "experiment" && (
          <>
            <div className="form-group"><label className="form-label">Linked Hypothesis</label>
              <select className="form-select" value={form.hypothesisTested} onChange={set("hypothesisTested")}>
                <option value="">None</option>
                {hypotheses.map(h => <option key={h.id} value={h.id}>{h.id}: {h.statement.slice(0,55)}…</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Value Proposition Tested</label><input className="form-input" value={form.valuePropTested} onChange={set("valuePropTested")} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Pricing Tested</label><input className="form-input" value={form.pricingTested} onChange={set("pricingTested")} placeholder="$499/mo" /></div>
              <div className="form-group"><label className="form-label">Demo Version</label><input className="form-input" value={form.demoVersion} onChange={set("demoVersion")} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Experiment Result</label>
                <select className="form-select" value={form.experimentResult} onChange={set("experimentResult")}>{["Confirmed","Weak signal","Rejected"].map(s=><option key={s}>{s}</option>)}</select>
              </div>
              <div className="form-group"><label className="form-label">Confidence Score (1–5)</label><input className="form-input" type="number" min={1} max={5} value={form.confidenceScore} onChange={set("confidenceScore")} /></div>
            </div>
          </>
        )}

        {tab === "opportunity" && (
          <>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Deal Size ($)</label><input className="form-input" type="number" value={form.dealSize} onChange={set("dealSize")} /></div>
              <div className="form-group"><label className="form-label">Probability (%)</label><input className="form-input" type="number" value={form.probability} onChange={set("probability")} /></div>
            </div>
            <div className="form-group"><label className="form-label">Pipeline Stage</label>
              <select className="form-select" value={form.stage} onChange={set("stage")}>{["Target identified","Outreach started","Discovery","Validation","Proposal","Negotiation","Pilot","Closed Won","Closed Lost"].map(s=><option key={s}>{s}</option>)}</select>
            </div>
            <div className="form-group"><label className="form-label">Next Action</label><input className="form-input" value={form.nextAction} onChange={set("nextAction")} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Next Action Date</label><input className="form-input" type="date" value={form.nextActionDate} onChange={set("nextActionDate")} /></div>
              <div className="form-group"><label className="form-label">Owner</label><input className="form-input" value={form.owner} onChange={set("owner")} /></div>
            </div>
            <div className="form-group"><label className="form-label">Initial Call Notes</label><textarea className="form-textarea" rows={3} value={form.callNotes} onChange={set("callNotes")} /></div>
          </>
        )}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => form.leadName && onAdd(form)}>Add Lead</button>
        </div>
      </div>
    </div>
  );
}

// ─── METRICS VIEW ─────────────────────────────────────────────────────────────
function MetricsView({ data }) {
  const pl = data.pipeline;
  const total = pl.reduce((a, l) => a + (l.dealSize || 0), 0);
  const weighted = pl.reduce((a, l) => a + ((l.dealSize || 0) * (l.probability || 0) / 100), 0);
  const closedWon = pl.filter(l => l.stage === "Closed Won").length;
  const discovery = pl.filter(l => l.stage === "Discovery").length;
  const leaks = pl.filter(isPipelineLeak).length;
  const avgHealth = Math.round(pl.reduce((a, l) => a + healthScore(l), 0) / (pl.length || 1));
  const patterns = detectPatterns(pl);
  const convRate = pl.length ? Math.round(closedWon / pl.length * 100) : 0;
  const budgetConfirmed = pl.filter(l => l.budgetOwner === "Yes").length;
  const referrals = pl.filter(l => l.referralProvided === "Yes").length;
  const validH = data.hypotheses.filter(h => h.status === "Validated").length;

  const segData = Object.entries(
    pl.reduce((a, l) => { const k = l.subSegment || l.sector; a[k] = [...(a[k]||[]), l]; return a; }, {})
  ).map(([seg, leads]) => ({
    seg, count: leads.length,
    val: leads.reduce((a, l) => a + (l.dealSize || 0), 0),
    avgU: Math.round(leads.reduce((a, l) => a + (l.urgency || 0), 0) / leads.length),
    budgetPct: Math.round(leads.filter(l => l.budgetOwner === "Yes").length / leads.length * 100),
  })).sort((a, b) => b.val - a.val);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 4 }}>Weekly COO Health Check</div>
        <div style={{ fontSize: 12, color: p.textLight }}>Auto-calculated from live pipeline · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
      </div>

      <div className="metrics-grid">
        {[
          { lbl: "Total Pipeline", val: `$${(total/1000).toFixed(0)}K`, sub: `${pl.length} leads active` },
          { lbl: "Weighted Pipeline", val: `$${(weighted/1000).toFixed(0)}K`, sub: "by probability" },
          { lbl: "Conversion Rate", val: `${convRate}%`, sub: `${closedWon} closed won` },
          { lbl: "Discovery Stage", val: discovery, sub: "active calls" },
          { lbl: "Pipeline Leaks", val: leaks, sub: "no next action", color: leaks > 0 ? p.danger : p.success },
          { lbl: "Avg Health Score", val: avgHealth, sub: "across all leads" },
          { lbl: "Budget Confirmed", val: budgetConfirmed, sub: `of ${pl.length} leads` },
          { lbl: "Referrals Generated", val: referrals, sub: "from active leads" },
          { lbl: "Patterns Detected", val: patterns.length, sub: "recurring pain signals", color: patterns.length > 0 ? p.success : p.textLight },
          { lbl: "Hypotheses Active", val: data.hypotheses.length, sub: `${validH} validated` },
          { lbl: "Insights Logged", val: data.insights.length, sub: "customer signals" },
          { lbl: "Avg Urgency", val: (pl.reduce((a,l) => a+(l.urgency||0), 0)/(pl.length||1)).toFixed(1), sub: "across pipeline" },
        ].map(m => (
          <div key={m.lbl} className="metric-card">
            <div className="lbl">{m.lbl}</div>
            <div className="val" style={{ color: m.color || p.text }}>{m.val}</div>
            <div className="sub">{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 14, fontSize: 15 }}>Pipeline by Segment</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Segment</th><th>Leads</th><th>Pipeline Value</th><th>Avg Urgency</th><th>Budget Confirmed</th><th>Avg Health</th></tr></thead>
            <tbody>
              {segData.map(s => {
                const leads = pl.filter(l => (l.subSegment||l.sector) === s.seg);
                const ah = Math.round(leads.reduce((a,l)=>a+healthScore(l),0)/s.count);
                const hl = healthLabel(ah);
                return (
                  <tr key={s.seg}>
                    <td style={{ fontWeight: 500 }}>{s.seg}</td>
                    <td>{s.count}</td>
                    <td>${s.val.toLocaleString()}</td>
                    <td><UrgencyBar value={s.avgU} /></td>
                    <td>{s.budgetPct}%</td>
                    <td><span className="health-dot"><span className="dot" style={{ background: hl.color }} /><span style={{ color: hl.color }}>{ah}/100</span></span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 14, fontSize: 15 }}>Pipeline by Stage</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Stage</th><th>Leads</th><th>Pipeline Value</th><th>Weighted Value</th></tr></thead>
            <tbody>
              {["Target identified","Outreach started","Discovery","Validation","Proposal","Negotiation","Pilot","Closed Won","Closed Lost"]
                .map(stage => {
                  const leads = pl.filter(l => l.stage === stage);
                  if (!leads.length) return null;
                  const val = leads.reduce((a,l) => a+(l.dealSize||0), 0);
                  const wval = leads.reduce((a,l) => a+(l.dealSize||0)*(l.probability||0)/100, 0);
                  return (
                    <tr key={stage}>
                      <td><StagePill stage={stage} /></td>
                      <td>{leads.length}</td>
                      <td>${val.toLocaleString()}</td>
                      <td>${Math.round(wval).toLocaleString()}</td>
                    </tr>
                  );
                }).filter(Boolean)}
            </tbody>
          </table>
        </div>
      </div>

      {patterns.length > 0 && (
        <div>
          <div className="section-title" style={{ marginBottom: 14, fontSize: 15 }}>Pattern Alerts</div>
          <div className="alerts">
            {patterns.map(pat => (
              <div key={pat.segment} className="alert alert-pattern">
                🔍 <div><strong>PATTERN:</strong> {pat.count} leads in <em>{pat.segment}</em> share similar pain — validate your core hypothesis for this segment immediately.</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HYPOTHESIS VIEW ──────────────────────────────────────────────────────────
function HypothesisView({ data, setData }) {
  const [showModal, setShowModal] = useState(false);

  function addH(form) {
    const id = "H" + String(data.hypotheses.length + 1).padStart(3, "0");
    setData(d => ({ ...d, hypotheses: [...d.hypotheses, { ...form, id, supporting: 0, contradicting: 0 }] }));
    setShowModal(false);
  }

  function updateH(id, field, value) {
    setData(d => ({ ...d, hypotheses: d.hypotheses.map(h => h.id === id ? { ...h, [field]: value } : h) }));
  }

  return (
    <div>
      <div className="section-hdr">
        <div>
          <div className="section-title">Hypothesis Tracker</div>
          <div style={{ fontSize: 12, color: p.textLight, marginTop: 2 }}>Your PMF engine — test, validate, invalidate with evidence</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Hypothesis</button>
      </div>

      {/* MOBILE hypothesis cards */}
      <div className="hyp-mobile">
        {data.hypotheses.map(h => {
          const strength = h.supporting >= 3 ? { label:"🟢 Strengthening", color:p.success }
            : h.contradicting > h.supporting ? { label:"🔴 Weakening", color:p.danger }
            : { label:"🟡 Testing", color:p.warn };
          return (
            <div key={h.id} className="hyp-card">
              <div className="hyp-card-id">{h.id} · {h.segment}</div>
              <div className="hyp-card-statement">{h.statement}</div>
              <div style={{ fontSize:11, color:p.textLight, marginBottom:8 }}>{h.valueProp}</div>
              <div className="hyp-card-row">
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:18, fontWeight:700, color:p.success }}>{h.supporting}</div>
                    <div style={{ fontSize:9, color:p.textLight }}>Supporting</div>
                    <button style={{ marginTop:4, border:`1px solid ${p.success}`, background:"none", borderRadius:4, cursor:"pointer", fontSize:10, padding:"2px 8px", color:p.success }}
                      onClick={() => updateH(h.id,"supporting",h.supporting+1)}>+</button>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:18, fontWeight:700, color:p.danger }}>{h.contradicting}</div>
                    <div style={{ fontSize:9, color:p.textLight }}>Against</div>
                    <button style={{ marginTop:4, border:`1px solid ${p.danger}`, background:"none", borderRadius:4, cursor:"pointer", fontSize:10, padding:"2px 8px", color:p.danger }}
                      onClick={() => updateH(h.id,"contradicting",h.contradicting+1)}>+</button>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:10, color:strength.color, fontWeight:600 }}>{strength.label}</div>
                  <div style={{ marginTop:6 }}>
                    <select style={{ fontSize:11, border:`1px solid ${p.border}`, borderRadius:6, padding:"4px 8px", background:p.cream, color:p.text }}
                      value={h.status} onChange={e => updateH(h.id,"status",e.target.value)}>
                      <option>Testing</option><option>Validated</option><option>Invalidated</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP hypothesis table */}
      <div className="table-wrap hyp-table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Statement</th><th>Segment</th><th>Problem</th><th>Value Prop</th><th>Experiment Type</th><th>Test Date</th><th>✓ Support</th><th>✗ Contradict</th><th>Result</th><th>Decision</th><th>Status</th></tr>
          </thead>
          <tbody>
            {data.hypotheses.map(h => {
              const strength = h.supporting >= 3 ? { label: "🟢 Strengthening", color: p.success } : h.contradicting > h.supporting ? { label: "🔴 Weakening", color: p.danger } : { label: "🟡 Testing", color: p.warn };
              return (
                <tr key={h.id}>
                  <td style={{ fontWeight: 700, color: p.mauvedark }}>{h.id}</td>
                  <td style={{ maxWidth: 200, fontSize: 12 }}>
                    <EditableCell value={h.statement} onChange={v => updateH(h.id, "statement", v)} />
                  </td>
                  <td style={{ fontSize: 11.5 }}><EditableCell value={h.segment} onChange={v => updateH(h.id, "segment", v)} /></td>
                  <td style={{ fontSize: 11.5, maxWidth: 140, color: p.textLight }}>
                    <EditableCell value={h.problem} onChange={v => updateH(h.id, "problem", v)} />
                  </td>
                  <td style={{ fontSize: 11.5, maxWidth: 140 }}>
                    <EditableCell value={h.valueProp} onChange={v => updateH(h.id, "valueProp", v)} />
                  </td>
                  <td style={{ fontSize: 11.5 }}>
                    <EditableCell value={h.experimentType} type="select" onChange={v => updateH(h.id, "experimentType", v)} options={["Discovery Interview","Demo","Pilot","Pricing Test","Landing Page","Cold Outreach"]} />
                  </td>
                  <td>
                    <EditableCell value={h.testDate} type="date" onChange={v => updateH(h.id, "testDate", v)} />
                  </td>
                  <td>
                    <div className="counter-ctrl">
                      <span style={{ color: p.success, fontWeight: 700 }}>{h.supporting}</span>
                      <button className="counter-btn" style={{ borderColor: p.success, color: p.success }} onClick={() => updateH(h.id, "supporting", h.supporting + 1)}>+</button>
                    </div>
                    {h.supporting >= 3 && <div style={{ fontSize: 9, color: p.success, marginTop: 2 }}>✦ Strengthening</div>}
                  </td>
                  <td>
                    <div className="counter-ctrl">
                      <span style={{ color: p.danger, fontWeight: 700 }}>{h.contradicting}</span>
                      <button className="counter-btn" style={{ borderColor: p.danger, color: p.danger }} onClick={() => updateH(h.id, "contradicting", h.contradicting + 1)}>+</button>
                    </div>
                  </td>
                  <td>
                    <EditableCell value={h.result} type="select" onChange={v => updateH(h.id, "result", v)} options={["Confirmed","Weak signal","Rejected"]} />
                  </td>
                  <td>
                    <EditableCell value={h.decision} type="select" onChange={v => updateH(h.id, "decision", v)} options={["Iterate","Pivot","Double down"]} />
                  </td>
                  <td>
                    <EditableCell value={h.status} type="select" onChange={v => updateH(h.id, "status", v)} options={["Testing","Validated","Invalidated"]} />
                    <div className="exp-strength" style={{ color: strength.color, fontSize: 9, marginTop: 2 }}>{strength.label}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ width: 560 }}>
            <div className="modal-title">New Hypothesis</div>
            <HFormFields onSubmit={addH} onCancel={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function HFormFields({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ statement: "", segment: "", problem: "", valueProp: "", experimentType: "Discovery Interview", testDate: today, evidenceCollected: "", result: "Weak signal", decision: "Iterate", status: "Testing", notes: "" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <div>
      <div className="form-group"><label className="form-label">Hypothesis Statement</label><textarea className="form-textarea" rows={2} value={form.statement} onChange={set("statement")} placeholder="[Customer type] will pay for [solution] to solve [problem]" /></div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Segment</label><input className="form-input" value={form.segment} onChange={set("segment")} /></div>
        <div className="form-group"><label className="form-label">Experiment Type</label>
          <select className="form-select" value={form.experimentType} onChange={set("experimentType")}>{["Discovery Interview","Demo","Pilot","Pricing Test","Landing Page","Cold Outreach"].map(s=><option key={s}>{s}</option>)}</select>
        </div>
      </div>
      <div className="form-group"><label className="form-label">Problem Being Tested</label><input className="form-input" value={form.problem} onChange={set("problem")} /></div>
      <div className="form-group"><label className="form-label">Value Proposition</label><input className="form-input" value={form.valueProp} onChange={set("valueProp")} /></div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Test Date</label><input className="form-input" type="date" value={form.testDate} onChange={set("testDate")} /></div>
        <div className="form-group"><label className="form-label">Initial Decision</label>
          <select className="form-select" value={form.decision} onChange={set("decision")}><option>Iterate</option><option>Pivot</option><option>Double down</option></select>
        </div>
      </div>
      <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" rows={2} value={form.notes} onChange={set("notes")} /></div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={() => form.statement && onSubmit(form)}>Add Hypothesis</button>
      </div>
    </div>
  );
}

// ─── INSIGHTS VIEW ────────────────────────────────────────────────────────────
function InsightsView({ data, setData }) {
  const [showModal, setShowModal] = useState(false);

  function addI(form) {
    const id = "I" + String(data.insights.length + 1).padStart(3, "0");
    setData(d => ({ ...d, insights: [...d.insights, { ...form, id, frequency: 1 }] }));
    setShowModal(false);
  }

  function increment(id) {
    setData(d => ({ ...d, insights: d.insights.map(i => i.id === id ? { ...i, frequency: i.frequency + 1 } : i) }));
  }

  function updateI(id, field, value) {
    setData(d => ({ ...d, insights: d.insights.map(i => i.id === id ? { ...i, [field]: value } : i) }));
  }

  const sorted = [...data.insights].sort((a, b) => b.frequency - a.frequency);
  const recurring = sorted.filter(i => i.frequency >= 2);

  return (
    <div>
      <div className="section-hdr">
        <div>
          <div className="section-title">Customer Insights Database</div>
          <div style={{ fontSize: 12, color: p.textLight, marginTop: 2 }}>Pattern layer — signal detection across all conversations</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Log Insight</button>
      </div>

      {recurring.length > 0 && (
        <div className="alerts" style={{ marginBottom: 20 }}>
          {recurring.map(i => (
            <div key={i.id} className="alert alert-pattern">
              🔁 <div><strong>RECURRING THEME:</strong> "{i.painTheme}" mentioned {i.frequency}× in <em>{i.segment}</em> — Revenue potential: ${(i.revenuePotential||0).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* MOBILE insight cards */}
      <div className="insights-mobile">
        {sorted.map(i => (
          <div key={i.id} className="insight-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
              <div className="insight-card-theme">{i.painTheme}</div>
              <span style={{ fontSize:10, padding:"2px 9px", borderRadius:12,
                background: i.intensity==="High" ? "#fde8e8" : i.intensity==="Medium" ? "#fdf3e0" : "#f0f5f2",
                color: i.intensity==="High" ? p.danger : i.intensity==="Medium" ? "#9a6a1e" : p.success }}>
                {i.intensity}
              </span>
            </div>
            <div className="insight-card-quote">"{i.quote}"</div>
            <div style={{ fontSize:11, color:p.textLight, marginBottom:10 }}>{i.segment} · {i.linkedHypothesis}</div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:22, fontWeight:700, color: i.frequency>=3 ? p.danger : i.frequency>=2 ? p.warn : p.textLight }}>{i.frequency}</span>
                <span style={{ fontSize:10, color:p.textLight }}>mentions</span>
                <button style={{ border:`1px solid ${p.gold}`, background:"none", borderRadius:6, cursor:"pointer", fontSize:11, padding:"3px 10px", color:p.gold }}
                  onClick={() => increment(i.id)}>+ mention</button>
              </div>
              <div style={{ fontSize:11, fontWeight:600, color:p.mauvedark }}>${(i.revenuePotential||0).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP insights table */}
      <div className="table-wrap insights-table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Pain Theme</th><th>Exact Quote</th><th>Segment</th><th>Frequency</th><th>Intensity</th><th>Example Leads</th><th>Revenue Potential</th><th>Priority</th><th>Hypothesis</th></tr>
          </thead>
          <tbody>
            {sorted.map(i => (
              <tr key={i.id}>
                <td style={{ color: p.mauvedark, fontWeight: 600 }}>{i.id}</td>
                <td style={{ fontWeight: 500 }}><EditableCell value={i.painTheme} onChange={v => updateI(i.id, "painTheme", v)} /></td>
                <td style={{ fontSize: 11.5, color: p.textLight, fontStyle: "italic", maxWidth: 200 }}>"{i.quote}"</td>
                <td>{i.segment}</td>
                <td>
                  <div className="counter-ctrl">
                    <span style={{ fontWeight: 700, color: i.frequency >= 3 ? p.danger : i.frequency >= 2 ? p.warn : p.textLight, fontSize: 16 }}>{i.frequency}</span>
                    <button className="counter-btn" style={{ borderColor: p.gold, color: p.gold }} onClick={() => increment(i.id)}>+</button>
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: 10.5, padding: "2px 9px", borderRadius: 12, background: i.intensity === "High" ? "#fde8e8" : i.intensity === "Medium" ? "#fdf3e0" : "#f0f5f2", color: i.intensity === "High" ? p.danger : i.intensity === "Medium" ? "#9a6a1e" : p.success }}>
                    {i.intensity}
                  </span>
                </td>
                <td style={{ fontSize: 11.5, color: p.textLight }}>{i.exampleLeads}</td>
                <td>${(i.revenuePotential || 0).toLocaleString()}</td>
                <td>
                  <span style={{ fontSize: 10.5, padding: "2px 9px", borderRadius: 12, background: i.priority === "High" ? "#fde8e8" : i.priority === "Medium" ? "#fdf3e0" : "#f0f5f2", color: i.priority === "High" ? p.danger : i.priority === "Medium" ? "#9a6a1e" : p.success }}>
                    {i.priority}
                  </span>
                </td>
                <td style={{ color: p.mauvedark }}>{i.linkedHypothesis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ width: 520 }}>
            <div className="modal-title">Log Customer Insight</div>
            <IFormFields hypotheses={data.hypotheses} onSubmit={addI} onCancel={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function IFormFields({ hypotheses, onSubmit, onCancel }) {
  const [form, setForm] = useState({ painTheme: "", quote: "", segment: "", intensity: "Medium", exampleLeads: "", revenuePotential: "", priority: "Medium", linkedHypothesis: "" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <div>
      <div className="form-group"><label className="form-label">Pain Theme</label><input className="form-input" value={form.painTheme} onChange={set("painTheme")} placeholder="e.g. Reporting Overhead" /></div>
      <div className="form-group"><label className="form-label">Exact Quote</label><textarea className="form-textarea" rows={2} value={form.quote} onChange={set("quote")} /></div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Segment</label><input className="form-input" value={form.segment} onChange={set("segment")} /></div>
        <div className="form-group"><label className="form-label">Emotional Intensity</label>
          <select className="form-select" value={form.intensity} onChange={set("intensity")}><option>Low</option><option>Medium</option><option>High</option></select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group"><label className="form-label">Revenue Potential ($)</label><input className="form-input" type="number" value={form.revenuePotential} onChange={set("revenuePotential")} /></div>
        <div className="form-group"><label className="form-label">Priority</label>
          <select className="form-select" value={form.priority} onChange={set("priority")}><option>High</option><option>Medium</option><option>Low</option></select>
        </div>
      </div>
      <div className="form-group"><label className="form-label">Example Lead IDs</label><input className="form-input" value={form.exampleLeads} onChange={set("exampleLeads")} placeholder="L001, L002" /></div>
      <div className="form-group"><label className="form-label">Linked Hypothesis</label>
        <select className="form-select" value={form.linkedHypothesis} onChange={set("linkedHypothesis")}>
          <option value="">None</option>
          {hypotheses.map(h => <option key={h.id} value={h.id}>{h.id}: {h.statement.slice(0,45)}…</option>)}
        </select>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={() => form.painTheme && onSubmit(form)}>Log Insight</button>
      </div>
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
// ─── CONVERSATIONS VIEW ───────────────────────────────────────────────────────
function ConversationsView({ data, setData, onOpenLead }) {
  const [range, setRange] = useState("week");
  const [typeFilter, setTypeFilter] = useState("All");
  const [logForm, setLogForm] = useState({ leadId: "", date: today, time: "", type: "Call", duration: "", notes: "" });
  const [showLog, setShowLog] = useState(false);

  const now = new Date();
  function getRangeCutoff(r) {
    const d = new Date();
    if (r === "week") d.setDate(d.getDate() - 7);
    else if (r === "month") d.setMonth(d.getMonth() - 1);
    else d.setMonth(d.getMonth() - 6);
    return d;
  }

  // Flatten all touches from all leads
  const allTouches = [];
  data.pipeline.forEach(lead => {
    (lead.touchLog || []).forEach(touch => {
      allTouches.push({ ...touch, leadId: lead.id, leadName: lead.leadName, company: lead.company, stage: lead.stage, segment: lead.subSegment || lead.sector });
    });
  });

  const cutoff = getRangeCutoff(range);
  const filtered = allTouches
    .filter(t => {
      const d = new Date(t.date);
      const inRange = d >= cutoff && d <= now;
      const typeMatch = typeFilter === "All" || t.type === typeFilter;
      return inRange && typeMatch;
    })
    .sort((a, b) => {
      const da = new Date(a.date + (a.time ? "T" + a.time : ""));
      const db = new Date(b.date + (b.time ? "T" + b.time : ""));
      return db - da;
    });

  // Group by date label
  function getGroupLabel(dateStr, r) {
    const d = new Date(dateStr);
    if (r === "week") return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    if (r === "month") {
      const diff = Math.floor((now - d) / 86400000);
      if (diff < 7) return "This Week";
      if (diff < 14) return "Last Week";
      if (diff < 21) return "2 Weeks Ago";
      return "3+ Weeks Ago";
    }
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  const grouped = filtered.reduce((acc, t) => {
    const label = getGroupLabel(t.date, range);
    if (!acc[label]) acc[label] = [];
    acc[label].push(t);
    return acc;
  }, {});

  // Unique leads touched
  const uniqueLeads = new Set(filtered.map(t => t.leadId)).size;
  const totalDuration = filtered.reduce((a, t) => {
    const m = parseInt((t.duration || "").replace(/[^\d]/g, ""));
    return a + (isNaN(m) ? 0 : m);
  }, 0);
  const typeBreakdown = filtered.reduce((a, t) => { a[t.type] = (a[t.type] || 0) + 1; return a; }, {});
  const topType = Object.entries(typeBreakdown).sort((a, b) => b[1] - a[1])[0];

  const allTypes = ["All", ...Object.keys(TOUCH_COLORS)];

  function logTouch() {
    if (!logForm.leadId || !logForm.date) return;
    const touch = { date: logForm.date, time: logForm.time, type: logForm.type, duration: logForm.duration, notes: logForm.notes };
    setData(d => ({
      ...d,
      pipeline: d.pipeline.map(l => l.id === logForm.leadId
        ? { ...l, touchLog: [...(l.touchLog || []), touch], lastTouch: logForm.date }
        : l
      )
    }));
    setLogForm(f => ({ ...f, notes: "", time: "", duration: "" }));
    setShowLog(false);
  }

  return (
    <div>
      {/* SUMMARY CARDS */}
      <div className="convo-summary-bar">
        <div className="convo-sum-card">
          <div className="convo-sum-lbl">Total Touchpoints</div>
          <div className="convo-sum-val">{filtered.length}</div>
          <div className="convo-sum-sub">in selected period</div>
        </div>
        <div className="convo-sum-card">
          <div className="convo-sum-lbl">Unique Leads</div>
          <div className="convo-sum-val">{uniqueLeads}</div>
          <div className="convo-sum-sub">people spoken with</div>
        </div>
        <div className="convo-sum-card">
          <div className="convo-sum-lbl">Time Invested</div>
          <div className="convo-sum-val">{totalDuration > 0 ? `${totalDuration}m` : "—"}</div>
          <div className="convo-sum-sub">tracked call time</div>
        </div>
        <div className="convo-sum-card">
          <div className="convo-sum-lbl">Top Channel</div>
          <div className="convo-sum-val" style={{ fontSize: 18, paddingTop: 4 }}>{topType ? topType[0] : "—"}</div>
          <div className="convo-sum-sub">{topType ? `${topType[1]} touchpoints` : "no data yet"}</div>
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="section-title" style={{ marginBottom: 6 }}>Conversation Timeline</div>
          <div className="range-tabs">
            {[["week","Past 7 Days"],["month","Past Month"],["6months","Past 6 Months"]].map(([key, label]) => (
              <div key={key} className={`range-tab ${range === key ? "active" : ""}`} onClick={() => setRange(key)}>{label}</div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            {allTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => setShowLog(!showLog)}>+ Log Touchpoint</button>
        </div>
      </div>

      {/* LOG FORM */}
      {showLog && (
        <div className="log-touch-form">
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Log a Conversation</div>
          <div className="log-touch-grid">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Lead</label>
              <select className="form-select" value={logForm.leadId} onChange={e => setLogForm(f => ({ ...f, leadId: e.target.value }))}>
                <option value="">Select lead…</option>
                {data.pipeline.map(l => <option key={l.id} value={l.id}>{l.leadName} — {l.company}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={logForm.date} onChange={e => setLogForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Time</label>
              <input className="form-input" type="time" value={logForm.time} onChange={e => setLogForm(f => ({ ...f, time: e.target.value }))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Type</label>
              <select className="form-select" value={logForm.type} onChange={e => setLogForm(f => ({ ...f, type: e.target.value }))}>
                {Object.keys(TOUCH_COLORS).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: 10, marginBottom: 10 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Duration</label>
              <input className="form-input" placeholder="30 min" value={logForm.duration} onChange={e => setLogForm(f => ({ ...f, duration: e.target.value }))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notes</label>
              <input className="form-input" placeholder="What happened? Key takeaway?" value={logForm.notes} onChange={e => setLogForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowLog(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={logTouch}>Save Touchpoint</button>
          </div>
        </div>
      )}

      {/* TIMELINE */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◎</div>
          <div className="empty-msg">No conversations logged in this period</div>
          <div className="empty-sub">Use "Log Touchpoint" above or add touches from a lead's profile.</div>
        </div>
      ) : (
        Object.entries(grouped).map(([label, touches]) => (
          <div key={label}>
            <div className="timeline-group-label">{label} <span style={{ fontWeight: 400, fontSize: 9 }}>({touches.length})</span></div>
            {touches.map((touch, i) => (
              <div key={i} className="touch-card">
                <div className="touch-time-col">
                  {touch.time && <div className="touch-time">{touch.time}</div>}
                  <div className="touch-date-str">{new Date(touch.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
                <div className="touch-divider" />
                <div className="touch-type-dot" style={{ background: TOUCH_COLORS[touch.type] || p.mauve }} />
                <div className="touch-body">
                  <span className="touch-lead-name" onClick={() => onOpenLead(touch.leadId)}>{touch.leadName}</span>
                  <div className="touch-company">{touch.company} · {touch.segment}</div>
                  {touch.notes && <div className="touch-notes">{touch.notes}</div>}
                  <div className="touch-meta">
                    <span className="touch-badge" style={{ background: (TOUCH_COLORS[touch.type] || p.mauve) + "22", color: TOUCH_COLORS[touch.type] || p.mauvedark, borderColor: (TOUCH_COLORS[touch.type] || p.mauve) + "44" }}>{touch.type}</span>
                    {touch.duration && <span className="touch-badge">⏱ {touch.duration}</span>}
                    <span className="touch-badge">{touch.stage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "pipeline", label: "Pipeline", icon: "◈" },
  { id: "metrics", label: "Metrics", icon: "◉" },
  { id: "hypotheses", label: "Hypotheses", icon: "◇" },
  { id: "insights", label: "Insights", icon: "◎" },
  { id: "conversations", label: "Conversations", icon: "◌" },
];

const PAGE_TITLES = {
  pipeline: "Pipeline & Discovery",
  metrics: "Weekly Metrics",
  hypotheses: "Hypothesis Tracker",
  insights: "Customer Insights",
  conversations: "Conversation Log",
};

export default function App() {
  const [page, setPage] = useState("pipeline");
  const [profileId, setProfileId] = useState(null);
  const [data, setDataRaw] = useState(() => getCached() || defaultData);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const saveQueue = useRef({});

  // ── Load from Supabase on mount ──────────────────────────────────────────
  useEffect(() => {
    loadAllData().then(remote => {
      if (remote && (remote.pipeline.length > 0 || remote.hypotheses.length > 0)) {
        setDataRaw(remote);
        setCache(remote);
      } else if (!getCached()) {
        // First ever load — seed with defaults
        defaultData.pipeline.forEach(l => saveLead(l));
        defaultData.hypotheses.forEach(h => saveHypothesis(h));
        defaultData.insights.forEach(i => saveInsight(i));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // ── Debounced Supabase sync ──────────────────────────────────────────────
  const syncToSupabase = useCallback((next) => {
    setSyncing(true);
    clearTimeout(saveQueue.current.timer);
    saveQueue.current.timer = setTimeout(async () => {
      try {
        await Promise.all([
          ...next.pipeline.map(l => saveLead(l)),
          ...next.hypotheses.map(h => saveHypothesis(h)),
          ...next.insights.map(i => saveInsight(i)),
        ]);
      } catch(e) { console.error('Sync error', e); }
      setSyncing(false);
    }, 1200); // debounce — waits 1.2s after last change
  }, []);

  const setData = useCallback(updater => {
    setDataRaw(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      setCache(next);
      syncToSupabase(next);
      return next;
    });
  }, [syncToSupabase]);

  const activeLead = profileId ? data.pipeline.find(l => l.id === profileId) : null;
  function openLead(id) { setProfileId(id); }
  function closeLead() { setProfileId(null); }

  const totalPipeline = data.pipeline.reduce((a, l) => a + (l.dealSize || 0), 0);
  const leakCount = data.pipeline.filter(isPipelineLeak).length;
  const patternCount = detectPatterns(data.pipeline).length;
  const validH = data.hypotheses.filter(h => h.status === "Validated").length;

  const isProfile = !!activeLead;
  const title = isProfile ? activeLead.leadName : PAGE_TITLES[page];

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf7f4", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center", color: "#7a6460" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 8 }}>✦ Signal</div>
        <div style={{ fontSize: 13 }}>Loading your dashboard…</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="dash">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-name">✦ Signal</div>
            <div className="logo-sub">Founder OS · PMF Dashboard</div>
          </div>
          <div className="nav-sect">
            <div className="nav-sect-label">Workspace</div>
            {NAV.map(n => (
              <div key={n.id} className={`nav-item ${!isProfile && page === n.id ? "active" : ""}`}
                onClick={() => { setPage(n.id); setProfileId(null); }}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
          </div>
          <div className="nav-sect">
            <div className="nav-sect-label">Quick Access</div>
            {data.pipeline.filter(l => l.priorityScore >= 4).slice(0, 4).map(l => (
              <div key={l.id} className={`nav-item ${profileId === l.id ? "active" : ""}`} onClick={() => openLead(l.id)}>
                <span className="nav-icon" style={{ fontSize: 9 }}>●</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11.5 }}>{l.leadName}</span>
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            {leakCount > 0 && <div className="sidebar-alert">🚨 {leakCount} pipeline leak{leakCount > 1 ? "s" : ""}</div>}
            {patternCount > 0 && <div className="sidebar-signal">🔍 {patternCount} pattern{patternCount > 1 ? "s" : ""} detected</div>}
            <div className="sidebar-sync">{syncing ? "⟳ Syncing…" : "✓ Synced to cloud"}</div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-left">
              {isProfile && (
                <button className="back-btn" onClick={closeLead}>← Pipeline</button>
              )}
              <div className="topbar-title">{title}</div>
            </div>
            <div className="topbar-date">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
          </div>

          {/* KPI BAR */}
          {!isProfile && (
            <div className="kpi-bar">
              <div className="kpi-card">
                <div className="kpi-lbl">Pipeline Value</div>
                <div className="kpi-val">${(totalPipeline/1000).toFixed(0)}K</div>
                <div className="kpi-sub">{data.pipeline.length} active leads</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-lbl">Pipeline Leaks</div>
                <div className="kpi-val" style={{ color: leakCount > 0 ? p.danger : p.success }}>{leakCount}</div>
                <div className="kpi-sub">no next action</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-lbl">Patterns</div>
                <div className="kpi-val" style={{ color: patternCount > 0 ? p.success : p.textLight }}>{patternCount}</div>
                <div className="kpi-sub">recurring pain signals</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-lbl">Hypotheses</div>
                <div className="kpi-val">{data.hypotheses.length}</div>
                <div className="kpi-sub">{validH} validated</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-lbl">Insights Logged</div>
                <div className="kpi-val">{data.insights.length}</div>
                <div className="kpi-sub">across all segments</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-lbl">Conversations</div>
                <div className="kpi-val">{data.pipeline.reduce((a, l) => a + (l.touchLog || []).length, 0)}</div>
                <div className="kpi-sub">total touchpoints</div>
              </div>
            </div>
          )}

          {/* CONTENT */}
          <div className="content">
            {isProfile
              ? <LeadProfile lead={activeLead} data={data} setData={setData} onBack={closeLead} />
              : page === "pipeline" ? <PipelineView data={data} setData={setData} onOpenLead={openLead} />
              : page === "metrics" ? <MetricsView data={data} />
              : page === "hypotheses" ? <HypothesisView data={data} setData={setData} />
              : page === "conversations" ? <ConversationsView data={data} setData={setData} onOpenLead={openLead} />
              : <InsightsView data={data} setData={setData} />
            }

            <div className="page-footer">
              <div className="next-exp">✦ Next Experiment to Validate: Which segment converts fastest from Discovery → Pilot?</div>
              <button className="btn btn-ghost" style={{ fontSize: 11 }} onClick={() => {
                const headers = "ID,Lead,Company,Sector,SubSegment,Stage,Urgency,Budget Owner,Pain Quote,Deal Size,Probability,Last Touch,Next Action Date,Health Score";
                const rows = data.pipeline.map(l => [l.id,l.leadName,l.company,l.sector,l.subSegment,l.stage,l.urgency,l.budgetOwner,`"${(l.painQuote||"").replace(/"/g,"'")}"`,l.dealSize,l.probability,l.lastTouch,l.nextActionDate,healthScore(l)].join(","));
                navigator.clipboard.writeText(headers + "\n" + rows.join("\n"));
                alert("Pipeline CSV copied to clipboard!");
              }}>
                Export CSV
              </button>
            </div>
          </div>
        </main>

        {/* MOBILE BOTTOM NAV */}
        <nav className="mobile-nav">
          {[
            { id:"pipeline", label:"Pipeline", icon:"◈" },
            { id:"metrics",  label:"Metrics",  icon:"◉" },
            { id:"hypotheses", label:"Hypotheses", icon:"◇" },
            { id:"insights", label:"Insights", icon:"◎" },
            { id:"conversations", label:"Convos", icon:"◌" },
          ].map(n => (
            <button key={n.id}
              className={`mobile-nav-item ${!isProfile && page === n.id ? "active" : ""}`}
              onClick={() => { setPage(n.id); setProfileId(null); }}>
              <span className="m-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
