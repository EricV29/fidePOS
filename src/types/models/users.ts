export type Users = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
  deleted_at: string;
};

export type Role = {
  id: string;
  role: string;
  created_at: string;
};

export type UserSession = {
  id: number;
  name: string;
  last_name: string;
  img: string;
  role_id: number;
  status_id: number;
};
