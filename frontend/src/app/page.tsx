import { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  MdArrowForward,
  MdPublic,
  MdLayers,
  MdRocketLaunch,
  MdShield,
  MdAutoAwesome,
  MdSpeed,
  MdAllInclusive,
  MdVerified,
  MdPlayArrow,
  MdInsights,
  MdComment,
  MdTrendingUp,
  MdExplore,
  MdStar,
  MdBolt,
  MdSearch,
  MdOndemandVideo,
} from "react-icons/md";
import { CategoryGrid } from "@/components/category-grid";
import { ExternalThumbnail } from "@/components/external-thumbnail";
import { MarqueeStrip } from "@/components/marquee-strip";
import { fetchCategories, fetchVideos } from "@/lib/api";
import { absoluteUrl, siteConfig } from "@/lib/site";

const ParticleCanvas = dynamic(
  () => import("@/components/particle-canvas").then((m) => ({ default: m.ParticleCanvas })),
  { ssr: false }
);

const StatsSection = dynamic(
  () => import("@/components/stats-section").then((m) => ({ default: m.StatsSection })),
  { ssr: false }
);

const TestimonialCarousel = dynamic(
  () => import("@/components/testimonial-carousel").then((m) => ({ default: m.TestimonialCarousel })),
  { ssr: false }
);

