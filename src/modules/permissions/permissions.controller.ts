import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PermissionsService } from 'src/modules/permissions/permissions.service';
import { PermissionDto } from 'src/modules/permissions/dto/permission.dto';
import { PermissionInterface } from 'src/modules/permissions/interfaces/permission.interface';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('permissions')
@ApiTags('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ description: 'Crea un permiso' })
  @ApiBody({
    description: 'crea un permiso usando un PermissionDto',
    type: PermissionDto,
    examples: {
      ejemplo1: {
        value: { name: 'create' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Permiso creado correctamente' })
  @ApiResponse({ status: 409, description: 'Permiso existe' })
  createPermission(
    @Body() permissionDto: PermissionDto,
  ): Promise<PermissionInterface> {
    return this.permissionsService.createPermission(permissionDto);
  }

  @Get()
  @ApiOperation({ description: 'Deveulve los permisos filtrados por name' })
  @ApiQuery({
    description: 'Deveulve los permisos filtrados por name',
    type: String,
    required: false,
    name: 'name',
  })
  @ApiResponse({ status: 200, description: 'Permisos devueltos correctamente' })
  getAllPermissions(
    @Query('name') name: string,
  ): Promise<PermissionInterface[]> {
    return this.permissionsService.getAllPermissions(name);
  }

  @Put()
  @ApiOperation({ description: 'Actualiza un permiso' })
  @ApiBody({
    description: 'ACtualiza un permiso usando un UpdatePermissionDto',
    type: UpdatePermissionDto,
    examples: {
      ejemplo1: {
        value: { originalName: 'create', newName: 'delete' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Permiso actualizado correctamente',
  })
  @ApiResponse({ status: 409, description: 'Ambos Permisos existen' })
  updatePermission(
    @Body() updatePermission: UpdatePermissionDto,
  ): Promise<PermissionInterface> {
    return this.permissionsService.updatePermission(updatePermission);
  }

  @Delete('/:name')
  @ApiOperation({
    description: 'Borra un permiso dado un name y devuelve el borrado',
  })
  @ApiParam({
    description: 'Pasar el name del permiso a borrar',
    type: String,
    required: true,
    name: 'name',
  })
  @ApiResponse({ status: 200, description: 'Permisos borrado correctamente' })
  deletePermission(@Param('name') name: string): Promise<PermissionInterface> {
    return this.permissionsService.deletePermission(name);
  }
}
