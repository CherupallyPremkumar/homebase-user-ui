import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SignInForm } from "./SignInForm";

interface LoginDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLoginSuccess?: () => void;
}

export const LoginDialog = ({ open, onOpenChange, onLoginSuccess }: LoginDialogProps) => {
    const handleSuccess = () => {
        onOpenChange(false);
        if (onLoginSuccess) {
            onLoginSuccess();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-6 bg-white border-none shadow-2xl rounded-xl">
                <DialogHeader className="mb-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="h-8 w-8 bg-black text-white rounded flex items-center justify-center font-bold font-display">H</div>
                    </div>
                    <DialogTitle className="text-2xl font-bold font-display text-center">Hello there!</DialogTitle>
                    <DialogDescription className="text-center">
                        Sign in to continue your handmade journey.
                    </DialogDescription>
                </DialogHeader>

                <SignInForm onSuccess={handleSuccess} hideTitle={true} />

            </DialogContent>
        </Dialog>
    );
};
