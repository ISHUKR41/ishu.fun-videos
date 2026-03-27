'use client';

export function CategorySkeleton() {
  return (
    <div className="category-card-skeleton">
      <div className="skeleton-gradient" />
      <div className="skeleton-content">
        <div className="skeleton-header">
          <div className="skeleton-pill" />
          <div className="skeleton-icon" />
        </div>
        <div className="skeleton-title" />
        <div className="skeleton-description">
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      </div>
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="category-grid-enhanced">
      {Array.from({ length: 8 }).map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </div>
  );
}
