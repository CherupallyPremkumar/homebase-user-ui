import { Link } from "react-router-dom";
import { ProductDto } from "@/types/dto";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/hooks/useTenant";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  product: ProductDto;
  onAddToCart?: (productId: number) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { buildRoute } = useTenant();
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Card className="overflow-hidden hover-lift group h-full flex flex-col gradient-card">
      <Link to={buildRoute(`/product/${product.id}`)}>
        <div className="aspect-square overflow-hidden bg-muted relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-smooth group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
        </div>
      </Link>
      
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
        <div className="space-y-1 flex-1">
          <Link to={buildRoute(`/product/${product.id}`)}>
            <h3 className="font-display font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-base line-clamp-2">
              {product.name}
            </h3>
          </Link>
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-primary text-primary" />
              <span className="text-xs sm:text-sm font-medium text-foreground">{product.rating}</span>
            </div>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 hidden sm:block">
            {product.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <p className="text-base sm:text-lg font-display font-bold text-primary">
              ₹{(product.price / 100).toFixed(2)}
            </p>
            {isLowStock && !isOutOfStock && (
              <Badge variant="outline" className="text-xs border-warning text-warning">
                Only {product.stock} left
              </Badge>
            )}
          </div>

          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(product.id);
            }}
            disabled={isOutOfStock}
            className="gap-1 sm:gap-2 text-xs sm:text-sm w-full sm:w-auto"
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            {isOutOfStock ? "Out" : "Add"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
