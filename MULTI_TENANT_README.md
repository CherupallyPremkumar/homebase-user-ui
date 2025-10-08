# Multi-Tenant E-Commerce Frontend

Complete React multi-tenant e-commerce application with dynamic theming, tenant-specific layouts, and customer-facing features.

## 🎯 Overview

This application supports multiple independent e-commerce storefronts (tenants) with:
- **Dynamic theming**: Each tenant has unique colors, fonts, and branding
- **Flexible detection**: Subdomain, path, or custom domain
- **Layout customization**: Grid, list, or masonry product views
- **Fully responsive**: Mobile, tablet, and desktop optimized
- **Customer features**: Shopping cart, checkout, orders, profile management

## 🚀 Quick Start

### Testing Different Tenants

#### Path-Based (Development)
```
http://localhost:8080/havenhome
http://localhost:8080/modernliving
http://localhost:8080/rusticcharm
```

#### Subdomain (Production)
```
havenhome.yoursite.com
modernliving.yoursite.com
rusticcharm.yoursite.com
```

## 🏢 Current Tenants

### Haven Home
- **Theme**: Warm terracotta & sage green
- **Fonts**: Playfair Display, Inter
- **Layout**: Grid view, Classic header
- **Style**: Curated home decor aesthetic

### Modern Living
- **Theme**: Cool blues & grays
- **Fonts**: Montserrat, Open Sans
- **Layout**: List view, Modern header
- **Style**: Contemporary minimalist

### Rustic Charm
- **Theme**: Warm browns & greens
- **Fonts**: Merriweather, Lato
- **Layout**: Masonry view, Minimal header
- **Style**: Vintage farmhouse

## 📦 Features

### Customer Pages
- ✅ Home with product listings
- ✅ Product details with images
- ✅ Shopping cart management
- ✅ Checkout with validation
- ✅ Order history
- ✅ Customer profile with settings
- ✅ Order confirmation
- ✅ Payment status pages

### Multi-Tenant Capabilities
- ✅ Subdomain detection (tenant.site.com)
- ✅ Path detection (/tenant/page)
- ✅ Custom domain support
- ✅ Dynamic theme application
- ✅ Tenant-specific layouts
- ✅ Isolated data per tenant
- ✅ Custom branding (logos, favicons)

### UI/UX Features
- ✅ Fully responsive design
- ✅ Smooth animations & transitions
- ✅ Card-based modern layouts
- ✅ Toast notifications
- ✅ Loading states
- ✅ Form validation
- ✅ Error handling

## 🔧 Adding a New Tenant

### 1. Add Fonts (if custom)
Edit `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;700&display=swap" rel="stylesheet">
```

### 2. Configure Tenant
Add to `src/config/tenants.ts`:
```typescript
export const TENANTS: Record<string, TenantConfig> = {
  // ... existing tenants
  
  yourtenant: {
    id: "yourtenant",
    name: "Your Tenant Name",
    subdomain: "yourtenant",
    urlPath: "/yourtenant",
    description: "Your description",
    contactEmail: "hello@yourtenant.com",
    contactPhone: "+91-XXXXXXXXXX",
    
    theme: {
      primary: "220 90% 50%",           // HSL format
      primaryForeground: "0 0% 100%",
      secondary: "200 15% 35%",
      secondaryForeground: "0 0% 100%",
      background: "0 0% 98%",
      foreground: "220 20% 15%",
      accent: "220 40% 92%",
      accentForeground: "220 20% 15%",
      muted: "220 15% 90%",
      mutedForeground: "220 10% 50%",
      fontDisplay: "Your Display Font, serif",
      fontBody: "Your Body Font, sans-serif",
    },
    
    layout: {
      productLayout: "grid", // "grid" | "list" | "masonry"
      headerStyle: "modern", // "classic" | "modern" | "minimal"
      cardBorderRadius: "0.5rem",
      buttonBorderRadius: "0.5rem",
    }
  }
};
```

### 3. Test
Navigate to `/yourtenant` and verify theme applies correctly.

## 🎨 Theming System

### HSL Color Format
All colors use HSL format without `hsl()` wrapper:
```typescript
// ✅ Correct
primary: "220 90% 50%"

// ❌ Wrong
primary: "hsl(220, 90%, 50%)"
primary: "#3B82F6"
```

### Using Theme in Components
```tsx
// ✅ Correct - Use semantic tokens
<div className="bg-primary text-primary-foreground">
<Button variant="secondary">Click Me</Button>

// ❌ Wrong - Don't hardcode colors
<div className="bg-blue-500 text-white">
```

