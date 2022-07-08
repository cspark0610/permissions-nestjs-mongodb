import { Types } from 'mongoose';

export interface RoleInterface {
  name: string;
  permissions?: Types.ObjectId[];
}
