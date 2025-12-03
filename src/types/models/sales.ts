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
  created_at: string;
  category: string;
  ccolor: string;
  total_amount: number;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};
