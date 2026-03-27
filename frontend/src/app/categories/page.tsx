import { Metadata } from "next";
import { CategoryGrid } from "@/components/category-grid";
import { fetchCategories } from "@/lib/api";
import { categorySeed } from "@/lib/categories";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "All Categories",
  description:
    "Browse all 50 video categories across content type, format, region, creator participation, themes, style, and engagement.",
  keywords: [
    "ishu categories",
    "ishu.fun video categories",
    "ishufun 50 categories",
    "all video categories",
    "50 category video platform",
    "category based video discovery",
    "admin curated categories",
    "streaming categories"
  ],
  alternates: {
    canonical: "/categories"
  },
  openGraph: {
    title: `All Categories | ${siteConfig.name}`,
    description:
      "Explore the full category architecture with dedicated pages, metadata, and moderated community comments.",
    url: absoluteUrl("/categories"),
    type: "website"
  }
};

export default async function CategoriesPage() {
  const categories = await fetchCategories();
  const source = categories.length > 0 ? categories : categorySeed;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `All ${siteConfig.name} Categories`,
    numberOfItems: source.length,
    itemListElement: source.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: category.name,
      url: absoluteUrl(`/categories/${category.slug}`)
    }))
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many categories are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `There are ${source.length} dedicated categories, each with its own page, metadata profile, and comment surface.`
        }
      },
      {
        "@type": "Question",
        name: "Can category names change later?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Category updates are propagated through the platform and old slugs are redirected to the latest slug paths."
        }
      }
    ]
  };

  return (
    <main className="container category-page">
      <section className="category-hero reveal-up">
        <p className="eyebrow">Category Directory</p>
        <h1>All 50 Categories in One Place</h1>
        <p>
          Every category has a dedicated route, metadata profile, and comments surface so discovery,
          ranking, and user navigation stay clean at scale across all {source.length} hubs.
        </p>
      </section>

      <CategoryGrid categories={source} />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
