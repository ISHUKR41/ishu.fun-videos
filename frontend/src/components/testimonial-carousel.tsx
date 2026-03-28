'use client';

import { useEffect, useState, useCallback } from 'react';
import { MdAutoAwesome, MdFormatQuote } from 'react-icons/md';

interface Feature {
  quote: string;
  title: string;
  highlight: string;
}

const features: Feature[] = [
  {
    quote: 'Admin-curated content ensures every video meets quality standards before going live.',
    title: 'Quality Assurance',
    highlight: 'Admin-Only Publishing',
  },
  {
    quote: '50 dedicated category hubs with individual routes, metadata, and comment surfaces.',
    title: 'Category Architecture',
    highlight: '50+ Category Pages',
  },
  {
    quote: 'Structured data, schema markup, sitemaps, and AI-ready metadata on every page.',
    title: 'SEO-First Design',
    highlight: 'Search Ranking Ready',
  },
  {
    quote: 'GPU-accelerated animations, lazy loading, and smooth 60fps scrolling across all pages.',
    title: 'Performance First',
    highlight: 'Lag-Free Experience',
  },
  {
    quote: 'Inspired by Apple, Vercel, Tesla, and YouTube with dark glassmorphism and 3D depth.',
    title: 'Premium Design',
    highlight: 'Modern UI/UX',
  },
];

export function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % features.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(advance, 5000);
    return () => clearInterval(interval);
  }, [isPaused, advance]);

  const current = features[active];

  return (
    <section
      className="container testimonial-section reveal-up"
      aria-label="Platform features showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="testimonial-card">
        <div className="testimonial-quote-icon" aria-hidden>
          <MdFormatQuote size={40} />
        </div>
        <div className="testimonial-content" key={active}>
          <p className="testimonial-highlight">
            <MdAutoAwesome size={16} />
            {current.highlight}
          </p>
          <blockquote className="testimonial-text">{current.quote}</blockquote>
          <p className="testimonial-title">{current.title}</p>
        </div>
        <div className="testimonial-dots">
          {features.map((_, i) => (
            <button
              key={i}
              className={`testimonial-dot ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Feature ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
