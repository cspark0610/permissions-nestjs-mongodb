import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from 'src/modules/users/schemas/user.schema';
import { Permission } from '../permissions/schemas/permission.schema';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  // popular referencias anidadas user -> role -> permission[]
  // path: nombre del campo en el UserSchema
  // model: nombre de la clase asociada, segun como esta registrada en ele modulo
  usersPopulateObj = {
    path: 'role',
    populate: {
      path: 'permissions',
      model: Permission.name,
    },
  };
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }

  async findUserByEmailAndPopulate(email: string) {
    return this.userModel.findOne({ email }).populate(this.usersPopulateObj);
  }

  async findUserByUserCodeAndPopulate(userCode: number) {
    return this.userModel.findOne({ userCode }).populate(this.usersPopulateObj);
  }

  async getUsersWithRolesAndPopulate(
    filterObj: { [key: string]: any } = {},
  ): Promise<User[]> {
    return this.userModel.find(filterObj).populate(this.usersPopulateObj);
  }

  async countDocuments(): Promise<number> {
    return this.userModel.countDocuments();
  }

  async getUsersWithRoles(roleName: string): Promise<{ count: number }[]> {
    // vamos a hacer "leftjoins" del modelo user con el modelo role, operador $lookup
    // { from: <nombre de la colleccion a agregar>,
    // localField: <propiedad del modelo al cual hacemos el aggregate>,
    // foreignField: <nombre del campo que debe coincidir>, as: 'role' }
    return this.userModel.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'roles',
          // "as" es el alias para usar en el $match
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
  }
}
