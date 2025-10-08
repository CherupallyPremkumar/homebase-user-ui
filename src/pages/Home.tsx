import { useState, useEffect } from "react";
import { ProductDto } from "@/types/dto";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { toast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/useTenant";
import { Loader2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "rating";

const Home = () => {
  const { tenant } = useTenant();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [allProducts, setAllProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<SortOption>("rating");

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

  const applyFiltersAndSorting = (category: string, sort: SortOption) => {
    let filtered = category === "All" 
      ? [...allProducts] 
      : allProducts.filter(p => p.category === category);

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setProducts(filtered);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    applyFiltersAndSorting(category, sortOption);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    applyFiltersAndSorting(selectedCategory, sort);
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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filter & Sort Section */}
        <div className="mb-6 sm:mb-8 space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
                className="transition-base text-xs sm:text-sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Best Rating</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
