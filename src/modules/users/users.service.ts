import {
  Inject,
  Injectable,
  ConflictException,
  forwardRef,
} from '@nestjs/common';
import { RolesService } from 'src/modules/roles/roles.service';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { Permission } from 'src/modules/permissions/schemas/permission.schema';
import { UserRoleDto } from 'src/modules/users/dto/user-role.dto';
import { Logger } from 'src/common/decorators/logger.decorator';
import { UsersRepository } from './users.repository';
import { User } from './schemas/user.schema';
import { Role } from '../roles/schemas/role.schema';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    // si quiero inyectar el RolesService debo exportarlo desde el RoleModule, exports: [RolesService]
    @Inject(forwardRef(() => RolesService))
    private rolesService: RolesService,
  ) {}

  async findUserByEmail(email: string) {
    return this.usersRepository.findUserByEmailAndPopulate(email.toLowerCase());
  }

  async findUserByUserCode(userCode: number) {
    return this.usersRepository.findOne({ userCode });
  }

  async createUser(userDto: UserDto) {
    const userExists = (await this.findUserByEmail(userDto.email)) as User;

    if (userExists)
      throw new ConflictException(
        `User with email ${userDto.email} already exists`,
      );
    if (userDto.role) {
      const roleExists = (await this.rolesService.findRoleByName(
        userDto.role.name,
      )) as Role;
      if (!roleExists)
        throw new ConflictException(`Role ${userDto.role} does not exist`);

      userDto.role = roleExists;
    }

    const nUsers: number = await this.usersRepository.countDocuments(); // inicialmente 0
    return this.usersRepository.create({
      ...userDto,
      userCode: nUsers + 1,
    });
  }

  async getUsers() {
    return this.usersRepository.getUsersWithRolesAndPopulate();
  }

  async getUsersDeleted() {
    return this.usersRepository.getUsersWithRolesAndPopulate({ deleted: true });
  }

  async updateUser(userDto: UserDto) {
    const userExists = await this.findUserByEmail(userDto.email);

    if (userExists) {
      if (userDto.role) {
        const roleExists = await this.rolesService.findRoleByName(
          userDto.role.name,
        );
        if (!roleExists)
          throw new ConflictException(`Role ${userDto.role} does not exist`);
        userDto.role = roleExists;
      }
      await userExists.updateOne(userDto);
      return this.findUserByEmail(userDto.email);
    }
    // sino existe el usuario, lo creo
    return this.createUser(userDto);
  }

  async addRole(userRoleDto: UserRoleDto) {
    const userExists = await this.findUserByUserCode(userRoleDto.userCode);
    if (!userExists)
      throw new ConflictException(
        `User ${userRoleDto.userCode} does not exist`,
      );

    if (userExists.role)
      throw new ConflictException(
        `User ${userRoleDto.userCode} already has a role`,
      );

    const roleExists = await this.rolesService.findRoleByName(
      userRoleDto.roleName,
    );
    if (!roleExists)
      throw new ConflictException(
        `Role ${userRoleDto.roleName} does not exist`,
      );
    // en este punto el role existe y se actualiza al userExists con el rol encontrado
    await userExists.updateOne({ role: roleExists });
    const updatedUser = await this.findUserByUserCode(userRoleDto.userCode);
    return updatedUser.populate({
      path: 'role',
      populate: {
        path: 'permissions',
        model: Permission.name,
      },
    });
  }

  async removeRole(userCode: number) {
    const userExists = await this.findUserByUserCode(userCode);
    if (!userExists)
      throw new ConflictException(`User ${userCode} does not exist`);

    if (!userExists.role)
      throw new ConflictException(`User no tiene un rol para eliminar`);

    // si tiene un rol entonces actualizamos al user con role: null
    await userExists.updateOne({ role: null });
    return this.findUserByUserCode(userCode);
  }

  /**
   * no se lo elimina de db sino que se le actualiza el campo deleted a true al usuario.
   */
  async deleteUser(userCode: number) {
    const userExists = await this.findUserByUserCode(userCode);
    if (!userExists)
      throw new ConflictException(
        `User with userCode: ${userCode} does not exist`,
      );

    if (userExists.deleted)
      throw new ConflictException(
        `User with userCode: ${userCode} already deleted`,
      );

    await userExists.updateOne({ deleted: true });
    return this.findUserByUserCode(userCode);
  }

  async restoreUser(userCode: number) {
    const userExists = await this.findUserByUserCode(userCode);
    if (!userExists)
      throw new ConflictException(
        `User with userCode: ${userCode} does not exist`,
      );
    if (!userExists.deleted)
      throw new ConflictException(
        `User with userCode: ${userCode} is not deleted`,
      );

    await userExists.updateOne({ deleted: false });
    return this.findUserByUserCode(userCode);
  }

  @Logger()
  async countUsersWithRole(roleName: string): Promise<number> {
    roleName = roleName.toUpperCase();
    const res: { count: number }[] =
      await this.usersRepository.getUsersWithRoles(roleName);
    if (res.length) return res[0].count;
    return 0;
  }
}
