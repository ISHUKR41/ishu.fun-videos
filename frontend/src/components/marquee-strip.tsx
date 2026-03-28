'use client';

import { useRef, useState } from 'react';

const brands = [
  'Apple', 'Google', 'Microsoft', 'YouTube', 'Vercel', 'Stripe', 'Figma',
  'Notion', 'Tesla', 'Airbnb', 'Nike', 'Dropbox', 'GitHub', 'Framer',
  'Flipkart', 'Rupay', 'AirHub',
];

export function MarqueeStrip() {
  const [paused, setPaused] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  return (
    <section className="marquee-section" aria-label="Design inspirations">
      <p className="marquee-label">Design language inspired by premium product ecosystems</p>
      <div
        ref={stripRef}
        className={`marquee-track ${paused ? 'paused' : ''}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {[0, 1].map((set) => (
          <div key={set} className="marquee-content" aria-hidden={set === 1}>
            {brands.map((brand) => (
              <span key={`${set}-${brand}`} className="marquee-chip">
                {brand}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
