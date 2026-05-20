export { CategoryForm } from "./components/category-form";
export { ProductList } from "./components/product-list";

export interface Category {
  id: string;
  name: string;
  organizationId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isAvailable: boolean;
  categoryId: string | null;
  organizationId: string;
}
