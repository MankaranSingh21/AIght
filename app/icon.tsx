import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#0C0A08',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: '-0.04em',
        }}
      >
        <span style={{ color: '#F5EFE0' }}>M</span>
        <span style={{ color: '#AAFF4D' }}>_</span>
      </div>
    ),
    { ...size }
  );
}
