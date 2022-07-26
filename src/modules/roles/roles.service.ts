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
import { UsersRepository } from 'src/modules/users/users.repository';
import { RolesRepository } from 'src/modules/roles/roles.repository';

@Injectable()
export class RolesService {
  constructor(
    private usersRepository: UsersRepository,
    private rolesRepository: RolesRepository,
    private permissionsService: PermissionsService,
    @Inject(forwardRef(() => UsersService))
    private usersSevice: UsersService,
  ) {}

  async findRoleByName(name: string) {
    name = name.toUpperCase();
    return (await this.usersRepository.findOne({ name })).populate<{
      permissions: PermissionInterface[];
    }>('permissions');
  }

  async createRole(roleDto: RoleDto) {
    const roleExists = await this.findRoleByName(roleDto.name);
    if (roleExists)
      throw new ConflictException(`Role con nombre ${roleDto.name} ya existe`);

    if (!roleDto.permissions) {
      roleDto.permissions = [];
    } else {
      const permissionsRole: PermissionInterface[] = [];
      for (const permission of roleDto.permissions) {
        const p = await this.permissionsService.findPermissionByName(
          permission.name,
        );
        if (!p) {
          throw new ConflictException(`Permiso ${permission.name} no existe`);
        }
        permissionsRole.push(p);
      }
      roleDto.permissions = permissionsRole;
    }
    const role = await this.rolesRepository.create(roleDto);
    return role.populate('permissions');
  }

  async getRoles(name: string) {
    const filterObj = {};
    name ? (filterObj['name'] = { $regex: name, $options: 'i' }) : {};
    return (this.rolesRepository.find(filterObj) as any).populate(
      'permissions',
    );
  }

  async updateRole(name: string, roleDto: RoleDto) {
    const roleExists = await this.findRoleByName(name);
    if (roleExists) {
      const newRoleExists = await this.findRoleByName(roleDto.name);

      if (newRoleExists && newRoleExists.name !== name) {
        throw new ConflictException(
          `Role con nombre ${roleDto.name} ya existe`,
        );
      }

      if (!roleDto.permissions) {
        roleDto.permissions = [];
      } else {
        const permissionsRole: PermissionInterface[] = [];
        for (const permission of roleDto.permissions) {
          const p = await this.permissionsService.findPermissionByName(
            permission.name,
          );
          if (!p) {
            throw new ConflictException(`Permiso ${permission.name} no existe`);
          }
          permissionsRole.push(p);
        }
        roleDto.permissions = permissionsRole;
      }
      await roleExists.updateOne(roleDto);
      const roleUpdated = await this.rolesRepository.findById(roleExists._id);
      return roleUpdated.populate('permissions');
    } else {
      // creamos el role
      const roleCreated = await this.createRole(roleDto);
      return roleCreated;
    }
  }

  async addPermission(name: string, permissionDto: PermissionDto) {
    const roleExists = await this.findRoleByName(name);
    if (!roleExists)
      throw new ConflictException(`Role con nombre ${name} no existe`);
    // comprobar que el permiso ya existe
    const permissionExists = await this.permissionsService.findPermissionByName(
      permissionDto.name,
    );
    // si no existe el permiso lanzar excepcion
    if (!permissionExists)
      throw new ConflictException(`Permiso ${permissionDto.name} no existe`);

    const permissionsArray: PermissionInterface[] = roleExists.permissions;
    const permissionRoleExists = permissionsArray.find(
      (p) => p.name == permissionDto.name,
    );
    if (permissionRoleExists)
      throw new ConflictException(
        `El permiso ${permissionDto.name} ya existe en el role ${roleExists.name}`,
      );

    // si no existe significa que lo puedo agregar
    roleExists.permissions.push(permissionRoleExists);
    return this.updateRole(name, roleExists);
  }

  async removePermission(name: string, permissionDto: PermissionDto) {
    const roleExists = await this.findRoleByName(name);
    if (!roleExists)
      throw new ConflictException(`Role con nombre ${name} no existe`);
    // comprobar que el permiso ya existe
    const permissionExists = await this.permissionsService.findPermissionByName(
      permissionDto.name,
    );
    // si no existe el permiso lanzar excepcion
    if (!permissionExists)
      throw new ConflictException(`Permiso ${permissionDto.name} no existe`);

    const permissionsArray: PermissionInterface[] = roleExists.permissions;
    // busco el index del permiso a borrar
    const idxPermissionRoleExists: number = permissionsArray.findIndex(
      (p) => p.name == permissionDto.name,
    );
    if (idxPermissionRoleExists === -1)
      throw new ConflictException(
        `El permiso ${permissionDto.name} ya existe en el role ${roleExists.name}`,
      );
    // si el index es distinto de -1 significa que lo puedo borrar del array
    roleExists.permissions.splice(idxPermissionRoleExists, 1);
    return this.updateRole(name, roleExists);
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
