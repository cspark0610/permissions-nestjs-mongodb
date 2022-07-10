import { ObjectId } from 'mongoose';

export interface RoleInterface {
  name: string;
  permissions?: ObjectId[];
}
