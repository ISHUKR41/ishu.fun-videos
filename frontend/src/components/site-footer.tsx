import Link from "next/link";
import { MdPlayCircle, MdShield, MdSpeed, MdAutoAwesome } from "react-icons/md";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="footer-brand-link">
              <span className="footer-brand-icon" aria-hidden>
                <MdPlayCircle size={24} />
              </span>
              <span className="footer-brand-name">{siteConfig.name}</span>
            </Link>
            <p className="footer-tagline">
              Admin-curated video platform with 50 category hubs, cinematic UX, and SEO-first architecture.
            </p>
            <div className="footer-badges">
              <span className="footer-badge">
                <MdShield size={13} /> Admin-only uploads
              </span>
              <span className="footer-badge">
                <MdSpeed size={13} /> High-performance
              </span>
              <span className="footer-badge">
                <MdAutoAwesome size={13} /> SEO + AI ready
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/categories">All Categories</Link></li>
              <li><Link href="/watch/featured-launch-film">Watch Now</Link></li>
              <li><Link href="/categories/trending-moments">Trending</Link></li>
              <li><Link href="/categories/highlights">Highlights</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><Link href="/categories/user-generated">User Generated</Link></li>
              <li><Link href="/categories/hd-4k">HD / 4K</Link></li>
              <li><Link href="/categories/indian">Indian</Link></li>
              <li><Link href="/categories/live-streams">Live Streams</Link></li>
              <li><Link href="/categories/studio-content">Studio Content</Link></li>
              <li><Link href="/categories/vr-experience">VR Experience</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Discover</h4>
            <ul className="footer-links">
              <li><Link href="/categories/verified-creators">Verified Creators</Link></li>
              <li><Link href="/categories/creative-content">Creative Content</Link></li>
              <li><Link href="/categories/lifestyle-content">Lifestyle</Link></li>
              <li><Link href="/categories/campus-life">Campus Life</Link></li>
              <li><Link href="/categories/outdoor-scenes">Outdoor Scenes</Link></li>
              <li><Link href="/categories/emotional-moments">Emotional Moments</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="footer-meta">
            <Link href="/categories">Browse Categories</Link>
            <span className="footer-dot" aria-hidden />
            <Link href="/watch/featured-launch-film">Watch</Link>
            <span className="footer-dot" aria-hidden />
            <Link href="/categories/trending-moments">Trending</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
