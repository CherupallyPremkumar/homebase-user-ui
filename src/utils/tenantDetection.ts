
import { 
  getTenantBySubdomain, 
  getTenantByPath, 
  getTenantByDomain,
  DEFAULT_TENANT 
} from "@/config/tenants";
import { TenantConfig } from "@/types/tenant";

/**
 * Detect tenant from current URL
 * Priority: Domain > Subdomain > URL Path > Default
 */
export const detectTenant = (): TenantConfig => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // 1️⃣ Custom domain detection
  const tenantByDomain = getTenantByDomain(hostname);
  if (tenantByDomain) return tenantByDomain;

  // 2️⃣ Subdomain detection (ignoring www)
  const subdomainMatch = hostname.match(/^([^.]+)\./);
  if (subdomainMatch && subdomainMatch[1] !== "www") {
    const tenantBySubdomain = getTenantBySubdomain(subdomainMatch[1]);
    if (tenantBySubdomain) return tenantBySubdomain;
  }

  // 3️⃣ URL path detection
  if (pathname && pathname !== "/") {
    const tenantByPath = getTenantByPath(pathname);
    if (tenantByPath) return tenantByPath;
  }

  // 4️⃣ Fallback to default tenant
  return DEFAULT_TENANT;
};

/**
 * Get base path for tenant routing
 */
export const getTenantBasePath = (tenant: TenantConfig): string => {
  const hostname = window.location.hostname;

  const isSubdomain = tenant.subdomain && hostname.startsWith(`${tenant.subdomain}.`);
  const isCustomDomain = tenant.domain && hostname.includes(tenant.domain);

  if (isSubdomain || isCustomDomain) return ""; // No path prefix needed

  return tenant.urlPath ? `/${tenant.urlPath}` : ""; // Path-based routing
};

/**
 * Build tenant-aware route
 */
export const buildTenantRoute = (tenant: TenantConfig, route: string): string => {
  const basePath = getTenantBasePath(tenant);
  const cleanRoute = route.startsWith("/") ? route : `/${route}`;
  return `${basePath}${cleanRoute}`;
};