import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Tag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type BadgeType = "new" | "trending" | "sale" | "limited";

interface ProductBadgeProps {
  type: BadgeType;
  value?: string | number;
  className?: string;
}

export const ProductBadge = ({ type, value, className }: ProductBadgeProps) => {
  const badges = {
    new: {
      label: "New",
      icon: Sparkles,
      className: "bg-accent text-accent-foreground border-accent animate-pulse",
    },
    trending: {
      label: "Trending",
      icon: TrendingUp,
      className: "bg-primary text-primary-foreground border-primary",
    },
    sale: {
      label: value ? `${value}% OFF` : "Sale",
      icon: Tag,
      className: "bg-destructive text-destructive-foreground border-destructive animate-bounce",
    },
    limited: {
      label: "Limited",
      icon: Clock,
      className: "bg-warning text-warning-foreground border-warning",
    },
  };

  const badge = badges[type];
  const Icon = badge.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold shadow-md gap-1 px-2 py-1",
        badge.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {badge.label}
    </Badge>
  );
};

// Helper to determine which badges to show based on product data
export const getProductBadges = (product: {
  createdAt?: string;
  rating?: number;
  stock?: number;
  discount?: number;
}): BadgeType[] => {
  const badges: BadgeType[] = [];

  // New badge: created within last 7 days
  if (product.createdAt) {
    const createdDate = new Date(product.createdAt);
    const daysSinceCreated = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated <= 7) {
      badges.push("new");
    }
  }

  // Trending badge: rating >= 4.5
  if (product.rating && product.rating >= 4.5) {
    badges.push("trending");
  }

  // Limited badge: stock <= 3
  if (product.stock && product.stock > 0 && product.stock <= 3) {
    badges.push("limited");
  }

  // Sale badge: has discount
  if (product.discount && product.discount > 0) {
    badges.push("sale");
  }

  return badges;
};
