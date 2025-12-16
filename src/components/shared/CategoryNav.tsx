import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ChevronDown, Loader2 } from "lucide-react";
import { useCategories } from "@/hooks/api/useCategories";

export function CategoryNav() {
    const { data: categories = [], isLoading: loading } = useCategories();

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-3">
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Loading...</span>
            </div>
        );
    }

    return (
        <nav className="flex items-center gap-1">
            <Link
                to={"/products"}
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
                                    to={sub.href}
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
