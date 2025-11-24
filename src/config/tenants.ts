import { TenantConfig } from "@/types/tenant";

// Tenant configurations with their themes and layouts
export const TENANTS: Record<string, TenantConfig> = {
  havenhome: {
    id: "havenhome",
    name: "Haven Home",
    subdomain: "havenhome",
    urlPath: "",
    description: "Curated Home Decor & Furniture",
    contactEmail: "hello@havenhome.com",
    contactPhone: "+91-9876543210",
    theme: {
      // Warm earth tones - Terracotta & Sage
      primary: "15 65% 55%",
      primaryForeground: "0 0% 100%",
      secondary: "140 22% 48%",
      secondaryForeground: "0 0% 100%",
      background: "45 35% 96%",
      foreground: "25 20% 20%",
      accent: "35 60% 88%",
      accentForeground: "25 20% 20%",
      muted: "45 40% 92%",
      mutedForeground: "25 15% 45%",
      fontDisplay: "Playfair Display, serif",
      fontBody: "Inter, sans-serif",
    },
    layout: {
      productLayout: "grid",
      headerStyle: "classic",
      cardBorderRadius: "0.875rem",
      buttonBorderRadius: "0.5rem",
    },
  },

  modernliving: {
    id: "modernliving",
    name: "Modern Living",
    subdomain: "modernliving",
    urlPath: "/modernliving",
    description: "Contemporary Furniture & Design",
    contactEmail: "contact@modernliving.com",
    contactPhone: "+91-9876543211",
    theme: {
      // Cool blues & grays - Modern minimalist
      primary: "210 100% 45%",
      primaryForeground: "0 0% 100%",
      secondary: "200 15% 35%",
      secondaryForeground: "0 0% 100%",
      background: "0 0% 98%",
      foreground: "210 20% 15%",
      accent: "210 40% 92%",
      accentForeground: "210 20% 15%",
      muted: "210 15% 90%",
      mutedForeground: "210 10% 50%",
      fontDisplay: "Montserrat, sans-serif",
      fontBody: "Open Sans, sans-serif",
    },
    layout: {
      productLayout: "list",
      headerStyle: "modern",
      cardBorderRadius: "0.25rem",
      buttonBorderRadius: "0.25rem",
    },
  },

  rusticcharm: {
    id: "rusticcharm",
    name: "Rustic Charm",
    subdomain: "rusticcharm",
    urlPath: "/rusticcharm",
    description: "Vintage & Farmhouse Decor",
    contactEmail: "info@rusticcharm.com",
    contactPhone: "+91-9876543212",
    theme: {
      // Warm browns & greens - Rustic farmhouse
      primary: "25 45% 40%",
      primaryForeground: "0 0% 100%",
      secondary: "85 30% 45%",
      secondaryForeground: "0 0% 100%",
      background: "40 25% 95%",
      foreground: "25 30% 20%",
      accent: "40 30% 88%",
      accentForeground: "25 30% 20%",
      muted: "40 20% 90%",
      mutedForeground: "25 20% 45%",
      fontDisplay: "Merriweather, serif",
      fontBody: "Lato, sans-serif",
    },
    layout: {
      productLayout: "masonry",
      headerStyle: "minimal",
      cardBorderRadius: "1rem",
      buttonBorderRadius: "0.75rem",
    },
  },
};

// Default tenant (fallback)
export const DEFAULT_TENANT = TENANTS.havenhome;

// Get tenant by subdomain
export const getTenantBySubdomain = (subdomain: string): TenantConfig | null => {
  return Object.values(TENANTS).find(t => t.subdomain === subdomain) || null;
};

// Get tenant by URL path
export const getTenantByPath = (path: string): TenantConfig | null => {
  const tenantPath = path.split('/')[1]; // Get first path segment
  return Object.values(TENANTS).find(t => t.urlPath === `/${tenantPath}`) || null;
};

// Get tenant by domain
export const getTenantByDomain = (domain: string): TenantConfig | null => {
  return Object.values(TENANTS).find(t => t.domain === domain) || null;
};
