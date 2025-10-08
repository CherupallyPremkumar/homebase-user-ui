# Multi-Tenant E-Commerce Frontend Guide

## Overview
This React application supports multiple tenants with dynamic theming, layouts, and tenant-specific configurations. Each tenant can have its own branding, color scheme, typography, and product layout.

## Tenant Detection Methods

The application detects tenants in the following priority order:

### 1. Custom Domain (Highest Priority)
- Example: `havenhome.com`, `modernliving.com`
- Configure `domain` field in tenant config

### 2. Subdomain
- Example: `havenhome.lovable.app`, `modernliving.lovable.app`
- Configure `subdomain` field in tenant config

### 3. URL Path
- Example: `mysite.com/havenhome`, `mysite.com/modernliving`
- Configure `urlPath` field in tenant config

### 4. Default Tenant (Fallback)
- If no tenant is detected, uses `DEFAULT_TENANT` from `src/config/tenants.ts`

## Tenant Configuration

### Location
All tenant configurations are in `src/config/tenants.ts`

### Configuration Structure
```typescript
{
  id: "havenhome",
  name: "Haven Home",
  subdomain: "havenhome",
  urlPath: "/havenhome",
  domain: "havenhome.com", // optional
  description: "Curated Home Decor & Furniture",
  contactEmail: "hello@havenhome.com",
  contactPhone: "+91-9876543210",
  
  theme: {
    // HSL color values
    primary: "15 65% 55%",
    primaryForeground: "0 0% 100%",
    secondary: "140 22% 48%",
    // ... more colors
    fontDisplay: "Playfair Display, serif",
    fontBody: "Inter, sans-serif",
    logoUrl: "/assets/havenhome-logo.png", // optional
    faviconUrl: "/assets/havenhome-favicon.ico" // optional
  },
  
  layout: {
    productLayout: "grid", // "grid" | "list" | "masonry"
    headerStyle: "classic", // "classic" | "modern" | "minimal"
    cardBorderRadius: "0.875rem",
    buttonBorderRadius: "0.5rem"
  }
}
```

## Adding a New Tenant

### Step 1: Add Fonts (if needed)
Add new Google Fonts to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;700&display=swap" rel="stylesheet">
```

### Step 2: Configure Tenant
Add configuration to `src/config/tenants.ts`:
```typescript
export const TENANTS: Record<string, TenantConfig> = {
  // ... existing tenants
  
  newtenant: {
    id: "newtenant",
    name: "New Tenant",
    subdomain: "newtenant",
    urlPath: "/newtenant",
    theme: {
      primary: "220 90% 50%",
      // ... configure all theme values
      fontDisplay: "YourFont, sans-serif",
      fontBody: "System Font, sans-serif",
    },
    layout: {
      productLayout: "list",
      headerStyle: "modern",
      cardBorderRadius: "0.5rem",
      buttonBorderRadius: "0.5rem",
    }
  }
};
```

### Step 3: Test
- Subdomain: Navigate to `newtenant.lovable.app`
- Path: Navigate to `/newtenant`
- The theme will apply automatically

## Using Tenant Features in Components

### Access Tenant Information
```typescript
import { useTenant } from "@/hooks/useTenant";

const MyComponent = () => {
  const { tenant, buildRoute } = useTenant();
  
  return (
    <div>
      <h1>{tenant?.name}</h1>
      <Link to={buildRoute("/products")}>Products</Link>
    </div>
  );
};
```

### Build Tenant-Aware Routes
```typescript
const { buildRoute } = useTenant();

// Automatically adds tenant prefix for path-based routing
navigate(buildRoute("/cart")); // → /havenhome/cart or /cart depending on detection
```

### Access Layout Preferences
```typescript
const { tenant } = useTenant();
const layout = tenant?.layout?.productLayout || "grid";

// Conditionally render based on layout
{layout === "grid" && <GridView />}
{layout === "list" && <ListView />}
```

## API Integration

### All API calls should include tenant ID:
```typescript
// In services
export const getProducts = async (tenantId: string) => {
  const response = await fetch(`/api/products?tenantId=${tenantId}`);
  return response.json();
};

