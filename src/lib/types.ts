export type Page = {
    title:string;
    href:string;
    requireLogin : boolean;
    newTab:boolean,
}

export type User = {
    id: number;
    email: string;
    password: string;
    first_name : string;
    last_name : string;
    created_at : string; 
    failed_attempts : number;
    locked_until : string;
};

export type LoginBody = {
    email: string;
    password: string;
};

export type LoginResponse =
    | { status: "success" ; error : "" }
    | { status: "error"; error: string }
    | { status : "verification_required"; attemptId: number; error : "" };

export type VerifyLoginBody = {
    code: string;
    serial?: string;
};

export type LoginVerification = {
    id: number;
    user_id: number;
    token: string;
    serial: string | null;
    type: "login" | "unlock";
    expires_at: string;
    ip_address: string;
    geo: string;
    user_agent: string;
};

export type Session = {
  id: number;
  user_id: number;
  token: string;
  created_at: string;
  expires_at: string;
};

export type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse =
  | { success: true ; error : "" }
  | { success: false; error: string };

export type Article = {
  id: number;
  title : string;
  content : string;
  image : string | null;
  image_type : string;
  slug : string;
  created_at: string;
  updated_at:string;
  published_at:string;
};

export type ArticleResponse = {
  articles : Article[]
};

export type YouTubeResponse = {
  videoId?: string;
  error?: string;
};

export type YouTubeChannelResponse = {
  items?: {
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }[];
};

export type YouTubePlaylistResponse = {
  items?: {
    snippet?: {
      resourceId?: {
        videoId?: string;
      };
    };
  }[];
};

export type YouTubeVideoResponse = {
    items: {
        id: string;
        snippet: {
            publishedAt: string;
        };
        contentDetails: {
            duration: string;
        };
    }[];
};

export type Draft = {
  id: string;
  title: string;
};

export interface Env {
  nicholas_db: D1Database;
  IPINFO_TOKEN : string;
};

