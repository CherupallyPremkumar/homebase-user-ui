import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartItemDto } from "@/types/dto";
import { cartService } from "../services/cartService";
import { Header } from "@/components/shared/Header";
import { CartItemCard } from "./CartItemCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/useTenant";
import { Loader2, ShoppingBag, ArrowRight } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const { tenant, buildRoute } = useTenant();
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenant) {
      loadCart();
    }
  }, [tenant]);

  const loadCart = async () => {
    try {
      const data = await cartService.getCart(tenant?.id);
      setCartItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      await cartService.updateCartItem(itemId, quantity, tenant?.id);
      setCartItems((items) =>
        items.map((item) =>
          item.id === itemId
            ? { ...item, quantity, subtotal: item.price * quantity }
            : item
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await cartService.removeFromCart(itemId, tenant?.id);
      setCartItems((items) => items.filter((item) => item.id !== itemId));
      toast({
        title: "Removed",
        description: "Item removed from cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const shipping = subtotal > 99900 ? 0 : 15000; // Free shipping over ₹999
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItems={[]} />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header cartItems={[]} />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Start adding some beautiful items to your cart
          </p>
          <Button onClick={() => navigate(buildRoute("/"))}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={cartItems} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 space-y-4 sticky top-24">
              <h2 className="text-xl font-display font-bold text-foreground">
                Order Summary
              </h2>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₹{(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (GST 18%)</span>
                  <span className="text-foreground">₹{(tax / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? "FREE" : `₹${(shipping / 100).toFixed(2)}`}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-display font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">₹{(total / 100).toFixed(2)}</span>
              </div>

              {subtotal < 99900 && (
                <p className="text-xs text-muted-foreground">
                  Add ₹{((99900 - subtotal) / 100).toFixed(2)} more for free shipping
                </p>
              )}

              <Button
                size="lg"
                className="w-full gap-2"
                onClick={() => navigate(buildRoute("/checkout"))}
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
