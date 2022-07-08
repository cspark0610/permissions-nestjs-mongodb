import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RoleInterface } from 'src/modules/roles/interfaces/role.interface';
import { Permission } from 'src/modules/permissions/schemas/permission.schema';

@Schema()
export class Role implements RoleInterface {
  @Prop({ unique: true, type: String, uppercase: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: Permission.name, default: [] })
  permissions: Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
