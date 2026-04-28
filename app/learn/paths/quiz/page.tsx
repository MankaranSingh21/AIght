'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import QuizToolRecs from '@/components/QuizToolRecs';
import { usePostHog } from 'posthog-js/react';
import fieldsData from '@/content/paths/fields.json';

/* ─── Types ─────────────────────────────────────────────────────────────────── */

type AnswerValue = string | string[] | number;
type Answers = Record<string, AnswerValue>;
type Screen = 'intro' | 'quiz' | 'calculating' | 'report';
type RiskCategory = 'high' | 'medium' | 'low';
type QType = 'field-select' | 'single' | 'multi' | 'slider' | 'text';

interface Opt { value: string; label: string; sub?: string }
interface Question {
  id: string; text: string; subtext?: string; type: QType;
  options?: Opt[]; minLabel?: string; maxLabel?: string; placeholder?: string;
}
interface Section { id: number; title: string; subtitle: string; questions: Question[] }
interface FieldEntry {
  field: string; slug: string; tagline: string;
  tools: Array<{ name: string; what_it_does: string }>;
  concepts: string[]; action_paragraph: string;
  impact_data: {
    replacement_risk: number; roles_at_risk: string[]; roles_growing: string[];
    timeline: Array<{ year: number; label: string; description: string }>;
  };
}
interface ScoreResult {
  score: number; category: RiskCategory;
  breakdown: Record<string, number>;
}

/* ─── Static option sets ────────────────────────────────────────────────────── */

const FIELDS = fieldsData as FieldEntry[];
const FIELD_OPTS: Opt[] = [
  ...FIELDS.map(f => ({ value: f.slug, label: f.field })),
  { value: 'other', label: 'Other / Not listed' },
];
const SENIORITY_OPTS: Opt[] = [
  { value: 'junior',   label: 'Junior / Entry-level',     sub: '0–3 years in role' },
  { value: 'mid',      label: 'Mid-level',                 sub: 'Growing independence' },
  { value: 'senior',   label: 'Senior / Specialist',       sub: 'Deep domain expertise' },
  { value: 'lead',     label: 'Lead / Manager',            sub: 'Directing others' },
  { value: 'director', label: 'Director / Executive',      sub: 'Strategic decision-maker' },
];
const YEARS_OPTS: Opt[] = [
  { value: 'lt1',   label: 'Less than 1 year' },
  { value: '1to3',  label: '1–3 years' },
  { value: '3to7',  label: '3–7 years' },
  { value: '7to15', label: '7–15 years' },
  { value: 'gt15',  label: '15+ years' },
];
const ORG_OPTS: Opt[] = [
  { value: 'solo',       label: 'Solo / Freelance' },
  { value: 'micro',      label: '2–10 people' },
  { value: 'small',      label: '11–50 people' },
  { value: 'medium',     label: '51–500 people' },
  { value: 'large',      label: '500–5,000 people' },
  { value: 'enterprise', label: '5,000+ people' },
];
const RESPONSIBILITIES_OPTS: Opt[] = [
  { value: 'data_analysis',       label: 'Data analysis & reporting' },
  { value: 'writing_drafting',    label: 'Writing & drafting documents' },
  { value: 'research',            label: 'Research & synthesis' },
  { value: 'client_comms',        label: 'Client or patient communication' },
  { value: 'project_mgmt',        label: 'Project coordination & management' },
  { value: 'creative_prod',       label: 'Creative production (design, writing, media)' },
  { value: 'code_technical',      label: 'Coding or technical development' },
  { value: 'decision_making',     label: 'High-stakes decision making' },
  { value: 'teaching_training',   label: 'Teaching, training, or facilitation' },
  { value: 'compliance_admin',    label: 'Compliance, admin, or paperwork' },
  { value: 'strategy_planning',   label: 'Strategic planning & vision' },
  { value: 'physical_hands_on',   label: 'Physical / hands-on work' },
  { value: 'sales_negotiation',   label: 'Sales, negotiation, or business development' },
  { value: 'support_counselling', label: 'Support, counselling, or care' },
];
const AI_TOOLS_OPTS: Opt[] = [
  { value: 'chatgpt',    label: 'ChatGPT (OpenAI)' },
  { value: 'claude',     label: 'Claude (Anthropic)' },
  { value: 'gemini',     label: 'Gemini (Google)' },
  { value: 'copilot',    label: 'Copilot (Microsoft)' },
  { value: 'midjourney', label: 'Midjourney or image AI' },
  { value: 'cursor',     label: 'Cursor or AI coding tools' },
  { value: 'perplexity', label: 'Perplexity or AI search' },
  { value: 'notion_ai',  label: 'Notion AI or writing aids' },
  { value: 'specialized',label: 'Specialised tools for my field' },
  { value: 'none',       label: 'None yet' },
];
const LEARN_FORMAT_OPTS: Opt[] = [
  { value: 'courses',    label: 'Structured online courses' },
  { value: 'tutorials',  label: 'Tutorials & guides' },
  { value: 'hands_on',   label: 'Hands-on experimentation' },
  { value: 'reading',    label: 'Reading & research' },
  { value: 'mentorship', label: 'Mentorship or peer learning' },
  { value: 'workshops',  label: 'Workshops & live training' },
  { value: 'community',  label: 'Online communities' },
];
const WORRIES_OPTS: Opt[] = [
  { value: 'job_loss',        label: 'Losing my job or income' },
  { value: 'skill_obsol',     label: 'My skills becoming obsolete' },
  { value: 'wage_pressure',   label: 'Downward pressure on wages' },
  { value: 'quality_erosion', label: 'AI eroding quality standards in my field' },
  { value: 'ethics',          label: 'Ethical misuse of AI' },
  { value: 'monopoly',        label: 'Power concentration in a few companies' },
  { value: 'nothing',         label: 'I am not particularly worried' },
];

/* ─── Sections ──────────────────────────────────────────────────────────────── */

const S1: Section = {
  id: 1, title: 'Your Field & Role',
  subtitle: 'Understanding where you work and what you do.',
  questions: [
    { id: 'field', text: 'Which field do you primarily work in?',
      subtext: 'Select the one that best describes your domain.', type: 'field-select' },
    { id: 'role_title', text: 'What is your current role or job title?',
      subtext: 'Be specific — "Senior Radiologist" is more useful than "Doctor".',
      type: 'text', placeholder: 'e.g. Clinical Nurse Specialist, UX Lead, High School Physics Teacher…' },
    { id: 'years_experience', text: 'How many years have you worked in this field?',
      type: 'single', options: YEARS_OPTS },
    { id: 'seniority', text: 'How would you describe your seniority?',
      type: 'single', options: SENIORITY_OPTS },
    { id: 'org_size', text: 'What is the size of your organisation or practice?',
      type: 'single', options: ORG_OPTS },
  ],
};

const S2: Section = {
  id: 2, title: 'Your Daily Work',
  subtitle: 'The nature of your tasks matters far more than your title.',
  questions: [
    { id: 'routine_pct', text: 'What percentage of your work involves routine or repeatable tasks?',
      subtext: 'Things done the same way each time — templated writing, standard reports, data entry, scheduled processes.',
      type: 'slider', minLabel: '0%  — everything is unique', maxLabel: '100% — mostly repetition' },
    { id: 'creative_pct', text: 'What percentage involves genuinely original thinking?',
      subtext: 'Generating new ideas, solving novel problems, making creative or strategic judgments.',
      type: 'slider', minLabel: '0%  — execution only', maxLabel: '100% — entirely creative' },
    { id: 'human_pct', text: 'What percentage requires direct human interaction with care, judgment, or empathy?',
      subtext: 'Patient consultations, client advising, teaching, counselling, negotiation.',
      type: 'slider', minLabel: '0%  — solo / screen work', maxLabel: '100% — all about people' },
    { id: 'responsibilities', text: 'Which best describe your main daily responsibilities?',
      subtext: 'Select all that apply.',
      type: 'multi', options: RESPONSIBILITIES_OPTS },
    { id: 'decision_stakes', text: 'How often do you make decisions with significant consequences — for people, finances, or safety?',
      type: 'single', options: [
        { value: 'constantly', label: 'Constantly',  sub: 'High-stakes choices are the core of my job' },
        { value: 'regularly',  label: 'Regularly',   sub: 'Several times a week' },
        { value: 'sometimes',  label: 'Sometimes',   sub: 'Occasionally, as situations arise' },
        { value: 'rarely',     label: 'Rarely',      sub: 'Most of my work is lower-stakes' },
      ] },
  ],
};

