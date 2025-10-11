import { useState } from "react";
import { User, Mail, Phone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/useTenant";
import { profileService } from "@/services/profileService";
import { UpdateProfileDto } from "@/types/dto";
import { useAuth } from "@/hooks/useAuth";

interface ProfileEditFormProps {
  initialData: {
    name: string;
    email: string;
    phone?: string;
  };
  onUpdate: () => void;
}

export const ProfileEditForm = ({
  initialData,
  onUpdate,
}: ProfileEditFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialData.name);
  const [phone, setPhone] = useState(initialData.phone || "");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const { toast } = useToast();
  const { tenant } = useTenant();
  const { user } = useAuth();

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (phone && !/^[+]?[\d\s-()]+$/.test(phone)) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !tenant) return;

    setIsLoading(true);
    try {
      const updateData: UpdateProfileDto = {
        name,
        phone: phone || undefined,
      };

      await profileService.updateProfile(user.id, updateData);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(initialData.name);
    setPhone(initialData.phone || "");
    setErrors({});
    setIsEditing(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-display">
          Personal Information
        </CardTitle>
        <CardDescription>Manage your personal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
              disabled={!isEditing || isLoading}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-destructive animate-fade-in">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={initialData.email}
              className="pl-10 bg-muted/30"
              disabled
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91-XXXXXXXXXX"
              className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
              disabled={!isEditing || isLoading}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-destructive animate-fade-in">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="w-full">
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
