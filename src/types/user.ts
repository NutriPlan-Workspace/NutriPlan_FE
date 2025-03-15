import { Role } from '@/constants/role';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}
