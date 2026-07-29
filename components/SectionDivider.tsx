type Props = {
  number: string;        // e.g. "01", "02"
  label: string;         // e.g. "FROM THE ARCHIVE"
};

/**
 * Chapter mark between homepage sections.
 *
 * The numeral is now set at display scale in Fraunces so each break carries
 * real structural weight. Previously the entire divider was one 10px mono line,
 * which is why the page read as a single undifferentiated scroll despite having
 * six distinct sections.
 */
export default function SectionDivider({ number, label }: Props) {
  return (
    <div className="section-divider" aria-hidden>
      <span className="section-numeral">{number}</span>
      <span className="section-number">{label}</span>
      <span className="section-rule" />
    </div>
  );
}
