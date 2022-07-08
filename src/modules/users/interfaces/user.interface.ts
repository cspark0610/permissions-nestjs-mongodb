import { ObjectId } from 'mongoose';

export interface UserInterface {
  userCode: number;
  name: string;
  email: string;
  birthday: Date;
  role?: ObjectId;
  deleted: boolean;
}
