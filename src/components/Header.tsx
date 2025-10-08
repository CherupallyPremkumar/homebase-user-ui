import { Link } from "react-router-dom";
import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "@/hooks/useTenant";

interface HeaderProps {
  cartItemCount?: number;
}

export const Header = ({ cartItemCount = 0 }: HeaderProps) => {
  const { tenant, buildRoute } = useTenant();

  if (!tenant) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to={buildRoute("/")} className="flex items-center space-x-2">
            {tenant.theme.logoUrl ? (
              <img 
                src={tenant.theme.logoUrl} 
                alt={tenant.name} 
                className="h-8 w-auto"
              />
            ) : (
              <h1 className="text-2xl font-display font-bold text-foreground">
                {tenant.name}
              </h1>
            )}
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to={buildRoute("/")} 
              className="text-sm font-medium text-foreground hover:text-primary transition-base"
            >
              Shop
            </Link>
            <Link 
              to={buildRoute("/orders")} 
              className="text-sm font-medium text-foreground hover:text-primary transition-base flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              My Orders
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to={buildRoute("/cart")}>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
