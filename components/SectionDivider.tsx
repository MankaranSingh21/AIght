type Props = {
  number: string;        // e.g. "01", "02"
  label: string;         // e.g. "FROM THE ARCHIVE"
};

// Characterful section break — section-number flush-left, gradient rule to the
// right. Replaces plain `border-top` between sections.
export default function SectionDivider({ number, label }: Props) {
  return (
    <div className="section-divider" aria-hidden>
      <span className="section-number">§ {number} &nbsp;·&nbsp; {label}</span>
      <span className="section-rule" />
    </div>
  );
}
