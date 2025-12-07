export {};
import { Rol } from "@typesm/users";

declare global {
  interface Window {
    electronAPI: {
      installDate: () => Promise<string>;
      getRoles: () => Promise<Rol>;
      signupSuccess: () => void;
      loginSuccess: () => void;
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
      view?: boolean;
      delete?: boolean;
      edit?: boolean;
      add?: boolean;
    };
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
    addProduct?: (product: TData) => void;
  }
}

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends unknown> {
    addProduct?: (product: any) => void;
  }
}