const S3: Section = {
  id: 3, title: 'Your AI Relationship',
  subtitle: 'How you engage with AI today shapes your trajectory significantly.',
  questions: [
    { id: 'ai_frequency', text: 'How often do you currently use AI tools in your work?',
      type: 'single', options: [
        { value: 'daily',     label: 'Daily',                sub: 'AI is part of my regular workflow' },
        { value: 'weekly',    label: 'Several times a week' },
        { value: 'sometimes', label: 'Occasionally',         sub: 'When I remember or need to' },
        { value: 'rarely',    label: 'Rarely',               sub: 'Tried it but not consistently' },
        { value: 'never',     label: 'Not yet',              sub: 'Have not started using AI tools' },
      ] },
    { id: 'ai_tools_used', text: 'Which AI tools have you used?',
      subtext: 'Select all that apply.', type: 'multi', options: AI_TOOLS_OPTS },
    { id: 'ai_comfort', text: 'How comfortable are you with AI tools overall?',
      type: 'single', options: [
        { value: '5', label: 'Very comfortable', sub: 'I understand how they work and use them confidently' },
        { value: '4', label: 'Comfortable',       sub: 'Use them regularly with good results' },
        { value: '3', label: 'Moderate',          sub: 'Can use them but still learning' },
        { value: '2', label: 'Uncertain',         sub: 'Find them confusing or unpredictable' },
        { value: '1', label: 'Uncomfortable',     sub: 'Prefer to avoid them' },
      ] },
    { id: 'ai_org_support', text: 'Has your organisation provided training or guidance on AI?',
      type: 'single', options: [
        { value: 'formal',      label: 'Yes — formal training programmes' },
        { value: 'informal',    label: 'Yes — informal guidance or resources' },
        { value: 'self_taught', label: 'No — I have taught myself' },
        { value: 'none',        label: 'No training of any kind' },
        { value: 'na',          label: 'Not applicable (solo / freelance)' },
      ] },
    { id: 'ai_impact_felt', text: 'To what degree has AI already changed your day-to-day work?',
      type: 'single', options: [
        { value: 'significantly', label: 'Significantly', sub: 'My workflows have materially changed' },
        { value: 'somewhat',      label: 'Somewhat',      sub: 'Some tasks are different, most are the same' },
        { value: 'barely',        label: 'Barely',        sub: 'I notice it but it has not changed much' },
        { value: 'not_at_all',    label: 'Not at all yet' },
      ] },
    { id: 'ai_quality', text: 'When you use AI tools, how is the quality for your work?',
      type: 'single', options: [
        { value: 'excellent', label: 'Excellent',          sub: 'Often better than I could produce alone, faster' },
        { value: 'good',      label: 'Good',               sub: 'Useful but requires editing or validation' },
        { value: 'variable',  label: 'Variable',           sub: 'Sometimes good, sometimes off the mark' },
        { value: 'poor',      label: 'Poor',               sub: 'Not yet good enough for my field' },
        { value: 'na',        label: 'Not enough experience to say' },
      ] },
  ],
};

const S5: Section = {
  id: 5, title: 'Learning & Adaptability',
  subtitle: 'Your willingness to adapt is the strongest protective factor in any assessment.',
  questions: [
    { id: 'learning_openness', text: 'How open are you to learning new skills to work effectively with AI?',
      subtext: 'Be honest with yourself — this is one of the most significant inputs to your score.',
      type: 'slider', minLabel: 'Not open at all', maxLabel: 'Completely committed' },
    { id: 'hours_per_week', text: 'Realistically, how many hours per week could you dedicate to upskilling?',
      type: 'single', options: [
        { value: 'lt1',    label: 'Less than 1 hour' },
        { value: '1to3',   label: '1–3 hours' },
        { value: '3to5',   label: '3–5 hours' },
        { value: '5to10',  label: '5–10 hours' },
        { value: 'gt10',   label: '10+ hours' },
      ] },
    { id: 'learning_format', text: 'How do you learn best?',
      subtext: 'Select your preferred formats.',
      type: 'multi', options: LEARN_FORMAT_OPTS },
    { id: 'already_learning', text: 'Have you started learning AI-related skills for your field?',
      type: 'single', options: [
        { value: 'actively',  label: 'Yes, actively',    sub: 'Enrolled in something or practising regularly' },
        { value: 'exploring', label: 'Exploring',        sub: 'Reading and experimenting informally' },
        { value: 'planning',  label: 'Planning to start', sub: 'Not yet, but I have a clear plan' },
        { value: 'not_yet',   label: 'Not yet' },
      ] },
    { id: 'learning_motivation', text: 'What would most motivate you to invest in adapting?',
      type: 'single', options: [
        { value: 'security',      label: 'Job security',          sub: 'Protecting my current position' },
        { value: 'advancement',   label: 'Career advancement',    sub: 'Getting ahead by being early' },
        { value: 'curiosity',     label: 'Genuine curiosity',     sub: 'I find this genuinely interesting' },
        { value: 'effectiveness', label: 'Being better at my work', sub: 'Doing the job with less friction' },
        { value: 'employer',      label: 'Employer or client requirement' },
      ] },
  ],
};

const S6: Section = {
  id: 6, title: 'Your Outlook',
  subtitle: 'Your perspective on the longer arc.',
  questions: [
    { id: 'concern_level', text: 'How concerned are you about AI affecting your career over the next five years?',
      type: 'slider', minLabel: 'Not concerned', maxLabel: 'Highly concerned' },
    { id: 'five_year_goal', text: 'What best describes your five-year career direction?',
      type: 'single', options: [
        { value: 'advance',     label: 'Advance within my current field and role type' },
        { value: 'pivot_role',  label: 'Stay in my field but shift into a different role' },
        { value: 'adjacent',    label: 'Move into an adjacent or emerging field' },
        { value: 'leadership',  label: 'Move into leadership or strategy' },
        { value: 'independent', label: 'Build something independently (consulting, startup, practice)' },
        { value: 'unsure',      label: 'Genuinely unsure' },
      ] },
    { id: 'ai_worries', text: 'What worries you most about AI in your field?',
      subtext: 'Select all that resonate.',
      type: 'multi', options: WORRIES_OPTS },
    { id: 'ai_hope', text: 'What do you most hope AI does for your field?',
      subtext: 'Optional — but this often surfaces what you actually care about.',
      type: 'text', placeholder: 'e.g. "Free us from admin work so we can focus on the actual practice…"' },
  ],
};

/* ─── Domain-specific sections (Section 4) ──────────────────────────────────── */

