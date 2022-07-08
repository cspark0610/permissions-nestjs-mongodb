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
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from 'src/modules/roles/roles.service';
import { RoleDto } from 'src/modules/roles/dto/role.dto';
import { PermissionDto } from 'src/modules/permissions/dto/permission.dto';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  async createRole(@Body() roleDto: RoleDto) {
    return this.rolesService.createRole(roleDto);
  }

  @Get()
  async getRoles(@Query('name') name: string) {
    return this.rolesService.getRoles(name);
  }

  @Put('/:name')
  async updateRole(@Param('name') name: string, @Body() roleDto: RoleDto) {
    return this.rolesService.updateRole(name, roleDto);
  }

  @Patch('add-permission/:name')
  async addPermission(
    @Param('name') name: string,
    @Body() permissionDto: PermissionDto,
  ) {
    return this.rolesService.addPermission(name, permissionDto);
  }

  @Patch('remove-permission/:name')
  async removePermission(
    @Param('name') name: string,
    @Body() permissionDto: PermissionDto,
  ) {
    return this.rolesService.removePermission(name, permissionDto);
  }

  @Delete('/:name')
  async deleteRole(@Param('name') name: string) {
    return this.rolesService.deleteRole(name);
  }
}
