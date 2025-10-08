import { useEffect } from "react";
import { TenantTheme } from "@/types/tenant";

/**
 * Apply dynamic theme by updating CSS variables
 */
export const useTheme = (theme: TenantTheme | null) => {
  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;

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
  }, [theme]);
};
