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

      // GET DASHBOARD DATA
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
    };

    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;

    addProduct?: (product: TData) => void;
    deleteProduct?: (id: string) => void;
  }

  interface ColumnMeta<TData, TValue> {
    headerClassName?: string;
  }
}
