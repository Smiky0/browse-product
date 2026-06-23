export interface Product {
    id: string;
    name: string;
    category: string;
    price: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductsResponse {
    snapshot: string;
    nextCursor: string | null;
    hasMore: boolean;
    items: Product[];
}
