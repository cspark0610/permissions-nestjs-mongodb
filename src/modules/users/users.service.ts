import {
  Inject,
  Injectable,
  ConflictException,
  forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { UserInterface } from 'src/modules/users/interfaces/user.interface';
import { RolesService } from 'src/modules/roles/roles.service';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { Permission } from 'src/modules/permissions/schemas/permission.schema';
import { UserRoleDto } from 'src/modules/users/dto/user-role.dto';
import { Logger } from 'src/common/decorators/logger.decorator';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL') private userModel: Model<UserInterface>,
    // si quiero inyectar el RolesService debo exportarlo desde el RoleModule, exports: [RolesService]
    @Inject(forwardRef(() => RolesService))
    private rolesService: RolesService,
  ) {}

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async findUserByUserCode(userCode: number) {
    return this.userModel.findOne({ userCode });
  }

  async createUser(userDto: UserDto) {
    const userExists = await this.findUserByEmail(userDto.email);

    if (userExists)
      throw new ConflictException(
        `User with email ${userDto.email} already exists`,
      );
    if (userDto.role) {
      const roleExists = await this.rolesService.findRoleByName(
        userDto.role.name,
      );
      if (!roleExists)
        throw new ConflictException(`Role ${userDto.role} does not exist`);

      userDto.role = roleExists;
    }

    const nUsers: number = await this.userModel.countDocuments();
    // inicialmente 0
    const newUser = new this.userModel({ ...userDto, userCode: nUsers + 1 });
    await newUser.save();
    return newUser;
  }

  async getUsers() {
    // popular referencias anidadas user -> role[] -> permission[]
    // path: nombre del campo en el UserSchema
    // model: nombre de la clase asociada, segun como esta registrada en ele modulo
    const populate = {
      path: 'role',
      populate: {
        path: 'permissions',
        model: Permission.name,
      },
    };
    return this.userModel.find().populate(populate);
  }

  async getUsersDeleted() {
    const populate = {
      path: 'role',
      populate: {
        path: 'permissions',
        model: Permission.name,
      },
    };
    return this.userModel.find({ deleted: true }).populate(populate);
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

  // para usar en RolesService
  @Logger()
  async countUsersWithRole(roleName: string): Promise<number> {
    roleName = roleName.toUpperCase();
    // vamos a hacer "leftjoins" del modelo user con el modelo role, operador $lookup
    // { from: <nombre de la colleccion a agregar>, localField: <propiedad del modelo al cual hacemos el aggregate>,
    // foreignField: <nombre del campo que debe coincidir>, as: 'role' }
    const usersWithRole = await this.userModel.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'roles',
          // el alias as es para usar en el $match
        },
      },
      {
        $match: {
          'roles.name': roleName,
        },
      },
      {
        $count: 'count',
      },
      // CON EL COUNT lo formatea a [ { count: 2 } ]
    ]);
    if (usersWithRole.length) return usersWithRole[0].count;
    return 0;
  }
}
