export type Customers = {
  id: string;
  name: string;
  last_name: string;
  phone: string;
  status: string;
  debts_number: number;
  debts_amount: number;
  debts_paid: number;
  created_at: string;
};

export type DebtsCustomer = {
  id: string;
  sale_num: number;
  code_sku: string;
  product: string;
  description: string;
  debt_amount: number;
  sale_total: number;
  debt_paid: number;
  created_at: string;
};

export type PaymentsCustomer = {
  id: string;
  created_at: string;
  sale_num: number;
  amount: number;
  note: string;
};

export type CustomersSale = {
  id: number;
  name: string;
  last_name: string;
  phone: string;
  status_id: number;
  created_at: string;
};

export type PaymentsDebt = {
  id: string;
  created_at: string;
  amount: number;
  note: string;
};

export type AccountsReceivable = {
  idSale: number;
  idCustomer: number;
};

export type IndebtedCustomer = {
  id: number;
  name: string;
  last_name: string;
};

export type CustomerDebtsMin = {
  id: number;
  customer_debt: string;
};

export type CustomersSelect = Pick<Customers, "id" | "name" | "last_name">;

export type dataExportCustomers = string | number | boolean | null | undefined;
