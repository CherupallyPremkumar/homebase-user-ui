import { useState, useEffect } from "react";
import { ProductDto } from "@/types/dto";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    loadProducts();
    loadCartCount();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const cart = await cartService.getCart();
      setCartItemCount(cart.length);
    } catch (error) {
      console.error("Failed to load cart count", error);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await cartService.addToCart(productId, 1);
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

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItemCount} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground">
            Transform Your Space
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover handpicked home decor pieces that bring warmth and character to every room
          </p>
        </section>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No products available at the moment</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
