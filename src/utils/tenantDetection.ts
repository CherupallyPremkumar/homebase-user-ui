import { TenantConfig } from "@/types/tenant";
import {
  getTenantBySubdomain,
  getTenantByPath,
  getTenantByDomain,
  DEFAULT_TENANT
} from "@/config/tenants";

/**
 * Detect tenant from current URL
 * Priority: Domain > Subdomain > URL Path > Default
 */
export const detectTenant = (): TenantConfig => {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // 1. Check for custom domain
  // e.g., havenhome.com, modernliving.com
  const tenantByDomain = getTenantByDomain(hostname);
  if (tenantByDomain) {
    return tenantByDomain;
  }

  // 2. Check for subdomain
  // e.g., havenhome.lovable.app, modernliving.lovable.app
  const subdomainMatch = hostname.match(/^([^.]+)\./);
  if (subdomainMatch && subdomainMatch[1] !== 'www') {
    const subdomain = subdomainMatch[1];
    const tenantBySubdomain = getTenantBySubdomain(subdomain);
    if (tenantBySubdomain) {
      return tenantBySubdomain;
    }
  }

  // 3. Check for URL path
  // e.g., /havenhome/home, /modernliving/cart
  if (pathname && pathname !== '/') {
    const tenantByPath = getTenantByPath(pathname);
    if (tenantByPath) {
      return tenantByPath;
    }
  }

  // 4. Return default tenant
  return DEFAULT_TENANT;
};

/**
 * Get base path for tenant routing
 * Returns empty string for subdomain/domain, or /tenant-id for path-based
 */
export const getTenantBasePath = (tenant: TenantConfig): string => {
  // If using subdomain or custom domain, no base path needed
  const hostname = window.location.hostname;
  const isSubdomain = hostname.includes(tenant.subdomain || '');
  const isDomain = tenant.domain && hostname.includes(tenant.domain);

  if (isSubdomain || isDomain) {
    return '';
  }

  // For marketplace mode, we don't want path-based routing
  return '';
};

/**
 * Build tenant-aware route
 */
export const buildTenantRoute = (tenant: TenantConfig, route: string): string => {
  const basePath = getTenantBasePath(tenant);

  // Ensure route starts with /
  const cleanRoute = route.startsWith('/') ? route : `/${route}`;

  // Combine base path and route
  return `${basePath}${cleanRoute}`;
};
