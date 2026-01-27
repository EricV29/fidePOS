export type Customers = {
  id: string;
  name: string;
  last_name: string;
  phone: string;
  status: string;
  debts: number;
  debts_amount: number;
  debts_paid: number;
  created_at: string;
};

export type DebtsCustomer = {
  id: string;
  code_sku: string;
  product: string;
  description: string;
  category: string;
  ccolor: string;
  status: string;
  debt_amount: number;
  debt_paid: number;
  created_at: string;
};

export type PaymentsCustomer = {
  id: string;
  created_at: string;
  code_sku: string;
  product: string;
  note: string;
  amount: number;
};

export type CustomersSale = {
  label: string;
  value: string;
};

export type PaymentsDebt = {
  id: string;
  created_at: string;
  code_sku: string;
  amount: number;
  note: string;
};

export type AccountsReceivable = {
  idSale: number;
  idCustomer: number;
};
