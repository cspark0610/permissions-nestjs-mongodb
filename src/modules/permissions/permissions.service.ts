import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PermissionInterface } from 'src/modules/permissions/interfaces/permission.interface';
import { PermissionDto } from 'src/modules/permissions/dto/permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject('PERMISSION_MODEL')
    private permissionModel: Model<PermissionInterface>,
  ) {}

  async createPermission(
    permissionDto: PermissionDto,
  ): Promise<PermissionInterface> {
    const exists = await this.permissionModel.findOne({
      name: permissionDto.name,
    });
    if (exists) {
      throw new ConflictException('Permission already exists');
    }

    const permission = new this.permissionModel(permissionDto);
    return permission.save();
  }
}