const DOMAIN: Record<string, Section> = {
  healthcare: {
    id: 4, title: 'Your Clinical Context',
    subtitle: 'Questions specific to healthcare and patient-facing roles.',
    questions: [
      { id: 'domain_patient_pct', text: 'What percentage of your time involves direct patient or client care?',
        subtext: 'Consultations, examinations, therapy sessions, procedures.',
        type: 'slider', minLabel: '0%  — no direct care', maxLabel: '100% — entirely patient-facing' },
      { id: 'domain_documentation', text: 'How much of your working day goes to documentation, notes, or admin?',
        type: 'slider', minLabel: 'Almost none', maxLabel: 'Most of my time' },
      { id: 'domain_decision_type', text: 'How would you describe the nature of most decisions you make?',
        type: 'single', options: [
          { value: 'diagnostic',    label: 'Diagnosis & treatment planning',    sub: 'Complex clinical judgment' },
          { value: 'monitoring',    label: 'Monitoring & follow-up care',       sub: 'Protocol-guided, less ambiguous' },
          { value: 'admin',         label: 'Administrative & process decisions', sub: 'Scheduling, documentation, approvals' },
          { value: 'research',      label: 'Research & data analysis' },
        ] },
      { id: 'domain_protocol', text: 'How much of your work follows strict protocols vs requires individual judgment?',
        type: 'single', options: [
          { value: 'highly_structured',    label: 'Highly structured',       sub: 'Clear protocols for nearly every scenario' },
          { value: 'mostly_structured',    label: 'Mostly structured',       sub: 'Guidelines exist but I adapt them often' },
          { value: 'discretionary',        label: 'Significant discretion',  sub: 'My judgment is central to most decisions' },
          { value: 'highly_discretionary', label: 'Highly individualised',   sub: 'Every case is essentially unique' },
        ] },
    ],
  },
  legal: {
    id: 4, title: 'Your Legal Practice',
    subtitle: 'Questions tailored to law and legal services.',
    questions: [
      { id: 'domain_research_pct', text: 'What percentage of your work involves document review, research, or drafting?',
        type: 'slider', minLabel: '0%  — none', maxLabel: '100% — almost all' },
      { id: 'domain_practice_area', text: 'Which best describes your practice area?',
        type: 'single', options: [
          { value: 'litigation',    label: 'Litigation & advocacy',        sub: 'Courtroom, disputes, hearings' },
          { value: 'transactional', label: 'Transactional / corporate',    sub: 'M&A, contracts, commercial' },
          { value: 'regulatory',    label: 'Regulatory & compliance',      sub: 'Rules, filings, approvals' },
          { value: 'advisory',      label: 'Legal advisory',               sub: 'Counsel and strategic guidance' },
          { value: 'family_crim',   label: 'Family / criminal / public interest' },
        ] },
      { id: 'domain_client', text: 'How much of your work is directly client-facing?',
        type: 'single', options: [
          { value: 'mostly_client',  label: 'Mostly client-facing',     sub: 'Client contact is the core of my role' },
          { value: 'half_half',      label: 'About half and half' },
          { value: 'mostly_behind',  label: 'Mostly behind the scenes', sub: 'Research, drafting, analysis' },
          { value: 'no_client',      label: 'No direct client contact' },
        ] },
      { id: 'domain_templated', text: 'How much of your drafting or research work is templated or formulaic?',
        type: 'single', options: [
          { value: 'mostly_standard', label: 'Mostly standard',     sub: 'Documents largely follow established templates' },
          { value: 'about_half',      label: 'About half',          sub: 'Mix of standard and bespoke' },
          { value: 'mostly_custom',   label: 'Mostly custom',       sub: 'Each matter requires significant original thinking' },
          { value: 'entirely_custom', label: 'Almost entirely bespoke' },
        ] },
    ],
  },
  finance: {
    id: 4, title: 'Your Financial Role',
    subtitle: 'Questions specific to finance and economics.',
    questions: [
      { id: 'domain_quant_pct', text: 'What percentage of your work involves quantitative analysis, modelling, or algorithmic work?',
        type: 'slider', minLabel: '0%  — qualitative only', maxLabel: '100% — entirely quantitative' },
      { id: 'domain_client_advisory', text: 'How much of your role involves direct client relationships and advisory?',
        type: 'single', options: [
          { value: 'primary',    label: 'Primary function',     sub: 'Client relationships are central' },
          { value: 'significant',label: 'Significant part',     sub: 'Regular client interaction' },
          { value: 'minor',      label: 'Minor part',           sub: 'Occasional client-facing work' },
          { value: 'none',       label: 'No direct client contact', sub: 'Purely analytical or technical' },
        ] },
      { id: 'domain_data_volume', text: 'Do you regularly work with very large datasets or high-frequency data?',
        type: 'single', options: [
          { value: 'yes_daily',  label: 'Yes, daily',   sub: 'Big data, quant models, or algo systems' },
          { value: 'sometimes',  label: 'Sometimes',    sub: 'Periodic large-scale analysis' },
          { value: 'rarely',     label: 'Rarely',       sub: 'Mostly standard-sized datasets' },
          { value: 'no',         label: 'No',           sub: 'Primarily qualitative or advisory' },
        ] },
      { id: 'domain_decision_value', text: 'What is the typical monetary scale of decisions you personally influence?',
        type: 'single', options: [
          { value: 'small',     label: 'Under $50,000' },
          { value: 'medium',    label: '$50k – $1M' },
          { value: 'large',     label: '$1M – $100M' },
          { value: 'very_large',label: '$100M+' },
          { value: 'na',        label: 'Not applicable / hard to quantify' },
        ] },
    ],
  },
  creative: {
    id: 4, title: 'Your Creative Practice',
    subtitle: 'Questions specific to creative and design fields.',
    questions: [
      { id: 'domain_original_pct', text: 'What percentage of your work involves original concept creation vs executing on a brief?',
        type: 'slider', minLabel: '0%  — mostly execution', maxLabel: '100% — entirely conceptual' },
      { id: 'domain_client_personal', text: 'Is your creative work primarily driven by client briefs or personal vision?',
        type: 'single', options: [
          { value: 'client_driven', label: 'Mostly client-driven',       sub: 'Briefs and deliverables set the agenda' },
          { value: 'balanced',      label: 'A real balance of both' },
          { value: 'personal',      label: 'Mostly personal or artistic', sub: 'My vision is the primary driver' },
        ] },
      { id: 'domain_style_value', text: 'How central is your personal style or voice to the value people pay for?',
        type: 'single', options: [
          { value: 'core',        label: 'It is the core of what I offer',    sub: 'People hire me specifically for my style' },
          { value: 'important',   label: 'Very important but not unique to me' },
          { value: 'somewhat',    label: 'Somewhat important',                sub: 'Style matters but outcomes matter more' },
          { value: 'not_central', label: 'Not a key factor',                  sub: 'Valued mainly for execution speed' },
        ] },
      { id: 'domain_production_pct', text: 'What percentage of your time goes to production and execution vs direction and ideation?',
        type: 'slider', minLabel: '0%  — all direction / ideation', maxLabel: '100% — all production' },
    ],
  },
  education: {
    id: 4, title: 'Your Teaching Context',
    subtitle: 'Questions specific to education and learning.',
    questions: [
      { id: 'domain_instruction_pct', text: 'What percentage of your time is direct instruction, facilitation, or live teaching?',
        type: 'slider', minLabel: '0%  — no live teaching', maxLabel: '100% — teaching constantly' },
      { id: 'domain_learner_level', text: 'What age group or level do you primarily work with?',
        type: 'single', options: [
          { value: 'early_childhood',   label: 'Early childhood (0–8)' },
          { value: 'k12',               label: 'K–12 / Secondary school' },
          { value: 'higher_ed',         label: 'Higher education / University' },
          { value: 'adult_professional',label: 'Adult or professional learners' },
          { value: 'all_ages',          label: 'All ages / varies' },
        ] },
      { id: 'domain_individual_pct', text: 'How much of your work involves individualised support for specific students?',
        subtext: 'One-on-one tutoring, differentiated instruction, coaching.',
        type: 'slider', minLabel: '0%  — fully standardised', maxLabel: '100% — entirely individualised' },
      { id: 'domain_curriculum', text: 'How significant is curriculum design or assessment creation in your role?',
        type: 'single', options: [
          { value: 'major',       label: 'Major focus',         sub: 'I design significant learning experiences' },
          { value: 'significant', label: 'Significant part',    sub: 'Regular design work alongside teaching' },
          { value: 'minor',       label: 'Minor part',          sub: 'Mostly delivery, others design' },
          { value: 'none',        label: 'Not in my role' },
        ] },
    ],
  },
  science: {
    id: 4, title: 'Your Research Context',
    subtitle: 'Questions tailored to scientific and research roles.',
    questions: [
      { id: 'domain_lab_pct', text: 'What percentage of your time is hands-on bench work, fieldwork, or physical data collection?',
        type: 'slider', minLabel: '0%  — purely computational', maxLabel: '100% — entirely hands-on' },
      { id: 'domain_analysis_pct', text: 'How much involves computational analysis, modelling, or literature synthesis?',
        type: 'slider', minLabel: '0%  — no computational work', maxLabel: '100% — mostly computational' },
      { id: 'domain_hypothesis_pct', text: 'How much involves novel hypothesis generation or theoretical reasoning?',
        subtext: 'As opposed to executing established methodologies.',
        type: 'slider', minLabel: '0%  — execution of methods', maxLabel: '100% — almost all hypothesis / theory' },
      { id: 'domain_output', text: 'What is your primary research output or orientation?',
        type: 'single', options: [
          { value: 'academic',       label: 'Academic publications',       sub: 'Peer-reviewed papers' },
          { value: 'applied_rd',     label: 'Applied R&D',                 sub: 'Industry-oriented or product development' },
          { value: 'operational',    label: 'Operational / regulatory',    sub: 'Testing, compliance, quality assurance' },
          { value: 'translational',  label: 'Translational / clinical',    sub: 'Bridging lab to patient or market' },
        ] },
    ],
  },
  media: {
    id: 4, title: 'Your Media & Marketing Context',
    subtitle: 'Questions specific to journalism, marketing, and communications.',
    questions: [
      { id: 'domain_strategy_pct', text: 'What percentage of your work is strategy, research, or planning vs content production?',
        type: 'slider', minLabel: '0%  — entirely production', maxLabel: '100% — entirely strategy' },
      { id: 'domain_volume_pct', text: 'How much of your content is high-volume / templated vs uniquely crafted?',
        type: 'slider', minLabel: '0%  — every piece is unique', maxLabel: '100% — mostly volume / templated' },
      { id: 'domain_audience', text: 'What is the typical scale of your audience or campaign reach?',
        type: 'single', options: [
          { value: 'local',    label: 'Local or niche',     sub: 'Thousands or a specific community' },
          { value: 'regional', label: 'Regional',           sub: 'Tens of thousands' },
          { value: 'national', label: 'National',           sub: 'Hundreds of thousands' },
          { value: 'global',   label: 'Global',             sub: 'Millions' },
          { value: 'varies',   label: 'Varies widely by project' },
        ] },
      { id: 'domain_fact_based', text: 'How much of your work requires deep factual investigation or original reporting?',
        type: 'single', options: [
          { value: 'most',   label: 'Most of it',    sub: 'Original investigation is central to my role' },
          { value: 'half',   label: 'About half',    sub: 'Mix of original and synthesised' },
          { value: 'some',   label: 'Some',          sub: 'Mostly synthesising existing sources' },
          { value: 'little', label: 'Very little',   sub: 'Primarily promotional or derivative content' },
        ] },
    ],
  },
  social: {
    id: 4, title: 'Your Human-Centred Practice',
    subtitle: 'Questions for social, psychological, and humanities roles.',
    questions: [
      { id: 'domain_human_support', text: 'What percentage of your work involves direct human support, counselling, care, or advocacy?',
        type: 'slider', minLabel: '0%  — no direct support', maxLabel: '100% — entirely human-facing' },
      { id: 'domain_pattern_pct', text: 'How much involves pattern recognition across large datasets, archives, or case histories?',
        type: 'slider', minLabel: '0%  — no large-scale analysis', maxLabel: '100% — mostly large-scale synthesis' },
      { id: 'domain_empathy', text: 'How central is empathy, lived experience, or relational trust to your work\'s value?',
        type: 'single', options: [
          { value: 'core',           label: 'It is the core',            sub: 'Without human connection, the work cannot happen' },
          { value: 'very_important', label: 'Very important',            sub: 'A key differentiator of my effectiveness' },
          { value: 'somewhat',       label: 'Somewhat important',        sub: 'Helpful but not strictly essential' },
          { value: 'not_central',    label: 'Not central',               sub: 'Primarily analytical or academic work' },
        ] },
      { id: 'domain_context', text: 'What context do you primarily work in?',
        type: 'single', options: [
          { value: 'community',    label: 'Community-based',        sub: 'NGO, grassroots, outreach' },
          { value: 'institutional',label: 'Institutional',          sub: 'Hospital, school, government' },
          { value: 'independent',  label: 'Independent practice',   sub: 'Private practice, freelance' },
          { value: 'academic',     label: 'Research or academic',   sub: 'University, think tank' },
        ] },
    ],
  },
  default: {
    id: 4, title: 'Your Specific Context',
    subtitle: 'A few more questions about the nature of your work.',
    questions: [
      { id: 'domain_judgment_pct', text: 'What percentage of your work requires expert judgment that is hard to encode as rules?',
        subtext: 'Things requiring deep intuition, contextual understanding, or professional discretion.',
        type: 'slider', minLabel: '0%  — mostly rule-based', maxLabel: '100% — almost all judgment' },
      { id: 'domain_stakeholder_pct', text: 'How much involves managing stakeholder relationships, negotiations, or coordination?',
        type: 'slider', minLabel: '0%  — solo or internal only', maxLabel: '100% — mostly stakeholder work' },
      { id: 'domain_technical_pct', text: 'How much involves specialised technical analysis or deep domain knowledge?',
        type: 'slider', minLabel: '0%  — generalist work', maxLabel: '100% — deep specialist work' },
      { id: 'domain_unique', text: 'How often does your work require understanding highly unique context — situations that do not fit patterns?',
        type: 'single', options: [
          { value: 'almost_always', label: 'Almost always',  sub: 'Very little repeats; context always unique' },
          { value: 'often',         label: 'Often',          sub: 'Regular novel situations' },
          { value: 'sometimes',     label: 'Sometimes',      sub: 'Mix of familiar and novel' },
          { value: 'rarely',        label: 'Rarely',         sub: 'Most situations follow familiar patterns' },
        ] },
    ],
  },
};

