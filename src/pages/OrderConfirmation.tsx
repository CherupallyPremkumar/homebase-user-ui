import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OrderDto } from "@/types/dto";
import { orderService } from "@/services/orderService";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, Package, MapPin, Phone, Mail } from "lucide-react";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    }
  }, [orderId]);

  const loadOrder = async (id: string) => {
    try {
      const data = await orderService.getOrderById(id);
      if (data) {
        setOrder(data);
      } else {
        toast({
          title: "Error",
          description: "Order not found",
          variant: "destructive",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Order ID: <span className="font-mono font-semibold">{order.id}</span>
            </p>
          </div>

          {/* Order Details */}
          <Card className="p-6 space-y-6 mb-6">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        ₹{(item.subtotal / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{(order.subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">₹{(order.tax / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {order.shippingCost === 0 ? "FREE" : `₹${(order.shippingCost / 100).toFixed(2)}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-display font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">₹{(order.total / 100).toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Shipping Information */}
          <Card className="p-6 space-y-4 mb-6">
            <h2 className="text-xl font-display font-bold text-foreground">
              Delivery Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">{order.shippingAddress}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <p className="text-muted-foreground">{order.customerPhone}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p className="text-muted-foreground">{order.customerEmail}</p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/orders")}
            >
              View All Orders
            </Button>
            <Button onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </div>

          {/* Order Updates Info */}
          <Card className="p-6 mt-6 bg-accent">
            <p className="text-sm text-center text-muted-foreground">
              We've sent a confirmation email to <span className="font-semibold">{order.customerEmail}</span>.
              You'll receive updates about your order status.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
