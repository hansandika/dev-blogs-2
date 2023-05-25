export interface PostDetail {
  id: string;
  title: string;
  meta: string;
  slug: string;
  tags: string[];
  thumbnail?: string;
  createdAt: string;
}

export interface IncomingPost {
  title: string;
  content: string;
  meta: string;
  tags: string;
  slug: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | undefined;
  role: "user" | "admin";
}

export type replyComments = CommentResponse[];
export interface CommentResponse {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  likedByOwner?: boolean;
  replies?: replyComments;
  repliedTo?: string;
  chiefComment: boolean;
  owner: { name: string, id: string, avatar?: string } | null;
}

export const userRole = 'user'
export const adminRole = 'admin'
export const githubProvider = 'github'
export const darkTheme = 'dark'
export const lightTheme = 'light'
export const themeMode = 'theme-mode'

export const pageLimit = 5;
export const pageNoInitial = 1;