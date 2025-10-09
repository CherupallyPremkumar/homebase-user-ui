import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductDto } from "@/types/dto";
import { ShoppingCart, Package, ExternalLink } from "lucide-react";
import { ProductImageCarousel } from "@/components/ProductImageCarousel";
import { AnimatedRating } from "@/components/AnimatedRating";
import { Link } from "react-router-dom";
import { useTenant } from "@/hooks/useTenant";

interface QuickViewModalProps {
  product: ProductDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (productId: number) => void;
}

const QuickViewModal = ({
  product,
  open,
  onOpenChange,
  onAddToCart,
}: QuickViewModalProps) => {
  const { buildRoute } = useTenant();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!open) {
      setQuantity(1);
    }
  }, [open]);

  if (!product) return null;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product.id);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Quick View - {product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div>
            <ProductImageCarousel
              images={product.images && product.images.length > 0 ? product.images : [product.imageUrl]}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                {product.name}
              </h2>
              <p className="text-2xl font-display font-bold text-primary mb-3">
                ₹{(product.price / 100).toFixed(2)}
              </p>

              {/* Animated Rating */}
              {product.rating && (
                <div className="mb-3">
                  <AnimatedRating rating={product.rating} />
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              {isOutOfStock ? (
                <Badge variant="destructive">Out of Stock</Badge>
              ) : isLowStock ? (
                <Badge variant="outline" className="border-warning text-warning">
                  Only {product.stock} left
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-mono">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="h-8 w-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {isOutOfStock ? "Out of Stock" : `Add ${quantity} to Cart`}
              </Button>
              <Link to={buildRoute(`/product/${product.id}`)} className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Full Details
                </Button>
              </Link>
            </div>

            {/* Product Features */}
            <div className="bg-muted rounded-lg p-4 space-y-1 text-xs text-muted-foreground">
              <p>✓ Free shipping on orders over ₹999</p>
              <p>✓ Easy returns within 30 days</p>
              <p>✓ Handcrafted with care</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
