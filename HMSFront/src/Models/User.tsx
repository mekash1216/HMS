// Models/User.ts
export interface User {
  id: string;
  userName: string;
  email: string;
  roles: string[];
   permissions: string[];
}

export interface RegisterUser {
  username: string;
  email: string;
  password: string;
}
