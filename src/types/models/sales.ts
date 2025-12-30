export type Sales = {
  id: string;
  name: string | null;
  last_name: string | null;
  code_sku: string;
  product: string;
  category: string;
  ccolor: string;
  total_amount: number;
  paid_amount: number;
  status: string;
  created_at: string;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

export type RecentSalesPaid = {
  id: string;
  sale_num: string;
  created_at: string;
  category: string;
  ccolor: string;
  status: string;
  total_amount: number;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

export type ShoppingCarT = {
  id: string;
  product: string;
  unit_price: number;
  quantity: number;
  total_amount: number;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
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
