
// Authentication related types
export type UserRole = "editor" | "viewer";

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (username: string, password: string, userData?: any) => Promise<boolean>; // Updated login signature
  logout: () => void;
  canEdit: boolean;
  validatePassword: (password: string) => { isValid: boolean; errors: string[] };
  useIdleWarning: { IdleWarningDialog: () => JSX.Element };
}
