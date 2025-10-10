// src/components/TenantRoutes.tsx
import { ReactNode } from "react";
import { useTenant } from "@/hooks/useTenant";
import { useTheme } from "@/hooks/useTheme";
import { Loader2 } from "lucide-react";

interface TenantRoutesProps {
  children: ReactNode;
}

export const TenantRoutes = ({ children }: TenantRoutesProps) => {
  const { tenant, isLoading } = useTenant();

  useTheme(tenant); // apply theme globally

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};
