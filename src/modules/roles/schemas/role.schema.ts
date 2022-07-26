import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, ObjectId } from 'mongoose';
import { RoleInterface } from 'src/modules/roles/interfaces/role.interface';
import { Permission } from 'src/modules/permissions/schemas/permission.schema';
import { Document } from 'mongoose';

@Schema()
export class Role extends Document implements RoleInterface {
  @Prop({ unique: true, type: String, uppercase: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: Permission.name, default: [] })
  permissions: ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
