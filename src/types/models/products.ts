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
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};
