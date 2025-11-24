import { CreditCard, Smartphone, Wallet, Building, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PaymentMethodType = "card" | "upi" | "wallet" | "netbanking" | "cod";

interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
  icon: typeof CreditCard;
  description: string;
  enabled: boolean;
  processingFee?: number; // Percentage
  iconColor: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, RuPay",
    enabled: true,
    processingFee: 0,
    iconColor: "text-blue-600",
  },
  {
    id: "upi",
    name: "UPI",
    icon: Smartphone,
    description: "Google Pay, PhonePe, Paytm",
    enabled: true,
    processingFee: 0,
    iconColor: "text-green-600",
  },
  {
    id: "wallet",
    name: "Wallets",
    icon: Wallet,
    description: "Paytm, Mobikwik, Amazon Pay",
    enabled: true,
    processingFee: 0,
    iconColor: "text-purple-600",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    icon: Building,
    description: "All major banks",
    enabled: true,
    processingFee: 0,
    iconColor: "text-orange-600",
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    icon: DollarSign,
    description: "Pay when you receive",
    enabled: true,
    processingFee: 2, // 2% handling fee
    iconColor: "text-amber-600",
  },
];

interface PaymentMethodSelectorProps {
  selected: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
  className?: string;
}

export const PaymentMethodSelector = ({
  selected,
  onSelect,
  className,
}: PaymentMethodSelectorProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paymentMethods
          .filter((method) => method.enabled)
          .map((method) => {
            const Icon = method.icon;
            const isSelected = selected === method.id;

            return (
              <Card
                key={method.id}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:shadow-md",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => onSelect(method.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg bg-background",
                      isSelected && "bg-primary/10"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", method.iconColor)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{method.name}</p>
                      {method.processingFee && method.processingFee > 0 && (
                        <Badge variant="outline" className="text-xs">
                          +{method.processingFee}% fee
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {method.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

// Compact display for showing available payment methods
export const PaymentMethodBadges = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {paymentMethods
        .filter((method) => method.enabled)
        .map((method) => {
          const Icon = method.icon;
          return (
            <div
              key={method.id}
              className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md text-xs"
            >
              <Icon className={cn("h-3.5 w-3.5", method.iconColor)} />
              <span className="text-muted-foreground">{method.name}</span>
            </div>
          );
        })}
    </div>
  );
};
