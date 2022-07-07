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

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  createPermission(
    @Body() permissionDto: PermissionDto,
  ): Promise<PermissionInterface> {
    return this.permissionsService.createPermission(permissionDto);
  }

  @Get()
  getAllPermissions(
    @Query('name') name: string,
  ): Promise<PermissionInterface[]> {
    return this.permissionsService.getAllPermissions(name);
  }

  @Put()
  updatePermission(
    @Body() updatePermission: UpdatePermissionDto,
  ): Promise<PermissionInterface> {
    return this.permissionsService.updatePermission(updatePermission);
  }

  @Delete('/:name')
  deletePermission(@Param('name') name: string): Promise<PermissionInterface> {
    return this.permissionsService.deletePermission(name);
  }
}
