import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Role } from 'src/modules/roles/schemas/role.schema';
import { UserInterface } from 'src/modules/users/interfaces/user.interface';
import { Document } from 'mongoose';

@Schema()
export class User extends Document implements UserInterface {
  // schematypes.d.ts to see all the available options that can be passes in @Prop()
  @Prop({ type: Number, unique: true })
  userCode: number;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ type: Date })
  birthday: Date;

  @Prop({ type: Types.ObjectId, ref: 'Role' }) // significa en DB solo voy a guardar una referencia al modelo de Role
  role?: Role;

  @Prop({ type: Boolean, default: false })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
