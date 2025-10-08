import { Package, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderDto, OrderStatus } from "@/types/dto";
import { useTenant } from "@/hooks/useTenant";
import { useNavigate } from "react-router-dom";

interface OrderSummaryCardProps {
  orders: OrderDto[];
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return "bg-green-500/10 text-green-700 hover:bg-green-500/20";
    case OrderStatus.SHIPPED:
      return "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20";
    case OrderStatus.PROCESSING:
      return "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20";
    case OrderStatus.CANCELLED:
    case OrderStatus.PAYMENT_FAILED:
      return "bg-red-500/10 text-red-700 hover:bg-red-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const OrderSummaryCard = ({ orders }: OrderSummaryCardProps) => {
  const { buildRoute } = useTenant();
  const navigate = useNavigate();

  const recentOrders = orders.slice(0, 3);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-display flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Track your recent purchases</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(buildRoute("/orders"))}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No orders yet</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => navigate(buildRoute("/"))}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-smooth cursor-pointer hover:shadow-md"
                onClick={() => navigate(buildRoute(`/order/${order.id}`))}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-sm">Order #{order.id}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.items.length} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    ₹{order.total.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
