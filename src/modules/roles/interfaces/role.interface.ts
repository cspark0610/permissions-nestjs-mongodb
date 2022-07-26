import { Permission } from '../../permissions/schemas/permission.schema';
export interface RoleInterface {
  name: string;
  permissions?: Permission[];
}
