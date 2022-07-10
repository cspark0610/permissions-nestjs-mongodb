import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PermissionInterface } from 'src/modules/permissions/interfaces/permission.interface';
import { PermissionDto } from 'src/modules/permissions/dto/permission.dto';
import { UpdatePermissionDto } from 'src/modules/permissions/dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject('PERMISSION_MODEL')
    private permissionModel: Model<PermissionInterface>,
  ) {}

  async findPermissionByName(name: string) {
    return this.permissionModel.findOne({ name });
  }

  async createPermission(
    permissionDto: PermissionDto,
  ): Promise<PermissionInterface> {
    const exists = await this.findPermissionByName(permissionDto.name);
    if (exists) {
      throw new ConflictException('Permission already exists');
    }

    const permission = new this.permissionModel(permissionDto);
    return permission.save();
  }

  async getAllPermissions(name: string): Promise<PermissionInterface[]> {
    const filterObj = {};
    name ? (filterObj['name'] = { $regex: name, $options: 'i' }) : {};
    // { name: { '$regex': 'upd', '$options': 'i' } }

    return this.permissionModel.find(filterObj);
  }

  async updatePermission(
    updatePermission: UpdatePermissionDto,
  ): Promise<PermissionInterface> {
    const foundPermission = await this.findPermissionByName(
      updatePermission.originalName,
    );
    const newPermission = await this.findPermissionByName(
      updatePermission.newName,
    );

    if (foundPermission && !newPermission) {
      await foundPermission.updateOne({
        name: updatePermission.newName,
      });
      return this.permissionModel.findById(foundPermission._id);
    } else if (!foundPermission) {
      const permission = new PermissionDto();
      permission.name = updatePermission.originalName;
      return this.createPermission(permission);
    } else {
      throw new ConflictException('No se puede actualizar el permiso');
    }
  }

  async deletePermission(name: string): Promise<PermissionInterface> {
    const foundPermission = await this.permissionModel.findOne({
      name,
    });
    if (!foundPermission)
      throw new ConflictException(
        'No se puede eliminar el permiso porque no existe',
      );
    await foundPermission.delete();
    return foundPermission;
  }
}
