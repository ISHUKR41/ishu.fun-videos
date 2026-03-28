'use client';

import { useEffect, useRef } from 'react';

interface GradientBlobProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

export function GradientBlob({
  className = '',
  colors = ['rgba(102,126,234,0.35)', 'rgba(118,75,162,0.3)', 'rgba(240,147,251,0.25)'],
  speed = 1,
}: GradientBlobProps) {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = blobRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let frame = 0;
    let t = 0;

    const animate = () => {
      t += 0.003 * speed;
      const x1 = 30 + Math.sin(t * 1.1) * 20;
      const y1 = 30 + Math.cos(t * 0.9) * 20;
      const x2 = 70 + Math.sin(t * 0.8 + 2) * 15;
      const y2 = 60 + Math.cos(t * 1.2 + 1) * 15;
      const x3 = 50 + Math.sin(t * 0.6 + 4) * 25;
      const y3 = 40 + Math.cos(t * 0.7 + 3) * 20;

      el.style.background = `
        radial-gradient(ellipse at ${x1}% ${y1}%, ${colors[0]} 0%, transparent 60%),
        radial-gradient(ellipse at ${x2}% ${y2}%, ${colors[1]} 0%, transparent 55%),
        radial-gradient(ellipse at ${x3}% ${y3}%, ${colors[2]} 0%, transparent 50%)
      `;

      frame = requestAnimationFrame(animate);
    };

    // Only animate when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!frame) frame = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [colors, speed]);

  return (
    <div
      ref={blobRef}
      className={`gradient-blob-bg ${className}`}
      aria-hidden="true"
    />
  );
}
