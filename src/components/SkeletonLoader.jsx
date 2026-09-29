import React from 'react';

export const FoodCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between h-[320px]">
    <div>
      <div className="w-full h-40 rounded-xl skeleton-shimmer mb-3" />
      <div className="h-5 w-3/4 skeleton-shimmer rounded mb-2" />
      <div className="h-3.5 w-full skeleton-shimmer rounded mb-1" />
      <div className="h-3.5 w-2/3 skeleton-shimmer rounded mb-3" />
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
      <div className="h-6 w-16 skeleton-shimmer rounded-lg" />
      <div className="h-9 w-24 skeleton-shimmer rounded-xl" />
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="flex flex-wrap gap-2 pb-2">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="h-9 w-28 rounded-xl skeleton-shimmer" />
    ))}
  </div>
);

export const OrderTrackingSkeleton = () => (
  <div className="max-w-2xl mx-auto p-4 space-y-6">
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="h-8 w-48 skeleton-shimmer rounded mb-3" />
      <div className="h-4 w-32 skeleton-shimmer rounded mb-6" />
      <div className="h-32 w-full skeleton-shimmer rounded-xl mb-4" />
      <div className="space-y-4 pt-4 border-t border-slate-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="w-8 h-8 rounded-full skeleton-shimmer flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-40 skeleton-shimmer rounded mb-1.5" />
              <div className="h-3 w-60 skeleton-shimmer rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const AdminKPISkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="h-4 w-24 skeleton-shimmer rounded mb-3" />
        <div className="h-8 w-16 skeleton-shimmer rounded" />
      </div>
    ))}
  </div>
);

export const PageSkeleton = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
    <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
    <div className="h-4 w-44 skeleton-shimmer rounded mb-2" />
    <div className="h-3 w-32 skeleton-shimmer rounded" />
  </div>
);

