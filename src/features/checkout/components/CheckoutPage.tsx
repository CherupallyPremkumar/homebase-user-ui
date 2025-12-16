import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutFormData } from "@/types/dto";
import { orderService } from "@/features/orders/services/orderService";
import { paymentService } from "../services/paymentService";
import { Header } from "@/components/shared/Header";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PaymentMethodSelector, type PaymentMethodType, paymentMethods } from "./PaymentMethodSelector";
import { ShippingCalculator } from "./ShippingCalculator";
import { toast } from "@/hooks/useToast";
import { Loader2, CreditCard } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, loading } = useCart();
  const [processing, setProcessing] = useState(false);
  const [shippingCost, setShippingCost] = useState(0); // Set by backend now
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("card");
  const [checkoutTotals, setCheckoutTotals] = useState<any>(null); // Backend preview data
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    state: "",
    pincode: "",
  });

  const { user } = useAuth(); // Get authenticated user

  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      navigate("/cart");
    } else if (cartItems.length > 0) {
      // Fetch backend calculation
      orderService.previewOrder(cartItems)
        .then(data => setCheckoutTotals(data))
        .catch(err => toast({ title: "Error", description: "Failed to load pricing", variant: "destructive" }));
    }
  }, [loading, cartItems, navigate]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || "",
        customerEmail: user.email || ""
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fallback to local if loading (display 0 or spinner)
  const subtotal = checkoutTotals ? checkoutTotals.subtotal / 100 : 0;
  const tax = checkoutTotals ? checkoutTotals.tax / 100 : 0;
  const backendShipping = checkoutTotals ? checkoutTotals.shipping / 100 : 0;

  // Payment fee calculation (Frontend addition)
  const selectedPaymentMethod = paymentMethods.find(m => m.id === paymentMethod);
  const processingFee = (selectedPaymentMethod?.processingFee && checkoutTotals)
    ? Math.round((checkoutTotals.total / 100) * (selectedPaymentMethod.processingFee / 100))
    : 0;

  const total = checkoutTotals ? (checkoutTotals.total / 100) + processingFee : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone ||
      !formData.shippingAddress || !formData.city || !formData.state || !formData.pincode) {
      toast({ title: "Validation Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.customerPhone)) {
      toast({ title: "Invalid Phone Number", description: "Please enter a valid 10-digit Indian mobile number", variant: "destructive" });
      return;
    }

    setProcessing(true);

    try {
      // Backend will re-calculate, so simple fields are fine
      const order = await orderService.createOrder({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: `${formData.shippingAddress}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
        // These are ignored by backend now, but good to send
        subtotal: subtotal * 100,
        tax: tax * 100,
        shippingCost: backendShipping * 100,
        total: total * 100,
      });

      const paymentRequest = {
        amount: Math.round(total * 100), // Ensure cents
        currency: "INR",
        orderId: order.id,
        customerPhone: `+91${formData.customerPhone}`,
        customerName: formData.customerName,
        redirectUrl: `${window.location.origin}/order/${order.id}`,
        callbackUrl: `${window.location.origin}/api/payment/callback`,
      };

      const paymentResponse = await paymentService.createPayment(paymentRequest);

      if (paymentResponse.success && paymentResponse.paymentUrl) {
        window.location.href = paymentResponse.paymentUrl;
      } else {
        throw new Error(paymentResponse.message || "Payment initiation failed");
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to process order. Please try again.", variant: "destructive" });
      setProcessing(false);
    }
  };

  if (loading || !checkoutTotals) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Calculating best prices...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email *</Label>
                    <Input id="customerEmail" name="customerEmail" type="email" value={formData.customerEmail} onChange={handleInputChange} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input id="customerPhone" name="customerPhone" type="tel" placeholder="9876543210" maxLength={10} value={formData.customerPhone} onChange={handleInputChange} required className="mt-1" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shippingAddress">Street Address *</Label>
                    <Input id="shippingAddress" name="shippingAddress" value={formData.shippingAddress} onChange={handleInputChange} required className="mt-1" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input id="pincode" name="pincode" maxLength={6} value={formData.pincode} onChange={handleInputChange} required className="mt-1" />
                    </div>
                  </div>
                </div>
              </Card>

              <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 space-y-4 sticky top-24">
                <h2 className="text-xl font-display font-bold text-foreground">Order Summary</h2>
                <Separator />
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {checkoutTotals.items.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      {/* Backend items might not have subtotal in cents correctly if not populated? 
                          Actually controller populates items list in DTO with original items.
                          So use item subtotal from props or just calculate display?
                          Original items have subtotal. */}
                      <p className="text-sm font-medium">₹{(item.subtotal / 100).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax (GST 18%)</span><span>₹{tax.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>{backendShipping === 0 ? "FREE" : `₹${backendShipping.toFixed(2)}`}</span></div>
                  {processingFee > 0 && (
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Processing Fee</span><span>₹{processingFee.toFixed(2)}</span></div>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-display font-bold">
                  <span>Total</span><span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
                <Button type="submit" size="lg" className="w-full gap-2" disabled={processing}>
                  {processing ? (<><Loader2 className="h-4 w-4 animate-spin" />Processing...</>) : (<><CreditCard className="h-4 w-4" />Pay Securely</>)}
                </Button>
                <p className="text-xs text-center text-muted-foreground">Secure payment powered by PhonePe</p>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