/* ─── Utilities ─────────────────────────────────────────────────────────────── */

function getFieldGroup(slug: string): string {
  const m: Record<string, string> = {
    'medicine-healthcare': 'healthcare', 'pharmacy-drug-discovery': 'healthcare',
    'law-legal': 'legal',
    'finance-economics': 'finance',
    'creative-writing-literature': 'creative', 'graphic-design-visual-arts': 'creative',
    'film-video-production': 'creative',        'music-audio': 'creative',
    'education-teaching': 'education',
    'biology': 'science', 'physics-engineering': 'science',
    'chemistry-materials-science': 'science',   'environmental-science-climate': 'science',
    'agriculture-food-science': 'science',
    'journalism-media': 'media', 'marketing-advertising': 'media',
    'psychology-mental-health': 'social', 'social-work-public-policy': 'social',
    'history-humanities': 'social',
    'architecture-urban-design': 'default',
  };
  return m[slug] ?? 'default';
}

function conceptToSlug(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('retrieval') || t.includes('rag')) return 'rag';
  if (t.includes('mcp') || t.includes('model context')) return 'mcp';
  if (t.includes('agent') || t.includes('agentic') || t.includes('autonomous') || t.includes('closed-loop')) return 'agents';
  if (t.includes('embed') || t.includes('vector')) return 'embeddings';
  if (t.includes('transformer') || t.includes('attention') || t.includes('multimodal')) return 'transformers';
  return 'fine-tuning';
}

/* ─── Scoring ───────────────────────────────────────────────────────────────── */

function computeScore(answers: Answers, field: FieldEntry): ScoreResult {
  const base = field.impact_data.replacement_risk;
  const routine   = (answers.routine_pct ?? 50) as number;
  const creative  = (answers.creative_pct ?? 40) as number;
  const human     = (answers.human_pct ?? 30) as number;
  const openness  = (answers.learning_openness ?? 50) as number;
  const concern   = (answers.concern_level ?? 50) as number;
  const comfort   = parseInt((answers.ai_comfort as string) ?? '3', 10);

  const routineMod       = Math.round((routine - 50) * 0.24);
  const creativeMod      = Math.round((50 - creative) * 0.12);
  const humanMod         = human > 65 ? -8 : human > 40 ? -4 : human < 15 ? 3 : 0;
  const learningProtect  = Math.round(((openness - 50) / 50) * -9);
  const comfortMod       = comfort >= 4 ? -4 : comfort <= 2 ? 4 : 0;
  const concernAmp       = concern > 72 && openness < 35 ? 5 : 0;

  const freqMap: Record<string, number> = {
    daily: -12, weekly: -7, sometimes: -4, rarely: -2, never: 5 };
  const aiMitigation = freqMap[(answers.ai_frequency as string) ?? 'rarely'] ?? 0;

  const seniorMap: Record<string, number> = {
    junior: 5, mid: 2, senior: -3, lead: -6, director: -8 };
  const seniorityMod = seniorMap[(answers.seniority as string) ?? 'mid'] ?? 0;

  const yearsMap: Record<string, number> = {
    lt1: 3, '1to3': 1, '3to7': -1, '7to15': -3, gt15: -5 };
  const yearsMod = yearsMap[(answers.years_experience as string) ?? '3to7'] ?? 0;

  const alreadyMap: Record<string, number> = {
    actively: -5, exploring: -2, planning: 0, not_yet: 3 };
  const alreadyMod = alreadyMap[(answers.already_learning as string) ?? 'not_yet'] ?? 0;

  // Domain modifier
  const group = getFieldGroup(field.slug);
  let domainMod = 0;
  switch (group) {
    case 'healthcare': {
      const patPct = (answers.domain_patient_pct ?? 50) as number;
      const proto  = answers.domain_protocol as string;
      domainMod = patPct > 60 ? -8 : patPct < 20 ? 5 : 0;
      if (proto === 'highly_structured') domainMod += 6;
      if (proto === 'highly_discretionary') domainMod -= 6;
      break;
    }
    case 'legal': {
      const rPct    = (answers.domain_research_pct ?? 50) as number;
      const tplMap: Record<string, number> = {
        mostly_standard: 8, about_half: 4, mostly_custom: -2, entirely_custom: -6 };
      domainMod = Math.round((rPct - 50) * 0.15) + (tplMap[(answers.domain_templated as string) ?? ''] ?? 0);
      break;
    }
    case 'finance': {
      const qPct = (answers.domain_quant_pct ?? 50) as number;
      domainMod  = Math.round((qPct - 50) * 0.18);
      if (answers.domain_data_volume === 'yes_daily') domainMod += 6;
      break;
    }
    case 'creative': {
      const oPct    = (answers.domain_original_pct ?? 50) as number;
      const styleM: Record<string, number> = { core: -10, important: -5, somewhat: 0, not_central: 3 };
      domainMod = -Math.round((oPct - 50) * 0.15) + (styleM[(answers.domain_style_value as string) ?? ''] ?? 0);
      break;
    }
    case 'education': {
      const iPct = (answers.domain_individual_pct ?? 30) as number;
      domainMod  = iPct > 50 ? -6 : iPct < 20 ? 4 : 0;
      break;
    }
    case 'science': {
      const hyp = (answers.domain_hypothesis_pct ?? 30) as number;
      const lab = (answers.domain_lab_pct ?? 40) as number;
      domainMod = -Math.round(hyp * 0.08) + (lab < 20 ? -3 : 0);
      break;
    }
    case 'media': {
      const vol  = (answers.domain_volume_pct ?? 50) as number;
      const fbM: Record<string, number> = { most: -5, half: -2, some: 0, little: 4 };
      domainMod  = Math.round((vol - 50) * 0.2) + (fbM[(answers.domain_fact_based as string) ?? ''] ?? 0);
      break;
    }
    case 'social': {
      const hPct  = (answers.domain_human_support ?? 60) as number;
      const empM: Record<string, number> = { core: -9, very_important: -5, somewhat: 0, not_central: 3 };
      domainMod   = (hPct > 60 ? -6 : 0) + (empM[(answers.domain_empathy as string) ?? ''] ?? 0);
      break;
    }
    default: {
      const jPct = (answers.domain_judgment_pct ?? 50) as number;
      domainMod  = -Math.round((jPct - 50) * 0.1);
    }
  }

  const raw = base + routineMod + creativeMod + humanMod + learningProtect +
              comfortMod + aiMitigation + seniorityMod + yearsMod + alreadyMod +
              domainMod + concernAmp;
  const score    = Math.min(85, Math.max(5, Math.round(raw)));
  const category: RiskCategory = score >= 56 ? 'high' : score >= 31 ? 'medium' : 'low';

  return { score, category, breakdown: {
    base, routineMod, creativeMod, humanMod, learningProtect,
    aiMitigation, seniorityMod, domainMod,
  }};
}

