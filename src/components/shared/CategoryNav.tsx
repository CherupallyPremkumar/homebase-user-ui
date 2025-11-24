import * as React from "react";
import { Link } from "react-router-dom";
import { useTenant } from "@/hooks/useTenant";
import { cn } from "@/lib/utils";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ChevronDown } from "lucide-react";

const categories = [
    {
        title: "Sarees",
        href: "/?category=sarees",
        description: "Traditional and modern sarees for every occasion.",
        subcategories: [
            { title: "Silk Sarees", href: "/?category=sarees&sub=silk" },
            { title: "Cotton Sarees", href: "/?category=sarees&sub=cotton" },
            { title: "Banarasi", href: "/?category=sarees&sub=banarasi" },
            { title: "Kanjivaram", href: "/?category=sarees&sub=kanjivaram" },
            { title: "Chiffon", href: "/?category=sarees&sub=chiffon" },
        ],
    },
    {
        title: "Home Decor",
        href: "/?category=decor",
        description: "Beautiful handcrafted items to elevate your living space.",
        subcategories: [
            { title: "Wall Art", href: "/?category=decor&sub=wall-art" },
            { title: "Vases", href: "/?category=decor&sub=vases" },
            { title: "Cushions", href: "/?category=decor&sub=cushions" },
            { title: "Lighting", href: "/?category=decor&sub=lighting" },
            { title: "Rugs", href: "/?category=decor&sub=rugs" },
        ],
    },
    {
        title: "Food",
        href: "/?category=food",
        description: "Authentic regional delicacies and organic produce.",
        subcategories: [
            { title: "Spices", href: "/?category=food&sub=spices" },
            { title: "Sweets", href: "/?category=food&sub=sweets" },
            { title: "Pickles", href: "/?category=food&sub=pickles" },
            { title: "Snacks", href: "/?category=food&sub=snacks" },
            { title: "Tea & Coffee", href: "/?category=food&sub=beverages" },
        ],
    },
    {
        title: "Handicrafts",
        href: "/?category=crafts",
        description: "Unique handmade artifacts from skilled artisans.",
        subcategories: [
            { title: "Pottery", href: "/?category=crafts&sub=pottery" },
            { title: "Woodwork", href: "/?category=crafts&sub=woodwork" },
            { title: "Metal Art", href: "/?category=crafts&sub=metal-art" },
            { title: "Textiles", href: "/?category=crafts&sub=textiles" },
            { title: "Jewelry", href: "/?category=crafts&sub=jewelry" },
        ],
    },
];

export function CategoryNav() {
    const { buildRoute } = useTenant();

    return (
        <nav className="flex items-center gap-1">
            <Link
                to={buildRoute("/")}
                className="inline-flex items-center justify-center rounded-md px-3 h-8 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            >
                All Products
            </Link>

            {categories.map((category) => (
                <HoverCard key={category.title} openDelay={0} closeDelay={100}>
                    <HoverCardTrigger asChild>
                        <button className="inline-flex items-center justify-center rounded-md px-3 h-8 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground gap-1">
                            {category.title}
                            <ChevronDown className="h-3 w-3" />
                        </button>
                    </HoverCardTrigger>
                    <HoverCardContent
                        align="start"
                        side="bottom"
                        className="w-[180px] p-2"
                        sideOffset={0}
                    >
                        <div className="grid gap-1">
                            {category.subcategories.map((sub) => (
                                <Link
                                    key={sub.title}
                                    to={buildRoute(sub.href)}
                                    className="block rounded-md p-2 text-xs font-medium leading-none transition-colors hover:bg-accent hover:text-accent-foreground"
                                >
                                    {sub.title}
                                </Link>
                            ))}
                        </div>
                    </HoverCardContent>
                </HoverCard>
            ))}
        </nav>
    );
}
