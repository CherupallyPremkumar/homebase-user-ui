import { useState, useEffect } from "react";
import { MapPin, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface ShippingEstimate {
  method: string;
  cost: number;
  estimatedDays: string;
  description: string;
}

const shippingMethods: ShippingEstimate[] = [
  {
    method: "standard",
    cost: 0,
    estimatedDays: "5-7 days",
    description: "Free standard shipping",
  },
  {
    method: "express",
    cost: 10000, // ₹100 in paise
    estimatedDays: "2-3 days",
    description: "Express delivery",
  },
  {
    method: "overnight",
    cost: 25000, // ₹250 in paise
    estimatedDays: "1 day",
    description: "Overnight delivery",
  },
];

interface ShippingCalculatorProps {
  cartTotal: number;
  onShippingSelect: (cost: number) => void;
  className?: string;
}

export const ShippingCalculator = ({
  cartTotal,
  onShippingSelect,
  className,
}: ShippingCalculatorProps) => {
  const [pincode, setPincode] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("standard");
  const [isValidPincode, setIsValidPincode] = useState(false);

  useEffect(() => {
    // Validate Indian pincode (6 digits)
    const isValid = /^\d{6}$/.test(pincode);
    setIsValidPincode(isValid);
  }, [pincode]);

  useEffect(() => {
    const method = shippingMethods.find((m) => m.method === selectedMethod);
    if (method) {
      // Free shipping for orders over ₹999
      const shippingCost = cartTotal >= 99900 && method.method === "standard" ? 0 : method.cost;
      onShippingSelect(shippingCost);
    }
  }, [selectedMethod, cartTotal, onShippingSelect]);

  const getShippingCost = (method: ShippingEstimate) => {
    if (cartTotal >= 99900 && method.method === "standard") {
      return 0;
    }
    return method.cost;
  };

  return (
    <Card className={className}>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Shipping Options</h3>
        </div>

        {/* Pincode Input */}
        <div className="space-y-2">
          <Label htmlFor="pincode" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Delivery Pincode
          </Label>
          <Input
            id="pincode"
            type="text"
            placeholder="Enter 6-digit pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className={isValidPincode ? "border-success" : ""}
          />
          {pincode && !isValidPincode && (
            <p className="text-xs text-destructive">Please enter a valid 6-digit pincode</p>
          )}
        </div>

        {/* Shipping Method Selection */}
        {isValidPincode && (
          <div className="space-y-3">
            <Label>Select Shipping Method</Label>
            {shippingMethods.map((method) => {
              const cost = getShippingCost(method);
              const isFree = cost === 0;
              
              return (
                <div
                  key={method.method}
                  onClick={() => setSelectedMethod(method.method)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMethod === method.method
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedMethod === method.method
                            ? "border-primary"
                            : "border-border"
                        }`}
                      >
                        {selectedMethod === method.method && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{method.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Delivery in {method.estimatedDays}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {isFree ? (
                        <p className="font-semibold text-success">FREE</p>
                      ) : (
                        <p className="font-semibold">₹{(cost / 100).toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {cartTotal < 99900 && (
              <p className="text-xs text-muted-foreground text-center">
                Add ₹{((99900 - cartTotal) / 100).toFixed(2)} more for free standard shipping
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

// Compact shipping badge for product cards
export const ShippingBadge = ({ productPrice }: { productPrice: number }) => {
  const isFreeShipping = productPrice >= 99900;
  
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Truck className="h-3.5 w-3.5 text-success" />
      {isFreeShipping ? (
        <span className="text-success font-medium">Free Shipping</span>
      ) : (
        <span className="text-muted-foreground">
          Free shipping on orders over ₹999
        </span>
      )}
    </div>
  );
};
