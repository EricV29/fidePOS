export type Products = {
  id: string;
  code_sku: string;
  product: string;
  description: string;
  category: string;
  ccolor: string;
  cost_price: number;
  unit_price: number;
  stock: number;
  status: string;
  created_at: string;
  deleted_at: string;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};

export type Categories = {
  id: string;
  category: string;
  products: number;
};

export type ProductsSale = {
  id: string;
  code_sku: string;
  product: string;
  description: string;
  category: string;
  ccolor: string;
  unit_price: number;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
    add?: boolean;
  };
};
