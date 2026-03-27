import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CommentSection } from "@/components/comment-section";
import { ExternalThumbnail } from "@/components/external-thumbnail";
import { categorySeed, findCategoryBySlug } from "@/lib/categories";
import { fetchCategories, fetchCategoryLookup, fetchCategoryOverview } from "@/lib/api";
import {
  categoryDescription,
  faqSchemaForCategory,
  categorySchema,
  categoryTitle,
  keywordsForCategory
} from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = true;
export const revalidate = 120;

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const categories = await fetchCategories();
  const source = categories.length > 0 ? categories : categorySeed;

  return source.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lookup = await fetchCategoryLookup(params.slug);
  const category = lookup.category || findCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: "Category Not Found | ISHU.FUN"
    };
  }

  return {
    title: categoryTitle(category),
    description: categoryDescription(category),
    keywords: keywordsForCategory(category),
    alternates: {
      canonical: `/categories/${category.slug}`
    },
    openGraph: {
      title: categoryTitle(category),
      description: categoryDescription(category),
      url: absoluteUrl(`/categories/${category.slug}`),
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: categoryTitle(category),
      description: categoryDescription(category)
    }
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const lookup = await fetchCategoryLookup(params.slug);
  const category = lookup.category || findCategoryBySlug(params.slug);
  const allCategories = await fetchCategories();
  const categorySource = allCategories.length > 0 ? allCategories : categorySeed;

  if (!category) {
    notFound();
  }

  const redirectTarget = lookup.redirectTo || (category.slug !== params.slug ? `/categories/${category.slug}` : null);

  if (redirectTarget) {
    redirect(redirectTarget);
  }

  const overview = await fetchCategoryOverview(category.slug);
  const relatedCategories = categorySource
    .filter((item) => item.group === category.group && item.slug !== category.slug)
    .slice(0, 8);

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
        name: "Categories",
        item: absoluteUrl("/categories")
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: absoluteUrl(`/categories/${category.slug}`)
      }
    ]
  };

  const relatedItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.group} related categories`,
    itemListElement: relatedCategories.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(`/categories/${item.slug}`)
    }))
  };

  return (
    <main className="container category-page">
      <section className="category-hero reveal-up">
        <p className="eyebrow">{category.group}</p>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        <div className="category-stats-grid">
          <article>
            <h3>{overview?.stats.videos ?? 0}</h3>
            <p>Published videos</p>
          </article>
          <article>
            <h3>{overview?.stats.comments ?? 0}</h3>
            <p>Approved comments</p>
          </article>
          <article>
            <h3>SEO</h3>
            <p>Schema + canonical + sitemap coverage</p>
          </article>
        </div>
        <div className="keyword-row">
          {category.seoKeywords.map((keyword) => (
            <span key={keyword} className="keyword-chip">
              {keyword}
            </span>
          ))}
        </div>
      </section>

      <section className="category-video-feed reveal-up" aria-label="Latest videos in category">
        <div className="section-heading-inline">
          <div>
            <p className="eyebrow">Latest Uploads</p>
            <h2>{category.name} videos</h2>
          </div>
          <Link href="/categories" className="btn ghost small">
            Explore more categories
          </Link>
        </div>

        {overview?.latestVideos?.length ? (
          <div className="video-rail-grid">
            {overview.latestVideos.map((video) => (
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
                  <span>▶</span>
                </div>
                <div className="video-rail-body">
                  <p className="video-category-chip">{category.name}</p>
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="featured-empty">
            <p>No published videos yet in this category. Admin uploads will appear here once ready.</p>
          </div>
        )}
      </section>

      <CommentSection categorySlug={category.slug} />

      {relatedCategories.length > 0 ? (
        <section className="reveal-up" aria-label="Related category links">
          <div className="section-heading-inline">
            <div>
              <p className="eyebrow">Discovery Cluster</p>
              <h2>Related in {category.group}</h2>
            </div>
          </div>
          <div className="insight-rail">
            {relatedCategories.map((item) => (
              <Link key={item.id} href={`/categories/${item.slug}`} className="insight-chip">
                {item.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categorySchema(category))
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchemaForCategory(category))
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(relatedItemListSchema)
        }}
      />
    </main>
  );
}
