import { useState } from "react";
import { ShoppingBag, CreditCard, Truck, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductDto } from "@/types/dto";
import { PaymentMethodBadges } from "./PaymentMethodSelector";
import { ShippingBadge } from "./ShippingCalculator";
import { useTenant } from "@/hooks/useTenant";
import { useNavigate } from "react-router-dom";

interface CheckoutPreviewProps {
  product: ProductDto;
  quantity: number;
  trigger?: React.ReactNode;
}

export const CheckoutPreview = ({ product, quantity, trigger }: CheckoutPreviewProps) => {
  const { buildRoute } = useTenant();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const productTotal = product.price * quantity;
  const tax = Math.round(productTotal * 0.18); // 18% GST
  const shipping = productTotal >= 99900 ? 0 : 5000; // Free shipping over ₹999
  const total = productTotal + tax + shipping;

  const handleCheckout = () => {
    // In a real app, this would add to cart and navigate to checkout
    navigate(buildRoute("/checkout"));
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Quick Checkout
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Checkout Preview
          </SheetTitle>
          <SheetDescription>
            Review your order details and payment options
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Product Summary */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Order Summary</h4>
            <div className="flex gap-4 p-3 bg-muted rounded-lg">
              <div className="w-20 h-20 rounded-md overflow-hidden bg-background flex-shrink-0">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-sm line-clamp-2 mb-1">
                  {product.name}
                </h5>
                <p className="text-sm text-muted-foreground mb-2">
                  Qty: {quantity}
                </p>
                <p className="font-semibold text-sm">
                  ₹{(product.price / 100).toFixed(2)} × {quantity}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Price Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({quantity} items)</span>
                <span>₹{(productTotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (GST 18%)</span>
                <span>₹{(tax / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  Shipping
                </span>
                {shipping === 0 ? (
                  <span className="text-success font-medium">FREE</span>
                ) : (
                  <span>₹{(shipping / 100).toFixed(2)}</span>
                )}
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{(total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Info */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Shipping Details
            </h4>
            <ShippingBadge productPrice={productTotal} />
            {shipping === 0 && (
              <p className="text-xs text-success">✓ You're eligible for free shipping!</p>
            )}
          </div>

          <Separator />

          {/* Payment Methods */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Options
            </h4>
            <PaymentMethodBadges />
            <p className="text-xs text-muted-foreground">
              Select your preferred payment method at checkout
            </p>
          </div>

          {/* Checkout Button */}
          <Button onClick={handleCheckout} className="w-full gap-2" size="lg">
            Proceed to Checkout
            <span className="font-mono">₹{(total / 100).toFixed(2)}</span>
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure checkout powered by industry-standard encryption
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
