import { useEffect, useState } from "react";
import { ProductDto } from "@/types/dto";
import { productService } from "../services/productService";
import { ProductCard } from "./ProductCard";
import { Clock } from "lucide-react";

interface RecentlyViewedProps {
  currentProductId?: number;
  maxItems?: number;
  onAddToCart: (productId: number) => void;
  onQuickView?: (product: ProductDto) => void;
}

export const RecentlyViewed = ({
  currentProductId,
  maxItems = 4,
  onAddToCart,
  onQuickView,
}: RecentlyViewedProps) => {
  const [recentProducts, setRecentProducts] = useState<ProductDto[]>([]);

  useEffect(() => {
    const loadRecentlyViewed = () => {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");

      // Filter out current product and limit items
      const filtered = viewed
        .filter((p: ProductDto) => p.id !== currentProductId)
        .slice(0, maxItems);

      setRecentProducts(filtered);
    };

    loadRecentlyViewed();
  }, [currentProductId, maxItems]);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-2xl font-display font-bold">Recently Viewed</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {recentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            layout="grid"
          />
        ))}
      </div>
    </div>
  );
};

// Helper function to add product to recently viewed
export const addToRecentlyViewed = (product: ProductDto) => {
  const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");

  // Remove if already exists
  const filtered = viewed.filter((p: ProductDto) => p.id !== product.id);

  // Add to beginning
  const updated = [product, ...filtered].slice(0, 12); // Keep max 12

  localStorage.setItem("recentlyViewed", JSON.stringify(updated));
};
