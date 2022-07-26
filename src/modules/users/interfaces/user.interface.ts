import { Role } from 'src/modules/roles/schemas/role.schema';

export interface UserInterface {
  userCode: number;
  name: string;
  email: string;
  birthday: Date;
  role?: Role;
  deleted: boolean;
}
