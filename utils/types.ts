export interface PostDetail{
  id: string;
  title: string;
  meta: string;
  slug: string;
  tags: string[];
  thumbnail?: string;
  createdAt: string;  
}

export interface IncomingPost{
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

export const userRole = 'user'
export const adminRole = 'admin'
export const githubProvider = 'github'
export const darkTheme = 'dark'
export const lightTheme = 'light'
export const themeMode = 'theme-mode'