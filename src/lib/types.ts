export type Page = {
    title:string;
    href:string;
    requireLogin : boolean;
}

export type User = {
  id: number;
  email: string;
  password: string;
  firstName : string;
  lastName : string;
  createdAt : string; 
  emailVerified : boolean;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
};

// Same structure different names for transparency
export type LoginResponse =
  | { status: "success" ; error : "" }
  | { status: "error"; error: string }
  | { status : "verification_required"; error : "" };

export type ChangePasswordResponse =
  | { success: true ; error : "" }
  | { success: false; error: string };

export type Article = {
  id: number;
  title : string;
  content : string;
  image : Buffer | null;
  image_type : string;
  slug : string;
  created_at: string;
};

export type ArticleResponse = {
  articles : Article[]
};

export type Session = {
  id: number;
  user_id: number;
  token: string;
  created_at: string;
  expires_at: string;
};

export type VerifyLoginBody = {
  code: string;
};

export interface Env {
  nicholas_db: D1Database;
  IPINFO_TOKEN : string;
};

