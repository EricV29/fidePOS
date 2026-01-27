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
  id: number;
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
  id: number;
  name: string;
  quantity: number;
  code_sku: string;
  unit_price: number;
  subtotal: number;
}

export type SaleView = {
  id: number;
  sale_num: number;
  status: string;
  created_at: string;
  customer: string | null;
  total_amount: number;
  discount: number;
  paid_amount: number;
  products: ProductSaleView[];
};
