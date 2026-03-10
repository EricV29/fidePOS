export {};
import { Role, Users } from "@typesm/users";
import { SaleView } from "@typesm/sales";
import { IndebtedCustomer, CustomerDebtsMin } from "@typesm/customers";

interface UserSession {
  id: number;
  name: string;
  last_name: string;
  img: string;
  role_id: number;
  status_id: number;
}

declare global {
  interface Window {
    electronAPI: {
      // INSTALL DATE APLICATION
      getInstallDate: () => Promise<string>;

      // SIGNUP
      signup: (
        data,
        lan,
      ) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // LOGIN
      login: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET SESSION
      getSession: () => Promise<UserSession | null>;

      // FORGOT PASSWORD
      forgotPassword: (
        email: string,
        lan: string,
      ) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // LOGOUT
      logout: () => void;

      // ADD USER
      addUser: (
        data,
        lan,
      ) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET USERS
      getUsers: () => Promise<{
        success: boolean;
        result?: Users[];
        error?: string;
      }>;

      // DELETE USER
      deleteUser: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // EDIT USER
      editUser: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // EDIT USER
      changePassword: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // UPLOAD IMG
      uploadUserImage: (data: {
        userId: number;
        fileArrayBuffer: ArrayBuffer;
        fileName: string;
      }) => Promise<{ success: boolean; result?: string; error?: string }>;

      // CONTACT DEVS
      contactDevs: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      //* GET DASHBOARD DATA PAGE
      getDashboardData: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET SALE DATA
      getSaleData: (data) => Promise<{
        success: boolean;
        result?: SaleView;
        error?: string;
      }>;

      // GET INDEBTED CUSTOMERS
      getIndebtedCustomers: () => Promise<{
        success: boolean;
        result?: IndebtedCustomer[];
        error?: string;
      }>;

      // GET CUSTOMER DEBTS
      getCustomerDebts: (data) => Promise<{
        success: boolean;
        result?: CustomerDebtsMin[];
        error?: string;
      }>;

      /// GET DEBT DETAIL
      getDebtDetail: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // ADD PAYMENT DEBT
      addPaymentDebt: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      //* GET NEW SALE DATA PAGE
      getNewSaleData: (data) => Promise<{
        success: boolean;
        result?: string;
        totalCount: number;
        error?: string;
      }>;

      // GET FILTER SEARCH TABLE
      getFilterSearch: (data) => Promise<{
        success: boolean;
        result?: TData[];
        error?: string;
      }>;

      // GET PRODUCTS LIST BY CATEGORY
      getProductsCategory: (data) => Promise<{
        success: boolean;
        result?: ProductsSale[];
        totalCount: number;
        error?: string;
      }>;

      // ADD CUSTOMER
      addCustomer: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET SEARCH CODESKU TABLE
      getSearchCodeSKU: (data) => Promise<{
        success: boolean;
        result?: TData[];
        error?: string;
      }>;

      // CREATE NEW SALE
      createNewSale: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      //* GET PRODUCTS DATA PAGE
      getProductsData: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // ADD CATEGORY
      addCategory: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET FILTER SEARCH PRODUCTS
      getFilterSearchProducts: (data) => Promise<{
        success: boolean;
        result?: TData[];
        error?: string;
      }>;

      // DELETE PRODUCT
      deleteProduct: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET CATEGORIES
      getCategoriesSelect: () => Promise<{
        success: boolean;
        result?: CategoriesSelect[];
        error?: string;
      }>;

      // ADD PRODUCT
      addProduct: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // EDIT PRODUCT
      editProduct: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // ADD PRODUCTS IMPORT
      addProductsImport: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET ALL PRODUCTS
      getAllProducts: () => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      //* GET HISTORY DATA PAGE
      getHistoryData: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET FILTER SEARCH HISTORY SALES
      getFilterSearchHistorySales: (data) => Promise<{
        success: boolean;
        result?: TData[];
        error?: string;
      }>;

      // GET ALL HISTORY SALES
      getAllHistorySales: () => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      //* GET CUSTOMERS GENERAL DATA PAGE
      getCustomersGeneralData: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET FILTER SEARCH CUSTOMERS
      getFilterSearchCustomers: (data) => Promise<{
        success: boolean;
        result?: TData[];
        error?: string;
      }>;

      // EDIT CUSTOMER
      editCustomer: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // DELETE CUSTOMER
      deleteCustomer: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      //* GET CUSTOMERS PAYMENTS DATA PAGE
      getCustomersPaymentsData: () => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET SELECTED CUSTOMER DATA
      getSelectedCustomerData: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET FILTER SEARCH CUSTOMERS DEBTS (PAYMENTS)
      getFilterSearchCustomersDebts: (data) => Promise<{
        success: boolean;
        result?: TData[];
        error?: string;
      }>;

      // GET FILTER SEARCH CUSTOMERS PAYMENTS (PAYMENTS)
      getFilterSearchCustomersPayments: (data) => Promise<{
        success: boolean;
        result?: TData[];
        error?: string;
      }>;

      // GET ALL CUSTOMERS
      getAllCustomers: () => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET ALL DEBTS AND PAYMENTS BY CUSTOMER
      getAllDebtsPayments: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // ACTIVE CUSTOMER
      activeCustomer: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      //* GET REPORTS GENERAL PAGE
      getReportsGeneralData: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      //* GET REPORTS SALES PAGE
      getReportsSalesData: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      //* GET REPORTS PRODUCTS PAGE
      getReportsProductsData: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      //* GET REPORTS CUSTOMERS PAGE
      getReportsCustomersData: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      // GET DEBTS OVER TIME
      getDebtsOverTime: (data) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;
    };
  }
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends unknown> {
    actions?: {
      onView?: (row: TData) => void;
      onEdit?: (row: TData) => void;
      onDelete?: (row: TData) => void;
      onAdd?: (row: TData) => void;
      onActive?: (row: TData) => void;
    };

    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
    addProduct?: (product: TData) => void;
    deleteProduct?: (id: string) => void;
  }

  interface ColumnMeta<TData, TValue> {
    headerClassName?: string;
  }
}
