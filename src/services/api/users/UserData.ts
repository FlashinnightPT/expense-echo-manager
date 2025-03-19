
import { UserRole } from '@/hooks/auth';

export interface UserData {
  id: string;
  name: string;
  username: string;
  password?: string; // Usado apenas para validação temporária
  role: UserRole;
  status: 'active' | 'pending' | 'inactive';
  lastLogin?: string;
}
