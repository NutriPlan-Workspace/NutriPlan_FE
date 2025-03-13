export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = '',
}
