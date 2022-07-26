import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Role } from 'src/modules/roles/schemas/role.schema';

@Injectable()
export class RolesRepository extends BaseRepository<Role> {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {
    super(roleModel);
  }
}
