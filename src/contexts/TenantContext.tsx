import React, { createContext, useState, useEffect, ReactNode } from "react";
import { TenantConfig, TenantContextType } from "@/types/tenant";
import { detectTenant, buildTenantRoute } from "@/utils/tenantDetection";

export const TenantContext = createContext<TenantContextType>({
  tenant: null,
  isLoading: true,
  setTenant: () => {},
  buildRoute: (route: string) => route,
});

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect tenant on mount
    const detectedTenant = detectTenant();
    setTenant(detectedTenant);
    setIsLoading(false);

    // Update document title
    if (detectedTenant) {
      document.title = `${detectedTenant.name} - ${detectedTenant.description || 'E-Commerce'}`;
    }
  }, []);

  const buildRoute = (route: string): string => {
    if (!tenant) return route;
    return buildTenantRoute(tenant, route);
  };

  return (
    <TenantContext.Provider value={{ tenant, isLoading, setTenant, buildRoute }}>
      {children}
    </TenantContext.Provider>
  );
};
