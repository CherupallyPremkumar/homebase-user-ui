import { useState } from "react";
import { Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NotificationSettingsDto } from "@/types/dto";
import { useToast } from "@/hooks/use-toast";
import { updateNotificationSettings } from "../services/profileService";

interface NotificationSettingsProps {
  initialSettings: NotificationSettingsDto;
  onUpdate: () => void;
}

export const NotificationSettings = ({ initialSettings, onUpdate }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { toast } = useToast();

  const handleToggle = (key: keyof NotificationSettingsDto) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateNotificationSettings(settings);
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved",
      });
      setHasChanges(false);
      onUpdate();
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setHasChanges(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>Manage how you receive updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
            <div className="flex-1">
              <Label htmlFor="orderUpdates" className="text-sm font-semibold cursor-pointer">
                Order Updates
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Receive notifications about your order status and delivery
              </p>
            </div>
            <Switch
              id="orderUpdates"
              checked={settings.orderUpdates}
              onCheckedChange={() => handleToggle("orderUpdates")}
            />
          </div>

          <div className="flex items-center justify-between space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
            <div className="flex-1">
              <Label htmlFor="promotions" className="text-sm font-semibold cursor-pointer">
                Promotions & Offers
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Get notified about special deals and exclusive offers
              </p>
            </div>
            <Switch
              id="promotions"
              checked={settings.promotions}
              onCheckedChange={() => handleToggle("promotions")}
            />
          </div>

          <div className="flex items-center justify-between space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
            <div className="flex-1">
              <Label htmlFor="newsletter" className="text-sm font-semibold cursor-pointer">
                Newsletter
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Receive our weekly newsletter with new products and tips
              </p>
            </div>
            <Switch
              id="newsletter"
              checked={settings.newsletter}
              onCheckedChange={() => handleToggle("newsletter")}
            />
          </div>
        </div>

        {hasChanges && (
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              disabled={isLoading}
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
