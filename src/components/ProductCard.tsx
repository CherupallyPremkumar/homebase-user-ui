import { Link } from "react-router-dom";
import { ProductDto } from "@/types/dto";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/hooks/useTenant";
import { ShoppingCart, Star } from "lucide-react";
import { ProductLayoutType } from "@/types/tenant";

interface ProductCardProps {
  product: ProductDto;
  onAddToCart?: (productId: number) => void;
  layout?: ProductLayoutType;
}

export const ProductCard = ({ product, onAddToCart, layout = "grid" }: ProductCardProps) => {
  const { buildRoute } = useTenant();
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // List layout - horizontal card
  if (layout === "list") {
    return (
      <Card className="overflow-hidden hover-lift group bg-card border-border shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={buildRoute(`/product/${product.id}`)} className="flex-shrink-0">
            <div className="w-full sm:w-48 h-48 overflow-hidden bg-muted relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-smooth group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            </div>
          </Link>
          
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <Link to={buildRoute(`/product/${product.id}`)}>
                <h3 className="font-display font-semibold text-lg text-foreground hover:text-primary transition-base">
                  {product.name}
                </h3>
              </Link>
              {product.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-medium text-foreground">{product.rating}</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
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
                size="default"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart?.(product.id);
                }}
                disabled={isOutOfStock}
                className="gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Masonry layout - varied height cards
  if (layout === "masonry") {
    return (
      <Card className="overflow-hidden hover-lift group break-inside-avoid mb-4 bg-card border-border shadow-sm">
        <Link to={buildRoute(`/product/${product.id}`)}>
          <div className="w-full overflow-hidden bg-muted relative" style={{ aspectRatio: Math.random() > 0.5 ? '3/4' : '4/3' }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-smooth group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
          </div>
        </Link>
        
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <Link to={buildRoute(`/product/${product.id}`)}>
              <h3 className="font-display font-semibold text-base text-foreground hover:text-primary transition-base line-clamp-2">
                {product.name}
              </h3>
            </Link>
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium text-foreground">{product.rating}</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-lg font-display font-bold text-primary">
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
              className="gap-2 w-full"
            >
              <ShoppingCart className="h-4 w-4" />
              {isOutOfStock ? "Out" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Default grid layout - compact card
  return (
    <Card className="overflow-hidden hover-lift group h-full flex flex-col bg-card border-border shadow-sm">
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
