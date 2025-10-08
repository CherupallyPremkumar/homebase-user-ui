import { Link } from "react-router-dom";
import { ProductDto } from "@/types/dto";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/hooks/useTenant";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: ProductDto;
  onAddToCart?: (productId: number) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { buildRoute } = useTenant();
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Card className="overflow-hidden hover-lift group">
      <Link to={buildRoute(`/product/${product.id}`)}>
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-base group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <Link to={buildRoute(`/product/${product.id}`)}>
            <h3 className="font-display font-semibold text-lg text-foreground hover:text-primary transition-base line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xl font-display font-bold text-primary">
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
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? "Out of Stock" : "Add"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
