import {Role} from './role';
export class User {
  id: number;
  username: string="";
  password: string="";
  name: string="";
  email:string ="";
  phonenumber :string="";
  role: Role;
  token: string="";
}
