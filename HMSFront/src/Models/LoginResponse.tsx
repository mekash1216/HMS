export interface LoginResponse {
  sessionToken: string;
  roles:string[];
  permissions: string[]; 
}
