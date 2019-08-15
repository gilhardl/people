/**
 * Interface for the 'Users' data
 */
export interface UsersEntity {
  id?: number;
  username: string;
  password?: string;
  confirmed: boolean;
  confirmationToken?: string;
  recoverToken?: string;
  role: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  job: string;
}
