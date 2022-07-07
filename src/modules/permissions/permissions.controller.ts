import { Body, Controller, Post } from '@nestjs/common';
import { PermissionsService } from 'src/modules/permissions/permissions.service';
import { PermissionDto } from 'src/modules/permissions/dto/permission.dto';
import { PermissionInterface } from 'src/modules/permissions/interfaces/permission.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  createPermission(
    @Body() permissionDto: PermissionDto,
  ): Promise<PermissionInterface> {
    return this.permissionsService.createPermission(permissionDto);
  }
}