function get90DayPlan(cat: RiskCategory, freq: string, fieldName: string): string[] {
  const hasAI = ['daily', 'weekly', 'sometimes'].includes(freq);
  if (cat === 'high') {
    return hasAI
      ? [`Identify 3 specific tasks in ${fieldName} you can delegate to AI tools this month`,
         'Complete one structured course on your field\'s most relevant AI application',
         'Build a small portfolio of AI-augmented work to signal adaptability to employers',
         `Map the adjacent roles in ${fieldName} that are growing — and the skill gap to get there`,
         'Connect with 3–5 peers in your field who are integrating AI effectively, and learn their approach']
      : [`Start using one AI tool this week — begin with a simple, low-stakes ${fieldName} task`,
         'Spend 30 minutes a day exploring Claude or ChatGPT for tasks you currently do manually',
         'Join a community or forum of practitioners in your field discussing AI adoption',
         'Document your current workflows in detail so you can identify what to augment',
         'Have an honest conversation with your manager about your organisation\'s AI roadmap'];
  }
  if (cat === 'medium') {
    return [`Audit your role: list which 20% of tasks AI will most likely affect in ${fieldName} in the next two years`,
            'Identify and begin using the 2–3 AI tools most directly relevant to your specific role',
            'Shift more of your time toward the high-judgment, relationship, and strategy work that AI struggles with',
            'Develop one new skill at the intersection of your domain expertise and AI capabilities',
            'Establish yourself as the person on your team who uses AI well — that position has real value'];
  }
  return [`Your depth in ${fieldName} is protective — invest in going even deeper, not broader`,
          `Study how AI is being used in ${fieldName} so you can lead adoption rather than react to it`,
          'Use AI as a research and productivity multiplier — not because you have to, but to stay ahead',
          'Focus on the most complex, ambiguous, human-centred problems in your work — those are your moat',
          'Consider whether there is an opportunity to build something at the intersection of your expertise and AI'];
}

function get1YearVision(cat: RiskCategory, fieldName: string): string[] {
  if (cat === 'high') {
    return [`You have transitioned into a role in ${fieldName} that AI cannot easily replicate — or into a clear growth position`,
            'You are fluent in 3–5 AI tools specific to your field and use them without friction',
            `You are recognised in your network as someone who understands both ${fieldName} and AI deeply`,
            'Your job security is grounded in human skills — judgment, relationships, ethics — that AI genuinely cannot replace'];
  }
  if (cat === 'medium') {
    return [`Your ${fieldName} role has evolved: you spend more time on the high-value, human-centred work that matters`,
            'AI handles the repeatable parts — you handle judgment, context, and care',
            `You have become a bridge person on your team, translating ${fieldName} expertise into AI-powered systems`,
            'Your output has measurably improved because of how you have learned to work alongside AI tools'];
  }
  return [`Your domain expertise in ${fieldName} is more valuable than ever — AI has raised the floor, not the ceiling`,
          `You are leading, not just participating in, AI integration within your corner of ${fieldName}`,
          'You have helped others through the transition — that has become part of your own distinctive value',
          'You are exploring whether to build AI-powered tools or practices that serve your field directly'];
}

/* ─── UI Helpers ────────────────────────────────────────────────────────────── */

const CAT_LABEL: Record<RiskCategory, string> = {
  high:   'High Disruption',
  medium: 'Augmentation Zone',
  low:    'Growth Position',
};
const CAT_COLOR: Record<RiskCategory, string> = {
  high:   '#E07070',
  medium: '#F4AB1F',
  low:    '#AAFF4D',
};
const CAT_DESCRIPTION: Record<RiskCategory, string> = {
  high:   'Your role as currently structured carries significant exposure to AI automation in the next 2–5 years. The good news: the path forward is clear, and the time to move is now.',
  medium: 'Your role will change substantially, but it will not disappear. AI will handle more of the repeatable work, freeing you — if you move intentionally — to do more of the high-value work.',
  low:    'Your role is well-positioned. The human skills at its core are genuinely hard for AI to replicate. The opportunity is not survival but leadership: you can shape how AI enters your field.',
};

/* ─── Score Arc SVG ─────────────────────────────────────────────────────────── */

function ScoreArc({ score, category }: { score: number; category: RiskCategory }) {
  const [displayed, setDisplayed] = useState(0);
  const [glowing,   setGlowing]   = useState(false);

  useEffect(() => {
    const duration = 1200;
    let raf: number;
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        setDisplayed(Math.round(eased * score));
        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setDisplayed(score);
          setGlowing(true);
        }
      };
      raf = requestAnimationFrame(tick);
    }, 300);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [score]);

  const r    = 76;
  const circ = 2 * Math.PI * r;
  const col  = CAT_COLOR[category];
  const dash = (displayed / 100) * circ;

  return (
    <div style={{
      display: 'inline-block', borderRadius: '50%',
      boxShadow: glowing
        ? `0 0 0 12px ${col}18, 0 0 0 24px ${col}08`
        : '0 0 0 0px transparent',
      transition: 'box-shadow 700ms ease',
    }}>
      <svg width="200" height="200" viewBox="0 0 200 200" aria-label={`Impact score: ${score}`}>
        <circle cx="100" cy="100" r={r} fill="none"
          style={{ stroke: 'rgba(245,239,224,0.08)', strokeWidth: 10 }} />
        <circle cx="100" cy="100" r={r} fill="none"
          style={{
            stroke: col, strokeWidth: 10, strokeLinecap: 'round',
            strokeDasharray: `${dash} ${circ}`,
            transform: 'rotate(-90deg)', transformOrigin: 'center',
            transition: 'stroke-dasharray 40ms linear',
          }} />
        <text x="100" y="90" textAnchor="middle"
          style={{ fontFamily: 'var(--font-display)', fontSize: 44, fill: col, fontWeight: 600 }}>
          {displayed}
        </text>
        <text x="100" y="110" textAnchor="middle"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          IMPACT SCORE
        </text>
        <text x="100" y="126" textAnchor="middle"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fill: col, letterSpacing: '0.05em' }}>
          / 100
        </text>
      </svg>
    </div>
  );
}

/* ─── Progress Bar ──────────────────────────────────────────────────────────── */

function ProgressBar({ sectionIdx, totalSections, questionIdx, totalQ }: {
  sectionIdx: number; totalSections: number; questionIdx: number; totalQ: number;
}) {
  const sectionPct = ((sectionIdx + (questionIdx + 1) / totalQ) / totalSections) * 100;
  return (
    <div style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 40 }}>
      <div style={{ height: 2, background: 'var(--border-subtle)' }}>
        <div style={{
          height: '100%', background: 'var(--accent-primary)',
          width: `${sectionPct}%`, transition: 'width 400ms ease',
        }} />
      </div>
    </div>
  );
}

/* ─── Option Card ───────────────────────────────────────────────────────────── */

