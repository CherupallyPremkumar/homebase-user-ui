# Haven Home - E-Commerce Frontend

A complete React frontend for a home decor e-commerce website with warm earth tone design and Spring Boot backend integration skeleton.

## 🎨 Design System

### Color Palette (HSL)
- **Primary (Terracotta)**: `15 65% 55%` - Main brand color
- **Secondary (Sage Green)**: `140 22% 48%` - Accent color
- **Background (Cream)**: `45 35% 96%` - Warm light background
- **Foreground**: `25 20% 20%` - Dark warm text

### Typography
- **Display Font**: Playfair Display (headings)
- **Body Font**: Inter (body text)

### Design Tokens
All design tokens are defined in `src/index.css` and `tailwind.config.ts`. Use semantic tokens instead of hardcoded colors.

## 📁 Project Structure

```
src/
├── assets/                 # Product images (ES6 imports)
│   ├── product-vase.jpg
│   ├── product-wall-hanging.jpg
│   ├── product-planters.jpg
│   ├── product-cushion.jpg
│   ├── product-candlesticks.jpg
│   └── product-basket.jpg
│
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── Header.tsx        # Main navigation header
│   ├── ProductCard.tsx   # Product grid card
│   ├── CartItemCard.tsx  # Cart item with quantity controls
│   └── OrderCard.tsx     # Order history card
│
├── pages/                # Route pages
│   ├── Home.tsx          # Product grid homepage
│   ├── ProductDetails.tsx # Single product view
│   ├── Cart.tsx          # Shopping cart
│   ├── Checkout.tsx      # Checkout form
│   ├── OrderConfirmation.tsx # Success page
│   ├── PaymentFailed.tsx # Payment error page
│   └── MyOrders.tsx      # Order history
│
├── services/             # API service layer
│   ├── productService.ts # Product APIs
│   ├── cartService.ts    # Cart management APIs
│   ├── paymentService.ts # PhonePe payment APIs
│   └── orderService.ts   # Order APIs
│
├── types/
│   └── dto.ts           # TypeScript DTOs matching Spring Boot
│
└── App.tsx              # Main app with routing
```

## 🔌 API Integration

All services are structured to connect with Spring Boot backend. Currently using mock data with `// TODO:` comments.

### Backend Endpoints (Ready to Connect)

#### Product Service
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products?category={category}` - Filter by category

#### Cart Service
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{itemId}` - Update quantity
- `DELETE /api/cart/{itemId}` - Remove item
- `DELETE /api/cart` - Clear cart

#### Payment Service (PhonePe Integration)
- `POST /api/payment/create` - Initiate payment
- `POST /api/payment/callback` - Handle PhonePe callback
- `GET /api/payment/status/{transactionId}` - Check status

#### Order Service
- `GET /api/orders` - Get all user orders
- `GET /api/order/{id}` - Get order by ID
- `POST /api/order` - Create new order

## 📦 Data Transfer Objects (DTOs)

### ProductDto
```typescript
{
  id: number;
  name: string;
  description: string;
  price: number; // in paise (e.g., 3499 = ₹34.99)
  imageUrl: string;
  category: string;
  stock: number;
}
```

### CartItemDto
```typescript
{
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}
```

### OrderDto
```typescript
{
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItemDto[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentStatus: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}
```

### CreatePaymentRequestDto (PhonePe)
```typescript
{
  amount: number;
  currency: string;
  orderId: string;
  customerPhone: string;
  customerName: string;
  redirectUrl: string;
  callbackUrl: string;
}
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Connect Backend**
   - Update `API_BASE_URL` in service files
   - Remove mock data implementations
   - Uncomment real API calls
   - Configure CORS in Spring Boot

## 🔄 Payment Flow (PhonePe)

1. User fills checkout form
2. Frontend calls `POST /api/payment/create`
3. Backend creates PhonePe payment and returns URL
4. User redirects to PhonePe gateway
5. After payment, PhonePe calls `/api/payment/callback`
6. Backend verifies payment and updates order
7. User redirects to order confirmation or failure page

## 🎯 Key Features

- ✅ Fully responsive design
- ✅ Product grid with images
- ✅ Product detail pages
- ✅ Cart management (add/update/remove)
- ✅ Checkout form with validation
- ✅ Phone number input (Indian format)
- ✅ Order history
- ✅ Payment success/failure handling
- ✅ Mock data for immediate testing
- ✅ TypeScript for type safety
- ✅ Modern UI with shadcn/ui components

## 🔧 Configuration

### Update Backend URL
In each service file (`src/services/*.ts`):
```typescript
const API_BASE_URL = "http://your-backend-url/api";
```

### Enable Real APIs
Uncomment the actual API calls and remove mock implementations in:
- `productService.ts`
- `cartService.ts`
- `paymentService.ts`
- `orderService.ts`

## 📱 Responsive Breakpoints

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## 🎨 Customization

### Colors
Edit `src/index.css` (HSL values only):
```css
:root {
  --primary: 15 65% 55%; /* Terracotta */
  --secondary: 140 22% 48%; /* Sage green */
}
```

### Fonts
Add to `index.html` and update `tailwind.config.ts`:
```typescript
fontFamily: {
  display: ['Your Display Font', 'serif'],
  body: ['Your Body Font', 'sans-serif'],
}
```

## 🔐 Security Notes

- All prices stored in paise (smallest currency unit)
- Phone validation for Indian numbers (10 digits, starts with 6-9)
- Email validation on checkout
- TODO: Add authentication when backend is ready
- TODO: Add CSRF tokens for mutations

## 📝 Next Steps

1. Connect to Spring Boot backend
2. Implement user authentication
3. Add product search and filters
4. Implement real PhonePe integration
5. Add order tracking
6. Set up production environment variables
