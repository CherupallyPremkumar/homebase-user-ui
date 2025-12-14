import { useContext } from "react";
import { TenantContext } from "@/contexts/TenantContext";
import { buildTenantRoute } from "@/utils/tenantDetection";

/**
 * Hook to access current tenant and build tenant-aware routes
 */
export const useTenant = () => {
  const context = useContext(TenantContext);
  
  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }

  const { tenant, isLoading, setTenant } = context;

  /**
   * Build a tenant-aware route
   */
  const buildRoute = (route: string): string => {
    if (!tenant) return route;
    return buildTenantRoute(tenant, route);
  };

  return {
    tenant,
    isLoading,
    setTenant,
    buildRoute,
  };
};
