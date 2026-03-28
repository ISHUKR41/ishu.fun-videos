import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
  MdComment
} from "react-icons/md";
import { CategoryGrid } from "@/components/category-grid";
import { ExternalThumbnail } from "@/components/external-thumbnail";
import { ParticleCanvas } from "@/components/particle-canvas";
import { MarqueeStrip } from "@/components/marquee-strip";
import { fetchCategories, fetchVideos } from "@/lib/api";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description:
    "A professional admin-curated video platform with 50 category hubs, modern 3D-inspired UI, smooth scrolling, and SEO-first architecture. Inspired by YouTube, Apple, Tesla, Vercel, and premium modern websites.",
  keywords: [
    "ishu",
    "ishu.fun",
    "ishufun",
    "ishu fun video platform",
    "ishu streaming website",
    "ishu admin video upload",
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
    "modern ui ux video site"
  ],
  alternates: {
    canonical: "/"
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
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}${siteConfig.defaultOgImage}`]
  }
};

export default async function HomePage() {
  const categories = await fetchCategories();
  const videos = await fetchVideos();
  const topCategories = categories.slice(0, 6);
  const featuredVideos = videos.slice(0, 8);
  const categoryNameBySlug = new Map(categories.map((category) => [category.slug, category.name]));
  const visualShowcase = [
    {
      image: "/images/showcase/creator-studio.svg",
      slug: "studio-content",
      alt: "Studio production themed showcase",
      eyebrow: "Studio Motion",
      summary: "Clean production pipeline with premium visual direction and cinematic framing."
    },
    {
      image: "/images/showcase/global-stream.svg",
      slug: "live-streams",
      alt: "Live streaming themed showcase",
      eyebrow: "Live Discovery",
      summary: "Real-time discovery rails with modern interaction layers and global audience reach."
    },
    {
      image: "/images/showcase/community-grid.svg",
      slug: "community-content",
      alt: "Community content themed showcase",
      eyebrow: "Community Graph",
      summary: "Category-based content clusters for comments, engagement, and long-tail SEO capture."
    }
  ] as const;

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
      url: absoluteUrl(`/categories/${category.slug}`)
    }))
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
      priceCurrency: "USD"
    },
    description: siteConfig.description,
    url: siteConfig.url
  };

  return (
    <main>
      <section className="hero container">
        <div className="hero-copy reveal-up">
          <p className="eyebrow">Modern Creator Platform</p>
          <h1>
            Admin-curated streaming,
            <span> cinematic UX, and SEO-driven discovery.</span>
          </h1>
          <p>
            Built for scale like top product-grade websites: smooth, clean, fast, and category-intelligent.
            Every category has its own dedicated folder, route, comments flow, and metadata footprint.
          </p>

          <div className="hero-actions">
            <Link href="/watch/featured-launch-film" className="btn primary">
              Start Watching <MdArrowForward size={18} />
            </Link>
            <Link href="/categories" className="btn ghost">
              Explore Categories
            </Link>
          </div>

          <div className="hero-badges">
            <span>
              <MdShield size={16} /> Admin-only publishing
            </span>
            <span>
              <MdSpeed size={16} /> High-performance rendering
            </span>
            <span>
              <MdAutoAwesome size={16} /> AI + SEO optimization ready
            </span>
          </div>

          <div className="insight-rail">
            {topCategories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="insight-chip">
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="hero-visual reveal-scale" aria-hidden>
          <ParticleCanvas />
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
              <MdVerified size={20} /> Search visibility and long-tail ranking architecture
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip />

      <section className="container highlights-enhanced reveal-up" aria-label="Platform highlights">
        <article className="highlight-card">
          <div className="highlight-number">50<span>+</span></div>
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

      <section className="container featured-videos reveal-up" aria-label="Featured videos">
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
            <p>Fresh uploads will appear here as soon as admins publish new videos.</p>
          </div>
        ) : (
          <div className="video-rail-grid">
            {featuredVideos.map((video) => (
              <Link key={video.id} href={`/watch/${video.id}`} className="video-rail-card">
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
                  <p className="video-category-chip">{video.category?.name || "Featured"}</p>
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

      <section className="container visual-showcase reveal-scale" aria-label="Visual category showcase">
        <div className="section-heading-inline">
          <div>
            <p className="eyebrow">Visual Direction</p>
            <h2>Modern product-grade visuals with depth</h2>
          </div>
        </div>

        <div className="visual-showcase-grid">
          {visualShowcase.map((panel) => {
            const categoryName = categoryNameBySlug.get(panel.slug) || panel.slug.replace(/-/g, " ");

            return (
              <Link key={panel.slug} href={`/categories/${panel.slug}`} className="visual-showcase-card">
                <div className="visual-showcase-media" aria-hidden>
                  <Image
                    src={panel.image}
                    alt={panel.alt}
                    width={760}
                    height={460}
                    className="visual-showcase-image"
                  />
                </div>
                <div className="visual-showcase-body">
                  <p>{panel.eyebrow}</p>
                  <h3>{categoryName}</h3>
                  <span>{panel.summary}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container feature-grid reveal-up" aria-label="Platform capabilities">
        <article>
          <MdLayers size={22} />
          <h3>Category Engine</h3>
          <p>Group-based browsing, clean slugs, and scalable metadata for every category route.</p>
        </article>
        <article>
          <MdRocketLaunch size={22} />
          <h3>Performance First</h3>
          <p>Lightweight effects, GPU-friendly transforms, and smooth interactions for lag-free UX.</p>
        </article>
        <article>
          <MdAllInclusive size={22} />
          <h3>3D Experience</h3>
          <p>Intentional 3D card depth and layered backgrounds without heavy rendering cost.</p>
        </article>
        <article>
          <MdSpeed size={22} />
          <h3>Long-Term SEO</h3>
          <p>Sitemap, robots, schema, keywords, canonical links, and AI-ready metadata workflow.</p>
        </article>
        <article>
          <MdPublic size={22} />
          <h3>Global Category Reach</h3>
          <p>Region and trend categories are organized to target broad and long-tail search intent.</p>
        </article>
        <article>
          <MdVerified size={22} />
          <h3>Clean Upload Workflow</h3>
          <p>Only admin roles can publish, while users can participate through moderated comments.</p>
        </article>
      </section>

      <CategoryGrid categories={categories} />

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
    </main>
  );
}