// In components
const { tenant } = useTenant();
const products = await getProducts(tenant.id);
```

## Theme System

### CSS Variables
All theme values are applied as CSS variables:
- `--primary`, `--secondary`, etc. (colors)
- `--font-display`, `--font-body` (fonts)
- `--radius`, `--button-radius` (border radius)

### Using Theme Colors
Always use semantic color tokens:
```tsx
// ✅ Correct
<div className="bg-primary text-primary-foreground" />
<Button variant="secondary" />

// ❌ Wrong - Don't use hardcoded colors
<div className="bg-blue-500 text-white" />
```

### Custom Gradients
Use utility classes from `src/index.css`:
```tsx
<div className="gradient-primary" />
<h1 className="text-gradient">Title</h1>
```

## Routing Structure

### For Subdomain/Domain-based Routing:
```
/ → Home
/products → Products
/cart → Cart
/profile → Profile
```

### For Path-based Routing:
```
/havenhome/ → Home
/havenhome/products → Products
/havenhome/cart → Cart
/havenhome/profile → Profile
```

## Current Tenants

### 1. Haven Home
- **Theme**: Warm earth tones (Terracotta & Sage)
- **Fonts**: Playfair Display, Inter
- **Layout**: Grid view, Classic header
- **Subdomain**: `havenhome.lovable.app`
- **Path**: `/havenhome`

### 2. Modern Living
- **Theme**: Cool blues & grays
- **Fonts**: Montserrat, Open Sans
- **Layout**: List view, Modern header
- **Subdomain**: `modernliving.lovable.app`
- **Path**: `/modernliving`

### 3. Rustic Charm
- **Theme**: Warm browns & greens
- **Fonts**: Merriweather, Lato
- **Layout**: Masonry view, Minimal header
- **Subdomain**: `rusticcharm.lovable.app`
- **Path**: `/rusticcharm`

## Pages

### Customer Pages
- Home (`/`)
- Product Details (`/product/:id`)
- Cart (`/cart`)
- Checkout (`/checkout`)
- Order Confirmation (`/order-confirmation`)
- Payment Failed (`/payment-failed`)
- My Orders (`/my-orders`)
- Profile (`/profile`)
- Login (`/login`)

All pages are:
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Tenant-aware with dynamic theming
- ✅ Protected where authentication is required
- ✅ SEO optimized with semantic HTML

## Best Practices

### 1. Always Use Tenant Context
```typescript
// ✅ Correct
const { tenant, buildRoute } = useTenant();

// ❌ Wrong
const tenant = localStorage.getItem('tenant');
```

### 2. Build Routes Properly
```typescript
// ✅ Correct
<Link to={buildRoute("/products")}>Products</Link>

// ❌ Wrong
<Link to="/products">Products</Link>
```

### 3. Include Tenant in API Calls
```typescript
// ✅ Correct
await getProducts(tenant.id);

// ❌ Wrong
await getProducts();
```

### 4. Use Semantic Tokens
```typescript
// ✅ Correct
className="bg-primary hover:bg-primary/90"

// ❌ Wrong
className="bg-orange-500 hover:bg-orange-600"
```

## Testing Multi-Tenant Setup

### Local Development
1. **Path-based**: Visit `http://localhost:8080/havenhome`
2. **Subdomain**: Modify `/etc/hosts`:
   ```
   127.0.0.1 havenhome.localhost
   127.0.0.1 modernliving.localhost
   ```
   Then visit `http://havenhome.localhost:8080`

### Production
- Configure DNS for subdomains
- Add tenant domains to your hosting provider
- Ensure routing works for all detection methods

## Troubleshooting

### Theme Not Applying
- Check browser console for errors
- Verify tenant detection in React DevTools
- Ensure fonts are loaded in `index.html`

### Routes Not Working
- Check if `buildRoute` is being used
- Verify tenant detection is working
- Check browser URL matches tenant config

### API Calls Failing
- Ensure `tenantId` is being passed
- Check backend expects tenant-aware requests
- Verify tenant ID format matches backend
