export {};
import { Rol } from "@typesm/users";

declare global {
  interface Window {
    electronAPI: {
      installDate: () => Promise<string>;
      getRoles: () => Promise<Rol>;
      signup: (data) => void;

      signupReply: (
        callback: (data: {
          success: boolean;
          result?: boolean;
          error?: string;
        }) => void
      ) => () => void;

      login: (data) => void;
      loginReply: (
        callback: (data: {
          success: boolean;
          user?: boolean;
          error?: string;
        }) => void
      ) => () => void;

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
