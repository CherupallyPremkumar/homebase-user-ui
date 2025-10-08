import { useState, useEffect } from "react";
import { ProductDto } from "@/types/dto";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/useTenant";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const { tenant } = useTenant();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (tenant) {
      loadProducts();
      loadCartCount();
    }
  }, [tenant]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts(tenant?.id);
      setAllProducts(data);
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

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      setProducts(allProducts);
    } else {
      setProducts(allProducts.filter(p => p.category === category));
    }
  };

  const categories = ["All", ...Array.from(new Set(allProducts.map(p => p.category)))];

  const loadCartCount = async () => {
    try {
      const cart = await cartService.getCart(tenant?.id);
      setCartItemCount(cart.length);
    } catch (error) {
      console.error("Failed to load cart count", error);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await cartService.addToCart(productId, 1, tenant?.id);
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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <section className="mb-12 sm:mb-16 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-foreground">
            Transform Your Space
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Discover handpicked home decor pieces that bring warmth and character to every room
          </p>
        </section>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter(category)}
              className="transition-base"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
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
