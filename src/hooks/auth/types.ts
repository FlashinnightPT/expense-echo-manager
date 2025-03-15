
// Types for authentication-related hooks
export type UserRole = "editor" | "viewer";
export type UserStatus = "active" | "pending" | "inactive";

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  status?: UserStatus;
  lastLogin?: string;
  hashedPassword?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  canEdit: boolean;
  validatePassword: (password: string) => { isValid: boolean; errors: string[] };
  useIdleWarning: { IdleWarningDialog: () => JSX.Element };
  token: string | null;
}
