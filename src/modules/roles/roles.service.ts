import {
  ConflictException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { PermissionsService } from 'src/modules/permissions/permissions.service';
import { RoleDto } from 'src/modules/roles/dto/role.dto';
import { PermissionInterface } from 'src/modules/permissions/interfaces/permission.interface';
import { PermissionDto } from 'src/modules/permissions/dto/permission.dto';
import { UsersService } from 'src/modules/users/users.service';
import { RolesRepository } from 'src/modules/roles/roles.repository';
import { Role } from './schemas/role.schema';
import { Permission } from '../permissions/schemas/permission.schema';

@Injectable()
export class RolesService {
  constructor(
    private rolesRepository: RolesRepository,
    private permissionsService: PermissionsService,
    @Inject(forwardRef(() => UsersService))
    private usersSevice: UsersService,
  ) {}

  async findRoleByName(name: string) {
    name = name.toUpperCase();
    return this.rolesRepository.findOne({ name }, 'permissions');
  }

  async createRole(roleDto: RoleDto): Promise<Role> {
    const role = await this.findRoleByName(roleDto.name);
    if (role)
      throw new ConflictException(
        `Role con nombre ${roleDto.name} ya fue creado`,
      );

    if (!roleDto.permissions) {
      roleDto.permissions = [];
    }
    const permissionsRole: PermissionInterface[] = [];

    for (const permission of roleDto.permissions) {
      const newP = await this.permissionsService.createPermission({
        name: permission.name,
      });
      permissionsRole.push(newP);
    }
    roleDto.permissions = permissionsRole;
    return this.rolesRepository.create(roleDto);
  }

  async getRoles(name: string) {
    const filterObj = {};
    name ? (filterObj['name'] = { $regex: name, $options: 'i' }) : {};
    const result: Promise<Role[]> = this.rolesRepository.find(
      filterObj,
      'permissions',
    );
    return result;
  }

  async updateRole(name: string, roleDto: RoleDto) {
    const roleToUpdate = await this.findRoleByName(name);
    if (!roleToUpdate) {
      throw new ConflictException(
        `Role con nombre ${name} no existe para actualizar`,
      );
    }
    if (!roleDto.permissions) {
      roleDto.permissions = [];
    }

    const permissionsRole: PermissionInterface[] = [];
    for (const permission of roleDto.permissions) {
      permissionsRole.push(permission);
    }
    roleDto.permissions = permissionsRole;

    return this.rolesRepository.findOneAndUpdate({ name }, roleDto);
  }

  async addPermission(name: string, permissionDto: PermissionDto) {
    const roleExists = await this.findRoleByName(name);
    if (!roleExists)
      throw new ConflictException(`Role con nombre ${name} no existe`);

    // comprobar que el permiso ya existe o no en el array de Permission del rol sobre el cual quiero agregarlo
    const permissionRoleExists = roleExists.permissions.filter(
      (permission) => permission.name == permissionDto.name,
    );

    if (permissionRoleExists.length)
      throw new ConflictException(
        `El permiso ${permissionDto.name} ya existe en el role ${roleExists.name}`,
      );
    // si no existe significa que lo puedo agregar el PermissionDto
    roleExists.permissions.push(permissionDto as Permission);
    await roleExists.save();
    return roleExists;
  }

  async removePermission(name: string, permissionDto: PermissionDto) {
    const roleExists = await this.findRoleByName(name);
    if (!roleExists)
      throw new ConflictException(`Role con nombre ${name} no existe`);

    // busco el index del permiso a borrar
    const idxPermissionRoleExists: number = roleExists.permissions.findIndex(
      (p) => p.name == permissionDto.name,
    );
    if (idxPermissionRoleExists === -1)
      throw new ConflictException(
        `El permiso ${permissionDto.name} NO existe en el role ${roleExists.name} para ser borrado`,
      );
    // si el index es distinto de -1 significa que lo puedo borrar del array
    roleExists.permissions.splice(idxPermissionRoleExists, 1);
    await roleExists.save();
    return roleExists;
  }

  /**
   * queremos agreagar la condicion de que si hay mas de un usuario con el mismo rol, no podamos borrar ese rol
   */
  async deleteRole(name: string) {
    const roleExists = await this.findRoleByName(name);

    if (!roleExists)
      throw new ConflictException(`Role con nombre ${name} no existe`);

    // comprobar que el rol no esta siendo usado por mas de 1 usuario
    const num = await this.usersSevice.countUsersWithRole(name);
    if (num > 0)
      throw new ConflictException(
        `El rol ${name} esta siendo usado por mas de 1 usuario y por ende no puede ser borrado`,
      );
    await roleExists.delete();
    return roleExists;
  }
}
