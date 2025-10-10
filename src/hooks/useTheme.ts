
import { TenantConfig } from "@/types/tenant";
import { useEffect } from "react";

/**
 * Apply dynamic theme and layout by updating CSS variables
 */
export const useTheme = (tenant: TenantConfig | null) => {
  useEffect(() => {
    if (!tenant) return;

    const root = document.documentElement;
    const { theme, layout } = tenant;

    // Apply color variables
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-foreground', theme.primaryForeground);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--secondary-foreground', theme.secondaryForeground);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', theme.foreground);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-foreground', theme.accentForeground);
    root.style.setProperty('--muted', theme.muted);
    root.style.setProperty('--muted-foreground', theme.mutedForeground);

    // Apply font families
    root.style.setProperty('--font-display', theme.fontDisplay);
    root.style.setProperty('--font-body', theme.fontBody);

    // Apply layout variables
    if (layout) {
      root.style.setProperty('--radius', layout.cardBorderRadius);
      root.style.setProperty('--button-radius', layout.buttonBorderRadius);
    }

    // Update favicon if provided
    if (theme.faviconUrl) {
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = theme.faviconUrl;
    }
  }, [tenant]);
};
