import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserInterface } from 'src/modules/users/interfaces/user.interface';
import { RolesService } from 'src/modules/roles/roles.service';
import { UserDto } from 'src/modules/users/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL') private userModel: Model<UserInterface>,
    // si quiero inyectar el RolesService debo exportarlo desde el RoleModule, exports: [RolesService]
    private rolesService: RolesService,
  ) {}

  async createUser(userDto: UserDto) {
    const userExists = await this.userModel.findOne({ email: userDto.email });

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
    const newUser = new this.userModel({ ...userDto, userCode: nUsers + 1 });
    await newUser.save();
    return newUser;
  }
}
