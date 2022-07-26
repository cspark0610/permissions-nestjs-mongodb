import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Permission } from 'src/modules/permissions/schemas/permission.schema';

@Injectable()
export class PermissionsRepository extends BaseRepository<Permission> {
  constructor(
    @InjectModel(Permission.name) private permissionsModel: Model<Permission>,
  ) {
    super(permissionsModel);
  }
}
