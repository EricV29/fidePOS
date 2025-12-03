export type AccountsReceivable = {
  id: string;
  name: string;
  last_name: string;
  code_sku: string;
  debt_amount: number;
  debt_paid: number;
  debt_pending: number;
  created_at: string;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};
