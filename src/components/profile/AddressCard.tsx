import { useState } from "react";
import { MapPin, Plus, Edit, Trash2, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddressDto } from "@/types/dto";
import { AddressDialog } from "./AddressDialog";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/hooks/useTenant";
import { deleteAddress } from "@/services/profileService";

interface AddressCardProps {
  addresses: AddressDto[];
  onUpdate: () => void;
}

export const AddressCard = ({ addresses, onUpdate }: AddressCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressDto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  const { tenant } = useTenant();

  const handleEdit = (address: AddressDto) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!tenant) return;

    setDeletingId(addressId);
    try {
      await deleteAddress(tenant.id, addressId);
      toast({
        title: "Address deleted",
        description: "Address has been removed successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDialogClose = (updated: boolean) => {
    setDialogOpen(false);
    setEditingAddress(null);
    if (updated) {
      onUpdate();
    }
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-display flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Saved Addresses
              </CardTitle>
              <CardDescription>Manage your delivery addresses</CardDescription>
            </div>
            <Button onClick={handleAdd} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="relative p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-smooth hover:shadow-md"
              >
                {address.isDefault && (
                  <Badge className="absolute top-2 right-2 gradient-primary">
                    <Check className="h-3 w-3 mr-1" />
                    Default
                  </Badge>
                )}
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{address.label}</p>
                  </div>
                  <p className="text-sm">{address.fullName}</p>
                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingId === address.id || address.isDefault}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {deletingId === address.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            ))}

            {addresses.length === 0 && (
              <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No addresses saved</p>
                <Button variant="link" className="mt-2" onClick={handleAdd}>
                  Add your first address
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AddressDialog
        open={dialogOpen}
        address={editingAddress}
        onClose={handleDialogClose}
      />
    </>
  );
};
