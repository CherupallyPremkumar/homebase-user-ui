import { useEffect, useState } from "react";
import { ProductDto } from "@/types/dto";
import { ProductCard } from "@/components/ProductCard";
import { Users } from "lucide-react";

interface ProductRecommendationsProps {
  currentProduct: ProductDto;
  allProducts: ProductDto[];
  maxItems?: number;
  onAddToCart: (productId: number) => void;
  onQuickView?: (product: ProductDto) => void;
}

export const ProductRecommendations = ({
  currentProduct,
  allProducts,
  maxItems = 4,
  onAddToCart,
  onQuickView,
}: ProductRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<ProductDto[]>([]);

  useEffect(() => {
    // Get recommendations based on:
    // 1. Same category
    // 2. Similar price range
    // 3. High ratings
    const getRecommendations = () => {
      const sameCategoryProducts = allProducts.filter(
        (p) => p.category === currentProduct.category && p.id !== currentProduct.id
      );

      // Sort by rating and price similarity
      const sorted = sameCategoryProducts.sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        const priceSimA = Math.abs(a.price - currentProduct.price);
        const priceSimB = Math.abs(b.price - currentProduct.price);
        
        // Prioritize high ratings and similar prices
        return (ratingB - ratingA) * 100 + (priceSimA - priceSimB);
      });

      setRecommendations(sorted.slice(0, maxItems));
    };

    getRecommendations();
  }, [currentProduct, allProducts, maxItems]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-2xl font-display font-bold">Customers Also Bought</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {recommendations.map((product) => (
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
