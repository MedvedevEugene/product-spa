import axios from 'axios';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  ApiProduct,
  CreateProductPayload,
  Product,
  UpdateProductPayload
} from '@/types/product';

const API_URL = 'https://fakestoreapi.com/products';

export type ProductFilter = 'all' | 'favorites';

interface ProductState {
  products: Product[];
  categories: string[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  filter: ProductFilter;
  search: string;
  category: string;
  currentPage: number;
  pageSize: number;
  fetchProducts: () => Promise<void>;
  toggleLike: (productId: string) => void;
  deleteProduct: (productId: string) => void;
  createProduct: (payload: CreateProductPayload) => Product;
  updateProduct: (productId: string, payload: UpdateProductPayload) => void;
  setFilter: (filter: ProductFilter) => void;
  setSearch: (value: string) => void;
  setCategory: (category: string) => void;
  setPage: (page: number) => void;
}

const prepareProduct = (product: ApiProduct, liked = false): Product => ({
  id: String(product.id),
  title: product.title,
  price: product.price,
  description: product.description,
  category: product.category,
  image: product.image,
  liked,
  source: 'api',
  createdAt: new Date().toISOString()
});

export const useProductStore = create<ProductState>()(
  devtools((set, get) => ({
    products: [],
    categories: [],
    loading: false,
    loaded: false,
    error: null,
    filter: 'all',
    search: '',
    category: 'all',
    currentPage: 1,
    pageSize: 8,
    async fetchProducts() {
      const state = get();
      if (state.loading) {
        return;
      }

      set({ loading: true, error: null });

      try {
        const { data } = await axios.get<ApiProduct[]>(API_URL);

        set((current) => {
          const preserved = new Map(current.products.map((product) => [product.id, product]));
          const apiProducts = data.map((item) => {
            const existing = preserved.get(String(item.id));
            return existing?.source === 'user' ? existing : prepareProduct(item, existing?.liked ?? false);
          });

          const userProducts = current.products.filter((product) => product.source === 'user');
          const categories = Array.from(
            new Set([
              ...apiProducts.map((product) => product.category),
              ...userProducts.map((product) => product.category)
            ])
          ).sort((a, b) => a.localeCompare(b, 'ru'));

          return {
            products: [...apiProducts, ...userProducts],
            categories,
            loading: false,
            loaded: true,
            currentPage: 1
          };
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Не удалось загрузить продукты',
          loading: false
        });
      }
    },
    toggleLike(productId) {
      set((state) => ({
        products: state.products.map((product) =>
          product.id === productId ? { ...product, liked: !product.liked } : product
        )
      }));
    },
    deleteProduct(productId) {
      set((state) => ({
        products: state.products.filter((product) => product.id !== productId)
      }));
    },
    createProduct(payload) {
      const timestamp = Date.now();
      const newProduct: Product = {
        id: `user-${timestamp}`,
        title: payload.title,
        description: payload.description,
        price: payload.price,
        category: payload.category,
        image: payload.image,
        liked: false,
        source: 'user',
        createdAt: new Date(timestamp).toISOString()
      };

      set((state) => {
        const categories = Array.from(new Set([...state.categories, payload.category])).sort((a, b) =>
          a.localeCompare(b, 'ru')
        );

        return {
          products: [...state.products, newProduct],
          categories,
          currentPage: 1
        };
      });

      return newProduct;
    },
    updateProduct(productId, payload) {
      set((state) => ({
        products: state.products.map((product) =>
          product.id === productId ? { ...product, ...payload } : product
        )
      }));
    },
    setFilter(filter) {
      set({ filter, currentPage: 1 });
    },
    setSearch(value) {
      set({ search: value, currentPage: 1 });
    },
    setCategory(category) {
      set({ category, currentPage: 1 });
    },
    setPage(page) {
      set({ currentPage: page });
    }
  }))
);
