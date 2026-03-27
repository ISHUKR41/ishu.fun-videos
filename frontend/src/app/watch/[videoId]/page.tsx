import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalThumbnail } from "@/components/external-thumbnail";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { fetchVideoById, fetchVideos } from "@/lib/api";

const FEATURED_FALLBACK_VIDEO_ID = "featured-launch-film";

type WatchPageProps = {
  params: { videoId: string };
};

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const canonical = `/watch/${params.videoId}`;
  const readableId = params.videoId.replace(/-/g, " ");
  const video = await fetchVideoById(params.videoId);

  if (!video && params.videoId !== FEATURED_FALLBACK_VIDEO_ID) {
    return {
      title: "Video Not Found",
      description: "The requested video is unavailable.",
      robots: {
        index: false,
        follow: false
      },
      alternates: {
        canonical
      }
    };
  }

  const pageTitle = video?.title || `Watch ${readableId} Video`;
  const pageDescription =
    video?.description ||
    "Watch smooth, high-quality streaming with metadata-rich playback pages and admin-curated catalog discovery.";
  const thumbnail = video?.thumbnailUrl || `${siteConfig.url}/og-image.jpg`;
  const categoryName = video?.category?.name || "featured";

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      `${pageTitle.toLowerCase()} video`,
      `${categoryName.toLowerCase()} videos`,
      `ishu ${categoryName.toLowerCase()} videos`,
      "ishu.fun watch",
      "ishufun streaming",
      "video watch page",
      "high quality streaming",
      "admin curated video platform",
      "seo optimized video page",
      "professional streaming player"
    ],
    alternates: {
      canonical
    },
    openGraph: {
      title: `${siteConfig.name} Watch: ${pageTitle}`,
      description: pageDescription,
      url: absoluteUrl(canonical),
      type: "video.other",
      images: [
        {
          url: thumbnail,
          width: 1200,
          height: 630,
          alt: pageTitle
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} Watch: ${pageTitle}`,
      description: pageDescription,
      images: [thumbnail]
    }
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const readableId = params.videoId.replace(/-/g, " ");
  const video = await fetchVideoById(params.videoId);

  if (!video && params.videoId !== FEATURED_FALLBACK_VIDEO_ID) {
    notFound();
  }

  const relatedVideos = video?.category?.slug ? await fetchVideos(video.category.slug) : [];
  const related = relatedVideos.filter((item) => item.id !== params.videoId).slice(0, 6);
  const canonicalUrl = absoluteUrl(`/watch/${params.videoId}`);
  const thumbnail = video?.thumbnailUrl || `${siteConfig.url}/og-image.jpg`;

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video?.title || `Watch ${readableId}`,
    description: video?.description || "SEO-first watch page with fast rendering and modern playback shell.",
    url: canonicalUrl,
    embedUrl: canonicalUrl,
    thumbnailUrl: [thumbnail],
    isFamilyFriendly: true,
    uploadDate: video?.createdAt || new Date().toISOString(),
    genre: video?.category?.name || "Entertainment",
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/WatchAction",
      userInteractionCount: Math.max(related.length * 7, 12)
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    },
    inLanguage: "en",
    potentialAction: {
      "@type": "WatchAction",
      target: canonicalUrl
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Watch",
        item: absoluteUrl("/watch/featured-launch-film")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: video?.title || readableId,
        item: canonicalUrl
      }
    ]
  };

  return (
    <main className="container watch-page">
      <section className="player-shell reveal-scale">
        <div className="fake-video">
          {video?.thumbnailUrl ? (
            <div className="player-media" aria-hidden>
              <ExternalThumbnail
                src={video.thumbnailUrl}
                alt=""
                className="player-media-image"
                sizes="100vw"
                priority
              />
            </div>
          ) : null}
          <div className="play-indicator" aria-hidden>
            ▶
          </div>
          <p>{video?.title || `Video ID: ${params.videoId}`}</p>
        </div>
      </section>

      <section className="video-meta">
        <h1>{video?.title || "Featured Streaming Experience"}</h1>
        <p>
          {video?.description ||
            "This watch page is optimized for metadata, social previews, smooth rendering, and scalable player integration."}
        </p>
        {video?.category ? (
          <p>
            Category: <Link href={`/categories/${video.category.slug}`}>{video.category.name}</Link>
          </p>
        ) : null}
      </section>

      <section className="related-feed" aria-label="Related videos">
        <div className="section-heading-inline">
          <div>
            <p className="eyebrow">Next Up</p>
            <h2>Related videos</h2>
          </div>
        </div>
        {related.length > 0 ? (
          <div className="video-rail-grid">
            {related.map((item) => (
              <Link key={item.id} href={`/watch/${item.id}`} className="video-rail-card">
                <div className="video-thumb-fallback" aria-hidden>
                  {item.thumbnailUrl ? (
                    <div className="video-thumb-media">
                      <ExternalThumbnail
                        src={item.thumbnailUrl}
                        alt=""
                        className="video-thumb-media-image"
                        sizes="(max-width: 780px) 100vw, (max-width: 1100px) 50vw, 25vw"
                      />
                    </div>
                  ) : null}
                  <span>▶</span>
                </div>
                <div className="video-rail-body">
                  <p className="video-category-chip">{item.category?.name || "Featured"}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="featured-empty">
            <p>Related videos will appear once this category has more published uploads.</p>
          </div>
        )}
      </section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}
