import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Role } from 'src/modules/roles/schemas/role.schema';
import { AppException } from '../../common/exceptions/appException';
import { RoleDto } from './dto/role.dto';

@Injectable()
export class RolesRepository extends BaseRepository<Role> {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {
    super(roleModel);
  }

  async createRoleAndPopulate(roleDto: RoleDto) {
    const created = await this.roleModel.create(roleDto);
    if (!created) {
      throw new AppException({
        error: 'Error al crear el rol',
        errorCode: 'ROLE_CREATE_ERROR',
        statusCode: HttpStatus.CONFLICT,
      });
    }
    return this.findById(created._id, 'permissions');
  }
}
