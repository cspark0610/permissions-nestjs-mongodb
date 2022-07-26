import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PermissionInterface } from 'src/modules/permissions/interfaces/permission.interface';

@Schema()
export class Permission extends Document implements PermissionInterface {
  @Prop({ required: true, unique: true, uppercase: true })
  name!: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
