export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export type ProductSource = 'api' | 'user';

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  liked: boolean;
  source: ProductSource;
  createdAt: string;
}

export interface CreateProductPayload {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface UpdateProductPayload {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
}
