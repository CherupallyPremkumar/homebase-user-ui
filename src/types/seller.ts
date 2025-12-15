// Seller types for Amazon-like marketplace

export interface SellerDto {
    id: string;
    name: string;
    rating: number;
    totalRatings: number;
    logoUrl?: string;
    location?: string;
    verified: boolean;
    description?: string;
    createdAt?: string;
}
