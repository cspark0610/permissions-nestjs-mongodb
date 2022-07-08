import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesService } from 'src/modules/roles/roles.service';
import { RoleDto } from 'src/modules/roles/dto/role.dto';
import { PermissionDto } from 'src/modules/permissions/dto/permission.dto';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  @ApiOperation({ description: 'Crea un rol' })
  @ApiBody({
    description: 'crea un rol usando un roleDto',
    type: RoleDto,
    examples: {
      ejemplo1: {
        value: {
          name: 'superuser',
          permissions: [{ name: 'CREATE' }, { name: 'UPDATE' }],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'ROL creado correctamente' })
  @ApiResponse({
    status: 409,
    description: 'ROL existe, <br/> El permiso no existe',
  })
  async createRole(@Body() roleDto: RoleDto) {
    return this.rolesService.createRole(roleDto);
  }

  @Get()
  @ApiOperation({ description: 'Devuelve los roles filtrados por name' })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Filtra los roles segun el name dado',
  })
  @ApiResponse({ status: 200, description: 'Roles devueltos correctamente' })
  async getRoles(@Query('name') name: string) {
    return this.rolesService.getRoles(name);
  }

  @Put('/:name')
  @ApiOperation({ description: 'Actualiza un rol' })
  @ApiParam({
    name: 'name',
    type: String,
    required: true,
    description: 'pasar como param el nomnbre del rol a actualizar',
  })
  @ApiBody({
    description: 'Actualiza un rol usando un roleDto',
    type: RoleDto,
    examples: {
      ejemplo1: {
        value: {
          name: 'superuser',
          permissions: [{ name: 'CREATE' }, { name: 'UPDATE' }],
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'ROL actualizado correctamente' })
  @ApiResponse({
    status: 409,
    description: 'ROL ya existe, <br/> El permiso no existe',
  })
  async updateRole(@Param('name') name: string, @Body() roleDto: RoleDto) {
    return this.rolesService.updateRole(name, roleDto);
  }

  @Patch('add-permission/:name')
  @ApiOperation({ description: 'Agrega un permiso a un rol' })
  @ApiParam({
    name: 'name',
    type: String,
    required: true,
    description: 'pasar como param el nombre del rol a agregarle un permiso',
  })
  @ApiBody({
    type: PermissionDto,
    description: 'Pasar un permissionDto para agregar un permiso a un rol',
    examples: {
      ejemplo1: {
        value: { name: 'READ' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'permiso agregado al rol correctamente',
  })
  @ApiResponse({
    status: 409,
    description:
      'ROL no existe, <br/> El permiso no existe <br/>. El permiso ya existe en el rol',
  })
  async addPermission(
    @Param('name') name: string,
    @Body() permissionDto: PermissionDto,
  ) {
    return this.rolesService.addPermission(name, permissionDto);
  }

  @Patch('remove-permission/:name')
  @ApiOperation({ description: 'Borra un permiso a un rol' })
  @ApiParam({
    name: 'name',
    type: String,
    required: true,
    description: 'pasar como param el nombre del rol a borrarle un permiso',
  })
  @ApiBody({
    type: PermissionDto,
    description: 'Pasar un permissionDto para borrar un permiso a un rol',
    examples: {
      ejemplo1: {
        value: { name: 'UPDATE' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'permiso borrado al rol correctamente',
  })
  @ApiResponse({
    status: 409,
    description:
      'ROL no existe, <br/> El permiso no existe <br/>. El permiso no existe en el rol para ser borrado',
  })
  async removePermission(
    @Param('name') name: string,
    @Body() permissionDto: PermissionDto,
  ) {
    return this.rolesService.removePermission(name, permissionDto);
  }

  @Delete('/:name')
  @ApiOperation({ description: 'Elimina un rol' })
  @ApiParam({
    name: 'name',
    type: String,
    required: true,
    description: 'nombre del rol a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Rol eliminado correctamente',
  })
  @ApiResponse({
    status: 409,
    description: 'ROL no existe',
  })
  async deleteRole(@Param('name') name: string) {
    return this.rolesService.deleteRole(name);
  }
}
