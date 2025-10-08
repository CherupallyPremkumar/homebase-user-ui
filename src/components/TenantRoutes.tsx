import { ReactNode } from "react";
import { useTenant } from "@/hooks/useTenant";
import { useTheme } from "@/hooks/useTheme";
import { Loader2 } from "lucide-react";

interface TenantRoutesProps {
  children: ReactNode;
}

/**
 * Wrapper component that applies tenant theme and handles loading state
 */
export const TenantRoutes = ({ children }: TenantRoutesProps) => {
  const { tenant, isLoading } = useTenant();
  
  // Apply tenant theme and layout
  useTheme(tenant);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};
