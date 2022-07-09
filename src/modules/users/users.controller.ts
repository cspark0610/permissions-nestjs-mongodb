import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from 'src/modules/users/users.service';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { UserRoleDto } from 'src/modules/users/dto/user-role.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({ description: 'Crea un usuario' })
  @ApiBody({
    description: 'crea un usuario usando un userDto',
    type: UserDto,
    examples: {
      ejemplo1: {
        value: {
          name: 'user1',
          email: 'f1@email.com',
          birthday: '1990-02-02',
          role: { name: 'ADMIN' },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'usuario creado correctamente' })
  @ApiResponse({
    status: 409,
    description: 'Email del user ya existe, <br/> El rol no existe',
  })
  createUser(@Body() userDto: UserDto) {
    return this.usersService.createUser(userDto);
  }

  @Get()
  @ApiOperation({
    description: 'Devuelve todos los usuarios con roles y permisos populados',
  })
  @ApiResponse({ status: 200, description: 'Usuarios devueltos correctamente' })
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get('/deleted')
  @ApiOperation({ description: 'Devuelve todos los usuarios borrados' })
  @ApiResponse({ status: 200, description: 'Usuarios devueltos correctamente' })
  getUsersDeleted() {
    return this.usersService.getUsersDeleted();
  }

  @Put()
  @ApiOperation({ description: 'Actualiza un usuario' })
  @ApiBody({
    description: 'Actualiza un usuario usando un userDto',
    type: UserDto,
    examples: {
      ejemplo1: {
        value: {
          name: 'user2',
          email: 'f1@email.com',
          birthday: '1990-02-02',
          role: null,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
  })
  updateUser(@Body() userDto: UserDto) {
    return this.usersService.updateUser(userDto);
  }

  @Patch('/add-role')
  @ApiOperation({ description: 'Agrega un rol a un usuario' })
  @ApiBody({
    type: UserRoleDto,
    description: 'Pasar un UserRoleDto para agregar un rol',
    examples: {
      ejemplo1: {
        value: { userCode: 1, roleName: 'SUPERUSER' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'rol agregado correctamente al usuario',
  })
  @ApiResponse({
    status: 409,
    description:
      'el usuario ya tiene un rol, <br/> El rol no existe<br/>. El usuario no existe',
  })
  addRole(@Body() userRoleDto: UserRoleDto) {
    return this.usersService.addRole(userRoleDto);
  }

  @Patch('/remove-role/:userCode')
  @ApiOperation({ description: 'Elimina un rol a un usuario' })
  @ApiParam({
    name: 'userCode',
    type: Number,
    required: true,
    description: 'Codigo del usuario al cual vamos a eliminar su rol',
  })
  @ApiResponse({
    status: 201,
    description: 'Rol eliminado correctamente del usuario',
  })
  @ApiResponse({
    status: 409,
    description: 'El rol no existe<br/>. El usuario no existe',
  })
  removeRole(@Param('userCode') userCode: number) {
    return this.usersService.removeRole(userCode);
  }

  @Patch('/:userCode')
  @ApiOperation({ description: 'Actualiza a un usuario con deleted:true' })
  @ApiParam({
    name: 'userCode',
    type: Number,
    required: true,
    description: 'Codigo del usuario al cual vamos a pasarle deleted: true',
  })
  @ApiResponse({
    status: 201,
    description: 'usuario eliminado correctamente',
  })
  @ApiResponse({
    status: 409,
    description:
      'El usuario ya esta borrado <br/>. El usuario no existe para ser borrado',
  })
  deleteUser(@Param('userCode') userCode: number) {
    return this.usersService.deleteUser(userCode);
  }

  @Patch('/restore/:userCode')
  @ApiOperation({ description: 'Actualiza a un usuario con deleted:false' })
  @ApiParam({
    name: 'userCode',
    type: Number,
    required: true,
    description: 'Codigo del usuario al cual vamos a pasarle deleted: true',
  })
  @ApiResponse({
    status: 201,
    description: 'usuario restaurado correctamente',
  })
  @ApiResponse({
    status: 409,
    description:
      'El usuario ya esta restaurado <br/>. El usuario no existe para ser restaurado',
  })
  restoreUser(@Param('userCode') userCode: number) {
    return this.usersService.restoreUser(userCode);
  }
}
