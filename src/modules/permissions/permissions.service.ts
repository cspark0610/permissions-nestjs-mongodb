import { ConflictException, Injectable } from '@nestjs/common';
import { PermissionInterface } from 'src/modules/permissions/interfaces/permission.interface';
import { PermissionDto } from 'src/modules/permissions/dto/permission.dto';
import { UpdatePermissionDto } from 'src/modules/permissions/dto/update-permission.dto';
import { PermissionsRepository } from 'src/modules/permissions/permissions.repository';

@Injectable()
export class PermissionsService {
  constructor(private permissionsRepository: PermissionsRepository) {}

  async findPermissionByName(name: string) {
    return this.permissionsRepository.findOne({ name });
  }

  async createPermission(
    permissionDto: PermissionDto,
  ): Promise<PermissionInterface> {
    const exists = await this.findPermissionByName(permissionDto.name);
    if (exists) throw new ConflictException('Permission already exists');
    return this.permissionsRepository.create(permissionDto);
  }

  async getAllPermissions(name: string): Promise<PermissionInterface[]> {
    const filterObj = {};
    name ? (filterObj['name'] = { $regex: name, $options: 'i' }) : {};
    // { name: { '$regex': 'upd', '$options': 'i' } }

    return this.permissionsRepository.find(filterObj);
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
      return this.permissionsRepository.findById(foundPermission._id);
    } else if (!foundPermission) {
      const permission = new PermissionDto();
      permission.name = updatePermission.originalName;
      return this.createPermission(permission);
    } else {
      throw new ConflictException('No se puede actualizar el permiso');
    }
  }

  async deletePermission(name: string): Promise<PermissionInterface> {
    const res = await this.permissionsRepository.findOneAndDelete({ name });
    if (!res)
      throw new ConflictException(
        'No se puede eliminar el permiso porque no existe',
      );
    return res;
  }
}