### Custom Gradients & Utilities
Available utility classes in `src/index.css`:
```tsx
<div className="gradient-primary" />
<div className="gradient-warm" />
<h1 className="text-gradient">Title</h1>
<div className="hover-lift" />
```

## 🔌 API Integration

### Tenant-Aware Services
All API calls include tenant ID:

```typescript
// In component
import { useTenant } from "@/hooks/useTenant";

const MyComponent = () => {
  const { tenant } = useTenant();
  
  useEffect(() => {
    // Pass tenant ID to service
    const products = await getProducts(tenant.id);
  }, [tenant]);
};
```

### Service Structure
```typescript
// src/services/productService.ts
export const getProducts = async (tenantId: string) => {
  // TODO: Replace with actual API
  const response = await fetch(`/api/products?tenantId=${tenantId}`);
  return response.json();
};
```

## 🧭 Routing

### Use buildRoute for all links
```tsx
import { useTenant } from "@/hooks/useTenant";
import { Link } from "react-router-dom";

const MyComponent = () => {
  const { buildRoute } = useTenant();
  
  return (
    <Link to={buildRoute("/products")}>
      View Products
    </Link>
  );
};
```

This automatically handles:
- Path-based: `/havenhome/products`
- Subdomain: `/products`
- Custom domain: `/products`

## 📱 Responsive Design

All pages adapt to:
- **Mobile**: < 768px (stacked layout, touch-friendly)
- **Tablet**: 768px - 1024px (2-column grids)
- **Desktop**: > 1024px (full multi-column)

Test responsive views in Lovable using the device toggle above preview.

## 🔐 Authentication

Multi-tenant authentication flow:
1. User logs in at `/login` or `/:tenant/login`
2. Credentials validated with tenant context
3. Auth token stored with tenant ID
4. Protected routes check authentication
5. API calls include both auth token and tenant ID

### Using Authentication
```tsx
import { useAuth } from "@/hooks/useAuth";

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return <div>Welcome, {user.name}!</div>;
};
```

## 📂 Project Structure

```
src/
├── assets/              # Product images
├── components/
│   ├── profile/        # Profile management
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   └── ...
├── config/
│   └── tenants.ts      # Multi-tenant config
├── contexts/
│   ├── AuthContext.tsx
│   └── TenantContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useTenant.ts
│   └── useTheme.ts
├── pages/              # All route pages
├── services/           # API layer (tenant-aware)
├── types/
│   ├── dto.ts
│   └── tenant.ts
└── utils/
    └── tenantDetection.ts
```

## 🛠 Development

### Install & Run
```bash
npm install
npm run dev
```

### Type Checking
```bash
npm run type-check
```

### Build
```bash
npm run build
```

## 📚 Documentation

- **MULTI_TENANT_GUIDE.md**: Detailed multi-tenant implementation guide
- **PROJECT_STRUCTURE.md**: Original project structure documentation

## 🔗 Backend Integration

### Expected Backend Endpoints
All endpoints should accept `tenantId` parameter:

```
GET  /api/products?tenantId={id}
GET  /api/products/{id}?tenantId={id}
POST /api/cart?tenantId={id}
GET  /api/cart?tenantId={id}
POST /api/orders?tenantId={id}
GET  /api/orders?tenantId={id}
GET  /api/profile?tenantId={id}
PUT  /api/profile?tenantId={id}
```

### Current Status
- ✅ Services structured for backend integration
- ✅ Mock data for immediate testing
- ✅ DTOs matching expected backend format
- ⏳ TODO comments marking API integration points

## 🎯 Best Practices

1. **Always use tenant context**: `const { tenant } = useTenant();`
2. **Build routes properly**: Use `buildRoute("/path")`
3. **Include tenant in APIs**: Pass `tenant.id` to all services
4. **Use semantic tokens**: `className="bg-primary"` not `bg-blue-500`
5. **Mobile-first design**: Test all responsive breakpoints
6. **Type everything**: Leverage TypeScript for safety

## 🐛 Troubleshooting

### Theme not applying
- Check tenant detection in browser console
- Verify fonts loaded in Network tab
- Ensure HSL format for colors

### Routes not working
- Use `buildRoute()` for all navigation
- Check App.tsx has both `/:tenant/path` and `/path` routes
- Verify tenant detection is working

### API calls failing
- Ensure `tenantId` is included
- Check backend expects tenant-aware requests
- Verify CORS configuration

## 📄 License

MIT - Use freely for your multi-tenant e-commerce needs!
