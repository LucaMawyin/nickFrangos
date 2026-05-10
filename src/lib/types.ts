export type User = {
  id: number;
  email: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type Article = {
  id: number;
  title : string;
  content : string;
}

export type LoginResponse =
  | { success: true ; error : "" }
  | { success: false; error: string };

export interface Env {
  nicholas_db: D1Database;
};

