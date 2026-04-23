// Per-field AI impact spectrum diagram

interface AugLayer {
  zone: 'automate' | 'augment' | 'grow';
  label: string;
  items: string[];
}

const FIELD_LAYERS: Record<string, AugLayer[]> = {
  'biology': [
    { zone: 'automate', label: 'Automated', items: ['Literature scanning', 'Routine sequencing analysis', 'Data labeling'] },
    { zone: 'augment', label: 'Augmented', items: ['Hypothesis generation', 'Protein structure prediction', 'Experimental design'] },
    { zone: 'grow', label: 'Growing', items: ['Wet-lab validation', 'Cross-disciplinary synthesis', 'Clinical translation'] },
  ],
  'physics-engineering': [
    { zone: 'automate', label: 'Automated', items: ['Standard simulations', 'CAD drafting', 'Report generation'] },
    { zone: 'augment', label: 'Augmented', items: ['Physics-informed modeling', 'Materials optimization', 'Multi-variable design'] },
    { zone: 'grow', label: 'Growing', items: ['Systems thinking', 'Novel physics research', 'Safety/ethics oversight'] },
  ],
  'medicine-healthcare': [
    { zone: 'automate', label: 'Automated', items: ['Routine radiology reads', 'Admin & transcription', 'Basic triage routing'] },
    { zone: 'augment', label: 'Augmented', items: ['Complex diagnostics', 'Drug interaction checks', 'Surgical guidance'] },
    { zone: 'grow', label: 'Growing', items: ['Patient relationships', 'Complex case judgment', 'Therapy & mental health'] },
  ],
  'law-legal': [
    { zone: 'automate', label: 'Automated', items: ['Document review', 'Contract analysis', 'Basic research queries'] },
    { zone: 'augment', label: 'Augmented', items: ['Case strategy', 'Regulatory interpretation', 'Precedent synthesis'] },
    { zone: 'grow', label: 'Growing', items: ['Client counsel', 'AI governance law', 'Complex negotiation'] },
  ],
  'finance-economics': [
    { zone: 'automate', label: 'Automated', items: ['Routine modeling', 'Data reconciliation', 'Standard reporting'] },
    { zone: 'augment', label: 'Augmented', items: ['Risk assessment', 'Market pattern analysis', 'Portfolio optimization'] },
    { zone: 'grow', label: 'Growing', items: ['Client relationships', 'Complex deal-making', 'Economic policy judgment'] },
  ],
  'education-teaching': [
    { zone: 'automate', label: 'Automated', items: ['Routine grading', 'Content delivery', 'Progress reporting'] },
    { zone: 'augment', label: 'Augmented', items: ['Personalized curricula', 'Adaptive assessments', 'Learning gap detection'] },
    { zone: 'grow', label: 'Growing', items: ['Mentorship & motivation', 'Special needs education', 'Human connection'] },
  ],
  'architecture-urban-design': [
    { zone: 'automate', label: 'Automated', items: ['Drafting & documentation', 'Code compliance checks', 'Rendering previews'] },
    { zone: 'augment', label: 'Augmented', items: ['Generative design options', 'Energy simulation', 'Urban flow modeling'] },
    { zone: 'grow', label: 'Growing', items: ['Community engagement', 'Cultural design vision', 'Sustainability strategy'] },
  ],
  'creative-writing-literature': [
    { zone: 'automate', label: 'Automated', items: ['First-draft generation', 'SEO content', 'Structural templates'] },
    { zone: 'augment', label: 'Augmented', items: ['Narrative iteration', 'Style refinement', 'Research synthesis'] },
    { zone: 'grow', label: 'Growing', items: ['Original voice & vision', 'Cultural storytelling', 'Long-form authorship'] },
  ],
  'graphic-design-visual-arts': [
    { zone: 'automate', label: 'Automated', items: ['Stock image creation', 'Template resizing', 'Basic layout variations'] },
    { zone: 'augment', label: 'Augmented', items: ['Concept exploration', 'Rapid prototyping', 'Visual iteration'] },
    { zone: 'grow', label: 'Growing', items: ['Brand identity strategy', 'Art direction', 'Cultural visual literacy'] },
  ],
  'film-video-production': [
    { zone: 'automate', label: 'Automated', items: ['Rough cuts & assembly', 'Color grading templates', 'Subtitle generation'] },
    { zone: 'augment', label: 'Augmented', items: ['Visual effects assistance', 'Storyboard generation', 'Music scoring'] },
    { zone: 'grow', label: 'Growing', items: ['Narrative direction', 'Cinematic craft', 'Live performance capture'] },
  ],
  'music-audio': [
    { zone: 'automate', label: 'Automated', items: ['Background music generation', 'Audio mastering', 'Stem separation'] },
    { zone: 'augment', label: 'Augmented', items: ['Arrangement assistance', 'Sound design', 'Lyric co-writing'] },
    { zone: 'grow', label: 'Growing', items: ['Live performance', 'Original artistic voice', 'Cultural music traditions'] },
  ],
  'journalism-media': [
    { zone: 'automate', label: 'Automated', items: ['Data-driven reports', 'Breaking news summaries', 'Fact extraction'] },
    { zone: 'augment', label: 'Augmented', items: ['Investigative research', 'Source synthesis', 'Audience analytics'] },
    { zone: 'grow', label: 'Growing', items: ['Investigative journalism', 'Source trust & ethics', 'Long-form storytelling'] },
  ],
  'psychology-mental-health': [
    { zone: 'automate', label: 'Automated', items: ['Intake documentation', 'Risk screening tools', 'Session note drafts'] },
    { zone: 'augment', label: 'Augmented', items: ['Treatment plan suggestions', 'Crisis resource routing', 'Progress pattern detection'] },
    { zone: 'grow', label: 'Growing', items: ['Therapeutic relationship', 'Trauma-informed care', 'Human empathy work'] },
  ],
  'chemistry-materials-science': [
    { zone: 'automate', label: 'Automated', items: ['Literature mining', 'Routine lab analysis', 'Property prediction'] },
    { zone: 'augment', label: 'Augmented', items: ['Novel compound design', 'Synthesis pathway planning', 'Reaction optimization'] },
    { zone: 'grow', label: 'Growing', items: ['Experimental validation', 'Cross-domain innovation', 'Safety & regulatory work'] },
  ],
  'environmental-science-climate': [
    { zone: 'automate', label: 'Automated', items: ['Sensor data processing', 'Emissions reporting', 'Satellite image classification'] },
    { zone: 'augment', label: 'Augmented', items: ['Climate modeling', 'Risk scenario planning', 'Policy impact analysis'] },
    { zone: 'grow', label: 'Growing', items: ['Stakeholder engagement', 'Policy advocacy', 'Field research coordination'] },
  ],
  'marketing-advertising': [
    { zone: 'automate', label: 'Automated', items: ['Ad copy variants', 'Lead scoring', 'Campaign reporting'] },
    { zone: 'augment', label: 'Augmented', items: ['Audience segmentation', 'Creative direction', 'Channel optimization'] },
    { zone: 'grow', label: 'Growing', items: ['Brand strategy', 'Customer relationship depth', 'Cultural insight'] },
  ],
  'social-work-public-policy': [
    { zone: 'automate', label: 'Automated', items: ['Case documentation', 'Benefits eligibility checks', 'Resource matching'] },
    { zone: 'augment', label: 'Augmented', items: ['Policy impact modeling', 'Need prediction', 'Program evaluation'] },
    { zone: 'grow', label: 'Growing', items: ['Advocacy & community work', 'Crisis intervention', 'Systems-level change'] },
  ],
  'pharmacy-drug-discovery': [
    { zone: 'automate', label: 'Automated', items: ['Drug interaction checking', 'Dosage calculations', 'Regulatory filing prep'] },
    { zone: 'augment', label: 'Augmented', items: ['Lead compound optimization', 'Clinical trial design', 'Side-effect prediction'] },
    { zone: 'grow', label: 'Growing', items: ['Patient counseling', 'Complex formulation R&D', 'Rare disease discovery'] },
  ],
  'agriculture-food-science': [
    { zone: 'automate', label: 'Automated', items: ['Crop monitoring', 'Yield prediction', 'Routine quality checks'] },
    { zone: 'augment', label: 'Augmented', items: ['Precision farming plans', 'Disease detection', 'Supply chain optimization'] },
    { zone: 'grow', label: 'Growing', items: ['Sustainable practices R&D', 'Community food systems', 'Climate adaptation strategy'] },
  ],
  'history-humanities': [
    { zone: 'automate', label: 'Automated', items: ['Archival digitization', 'Basic text translation', 'Citation checking'] },
    { zone: 'augment', label: 'Augmented', items: ['Pattern analysis across texts', 'Thematic synthesis', 'Multi-source research'] },
    { zone: 'grow', label: 'Growing', items: ['Interpretive scholarship', 'Cultural context & ethics', 'Narrative meaning-making'] },
  ],
};

