export type Sales = {
  id: string;
  name: string | null;
  last_name: string | null;
  num_sale: string;
  products: string;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  status: string;
  created_at: string;
};

export type RecentSalesPaid = {
  id: string;
  num_sale: string;
  created_at: string;
  category: string;
  ccolor: string;
  status: string;
  total_amount: number;
};

export type ShoppingCarT = {
  id: string;
  product: string;
  unit_price: number;
  quantity: number;
  total_amount: number;
};

interface ProductSaleView {
  product: string;
  unit_price: number;
  quantity: number;
  code_sku: string;
  subtotal: number;
}

export type SaleView = {
  sale: number;
  customer: string;
  products: ProductSaleView[];
  subtotal: number;
  discount: number;
};

export type SaleModal = {
  id: string;
  num_sale: string;
  status: string;
  total_amount: number;
  created_at: string;
};
