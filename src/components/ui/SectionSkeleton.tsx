import { Skeleton } from "@/components/ui/skeleton";

interface SectionSkeletonProps {
  variant?: "hero" | "content" | "gallery" | "cards";
}

export const SectionSkeleton = ({ variant = "content" }: SectionSkeletonProps) => {
  if (variant === "hero") {
    return (
      <div className="relative h-screen w-full bg-background">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-3/4 max-w-2xl" />
          <Skeleton className="h-6 w-2/3 max-w-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "gallery") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video rounded-lg" />
        ))}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-3/4 max-w-xl" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

export default SectionSkeleton;