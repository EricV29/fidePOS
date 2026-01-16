export {};
import { Role } from "@typesm/users";

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
      installDate: () => Promise<string>;
      getRoles: () => Promise<Role>;

      // SIGNUP
      signup: (data) => Promise<{
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
        lan: string
      ) => Promise<{
        success: boolean;
        result?: string;
        error?: string;
      }>;

      logoutSuccess: () => void;
      sendMessage: (msg: string) => void;
      onMessageReply: (callback: (data: string) => void) => void;
      sendMessagePrivate: (msg: string) => void;
      onMessageReplyPrivate: (callback: (data: string) => void) => void;
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