function OptionCard({ opt, selected, onClick, small = false }: {
  opt: Opt; selected: boolean; onClick: () => void; small?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        padding: small ? '10px 14px' : '14px 18px',
        borderRadius: 10,
        border: `1px solid ${selected ? 'var(--accent-primary)' : hovered ? 'var(--border-default)' : 'var(--border-subtle)'}`,
        background: selected ? 'var(--accent-primary-glow)' : hovered ? 'rgba(255,250,240,0.03)' : 'var(--bg-surface)',
        transition: 'border-color 150ms ease, background 150ms ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{
          flexShrink: 0, marginTop: 1,
          width: 16, height: 16, borderRadius: '50%',
          border: `1.5px solid ${selected ? 'var(--accent-primary)' : 'var(--border-default)'}`,
          background: selected ? 'var(--accent-primary)' : 'none',
          transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {selected && (
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-inverse)', display: 'block' }} />
          )}
        </span>
        <div>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: small ? 13 : 14, fontWeight: 500,
            color: selected ? 'var(--accent-primary)' : 'var(--text-primary)',
            margin: 0, lineHeight: 1.3, transition: 'color 150ms ease',
          }}>
            {opt.label}
          </p>
          {opt.sub && (
            <p style={{
              fontFamily: 'var(--font-editorial)', fontStyle: 'italic',
              fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0', lineHeight: 1.4,
            }}>
              {opt.sub}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

/* ─── Question Renderer ─────────────────────────────────────────────────────── */

function QuestionBlock({ q, answers, setAnswer, onNext }: {
  q: Question; answers: Answers;
  setAnswer: (id: string, val: AnswerValue) => void;
  onNext: () => void;
}) {
  const val  = answers[q.id];
  const isAnswered = (() => {
    if (q.type === 'text') return true; // text is always skippable
    if (q.type === 'slider') return true; // has default
    if (q.type === 'multi') return (val as string[] ?? []).length > 0;
    return !!val;
  })();

  const handleSingle = (v: string) => {
    setAnswer(q.id, v);
    setTimeout(onNext, 160);
  };
  const handleMulti = (v: string) => {
    const cur = (val as string[]) ?? [];
    setAnswer(q.id, cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]);
  };
  const sliderVal = (val as number) ?? 50;

  return (
    <div>
      {/* Question text */}
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 28px)',
        fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em',
        lineHeight: 1.2, margin: '0 0 10px',
      }}>
        {q.text}
      </h2>
      {q.subtext && (
        <p style={{
          fontFamily: 'var(--font-editorial)', fontStyle: 'italic',
          fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6,
          margin: '0 0 28px', maxWidth: '58ch',
        }}>
          {q.subtext}
        </p>
      )}
      {!q.subtext && <div style={{ marginBottom: 28 }} />}

      {/* Field select — wider grid */}
      {q.type === 'field-select' && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(188px, 1fr))', gap: 8,
          maxHeight: 440, overflowY: 'auto', paddingRight: 4,
        }}>
          {FIELD_OPTS.map(opt => (
            <OptionCard key={opt.value} opt={opt} selected={val === opt.value}
              onClick={() => handleSingle(opt.value)} small />
          ))}
        </div>
      )}

      {/* Single select */}
      {q.type === 'single' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(q.options ?? []).map(opt => (
            <OptionCard key={opt.value} opt={opt} selected={val === opt.value}
              onClick={() => handleSingle(opt.value)} />
          ))}
        </div>
      )}

      {/* Multi select */}
      {q.type === 'multi' && (
        <>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8,
          }}>
            {(q.options ?? []).map(opt => (
              <OptionCard key={opt.value} opt={opt}
                selected={((val as string[]) ?? []).includes(opt.value)}
                onClick={() => handleMulti(opt.value)} />
            ))}
          </div>
          <button onClick={onNext} disabled={!isAnswered}
            style={{
              marginTop: 20, background: 'none', border: 'none',
              cursor: isAnswered ? 'pointer' : 'default',
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: isAnswered ? 'var(--accent-primary)' : 'var(--text-muted)',
              letterSpacing: '0.04em', padding: 0,
              opacity: isAnswered ? 1 : 0.4,
              transition: 'color 150ms ease, opacity 150ms ease',
            }}>
            Next →
          </button>
        </>
      )}

      {/* Slider */}
      {q.type === 'slider' && (
        <div style={{ paddingBottom: 8 }}>
          <style>{`
            input[type=range].quiz-slider { -webkit-appearance: none; width: 100%; height: 4px;
              background: var(--border-default); border-radius: 2px; outline: none; cursor: pointer; }
            input[type=range].quiz-slider::-webkit-slider-thumb { -webkit-appearance: none;
              width: 20px; height: 20px; border-radius: 50%;
              background: var(--accent-primary); cursor: pointer;
              border: 2px solid var(--bg-base); transition: transform 150ms ease; }
            input[type=range].quiz-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
            input[type=range].quiz-slider::-moz-range-thumb { width: 20px; height: 20px;
              border-radius: 50%; background: var(--accent-primary);
              cursor: pointer; border: 2px solid var(--bg-base); }
          `}</style>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              {q.minLabel}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 500,
              color: 'var(--accent-primary)', minWidth: 40, textAlign: 'center',
            }}>
              {sliderVal}%
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'right',
            }}>
              {q.maxLabel}
            </span>
          </div>
          <input type="range" min={0} max={100} value={sliderVal}
            className="quiz-slider"
            onChange={e => setAnswer(q.id, parseInt(e.target.value, 10))} />
          <button onClick={onNext}
            style={{
              marginTop: 20, background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--accent-primary)', letterSpacing: '0.04em', padding: 0,
            }}>
            Next →
          </button>
        </div>
      )}

      {/* Text */}
      {q.type === 'text' && (
        <>
          <textarea
            value={(val as string) ?? ''}
            onChange={e => setAnswer(q.id, e.target.value)}
            placeholder={q.placeholder}
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              borderRadius: 10, padding: '14px 16px', resize: 'vertical',
              fontFamily: 'var(--font-editorial)', fontSize: 15, color: 'var(--text-primary)',
              lineHeight: 1.6, outline: 'none', transition: 'border-color 150ms ease',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; }}
          />
          <button onClick={onNext}
            style={{
              marginTop: 16, background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--accent-primary)', letterSpacing: '0.04em', padding: 0,
            }}>
            {val ? 'Next →' : 'Skip →'}
          </button>
        </>
      )}
    </div>
  );
}

/* ─── Share Button ──────────────────────────────────────────────────────────── */

function ShareButton({ score, fieldName }: { score: number; fieldName: string }) {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `I scored ${score}/100 on the AI disruption quiz for ${fieldName}. Find yours: aightai.in/quiz`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <button onClick={handleShare} className="btn-ghost" style={{ fontSize: 13 }}>
      {copied ? 'Copied ✓' : 'Share your score →'}
    </button>
  );
}

/* ─── Report Screen ─────────────────────────────────────────────────────────── */

