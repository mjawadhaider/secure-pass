import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // Icon background
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(to bottom right, #6366f1, #4f46e5)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        }}
      >
        {/* Better centered lock icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5" y="12" width="14" height="10" rx="2" ry="2"></rect>
          <path d="M7 12V7a5 5 0 0 1 10 0v5"></path>
          <circle cx="12" cy="17" r="1"></circle>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
