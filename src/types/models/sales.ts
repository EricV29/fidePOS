export type Sales = {
  id: string;
  sale_num: number;
  name: string | null;
  last_name: string | null;
  num_sale: string;
  products: string;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  discount: number;
  status: string;
  user_id: number;
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
  code_sku: string;
  unit_price: number;
  quantity: number;
  total_amount: number;
  credit?: boolean;
};

export interface SaleData {
  nextNumberSale: number | string;
  products: ShoppingCarT[];
  paid_amount?: number;
  credit?: boolean;
  subtotal: number;
  discount: number;
  total: number;
  customerId?: string;
}

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

export type dataExportSales = string | number | boolean | null | undefined;
