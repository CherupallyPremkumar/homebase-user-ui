import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductDto } from "@/types/dto";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/useTenant";
import { ShoppingCart, ArrowLeft, Loader2, Package } from "lucide-react";
import { ProductImageCarousel } from "@/components/ProductImageCarousel";
import { AnimatedRating } from "@/components/AnimatedRating";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tenant, buildRoute } = useTenant();
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (id && tenant) {
      loadProduct(parseInt(id));
      loadCartCount();
    }
  }, [id, tenant]);

  const loadProduct = async (productId: number) => {
    try {
      const data = await productService.getProductById(productId, tenant?.id);
      setProduct(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const cart = await cartService.getCart(tenant?.id);
      setCartItemCount(cart.length);
    } catch (error) {
      console.error("Failed to load cart count", error);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await cartService.addToCart(product.id, 1, tenant?.id);
      setCartItemCount((prev) => prev + 1);
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={cartItemCount} />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItemCount={cartItemCount} />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItemCount} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(buildRoute("/"))}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images with Zoom */}
          <div className="space-y-4">
            <ProductImageCarousel
              images={product.images && product.images.length > 0 ? product.images : [product.imageUrl]}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-display font-bold text-primary mb-4">
                ₹{(product.price / 100).toFixed(2)}
              </p>
              
              {/* Animated Rating */}
              {product.rating && (
                <div className="py-4 border-t border-border">
                  <AnimatedRating rating={product.rating} />
                </div>
              )}
            </div>

            <div className="border-t border-b py-6">
              <p className="text-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                {isOutOfStock ? (
                  <Badge variant="destructive">Out of Stock</Badge>
                ) : isLowStock ? (
                  <Badge variant="outline" className="border-warning text-warning">
                    Only {product.stock} left in stock
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    In Stock ({product.stock} available)
                  </span>
                )}
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full sm:w-auto gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>

            <div className="bg-accent rounded-lg p-6 space-y-2">
              <h3 className="font-display font-semibold text-foreground">
                Product Details
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Free shipping on orders over ₹999</li>
                <li>• Easy returns within 30 days</li>
                <li>• Handcrafted with care</li>
                <li>• Sustainable materials</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
