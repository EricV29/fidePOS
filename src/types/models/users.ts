export type Users = {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  rol: string;
  status: string;
  created_at: string;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
};
