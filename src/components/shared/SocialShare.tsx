import { Facebook, Twitter, Linkedin, Link2, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

interface SocialShareProps {
  url?: string;
  title: string;
  description?: string;
}

export const SocialShare = ({ url, title, description }: SocialShareProps) => {
  const shareUrl = url || window.location.href;
  const shareText = description || title;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied!",
      description: "Product link has been copied to clipboard",
    });
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
  };

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Link2 className="h-4 w-4" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Share this product</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openShareWindow(shareLinks.facebook)}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <Facebook className="h-5 w-5 text-[#1877F2]" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openShareWindow(shareLinks.twitter)}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <Twitter className="h-5 w-5 text-[#1DA1F2]" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openShareWindow(shareLinks.linkedin)}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <Linkedin className="h-5 w-5 text-[#0A66C2]" />
              <span className="text-xs">LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openShareWindow(shareLinks.whatsapp)}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openShareWindow(shareLinks.email)}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs">Email</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="flex flex-col gap-1 h-auto py-3"
            >
              <Link2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs">Copy</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
