'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MdCategory,
  MdTrendingUp,
  MdShield,
  MdSpeed,
  MdAutoAwesome,
  MdPublic,
} from 'react-icons/md';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ size: number }>;
}

const stats: StatItem[] = [
  { value: 50, suffix: '+', label: 'Category Hubs', icon: MdCategory },
  { value: 100, suffix: '%', label: 'SEO Optimized', icon: MdTrendingUp },
  { value: 60, suffix: 'fps', label: 'Smooth Rendering', icon: MdSpeed },
  { value: 50, suffix: '+', label: 'SEO Keywords / Page', icon: MdAutoAwesome },
  { value: 10, suffix: '+', label: 'Global Regions', icon: MdPublic },
  { value: 1, suffix: '', label: 'Admin-Only Upload', icon: MdShield },
];

function AnimatedStat({ stat, isVisible }: { stat: StatItem; isVisible: boolean }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * stat.value));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isVisible, stat.value]);

  const Icon = stat.icon;

  return (
    <article className="stat-card">
      <div className="stat-icon-wrapper">
        <Icon size={28} />
      </div>
      <h3 className="stat-value">
        {count}
        <span className="stat-suffix">{stat.suffix}</span>
      </h3>
      <p className="stat-label">{stat.label}</p>
    </article>
  );
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="container stats-section reveal-up"
      aria-label="Platform statistics"
    >
      <div className="stats-header">
        <p className="eyebrow">Platform Metrics</p>
        <h2>Built for performance, optimized for discovery</h2>
      </div>
      <div className="stats-grid">
        {stats.map((stat) => (
          <AnimatedStat key={stat.label} stat={stat} isVisible={isVisible} />
        ))}
      </div>
    </section>
  );
}
