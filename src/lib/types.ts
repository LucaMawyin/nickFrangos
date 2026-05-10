export type Page = {
    title:string;
    href:string;
    requireLogin : boolean;
}

export type User = {
  id: number;
  email: string;
  password: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type LoginResponse =
  | { success: true ; error : "" }
  | { success: false; error: string };


export type Article = {
  id: number;
  title : string;
  content : string;
}


export interface Env {
  nicholas_db: D1Database;
};

