'use client';

// Drifting gradient mesh that sits between the page background and the
// ParticleCanvas. Three soft radial blobs in lime / teal / amber tones drift
// on long, offset loops so they never align into a single colour.

export default function AuroraBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          top: '-15vw',
          left: '-10vw',
          borderRadius: '50%',
          background:
            'radial-gradient(closest-side, rgba(170,255,77,0.13), transparent 70%)',
          filter: 'blur(120px)',
          willChange: 'transform',
          animation: 'aurora-drift-a 64s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '55vw',
          height: '55vw',
          top: '20vh',
          right: '-12vw',
          borderRadius: '50%',
          background:
            'radial-gradient(closest-side, rgba(0,255,209,0.09), transparent 70%)',
          filter: 'blur(140px)',
          willChange: 'transform',
          animation: 'aurora-drift-b 82s ease-in-out infinite',
          animationDelay: '-18s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          bottom: '-10vw',
          left: '15vw',
          borderRadius: '50%',
          background:
            'radial-gradient(closest-side, rgba(244,171,31,0.07), transparent 70%)',
          filter: 'blur(130px)',
          willChange: 'transform',
          animation: 'aurora-drift-c 96s ease-in-out infinite',
          animationDelay: '-42s',
        }}
      />
    </div>
  );
}
