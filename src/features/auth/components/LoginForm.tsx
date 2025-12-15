import { Link } from "react-router-dom";
import { SignInForm } from "./SignInForm";

// Import branding image (using one found in src/assets)
import heroImage from "@/assets/product-vase.jpg";

const Login = () => {
  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left: Brand / Hero Section */}
      <div className="hidden lg:flex w-1/2 relative bg-neutral-900">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src={heroImage}
          alt="Handmade pottery"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white/20 backdrop-blur rounded flex items-center justify-center font-bold font-display">H</div>
            <span className="font-bold text-xl tracking-tight">Homebase</span>
          </div>
          <div className="space-y-4 max-w-lg">
            <h1 className="text-5xl font-display font-bold leading-tight">
              Curated handmade treasures for your home.
            </h1>
            <p className="text-lg text-white/80 font-light">
              Join our community of makers and appreciators. Discover unique items directly from artisans.
            </p>
          </div>
          <div className="text-sm text-white/60">
            © 2024 Homebase Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-12 bg-white">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Mobile Header (only visible on small screens) */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-8 w-8 bg-black text-white rounded flex items-center justify-center font-bold font-display">H</div>
              <span className="font-bold text-xl text-black">Homebase</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Welcome back</h2>
            <p className="text-neutral-500">
              Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline transition-all">Sign up for free</Link>
            </p>
          </div>

          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
