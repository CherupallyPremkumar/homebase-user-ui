// src/contexts/TenantContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TenantConfig, TenantContextType } from "@/types/tenant";

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantContext = createContext<TenantContextType>({
  tenant: null,
  isLoading: true,
  setTenant: () => {},
  buildRoute: (route: string) => route,
});

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const { tenant: tenantPath } = useParams<{ tenant: string }>();
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const buildRoute = (route: string): string => {
    if (!tenant) return route;
    const basePath = tenant.urlPath ? `/${tenant.urlPath}` : "";
    return route.startsWith("/")
      ? `${basePath}${route}`
      : `${basePath}/${route}`;
  };

  useEffect(() => {
    const fetchTenant = async () => {
      if (!tenantPath) {
        console.warn("Tenant path not found in URL");
        setTenant(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Check if cached
        const cached = sessionStorage.getItem(`tenant_${tenantPath}`);
        if (cached) {
          const tenantData: TenantConfig = JSON.parse(cached);
          setTenant(tenantData);
          document.title = `${tenantData.name} - E-Commerce`;
          return;
        }

        // Fetch from backend
        const response = await axios.get<TenantConfig>(
          `/api/tenants/${tenantPath}`
        );
        if (response.data?.id) {
          setTenant(response.data);
          sessionStorage.setItem(
            `tenant_${tenantPath}`,
            JSON.stringify(response.data)
          );
          document.title = `${response.data.name} - E-Commerce`;
        } else {
          setTenant(null);
          navigate("/404");
        }
      } catch (err) {
        console.error("Failed to fetch tenant:", err);
        setTenant(null);
        navigate("/500");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenant();
  }, [tenantPath, navigate]);

  return (
    <TenantContext.Provider
      value={{ tenant, isLoading, setTenant, buildRoute }}
    >
      {children}
    </TenantContext.Provider>
  );
};