function ReportScreen({ result, field, answers, onRetake }: {
  result: ScoreResult; field: FieldEntry; answers: Answers; onRetake: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const { score, category, breakdown } = result;
  const col          = CAT_COLOR[category];
  const aiFreq       = (answers.ai_frequency as string) ?? 'rarely';
  const plan90       = get90DayPlan(category, aiFreq, field.field);
  const vision1yr    = get1YearVision(category, field.field);
  const riskPct      = score;
  const augPct       = Math.round((100 - score) * 0.35);
  const growPct      = 100 - riskPct - augPct;

  const sectionStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(16px)',
    transition: 'opacity 500ms ease, transform 500ms ease',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Header band */}
      <div style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        padding: '48px clamp(20px, 5vw, 64px)',
        ...sectionStyle,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10,
          }}>
            AI Impact Assessment — {new Date().getFullYear()}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.03em',
            lineHeight: 1.1, margin: '0 0 8px',
          }}>
            {field.field}
          </h1>
          <p style={{
            fontFamily: 'var(--font-editorial)', fontStyle: 'italic',
            fontSize: 16, color: 'var(--text-muted)', margin: 0,
          }}>
            {answers.role_title ? `${answers.role_title} · ` : ''}{field.tagline.slice(0, 90)}…
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px clamp(20px, 5vw, 48px) 96px' }}>

        {/* Score + category */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 40,
          alignItems: 'center', marginBottom: 56, ...sectionStyle,
          transitionDelay: '100ms',
        }}
          className="report-score-grid"
        >
          <ScoreArc score={score} category={category} />
          <div>
            <span style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: col,
              border: `1px solid ${col}`, borderRadius: 4, padding: '3px 10px',
              marginBottom: 14, opacity: 0.9,
            }}>
              {CAT_LABEL[category]}
            </span>
            <p style={{
              fontFamily: 'var(--font-editorial)', fontSize: 17, lineHeight: 1.8,
              color: 'var(--text-primary)', margin: '0 0 20px', maxWidth: '54ch',
            }}>
              {CAT_DESCRIPTION[category]}
            </p>
            {/* Breakdown pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(breakdown)
                .filter(([k, v]) => k !== 'base' && v !== 0)
                .map(([key, val]) => {
                  const label: Record<string, string> = {
                    routineMod: 'Routine tasks', creativeMod: 'Creative work',
                    humanMod: 'Human interaction', learningProtect: 'Learning openness',
                    aiMitigation: 'AI adoption', seniorityMod: 'Seniority', domainMod: 'Field context',
                  };
                  const positive = (val as number) < 0; // negative mod = protective = good
                  return (
                    <span key={key} style={{
                      fontFamily: 'var(--font-mono)', fontSize: 11,
                      padding: '3px 10px', borderRadius: 4,
                      background: positive ? 'rgba(170,255,77,0.08)' : 'rgba(224,112,112,0.08)',
                      color: positive ? '#AAFF4D' : '#E07070',
                      border: `1px solid ${positive ? 'rgba(170,255,77,0.2)' : 'rgba(224,112,112,0.2)'}`,
                    }}>
                      {positive ? '↓ ' : '↑ '}{label[key] ?? key}
                    </span>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Donut + timeline */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32,
          ...sectionStyle, transitionDelay: '180ms',
        }}
          className="report-two-col"
        >
          {/* Donut breakdown */}
          <div style={{
            padding: 28, borderRadius: 12, border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20,
            }}>
              Risk breakdown
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              {/* Donut */}
              <div style={{
                width: 100, height: 100, borderRadius: '50%', flexShrink: 0,
                background: `conic-gradient(#E07070 0% ${riskPct}%, #F4AB1F ${riskPct}% ${riskPct + augPct}%, #AAFF4D ${riskPct + augPct}% 100%)`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', inset: '22%', borderRadius: '50%',
                  background: 'var(--bg-surface)',
                }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { pct: riskPct, label: 'Displacement risk', color: '#E07070' },
                  { pct: augPct,  label: 'Augmentation zone', color: '#F4AB1F' },
                  { pct: growPct, label: 'Growth opportunity', color: '#AAFF4D' },
                ].map(({ pct, label, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
                      {pct}% — {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div style={{
            padding: 28, borderRadius: 12, border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 20,
            }}>
              Field timeline
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {field.impact_data.timeline.map(t => {
                const isCurrent = t.year <= 2026;
                return (
                  <div key={t.year} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 14, alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{
                        width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                        background: isCurrent ? 'var(--accent-primary)' : 'var(--border-default)',
                        boxShadow: isCurrent ? '0 0 8px rgba(170,255,77,0.5)' : 'none',
                        marginTop: 3,
                      }} />
                    </div>
                    <div>
                      <p style={{
                        fontFamily: 'var(--font-mono)', fontSize: 11,
                        color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)',
                        margin: '0 0 2px',
                      }}>
                        {t.year} · {t.label}
                      </p>
                      <p style={{
                        fontFamily: 'var(--font-ui)', fontSize: 12,
                        color: 'var(--text-muted)', margin: 0, lineHeight: 1.5,
                      }}>
                        {t.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Roles */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32,
          ...sectionStyle, transitionDelay: '240ms',
        }}
          className="report-two-col"
        >
          <div style={{
            padding: 24, borderRadius: 12,
            border: '1px solid rgba(224,112,112,0.18)', background: 'rgba(224,112,112,0.04)',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#E07070', marginBottom: 14,
            }}>
              Roles at risk in {field.field}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {field.impact_data.roles_at_risk.map(r => (
                <p key={r} style={{
                  fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)',
                  margin: 0, lineHeight: 1.4, paddingLeft: 12,
                  borderLeft: '2px solid rgba(224,112,112,0.35)',
                }}>
                  {r}
                </p>
              ))}
            </div>
          </div>
          <div style={{
            padding: 24, borderRadius: 12,
            border: '1px solid rgba(170,255,77,0.18)', background: 'rgba(170,255,77,0.04)',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#AAFF4D', marginBottom: 14,
            }}>
              Roles growing in {field.field}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {field.impact_data.roles_growing.map(r => (
                <p key={r} style={{
                  fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)',
                  margin: 0, lineHeight: 1.4, paddingLeft: 12,
                  borderLeft: '2px solid rgba(170,255,77,0.35)',
                }}>
                  {r}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Tools */}
        <div style={{ marginBottom: 32, ...sectionStyle, transitionDelay: '300ms' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600,
            color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 16px',
          }}>
            Tools to learn first
          </h3>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12,
          }}>
            {field.tools.map(tool => (
              <Link key={tool.name} href="/tools" style={{
                textDecoration: 'none', padding: '16px 20px', borderRadius: 10,
                border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)',
                display: 'block', transition: 'border-color 150ms ease',
              }}
                className="group"
              >
                <p style={{
                  fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500,
                  color: 'var(--text-primary)', margin: '0 0 4px',
                  transition: 'color 150ms ease',
                }} className="group-hover:text-accent">
                  {tool.name}
                </p>
                <p style={{
                  fontFamily: 'var(--font-editorial)', fontStyle: 'italic',
                  fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5,
                }}>
                  {tool.what_it_does}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Concepts */}
        <div style={{ marginBottom: 32, ...sectionStyle, transitionDelay: '360ms' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600,
            color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0 0 14px',
          }}>
            Concepts to understand
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {field.concepts.map(c => (
              <Link key={c} href={`/learn/${conceptToSlug(c)}`}
                className="tag tag-accent" style={{ textDecoration: 'none' }}>
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* 90-day plan */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40,
          ...sectionStyle, transitionDelay: '420ms',
        }}
          className="report-two-col"
        >
          <div style={{
            padding: 28, borderRadius: 12, border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: 18,
            }}>
              Your 90-day plan
            </p>
            <ol style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {plan90.map((step, i) => (
                <li key={i} style={{
                  fontFamily: 'var(--font-editorial)', fontSize: 14, color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div style={{
            padding: 28, borderRadius: 12, border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--accent-warm)', marginBottom: 18,
            }}>
              Where you could be in a year
            </p>
            <ol style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {vision1yr.map((step, i) => (
                <li key={i} style={{
                  fontFamily: 'var(--font-editorial)', fontSize: 14, color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Action pull-quote */}
        <blockquote style={{
          borderLeft: '3px solid var(--accent-warm)',
          paddingLeft: 24, margin: '0 0 40px',
          ...sectionStyle, transitionDelay: '480ms',
        }}>
          <p style={{
            fontFamily: 'var(--font-editorial)', fontStyle: 'italic',
            fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.85, margin: 0,
          }}>
            {field.action_paragraph}
          </p>
        </blockquote>

        {/* Tool recommendations based on responsibilities */}
        <div style={{ ...sectionStyle, transitionDelay: '520ms' }}>
          <QuizToolRecs
            responsibilities={Array.isArray(answers.responsibilities) ? answers.responsibilities as string[] : []}
            riskCategory={category}
          />
        </div>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center',
          paddingTop: 8, ...sectionStyle, transitionDelay: '560ms',
        }}>
          <Link href={`/learn/paths/${field.slug}`} className="btn-primary">
            Explore your field guide →
          </Link>
          <Link href="/learn/map" className="btn-ghost">
            See the concept map
          </Link>
          <Link href="/learn" className="btn-ghost">
            Start learning
          </Link>
        </div>

        {/* Share + retake */}
        <div style={{
          display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center',
          paddingTop: 16, ...sectionStyle, transitionDelay: '600ms',
        }}>
          <ShareButton score={score} fieldName={field.field} />
          <button onClick={onRetake} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 12,
            color: 'var(--text-muted)', padding: 0, letterSpacing: '0.03em',
            transition: 'color 150ms ease',
          }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Calculating Screen ────────────────────────────────────────────────────── */

const CALC_STEPS = [
  'Analysing role characteristics…',
  'Mapping displacement data for your field…',
  'Applying mitigation factors…',
  'Generating personalised recommendations…',
  'Complete.',
];

function CalculatingScreen() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => Math.min(s + 1, CALC_STEPS.length - 1));
      setProgress(p => Math.min(p + 22, 100));
    }, 480);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px',
    }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 32,
        }}>
          Processing your assessment
        </p>
        <div style={{
          height: 2, background: 'var(--border-subtle)', borderRadius: 1, marginBottom: 36,
        }}>
          <div style={{
            height: '100%', background: 'var(--accent-primary)',
            width: `${progress}%`, borderRadius: 1,
            transition: 'width 450ms ease',
          }} />
        </div>
        <div style={{ minHeight: 28 }}>
          {CALC_STEPS.map((s, i) => (
            <p key={i} style={{
              fontFamily: 'var(--font-ui)', fontSize: 14,
              color: i === step ? 'var(--text-primary)' : i < step ? 'var(--text-muted)' : 'transparent',
              margin: '0 0 8px', transition: 'color 300ms ease',
              height: i <= step ? 'auto' : 0, overflow: 'hidden',
            }}>
              {s}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Intro Screen ──────────────────────────────────────────────────────────── */

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '80px clamp(24px, 6vw, 64px)',
    }}>
      <div style={{ maxWidth: 600 }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: 24,
        }}>
          AI Impact Assessment · 2026
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 56px)',
          fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.03em',
          lineHeight: 1.05, margin: '0 0 28px',
        }}>
          How will AI actually affect your career?
        </h1>
        <p style={{
          fontFamily: 'var(--font-editorial)', fontSize: 17, lineHeight: 1.85,
          color: 'var(--text-secondary)', margin: '0 0 20px', maxWidth: '58ch',
        }}>
          This is not a gimmick. It is a nuanced, evidence-based assessment drawn from 2026 labour
          market research, field-specific displacement data, and the factors that most strongly
          predict resilience.
        </p>
        <p style={{
          fontFamily: 'var(--font-editorial)', fontSize: 17, lineHeight: 1.85,
          color: 'var(--text-secondary)', margin: '0 0 36px', maxWidth: '58ch',
        }}>
          You will answer around 30 questions across six areas. It takes approximately 8 minutes.
          At the end, you will receive a personalised impact score, a breakdown of the contributing
          factors, and a concrete action plan.
        </p>

        {/* What shapes the score */}
        <div style={{
          padding: '20px 24px', borderRadius: 10,
          border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)',
          marginBottom: 36,
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14,
          }}>
            What shapes your score
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px',
          }}>
            {[
              'Field-level displacement data', 'Proportion of routine tasks',
              'Depth of human interaction',    'Current AI usage & fluency',
              'Seniority & experience',        'Openness to learning',
              'Domain-specific role context',  'Career direction',
            ].map(item => (
              <p key={item} style={{
                fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)',
                margin: 0, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ color: 'var(--accent-primary)', fontSize: 10 }}>◆</span>
                {item}
              </p>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <button onClick={onStart} className="btn-primary" style={{ fontSize: 15, padding: '12px 28px' }}>
            Begin assessment →
          </button>
          <Link href="/learn/paths" style={{
            fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-muted)',
            textDecoration: 'none', transition: 'color 150ms ease',
          }}
            className="hover:text-accent"
          >
            Browse field guides instead
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */

function QuizPageInner({ preFieldSlug }: { preFieldSlug: string | null }) {
  const validPreField   = preFieldSlug && FIELDS.some(f => f.slug === preFieldSlug) ? preFieldSlug : null;

  const [screen, setScreen]           = useState<Screen>(validPreField ? 'quiz' : 'intro');
  const [sectionIdx, setSectionIdx]   = useState(validPreField ? 1 : 0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers]         = useState<Answers>(validPreField ? { field: validPreField } : {});
  const [visible, setVisible]         = useState(true);
  const [result, setResult]           = useState<ScoreResult | null>(null);
  const quizContainerRef              = useRef<HTMLDivElement>(null);
  const posthog                        = usePostHog();

  const fieldSlug = answers.field as string | undefined;

  const sections: Section[] = useMemo(() => {
    const group = getFieldGroup(fieldSlug ?? '');
    const s4    = DOMAIN[group] ?? DOMAIN.default;
    return [S1, S2, S3, s4, S5, S6];
  }, [fieldSlug]);

  const currentSection  = sections[sectionIdx];
  const currentQuestion = currentSection?.questions[questionIdx];
  const totalQuestions  = sections.reduce((n, s) => n + s.questions.length, 0);

  function setAnswer(id: string, val: AnswerValue) {
    setAnswers(prev => ({ ...prev, [id]: val }));
  }

  function navigate(fn: () => void) {
    setVisible(false);
    setTimeout(() => {
      fn();
      setVisible(true);
      requestAnimationFrame(() => {
        quizContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }, 200);
  }

  function advance() {
    navigate(() => {
      if (questionIdx < currentSection.questions.length - 1) {
        setQuestionIdx(q => q + 1);
      } else if (sectionIdx < sections.length - 1) {
        setSectionIdx(s => s + 1);
        setQuestionIdx(0);
      } else {
        setScreen('calculating');
        const field = FIELDS.find(f => f.slug === fieldSlug) ?? FIELDS[0];
        const r = computeScore(answers, field);
        setResult(r);
        posthog?.capture('quiz_completed', {
          field_slug: field.slug,
          field_name: field.field,
          risk_score: r.score,
          risk_category: r.category,
        });
        setTimeout(() => setScreen('report'), 2800);
      }
    });
  }

  function goBack() {
    navigate(() => {
      if (questionIdx > 0) {
        setQuestionIdx(q => q - 1);
      } else if (sectionIdx > 0) {
        setSectionIdx(s => s - 1);
        setQuestionIdx(sections[sectionIdx - 1].questions.length - 1);
      }
    });
  }

  function retake() {
    setAnswers({});
    setSectionIdx(0);
    setQuestionIdx(0);
    setResult(null);
    setScreen('intro');
  }

  if (screen === 'intro') return <IntroScreen onStart={() => setScreen('quiz')} />;
  if (screen === 'calculating') return <CalculatingScreen />;
  if (screen === 'report' && result) {
    const field = FIELDS.find(f => f.slug === fieldSlug) ?? FIELDS[0];
    return <ReportScreen result={result} field={field} answers={answers} onRetake={retake} />;
  }

  const answeredCount = Object.keys(answers).length;
  // Show "← Change field" when field was injected via URL and user is still in early sections
  const showChangeField = validPreField !== null && sectionIdx >= 1 && sectionIdx <= 2;

  return (
    <div style={{ minHeight: '100vh' }}>
      <ProgressBar
        sectionIdx={sectionIdx} totalSections={sections.length}
        questionIdx={questionIdx} totalQ={currentSection.questions.length}
      />

      {/* Section stepper */}
      <div style={{
        position: 'sticky', top: 66, zIndex: 30, background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px clamp(20px, 5vw, 64px)',
      }}>
        <div style={{
          maxWidth: 740, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {sections.map((s, i) => (
              <div key={s.id} style={{
                height: 4, borderRadius: 2,
                width: i === sectionIdx ? 24 : 8,
                background: i < sectionIdx
                  ? 'var(--accent-primary)'
                  : i === sectionIdx
                    ? 'var(--accent-primary)'
                    : 'var(--border-default)',
                opacity: i > sectionIdx ? 0.4 : 1,
                transition: 'width 250ms ease, background 200ms ease',
              }} />
            ))}
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
            letterSpacing: '0.08em', whiteSpace: 'nowrap',
          }}>
            {answeredCount} / {totalQuestions} answered
          </p>
        </div>
      </div>

      {/* Question area */}
      <div ref={quizContainerRef} style={{
        maxWidth: 740, margin: '0 auto',
        padding: '52px clamp(20px, 5vw, 48px) 80px',
        scrollMarginTop: 120,
      }}>
        {/* Section header */}
        <div style={{ marginBottom: 40 }}>
          {showChangeField && (
            <button
              onClick={() => { setSectionIdx(0); setQuestionIdx(0); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--text-muted)', padding: '0 0 14px',
                letterSpacing: '0.04em', display: 'block',
                transition: 'color 150ms ease',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--accent-primary)'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
            >
              ← Change field
            </button>
          )}
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6,
          }}>
            Section {currentSection.id} of {sections.length} — {currentSection.title}
          </p>
          <p style={{
            fontFamily: 'var(--font-editorial)', fontStyle: 'italic',
            fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6,
          }}>
            {currentSection.subtitle}
          </p>
        </div>

        {/* Question card — fades on navigation */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-8px)',
          transition: visible
            ? 'opacity 300ms ease 100ms, transform 300ms ease 100ms'
            : 'opacity 200ms ease, transform 200ms ease',
        }}>
          <div style={{
            padding: '32px 36px', borderRadius: 14,
            border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)',
          }}>
            <QuestionBlock
              q={currentQuestion}
              answers={answers}
              setAnswer={setAnswer}
              onNext={advance}
            />
          </div>
        </div>

        {/* Back link */}
        {(sectionIdx > 0 || questionIdx > 0) && (
          <button onClick={goBack} style={{
            marginTop: 20, background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-muted)',
            padding: 0, transition: 'color 150ms ease',
          }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
          >
            ← Previous question
          </button>
        )}
      </div>

      {/* Responsive grid overrides */}
      <style>{`
        @media (max-width: 640px) {
          .report-score-grid { grid-template-columns: 1fr !important; }
          .report-two-col    { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function QuizPageWrapper() {
  const searchParams = useSearchParams();
  return <QuizPageInner preFieldSlug={searchParams.get('field')} />;
}

export default function QuizPage() {
  return (
    <Suspense fallback={null}>
      <QuizPageWrapper />
    </Suspense>
  );
}