const GradientBlob = dynamic(
  () => import("@/components/gradient-blob").then((m) => ({ default: m.GradientBlob })),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Home",
  description:
    "ISHU.FUN — A professional admin-curated video platform with 50 category hubs, modern 3D-inspired UI, smooth scrolling, and SEO-first architecture. Inspired by YouTube, Apple, Tesla, Vercel, and premium modern websites.",
  keywords: [
    "ishu",
    "ishu.fun",
    "ishufun",
    "ishu fun video platform",
    "ishu streaming website",
    "ishu admin video upload",
    "ishu videos",
    "ishu.fun videos",
    "ishu fun videos online",
    "ishufun premium videos",
    "ishu video streaming",
    "ishu online platform",
    "ishu.fun streaming",
    "ishu.fun categories",
    "ishu.fun watch online",
    "ishufun HD videos",
    "youtube style video platform",
    "admin only video upload website",
    "50 category streaming website",
    "modern animated website",
    "seo optimized streaming platform",
    "professional 3d web design",
    "creator platform with category pages",
    "video sharing platform",
    "modern video streaming",
    "premium video website",
    "smooth scrolling video site",
    "apple inspired design",
    "vercel style website",
    "tesla inspired interface",
    "professional video platform",
    "category based video discovery",
    "seo friendly video site",
    "fast video platform",
    "modern ui ux video site",
    "ishu.fun free videos",
    "ishu.fun premium content",
    "ishu.fun best videos",
    "ishu.fun trending",
    "ishu clips",
    "ishu reels",
    "ishufun streaming site",
    "dark theme video platform",
    "glassmorphism video site",
    "3d animated video platform",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}${siteConfig.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}${siteConfig.defaultOgImage}`],
  },
};

const howItWorks = [
  {
    step: "01",
    icon: MdExplore,
    title: "Browse Categories",
    description:
      "Explore 50+ curated category hubs organized by content type, region, theme, style, and engagement topics.",
  },
  {
    step: "02",
    icon: MdOndemandVideo,
    title: "Watch Premium Content",
    description:
      "Stream admin-curated high-quality videos with smooth 60fps playback and cinematic presentation.",
  },
  {
    step: "03",
    icon: MdComment,
    title: "Join the Community",
    description:
      "Share your thoughts through moderated comments on every category page. Be part of the conversation.",
  },
];

export default async function HomePage() {
  const categories = await fetchCategories();
  const videos = await fetchVideos();
  const topCategories = categories.slice(0, 8);
  const featuredVideos = videos.slice(0, 8);
  const categoryNameBySlug = new Map(
    categories.map((category) => [category.slug, category.name])
  );

  const platformSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name} Category Highlights`,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: categories.length,
    itemListElement: categories.slice(0, 12).map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: category.name,
      url: absoluteUrl(`/categories/${category.slug}`),
    })),
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: siteConfig.description,
    url: siteConfig.url,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is ISHU.FUN?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ISHU.FUN is a modern, admin-curated video streaming platform with 50+ category hubs, SEO-first architecture, smooth scrolling, and premium dark-themed UI inspired by YouTube, Apple, Vercel, and Tesla.",
        },
      },
      {
        "@type": "Question",
        name: "Who can upload videos on ISHU.FUN?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Only verified admin roles can upload and publish videos. Community users can browse content and participate through moderated comments.",
        },
      },
      {
        "@type": "Question",
        name: "How many categories does ISHU.FUN have?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ISHU.FUN has 50+ dedicated category hubs across content types, quality formats, regions, creator participation, themes, style/appearance, and activity/engagement.",
        },
      },
    ],
  };

  return (
    <main>
      {/* ===== HERO SECTION ===== */}
      <section className="hero container" id="hero-section">
        <div className="hero-copy reveal-up">
          <p className="eyebrow">
            <MdBolt size={14} /> Modern Creator Platform
          </p>
          <h1>
            Admin-curated streaming,
            <span> cinematic UX, and SEO-driven discovery.</span>
          </h1>
          <p className="hero-subtitle">
            Built for scale like top product-grade websites. Smooth, clean, fast,
            and category-intelligent. Every category has its own dedicated folder,
            route, comments flow, and metadata footprint.
          </p>

          <div className="hero-actions">
            <Link href="/categories" className="btn primary" id="hero-cta-watch">
              Start Watching <MdArrowForward size={18} />
            </Link>
            <Link href="/categories" className="btn ghost" id="hero-cta-explore">
              <MdSearch size={18} />
              Explore Categories
            </Link>
          </div>

          <div className="hero-badges">
            <span>
              <MdShield size={16} /> Admin-only publishing
            </span>
            <span>
              <MdSpeed size={16} /> 60fps rendering
            </span>
            <span>
              <MdAutoAwesome size={16} /> AI + SEO optimization
            </span>
            <span>
              <MdStar size={16} /> 50+ categories
            </span>
          </div>

          <div className="insight-rail">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="insight-chip"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="hero-visual reveal-scale" aria-hidden>
          <ParticleCanvas />
          <GradientBlob className="hero-blob" />
          <div className="orb one" />
          <div className="orb two" />
          <div className="hero-stack">
            <div className="hero-card">
              <p>Creator Intelligence Layer</p>
              <strong>SEO + AI Optimization</strong>
              <ul>
                <li>
                  <MdShield size={18} /> Admin-curated uploads only
                </li>
                <li>
                  <MdAutoAwesome size={18} /> Structured metadata + schema
                </li>
                <li>
                  <MdSpeed size={18} /> Smooth scrolling and fast rendering
                </li>
              </ul>
            </div>
            <div className="hero-float">
              <p>50 Category Architecture</p>
              <strong>Folders + Dynamic Pages + Comments</strong>
            </div>
            <div className="hero-signal">
              <MdVerified size={20} /> Search visibility and long-tail ranking
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <MarqueeStrip />

      {/* ===== STATS SECTION ===== */}
      <StatsSection />

      {/* ===== HIGHLIGHTS ===== */}
      <section
        className="container highlights-enhanced reveal-up"
        aria-label="Platform highlights"
        id="highlights-section"
      >
        <article className="highlight-card">
          <div className="highlight-number">
            50<span>+</span>
          </div>
          <p>Dedicated category folders with pages and comments</p>
        </article>
        <article className="highlight-card">
          <div className="highlight-number">Admin</div>
          <p>Strict upload controls and hidden control room</p>
        </article>
        <article className="highlight-card">
          <div className="highlight-number">SEO</div>
          <p>Schema, sitemap, metadata, and SEO assistant tools</p>
        </article>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section
        className="container how-it-works-section reveal-up"
        aria-label="How it works"
        id="how-it-works"
      >
        <div className="section-heading-enhanced">
          <p className="eyebrow">How It Works</p>
          <h2 className="gradient-text-enhanced">Three steps to start watching</h2>
          <p className="section-subtitle">
            Discover content across 50+ categories in a few simple steps
          </p>
        </div>
        <div className="how-it-works-grid">
          {howItWorks.map((item) => {
            const StepIcon = item.icon;
            return (
              <article key={item.step} className="how-it-works-card">
                <div className="how-step-number">{item.step}</div>
                <div className="how-step-icon">
                  <StepIcon size={32} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===== FEATURED VIDEOS ===== */}
      <section
        className="container featured-videos reveal-up"
        aria-label="Featured videos"
        id="featured-videos"
      >
        <div className="section-heading-inline">
          <div>
            <p className="eyebrow">Featured Feed</p>
            <h2>Fresh videos from admin-curated categories</h2>
          </div>
          <Link href="/categories" className="btn ghost small">
            Browse all categories <MdArrowForward size={16} />
          </Link>
        </div>

        {featuredVideos.length === 0 ? (
          <div className="featured-empty">
            <div className="featured-empty-icon">
              <MdOndemandVideo size={48} />
            </div>
            <p>
              Fresh uploads will appear here as soon as admins publish new
              videos.
            </p>
          </div>
        ) : (
          <div className="video-rail-grid">
            {featuredVideos.map((video) => (
              <Link
                key={video.id}
                href={`/watch/${video.id}`}
                className="video-rail-card"
              >
                <div className="video-thumb-fallback" aria-hidden>
                  {video.thumbnailUrl ? (
                    <div className="video-thumb-media">
                      <ExternalThumbnail
                        src={video.thumbnailUrl}
                        alt=""
                        className="video-thumb-media-image"
                        sizes="(max-width: 780px) 100vw, (max-width: 1100px) 50vw, 25vw"
                      />
                    </div>
                  ) : null}
                  <span>
                    <MdPlayArrow size={20} />
                  </span>
                </div>
                <div className="video-rail-body">
                  <p className="video-category-chip">
                    {video.category?.name || "Featured"}
                  </p>
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                  <div className="video-rail-meta">
                    <span>
                      <MdInsights size={14} /> Discovery-ready
                    </span>
                    <span>
                      <MdComment size={14} /> Comment enabled
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ===== TESTIMONIAL CAROUSEL ===== */}
      <TestimonialCarousel />

      {/* ===== FEATURE GRID ===== */}
      <section
        className="container feature-grid reveal-up"
        aria-label="Platform capabilities"
        id="features-section"
      >
        <article>
          <MdLayers size={22} />
          <h3>Category Engine</h3>
          <p>
            Group-based browsing, clean slugs, and scalable metadata for every
            category route.
          </p>
        </article>
        <article>
          <MdRocketLaunch size={22} />
          <h3>Performance First</h3>
          <p>
            Lightweight effects, GPU-friendly transforms, and smooth interactions
            for lag-free UX.
          </p>
        </article>
        <article>
          <MdAllInclusive size={22} />
          <h3>3D Experience</h3>
          <p>
            Intentional 3D card depth and layered backgrounds without heavy
            rendering cost.
          </p>
        </article>
        <article>
          <MdTrendingUp size={22} />
          <h3>Long-Term SEO</h3>
          <p>
            Sitemap, robots, schema, keywords, canonical links, and AI-ready
            metadata workflow.
          </p>
        </article>
        <article>
          <MdPublic size={22} />
          <h3>Global Category Reach</h3>
          <p>
            Region and trend categories are organized to target broad and
            long-tail search intent.
          </p>
        </article>
        <article>
          <MdVerified size={22} />
          <h3>Clean Upload Workflow</h3>
          <p>
            Only admin roles can publish, while users can participate through
            moderated comments.
          </p>
        </article>
      </section>

      {/* ===== ALL CATEGORIES ===== */}
      <CategoryGrid categories={categories} />

      {/* ===== CTA BANNER ===== */}
      <section className="container cta-banner-section reveal-up" id="cta-section">
        <div className="cta-banner">
          <div className="cta-banner-content">
            <h2>Ready to explore?</h2>
            <p>
              Discover 50+ curated category hubs with premium content, smooth
              playback, and community comments.
            </p>
            <div className="cta-banner-actions">
              <Link href="/categories" className="btn primary">
                Browse All Categories <MdArrowForward size={18} />
              </Link>
              <Link href="/categories/trending-moments" className="btn ghost">
                <MdTrendingUp size={18} /> See Trending
              </Link>
            </div>
          </div>
          <div className="cta-banner-visual" aria-hidden>
            <div className="cta-orb one" />
            <div className="cta-orb two" />
            <div className="cta-orb three" />
          </div>
        </div>
      </section>

      {/* ===== STRUCTURED DATA ===== */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(platformSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
