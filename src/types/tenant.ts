// Tenant-related type definitions

export type ProductLayoutType = 'grid' | 'list' | 'masonry';
export type HeaderStyleType = 'classic' | 'modern' | 'minimal';

export interface TenantTheme {
  // Color palette (HSL values)
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  
  // Typography
  fontDisplay: string;
  fontBody: string;
  
  // Brand assets
  logoUrl?: string;
  faviconUrl?: string;
}

export interface TenantLayout {
  productLayout: ProductLayoutType;
  headerStyle: HeaderStyleType;
  cardBorderRadius: string; // e.g., '0.5rem', '1rem'
  buttonBorderRadius: string;
}

export interface TenantConfig {
  id: string;
  name: string;
  domain?: string; // e.g., "havenhome.com"
  subdomain?: string; // e.g., "havenhome" from havenhome.lovable.app
  urlPath?: string; // e.g., "/havenhome" for path-based routing
  theme: TenantTheme;
  layout?: TenantLayout;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface TenantContextType {
  tenant: TenantConfig | null;
  isLoading: boolean;
  setTenant: (tenant: TenantConfig | null) => void;
  buildRoute: (route: string) => string;
}
