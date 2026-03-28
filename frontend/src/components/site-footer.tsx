import Link from "next/link";
import {
  MdPlayCircle,
  MdShield,
  MdSpeed,
  MdAutoAwesome,
  MdKeyboardArrowUp,
  MdCode,
  MdOndemandVideo,
  MdCameraAlt,
  MdMusicNote,
} from "react-icons/md";
import { fetchCategories } from "@/lib/api";
import { categorySeed } from "@/lib/categories";
import { siteConfig } from "@/lib/site";

const featuredCategorySlugs = [
  "user-generated",
  "hd-4k",
  "indian",
  "live-streams",
  "studio-content",
  "vr-experience",
];
const discoveryCategorySlugs = [
  "verified-creators",
  "creative-content",
  "lifestyle-content",
  "campus-life",
  "outdoor-scenes",
  "emotional-moments",
];

function resolveCategoryName(
  slug: string,
  categoryNameBySlug: Map<string, string>
) {
  return (
    categoryNameBySlug.get(slug) ||
    slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export async function SiteFooter() {
  const year = new Date().getFullYear();
  const categories = await fetchCategories();
  const categorySource = categories.length > 0 ? categories : categorySeed;
  const categoryNameBySlug = new Map(
    categorySource.map((category) => [category.slug, category.name])
  );

  return (
    <footer className="site-footer">
      {/* Back to Top Button */}
      <div className="back-to-top-wrapper">
        <a href="#" className="back-to-top-btn" aria-label="Back to top">
          <MdKeyboardArrowUp size={24} />
          <span>Back to Top</span>
        </a>
      </div>

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
              Admin-curated video platform with 50+ category hubs, cinematic UX,
              and SEO-first architecture.
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
            {/* Social Links */}
            <div className="footer-social">
              <a
                href="https://github.com/ISHUKR41"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="GitHub"
              >
                <MdCode size={20} />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="YouTube"
              >
                <MdOndemandVideo size={20} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <MdCameraAlt size={20} />
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="X (Twitter)"
              >
                <MdMusicNote size={20} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/categories">All Categories</Link>
              </li>
              <li>
                <Link href="/watch/featured-launch-film">Watch Now</Link>
              </li>
              <li>
                <Link href="/categories/trending-moments">Trending</Link>
              </li>
              <li>
                <Link href="/categories/highlights">Highlights</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Categories</h4>
            <ul className="footer-links">
              {featuredCategorySlugs.map((slug) => (
                <li key={slug}>
                  <Link href={`/categories/${slug}`}>
                    {resolveCategoryName(slug, categoryNameBySlug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Discover</h4>
            <ul className="footer-links">
              {discoveryCategorySlugs.map((slug) => (
                <li key={slug}>
                  <Link href={`/categories/${slug}`}>
                    {resolveCategoryName(slug, categoryNameBySlug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-divider" aria-hidden />

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {year} {siteConfig.name}. All rights reserved. Built with ❤️
            for premium streaming.
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
