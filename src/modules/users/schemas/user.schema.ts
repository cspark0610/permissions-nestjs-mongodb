import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { Role } from 'src/modules/roles/schemas/role.schema';
import { UserInterface } from 'src/modules/users/interfaces/user.interface';

@Schema()
export class User implements UserInterface {
  @Prop({ type: Number, unique: true })
  userCode: number;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, unique: true, trim: true })
  email: string;

  @Prop({ type: Date })
  birthday: Date;

  @Prop({ type: Types.ObjectId, ref: Role.name, default: null, nullable: true })
  role?: ObjectId;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
