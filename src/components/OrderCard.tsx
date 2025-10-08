import { Link } from "react-router-dom";
import { OrderDto, OrderStatus } from "@/types/dto";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Calendar } from "lucide-react";

interface OrderCardProps {
  order: OrderDto;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return "bg-success text-white";
    case OrderStatus.SHIPPED:
      return "bg-secondary text-secondary-foreground";
    case OrderStatus.PROCESSING:
      return "bg-warning text-white";
    case OrderStatus.CANCELLED:
    case OrderStatus.PAYMENT_FAILED:
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="p-6 space-y-4 hover-lift">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <p className="font-display font-semibold text-foreground">
              Order #{order.id}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{orderDate}</span>
          </div>
        </div>
        <Badge className={getStatusColor(order.status)}>
          {order.status}
        </Badge>
      </div>

      <div className="border-t pt-4">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {item.productName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} × ₹{(item.price / 100).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground">{order.shippingAddress}</p>
        </div>
      </div>

      <div className="border-t pt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-xl font-display font-bold text-primary">
            ₹{(order.total / 100).toFixed(2)}
          </p>
        </div>
        <Link to={`/order/${order.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
      </div>
    </Card>
  );
};
