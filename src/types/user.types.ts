export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = '',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Roles;
}
