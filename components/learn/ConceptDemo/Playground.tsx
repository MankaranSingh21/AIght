import type { PlaygroundProps } from './types';

export default function Playground({
  ariaLabel,
  caption,
  children,
}: PlaygroundProps) {
  return (
    <div role="group" aria-label={ariaLabel}>
      {children}
      {caption && (
        <p
          style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginTop: 'var(--space-4)',
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
