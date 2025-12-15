import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/shared/Header";
import { ProfileEditForm } from "./ProfileEditForm";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { AddressCard } from "./AddressCard";
import { NotificationSettings } from "./NotificationSettings";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { getProfile } from "../services/profileService";
import { getOrders } from "@/features/orders/services/orderService";
import { CustomerProfileDto, OrderDto } from "@/types/dto";

const Profile = () => {
  const [profile, setProfile] = useState<CustomerProfileDto | null>(null);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const [profileData, ordersData] = await Promise.all([
        getProfile(),
        getOrders(),
      ]);
      setProfile(profileData);
      setOrders(ordersData);
    } catch (error) {
      toast({
        title: "Failed to load profile",
        description: "Could not fetch profile data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleBack = () => {
    navigate("/");
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-warm">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen gradient-warm">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Failed to load profile</p>
          <Button onClick={fetchProfileData} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-warm">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6 hover:shadow-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gradient mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="py-2">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="py-2">Orders</TabsTrigger>
            <TabsTrigger value="addresses" className="py-2">Addresses</TabsTrigger>
            <TabsTrigger value="settings" className="py-2">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ProfileEditForm
                initialData={{ name: profile.name, email: profile.email, phone: profile.phone }}
                onUpdate={fetchProfileData}
              />
              <OrderSummaryCard orders={orders} />
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <OrderSummaryCard orders={orders} />
          </TabsContent>

          <TabsContent value="addresses">
            <AddressCard addresses={profile.addresses} onUpdate={fetchProfileData} />
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-2xl">
              <NotificationSettings initialSettings={profile.notificationSettings} onUpdate={fetchProfileData} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
