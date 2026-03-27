'use client';

import Link from "next/link";
import { useState } from "react";
import {
  MdMovie,
  MdHd,
  MdPublic,
  MdPeople,
  MdTheaters,
  MdPalette,
  MdTrendingUp
} from "react-icons/md";
import { Category, CategoryGroup, getCategoryCode } from "@/lib/categories";

type CategoryGridProps = {
  categories: Category[];
};

const displayOrder: CategoryGroup[] = [
  "Content Type",
  "Quality / Format",
  "Region",
  "Creators / Participation",
  "Themes",
  "Style / Appearance",
  "Activity / Engagement"
];

const groupIcons: Record<CategoryGroup, any> = {
  "Content Type": MdMovie,
  "Quality / Format": MdHd,
  Region: MdPublic,
  "Creators / Participation": MdPeople,
  Themes: MdTheaters,
  "Style / Appearance": MdPalette,
  "Activity / Engagement": MdTrendingUp
};

const groupGradients: Record<CategoryGroup, string> = {
  "Content Type": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "Quality / Format": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  Region: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "Creators / Participation": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  Themes: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "Style / Appearance": "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "Activity / Engagement": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
};

function groupCategories(categories: Category[]) {
  const grouped = categories.reduce<Record<string, Category[]>>((acc, category) => {
    acc[category.group] ||= [];
    acc[category.group].push(category);
    return acc;
  }, {});

  return displayOrder
    .map((group) => [group, grouped[group] || []] as const)
    .filter(([, list]) => list.length > 0);
}

function CategoryCard({ category, index, group }: { category: Category; index: number; group: CategoryGroup }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="category-card-enhanced reveal-up"
      style={{ animationDelay: `${Math.min(index * 0.04, 0.28)}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="category-card-gradient" style={{ background: groupGradients[group] }} />
      <div className="category-card-content">
        <div className="category-card-header">
          <span className="pill-enhanced">{getCategoryCode(category)}</span>
          <div className="category-icon-wrapper">
            {(() => {
              const GroupIcon = groupIcons[group];
              return <GroupIcon size={20} />;
            })()}
          </div>
        </div>
        <strong className="category-title">{category.name}</strong>
        <p className="category-description">{category.description}</p>
        <div className="category-card-footer">
          <span className="category-arrow">→</span>
        </div>
      </div>
      <div className={`category-card-glow ${isHovered ? 'active' : ''}`} />
    </Link>
  );
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const groupedEntries = groupCategories(categories);

  return (
    <section className="container stacked-space" aria-labelledby="all-categories-title">
      <div className="section-heading-enhanced">
        <h2 id="all-categories-title" className="gradient-text-enhanced">All Categories</h2>
        <p className="section-subtitle">50 dedicated category hubs with professional design and seamless navigation.</p>
      </div>

      {groupedEntries.map(([group, groupedCategories]) => (
        <div key={group} className="group-block-enhanced">
          <div className="group-title-enhanced">
            <div className="group-icon-badge" style={{ background: groupGradients[group] }}>
              {(() => {
                const GroupIcon = groupIcons[group];
                return <GroupIcon size={22} color="#fff" />;
              })()}
            </div>
            <div>
              <h3>{group}</h3>
              <p className="group-subtitle">{groupedCategories.length} categories</p>
            </div>
          </div>
          <div className="category-grid-enhanced">
            {groupedCategories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} group={group} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
