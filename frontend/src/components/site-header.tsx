'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  MdPlayCircle,
  MdExplore,
  MdSearch,
  MdAutoAwesome,
  MdHome,
  MdVideoLibrary,
  MdOndemandVideo,
  MdWhatshot
} from "react-icons/md";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const handleScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        frame = 0;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <header className={`site-header-enhanced ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner-enhanced">
        <Link href="/" className="brand-enhanced">
          <span className="brand-icon-enhanced" aria-hidden>
            <MdPlayCircle size={28} />
          </span>
          <span className="brand-text-enhanced">{siteConfig.name}</span>
        </Link>

        <nav className="nav-links-enhanced" aria-label="Primary">
          <Link href="/" className="nav-link">
            <MdHome size={18} />
            <span>Home</span>
          </Link>
          <Link href="/categories" className="nav-link">
            <MdVideoLibrary size={18} />
            <span>Categories</span>
          </Link>
          <Link href="/watch/featured-launch-film" className="nav-link">
            <MdOndemandVideo size={18} />
            <span>Watch</span>
          </Link>
          <Link href="/categories/trending-moments" className="nav-link">
            <MdWhatshot size={18} />
            <span>Trending</span>
          </Link>
        </nav>

        <div className="header-actions-enhanced">
          <Link href="/categories" className="search-btn-enhanced" aria-label="Search videos">
            <MdSearch size={20} />
            <span>Discover</span>
          </Link>
          <Link href="/categories/highlights" className="explore-btn-enhanced">
            <MdExplore size={18} />
            <span>Explore</span>
          </Link>
          <Link href="/categories/creative-content" className="inspire-btn-enhanced">
            <MdAutoAwesome size={18} />
            <span>Inspire</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