const DEFAULT_LAYERS: AugLayer[] = [
  { zone: 'automate', label: 'Automated', items: ['Routine tasks', 'Data processing', 'Standard reporting'] },
  { zone: 'augment', label: 'Augmented', items: ['Analysis', 'Decision support', 'Research'] },
  { zone: 'grow', label: 'Growing', items: ['Judgment', 'Relationships', 'Creative work'] },
];

const ZONE_COLORS = {
  automate: { bg: 'rgba(224,112,112,0.08)', border: 'rgba(224,112,112,0.2)', text: '#E07070', label: 'rgba(224,112,112,0.7)' },
  augment:  { bg: 'rgba(201,169,110,0.08)', border: 'rgba(201,169,110,0.2)', text: '#C9A96E', label: 'rgba(201,169,110,0.7)' },
  grow:     { bg: 'rgba(125,191,140,0.08)', border: 'rgba(125,191,140,0.2)', text: '#7DBF8C', label: 'rgba(125,191,140,0.7)' },
};

export default function AugmentationDiagram({ slug }: { slug: string }) {
  const layers = FIELD_LAYERS[slug] ?? DEFAULT_LAYERS;

  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '1.25rem',
        }}
      >
        AI impact spectrum
      </p>

      {/* Spectrum bar */}
      <div
        style={{
          display: 'flex',
          height: 4,
          borderRadius: 2,
          overflow: 'hidden',
          marginBottom: '1.5rem',
          background: 'var(--bg-overlay)',
        }}
      >
        <div style={{ flex: 1, background: 'rgba(224,112,112,0.5)' }} />
        <div style={{ flex: 1, background: 'rgba(201,169,110,0.5)' }} />
        <div style={{ flex: 1, background: 'rgba(125,191,140,0.5)' }} />
      </div>

      <div
        className="augmentation-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
        }}
      >
        {layers.map((layer) => {
          const colors = ZONE_COLORS[layer.zone];
          return (
            <div
              key={layer.zone}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: colors.label,
                  marginBottom: '0.625rem',
                }}
              >
                {layer.label}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {layer.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
